// atoms/render/pdf.ts
import { mkdtemp, readFile, rm, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir as tmpdir2 } from "node:os";
import { basename, join as join2 } from "node:path";
import { fileURLToPath } from "node:url";

// atoms/render/chrome.ts
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
function chromePath(env = process.env) {
  return env["CHROME_PATH"] ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
}
function insideRoot(root, requested) {
  const base = resolve(root);
  const p = resolve(join(base, decodeURIComponent(requested.split("?")[0] ?? "")));
  return p === base || p.startsWith(base + sep) ? p : null;
}
function chromeArgs(port, profile, env = process.env) {
  const all = (env["CHROME_ARGS"] ?? "").split(" ").filter(Boolean);
  const headless = all.find((a) => a.startsWith("--headless")) ?? "--headless=new";
  const extra = all.filter((a) => !a.startsWith("--headless") && !a.startsWith("--remote-debugging") && !a.startsWith("--user-data-dir"));
  return [
    headless,
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    ...extra,
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    "about:blank"
  ];
}
function pageCount(pdf) {
  return pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
}
var wait = (ms) => new Promise((r) => setTimeout(r, ms));
var READY = `document.fonts.ready.then(() => document.querySelectorAll("section.page, .page").length)`;
async function startChrome(timeoutMs = 12e4) {
  const profile = mkdtempSync(join(tmpdir(), "render-chrome-"));
  const port = 9300 + Math.floor(Math.random() * 600);
  const chrome = spawn(chromePath(), chromeArgs(port, profile), { stdio: "ignore" });
  const deadline = Date.now() + timeoutMs;
  const checkTime = () => {
    if (Date.now() > deadline) throw new Error("tidsgr\xE4ns");
  };
  const cleanUp = () => {
    chrome.kill("SIGKILL");
    rmSync(profile, { recursive: true, force: true });
  };
  try {
    let wsUrl;
    while (!wsUrl) {
      checkTime();
      try {
        const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        wsUrl = targets.find((m) => m.type === "page")?.webSocketDebuggerUrl;
      } catch {
      }
      if (!wsUrl) await wait(200);
    }
    const ws = new WebSocket(wsUrl);
    await new Promise((ok, fail) => {
      ws.addEventListener("open", () => ok());
      ws.addEventListener("error", () => fail(new Error("kunde inte ansluta till Chrome")));
    });
    let nextId = 0;
    const pending = /* @__PURE__ */ new Map();
    const events = /* @__PURE__ */ new Set();
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(String(e.data));
      if (m.id !== void 0) {
        pending.get(m.id)?.(m);
        pending.delete(m.id);
      } else if (m.method) events.add(m.method);
    });
    const cdp = (method, params = {}) => new Promise((ok, fail) => {
      const id = ++nextId;
      const t = setTimeout(() => {
        pending.delete(id);
        fail(new Error(`tidsgr\xE4ns i ${method}`));
      }, Math.max(1e3, deadline - Date.now()));
      pending.set(id, (m) => {
        clearTimeout(t);
        if (m.error) fail(new Error(`${method}: ${m.error.message}`));
        else ok(m.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
    await cdp("Page.enable");
    let transparent = false;
    const open = async (url) => {
      events.delete("Page.loadEventFired");
      await cdp("Page.navigate", { url: url.href });
      while (!events.has("Page.loadEventFired")) {
        checkTime();
        await wait(100);
      }
      let previous = -1, still = 0;
      while (still < 5) {
        checkTime();
        const reply = await cdp("Runtime.evaluate", { expression: READY, awaitPromise: true, returnByValue: true });
        const n = reply.result.value;
        still = n === previous ? still + 1 : 0;
        previous = n;
        await wait(200);
      }
    };
    const size = async (s) => {
      await cdp("Emulation.setDeviceMetricsOverride", { width: s.width, height: s.height, deviceScaleFactor: 1, mobile: false });
      if (Boolean(s.transparent) !== transparent) {
        transparent = Boolean(s.transparent);
        if (transparent) await cdp("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
        else await cdp("Emulation.setDefaultBackgroundColorOverride");
      }
    };
    const png = async (s) => {
      const { data } = await cdp("Page.captureScreenshot", {
        format: "png",
        clip: { x: 0, y: 0, width: s.width, height: s.height, scale: 1 }
      });
      return Buffer.from(data, "base64");
    };
    return {
      open,
      size,
      png,
      async pdf() {
        const { data } = await cdp("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
        return Buffer.from(data, "base64");
      },
      async screenshot(file, s) {
        await size(s);
        await open(pathToFileURL(file));
        return png(s);
      },
      async evaluate(expression) {
        const r = await cdp(
          "Runtime.evaluate",
          { expression, awaitPromise: true, returnByValue: true }
        );
        if (r.exceptionDetails)
          throw new Error(`sidans skript f\xF6ll: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text ?? "ok\xE4nt fel"}`);
        return r.result.value;
      },
      async close() {
        await cdp("Browser.close").catch(() => {
        });
        ws.close();
        await new Promise((done) => {
          const t = setTimeout(done, 3e3);
          chrome.once("exit", () => {
            clearTimeout(t);
            done();
          });
        });
        cleanUp();
      }
    };
  } catch (e) {
    cleanUp();
    throw e;
  }
}
async function render(r) {
  const page = insideRoot(r.dir, r.file);
  if (!page) throw new Error(`sidan ${r.file} ligger utanf\xF6r ${r.dir}`);
  const session = await startChrome(r.timeoutMs ?? 12e4);
  try {
    const url = pathToFileURL(page);
    if (r.query) url.search = r.query;
    if (r.format === "pdf") {
      await session.open(url);
      writeFileSync(r.out, await session.pdf());
    } else {
      const s = { width: r.width ?? 1080, height: r.height ?? 1350 };
      await session.size(s);
      await session.open(url);
      writeFileSync(r.out, await session.png(s));
    }
  } finally {
    await session.close();
  }
  return resolve(r.out);
}

// atoms/render/pdf.ts
async function renderPdf(katalog, dokument, ut, minSidor, s\u00F6k) {
  await render({ dir: katalog, file: dokument, out: ut, format: "pdf", ...s\u00F6k ? { query: s\u00F6k } : {} });
  const sidor = pageCount(await readFile(ut));
  if (sidor < minSidor) {
    await unlink(ut).catch(() => {
    });
    throw new Error(`renderingen gav ${sidor} sidor, minst ${minSidor} kr\xE4vs \u2014 dokumentets data laddade inte`);
  }
  return sidor;
}
async function sj\u00E4lvtest() {
  const dir = await mkdtemp(join2(tmpdir2(), "render-pdf-"));
  try {
    const sida = (n) => `<section style="page-break-after:always">Sida ${n}</section>`;
    await writeFile(join2(dir, "prov.html"), `<!doctype html><meta charset="utf-8"><body>${sida(1)}${sida(2)}</body>`);
    const ut = join2(dir, "prov.pdf");
    const sidor = await renderPdf(dir, "prov.html", ut, 2);
    console.log(`self-test ok \xB7 ${sidor} sidor`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
async function main(argv) {
  if (argv.includes("--self-test")) return sj\u00E4lvtest();
  const i = argv.indexOf("--min-sidor");
  const minSidor = i >= 0 ? Number(argv[i + 1]) : 1;
  const k = argv.indexOf("--s\xF6k");
  const s\u00F6k = k >= 0 ? argv[k + 1] : void 0;
  const v\u00E4rde = (flagga, j) => flagga >= 0 && j === flagga + 1;
  const [katalog, dokument, ut] = argv.filter((a, j) => !a.startsWith("--") && !v\u00E4rde(i, j) && !v\u00E4rde(k, j));
  if (!katalog || !dokument || !ut) {
    console.error("anv\xE4ndning: pdf.js <katalog> <dokument> <ut.pdf> [--min-sidor N] [--s\xF6k fr\xE5ga] | --self-test");
    process.exit(2);
  }
  const sidor = await renderPdf(katalog, dokument, ut, minSidor, s\u00F6k);
  const { size } = await stat(ut);
  console.log(JSON.stringify({ pdf: ut, sidor, mb: Number((size / 1e6).toFixed(1)), fil: basename(ut) }));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  await main(process.argv.slice(2));
export {
  renderPdf
};
