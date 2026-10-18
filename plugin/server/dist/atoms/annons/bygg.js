var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/opentype.js/dist/opentype.js
var require_opentype = __commonJS({
  "node_modules/opentype.js/dist/opentype.js"(exports, module) {
    var opentype3 = (() => {
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var opentype_exports = {};
      __export(opentype_exports, {
        BoundingBox: () => bbox_default,
        Font: () => font_default,
        Glyph: () => glyph_default,
        Path: () => path_default,
        _parse: () => parse_default,
        load: () => load,
        loadSync: () => loadSync,
        parse: () => parseBuffer
      });
      var TINF_OK = 0;
      var TINF_DATA_ERROR = -3;
      function Tree() {
        this.table = new Uint16Array(16);
        this.trans = new Uint16Array(288);
      }
      function Data(source, dest) {
        this.source = source;
        this.sourceIndex = 0;
        this.tag = 0;
        this.bitcount = 0;
        this.dest = dest;
        this.destLen = 0;
        this.ltree = new Tree();
        this.dtree = new Tree();
      }
      var sltree = new Tree();
      var sdtree = new Tree();
      var length_bits = new Uint8Array(30);
      var length_base = new Uint16Array(30);
      var dist_bits = new Uint8Array(30);
      var dist_base = new Uint16Array(30);
      var clcidx = new Uint8Array([
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
      ]);
      var code_tree = new Tree();
      var lengths = new Uint8Array(288 + 32);
      function tinf_build_bits_base(bits, base, delta, first) {
        var i, sum;
        for (i = 0; i < delta; ++i) bits[i] = 0;
        for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;
        for (sum = first, i = 0; i < 30; ++i) {
          base[i] = sum;
          sum += 1 << bits[i];
        }
      }
      function tinf_build_fixed_trees(lt, dt) {
        var i;
        for (i = 0; i < 7; ++i) lt.table[i] = 0;
        lt.table[7] = 24;
        lt.table[8] = 152;
        lt.table[9] = 112;
        for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
        for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
        for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
        for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;
        for (i = 0; i < 5; ++i) dt.table[i] = 0;
        dt.table[5] = 32;
        for (i = 0; i < 32; ++i) dt.trans[i] = i;
      }
      var offs = new Uint16Array(16);
      function tinf_build_tree(t, lengths2, off, num) {
        var i, sum;
        for (i = 0; i < 16; ++i) t.table[i] = 0;
        for (i = 0; i < num; ++i) t.table[lengths2[off + i]]++;
        t.table[0] = 0;
        for (sum = 0, i = 0; i < 16; ++i) {
          offs[i] = sum;
          sum += t.table[i];
        }
        for (i = 0; i < num; ++i) {
          if (lengths2[off + i]) t.trans[offs[lengths2[off + i]]++] = i;
        }
      }
      function tinf_getbit(d) {
        if (!d.bitcount--) {
          d.tag = d.source[d.sourceIndex++];
          d.bitcount = 7;
        }
        var bit = d.tag & 1;
        d.tag >>>= 1;
        return bit;
      }
      function tinf_read_bits(d, num, base) {
        if (!num)
          return base;
        while (d.bitcount < 24) {
          d.tag |= d.source[d.sourceIndex++] << d.bitcount;
          d.bitcount += 8;
        }
        var val = d.tag & 65535 >>> 16 - num;
        d.tag >>>= num;
        d.bitcount -= num;
        return val + base;
      }
      function tinf_decode_symbol(d, t) {
        while (d.bitcount < 24) {
          d.tag |= d.source[d.sourceIndex++] << d.bitcount;
          d.bitcount += 8;
        }
        var sum = 0, cur = 0, len = 0;
        var tag = d.tag;
        do {
          cur = 2 * cur + (tag & 1);
          tag >>>= 1;
          ++len;
          sum += t.table[len];
          cur -= t.table[len];
        } while (cur >= 0);
        d.tag = tag;
        d.bitcount -= len;
        return t.trans[sum + cur];
      }
      function tinf_decode_trees(d, lt, dt) {
        var hlit, hdist, hclen;
        var i, num, length;
        hlit = tinf_read_bits(d, 5, 257);
        hdist = tinf_read_bits(d, 5, 1);
        hclen = tinf_read_bits(d, 4, 4);
        for (i = 0; i < 19; ++i) lengths[i] = 0;
        for (i = 0; i < hclen; ++i) {
          var clen = tinf_read_bits(d, 3, 0);
          lengths[clcidx[i]] = clen;
        }
        tinf_build_tree(code_tree, lengths, 0, 19);
        for (num = 0; num < hlit + hdist; ) {
          var sym = tinf_decode_symbol(d, code_tree);
          switch (sym) {
            case 16:
              var prev = lengths[num - 1];
              for (length = tinf_read_bits(d, 2, 3); length; --length) {
                lengths[num++] = prev;
              }
              break;
            case 17:
              for (length = tinf_read_bits(d, 3, 3); length; --length) {
                lengths[num++] = 0;
              }
              break;
            case 18:
              for (length = tinf_read_bits(d, 7, 11); length; --length) {
                lengths[num++] = 0;
              }
              break;
            default:
              lengths[num++] = sym;
              break;
          }
        }
        tinf_build_tree(lt, lengths, 0, hlit);
        tinf_build_tree(dt, lengths, hlit, hdist);
      }
      function tinf_inflate_block_data(d, lt, dt) {
        for (; ; ) {
          var sym = tinf_decode_symbol(d, lt);
          if (sym === 256) {
            return TINF_OK;
          }
          if (sym < 256) {
            d.dest[d.destLen++] = sym;
          } else {
            var length, dist, offs2;
            var i;
            sym -= 257;
            length = tinf_read_bits(d, length_bits[sym], length_base[sym]);
            dist = tinf_decode_symbol(d, dt);
            offs2 = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);
            for (i = offs2; i < offs2 + length; ++i) {
              d.dest[d.destLen++] = d.dest[i];
            }
          }
        }
      }
      function tinf_inflate_uncompressed_block(d) {
        var length, invlength;
        var i;
        while (d.bitcount > 8) {
          d.sourceIndex--;
          d.bitcount -= 8;
        }
        length = d.source[d.sourceIndex + 1];
        length = 256 * length + d.source[d.sourceIndex];
        invlength = d.source[d.sourceIndex + 3];
        invlength = 256 * invlength + d.source[d.sourceIndex + 2];
        if (length !== (~invlength & 65535))
          return TINF_DATA_ERROR;
        d.sourceIndex += 4;
        for (i = length; i; --i)
          d.dest[d.destLen++] = d.source[d.sourceIndex++];
        d.bitcount = 0;
        return TINF_OK;
      }
      function tinf_uncompress(source, dest) {
        var d = new Data(source, dest);
        var bfinal, btype, res;
        do {
          bfinal = tinf_getbit(d);
          btype = tinf_read_bits(d, 2, 0);
          switch (btype) {
            case 0:
              res = tinf_inflate_uncompressed_block(d);
              break;
            case 1:
              res = tinf_inflate_block_data(d, sltree, sdtree);
              break;
            case 2:
              tinf_decode_trees(d, d.ltree, d.dtree);
              res = tinf_inflate_block_data(d, d.ltree, d.dtree);
              break;
            default:
              res = TINF_DATA_ERROR;
          }
          if (res !== TINF_OK)
            throw new Error("Data error");
        } while (!bfinal);
        if (d.destLen < d.dest.length) {
          if (typeof d.dest.slice === "function")
            return d.dest.slice(0, d.destLen);
          else
            return d.dest.subarray(0, d.destLen);
        }
        return d.dest;
      }
      tinf_build_fixed_trees(sltree, sdtree);
      tinf_build_bits_base(length_bits, length_base, 4, 3);
      tinf_build_bits_base(dist_bits, dist_base, 2, 1);
      length_bits[28] = 0;
      length_base[28] = 258;
      function derive(v0, v1, v2, v3, t) {
        return Math.pow(1 - t, 3) * v0 + 3 * Math.pow(1 - t, 2) * t * v1 + 3 * (1 - t) * Math.pow(t, 2) * v2 + Math.pow(t, 3) * v3;
      }
      function BoundingBox() {
        this.x1 = Number.NaN;
        this.y1 = Number.NaN;
        this.x2 = Number.NaN;
        this.y2 = Number.NaN;
      }
      BoundingBox.prototype.isEmpty = function() {
        return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
      };
      BoundingBox.prototype.addPoint = function(x, y) {
        if (typeof x === "number") {
          if (isNaN(this.x1) || isNaN(this.x2)) {
            this.x1 = x;
            this.x2 = x;
          }
          if (x < this.x1) {
            this.x1 = x;
          }
          if (x > this.x2) {
            this.x2 = x;
          }
        }
        if (typeof y === "number") {
          if (isNaN(this.y1) || isNaN(this.y2)) {
            this.y1 = y;
            this.y2 = y;
          }
          if (y < this.y1) {
            this.y1 = y;
          }
          if (y > this.y2) {
            this.y2 = y;
          }
        }
      };
      BoundingBox.prototype.addX = function(x) {
        this.addPoint(x, null);
      };
      BoundingBox.prototype.addY = function(y) {
        this.addPoint(null, y);
      };
      BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
        const p0 = [x0, y0];
        const p1 = [x1, y1];
        const p2 = [x2, y2];
        const p3 = [x, y];
        this.addPoint(x0, y0);
        this.addPoint(x, y);
        for (let i = 0; i <= 1; i++) {
          const b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
          const a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
          const c = 3 * p1[i] - 3 * p0[i];
          if (a === 0) {
            if (b === 0) continue;
            const t = -c / b;
            if (0 < t && t < 1) {
              if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t));
              if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t));
            }
            continue;
          }
          const b2ac = Math.pow(b, 2) - 4 * c * a;
          if (b2ac < 0) continue;
          const t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
          if (0 < t1 && t1 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1));
          }
          const t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
          if (0 < t2 && t2 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2));
          }
        }
      };
      BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
        const cp1x = x0 + 2 / 3 * (x1 - x0);
        const cp1y = y0 + 2 / 3 * (y1 - y0);
        const cp2x = cp1x + 1 / 3 * (x - x0);
        const cp2y = cp1y + 1 / 3 * (y - y0);
        this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
      };
      var bbox_default = BoundingBox;
      function Path2() {
        this.commands = [];
        this.fill = "black";
        this.stroke = null;
        this.strokeWidth = 1;
      }
      var decimalRoundingCache = {};
      function roundDecimal(float, places) {
        const integerPart = Math.floor(float);
        const decimalPart = float - integerPart;
        if (!decimalRoundingCache[places]) {
          decimalRoundingCache[places] = {};
        }
        if (decimalRoundingCache[places][decimalPart] !== void 0) {
          const roundedDecimalPart2 = decimalRoundingCache[places][decimalPart];
          return integerPart + roundedDecimalPart2;
        }
        const roundedDecimalPart = +(Math.round(decimalPart + "e+" + places) + "e-" + places);
        decimalRoundingCache[places][decimalPart] = roundedDecimalPart;
        return integerPart + roundedDecimalPart;
      }
      function optimizeCommands(commands) {
        let subpaths = [[]];
        let startX = 0, startY = 0;
        for (let i = 0; i < commands.length; i += 1) {
          const subpath = subpaths[subpaths.length - 1];
          const cmd = commands[i];
          const firstCommand = subpath[0];
          const secondCommand = subpath[1];
          const previousCommand = subpath[subpath.length - 1];
          const nextCommand = commands[i + 1];
          subpath.push(cmd);
          if (cmd.type === "M") {
            startX = cmd.x;
            startY = cmd.y;
          } else if (cmd.type === "L" && (!nextCommand || nextCommand.type === "Z")) {
            if (!(Math.abs(cmd.x - startX) > 1 || Math.abs(cmd.y - startY) > 1)) {
              subpath.pop();
            }
          } else if (cmd.type === "L" && previousCommand && previousCommand.x === cmd.x && previousCommand.y === cmd.y) {
            subpath.pop();
          } else if (cmd.type === "Z") {
            if (firstCommand && secondCommand && previousCommand && firstCommand.type === "M" && secondCommand.type === "L" && previousCommand.type === "L" && previousCommand.x === firstCommand.x && previousCommand.y === firstCommand.y) {
              subpath.shift();
              subpath[0].type = "M";
            }
            if (i + 1 < commands.length) {
              subpaths.push([]);
            }
          }
        }
        commands = [].concat.apply([], subpaths);
        return commands;
      }
      function createSVGParsingOptions(options) {
        const defaultOptions = {
          decimalPlaces: 2,
          optimize: true,
          flipY: true,
          flipYBase: void 0,
          scale: 1,
          x: 0,
          y: 0
        };
        const newOptions = Object.assign({}, defaultOptions, options);
        return newOptions;
      }
      function createSVGOutputOptions(options) {
        if (parseInt(options) === options) {
          options = { decimalPlaces: options, flipY: false };
        }
        const defaultOptions = {
          decimalPlaces: 2,
          optimize: true,
          flipY: true,
          flipYBase: void 0
        };
        const newOptions = Object.assign({}, defaultOptions, options);
        return newOptions;
      }
      Path2.prototype.fromSVG = function(pathData, options = {}) {
        if (typeof SVGPathElement !== "undefined" && pathData instanceof SVGPathElement) {
          pathData = pathData.getAttribute("d");
        }
        options = createSVGParsingOptions(options);
        this.commands = [];
        const number = "0123456789";
        const supportedCommands = "MmLlQqCcZzHhVv";
        const unsupportedCommands = "SsTtAa";
        const sign = "-+";
        let command = {};
        let buffer = [""];
        let isUnexpected = false;
        function parseBuffer2(buffer2) {
          return buffer2.filter((b) => b.length).map((b) => {
            let float = parseFloat(b);
            if (options.decimalPlaces || options.decimalPlaces === 0) {
              float = roundDecimal(float, options.decimalPlaces);
            }
            return float;
          });
        }
        function makeRelative(buffer2) {
          if (!this.commands.length) {
            return buffer2;
          }
          const lastCommand = this.commands[this.commands.length - 1];
          for (let i = 0; i < buffer2.length; i++) {
            buffer2[i] += lastCommand[i & 1 ? "y" : "x"];
          }
          return buffer2;
        }
        function applyCommand() {
          if (command.type === void 0) {
            return;
          }
          const commandType = command.type.toUpperCase();
          const relative = commandType !== "Z" && command.type.toUpperCase() !== command.type;
          let parsedBuffer = parseBuffer2(buffer);
          buffer = [""];
          if (!parsedBuffer.length && commandType !== "Z") {
            return;
          }
          if (relative && commandType !== "H" && commandType !== "V") {
            parsedBuffer = makeRelative.apply(this, [parsedBuffer]);
          }
          const currentX = this.commands.length ? this.commands[this.commands.length - 1].x || 0 : 0;
          const currentY = this.commands.length ? this.commands[this.commands.length - 1].y || 0 : 0;
          switch (commandType) {
            case "M":
              this.moveTo(...parsedBuffer);
              break;
            case "L":
              this.lineTo(...parsedBuffer);
              break;
            case "V":
              for (let i = 0; i < parsedBuffer.length; i++) {
                let offset = 0;
                if (relative) {
                  offset = this.commands.length ? this.commands[this.commands.length - 1].y || 0 : 0;
                }
                this.lineTo(currentX, parsedBuffer[i] + offset);
              }
              break;
            case "H":
              for (let i = 0; i < parsedBuffer.length; i++) {
                let offset = 0;
                if (relative) {
                  offset = this.commands.length ? this.commands[this.commands.length - 1].x || 0 : 0;
                }
                this.lineTo(parsedBuffer[i] + offset, currentY);
              }
              break;
            case "C":
              this.bezierCurveTo(...parsedBuffer);
              break;
            case "Q":
              this.quadraticCurveTo(...parsedBuffer);
              break;
            case "Z":
              if (this.commands.length < 1 || this.commands[this.commands.length - 1].type !== "Z") {
                this.close();
              }
              break;
          }
          if (this.commands.length) {
            for (const prop in this.commands[this.commands.length - 1]) {
              if (this.commands[this.commands.length - 1][prop] === void 0) {
                this.commands[this.commands.length - 1][prop] = 0;
              }
            }
          }
        }
        for (let i = 0; i < pathData.length; i++) {
          const token = pathData.charAt(i);
          const lastBuffer = buffer[buffer.length - 1];
          if (number.indexOf(token) > -1) {
            buffer[buffer.length - 1] += token;
          } else if (sign.indexOf(token) > -1) {
            if (!command.type && !this.commands.length) {
              command.type = "L";
            }
            if (token === "-") {
              if (!command.type || lastBuffer.indexOf("-") > 0) {
                isUnexpected = true;
              } else if (lastBuffer.length) {
                buffer.push("-");
              } else {
                buffer[buffer.length - 1] = token;
              }
            } else {
              if (!command.type || lastBuffer.length > 0) {
                isUnexpected = true;
              } else {
                continue;
              }
            }
          } else if (supportedCommands.indexOf(token) > -1) {
            if (command.type) {
              applyCommand.apply(this);
              command = { type: token };
            } else {
              command.type = token;
            }
          } else if (unsupportedCommands.indexOf(token) > -1) {
            throw new Error("Unsupported path command: " + token + ". Currently supported commands are " + supportedCommands.split("").join(", ") + ".");
          } else if (" ,	\n\r\f\v".indexOf(token) > -1) {
            buffer.push("");
          } else if (token === ".") {
            if (!command.type || lastBuffer.indexOf(token) > -1) {
              isUnexpected = true;
            } else {
              buffer[buffer.length - 1] += token;
            }
          } else {
            isUnexpected = true;
          }
          if (isUnexpected) {
            throw new Error("Unexpected character: " + token + " at offset " + i);
          }
        }
        applyCommand.apply(this);
        if (options.optimize) {
          this.commands = optimizeCommands(this.commands);
        }
        const flipY = options.flipY;
        let flipYBase = options.flipYBase;
        if (flipY === true && options.flipYBase === void 0) {
          const boundingBox = this.getBoundingBox();
          flipYBase = boundingBox.y1 + boundingBox.y2;
        }
        for (const i in this.commands) {
          const cmd = this.commands[i];
          for (const prop in cmd) {
            if (["x", "x1", "x2"].includes(prop)) {
              this.commands[i][prop] = options.x + cmd[prop] * options.scale;
            } else if (["y", "y1", "y2"].includes(prop)) {
              this.commands[i][prop] = options.y + (flipY ? flipYBase - cmd[prop] : cmd[prop]) * options.scale;
            }
          }
        }
        return this;
      };
      Path2.fromSVG = function(path, options) {
        const newPath = new Path2();
        return newPath.fromSVG(path, options);
      };
      Path2.prototype.moveTo = function(x, y) {
        this.commands.push({
          type: "M",
          x,
          y
        });
      };
      Path2.prototype.lineTo = function(x, y) {
        this.commands.push({
          type: "L",
          x,
          y
        });
      };
      Path2.prototype.curveTo = Path2.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
        this.commands.push({
          type: "C",
          x1,
          y1,
          x2,
          y2,
          x,
          y
        });
      };
      Path2.prototype.quadTo = Path2.prototype.quadraticCurveTo = function(x1, y1, x, y) {
        this.commands.push({
          type: "Q",
          x1,
          y1,
          x,
          y
        });
      };
      Path2.prototype.close = Path2.prototype.closePath = function() {
        this.commands.push({
          type: "Z"
        });
      };
      Path2.prototype.extend = function(pathOrCommands) {
        if (pathOrCommands.commands) {
          pathOrCommands = pathOrCommands.commands;
        } else if (pathOrCommands instanceof bbox_default) {
          const box = pathOrCommands;
          this.moveTo(box.x1, box.y1);
          this.lineTo(box.x2, box.y1);
          this.lineTo(box.x2, box.y2);
          this.lineTo(box.x1, box.y2);
          this.close();
          return;
        }
        Array.prototype.push.apply(this.commands, pathOrCommands);
      };
      Path2.prototype.getBoundingBox = function() {
        const box = new bbox_default();
        let startX = 0;
        let startY = 0;
        let prevX = 0;
        let prevY = 0;
        for (let i = 0; i < this.commands.length; i++) {
          const cmd = this.commands[i];
          switch (cmd.type) {
            case "M":
              box.addPoint(cmd.x, cmd.y);
              startX = prevX = cmd.x;
              startY = prevY = cmd.y;
              break;
            case "L":
              box.addPoint(cmd.x, cmd.y);
              prevX = cmd.x;
              prevY = cmd.y;
              break;
            case "Q":
              box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
              prevX = cmd.x;
              prevY = cmd.y;
              break;
            case "C":
              box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
              prevX = cmd.x;
              prevY = cmd.y;
              break;
            case "Z":
              prevX = startX;
              prevY = startY;
              break;
            default:
              throw new Error("Unexpected path command " + cmd.type);
          }
        }
        if (box.isEmpty()) {
          box.addPoint(0, 0);
        }
        return box;
      };
      Path2.prototype.draw = function(ctx) {
        const layers = this._layers;
        if (layers && layers.length) {
          for (let l = 0; l < layers.length; l++) {
            this.draw.call(layers[l], ctx);
          }
          return;
        }
        const image = this._image;
        if (image) {
          ctx.drawImage(image.image, image.x, image.y, image.width, image.height);
          return;
        }
        ctx.beginPath();
        for (let i = 0; i < this.commands.length; i += 1) {
          const cmd = this.commands[i];
          if (cmd.type === "M") {
            ctx.moveTo(cmd.x, cmd.y);
          } else if (cmd.type === "L") {
            ctx.lineTo(cmd.x, cmd.y);
          } else if (cmd.type === "C") {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          } else if (cmd.type === "Q") {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
          } else if (cmd.type === "Z" && this.stroke && this.strokeWidth) {
            ctx.closePath();
          }
        }
        if (this.fill) {
          ctx.fillStyle = this.fill;
          ctx.fill();
        }
        if (this.stroke) {
          ctx.strokeStyle = this.stroke;
          ctx.lineWidth = this.strokeWidth;
          ctx.stroke();
        }
      };
      Path2.prototype.toPathData = function(options) {
        options = createSVGOutputOptions(options);
        function floatToString(v) {
          const rounded = roundDecimal(v, options.decimalPlaces);
          if (Math.round(v) === rounded) {
            return "" + rounded;
          } else {
            return rounded.toFixed(options.decimalPlaces);
          }
        }
        function packValues() {
          let s = "";
          for (let i = 0; i < arguments.length; i += 1) {
            const v = arguments[i];
            if (v >= 0 && i > 0) {
              s += " ";
            }
            s += floatToString(v);
          }
          return s;
        }
        let commandsCopy = this.commands;
        if (options.optimize) {
          commandsCopy = JSON.parse(JSON.stringify(this.commands));
          commandsCopy = optimizeCommands(commandsCopy);
        }
        const flipY = options.flipY;
        let flipYBase = options.flipYBase;
        if (flipY === true && flipYBase === void 0) {
          const tempPath = new Path2();
          tempPath.extend(commandsCopy);
          const boundingBox = tempPath.getBoundingBox();
          flipYBase = boundingBox.y1 + boundingBox.y2;
        }
        let d = "";
        for (let i = 0; i < commandsCopy.length; i += 1) {
          const cmd = commandsCopy[i];
          if (cmd.type === "M") {
            d += "M" + packValues(
              cmd.x,
              flipY ? flipYBase - cmd.y : cmd.y
            );
          } else if (cmd.type === "L") {
            d += "L" + packValues(
              cmd.x,
              flipY ? flipYBase - cmd.y : cmd.y
            );
          } else if (cmd.type === "C") {
            d += "C" + packValues(
              cmd.x1,
              flipY ? flipYBase - cmd.y1 : cmd.y1,
              cmd.x2,
              flipY ? flipYBase - cmd.y2 : cmd.y2,
              cmd.x,
              flipY ? flipYBase - cmd.y : cmd.y
            );
          } else if (cmd.type === "Q") {
            d += "Q" + packValues(
              cmd.x1,
              flipY ? flipYBase - cmd.y1 : cmd.y1,
              cmd.x,
              flipY ? flipYBase - cmd.y : cmd.y
            );
          } else if (cmd.type === "Z") {
            d += "Z";
          }
        }
        return d;
      };
      Path2.prototype.toSVG = function(options, pathData) {
        if (this._layers && this._layers.length) {
          console.warn("toSVG() does not support colr font layers yet");
        }
        if (this._image) {
          console.warn("toSVG() does not support SVG glyphs yet");
        }
        if (!pathData) {
          pathData = this.toPathData(options);
        }
        let svg = '<path d="';
        svg += pathData;
        svg += '"';
        if (this.fill !== void 0 && this.fill !== "black") {
          if (this.fill === null) {
            svg += ' fill="none"';
          } else {
            svg += ' fill="' + this.fill + '"';
          }
        }
        if (this.stroke) {
          svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
        }
        svg += "/>";
        return svg;
      };
      Path2.prototype.toDOMElement = function(options, pathData) {
        if (this._layers && this._layers.length) {
          console.warn("toDOMElement() does not support colr font layers yet");
        }
        if (!pathData) {
          pathData = this.toPathData(options);
        }
        const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newPath.setAttribute("d", pathData);
        if (this.fill !== void 0 && this.fill !== "black") {
          if (this.fill === null) {
            newPath.setAttribute("fill", "none");
          } else {
            newPath.setAttribute("fill", this.fill);
          }
        }
        if (this.stroke) {
          newPath.setAttribute("stroke", this.stroke);
          newPath.setAttribute("stroke-width", this.strokeWidth);
        }
        return newPath;
      };
      var path_default = Path2;
      function fail(message) {
        throw new Error(message);
      }
      function argument(predicate, message) {
        if (!predicate) {
          fail(message);
        }
      }
      var check_default = { fail, argument, assert: argument };
      var LIMIT16 = 32768;
      var LIMIT32 = 2147483648;
      var MIN_16_16 = -(1 << 15);
      var MAX_16_16 = (1 << 15) - 1 + 1 / (1 << 16);
      var decode = {};
      var encode = {};
      var sizeOf = {};
      function constant(v) {
        return function() {
          return v;
        };
      }
      encode.BYTE = function(v) {
        check_default.argument(v >= 0 && v <= 255, "Byte value should be between 0 and 255.");
        return [v];
      };
      sizeOf.BYTE = constant(1);
      encode.CHAR = function(v) {
        return [v.charCodeAt(0)];
      };
      sizeOf.CHAR = constant(1);
      encode.CHARARRAY = function(v) {
        if (v === null || typeof v === "undefined") {
          v = "";
          console.warn("CHARARRAY with undefined or null value encountered and treated as an empty string. This is probably caused by a missing glyph name.");
        }
        const b = [];
        for (let i = 0; i < v.length; i += 1) {
          b[i] = v.charCodeAt(i);
        }
        return b;
      };
      sizeOf.CHARARRAY = function(v) {
        if (typeof v === "undefined") {
          return 0;
        }
        return v.length;
      };
      encode.USHORT = function(v) {
        return [v >> 8 & 255, v & 255];
      };
      sizeOf.USHORT = constant(2);
      encode.SHORT = function(v) {
        if (v >= LIMIT16) {
          v = -(2 * LIMIT16 - v);
        }
        return [v >> 8 & 255, v & 255];
      };
      sizeOf.SHORT = constant(2);
      encode.UINT24 = function(v) {
        return [v >> 16 & 255, v >> 8 & 255, v & 255];
      };
      sizeOf.UINT24 = constant(3);
      encode.ULONG = function(v) {
        return [v >> 24 & 255, v >> 16 & 255, v >> 8 & 255, v & 255];
      };
      sizeOf.ULONG = constant(4);
      encode.LONG = function(v) {
        if (v >= LIMIT32) {
          v = -(2 * LIMIT32 - v);
        }
        return [v >> 24 & 255, v >> 16 & 255, v >> 8 & 255, v & 255];
      };
      sizeOf.LONG = constant(4);
      encode.FLOAT = function(v) {
        if (v > MAX_16_16 || v < MIN_16_16) {
          throw new Error(`Value ${v} is outside the range of representable values in 16.16 format`);
        }
        const fixedValue = Math.round(v * (1 << 16)) << 0;
        return encode.ULONG(fixedValue);
      };
      sizeOf.FLOAT = sizeOf.ULONG;
      encode.FIXED = encode.ULONG;
      sizeOf.FIXED = sizeOf.ULONG;
      encode.FWORD = encode.SHORT;
      sizeOf.FWORD = sizeOf.SHORT;
      encode.UFWORD = encode.USHORT;
      sizeOf.UFWORD = sizeOf.USHORT;
      encode.F2DOT14 = function(v) {
        return encode.USHORT(v * 16384);
      };
      sizeOf.F2DOT14 = sizeOf.USHORT;
      encode.LONGDATETIME = function(v) {
        return [0, 0, 0, 0, v >> 24 & 255, v >> 16 & 255, v >> 8 & 255, v & 255];
      };
      sizeOf.LONGDATETIME = constant(8);
      encode.TAG = function(v) {
        check_default.argument(v.length === 4, "Tag should be exactly 4 ASCII characters.");
        return [
          v.charCodeAt(0),
          v.charCodeAt(1),
          v.charCodeAt(2),
          v.charCodeAt(3)
        ];
      };
      sizeOf.TAG = constant(4);
      encode.Card8 = encode.BYTE;
      sizeOf.Card8 = sizeOf.BYTE;
      encode.Card16 = encode.USHORT;
      sizeOf.Card16 = sizeOf.USHORT;
      encode.OffSize = encode.BYTE;
      sizeOf.OffSize = sizeOf.BYTE;
      encode.SID = encode.USHORT;
      sizeOf.SID = sizeOf.USHORT;
      encode.NUMBER = function(v) {
        if (v >= -107 && v <= 107) {
          return [v + 139];
        } else if (v >= 108 && v <= 1131) {
          v = v - 108;
          return [(v >> 8) + 247, v & 255];
        } else if (v >= -1131 && v <= -108) {
          v = -v - 108;
          return [(v >> 8) + 251, v & 255];
        } else if (v >= -32768 && v <= 32767) {
          return encode.NUMBER16(v);
        } else {
          return encode.NUMBER32(v);
        }
      };
      sizeOf.NUMBER = function(v) {
        return encode.NUMBER(v).length;
      };
      encode.NUMBER16 = function(v) {
        return [28, v >> 8 & 255, v & 255];
      };
      sizeOf.NUMBER16 = constant(3);
      encode.NUMBER32 = function(v) {
        return [29, v >> 24 & 255, v >> 16 & 255, v >> 8 & 255, v & 255];
      };
      sizeOf.NUMBER32 = constant(5);
      encode.REAL = function(v) {
        let value = v.toString();
        const m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
        if (m) {
          const epsilon = parseFloat("1e" + ((m[2] ? +m[2] : 0) + m[1].length));
          value = (Math.round(v * epsilon) / epsilon).toString();
        }
        let nibbles = "";
        for (let i = 0, ii = value.length; i < ii; i += 1) {
          const c = value[i];
          if (c === "e") {
            nibbles += value[++i] === "-" ? "c" : "b";
          } else if (c === ".") {
            nibbles += "a";
          } else if (c === "-") {
            nibbles += "e";
          } else {
            nibbles += c;
          }
        }
        nibbles += nibbles.length & 1 ? "f" : "ff";
        const out = [30];
        for (let i = 0, ii = nibbles.length; i < ii; i += 2) {
          out.push(parseInt(nibbles.substr(i, 2), 16));
        }
        return out;
      };
      sizeOf.REAL = function(v) {
        return encode.REAL(v).length;
      };
      encode.NAME = encode.CHARARRAY;
      sizeOf.NAME = sizeOf.CHARARRAY;
      encode.STRING = encode.CHARARRAY;
      sizeOf.STRING = sizeOf.CHARARRAY;
      decode.UTF8 = function(data, offset, numBytes) {
        const codePoints = [];
        const numChars = numBytes;
        for (let j = 0; j < numChars; j++, offset += 1) {
          codePoints[j] = data.getUint8(offset);
        }
        return String.fromCharCode.apply(null, codePoints);
      };
      decode.UTF16 = function(data, offset, numBytes) {
        const codePoints = [];
        const numChars = numBytes / 2;
        for (let j = 0; j < numChars; j++, offset += 2) {
          codePoints[j] = data.getUint16(offset);
        }
        return String.fromCharCode.apply(null, codePoints);
      };
      encode.UTF16 = function(v) {
        const b = [];
        for (let i = 0; i < v.length; i += 1) {
          const codepoint = v.charCodeAt(i);
          b[b.length] = codepoint >> 8 & 255;
          b[b.length] = codepoint & 255;
        }
        return b;
      };
      sizeOf.UTF16 = function(v) {
        return v.length * 2;
      };
      var eightBitMacEncodings = {
        "x-mac-croatian": (
          // Python: 'mac_croatian'
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\u0160\u2122\xB4\xA8\u2260\u017D\xD8\u221E\xB1\u2264\u2265\u2206\xB5\u2202\u2211\u220F\u0161\u222B\xAA\xBA\u03A9\u017E\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u0106\xAB\u010C\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uF8FF\xA9\u2044\u20AC\u2039\u203A\xC6\xBB\u2013\xB7\u201A\u201E\u2030\xC2\u0107\xC1\u010D\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u0111\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u03C0\xCB\u02DA\xB8\xCA\xE6\u02C7"
        ),
        "x-mac-cyrillic": (
          // Python: 'mac_cyrillic'
          "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u2020\xB0\u0490\xA3\xA7\u2022\xB6\u0406\xAE\xA9\u2122\u0402\u0452\u2260\u0403\u0453\u221E\xB1\u2264\u2265\u0456\xB5\u0491\u0408\u0404\u0454\u0407\u0457\u0409\u0459\u040A\u045A\u0458\u0405\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\u040B\u045B\u040C\u045C\u0455\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201E\u040E\u045E\u040F\u045F\u2116\u0401\u0451\u044F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E"
        ),
        "x-mac-gaelic": (
          // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u1E02\xB1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xE6\xF8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xFF\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xB7\u1EF2\u1EF3\u204A\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u2663\xD2\xDA\xDB\xD9\u0131\xDD\xFD\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83"
        ),
        "x-mac-greek": (
          // Python: 'mac_greek'
          "\xC4\xB9\xB2\xC9\xB3\xD6\xDC\u0385\xE0\xE2\xE4\u0384\xA8\xE7\xE9\xE8\xEA\xEB\xA3\u2122\xEE\xEF\u2022\xBD\u2030\xF4\xF6\xA6\u20AC\xF9\xFB\xFC\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xDF\xAE\xA9\u03A3\u03AA\xA7\u2260\xB0\xB7\u0391\xB1\u2264\u2265\xA5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xAC\u039F\u03A1\u2248\u03A4\xAB\xBB\u2026\xA0\u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xF7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xAD"
        ),
        "x-mac-icelandic": (
          // Python: 'mac_iceland'
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\xDD\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\xD0\xF0\xDE\xFE\xFD\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
        ),
        "x-mac-inuit": (
          // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
          "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xB0\u14A1\u14A5\u14A6\u2022\xB6\u14A7\xAE\xA9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026\xA0\u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142"
        ),
        "x-mac-ce": (
          // Python: 'mac_latin2'
          "\xC4\u0100\u0101\xC9\u0104\xD6\xDC\xE1\u0105\u010C\xE4\u010D\u0106\u0107\xE9\u0179\u017A\u010E\xED\u010F\u0112\u0113\u0116\xF3\u0117\xF4\xF6\xF5\xFA\u011A\u011B\xFC\u2020\xB0\u0118\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\u0119\xA8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xAC\u221A\u0144\u0147\u2206\xAB\xBB\u2026\xA0\u0148\u0150\xD5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xC1\u0164\u0165\xCD\u017D\u017E\u016A\xD3\xD4\u016B\u016E\xDA\u016F\u0170\u0171\u0172\u0173\xDD\xFD\u0137\u017B\u0141\u017C\u0122\u02C7"
        ),
        macintosh: (
          // Python: 'mac_roman'
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\uFB01\uFB02\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
        ),
        "x-mac-romanian": (
          // Python: 'mac_romanian'
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\u0102\u0218\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\u0103\u0219\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
        ),
        "x-mac-turkish": (
          // Python: 'mac_turkish'
          "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\uF8A0\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
        )
      };
      decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
        const table = eightBitMacEncodings[encoding];
        if (table === void 0) {
          return void 0;
        }
        let result = "";
        for (let i = 0; i < dataLength; i++) {
          const c = dataView.getUint8(offset + i);
          if (c <= 127) {
            result += String.fromCharCode(c);
          } else {
            result += table[c & 127];
          }
        }
        return result;
      };
      var macEncodingTableCache = typeof WeakMap === "function" && /* @__PURE__ */ new WeakMap();
      var macEncodingCacheKeys;
      var getMacEncodingTable = function(encoding) {
        if (!macEncodingCacheKeys) {
          macEncodingCacheKeys = {};
          for (let e in eightBitMacEncodings) {
            macEncodingCacheKeys[e] = new String(e);
          }
        }
        const cacheKey = macEncodingCacheKeys[encoding];
        if (cacheKey === void 0) {
          return void 0;
        }
        if (macEncodingTableCache) {
          const cachedTable = macEncodingTableCache.get(cacheKey);
          if (cachedTable !== void 0) {
            return cachedTable;
          }
        }
        const decodingTable = eightBitMacEncodings[encoding];
        if (decodingTable === void 0) {
          return void 0;
        }
        const encodingTable = {};
        for (let i = 0; i < decodingTable.length; i++) {
          encodingTable[decodingTable.charCodeAt(i)] = i + 128;
        }
        if (macEncodingTableCache) {
          macEncodingTableCache.set(cacheKey, encodingTable);
        }
        return encodingTable;
      };
      encode.MACSTRING = function(str, encoding) {
        const table = getMacEncodingTable(encoding);
        if (table === void 0) {
          return void 0;
        }
        const result = [];
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c >= 128) {
            c = table[c];
            if (c === void 0) {
              return void 0;
            }
          }
          result[i] = c;
        }
        return result;
      };
      sizeOf.MACSTRING = function(str, encoding) {
        const b = encode.MACSTRING(str, encoding);
        if (b !== void 0) {
          return b.length;
        } else {
          return 0;
        }
      };
      function isByteEncodable(value) {
        return value >= -128 && value <= 127;
      }
      function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
        let runLength = 0;
        const numDeltas = deltas.length;
        while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
          ++pos;
          ++runLength;
        }
        result.push(128 | runLength - 1);
        return pos;
      }
      function encodeVarDeltaRunAsBytes(deltas, offset, result) {
        let runLength = 0;
        const numDeltas = deltas.length;
        let pos = offset;
        while (pos < numDeltas && runLength < 64) {
          const value = deltas[pos];
          if (!isByteEncodable(value)) {
            break;
          }
          if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
            break;
          }
          ++pos;
          ++runLength;
        }
        result.push(runLength - 1);
        for (let i = offset; i < pos; ++i) {
          result.push(deltas[i] + 256 & 255);
        }
        return pos;
      }
      function encodeVarDeltaRunAsWords(deltas, offset, result) {
        let runLength = 0;
        const numDeltas = deltas.length;
        let pos = offset;
        while (pos < numDeltas && runLength < 64) {
          const value = deltas[pos];
          if (value === 0) {
            break;
          }
          if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
            break;
          }
          ++pos;
          ++runLength;
        }
        result.push(64 | runLength - 1);
        for (let i = offset; i < pos; ++i) {
          const val = deltas[i];
          result.push(val + 65536 >> 8 & 255, val + 256 & 255);
        }
        return pos;
      }
      encode.VARDELTAS = function(deltas) {
        let pos = 0;
        const result = [];
        while (pos < deltas.length) {
          const value = deltas[pos];
          if (value === 0) {
            pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
          } else if (value >= -128 && value <= 127) {
            pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
          } else {
            pos = encodeVarDeltaRunAsWords(deltas, pos, result);
          }
        }
        return result;
      };
      encode.INDEX = function(l) {
        let offset = 1;
        const offsets = [offset];
        const data = [];
        for (let i = 0; i < l.length; i += 1) {
          const v = encode.OBJECT(l[i]);
          Array.prototype.push.apply(data, v);
          offset += v.length;
          offsets.push(offset);
        }
        if (data.length === 0) {
          return [0, 0];
        }
        const encodedOffsets = [];
        const offSize = 1 + Math.floor(Math.log(offset) / Math.log(2)) / 8 | 0;
        const offsetEncoder = [void 0, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
        for (let i = 0; i < offsets.length; i += 1) {
          const encodedOffset = offsetEncoder(offsets[i]);
          Array.prototype.push.apply(encodedOffsets, encodedOffset);
        }
        return Array.prototype.concat(
          encode.Card16(l.length),
          encode.OffSize(offSize),
          encodedOffsets,
          data
        );
      };
      sizeOf.INDEX = function(v) {
        return encode.INDEX(v).length;
      };
      encode.DICT = function(m) {
        let d = [];
        const keys = Object.keys(m);
        const length = keys.length;
        for (let i = 0; i < length; i += 1) {
          const k = parseInt(keys[i], 0);
          const v = m[k];
          const enc1 = encode.OPERAND(v.value, v.type);
          const enc2 = encode.OPERATOR(k);
          for (let j = 0; j < enc1.length; j++) {
            d.push(enc1[j]);
          }
          for (let j = 0; j < enc2.length; j++) {
            d.push(enc2[j]);
          }
        }
        return d;
      };
      sizeOf.DICT = function(m) {
        return encode.DICT(m).length;
      };
      encode.OPERATOR = function(v) {
        if (v < 1200) {
          return [v];
        } else {
          return [12, v - 1200];
        }
      };
      encode.OPERAND = function(v, type) {
        let d = [];
        if (Array.isArray(type)) {
          for (let i = 0; i < type.length; i += 1) {
            check_default.argument(v.length === type.length, "Not enough arguments given for type" + type);
            const enc1 = encode.OPERAND(v[i], type[i]);
            for (let j = 0; j < enc1.length; j++) {
              d.push(enc1[j]);
            }
          }
        } else {
          if (type === "SID") {
            const enc1 = encode.NUMBER(v);
            for (let j = 0; j < enc1.length; j++) {
              d.push(enc1[j]);
            }
          } else if (type === "offset") {
            const enc1 = encode.NUMBER32(v);
            for (let j = 0; j < enc1.length; j++) {
              d.push(enc1[j]);
            }
          } else if (type === "number") {
            const enc1 = encode.NUMBER(v);
            for (let j = 0; j < enc1.length; j++) {
              d.push(enc1[j]);
            }
          } else if (type === "real") {
            const enc1 = encode.REAL(v);
            for (let j = 0; j < enc1.length; j++) {
              d.push(enc1[j]);
            }
          } else {
            throw new Error("Unknown operand type " + type);
          }
        }
        return d;
      };
      encode.OP = encode.BYTE;
      sizeOf.OP = sizeOf.BYTE;
      var wmm = typeof WeakMap === "function" && /* @__PURE__ */ new WeakMap();
      encode.CHARSTRING = function(ops) {
        if (wmm) {
          const cachedValue = wmm.get(ops);
          if (cachedValue !== void 0) {
            return cachedValue;
          }
        }
        let d = [];
        const length = ops.length;
        for (let i = 0; i < length; i += 1) {
          const op = ops[i];
          const enc1 = encode[op.type](op.value);
          for (let j = 0; j < enc1.length; j++) {
            d.push(enc1[j]);
          }
        }
        if (wmm) {
          wmm.set(ops, d);
        }
        return d;
      };
      sizeOf.CHARSTRING = function(ops) {
        return encode.CHARSTRING(ops).length;
      };
      encode.OBJECT = function(v) {
        const encodingFunction = encode[v.type];
        check_default.argument(encodingFunction !== void 0, "No encoding function for type " + v.type);
        return encodingFunction(v.value);
      };
      sizeOf.OBJECT = function(v) {
        const sizeOfFunction = sizeOf[v.type];
        check_default.argument(sizeOfFunction !== void 0, "No sizeOf function for type " + v.type);
        return sizeOfFunction(v.value);
      };
      encode.TABLE = function(table) {
        let d = [];
        const length = (table.fields || []).length;
        const subtables = [];
        const subtableOffsets = [];
        for (let i = 0; i < length; i += 1) {
          const field = table.fields[i];
          const encodingFunction = encode[field.type];
          check_default.argument(encodingFunction !== void 0, "No encoding function for field type " + field.type + " (" + field.name + ")");
          let value = table[field.name];
          if (value === void 0) {
            value = field.value;
          }
          const bytes = encodingFunction(value);
          if (field.type === "TABLE") {
            if (value.fields !== null) {
              subtableOffsets.push(d.length);
              subtables.push(bytes);
            }
            d.push(...[0, 0]);
          } else {
            for (let j = 0; j < bytes.length; j++) {
              d.push(bytes[j]);
            }
          }
        }
        for (let i = 0; i < subtables.length; i += 1) {
          const o = subtableOffsets[i];
          const offset = d.length;
          check_default.argument(offset < 65536, "Table " + table.tableName + " too big.");
          d[o] = offset >> 8;
          d[o + 1] = offset & 255;
          for (let j = 0; j < subtables[i].length; j++) {
            d.push(subtables[i][j]);
          }
        }
        return d;
      };
      sizeOf.TABLE = function(table) {
        let numBytes = 0;
        const length = (table.fields || []).length;
        for (let i = 0; i < length; i += 1) {
          const field = table.fields[i];
          const sizeOfFunction = sizeOf[field.type];
          check_default.argument(sizeOfFunction !== void 0, "No sizeOf function for field type " + field.type + " (" + field.name + ")");
          let value = table[field.name];
          if (value === void 0) {
            value = field.value;
          }
          numBytes += sizeOfFunction(value);
          if (field.type === "TABLE") {
            numBytes += 2;
          }
        }
        return numBytes;
      };
      encode.RECORD = encode.TABLE;
      sizeOf.RECORD = sizeOf.TABLE;
      encode.LITERAL = function(v) {
        return v;
      };
      sizeOf.LITERAL = function(v) {
        return v.length;
      };
      function Table(tableName, fields, options) {
        if (fields && fields.length) {
          for (let i = 0; i < fields.length; i += 1) {
            const field = fields[i];
            this[field.name] = field.value;
          }
        }
        this.tableName = tableName;
        this.fields = fields;
        if (options) {
          const optionKeys = Object.keys(options);
          for (let i = 0; i < optionKeys.length; i += 1) {
            const k = optionKeys[i];
            const v = options[k];
            if (this[k] !== void 0) {
              this[k] = v;
            }
          }
        }
      }
      Table.prototype.encode = function() {
        return encode.TABLE(this);
      };
      Table.prototype.sizeOf = function() {
        return sizeOf.TABLE(this);
      };
      function ushortList(itemName, list, count) {
        if (count === void 0) {
          count = list.length;
        }
        const fields = new Array(list.length + 1);
        fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
        for (let i = 0; i < list.length; i++) {
          fields[i + 1] = { name: itemName + i, type: "USHORT", value: list[i] };
        }
        return fields;
      }
      function tableList(itemName, records, itemCallback) {
        const count = records.length;
        const fields = new Array(count + 1);
        fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
        for (let i = 0; i < count; i++) {
          fields[i + 1] = { name: itemName + i, type: "TABLE", value: itemCallback(records[i], i) };
        }
        return fields;
      }
      function recordList(itemName, records, itemCallback) {
        const count = records.length;
        let fields = [];
        fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
        for (let i = 0; i < count; i++) {
          fields = fields.concat(itemCallback(records[i], i));
        }
        return fields;
      }
      function Coverage(coverageTable) {
        if (coverageTable.format === 1) {
          Table.call(
            this,
            "coverageTable",
            [{ name: "coverageFormat", type: "USHORT", value: 1 }].concat(ushortList("glyph", coverageTable.glyphs))
          );
        } else if (coverageTable.format === 2) {
          Table.call(
            this,
            "coverageTable",
            [{ name: "coverageFormat", type: "USHORT", value: 2 }].concat(recordList("rangeRecord", coverageTable.ranges, function(RangeRecord, i) {
              return [
                { name: "startGlyphID" + i, type: "USHORT", value: RangeRecord.start },
                { name: "endGlyphID" + i, type: "USHORT", value: RangeRecord.end },
                { name: "startCoverageIndex" + i, type: "USHORT", value: RangeRecord.index }
              ];
            }))
          );
        } else {
          check_default.assert(false, "Coverage format must be 1 or 2.");
        }
      }
      Coverage.prototype = Object.create(Table.prototype);
      Coverage.prototype.constructor = Coverage;
      function ScriptList(scriptListTable) {
        Table.call(
          this,
          "scriptListTable",
          recordList("scriptRecord", scriptListTable, function(scriptRecord, i) {
            const script = scriptRecord.script;
            let defaultLangSys = script.defaultLangSys;
            check_default.assert(!!defaultLangSys, "Unable to write GSUB: script " + scriptRecord.tag + " has no default language system.");
            return [
              { name: "scriptTag" + i, type: "TAG", value: scriptRecord.tag },
              { name: "script" + i, type: "TABLE", value: new Table("scriptTable", [
                { name: "defaultLangSys", type: "TABLE", value: new Table("defaultLangSys", [
                  { name: "lookupOrder", type: "USHORT", value: 0 },
                  { name: "reqFeatureIndex", type: "USHORT", value: defaultLangSys.reqFeatureIndex }
                ].concat(ushortList("featureIndex", defaultLangSys.featureIndexes))) }
              ].concat(recordList("langSys", script.langSysRecords, function(langSysRecord, i2) {
                const langSys = langSysRecord.langSys;
                return [
                  { name: "langSysTag" + i2, type: "TAG", value: langSysRecord.tag },
                  { name: "langSys" + i2, type: "TABLE", value: new Table("langSys", [
                    { name: "lookupOrder", type: "USHORT", value: 0 },
                    { name: "reqFeatureIndex", type: "USHORT", value: langSys.reqFeatureIndex }
                  ].concat(ushortList("featureIndex", langSys.featureIndexes))) }
                ];
              }))) }
            ];
          })
        );
      }
      ScriptList.prototype = Object.create(Table.prototype);
      ScriptList.prototype.constructor = ScriptList;
      function FeatureList(featureListTable) {
        Table.call(
          this,
          "featureListTable",
          recordList("featureRecord", featureListTable, function(featureRecord, i) {
            const feature = featureRecord.feature;
            return [
              { name: "featureTag" + i, type: "TAG", value: featureRecord.tag },
              { name: "feature" + i, type: "TABLE", value: new Table("featureTable", [
                { name: "featureParams", type: "USHORT", value: feature.featureParams }
              ].concat(ushortList("lookupListIndex", feature.lookupListIndexes))) }
            ];
          })
        );
      }
      FeatureList.prototype = Object.create(Table.prototype);
      FeatureList.prototype.constructor = FeatureList;
      function LookupList(lookupListTable, subtableMakers3) {
        Table.call(this, "lookupListTable", tableList("lookup", lookupListTable, function(lookupTable) {
          let subtableCallback = subtableMakers3[lookupTable.lookupType];
          check_default.assert(!!subtableCallback, "Unable to write GSUB lookup type " + lookupTable.lookupType + " tables.");
          return new Table("lookupTable", [
            { name: "lookupType", type: "USHORT", value: lookupTable.lookupType },
            { name: "lookupFlag", type: "USHORT", value: lookupTable.lookupFlag }
          ].concat(tableList("subtable", lookupTable.subtables, subtableCallback)));
        }));
      }
      LookupList.prototype = Object.create(Table.prototype);
      LookupList.prototype.constructor = LookupList;
      function ClassDef(classDefTable) {
        if (classDefTable.format === 1) {
          Table.call(
            this,
            "classDefTable",
            [
              { name: "classFormat", type: "USHORT", value: 1 },
              { name: "startGlyphID", type: "USHORT", value: classDefTable.startGlyph }
            ].concat(ushortList("glyph", classDefTable.classes))
          );
        } else if (classDefTable.format === 2) {
          Table.call(
            this,
            "classDefTable",
            [{ name: "classFormat", type: "USHORT", value: 2 }].concat(recordList("rangeRecord", classDefTable.ranges, function(RangeRecord, i) {
              return [
                { name: "startGlyphID" + i, type: "USHORT", value: RangeRecord.start },
                { name: "endGlyphID" + i, type: "USHORT", value: RangeRecord.end },
                { name: "class" + i, type: "USHORT", value: RangeRecord.classId }
              ];
            }))
          );
        } else {
          check_default.assert(false, "Class format must be 1 or 2.");
        }
      }
      ClassDef.prototype = Object.create(Table.prototype);
      ClassDef.prototype.constructor = ClassDef;
      var table_default = {
        Table,
        Record: Table,
        Coverage,
        ClassDef,
        ScriptList,
        FeatureList,
        LookupList,
        ushortList,
        tableList,
        recordList
      };
      function getByte(dataView, offset) {
        return dataView.getUint8(offset);
      }
      function getUShort(dataView, offset) {
        return dataView.getUint16(offset, false);
      }
      function getShort(dataView, offset) {
        return dataView.getInt16(offset, false);
      }
      function getUInt24(dataView, offset) {
        return (dataView.getUint16(offset) << 8) + dataView.getUint8(offset + 2);
      }
      function getULong(dataView, offset) {
        return dataView.getUint32(offset, false);
      }
      function getLong(dataView, offset) {
        return dataView.getInt32(offset, false);
      }
      function getFixed(dataView, offset) {
        const decimal = dataView.getInt16(offset, false);
        const fraction = dataView.getUint16(offset + 2, false);
        return decimal + fraction / 65535;
      }
      function getTag(dataView, offset) {
        let tag = "";
        for (let i = offset; i < offset + 4; i += 1) {
          tag += String.fromCharCode(dataView.getInt8(i));
        }
        return tag;
      }
      function getOffset(dataView, offset, offSize) {
        let v = 0;
        for (let i = 0; i < offSize; i += 1) {
          v <<= 8;
          v += dataView.getUint8(offset + i);
        }
        return v;
      }
      function getBytes(dataView, startOffset, endOffset) {
        const bytes = [];
        for (let i = startOffset; i < endOffset; i += 1) {
          bytes.push(dataView.getUint8(i));
        }
        return bytes;
      }
      function bytesToString(bytes) {
        let s = "";
        for (let i = 0; i < bytes.length; i += 1) {
          s += String.fromCharCode(bytes[i]);
        }
        return s;
      }
      var typeOffsets = {
        byte: 1,
        uShort: 2,
        f2dot14: 2,
        short: 2,
        uInt24: 3,
        uLong: 4,
        fixed: 4,
        longDateTime: 8,
        tag: 4
      };
      var masks = {
        LONG_WORDS: 32768,
        WORD_DELTA_COUNT_MASK: 32767,
        SHARED_POINT_NUMBERS: 32768,
        COUNT_MASK: 4095,
        EMBEDDED_PEAK_TUPLE: 32768,
        INTERMEDIATE_REGION: 16384,
        PRIVATE_POINT_NUMBERS: 8192,
        TUPLE_INDEX_MASK: 4095,
        POINTS_ARE_WORDS: 128,
        POINT_RUN_COUNT_MASK: 127,
        DELTAS_ARE_ZERO: 128,
        DELTAS_ARE_WORDS: 64,
        DELTA_RUN_COUNT_MASK: 63,
        INNER_INDEX_BIT_COUNT_MASK: 15,
        MAP_ENTRY_SIZE_MASK: 48
      };
      function Parser(data, offset) {
        this.data = data;
        this.offset = offset;
        this.relativeOffset = 0;
      }
      Parser.prototype.parseByte = function() {
        const v = this.data.getUint8(this.offset + this.relativeOffset);
        this.relativeOffset += 1;
        return v;
      };
      Parser.prototype.parseChar = function() {
        const v = this.data.getInt8(this.offset + this.relativeOffset);
        this.relativeOffset += 1;
        return v;
      };
      Parser.prototype.parseCard8 = Parser.prototype.parseByte;
      Parser.prototype.parseUShort = function() {
        const v = this.data.getUint16(this.offset + this.relativeOffset);
        this.relativeOffset += 2;
        return v;
      };
      Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
      Parser.prototype.parseSID = Parser.prototype.parseUShort;
      Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;
      Parser.prototype.parseShort = function() {
        const v = this.data.getInt16(this.offset + this.relativeOffset);
        this.relativeOffset += 2;
        return v;
      };
      Parser.prototype.parseF2Dot14 = function() {
        const v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
        this.relativeOffset += 2;
        return v;
      };
      Parser.prototype.parseUInt24 = function() {
        const v = getUInt24(this.data, this.offset + this.relativeOffset);
        this.relativeOffset += 3;
        return v;
      };
      Parser.prototype.parseULong = function() {
        const v = getULong(this.data, this.offset + this.relativeOffset);
        this.relativeOffset += 4;
        return v;
      };
      Parser.prototype.parseLong = function() {
        const v = getLong(this.data, this.offset + this.relativeOffset);
        this.relativeOffset += 4;
        return v;
      };
      Parser.prototype.parseOffset32 = Parser.prototype.parseULong;
      Parser.prototype.parseFixed = function() {
        const v = getFixed(this.data, this.offset + this.relativeOffset);
        this.relativeOffset += 4;
        return v;
      };
      Parser.prototype.parseString = function(length) {
        const dataView = this.data;
        const offset = this.offset + this.relativeOffset;
        let string = "";
        this.relativeOffset += length;
        for (let i = 0; i < length; i++) {
          string += String.fromCharCode(dataView.getUint8(offset + i));
        }
        return string;
      };
      Parser.prototype.parseTag = function() {
        return this.parseString(4);
      };
      Parser.prototype.parseLongDateTime = function() {
        let v = getULong(this.data, this.offset + this.relativeOffset + 4);
        v -= 2082844800;
        this.relativeOffset += 8;
        return v;
      };
      Parser.prototype.parseVersion = function(minorBase) {
        const major = getUShort(this.data, this.offset + this.relativeOffset);
        const minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
        this.relativeOffset += 4;
        if (minorBase === void 0) minorBase = 4096;
        return major + minor / minorBase / 10;
      };
      Parser.prototype.skip = function(type, amount) {
        if (amount === void 0) {
          amount = 1;
        }
        this.relativeOffset += typeOffsets[type] * amount;
      };
      Parser.prototype.parseULongList = function(count) {
        if (count === void 0) {
          count = this.parseULong();
        }
        const offsets = new Array(count);
        const dataView = this.data;
        let offset = this.offset + this.relativeOffset;
        for (let i = 0; i < count; i++) {
          offsets[i] = dataView.getUint32(offset);
          offset += 4;
        }
        this.relativeOffset += count * 4;
        return offsets;
      };
      Parser.prototype.parseOffset16List = Parser.prototype.parseUShortList = function(count) {
        if (count === void 0) {
          count = this.parseUShort();
        }
        const offsets = new Array(count);
        const dataView = this.data;
        let offset = this.offset + this.relativeOffset;
        for (let i = 0; i < count; i++) {
          offsets[i] = dataView.getUint16(offset);
          offset += 2;
        }
        this.relativeOffset += count * 2;
        return offsets;
      };
      Parser.prototype.parseShortList = function(count) {
        const list = new Array(count);
        const dataView = this.data;
        let offset = this.offset + this.relativeOffset;
        for (let i = 0; i < count; i++) {
          list[i] = dataView.getInt16(offset);
          offset += 2;
        }
        this.relativeOffset += count * 2;
        return list;
      };
      Parser.prototype.parseByteList = function(count) {
        const list = new Array(count);
        const dataView = this.data;
        let offset = this.offset + this.relativeOffset;
        for (let i = 0; i < count; i++) {
          list[i] = dataView.getUint8(offset++);
        }
        this.relativeOffset += count;
        return list;
      };
      Parser.prototype.parseList = function(count, itemCallback) {
        if (!itemCallback) {
          itemCallback = count;
          count = this.parseUShort();
        }
        const list = new Array(count);
        for (let i = 0; i < count; i++) {
          list[i] = itemCallback.call(this);
        }
        return list;
      };
      Parser.prototype.parseList32 = function(count, itemCallback) {
        if (!itemCallback) {
          itemCallback = count;
          count = this.parseULong();
        }
        const list = new Array(count);
        for (let i = 0; i < count; i++) {
          list[i] = itemCallback.call(this);
        }
        return list;
      };
      Parser.prototype.parseRecordList = function(count, recordDescription) {
        if (!recordDescription) {
          recordDescription = count;
          count = this.parseUShort();
        }
        const records = new Array(count);
        const fields = Object.keys(recordDescription);
        for (let i = 0; i < count; i++) {
          const rec = {};
          for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
          }
          records[i] = rec;
        }
        return records;
      };
      Parser.prototype.parseRecordList32 = function(count, recordDescription) {
        if (!recordDescription) {
          recordDescription = count;
          count = this.parseULong();
        }
        const records = new Array(count);
        const fields = Object.keys(recordDescription);
        for (let i = 0; i < count; i++) {
          const rec = {};
          for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
          }
          records[i] = rec;
        }
        return records;
      };
      Parser.prototype.parseTupleRecords = function(tupleCount, axisCount) {
        let tuples = [];
        for (let i = 0; i < tupleCount; i++) {
          let tuple = [];
          for (let axisIndex = 0; axisIndex < axisCount; axisIndex++) {
            tuple.push(this.parseF2Dot14());
          }
          tuples.push(tuple);
        }
        return tuples;
      };
      Parser.prototype.parseStruct = function(description) {
        if (typeof description === "function") {
          return description.call(this);
        } else {
          const fields = Object.keys(description);
          const struct = {};
          for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = description[fieldName];
            struct[fieldName] = fieldType.call(this);
          }
          return struct;
        }
      };
      Parser.prototype.parseValueRecord = function(valueFormat) {
        if (valueFormat === void 0) {
          valueFormat = this.parseUShort();
        }
        if (valueFormat === 0) {
          return;
        }
        const valueRecord = {};
        if (valueFormat & 1) {
          valueRecord.xPlacement = this.parseShort();
        }
        if (valueFormat & 2) {
          valueRecord.yPlacement = this.parseShort();
        }
        if (valueFormat & 4) {
          valueRecord.xAdvance = this.parseShort();
        }
        if (valueFormat & 8) {
          valueRecord.yAdvance = this.parseShort();
        }
        if (valueFormat & 16) {
          valueRecord.xPlaDevice = void 0;
          this.parseShort();
        }
        if (valueFormat & 32) {
          valueRecord.yPlaDevice = void 0;
          this.parseShort();
        }
        if (valueFormat & 64) {
          valueRecord.xAdvDevice = void 0;
          this.parseShort();
        }
        if (valueFormat & 128) {
          valueRecord.yAdvDevice = void 0;
          this.parseShort();
        }
        return valueRecord;
      };
      Parser.prototype.parseValueRecordList = function() {
        const valueFormat = this.parseUShort();
        const valueCount = this.parseUShort();
        const values = new Array(valueCount);
        for (let i = 0; i < valueCount; i++) {
          values[i] = this.parseValueRecord(valueFormat);
        }
        return values;
      };
      Parser.prototype.parsePointer = function(description) {
        const structOffset = this.parseOffset16();
        if (structOffset > 0) {
          return new Parser(this.data, this.offset + structOffset).parseStruct(description);
        }
        return void 0;
      };
      Parser.prototype.parsePointer32 = function(description) {
        const structOffset = this.parseOffset32();
        if (structOffset > 0) {
          return new Parser(this.data, this.offset + structOffset).parseStruct(description);
        }
        return void 0;
      };
      Parser.prototype.parseListOfLists = function(itemCallback) {
        const offsets = this.parseOffset16List();
        const count = offsets.length;
        const relativeOffset = this.relativeOffset;
        const list = new Array(count);
        for (let i = 0; i < count; i++) {
          const start = offsets[i];
          if (start === 0) {
            list[i] = void 0;
            continue;
          }
          this.relativeOffset = start;
          if (itemCallback) {
            const subOffsets = this.parseOffset16List();
            const subList = new Array(subOffsets.length);
            for (let j = 0; j < subOffsets.length; j++) {
              this.relativeOffset = start + subOffsets[j];
              subList[j] = itemCallback.call(this);
            }
            list[i] = subList;
          } else {
            list[i] = this.parseUShortList();
          }
        }
        this.relativeOffset = relativeOffset;
        return list;
      };
      Parser.prototype.parseCoverage = function() {
        const startOffset = this.offset + this.relativeOffset;
        const format = this.parseUShort();
        const count = this.parseUShort();
        if (format === 1) {
          return {
            format: 1,
            glyphs: this.parseUShortList(count)
          };
        } else if (format === 2) {
          const ranges = new Array(count);
          for (let i = 0; i < count; i++) {
            ranges[i] = {
              start: this.parseUShort(),
              end: this.parseUShort(),
              index: this.parseUShort()
            };
          }
          return {
            format: 2,
            ranges
          };
        }
        throw new Error("0x" + startOffset.toString(16) + ": Coverage format must be 1 or 2.");
      };
      Parser.prototype.parseClassDef = function() {
        const startOffset = this.offset + this.relativeOffset;
        const format = this.parseUShort();
        if (format === 1) {
          return {
            format: 1,
            startGlyph: this.parseUShort(),
            classes: this.parseUShortList()
          };
        } else if (format === 2) {
          return {
            format: 2,
            ranges: this.parseRecordList({
              start: Parser.uShort,
              end: Parser.uShort,
              classId: Parser.uShort
            })
          };
        }
        console.warn(`0x${startOffset.toString(16)}: This font file uses an invalid ClassDef format of ${format}. It might be corrupted and should be reacquired if it doesn't display as intended.`);
        return {
          format
        };
      };
      Parser.list = function(count, itemCallback) {
        return function() {
          return this.parseList(count, itemCallback);
        };
      };
      Parser.list32 = function(count, itemCallback) {
        return function() {
          return this.parseList32(count, itemCallback);
        };
      };
      Parser.recordList = function(count, recordDescription) {
        return function() {
          return this.parseRecordList(count, recordDescription);
        };
      };
      Parser.recordList32 = function(count, recordDescription) {
        return function() {
          return this.parseRecordList32(count, recordDescription);
        };
      };
      Parser.pointer = function(description) {
        return function() {
          return this.parsePointer(description);
        };
      };
      Parser.pointer32 = function(description) {
        return function() {
          return this.parsePointer32(description);
        };
      };
      Parser.tag = Parser.prototype.parseTag;
      Parser.byte = Parser.prototype.parseByte;
      Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
      Parser.uShortList = Parser.prototype.parseUShortList;
      Parser.uInt24 = Parser.prototype.parseUInt24;
      Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
      Parser.uLongList = Parser.prototype.parseULongList;
      Parser.fixed = Parser.prototype.parseFixed;
      Parser.f2Dot14 = Parser.prototype.parseF2Dot14;
      Parser.struct = Parser.prototype.parseStruct;
      Parser.coverage = Parser.prototype.parseCoverage;
      Parser.classDef = Parser.prototype.parseClassDef;
      var langSysTable = {
        reserved: Parser.uShort,
        reqFeatureIndex: Parser.uShort,
        featureIndexes: Parser.uShortList
      };
      Parser.prototype.parseScriptList = function() {
        return this.parsePointer(Parser.recordList({
          tag: Parser.tag,
          script: Parser.pointer({
            defaultLangSys: Parser.pointer(langSysTable),
            langSysRecords: Parser.recordList({
              tag: Parser.tag,
              langSys: Parser.pointer(langSysTable)
            })
          })
        })) || [];
      };
      Parser.prototype.parseFeatureList = function() {
        return this.parsePointer(Parser.recordList({
          tag: Parser.tag,
          feature: Parser.pointer({
            featureParams: Parser.offset16,
            lookupListIndexes: Parser.uShortList
          })
        })) || [];
      };
      Parser.prototype.parseLookupList = function(lookupTableParsers) {
        return this.parsePointer(Parser.list(Parser.pointer(function() {
          const lookupType = this.parseUShort();
          check_default.argument(1 <= lookupType && lookupType <= 9, "GPOS/GSUB lookup type " + lookupType + " unknown.");
          const lookupFlag = this.parseUShort();
          const useMarkFilteringSet = lookupFlag & 16;
          return {
            lookupType,
            lookupFlag,
            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : void 0
          };
        }))) || [];
      };
      Parser.prototype.parseFeatureVariationsList = function() {
        return this.parsePointer32(function() {
          const majorVersion = this.parseUShort();
          const minorVersion = this.parseUShort();
          check_default.argument(majorVersion === 1 && minorVersion < 1, "GPOS/GSUB feature variations table unknown.");
          const featureVariations = this.parseRecordList32({
            conditionSetOffset: Parser.offset32,
            featureTableSubstitutionOffset: Parser.offset32
          });
          return featureVariations;
        }) || [];
      };
      Parser.prototype.parseVariationStore = function() {
        const vsOffset = this.relativeOffset;
        const length = this.parseUShort();
        const variationStore = {
          itemVariationStore: this.parseItemVariationStore()
        };
        this.relativeOffset = vsOffset + length + 2;
        return variationStore;
      };
      Parser.prototype.parseItemVariationStore = function() {
        const itemStoreOffset = this.relativeOffset;
        const iVStore = {
          format: this.parseUShort(),
          variationRegions: [],
          itemVariationSubtables: []
        };
        const variationRegionListOffset = this.parseOffset32();
        const itemVariationDataCount = this.parseUShort();
        const itemVariationDataOffsets = this.parseULongList(itemVariationDataCount);
        this.relativeOffset = itemStoreOffset + variationRegionListOffset;
        iVStore.variationRegions = this.parseVariationRegionList();
        for (let i = 0; i < itemVariationDataCount; i++) {
          const subtableOffset = itemVariationDataOffsets[i];
          this.relativeOffset = itemStoreOffset + subtableOffset;
          iVStore.itemVariationSubtables.push(this.parseItemVariationSubtable());
        }
        return iVStore;
      };
      Parser.prototype.parseVariationRegionList = function() {
        const axisCount = this.parseUShort();
        const regionCount = this.parseUShort();
        return this.parseRecordList(regionCount, {
          regionAxes: Parser.recordList(axisCount, {
            startCoord: Parser.f2Dot14,
            peakCoord: Parser.f2Dot14,
            endCoord: Parser.f2Dot14
          })
        });
      };
      Parser.prototype.parseItemVariationSubtable = function() {
        const itemCount = this.parseUShort();
        const wordDeltaCount = this.parseUShort();
        const regionIndexes = this.parseUShortList();
        const regionIndexCount = regionIndexes.length;
        const subtable = {
          regionIndexes,
          deltaSets: itemCount && regionIndexCount ? this.parseDeltaSets(itemCount, wordDeltaCount, regionIndexCount) : []
        };
        return subtable;
      };
      Parser.prototype.parseDeltaSetIndexMap = function() {
        const format = this.parseByte();
        const entryFormat = this.parseByte();
        const map = [];
        let mapCount = 0;
        switch (format) {
          case 0:
            mapCount = this.parseUShort();
            break;
          case 1:
            mapCount = this.parseULong();
            break;
          default:
            console.error(`unsupported DeltaSetIndexMap format ${format}`);
        }
        if (!mapCount) return {
          format,
          entryFormat
        };
        const bitCount = (entryFormat & masks.INNER_INDEX_BIT_COUNT_MASK) + 1;
        const entrySize = ((entryFormat & masks.MAP_ENTRY_SIZE_MASK) >> 4) + 1;
        for (let n = 0; n < mapCount; n++) {
          let entry;
          if (entrySize === 1) {
            entry = this.parseByte();
          } else if (entrySize === 2) {
            entry = this.parseUShort();
          } else if (entrySize === 3) {
            entry = this.parseUInt24();
          } else if (entrySize === 4) {
            entry = this.parseULong();
          } else {
            throw new Error(`Invalid entry size of ${entrySize}`);
          }
          const outerIndex = entry >> bitCount;
          const innerIndex = entry & (1 << bitCount) - 1;
          map.push({ outerIndex, innerIndex });
        }
        return {
          format,
          entryFormat,
          map
        };
      };
      Parser.prototype.parseDeltaSets = function(itemCount, wordDeltaCount, regionIndexCount) {
        const deltas = Array.from({ length: itemCount }, () => []);
        const longFlag = wordDeltaCount & masks.LONG_WORDS;
        const wordCount = wordDeltaCount & masks.WORD_DELTA_COUNT_MASK;
        if (wordCount > regionIndexCount) {
          throw Error("wordCount must be less than or equal to regionIndexCount");
        }
        const wordParser = (longFlag ? this.parseLong : this.parseShort).bind(this);
        const restParser = (longFlag ? this.parseShort : this.parseChar).bind(this);
        for (let i = 0; i < itemCount; i++) {
          for (let j = 0; j < regionIndexCount; j++) {
            if (j < wordCount) {
              deltas[i].push(wordParser());
            } else {
              deltas[i].push(restParser());
            }
          }
        }
        return deltas;
      };
      Parser.prototype.parseTupleVariationStoreList = function(axisCount, flavor, glyphs) {
        const glyphCount = this.parseUShort();
        const flags = this.parseUShort();
        const offsetSizeIs32Bit = flags & 1;
        const glyphVariationDataArrayOffset = this.parseOffset32();
        const parseOffset = (offsetSizeIs32Bit ? this.parseULong : this.parseUShort).bind(this);
        const glyphVariations = {};
        let currentOffset = parseOffset();
        if (!offsetSizeIs32Bit) currentOffset *= 2;
        let nextOffset;
        for (let i = 0; i < glyphCount; i++) {
          nextOffset = parseOffset();
          if (!offsetSizeIs32Bit) nextOffset *= 2;
          const length = nextOffset - currentOffset;
          glyphVariations[i] = length ? this.parseTupleVariationStore(
            glyphVariationDataArrayOffset + currentOffset,
            axisCount,
            flavor,
            glyphs,
            i
          ) : void 0;
          currentOffset = nextOffset;
        }
        return glyphVariations;
      };
      Parser.prototype.parseTupleVariationStore = function(tableOffset, axisCount, flavor, glyphs, glyphIndex) {
        const relativeOffset = this.relativeOffset;
        this.relativeOffset = tableOffset;
        if (flavor === "cvar") {
          this.relativeOffset += 4;
        }
        const tupleVariationCount = this.parseUShort();
        const hasSharedPoints = !!(tupleVariationCount & masks.SHARED_POINT_NUMBERS);
        const count = tupleVariationCount & masks.COUNT_MASK;
        let dataOffset = this.parseOffset16();
        const headers = [];
        let sharedPoints = [];
        for (let h = 0; h < count; h++) {
          const headerData = this.parseTupleVariationHeader(axisCount, flavor);
          headers.push(headerData);
        }
        if (this.relativeOffset !== tableOffset + dataOffset) {
          console.warn(`Unexpected offset after parsing tuple variation headers! Expected ${tableOffset + dataOffset}, actually ${this.relativeOffset}`);
          this.relativeOffset = tableOffset + dataOffset;
        }
        if (hasSharedPoints) {
          sharedPoints = this.parsePackedPointNumbers();
        }
        let serializedDataOffset = this.relativeOffset;
        for (let h = 0; h < count; h++) {
          const header = headers[h];
          header.privatePoints = [];
          this.relativeOffset = serializedDataOffset;
          if (flavor === "cvar" && !header.peakTuple) {
            console.warn("An embedded peak tuple is required in TupleVariationHeaders for the cvar table.");
          }
          if (header.flags.privatePointNumbers) {
            header.privatePoints = this.parsePackedPointNumbers();
          }
          delete header.flags;
          const deltasOffset = this.offset;
          const deltasRelativeOffset = this.relativeOffset;
          const defineDeltas = (propertyName) => {
            let _deltas = void 0;
            let _deltasY = void 0;
            const parseDeltas = () => {
              let pointsCount = 0;
              if (flavor === "gvar") {
                pointsCount = header.privatePoints.length || sharedPoints.length;
                if (!pointsCount) {
                  const glyph = glyphs.get(glyphIndex);
                  glyph.path;
                  pointsCount = glyph.points.length;
                  pointsCount += 4;
                }
              } else if (flavor === "cvar") {
                pointsCount = glyphs.length;
              }
              this.offset = deltasOffset;
              this.relativeOffset = deltasRelativeOffset;
              _deltas = this.parsePackedDeltas(pointsCount);
              if (flavor === "gvar") {
                _deltasY = this.parsePackedDeltas(pointsCount);
              }
            };
            return {
              configurable: true,
              get: function() {
                if (_deltas === void 0) parseDeltas();
                return propertyName === "deltasY" ? _deltasY : _deltas;
              },
              set: function(deltas) {
                if (_deltas === void 0) parseDeltas();
                if (propertyName === "deltasY") {
                  _deltasY = deltas;
                } else {
                  _deltas = deltas;
                }
              }
            };
          };
          Object.defineProperty(header, "deltas", defineDeltas.call(this, "deltas"));
          if (flavor === "gvar") {
            Object.defineProperty(header, "deltasY", defineDeltas.call(this, "deltasY"));
          }
          serializedDataOffset += header.variationDataSize;
          delete header.variationDataSize;
        }
        this.relativeOffset = relativeOffset;
        const result = {
          headers
        };
        result.sharedPoints = sharedPoints;
        return result;
      };
      Parser.prototype.parseTupleVariationHeader = function(axisCount, flavor) {
        const variationDataSize = this.parseUShort();
        const tupleIndex = this.parseUShort();
        const embeddedPeakTuple = !!(tupleIndex & masks.EMBEDDED_PEAK_TUPLE);
        const intermediateRegion = !!(tupleIndex & masks.INTERMEDIATE_REGION);
        const privatePointNumbers = !!(tupleIndex & masks.PRIVATE_POINT_NUMBERS);
        const sharedTupleRecordsIndex = embeddedPeakTuple ? void 0 : tupleIndex & masks.TUPLE_INDEX_MASK;
        const peakTuple = embeddedPeakTuple ? this.parseTupleRecords(1, axisCount)[0] : void 0;
        const intermediateStartTuple = intermediateRegion ? this.parseTupleRecords(1, axisCount)[0] : void 0;
        const intermediateEndTuple = intermediateRegion ? this.parseTupleRecords(1, axisCount)[0] : void 0;
        const result = {
          variationDataSize,
          peakTuple,
          intermediateStartTuple,
          intermediateEndTuple,
          flags: {
            embeddedPeakTuple,
            intermediateRegion,
            privatePointNumbers
          }
        };
        if (flavor === "gvar") {
          result.sharedTupleRecordsIndex = sharedTupleRecordsIndex;
        }
        return result;
      };
      Parser.prototype.parsePackedPointNumbers = function() {
        const countByte1 = this.parseByte();
        const points = [];
        let totalPointCount = countByte1;
        if (countByte1 >= 128) {
          const countByte2 = this.parseByte();
          totalPointCount = (countByte1 & masks.POINT_RUN_COUNT_MASK) << 8 | countByte2;
        }
        let lastPoint = 0;
        while (points.length < totalPointCount) {
          const controlByte = this.parseByte();
          const numbersAre16Bit = !!(controlByte & masks.POINTS_ARE_WORDS);
          let runCount = (controlByte & masks.POINT_RUN_COUNT_MASK) + 1;
          for (let i = 0; i < runCount && points.length < totalPointCount; i++) {
            let pointDelta;
            if (numbersAre16Bit) {
              pointDelta = this.parseUShort();
            } else {
              pointDelta = this.parseByte();
            }
            lastPoint = lastPoint + pointDelta;
            points.push(lastPoint);
          }
        }
        return points;
      };
      Parser.prototype.parsePackedDeltas = function(expectedCount) {
        const deltas = [];
        while (deltas.length < expectedCount) {
          const controlByte = this.parseByte();
          const zeroData = !!(controlByte & masks.DELTAS_ARE_ZERO);
          const deltaWords = !!(controlByte & masks.DELTAS_ARE_WORDS);
          const runCount = (controlByte & masks.DELTA_RUN_COUNT_MASK) + 1;
          for (let i = 0; i < runCount && deltas.length < expectedCount; i++) {
            if (zeroData) {
              deltas.push(0);
            } else if (deltaWords) {
              deltas.push(this.parseShort());
            } else {
              deltas.push(this.parseChar());
            }
          }
        }
        return deltas;
      };
      var parse_default = {
        getByte,
        getCard8: getByte,
        getUShort,
        getCard16: getUShort,
        getShort,
        getUInt24,
        getULong,
        getFixed,
        getTag,
        getOffset,
        getBytes,
        bytesToString,
        Parser
      };
      var nameTableNames = [
        "copyright",
        // 0
        "fontFamily",
        // 1
        "fontSubfamily",
        // 2
        "uniqueID",
        // 3
        "fullName",
        // 4
        "version",
        // 5
        "postScriptName",
        // 6
        "trademark",
        // 7
        "manufacturer",
        // 8
        "designer",
        // 9
        "description",
        // 10
        "manufacturerURL",
        // 11
        "designerURL",
        // 12
        "license",
        // 13
        "licenseURL",
        // 14
        "reserved",
        // 15
        "preferredFamily",
        // 16
        "preferredSubfamily",
        // 17
        "compatibleFullName",
        // 18
        "sampleText",
        // 19
        "postScriptFindFontName",
        // 20
        "wwsFamily",
        // 21
        "wwsSubfamily"
        // 22
      ];
      var macLanguages = {
        0: "en",
        1: "fr",
        2: "de",
        3: "it",
        4: "nl",
        5: "sv",
        6: "es",
        7: "da",
        8: "pt",
        9: "no",
        10: "he",
        11: "ja",
        12: "ar",
        13: "fi",
        14: "el",
        15: "is",
        16: "mt",
        17: "tr",
        18: "hr",
        19: "zh-Hant",
        20: "ur",
        21: "hi",
        22: "th",
        23: "ko",
        24: "lt",
        25: "pl",
        26: "hu",
        27: "es",
        28: "lv",
        29: "se",
        30: "fo",
        31: "fa",
        32: "ru",
        33: "zh",
        34: "nl-BE",
        35: "ga",
        36: "sq",
        37: "ro",
        38: "cz",
        39: "sk",
        40: "si",
        41: "yi",
        42: "sr",
        43: "mk",
        44: "bg",
        45: "uk",
        46: "be",
        47: "uz",
        48: "kk",
        49: "az-Cyrl",
        50: "az-Arab",
        51: "hy",
        52: "ka",
        53: "mo",
        54: "ky",
        55: "tg",
        56: "tk",
        57: "mn-CN",
        58: "mn",
        59: "ps",
        60: "ks",
        61: "ku",
        62: "sd",
        63: "bo",
        64: "ne",
        65: "sa",
        66: "mr",
        67: "bn",
        68: "as",
        69: "gu",
        70: "pa",
        71: "or",
        72: "ml",
        73: "kn",
        74: "ta",
        75: "te",
        76: "si",
        77: "my",
        78: "km",
        79: "lo",
        80: "vi",
        81: "id",
        82: "tl",
        83: "ms",
        84: "ms-Arab",
        85: "am",
        86: "ti",
        87: "om",
        88: "so",
        89: "sw",
        90: "rw",
        91: "rn",
        92: "ny",
        93: "mg",
        94: "eo",
        128: "cy",
        129: "eu",
        130: "ca",
        131: "la",
        132: "qu",
        133: "gn",
        134: "ay",
        135: "tt",
        136: "ug",
        137: "dz",
        138: "jv",
        139: "su",
        140: "gl",
        141: "af",
        142: "br",
        143: "iu",
        144: "gd",
        145: "gv",
        146: "ga",
        147: "to",
        148: "el-polyton",
        149: "kl",
        150: "az",
        151: "nn"
      };
      var macLanguageToScript = {
        0: 0,
        // langEnglish → smRoman
        1: 0,
        // langFrench → smRoman
        2: 0,
        // langGerman → smRoman
        3: 0,
        // langItalian → smRoman
        4: 0,
        // langDutch → smRoman
        5: 0,
        // langSwedish → smRoman
        6: 0,
        // langSpanish → smRoman
        7: 0,
        // langDanish → smRoman
        8: 0,
        // langPortuguese → smRoman
        9: 0,
        // langNorwegian → smRoman
        10: 5,
        // langHebrew → smHebrew
        11: 1,
        // langJapanese → smJapanese
        12: 4,
        // langArabic → smArabic
        13: 0,
        // langFinnish → smRoman
        14: 6,
        // langGreek → smGreek
        15: 0,
        // langIcelandic → smRoman (modified)
        16: 0,
        // langMaltese → smRoman
        17: 0,
        // langTurkish → smRoman (modified)
        18: 0,
        // langCroatian → smRoman (modified)
        19: 2,
        // langTradChinese → smTradChinese
        20: 4,
        // langUrdu → smArabic
        21: 9,
        // langHindi → smDevanagari
        22: 21,
        // langThai → smThai
        23: 3,
        // langKorean → smKorean
        24: 29,
        // langLithuanian → smCentralEuroRoman
        25: 29,
        // langPolish → smCentralEuroRoman
        26: 29,
        // langHungarian → smCentralEuroRoman
        27: 29,
        // langEstonian → smCentralEuroRoman
        28: 29,
        // langLatvian → smCentralEuroRoman
        29: 0,
        // langSami → smRoman
        30: 0,
        // langFaroese → smRoman (modified)
        31: 4,
        // langFarsi → smArabic (modified)
        32: 7,
        // langRussian → smCyrillic
        33: 25,
        // langSimpChinese → smSimpChinese
        34: 0,
        // langFlemish → smRoman
        35: 0,
        // langIrishGaelic → smRoman (modified)
        36: 0,
        // langAlbanian → smRoman
        37: 0,
        // langRomanian → smRoman (modified)
        38: 29,
        // langCzech → smCentralEuroRoman
        39: 29,
        // langSlovak → smCentralEuroRoman
        40: 0,
        // langSlovenian → smRoman (modified)
        41: 5,
        // langYiddish → smHebrew
        42: 7,
        // langSerbian → smCyrillic
        43: 7,
        // langMacedonian → smCyrillic
        44: 7,
        // langBulgarian → smCyrillic
        45: 7,
        // langUkrainian → smCyrillic (modified)
        46: 7,
        // langByelorussian → smCyrillic
        47: 7,
        // langUzbek → smCyrillic
        48: 7,
        // langKazakh → smCyrillic
        49: 7,
        // langAzerbaijani → smCyrillic
        50: 4,
        // langAzerbaijanAr → smArabic
        51: 24,
        // langArmenian → smArmenian
        52: 23,
        // langGeorgian → smGeorgian
        53: 7,
        // langMoldavian → smCyrillic
        54: 7,
        // langKirghiz → smCyrillic
        55: 7,
        // langTajiki → smCyrillic
        56: 7,
        // langTurkmen → smCyrillic
        57: 27,
        // langMongolian → smMongolian
        58: 7,
        // langMongolianCyr → smCyrillic
        59: 4,
        // langPashto → smArabic
        60: 4,
        // langKurdish → smArabic
        61: 4,
        // langKashmiri → smArabic
        62: 4,
        // langSindhi → smArabic
        63: 26,
        // langTibetan → smTibetan
        64: 9,
        // langNepali → smDevanagari
        65: 9,
        // langSanskrit → smDevanagari
        66: 9,
        // langMarathi → smDevanagari
        67: 13,
        // langBengali → smBengali
        68: 13,
        // langAssamese → smBengali
        69: 11,
        // langGujarati → smGujarati
        70: 10,
        // langPunjabi → smGurmukhi
        71: 12,
        // langOriya → smOriya
        72: 17,
        // langMalayalam → smMalayalam
        73: 16,
        // langKannada → smKannada
        74: 14,
        // langTamil → smTamil
        75: 15,
        // langTelugu → smTelugu
        76: 18,
        // langSinhalese → smSinhalese
        77: 19,
        // langBurmese → smBurmese
        78: 20,
        // langKhmer → smKhmer
        79: 22,
        // langLao → smLao
        80: 30,
        // langVietnamese → smVietnamese
        81: 0,
        // langIndonesian → smRoman
        82: 0,
        // langTagalog → smRoman
        83: 0,
        // langMalayRoman → smRoman
        84: 4,
        // langMalayArabic → smArabic
        85: 28,
        // langAmharic → smEthiopic
        86: 28,
        // langTigrinya → smEthiopic
        87: 28,
        // langOromo → smEthiopic
        88: 0,
        // langSomali → smRoman
        89: 0,
        // langSwahili → smRoman
        90: 0,
        // langKinyarwanda → smRoman
        91: 0,
        // langRundi → smRoman
        92: 0,
        // langNyanja → smRoman
        93: 0,
        // langMalagasy → smRoman
        94: 0,
        // langEsperanto → smRoman
        128: 0,
        // langWelsh → smRoman (modified)
        129: 0,
        // langBasque → smRoman
        130: 0,
        // langCatalan → smRoman
        131: 0,
        // langLatin → smRoman
        132: 0,
        // langQuechua → smRoman
        133: 0,
        // langGuarani → smRoman
        134: 0,
        // langAymara → smRoman
        135: 7,
        // langTatar → smCyrillic
        136: 4,
        // langUighur → smArabic
        137: 26,
        // langDzongkha → smTibetan
        138: 0,
        // langJavaneseRom → smRoman
        139: 0,
        // langSundaneseRom → smRoman
        140: 0,
        // langGalician → smRoman
        141: 0,
        // langAfrikaans → smRoman
        142: 0,
        // langBreton → smRoman (modified)
        143: 28,
        // langInuktitut → smEthiopic (modified)
        144: 0,
        // langScottishGaelic → smRoman (modified)
        145: 0,
        // langManxGaelic → smRoman (modified)
        146: 0,
        // langIrishGaelicScript → smRoman (modified)
        147: 0,
        // langTongan → smRoman
        148: 6,
        // langGreekAncient → smRoman
        149: 0,
        // langGreenlandic → smRoman
        150: 0,
        // langAzerbaijanRoman → smRoman
        151: 0
        // langNynorsk → smRoman
      };
      var windowsLanguages = {
        1078: "af",
        1052: "sq",
        1156: "gsw",
        1118: "am",
        5121: "ar-DZ",
        15361: "ar-BH",
        3073: "ar",
        2049: "ar-IQ",
        11265: "ar-JO",
        13313: "ar-KW",
        12289: "ar-LB",
        4097: "ar-LY",
        6145: "ary",
        8193: "ar-OM",
        16385: "ar-QA",
        1025: "ar-SA",
        10241: "ar-SY",
        7169: "aeb",
        14337: "ar-AE",
        9217: "ar-YE",
        1067: "hy",
        1101: "as",
        2092: "az-Cyrl",
        1068: "az",
        1133: "ba",
        1069: "eu",
        1059: "be",
        2117: "bn",
        1093: "bn-IN",
        8218: "bs-Cyrl",
        5146: "bs",
        1150: "br",
        1026: "bg",
        1027: "ca",
        3076: "zh-HK",
        5124: "zh-MO",
        2052: "zh",
        4100: "zh-SG",
        1028: "zh-TW",
        1155: "co",
        1050: "hr",
        4122: "hr-BA",
        1029: "cs",
        1030: "da",
        1164: "prs",
        1125: "dv",
        2067: "nl-BE",
        1043: "nl",
        3081: "en-AU",
        10249: "en-BZ",
        4105: "en-CA",
        9225: "en-029",
        16393: "en-IN",
        6153: "en-IE",
        8201: "en-JM",
        17417: "en-MY",
        5129: "en-NZ",
        13321: "en-PH",
        18441: "en-SG",
        7177: "en-ZA",
        11273: "en-TT",
        2057: "en-GB",
        1033: "en",
        12297: "en-ZW",
        1061: "et",
        1080: "fo",
        1124: "fil",
        1035: "fi",
        2060: "fr-BE",
        3084: "fr-CA",
        1036: "fr",
        5132: "fr-LU",
        6156: "fr-MC",
        4108: "fr-CH",
        1122: "fy",
        1110: "gl",
        1079: "ka",
        3079: "de-AT",
        1031: "de",
        5127: "de-LI",
        4103: "de-LU",
        2055: "de-CH",
        1032: "el",
        1135: "kl",
        1095: "gu",
        1128: "ha",
        1037: "he",
        1081: "hi",
        1038: "hu",
        1039: "is",
        1136: "ig",
        1057: "id",
        1117: "iu",
        2141: "iu-Latn",
        2108: "ga",
        1076: "xh",
        1077: "zu",
        1040: "it",
        2064: "it-CH",
        1041: "ja",
        1099: "kn",
        1087: "kk",
        1107: "km",
        1158: "quc",
        1159: "rw",
        1089: "sw",
        1111: "kok",
        1042: "ko",
        1088: "ky",
        1108: "lo",
        1062: "lv",
        1063: "lt",
        2094: "dsb",
        1134: "lb",
        1071: "mk",
        2110: "ms-BN",
        1086: "ms",
        1100: "ml",
        1082: "mt",
        1153: "mi",
        1146: "arn",
        1102: "mr",
        1148: "moh",
        1104: "mn",
        2128: "mn-CN",
        1121: "ne",
        1044: "nb",
        2068: "nn",
        1154: "oc",
        1096: "or",
        1123: "ps",
        1045: "pl",
        1046: "pt",
        2070: "pt-PT",
        1094: "pa",
        1131: "qu-BO",
        2155: "qu-EC",
        3179: "qu",
        1048: "ro",
        1047: "rm",
        1049: "ru",
        9275: "smn",
        4155: "smj-NO",
        5179: "smj",
        3131: "se-FI",
        1083: "se",
        2107: "se-SE",
        8251: "sms",
        6203: "sma-NO",
        7227: "sms",
        1103: "sa",
        7194: "sr-Cyrl-BA",
        3098: "sr",
        6170: "sr-Latn-BA",
        2074: "sr-Latn",
        1132: "nso",
        1074: "tn",
        1115: "si",
        1051: "sk",
        1060: "sl",
        11274: "es-AR",
        16394: "es-BO",
        13322: "es-CL",
        9226: "es-CO",
        5130: "es-CR",
        7178: "es-DO",
        12298: "es-EC",
        17418: "es-SV",
        4106: "es-GT",
        18442: "es-HN",
        2058: "es-MX",
        19466: "es-NI",
        6154: "es-PA",
        15370: "es-PY",
        10250: "es-PE",
        20490: "es-PR",
        // Microsoft has defined two different language codes for
        // “Spanish with modern sorting” and “Spanish with traditional
        // sorting”. This makes sense for collation APIs, and it would be
        // possible to express this in BCP 47 language tags via Unicode
        // extensions (eg., es-u-co-trad is Spanish with traditional
        // sorting). However, for storing names in fonts, the distinction
        // does not make sense, so we give “es” in both cases.
        3082: "es",
        1034: "es",
        21514: "es-US",
        14346: "es-UY",
        8202: "es-VE",
        2077: "sv-FI",
        1053: "sv",
        1114: "syr",
        1064: "tg",
        2143: "tzm",
        1097: "ta",
        1092: "tt",
        1098: "te",
        1054: "th",
        1105: "bo",
        1055: "tr",
        1090: "tk",
        1152: "ug",
        1058: "uk",
        1070: "hsb",
        1056: "ur",
        2115: "uz-Cyrl",
        1091: "uz",
        1066: "vi",
        1106: "cy",
        1160: "wo",
        1157: "sah",
        1144: "ii",
        1130: "yo"
      };
      function getLanguageCode(platformID, languageID, ltag) {
        switch (platformID) {
          case 0:
            if (languageID === 65535) {
              return "und";
            } else if (ltag) {
              return ltag[languageID];
            }
            break;
          case 1:
            return macLanguages[languageID];
          case 3:
            return windowsLanguages[languageID];
        }
        return void 0;
      }
      var utf16 = "utf-16";
      var macScriptEncodings = {
        0: "macintosh",
        // smRoman
        1: "x-mac-japanese",
        // smJapanese
        2: "x-mac-chinesetrad",
        // smTradChinese
        3: "x-mac-korean",
        // smKorean
        6: "x-mac-greek",
        // smGreek
        7: "x-mac-cyrillic",
        // smCyrillic
        9: "x-mac-devanagai",
        // smDevanagari
        10: "x-mac-gurmukhi",
        // smGurmukhi
        11: "x-mac-gujarati",
        // smGujarati
        12: "x-mac-oriya",
        // smOriya
        13: "x-mac-bengali",
        // smBengali
        14: "x-mac-tamil",
        // smTamil
        15: "x-mac-telugu",
        // smTelugu
        16: "x-mac-kannada",
        // smKannada
        17: "x-mac-malayalam",
        // smMalayalam
        18: "x-mac-sinhalese",
        // smSinhalese
        19: "x-mac-burmese",
        // smBurmese
        20: "x-mac-khmer",
        // smKhmer
        21: "x-mac-thai",
        // smThai
        22: "x-mac-lao",
        // smLao
        23: "x-mac-georgian",
        // smGeorgian
        24: "x-mac-armenian",
        // smArmenian
        25: "x-mac-chinesesimp",
        // smSimpChinese
        26: "x-mac-tibetan",
        // smTibetan
        27: "x-mac-mongolian",
        // smMongolian
        28: "x-mac-ethiopic",
        // smEthiopic
        29: "x-mac-ce",
        // smCentralEuroRoman
        30: "x-mac-vietnamese",
        // smVietnamese
        31: "x-mac-extarabic"
        // smExtArabic
      };
      var macLanguageEncodings = {
        15: "x-mac-icelandic",
        // langIcelandic
        17: "x-mac-turkish",
        // langTurkish
        18: "x-mac-croatian",
        // langCroatian
        24: "x-mac-ce",
        // langLithuanian
        25: "x-mac-ce",
        // langPolish
        26: "x-mac-ce",
        // langHungarian
        27: "x-mac-ce",
        // langEstonian
        28: "x-mac-ce",
        // langLatvian
        30: "x-mac-icelandic",
        // langFaroese
        37: "x-mac-romanian",
        // langRomanian
        38: "x-mac-ce",
        // langCzech
        39: "x-mac-ce",
        // langSlovak
        40: "x-mac-ce",
        // langSlovenian
        143: "x-mac-inuit",
        // langInuktitut
        146: "x-mac-gaelic"
        // langIrishGaelicScript
      };
      function getEncoding(platformID, encodingID, languageID) {
        switch (platformID) {
          case 0:
            return utf16;
          case 1:
            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];
          case 3:
            if (encodingID === 1 || encodingID === 10) {
              return utf16;
            }
            break;
        }
        return void 0;
      }
      var platforms = {
        0: "unicode",
        1: "macintosh",
        2: "reserved",
        3: "windows"
      };
      function getPlatform(platformID) {
        return platforms[platformID];
      }
      function parseNameTable(data, start, ltag) {
        const name = {};
        const p = new parse_default.Parser(data, start);
        const format = p.parseUShort();
        const count = p.parseUShort();
        const stringOffset = p.offset + p.parseUShort();
        for (let i = 0; i < count; i++) {
          const platformID = p.parseUShort();
          const encodingID = p.parseUShort();
          const languageID = p.parseUShort();
          const nameID = p.parseUShort();
          const property = nameTableNames[nameID] || nameID;
          const byteLength = p.parseUShort();
          const offset = p.parseUShort();
          const language = getLanguageCode(platformID, languageID, ltag);
          const encoding = getEncoding(platformID, encodingID, languageID);
          const platformName = getPlatform(platformID);
          if (encoding !== void 0 && language !== void 0 && platformName !== void 0) {
            let text;
            if (encoding === utf16) {
              text = decode.UTF16(data, stringOffset + offset, byteLength);
            } else {
              text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
            }
            if (text) {
              let platform = name[platformName];
              if (platform === void 0) {
                platform = name[platformName] = {};
              }
              let translations = platform[property];
              if (translations === void 0) {
                translations = platform[property] = {};
              }
              translations[language] = text;
            }
          }
        }
        if (format === 1) {
          p.parseUShort();
        }
        return name;
      }
      function reverseDict(dict) {
        const result = {};
        for (let key in dict) {
          result[dict[key]] = parseInt(key);
        }
        return result;
      }
      function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
        return new table_default.Record("NameRecord", [
          { name: "platformID", type: "USHORT", value: platformID },
          { name: "encodingID", type: "USHORT", value: encodingID },
          { name: "languageID", type: "USHORT", value: languageID },
          { name: "nameID", type: "USHORT", value: nameID },
          { name: "length", type: "USHORT", value: length },
          { name: "offset", type: "USHORT", value: offset }
        ]);
      }
      function findSubArray(needle, haystack) {
        const needleLength = needle.length;
        const limit = haystack.length - needleLength + 1;
        loop:
          for (let pos = 0; pos < limit; pos++) {
            for (; pos < limit; pos++) {
              for (let k = 0; k < needleLength; k++) {
                if (haystack[pos + k] !== needle[k]) {
                  continue loop;
                }
              }
              return pos;
            }
          }
        return -1;
      }
      function addStringToPool(s, pool) {
        let offset = findSubArray(s, pool);
        if (offset < 0) {
          offset = pool.length;
          let i = 0;
          const len = s.length;
          for (; i < len; ++i) {
            pool.push(s[i]);
          }
        }
        return offset;
      }
      function makeNameTable(names, ltag) {
        const platformNameIds = reverseDict(platforms);
        const macLanguageIds = reverseDict(macLanguages);
        const windowsLanguageIds = reverseDict(windowsLanguages);
        const nameRecords = [];
        const stringPool = [];
        for (let platform in names) {
          let nameID;
          const nameIDs = [];
          const namesWithNumericKeys = {};
          const nameTableIds = reverseDict(nameTableNames);
          const platformID = platformNameIds[platform];
          for (let key in names[platform]) {
            let id = nameTableIds[key];
            if (id === void 0) {
              id = key;
            }
            nameID = parseInt(id);
            if (isNaN(nameID)) {
              throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
            }
            namesWithNumericKeys[nameID] = names[platform][key];
            nameIDs.push(nameID);
          }
          for (let i = 0; i < nameIDs.length; i++) {
            nameID = nameIDs[i];
            const translations = namesWithNumericKeys[nameID];
            for (let lang in translations) {
              const text = translations[lang];
              if (platformID === 1 || platformID === 0) {
                let macLanguage = macLanguageIds[lang];
                let macScript = macLanguageToScript[macLanguage];
                const macEncoding = getEncoding(platformID, macScript, macLanguage);
                let macName = encode.MACSTRING(text, macEncoding);
                if (platformID === 0) {
                  macLanguage = ltag.indexOf(lang);
                  if (macLanguage < 0) {
                    macLanguage = ltag.length;
                    ltag.push(lang);
                  }
                  macScript = 4;
                  macName = encode.UTF16(text);
                }
                if (macName !== void 0) {
                  const macNameOffset = addStringToPool(macName, stringPool);
                  nameRecords.push(makeNameRecord(
                    platformID,
                    macScript,
                    macLanguage,
                    nameID,
                    macName.length,
                    macNameOffset
                  ));
                }
              }
              if (platformID === 3) {
                const winLanguage = windowsLanguageIds[lang];
                if (winLanguage !== void 0) {
                  const winName = encode.UTF16(text);
                  const winNameOffset = addStringToPool(winName, stringPool);
                  nameRecords.push(makeNameRecord(
                    3,
                    1,
                    winLanguage,
                    nameID,
                    winName.length,
                    winNameOffset
                  ));
                }
              }
            }
          }
        }
        nameRecords.sort(function(a, b) {
          return a.platformID - b.platformID || a.encodingID - b.encodingID || a.languageID - b.languageID || a.nameID - b.nameID;
        });
        const t = new table_default.Table("name", [
          { name: "format", type: "USHORT", value: 0 },
          { name: "count", type: "USHORT", value: nameRecords.length },
          { name: "stringOffset", type: "USHORT", value: 6 + nameRecords.length * 12 }
        ]);
        for (let r = 0; r < nameRecords.length; r++) {
          t.fields.push({ name: "record_" + r, type: "RECORD", value: nameRecords[r] });
        }
        t.fields.push({ name: "strings", type: "LITERAL", value: stringPool });
        return t;
      }
      function getNameByID(names, nameID, allowedStandardIDs = []) {
        if (nameID < 256 && nameID in nameTableNames) {
          if (allowedStandardIDs.length && !allowedStandardIDs.includes(parseInt(nameID))) {
            return void 0;
          }
          nameID = nameTableNames[nameID];
        }
        for (let platform in names) {
          for (let nameKey in names[platform]) {
            if (nameKey === nameID || parseInt(nameKey) === nameID) {
              return names[platform][nameKey];
            }
          }
        }
        return void 0;
      }
      var name_default = { parse: parseNameTable, make: makeNameTable, getNameByID };
      function parseCmapTableFormat0(cmap, p, platformID, encodingID) {
        cmap.length = p.parseUShort();
        cmap.language = p.parseUShort() - 1;
        const indexMap = p.parseByteList(cmap.length);
        const glyphIndexMap = Object.assign({}, indexMap);
        const encoding = getEncoding(platformID, encodingID, cmap.language);
        const decodingTable = eightBitMacEncodings[encoding];
        for (let i = 0; i < decodingTable.length; i++) {
          glyphIndexMap[decodingTable.charCodeAt(i)] = indexMap[128 + i];
        }
        cmap.glyphIndexMap = glyphIndexMap;
      }
      function parseCmapTableFormat12or13(cmap, p, format) {
        p.parseUShort();
        cmap.length = p.parseULong();
        cmap.language = p.parseULong();
        let groupCount;
        cmap.groupCount = groupCount = p.parseULong();
        cmap.glyphIndexMap = {};
        for (let i = 0; i < groupCount; i += 1) {
          const startCharCode = p.parseULong();
          const endCharCode = p.parseULong();
          let startGlyphId = p.parseULong();
          for (let c = startCharCode; c <= endCharCode; c += 1) {
            cmap.glyphIndexMap[c] = startGlyphId;
            if (format === 12) {
              startGlyphId++;
            }
          }
        }
      }
      function parseCmapTableFormat4(cmap, p, data, start, offset) {
        cmap.length = p.parseUShort();
        cmap.language = p.parseUShort();
        let segCount;
        cmap.segCount = segCount = p.parseUShort() >> 1;
        p.skip("uShort", 3);
        cmap.glyphIndexMap = {};
        const endCountParser = new parse_default.Parser(data, start + offset + 14);
        const startCountParser = new parse_default.Parser(data, start + offset + 16 + segCount * 2);
        const idDeltaParser = new parse_default.Parser(data, start + offset + 16 + segCount * 4);
        const idRangeOffsetParser = new parse_default.Parser(data, start + offset + 16 + segCount * 6);
        let glyphIndexOffset = start + offset + 16 + segCount * 8;
        for (let i = 0; i < segCount - 1; i += 1) {
          let glyphIndex;
          const endCount = endCountParser.parseUShort();
          const startCount = startCountParser.parseUShort();
          const idDelta = idDeltaParser.parseShort();
          const idRangeOffset = idRangeOffsetParser.parseUShort();
          for (let c = startCount; c <= endCount; c += 1) {
            if (idRangeOffset !== 0) {
              glyphIndexOffset = idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2;
              glyphIndexOffset += idRangeOffset;
              glyphIndexOffset += (c - startCount) * 2;
              glyphIndex = parse_default.getUShort(data, glyphIndexOffset);
              if (glyphIndex !== 0) {
                glyphIndex = glyphIndex + idDelta & 65535;
              }
            } else {
              glyphIndex = c + idDelta & 65535;
            }
            cmap.glyphIndexMap[c] = glyphIndex;
          }
        }
      }
      function parseCmapTableFormat14(cmap, p) {
        const varSelectorList = {};
        p.skip("uLong");
        const numVarSelectorRecords = p.parseULong();
        for (let i = 0; i < numVarSelectorRecords; i += 1) {
          const varSelector = p.parseUInt24();
          const varSelectorRecord = {
            varSelector
          };
          const defaultUVSOffset = p.parseOffset32();
          const nonDefaultUVSOffset = p.parseOffset32();
          const currentOffset = p.relativeOffset;
          if (defaultUVSOffset) {
            p.relativeOffset = defaultUVSOffset;
            varSelectorRecord.defaultUVS = p.parseStruct({
              ranges: function() {
                return p.parseRecordList32({
                  startUnicodeValue: p.parseUInt24,
                  additionalCount: p.parseByte
                });
              }
            });
          }
          if (nonDefaultUVSOffset) {
            p.relativeOffset = nonDefaultUVSOffset;
            varSelectorRecord.nonDefaultUVS = p.parseStruct({
              uvsMappings: function() {
                const map = {};
                const list = p.parseRecordList32({
                  unicodeValue: p.parseUInt24,
                  glyphID: p.parseUShort
                });
                for (let i2 = 0; i2 < list.length; i2 += 1) {
                  map[list[i2].unicodeValue] = list[i2];
                }
                return map;
              }
            });
          }
          varSelectorList[varSelector] = varSelectorRecord;
          p.relativeOffset = currentOffset;
        }
        cmap.varSelectorList = varSelectorList;
      }
      function parseCmapTable(data, start) {
        const cmap = {};
        cmap.version = parse_default.getUShort(data, start);
        check_default.argument(cmap.version === 0, "cmap table version should be 0.");
        cmap.numTables = parse_default.getUShort(data, start + 2);
        let format14Parser = null;
        let format14offset = -1;
        let offset = -1;
        let platformId = null;
        let encodingId = null;
        const platform0Encodings = [0, 1, 2, 3, 4, 6];
        const platform3Encodings = [0, 1, 10];
        for (let i = cmap.numTables - 1; i >= 0; i -= 1) {
          platformId = parse_default.getUShort(data, start + 4 + i * 8);
          encodingId = parse_default.getUShort(data, start + 4 + i * 8 + 2);
          if (platformId === 3 && platform3Encodings.includes(encodingId) || platformId === 0 && platform0Encodings.includes(encodingId) || platformId === 1 && encodingId === 0) {
            if (offset > 0) continue;
            offset = parse_default.getULong(data, start + 4 + i * 8 + 4);
            if (format14Parser) {
              break;
            }
          } else if (platformId === 0 && encodingId === 5) {
            format14offset = parse_default.getULong(data, start + 4 + i * 8 + 4);
            format14Parser = new parse_default.Parser(data, start + format14offset);
            if (format14Parser.parseUShort() !== 14) {
              format14offset = -1;
              format14Parser = null;
            } else if (offset > 0) {
              break;
            }
          }
        }
        if (offset === -1) {
          throw new Error("No valid cmap sub-tables found.");
        }
        const p = new parse_default.Parser(data, start + offset);
        cmap.format = p.parseUShort();
        if (cmap.format === 0) {
          parseCmapTableFormat0(cmap, p, platformId, encodingId);
        } else if (cmap.format === 12 || cmap.format === 13) {
          parseCmapTableFormat12or13(cmap, p, cmap.format);
        } else if (cmap.format === 4) {
          parseCmapTableFormat4(cmap, p, data, start, offset);
        } else {
          throw new Error(
            "Only format 0 (platformId 1, encodingId 0), 4, 12 and 14 cmap tables are supported (found format " + cmap.format + ", platformId " + platformId + ", encodingId " + encodingId + ")."
          );
        }
        if (format14Parser) {
          parseCmapTableFormat14(cmap, format14Parser);
        }
        return cmap;
      }
      function addSegment(t, code, glyphIndex) {
        t.segments.push({
          end: code,
          start: code,
          delta: -(code - glyphIndex),
          offset: 0,
          glyphIndex
        });
      }
      function addTerminatorSegment(t) {
        t.segments.push({
          end: 65535,
          start: 65535,
          delta: 1,
          offset: 0
        });
      }
      function mergeSegments(segments) {
        if (segments.length === 0) return segments;
        const merged = [segments[0]];
        for (let i = 1; i < segments.length; i++) {
          const prev = merged[merged.length - 1];
          const curr = segments[i];
          if (prev.end + 1 === curr.start && prev.delta === curr.delta && curr.end !== 65535) {
            prev.end = curr.end;
          } else {
            merged.push(curr);
          }
        }
        return merged;
      }
      function makeCmapTable(glyphs) {
        let isPlan0Only = true;
        let i;
        for (i = glyphs.length - 1; i > 0; i -= 1) {
          const g = glyphs.get(i);
          if (g.unicode > 65535) {
            isPlan0Only = false;
            break;
          }
        }
        let cmapTable = [
          { name: "version", type: "USHORT", value: 0 },
          { name: "numTables", type: "USHORT", value: isPlan0Only ? 1 : 2 },
          // CMAP 4 header
          { name: "platformID", type: "USHORT", value: 3 },
          { name: "encodingID", type: "USHORT", value: 1 },
          { name: "offset", type: "ULONG", value: isPlan0Only ? 12 : 12 + 8 }
        ];
        if (!isPlan0Only)
          cmapTable.push(...[
            // CMAP 12 header
            { name: "cmap12PlatformID", type: "USHORT", value: 3 },
            // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
            { name: "cmap12EncodingID", type: "USHORT", value: 10 },
            { name: "cmap12Offset", type: "ULONG", value: 0 }
          ]);
        cmapTable.push(...[
          // CMAP 4 Subtable
          { name: "format", type: "USHORT", value: 4 },
          { name: "cmap4Length", type: "USHORT", value: 0 },
          { name: "language", type: "USHORT", value: 0 },
          { name: "segCountX2", type: "USHORT", value: 0 },
          { name: "searchRange", type: "USHORT", value: 0 },
          { name: "entrySelector", type: "USHORT", value: 0 },
          { name: "rangeShift", type: "USHORT", value: 0 }
        ]);
        const t = new table_default.Table("cmap", cmapTable);
        t.segments = [];
        for (i = 0; i < glyphs.length; i += 1) {
          const glyph = glyphs.get(i);
          for (let j = 0; j < glyph.unicodes.length; j += 1) {
            addSegment(t, glyph.unicodes[j], i);
          }
        }
        t.segments.sort(function(a, b) {
          return a.start - b.start;
        });
        t.segments = mergeSegments(t.segments);
        addTerminatorSegment(t);
        const segCount = t.segments.length;
        let segCountToRemove = 0;
        let endCounts = [];
        let startCounts = [];
        let idDeltas = [];
        let idRangeOffsets = [];
        let glyphIds = [];
        let cmap12Groups = [];
        for (i = 0; i < segCount; i += 1) {
          const segment = t.segments[i];
          if (segment.end <= 65535 && segment.start <= 65535) {
            endCounts.push({ name: "end_" + i, type: "USHORT", value: segment.end });
            startCounts.push({ name: "start_" + i, type: "USHORT", value: segment.start });
            idDeltas.push({ name: "idDelta_" + i, type: "SHORT", value: segment.delta });
            idRangeOffsets.push({ name: "idRangeOffset_" + i, type: "USHORT", value: segment.offset });
            if (segment.glyphId !== void 0) {
              glyphIds.push({ name: "glyph_" + i, type: "USHORT", value: segment.glyphId });
            }
          } else {
            segCountToRemove += 1;
          }
          if (!isPlan0Only && segment.glyphIndex !== void 0) {
            cmap12Groups.push({ name: "cmap12Start_" + i, type: "ULONG", value: segment.start });
            cmap12Groups.push({ name: "cmap12End_" + i, type: "ULONG", value: segment.end });
            cmap12Groups.push({ name: "cmap12Glyph_" + i, type: "ULONG", value: segment.glyphIndex });
          }
        }
        t.segCountX2 = (segCount - segCountToRemove) * 2;
        t.searchRange = Math.pow(2, Math.floor(Math.log(segCount - segCountToRemove) / Math.log(2))) * 2;
        t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
        t.rangeShift = t.segCountX2 - t.searchRange;
        for (let i2 = 0; i2 < endCounts.length; i2++) {
          t.fields.push(endCounts[i2]);
        }
        t.fields.push({ name: "reservedPad", type: "USHORT", value: 0 });
        for (let i2 = 0; i2 < startCounts.length; i2++) {
          t.fields.push(startCounts[i2]);
        }
        for (let i2 = 0; i2 < idDeltas.length; i2++) {
          t.fields.push(idDeltas[i2]);
        }
        for (let i2 = 0; i2 < idRangeOffsets.length; i2++) {
          t.fields.push(idRangeOffsets[i2]);
        }
        for (let i2 = 0; i2 < glyphIds.length; i2++) {
          t.fields.push(glyphIds[i2]);
        }
        t.cmap4Length = 14 + // Subtable header
        endCounts.length * 2 + 2 + // reservedPad
        startCounts.length * 2 + idDeltas.length * 2 + idRangeOffsets.length * 2 + glyphIds.length * 2;
        if (!isPlan0Only) {
          const cmap12Length = 16 + // Subtable header
          cmap12Groups.length * 4;
          t.cmap12Offset = 12 + 2 * 2 + 4 + t.cmap4Length;
          t.fields.push(...[
            { name: "cmap12Format", type: "USHORT", value: 12 },
            { name: "cmap12Reserved", type: "USHORT", value: 0 },
            { name: "cmap12Length", type: "ULONG", value: cmap12Length },
            { name: "cmap12Language", type: "ULONG", value: 0 },
            { name: "cmap12nGroups", type: "ULONG", value: cmap12Groups.length / 3 }
          ]);
          for (let i2 = 0; i2 < cmap12Groups.length; i2++) {
            t.fields.push(cmap12Groups[i2]);
          }
        }
        return t;
      }
      var cmap_default = { parse: parseCmapTable, make: makeCmapTable };
      var cffStandardStrings = [
        ".notdef",
        "space",
        "exclam",
        "quotedbl",
        "numbersign",
        "dollar",
        "percent",
        "ampersand",
        "quoteright",
        "parenleft",
        "parenright",
        "asterisk",
        "plus",
        "comma",
        "hyphen",
        "period",
        "slash",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "colon",
        "semicolon",
        "less",
        "equal",
        "greater",
        "question",
        "at",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "bracketleft",
        "backslash",
        "bracketright",
        "asciicircum",
        "underscore",
        "quoteleft",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "braceleft",
        "bar",
        "braceright",
        "asciitilde",
        "exclamdown",
        "cent",
        "sterling",
        "fraction",
        "yen",
        "florin",
        "section",
        "currency",
        "quotesingle",
        "quotedblleft",
        "guillemotleft",
        "guilsinglleft",
        "guilsinglright",
        "fi",
        "fl",
        "endash",
        "dagger",
        "daggerdbl",
        "periodcentered",
        "paragraph",
        "bullet",
        "quotesinglbase",
        "quotedblbase",
        "quotedblright",
        "guillemotright",
        "ellipsis",
        "perthousand",
        "questiondown",
        "grave",
        "acute",
        "circumflex",
        "tilde",
        "macron",
        "breve",
        "dotaccent",
        "dieresis",
        "ring",
        "cedilla",
        "hungarumlaut",
        "ogonek",
        "caron",
        "emdash",
        "AE",
        "ordfeminine",
        "Lslash",
        "Oslash",
        "OE",
        "ordmasculine",
        "ae",
        "dotlessi",
        "lslash",
        "oslash",
        "oe",
        "germandbls",
        "onesuperior",
        "logicalnot",
        "mu",
        "trademark",
        "Eth",
        "onehalf",
        "plusminus",
        "Thorn",
        "onequarter",
        "divide",
        "brokenbar",
        "degree",
        "thorn",
        "threequarters",
        "twosuperior",
        "registered",
        "minus",
        "eth",
        "multiply",
        "threesuperior",
        "copyright",
        "Aacute",
        "Acircumflex",
        "Adieresis",
        "Agrave",
        "Aring",
        "Atilde",
        "Ccedilla",
        "Eacute",
        "Ecircumflex",
        "Edieresis",
        "Egrave",
        "Iacute",
        "Icircumflex",
        "Idieresis",
        "Igrave",
        "Ntilde",
        "Oacute",
        "Ocircumflex",
        "Odieresis",
        "Ograve",
        "Otilde",
        "Scaron",
        "Uacute",
        "Ucircumflex",
        "Udieresis",
        "Ugrave",
        "Yacute",
        "Ydieresis",
        "Zcaron",
        "aacute",
        "acircumflex",
        "adieresis",
        "agrave",
        "aring",
        "atilde",
        "ccedilla",
        "eacute",
        "ecircumflex",
        "edieresis",
        "egrave",
        "iacute",
        "icircumflex",
        "idieresis",
        "igrave",
        "ntilde",
        "oacute",
        "ocircumflex",
        "odieresis",
        "ograve",
        "otilde",
        "scaron",
        "uacute",
        "ucircumflex",
        "udieresis",
        "ugrave",
        "yacute",
        "ydieresis",
        "zcaron",
        "exclamsmall",
        "Hungarumlautsmall",
        "dollaroldstyle",
        "dollarsuperior",
        "ampersandsmall",
        "Acutesmall",
        "parenleftsuperior",
        "parenrightsuperior",
        "266 ff",
        "onedotenleader",
        "zerooldstyle",
        "oneoldstyle",
        "twooldstyle",
        "threeoldstyle",
        "fouroldstyle",
        "fiveoldstyle",
        "sixoldstyle",
        "sevenoldstyle",
        "eightoldstyle",
        "nineoldstyle",
        "commasuperior",
        "threequartersemdash",
        "periodsuperior",
        "questionsmall",
        "asuperior",
        "bsuperior",
        "centsuperior",
        "dsuperior",
        "esuperior",
        "isuperior",
        "lsuperior",
        "msuperior",
        "nsuperior",
        "osuperior",
        "rsuperior",
        "ssuperior",
        "tsuperior",
        "ff",
        "ffi",
        "ffl",
        "parenleftinferior",
        "parenrightinferior",
        "Circumflexsmall",
        "hyphensuperior",
        "Gravesmall",
        "Asmall",
        "Bsmall",
        "Csmall",
        "Dsmall",
        "Esmall",
        "Fsmall",
        "Gsmall",
        "Hsmall",
        "Ismall",
        "Jsmall",
        "Ksmall",
        "Lsmall",
        "Msmall",
        "Nsmall",
        "Osmall",
        "Psmall",
        "Qsmall",
        "Rsmall",
        "Ssmall",
        "Tsmall",
        "Usmall",
        "Vsmall",
        "Wsmall",
        "Xsmall",
        "Ysmall",
        "Zsmall",
        "colonmonetary",
        "onefitted",
        "rupiah",
        "Tildesmall",
        "exclamdownsmall",
        "centoldstyle",
        "Lslashsmall",
        "Scaronsmall",
        "Zcaronsmall",
        "Dieresissmall",
        "Brevesmall",
        "Caronsmall",
        "Dotaccentsmall",
        "Macronsmall",
        "figuredash",
        "hypheninferior",
        "Ogoneksmall",
        "Ringsmall",
        "Cedillasmall",
        "questiondownsmall",
        "oneeighth",
        "threeeighths",
        "fiveeighths",
        "seveneighths",
        "onethird",
        "twothirds",
        "zerosuperior",
        "foursuperior",
        "fivesuperior",
        "sixsuperior",
        "sevensuperior",
        "eightsuperior",
        "ninesuperior",
        "zeroinferior",
        "oneinferior",
        "twoinferior",
        "threeinferior",
        "fourinferior",
        "fiveinferior",
        "sixinferior",
        "seveninferior",
        "eightinferior",
        "nineinferior",
        "centinferior",
        "dollarinferior",
        "periodinferior",
        "commainferior",
        "Agravesmall",
        "Aacutesmall",
        "Acircumflexsmall",
        "Atildesmall",
        "Adieresissmall",
        "Aringsmall",
        "AEsmall",
        "Ccedillasmall",
        "Egravesmall",
        "Eacutesmall",
        "Ecircumflexsmall",
        "Edieresissmall",
        "Igravesmall",
        "Iacutesmall",
        "Icircumflexsmall",
        "Idieresissmall",
        "Ethsmall",
        "Ntildesmall",
        "Ogravesmall",
        "Oacutesmall",
        "Ocircumflexsmall",
        "Otildesmall",
        "Odieresissmall",
        "OEsmall",
        "Oslashsmall",
        "Ugravesmall",
        "Uacutesmall",
        "Ucircumflexsmall",
        "Udieresissmall",
        "Yacutesmall",
        "Thornsmall",
        "Ydieresissmall",
        "001.000",
        "001.001",
        "001.002",
        "001.003",
        "Black",
        "Bold",
        "Book",
        "Light",
        "Medium",
        "Regular",
        "Roman",
        "Semibold"
      ];
      var cffISOAdobeStrings = [
        ".notdef",
        "space",
        "exclam",
        "quotedbl",
        "numbersign",
        "dollar",
        "percent",
        "ampersand",
        "quoteright",
        "parenleft",
        "parenright",
        "asterisk",
        "plus",
        "comma",
        "hyphen",
        "period",
        "slash",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "colon",
        "semicolon",
        "less",
        "equal",
        "greater",
        "question",
        "at",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "bracketleft",
        "backslash",
        "bracketright",
        "asciicircum",
        "underscore",
        "quoteleft",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "braceleft",
        "bar",
        "braceright",
        "asciitilde",
        "exclamdown",
        "cent",
        "sterling",
        "fraction",
        "yen",
        "florin",
        "section",
        "currency",
        "quotesingle",
        "quotedblleft",
        "guillemotleft",
        "guilsinglleft",
        "guilsinglright",
        "fi",
        "fl",
        "endash",
        "dagger",
        "daggerdbl",
        "periodcentered",
        "paragraph",
        "bullet",
        "quotesinglbase",
        "quotedblbase",
        "quotedblright",
        "guillemotright",
        "ellipsis",
        "perthousand",
        "questiondown",
        "grave",
        "acute",
        "circumflex",
        "tilde",
        "macron",
        "breve",
        "dotaccent",
        "dieresis",
        "ring",
        "cedilla",
        "hungarumlaut",
        "ogonek",
        "caron",
        "emdash",
        "AE",
        "ordfeminine",
        "Lslash",
        "Oslash",
        "OE",
        "ordmasculine",
        "ae",
        "dotlessi",
        "lslash",
        "oslash",
        "oe",
        "germandbls",
        "onesuperior",
        "logicalnot",
        "mu",
        "trademark",
        "Eth",
        "onehalf",
        "plusminus",
        "Thorn",
        "onequarter",
        "divide",
        "brokenbar",
        "degree",
        "thorn",
        "threequarters",
        "twosuperior",
        "registered",
        "minus",
        "eth",
        "multiply",
        "threesuperior",
        "copyright",
        "Aacute",
        "Acircumflex",
        "Adieresis",
        "Agrave",
        "Aring",
        "Atilde",
        "Ccedilla",
        "Eacute",
        "Ecircumflex",
        "Edieresis",
        "Egrave",
        "Iacute",
        "Icircumflex",
        "Idieresis",
        "Igrave",
        "Ntilde",
        "Oacute",
        "Ocircumflex",
        "Odieresis",
        "Ograve",
        "Otilde",
        "Scaron",
        "Uacute",
        "Ucircumflex",
        "Udieresis",
        "Ugrave",
        "Yacute",
        "Ydieresis",
        "Zcaron",
        "aacute",
        "acircumflex",
        "adieresis",
        "agrave",
        "aring",
        "atilde",
        "ccedilla",
        "eacute",
        "ecircumflex",
        "edieresis",
        "egrave",
        "iacute",
        "icircumflex",
        "idieresis",
        "igrave",
        "ntilde",
        "oacute",
        "ocircumflex",
        "odieresis",
        "ograve",
        "otilde",
        "scaron",
        "uacute",
        "ucircumflex",
        "udieresis",
        "ugrave",
        "yacute",
        "ydieresis",
        "zcaron"
      ];
      var cffIExpertStrings = [
        ".notdef",
        "space",
        "exclamsmall",
        "Hungarumlautsmall",
        "dollaroldstyle",
        "dollarsuperior",
        "ampersandsmall",
        "Acutesmall",
        "parenleftsuperior",
        "parenrightsuperior",
        "twodotenleader",
        "onedotenleader",
        "comma",
        "hyphen",
        "period",
        "fraction",
        "zerooldstyle",
        "oneoldstyle",
        "twooldstyle",
        "threeoldstyle",
        "fouroldstyle",
        "fiveoldstyle",
        "sixoldstyle",
        "sevenoldstyle",
        "eightoldstyle",
        "nineoldstyle",
        "colon",
        "semicolon",
        "commasuperior",
        "threequartersemdash",
        "periodsuperior",
        "questionsmall",
        "asuperior",
        "bsuperior",
        "centsuperior",
        "dsuperior",
        "esuperior",
        "isuperior",
        "lsuperior",
        "msuperior",
        "nsuperior",
        "osuperior",
        "rsuperior",
        "ssuperior",
        "tsuperior",
        "ff",
        "fi",
        "fl",
        "ffi",
        "ffl",
        "parenleftinferior",
        "parenrightinferior",
        "Circumflexsmall",
        "hyphensuperior",
        "Gravesmall",
        "Asmall",
        "Bsmall",
        "Csmall",
        "Dsmall",
        "Esmall",
        "Fsmall",
        "Gsmall",
        "Hsmall",
        "Ismall",
        "Jsmall",
        "Ksmall",
        "Lsmall",
        "Msmall",
        "Nsmall",
        "Osmall",
        "Psmall",
        "Qsmall",
        "Rsmall",
        "Ssmall",
        "Tsmall",
        "Usmall",
        "Vsmall",
        "Wsmall",
        "Xsmall",
        "Ysmall",
        "Zsmall",
        "colonmonetary",
        "onefitted",
        "rupiah",
        "Tildesmall",
        "exclamdownsmall",
        "centoldstyle",
        "Lslashsmall",
        "Scaronsmall",
        "Zcaronsmall",
        "Dieresissmall",
        "Brevesmall",
        "Caronsmall",
        "Dotaccentsmall",
        "Macronsmall",
        "figuredash",
        "hypheninferior",
        "Ogoneksmall",
        "Ringsmall",
        "Cedillasmall",
        "onequarter",
        "onehalf",
        "threequarters",
        "questiondownsmall",
        "oneeighth",
        "threeeighths",
        "fiveeighths",
        "seveneighths",
        "onethird",
        "twothirds",
        "zerosuperior",
        "onesuperior",
        "twosuperior",
        "threesuperior",
        "foursuperior",
        "fivesuperior",
        "sixsuperior",
        "sevensuperior",
        "eightsuperior",
        "ninesuperior",
        "zeroinferior",
        "oneinferior",
        "twoinferior",
        "threeinferior",
        "fourinferior",
        "fiveinferior",
        "sixinferior",
        "seveninferior",
        "eightinferior",
        "nineinferior",
        "centinferior",
        "dollarinferior",
        "periodinferior",
        "commainferior",
        "Agravesmall",
        "Aacutesmall",
        "Acircumflexsmall",
        "Atildesmall",
        "Adieresissmall",
        "Aringsmall",
        "AEsmall",
        "Ccedillasmall",
        "Egravesmall",
        "Eacutesmall",
        "Ecircumflexsmall",
        "Edieresissmall",
        "Igravesmall",
        "Iacutesmall",
        "Icircumflexsmall",
        "Idieresissmall",
        "Ethsmall",
        "Ntildesmall",
        "Ogravesmall",
        "Oacutesmall",
        "Ocircumflexsmall",
        "Otildesmall",
        "Odieresissmall",
        "OEsmall",
        "Oslashsmall",
        "Ugravesmall",
        "Uacutesmall",
        "Ucircumflexsmall",
        "Udieresissmall",
        "Yacutesmall",
        "Thornsmall",
        "Ydieresissmall"
      ];
      var cffExpertSubsetStrings = [
        ".notdef",
        "space",
        "dollaroldstyle",
        "dollarsuperior",
        "parenleftsuperior",
        "parenrightsuperior",
        "twodotenleader",
        "onedotenleader",
        "comma",
        "hyphen",
        "period",
        "fraction",
        "zerooldstyle",
        "oneoldstyle",
        "twooldstyle",
        "threeoldstyle",
        "fouroldstyle",
        "fiveoldstyle",
        "sixoldstyle",
        "sevenoldstyle",
        "eightoldstyle",
        "nineoldstyle",
        "colon",
        "semicolon",
        "commasuperior",
        "threequartersemdash",
        "periodsuperior",
        "asuperior",
        "bsuperior",
        "centsuperior",
        "dsuperior",
        "esuperior",
        "isuperior",
        "lsuperior",
        "msuperior",
        "nsuperior",
        "osuperior",
        "rsuperior",
        "ssuperior",
        "tsuperior",
        "ff",
        "fi",
        "fl",
        "ffi",
        "ffl",
        "parenleftinferior",
        "parenrightinferior",
        "hyphensuperior",
        "colonmonetary",
        "onefitted",
        "rupiah",
        "centoldstyle",
        "figuredash",
        "hypheninferior",
        "onequarter",
        "onehalf",
        "threequarters",
        "oneeighth",
        "threeeighths",
        "fiveeighths",
        "seveneighths",
        "onethird",
        "twothirds",
        "zerosuperior",
        "onesuperior",
        "twosuperior",
        "threesuperior",
        "foursuperior",
        "fivesuperior",
        "sixsuperior",
        "sevensuperior",
        "eightsuperior",
        "ninesuperior",
        "zeroinferior",
        "oneinferior",
        "twoinferior",
        "threeinferior",
        "fourinferior",
        "fiveinferior",
        "sixinferior",
        "seveninferior",
        "eightinferior",
        "nineinferior",
        "centinferior",
        "dollarinferior",
        "periodinferior",
        "commainferior"
      ];
      var cffStandardEncoding = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "space",
        "exclam",
        "quotedbl",
        "numbersign",
        "dollar",
        "percent",
        "ampersand",
        "quoteright",
        "parenleft",
        "parenright",
        "asterisk",
        "plus",
        "comma",
        "hyphen",
        "period",
        "slash",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "colon",
        "semicolon",
        "less",
        "equal",
        "greater",
        "question",
        "at",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "bracketleft",
        "backslash",
        "bracketright",
        "asciicircum",
        "underscore",
        "quoteleft",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "braceleft",
        "bar",
        "braceright",
        "asciitilde",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "exclamdown",
        "cent",
        "sterling",
        "fraction",
        "yen",
        "florin",
        "section",
        "currency",
        "quotesingle",
        "quotedblleft",
        "guillemotleft",
        "guilsinglleft",
        "guilsinglright",
        "fi",
        "fl",
        "",
        "endash",
        "dagger",
        "daggerdbl",
        "periodcentered",
        "",
        "paragraph",
        "bullet",
        "quotesinglbase",
        "quotedblbase",
        "quotedblright",
        "guillemotright",
        "ellipsis",
        "perthousand",
        "",
        "questiondown",
        "",
        "grave",
        "acute",
        "circumflex",
        "tilde",
        "macron",
        "breve",
        "dotaccent",
        "dieresis",
        "",
        "ring",
        "cedilla",
        "",
        "hungarumlaut",
        "ogonek",
        "caron",
        "emdash",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "AE",
        "",
        "ordfeminine",
        "",
        "",
        "",
        "",
        "Lslash",
        "Oslash",
        "OE",
        "ordmasculine",
        "",
        "",
        "",
        "",
        "",
        "ae",
        "",
        "",
        "",
        "dotlessi",
        "",
        "",
        "lslash",
        "oslash",
        "oe",
        "germandbls"
      ];
      var cffExpertEncoding = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "space",
        "exclamsmall",
        "Hungarumlautsmall",
        "",
        "dollaroldstyle",
        "dollarsuperior",
        "ampersandsmall",
        "Acutesmall",
        "parenleftsuperior",
        "parenrightsuperior",
        "twodotenleader",
        "onedotenleader",
        "comma",
        "hyphen",
        "period",
        "fraction",
        "zerooldstyle",
        "oneoldstyle",
        "twooldstyle",
        "threeoldstyle",
        "fouroldstyle",
        "fiveoldstyle",
        "sixoldstyle",
        "sevenoldstyle",
        "eightoldstyle",
        "nineoldstyle",
        "colon",
        "semicolon",
        "commasuperior",
        "threequartersemdash",
        "periodsuperior",
        "questionsmall",
        "",
        "asuperior",
        "bsuperior",
        "centsuperior",
        "dsuperior",
        "esuperior",
        "",
        "",
        "isuperior",
        "",
        "",
        "lsuperior",
        "msuperior",
        "nsuperior",
        "osuperior",
        "",
        "",
        "rsuperior",
        "ssuperior",
        "tsuperior",
        "",
        "ff",
        "fi",
        "fl",
        "ffi",
        "ffl",
        "parenleftinferior",
        "",
        "parenrightinferior",
        "Circumflexsmall",
        "hyphensuperior",
        "Gravesmall",
        "Asmall",
        "Bsmall",
        "Csmall",
        "Dsmall",
        "Esmall",
        "Fsmall",
        "Gsmall",
        "Hsmall",
        "Ismall",
        "Jsmall",
        "Ksmall",
        "Lsmall",
        "Msmall",
        "Nsmall",
        "Osmall",
        "Psmall",
        "Qsmall",
        "Rsmall",
        "Ssmall",
        "Tsmall",
        "Usmall",
        "Vsmall",
        "Wsmall",
        "Xsmall",
        "Ysmall",
        "Zsmall",
        "colonmonetary",
        "onefitted",
        "rupiah",
        "Tildesmall",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "exclamdownsmall",
        "centoldstyle",
        "Lslashsmall",
        "",
        "",
        "Scaronsmall",
        "Zcaronsmall",
        "Dieresissmall",
        "Brevesmall",
        "Caronsmall",
        "",
        "Dotaccentsmall",
        "",
        "",
        "Macronsmall",
        "",
        "",
        "figuredash",
        "hypheninferior",
        "",
        "",
        "Ogoneksmall",
        "Ringsmall",
        "Cedillasmall",
        "",
        "",
        "",
        "onequarter",
        "onehalf",
        "threequarters",
        "questiondownsmall",
        "oneeighth",
        "threeeighths",
        "fiveeighths",
        "seveneighths",
        "onethird",
        "twothirds",
        "",
        "",
        "zerosuperior",
        "onesuperior",
        "twosuperior",
        "threesuperior",
        "foursuperior",
        "fivesuperior",
        "sixsuperior",
        "sevensuperior",
        "eightsuperior",
        "ninesuperior",
        "zeroinferior",
        "oneinferior",
        "twoinferior",
        "threeinferior",
        "fourinferior",
        "fiveinferior",
        "sixinferior",
        "seveninferior",
        "eightinferior",
        "nineinferior",
        "centinferior",
        "dollarinferior",
        "periodinferior",
        "commainferior",
        "Agravesmall",
        "Aacutesmall",
        "Acircumflexsmall",
        "Atildesmall",
        "Adieresissmall",
        "Aringsmall",
        "AEsmall",
        "Ccedillasmall",
        "Egravesmall",
        "Eacutesmall",
        "Ecircumflexsmall",
        "Edieresissmall",
        "Igravesmall",
        "Iacutesmall",
        "Icircumflexsmall",
        "Idieresissmall",
        "Ethsmall",
        "Ntildesmall",
        "Ogravesmall",
        "Oacutesmall",
        "Ocircumflexsmall",
        "Otildesmall",
        "Odieresissmall",
        "OEsmall",
        "Oslashsmall",
        "Ugravesmall",
        "Uacutesmall",
        "Ucircumflexsmall",
        "Udieresissmall",
        "Yacutesmall",
        "Thornsmall",
        "Ydieresissmall"
      ];
      var standardNames = [
        ".notdef",
        ".null",
        "nonmarkingreturn",
        "space",
        "exclam",
        "quotedbl",
        "numbersign",
        "dollar",
        "percent",
        "ampersand",
        "quotesingle",
        "parenleft",
        "parenright",
        "asterisk",
        "plus",
        "comma",
        "hyphen",
        "period",
        "slash",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "colon",
        "semicolon",
        "less",
        "equal",
        "greater",
        "question",
        "at",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "bracketleft",
        "backslash",
        "bracketright",
        "asciicircum",
        "underscore",
        "grave",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "braceleft",
        "bar",
        "braceright",
        "asciitilde",
        "Adieresis",
        "Aring",
        "Ccedilla",
        "Eacute",
        "Ntilde",
        "Odieresis",
        "Udieresis",
        "aacute",
        "agrave",
        "acircumflex",
        "adieresis",
        "atilde",
        "aring",
        "ccedilla",
        "eacute",
        "egrave",
        "ecircumflex",
        "edieresis",
        "iacute",
        "igrave",
        "icircumflex",
        "idieresis",
        "ntilde",
        "oacute",
        "ograve",
        "ocircumflex",
        "odieresis",
        "otilde",
        "uacute",
        "ugrave",
        "ucircumflex",
        "udieresis",
        "dagger",
        "degree",
        "cent",
        "sterling",
        "section",
        "bullet",
        "paragraph",
        "germandbls",
        "registered",
        "copyright",
        "trademark",
        "acute",
        "dieresis",
        "notequal",
        "AE",
        "Oslash",
        "infinity",
        "plusminus",
        "lessequal",
        "greaterequal",
        "yen",
        "mu",
        "partialdiff",
        "summation",
        "product",
        "pi",
        "integral",
        "ordfeminine",
        "ordmasculine",
        "Omega",
        "ae",
        "oslash",
        "questiondown",
        "exclamdown",
        "logicalnot",
        "radical",
        "florin",
        "approxequal",
        "Delta",
        "guillemotleft",
        "guillemotright",
        "ellipsis",
        "nonbreakingspace",
        "Agrave",
        "Atilde",
        "Otilde",
        "OE",
        "oe",
        "endash",
        "emdash",
        "quotedblleft",
        "quotedblright",
        "quoteleft",
        "quoteright",
        "divide",
        "lozenge",
        "ydieresis",
        "Ydieresis",
        "fraction",
        "currency",
        "guilsinglleft",
        "guilsinglright",
        "fi",
        "fl",
        "daggerdbl",
        "periodcentered",
        "quotesinglbase",
        "quotedblbase",
        "perthousand",
        "Acircumflex",
        "Ecircumflex",
        "Aacute",
        "Edieresis",
        "Egrave",
        "Iacute",
        "Icircumflex",
        "Idieresis",
        "Igrave",
        "Oacute",
        "Ocircumflex",
        "apple",
        "Ograve",
        "Uacute",
        "Ucircumflex",
        "Ugrave",
        "dotlessi",
        "circumflex",
        "tilde",
        "macron",
        "breve",
        "dotaccent",
        "ring",
        "cedilla",
        "hungarumlaut",
        "ogonek",
        "caron",
        "Lslash",
        "lslash",
        "Scaron",
        "scaron",
        "Zcaron",
        "zcaron",
        "brokenbar",
        "Eth",
        "eth",
        "Yacute",
        "yacute",
        "Thorn",
        "thorn",
        "minus",
        "multiply",
        "onesuperior",
        "twosuperior",
        "threesuperior",
        "onehalf",
        "onequarter",
        "threequarters",
        "franc",
        "Gbreve",
        "gbreve",
        "Idotaccent",
        "Scedilla",
        "scedilla",
        "Cacute",
        "cacute",
        "Ccaron",
        "ccaron",
        "dcroat"
      ];
      function DefaultEncoding(font) {
        this.font = font;
      }
      DefaultEncoding.prototype.charToGlyphIndex = function(c) {
        const code = c.codePointAt(0);
        const glyphs = this.font.glyphs;
        if (glyphs) {
          for (let i = 0; i < glyphs.length; i += 1) {
            const glyph = glyphs.get(i);
            for (let j = 0; j < glyph.unicodes.length; j += 1) {
              if (glyph.unicodes[j] === code) {
                return i;
              }
            }
          }
        }
        return null;
      };
      function CmapEncoding(cmap) {
        this.cmap = cmap;
      }
      CmapEncoding.prototype.charToGlyphIndex = function(c) {
        return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
      };
      function CffEncoding(encoding, charset) {
        this.encoding = encoding;
        this.charset = charset;
      }
      CffEncoding.prototype.charToGlyphIndex = function(s) {
        const code = s.codePointAt(0);
        const charName = this.encoding[code];
        return this.charset.indexOf(charName);
      };
      function GlyphNames(post) {
        switch (post.version) {
          case 1:
            this.names = standardNames.slice();
            break;
          case 2:
            this.names = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
              if (post.glyphNameIndex[i] < standardNames.length) {
                this.names[i] = standardNames[post.glyphNameIndex[i]];
              } else {
                this.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
              }
            }
            break;
          case 2.5:
            this.names = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
              this.names[i] = standardNames[i + post.glyphNameIndex[i]];
            }
            break;
          case 3:
            this.names = [];
            break;
          default:
            this.names = [];
            break;
        }
      }
      GlyphNames.prototype.nameToGlyphIndex = function(name) {
        return this.names.indexOf(name);
      };
      GlyphNames.prototype.glyphIndexToName = function(gid) {
        return this.names[gid];
      };
      function addGlyphNamesAll(font) {
        let glyph;
        const glyphIndexMap = font.tables.cmap.glyphIndexMap;
        const charCodes = Object.keys(glyphIndexMap);
        for (let i = 0; i < charCodes.length; i += 1) {
          const c = charCodes[i];
          const glyphIndex = glyphIndexMap[c];
          glyph = font.glyphs.get(glyphIndex);
          glyph.addUnicode(parseInt(c));
        }
        for (let i = 0; i < font.glyphs.length; i += 1) {
          glyph = font.glyphs.get(i);
          if (font.cffEncoding) {
            glyph.name = font.cffEncoding.charset[i];
          } else if (font.glyphNames.names) {
            glyph.name = font.glyphNames.glyphIndexToName(i);
          }
        }
      }
      function addGlyphNamesToUnicodeMap(font) {
        font._IndexToUnicodeMap = {};
        const glyphIndexMap = font.tables.cmap.glyphIndexMap;
        const charCodes = Object.keys(glyphIndexMap);
        for (let i = 0; i < charCodes.length; i += 1) {
          const c = charCodes[i];
          let glyphIndex = glyphIndexMap[c];
          if (font._IndexToUnicodeMap[glyphIndex] === void 0) {
            font._IndexToUnicodeMap[glyphIndex] = {
              unicodes: [parseInt(c)]
            };
          } else {
            font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c));
          }
        }
      }
      function addGlyphNames(font, opt) {
        if (opt.lowMemory) {
          addGlyphNamesToUnicodeMap(font);
        } else {
          addGlyphNamesAll(font);
        }
      }
      function line(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      var draw_default = { line };
      function parseCpalTable(data, start) {
        const p = new Parser(data, start);
        const version = p.parseShort();
        if (version !== 0) {
          console.warn("Only CPALv0 is currently fully supported.");
        }
        const numPaletteEntries = p.parseShort();
        const numPalettes = p.parseShort();
        const numColorRecords = p.parseShort();
        const colorRecordsArrayOffset = p.parseOffset32();
        const colorRecordIndices = p.parseUShortList(numPalettes);
        p.relativeOffset = colorRecordsArrayOffset;
        const colorRecords = p.parseULongList(numColorRecords);
        p.relativeOffset = colorRecordsArrayOffset;
        return {
          version,
          numPaletteEntries,
          colorRecords,
          colorRecordIndices
        };
      }
      function makeCpalTable({ version = 0, numPaletteEntries = 0, colorRecords = [], colorRecordIndices = [0] }) {
        check_default.argument(version === 0, "Only CPALv0 are supported.");
        check_default.argument(colorRecords.length, "No colorRecords given.");
        check_default.argument(colorRecordIndices.length, "No colorRecordIndices given.");
        if (colorRecordIndices.length > 1) {
          check_default.argument(numPaletteEntries, "Can't infer numPaletteEntries on multiple colorRecordIndices");
        }
        return new table_default.Table("CPAL", [
          { name: "version", type: "USHORT", value: version },
          { name: "numPaletteEntries", type: "USHORT", value: numPaletteEntries || colorRecords.length },
          { name: "numPalettes", type: "USHORT", value: colorRecordIndices.length },
          { name: "numColorRecords", type: "USHORT", value: colorRecords.length },
          { name: "colorRecordsArrayOffset", type: "ULONG", value: 12 + 2 * colorRecordIndices.length },
          ...colorRecordIndices.map((palette, i) => ({ name: "colorRecordIndices_" + i, type: "USHORT", value: palette })),
          ...colorRecords.map((color, i) => ({ name: "colorRecords_" + i, type: "ULONG", value: color }))
        ]);
      }
      function parseCPALColor(bgra) {
        var b = (bgra & 4278190080) >> 24;
        var g = (bgra & 16711680) >> 16;
        var r = (bgra & 65280) >> 8;
        var a = bgra & 255;
        b = b + 256 & 255;
        g = g + 256 & 255;
        r = r + 256 & 255;
        a = (a + 256 & 255) / 255;
        return { b, g, r, a };
      }
      function getPaletteColor(font, index, palette = 0, colorFormat = "hexa") {
        if (index == 65535) {
          return "currentColor";
        }
        const cpalTable = font && font.tables && font.tables.cpal;
        if (!cpalTable) return "currentColor";
        if (palette > cpalTable.colorRecordIndices.length - 1) {
          throw new Error(`Palette index out of range (colorRecordIndices.length: ${cpalTable.colorRecordIndices.length}, index: ${index})`);
        }
        if (index > cpalTable.numPaletteEntries) {
          throw new Error(`Color index out of range (numPaletteEntries: ${cpalTable.numPaletteEntries}, index: ${index})`);
        }
        const lookupIndex = cpalTable.colorRecordIndices[palette] + index;
        if (lookupIndex > cpalTable.colorRecords) {
          throw new Error(`Color index out of range (colorRecords.length: ${cpalTable.colorRecords.length}, lookupIndex: ${lookupIndex})`);
        }
        const color = parseCPALColor(cpalTable.colorRecords[lookupIndex]);
        if (colorFormat === "bgra") {
          return color;
        }
        return formatColor(color, colorFormat);
      }
      function toHex(d) {
        return ("0" + parseInt(d).toString(16)).slice(-2);
      }
      function rgbToHSL(bgra) {
        const r = bgra.r / 255;
        const g = bgra.g / 255;
        const b = bgra.b / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return {
          h: h * 360,
          s: s * 100,
          l: l * 100
        };
      }
      function hslToRGB(hsla) {
        let { h, s, l, a } = hsla;
        h = h % 360;
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(h / 60 % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (60 <= h && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (120 <= h && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (180 <= h && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (240 <= h && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (300 <= h && h <= 360) {
          r = c;
          g = 0;
          b = x;
        }
        return {
          r: Math.round((r + m) * 255),
          g: Math.round((g + m) * 255),
          b: Math.round((b + m) * 255),
          a
        };
      }
      function bgraToRaw(color) {
        return parseInt(`0x${toHex(color.b)}${toHex(color.g)}${toHex(color.r)}${toHex(color.a * 255)}`, 16);
      }
      function parseColor(color, targetFormat = "hexa") {
        const returnRaw = targetFormat == "raw" || targetFormat == "cpal";
        const isRaw = Number.isInteger(color);
        let validFormat = true;
        if (isRaw && returnRaw || color === "currentColor") {
          return color;
        } else if (typeof color === "object") {
          if (targetFormat == "bgra") {
            return color;
          }
          if (returnRaw) {
            return bgraToRaw(color);
          }
        } else if (!isRaw && /^#([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(color.trim())) {
          color = color.trim().substring(1);
          switch (color.length) {
            case 3:
              color = {
                r: parseInt(color[0].repeat(2), 16),
                g: parseInt(color[1].repeat(2), 16),
                b: parseInt(color[2].repeat(2), 16),
                a: 1
              };
              break;
            case 4:
              color = {
                r: parseInt(color[0].repeat(2), 16),
                g: parseInt(color[1].repeat(2), 16),
                b: parseInt(color[2].repeat(2), 16),
                a: parseInt(color[3].repeat(2), 16) / 255
              };
              break;
            case 6:
              color = {
                r: parseInt(color[0] + color[1], 16),
                g: parseInt(color[2] + color[3], 16),
                b: parseInt(color[4] + color[5], 16),
                a: 1
              };
              break;
            case 8:
              color = {
                r: parseInt(color[0] + color[1], 16),
                g: parseInt(color[2] + color[3], 16),
                b: parseInt(color[4] + color[5], 16),
                a: parseInt(color[6] + color[7], 16) / 255
              };
              break;
          }
          if (targetFormat == "bgra") {
            return color;
          }
        } else if (typeof document !== "undefined" && /^[a-z]+$/i.test(color)) {
          const ctx = document.createElement("canvas").getContext("2d");
          ctx.fillStyle = color;
          const detectedColor = formatColor(ctx.fillStyle, "hexa");
          if (detectedColor === "#000000ff" && color.toLowerCase() !== "black") {
            validFormat = false;
          } else {
            color = detectedColor;
          }
        } else {
          color = color.trim();
          const rgbaRegex = /rgba?\(\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;
          if (rgbaRegex.test(color)) {
            const matches = color.match(rgbaRegex).filter((i) => typeof i !== "undefined");
            color = {
              r: Math.round(parseFloat(matches[1]) / (matches[2] ? 100 / 255 : 1)),
              g: Math.round(parseFloat(matches[3]) / (matches[4] ? 100 / 255 : 1)),
              b: Math.round(parseFloat(matches[5]) / (matches[6] ? 100 / 255 : 1)),
              a: !matches[7] ? 1 : parseFloat(matches[7]) / (matches[8] ? 100 : 1)
            };
          } else {
            const hslaRegex = /hsla?\(\s*(?:(\d*\.\d+|\d+)(deg|turn|))\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;
            if (hslaRegex.test(color)) {
              const matches = color.match(hslaRegex).filter((i) => typeof i !== "undefined");
              color = hslToRGB({
                h: parseFloat(matches[1]) * (matches[2] === "turn" ? 360 : 1),
                s: parseFloat(matches[3]),
                l: parseFloat(matches[4]),
                a: !matches[5] ? 1 : parseFloat(matches[5]) / (matches[6] ? 100 : 1)
              });
            } else {
              validFormat = false;
            }
          }
        }
        if (!validFormat) {
          throw new Error(`Invalid color format: ${color}`);
        }
        return formatColor(color, targetFormat);
      }
      function formatColor(bgra, format = "hexa") {
        if (bgra === "currentColor") return bgra;
        if (Number.isInteger(bgra)) {
          if (format == "raw" || format == "cpal") {
            return bgra;
          }
          bgra = parseCPALColor(bgra);
        } else if (typeof bgra !== "object") {
          bgra = parseColor(bgra, "bgra");
        }
        let hsl = ["hsl", "hsla"].includes(format) ? rgbToHSL(bgra) : null;
        switch (format) {
          case "rgba":
            return `rgba(${bgra.r}, ${bgra.g}, ${bgra.b}, ${parseFloat(bgra.a.toFixed(3))})`;
          case "rgb":
            return `rgb(${bgra.r}, ${bgra.g}, ${bgra.b})`;
          case "hex":
          case "hex6":
          case "hex-6":
            return `#${toHex(bgra.r)}${toHex(bgra.g)}${toHex(bgra.b)}`;
          case "hexa":
          case "hex8":
          case "hex-8":
            return `#${toHex(bgra.r)}${toHex(bgra.g)}${toHex(bgra.b)}${toHex(bgra.a * 255)}`;
          case "hsl":
            return `hsl(${hsl.h.toFixed(2)}, ${hsl.s.toFixed(2)}%, ${hsl.l.toFixed(2)}%)`;
          case "hsla":
            return `hsla(${hsl.h.toFixed(2)}, ${hsl.s.toFixed(2)}%, ${hsl.l.toFixed(2)}%, ${parseFloat(bgra.a.toFixed(3))})`;
          case "bgra":
            return bgra;
          case "raw":
          case "cpal":
            return bgraToRaw(bgra);
          default:
            throw new Error("Unknown color format: " + format);
        }
      }
      var cpal_default = { parse: parseCpalTable, make: makeCpalTable, getPaletteColor, parseColor, formatColor };
      function getPathDefinition(glyph, path) {
        let _path = path || new path_default();
        return {
          configurable: true,
          get: function() {
            if (typeof _path === "function") {
              _path = _path();
            }
            return _path;
          },
          set: function(p) {
            _path = p;
          }
        };
      }
      function Glyph(options) {
        this.bindConstructorValues(options);
      }
      Glyph.prototype.bindConstructorValues = function(options) {
        this.index = options.index || 0;
        if (options.name === ".notdef") {
          options.unicode = void 0;
        } else if (options.name === ".null") {
          options.unicode = 0;
        }
        if (options.unicode === 0 && options.name !== ".null") {
          throw new Error('The unicode value "0" is reserved for the glyph name ".null" and cannot be used by any other glyph.');
        }
        this.name = options.name || null;
        this.unicode = options.unicode;
        this.unicodes = options.unicodes || (options.unicode !== void 0 ? [options.unicode] : []);
        if ("xMin" in options) {
          this.xMin = options.xMin;
        }
        if ("yMin" in options) {
          this.yMin = options.yMin;
        }
        if ("xMax" in options) {
          this.xMax = options.xMax;
        }
        if ("yMax" in options) {
          this.yMax = options.yMax;
        }
        if ("advanceWidth" in options) {
          this.advanceWidth = options.advanceWidth;
        }
        if ("leftSideBearing" in options) {
          this.leftSideBearing = options.leftSideBearing;
        }
        if ("points" in options) {
          this.points = options.points;
        }
        Object.defineProperty(this, "path", getPathDefinition(this, options.path));
      };
      Glyph.prototype.addUnicode = function(unicode) {
        if (this.unicodes.length === 0) {
          this.unicode = unicode;
        }
        this.unicodes.push(unicode);
      };
      Glyph.prototype.getBoundingBox = function() {
        return this.path.getBoundingBox();
      };
      Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
        x = x !== void 0 ? x : 0;
        y = y !== void 0 ? y : 0;
        fontSize = fontSize !== void 0 ? fontSize : 72;
        options = Object.assign({}, font && font.defaultRenderOptions, options);
        let commands;
        let hPoints;
        let xScale = options.xScale;
        let yScale = options.yScale;
        const scale = 1 / (this.path.unitsPerEm || 1e3) * fontSize;
        let useGlyph = this;
        if (font && font.variation) {
          useGlyph = font.variation.getTransform(this, options.variation);
          commands = useGlyph.path.commands;
        }
        if (options.hinting && font && font.hinting) {
          hPoints = useGlyph.path && font.hinting.exec(useGlyph, fontSize, options);
        }
        if (hPoints) {
          commands = font.hinting.getCommands(hPoints);
          x = Math.round(x);
          y = Math.round(y);
          xScale = yScale = 1;
        } else {
          commands = useGlyph.path.commands;
          if (xScale === void 0) xScale = scale;
          if (yScale === void 0) yScale = scale;
        }
        const p = new path_default();
        if (options.drawSVG) {
          const svgImage = this.getSvgImage(font);
          if (svgImage) {
            const layer = new path_default();
            layer._image = {
              image: svgImage.image,
              x: x + svgImage.leftSideBearing * scale,
              y: y - svgImage.baseline * scale,
              width: svgImage.image.width * scale,
              height: svgImage.image.height * scale
            };
            p._layers = [layer];
            return p;
          }
        }
        if (options.drawLayers) {
          const layers = this.getLayers(font);
          if (layers && layers.length) {
            p._layers = [];
            for (let i = 0; i < layers.length; i += 1) {
              const layer = layers[i];
              let color = getPaletteColor(font, layer.paletteIndex, options.usePalette);
              if (color === "currentColor") {
                color = options.fill || "black";
              } else {
                color = formatColor(color, options.colorFormat || "rgba");
              }
              options = Object.assign({}, options, { fill: color });
              p._layers.push(this.getPath.call(layer.glyph, x, y, fontSize, options, font));
            }
            return p;
          }
        }
        p.fill = options.fill || this.path.fill;
        p.stroke = this.path.stroke;
        p.strokeWidth = this.path.strokeWidth * scale;
        for (let i = 0; i < commands.length; i += 1) {
          const cmd = commands[i];
          if (cmd.type === "M") {
            p.moveTo(x + cmd.x * xScale, y + -cmd.y * yScale);
          } else if (cmd.type === "L") {
            p.lineTo(x + cmd.x * xScale, y + -cmd.y * yScale);
          } else if (cmd.type === "Q") {
            p.quadraticCurveTo(
              x + cmd.x1 * xScale,
              y + -cmd.y1 * yScale,
              x + cmd.x * xScale,
              y + -cmd.y * yScale
            );
          } else if (cmd.type === "C") {
            p.curveTo(
              x + cmd.x1 * xScale,
              y + -cmd.y1 * yScale,
              x + cmd.x2 * xScale,
              y + -cmd.y2 * yScale,
              x + cmd.x * xScale,
              y + -cmd.y * yScale
            );
          } else if (cmd.type === "Z" && p.stroke && p.strokeWidth) {
            p.closePath();
          }
        }
        return p;
      };
      Glyph.prototype.getLayers = function(font) {
        if (!font) {
          throw new Error("The font object is required to read the colr/cpal tables in order to get the layers.");
        }
        return font.layers.get(this.index);
      };
      Glyph.prototype.getSvgImage = function(font) {
        if (!font) {
          throw new Error("The font object is required to read the svg table in order to get the image.");
        }
        return font.svgImages.get(this.index);
      };
      Glyph.prototype.getContours = function(transformedPoints = null) {
        if (this.points === void 0 && !transformedPoints) {
          return [];
        }
        const contours = [];
        let currentContour = [];
        let points = transformedPoints ? transformedPoints : this.points;
        for (let i = 0; i < points.length; i += 1) {
          const pt = points[i];
          currentContour.push(pt);
          if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
          }
        }
        check_default.argument(currentContour.length === 0, "There are still points left in the current contour.");
        return contours;
      };
      Glyph.prototype.getMetrics = function() {
        const commands = this.path.commands;
        const xCoords = [];
        const yCoords = [];
        for (let i = 0; i < commands.length; i += 1) {
          const cmd = commands[i];
          if (cmd.type !== "Z") {
            xCoords.push(cmd.x);
            yCoords.push(cmd.y);
          }
          if (cmd.type === "Q" || cmd.type === "C") {
            xCoords.push(cmd.x1);
            yCoords.push(cmd.y1);
          }
          if (cmd.type === "C") {
            xCoords.push(cmd.x2);
            yCoords.push(cmd.y2);
          }
        }
        const metrics = {
          xMin: Math.min.apply(null, xCoords),
          yMin: Math.min.apply(null, yCoords),
          xMax: Math.max.apply(null, xCoords),
          yMax: Math.max.apply(null, yCoords),
          leftSideBearing: this.leftSideBearing
        };
        if (!isFinite(metrics.xMin)) {
          metrics.xMin = 0;
        }
        if (!isFinite(metrics.xMax)) {
          metrics.xMax = this.advanceWidth;
        }
        if (!isFinite(metrics.yMin)) {
          metrics.yMin = 0;
        }
        if (!isFinite(metrics.yMax)) {
          metrics.yMax = 0;
        }
        metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
        return metrics;
      };
      Glyph.prototype.draw = function(ctx, x, y, fontSize, options, font) {
        options = Object.assign({}, font && font.defaultRenderOptions, options);
        const path = this.getPath(x, y, fontSize, options, font);
        path.draw(ctx);
      };
      Glyph.prototype.drawPoints = function(ctx, x, y, fontSize, options, font) {
        options = Object.assign({}, font && font.defaultRenderOptions, options);
        if (options.drawLayers) {
          const layers = this.getLayers(font);
          if (layers && layers.length) {
            for (let l = 0; l < layers.length; l += 1) {
              if (layers[l].glyph.index !== this.index) {
                this.drawPoints.call(layers[l].glyph, ctx, x, y, fontSize);
              }
            }
            return;
          }
        }
        function drawCircles(l, x2, y2, scale2) {
          ctx.beginPath();
          for (let j = 0; j < l.length; j += 1) {
            ctx.moveTo(x2 + l[j].x * scale2, y2 + l[j].y * scale2);
            ctx.arc(x2 + l[j].x * scale2, y2 + l[j].y * scale2, 2, 0, Math.PI * 2, false);
          }
          ctx.fill();
        }
        x = x !== void 0 ? x : 0;
        y = y !== void 0 ? y : 0;
        fontSize = fontSize !== void 0 ? fontSize : 24;
        const scale = 1 / this.path.unitsPerEm * fontSize;
        const blueCircles = [];
        const redCircles = [];
        const path = this.path;
        let commands = path.commands;
        if (font && font.variation) {
          commands = font.variation.getTransform(this, options.variation).path.commands;
        }
        for (let i = 0; i < commands.length; i += 1) {
          const cmd = commands[i];
          if (cmd.x !== void 0) {
            blueCircles.push({ x: cmd.x, y: -cmd.y });
          }
          if (cmd.x1 !== void 0) {
            redCircles.push({ x: cmd.x1, y: -cmd.y1 });
          }
          if (cmd.x2 !== void 0) {
            redCircles.push({ x: cmd.x2, y: -cmd.y2 });
          }
        }
        ctx.fillStyle = "blue";
        drawCircles(blueCircles, x, y, scale);
        ctx.fillStyle = "red";
        drawCircles(redCircles, x, y, scale);
      };
      Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
        let scale;
        x = x !== void 0 ? x : 0;
        y = y !== void 0 ? y : 0;
        fontSize = fontSize !== void 0 ? fontSize : 24;
        scale = 1 / this.path.unitsPerEm * fontSize;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        draw_default.line(ctx, x, -1e4, x, 1e4);
        draw_default.line(ctx, -1e4, y, 1e4, y);
        const xMin = this.xMin || 0;
        let yMin = this.yMin || 0;
        const xMax = this.xMax || 0;
        let yMax = this.yMax || 0;
        const advanceWidth = this.advanceWidth || 0;
        ctx.strokeStyle = "blue";
        draw_default.line(ctx, x + xMin * scale, -1e4, x + xMin * scale, 1e4);
        draw_default.line(ctx, x + xMax * scale, -1e4, x + xMax * scale, 1e4);
        draw_default.line(ctx, -1e4, y + -yMin * scale, 1e4, y + -yMin * scale);
        draw_default.line(ctx, -1e4, y + -yMax * scale, 1e4, y + -yMax * scale);
        ctx.strokeStyle = "green";
        draw_default.line(ctx, x + advanceWidth * scale, -1e4, x + advanceWidth * scale, 1e4);
      };
      Glyph.prototype.toPathData = function(options, font) {
        options = Object.assign({}, { variation: font && font.defaultRenderOptions.variation }, options);
        let useGlyph = this;
        if (font && font.variation) {
          useGlyph = font.variation.getTransform(this, options.variation);
        }
        let usePath = useGlyph.points && options.pointsTransform ? options.pointsTransform(useGlyph.points) : useGlyph.path;
        if (options.pathTransform) {
          usePath = options.pathTransform(usePath);
        }
        return usePath.toPathData(options);
      };
      Glyph.prototype.fromSVG = function(pathData, options = {}) {
        return this.path.fromSVG(pathData, options);
      };
      Glyph.prototype.toSVG = function(options, font) {
        const pathData = this.toPathData.apply(this, [options, font]);
        return this.path.toSVG(options, pathData);
      };
      Glyph.prototype.toDOMElement = function(options, font) {
        options = Object.assign({}, { variation: font && font.defaultRenderOptions.variation }, options);
        let usePath = this.path;
        if (font && font.variation) {
          usePath = font.variation.getTransform(this, options.variation).path;
        }
        return usePath.toDOMElement(options);
      };
      var glyph_default = Glyph;
      function defineDependentProperty(glyph, externalName, internalName) {
        Object.defineProperty(glyph, externalName, {
          get: function() {
            typeof glyph[internalName] === "undefined" && glyph.path;
            return glyph[internalName];
          },
          set: function(newValue) {
            glyph[internalName] = newValue;
          },
          enumerable: true,
          configurable: true
        });
      }
      function GlyphSet(font, glyphs) {
        this.font = font;
        this.glyphs = {};
        if (Array.isArray(glyphs)) {
          for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];
            glyph.path.unitsPerEm = font.unitsPerEm;
            this.glyphs[i] = glyph;
          }
        }
        this.length = glyphs && glyphs.length || 0;
      }
      if (typeof Symbol !== "undefined" && Symbol.iterator) {
        GlyphSet.prototype[Symbol.iterator] = function() {
          let n = -1;
          return {
            next: function() {
              n++;
              const done = n >= this.length - 1;
              return { value: this.get(n), done };
            }.bind(this)
          };
        };
      }
      GlyphSet.prototype.get = function(index) {
        if (this.font._push && this.glyphs[index] === void 0) {
          this.font._push(index);
          if (typeof this.glyphs[index] === "function") {
            this.glyphs[index] = this.glyphs[index]();
          }
          let glyph = this.glyphs[index];
          let unicodeObj = this.font._IndexToUnicodeMap[index];
          if (unicodeObj) {
            for (let j = 0; j < unicodeObj.unicodes.length; j++)
              glyph.addUnicode(unicodeObj.unicodes[j]);
          }
          if (this.font.cffEncoding) {
            glyph.name = this.font.cffEncoding.charset[index];
          } else if (this.font.glyphNames.names) {
            glyph.name = this.font.glyphNames.glyphIndexToName(index);
          }
          this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
          this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
        } else {
          if (typeof this.glyphs[index] === "function") {
            this.glyphs[index] = this.glyphs[index]();
          }
        }
        return this.glyphs[index];
      };
      GlyphSet.prototype.push = function(index, loader) {
        this.glyphs[index] = loader;
        this.length++;
      };
      function glyphLoader(font, index) {
        return new glyph_default({ index, font });
      }
      function ttfGlyphLoader(font, index, parseGlyph2, data, position, buildPath2) {
        return function() {
          const glyph = new glyph_default({ index, font });
          glyph.path = function() {
            parseGlyph2(glyph, data, position);
            const path = buildPath2(font.glyphs, glyph);
            path.unitsPerEm = font.unitsPerEm;
            return path;
          };
          defineDependentProperty(glyph, "numberOfContours", "_numberOfContours");
          defineDependentProperty(glyph, "xMin", "_xMin");
          defineDependentProperty(glyph, "xMax", "_xMax");
          defineDependentProperty(glyph, "yMin", "_yMin");
          defineDependentProperty(glyph, "yMax", "_yMax");
          defineDependentProperty(glyph, "points", "_points");
          return glyph;
        };
      }
      function cffGlyphLoader(font, index, parseCFFCharstring2, charstring, version) {
        return function() {
          const glyph = new glyph_default({ index, font });
          glyph.path = function() {
            const path = parseCFFCharstring2(font, glyph, charstring, version);
            path.unitsPerEm = font.unitsPerEm;
            return path;
          };
          return glyph;
        };
      }
      var glyphset_default = { GlyphSet, glyphLoader, ttfGlyphLoader, cffGlyphLoader };
      function equals(a, b) {
        if (a === b) {
          return true;
        } else if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; i += 1) {
            if (!equals(a[i], b[i])) {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
      var MAX_CALL_DEPTH = 10;
      function calcCFFSubroutineBias(subrs) {
        let bias;
        if (subrs.length < 1240) {
          bias = 107;
        } else if (subrs.length < 33900) {
          bias = 1131;
        } else {
          bias = 32768;
        }
        return bias;
      }
      function parseCFFIndex(data, start, conversionFn, version) {
        const offsets = [];
        const objects = [];
        const count = version > 1 ? parse_default.getULong(data, start) : parse_default.getCard16(data, start);
        const countLength = version > 1 ? 4 : 2;
        let objectOffset;
        let endOffset;
        if (count !== 0) {
          const offsetSize = parse_default.getByte(data, start + countLength);
          objectOffset = start + (count + 1) * offsetSize + countLength;
          let pos = start + countLength + 1;
          for (let i = 0; i < count + 1; i += 1) {
            offsets.push(parse_default.getOffset(data, pos, offsetSize));
            pos += offsetSize;
          }
          endOffset = objectOffset + offsets[count];
        } else {
          endOffset = start + countLength;
        }
        for (let i = 0; i < offsets.length - 1; i += 1) {
          let value = parse_default.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
          if (conversionFn) {
            value = conversionFn(value, data, start, version);
          }
          objects.push(value);
        }
        return { objects, startOffset: start, endOffset };
      }
      function parseCFFIndexLowMemory(data, start, version) {
        const offsets = [];
        const count = version > 1 ? parse_default.getULong(data, start) : parse_default.getCard16(data, start);
        const countLength = version > 1 ? 4 : 2;
        let objectOffset;
        let endOffset;
        if (count !== 0) {
          const offsetSize = parse_default.getByte(data, start + countLength);
          objectOffset = start + (count + 1) * offsetSize + countLength;
          let pos = start + countLength + 1;
          for (let i = 0; i < count + 1; i += 1) {
            offsets.push(parse_default.getOffset(data, pos, offsetSize));
            pos += offsetSize;
          }
          endOffset = objectOffset + offsets[count];
        } else {
          endOffset = start + countLength;
        }
        return { offsets, startOffset: start, endOffset };
      }
      function getCffIndexObject(i, offsets, data, start, conversionFn, version) {
        const count = version > 1 ? parse_default.getULong(data, start) : parse_default.getCard16(data, start);
        const countLength = version > 1 ? 4 : 2;
        let objectOffset = 0;
        if (count !== 0) {
          const offsetSize = parse_default.getByte(data, start + countLength);
          objectOffset = start + (count + 1) * offsetSize + countLength;
        }
        let value = parse_default.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
        if (conversionFn) {
          value = conversionFn(value);
        }
        return value;
      }
      function parseFloatOperand(parser) {
        let s = "";
        const eof = 15;
        const lookup = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"];
        for (; ; ) {
          const b = parser.parseByte();
          const n1 = b >> 4;
          const n2 = b & 15;
          if (n1 === eof) {
            break;
          }
          s += lookup[n1];
          if (n2 === eof) {
            break;
          }
          s += lookup[n2];
        }
        return parseFloat(s);
      }
      function parseOperand(parser, b0) {
        let b1;
        let b2;
        let b3;
        let b4;
        if (b0 === 28) {
          b1 = parser.parseByte();
          b2 = parser.parseByte();
          return b1 << 8 | b2;
        }
        if (b0 === 29) {
          b1 = parser.parseByte();
          b2 = parser.parseByte();
          b3 = parser.parseByte();
          b4 = parser.parseByte();
          return b1 << 24 | b2 << 16 | b3 << 8 | b4;
        }
        if (b0 === 30) {
          return parseFloatOperand(parser);
        }
        if (b0 >= 32 && b0 <= 246) {
          return b0 - 139;
        }
        if (b0 >= 247 && b0 <= 250) {
          b1 = parser.parseByte();
          return (b0 - 247) * 256 + b1 + 108;
        }
        if (b0 >= 251 && b0 <= 254) {
          b1 = parser.parseByte();
          return -(b0 - 251) * 256 - b1 - 108;
        }
        throw new Error("Invalid b0 " + b0);
      }
      function entriesToObject(entries) {
        const o = {};
        for (let i = 0; i < entries.length; i += 1) {
          const key = entries[i][0];
          const values = entries[i][1];
          let value;
          if (values.length === 1) {
            value = values[0];
          } else {
            value = values;
          }
          if (Object.prototype.hasOwnProperty.call(o, key) && !isNaN(o[key])) {
            throw new Error("Object " + o + " already has key " + key);
          }
          o[key] = value;
        }
        return o;
      }
      function parseCFFDict(data, start, size, version) {
        start = start !== void 0 ? start : 0;
        const parser = new parse_default.Parser(data, start);
        const entries = [];
        let operands = [];
        size = size !== void 0 ? size : data.byteLength;
        let operandsStart = version < 2 ? 22 : 28;
        while (parser.relativeOffset < size) {
          let op = parser.parseByte();
          if (op < operandsStart) {
            if (op === 12) {
              op = 1200 + parser.parseByte();
            }
            if (version > 1 && op === 23) {
              parseBlend(operands);
              continue;
            }
            entries.push([op, operands]);
            operands = [];
          } else {
            operands.push(parseOperand(parser, op, version));
          }
        }
        return entriesToObject(entries);
      }
      function getCFFString(strings, index) {
        if (index <= 390) {
          index = cffStandardStrings[index];
        } else if (strings) {
          index = strings[index - 391];
        } else {
          index = void 0;
        }
        return index;
      }
      function interpretDict(dict, meta, strings) {
        const newDict = {};
        let value;
        for (let i = 0; i < meta.length; i += 1) {
          const m = meta[i];
          if (Array.isArray(m.type)) {
            const values = [];
            values.length = m.type.length;
            for (let j = 0; j < m.type.length; j++) {
              value = dict[m.op] !== void 0 ? dict[m.op][j] : void 0;
              if (value === void 0) {
                value = m.value !== void 0 && m.value[j] !== void 0 ? m.value[j] : null;
              }
              if (m.type[j] === "SID") {
                value = getCFFString(strings, value);
              }
              values[j] = value;
            }
            newDict[m.name] = values;
          } else {
            value = dict[m.op];
            if (value === void 0) {
              value = m.value !== void 0 ? m.value : null;
            }
            if (m.type === "SID") {
              value = getCFFString(strings, value);
            }
            newDict[m.name] = value;
          }
        }
        return newDict;
      }
      function parseCFFHeader(data, start) {
        const header = {};
        header.formatMajor = parse_default.getCard8(data, start);
        header.formatMinor = parse_default.getCard8(data, start + 1);
        if (header.formatMajor > 2) {
          throw new Error(`Unsupported CFF table version ${header.formatMajor}.${header.formatMinor}`);
        }
        header.size = parse_default.getCard8(data, start + 2);
        if (header.formatMajor < 2) {
          header.offsetSize = parse_default.getCard8(data, start + 3);
          header.startOffset = start;
          header.endOffset = start + 4;
        } else {
          header.topDictLength = parse_default.getCard16(data, start + 3);
          header.endOffset = start + 8;
        }
        return header;
      }
      var TOP_DICT_META = [
        { name: "version", op: 0, type: "SID" },
        { name: "notice", op: 1, type: "SID" },
        { name: "copyright", op: 1200, type: "SID" },
        { name: "fullName", op: 2, type: "SID" },
        { name: "familyName", op: 3, type: "SID" },
        { name: "weight", op: 4, type: "SID" },
        { name: "isFixedPitch", op: 1201, type: "number", value: 0 },
        { name: "italicAngle", op: 1202, type: "number", value: 0 },
        { name: "underlinePosition", op: 1203, type: "number", value: -100 },
        { name: "underlineThickness", op: 1204, type: "number", value: 50 },
        { name: "paintType", op: 1205, type: "number", value: 0 },
        { name: "charstringType", op: 1206, type: "number", value: 2 },
        {
          name: "fontMatrix",
          op: 1207,
          type: ["real", "real", "real", "real", "real", "real"],
          value: [1e-3, 0, 0, 1e-3, 0, 0]
        },
        { name: "uniqueId", op: 13, type: "number" },
        { name: "fontBBox", op: 5, type: ["number", "number", "number", "number"], value: [0, 0, 0, 0] },
        { name: "strokeWidth", op: 1208, type: "number", value: 0 },
        { name: "xuid", op: 14, type: [], value: null },
        { name: "charset", op: 15, type: "offset", value: 0 },
        { name: "encoding", op: 16, type: "offset", value: 0 },
        { name: "charStrings", op: 17, type: "offset", value: 0 },
        { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] },
        { name: "ros", op: 1230, type: ["SID", "SID", "number"] },
        { name: "cidFontVersion", op: 1231, type: "number", value: 0 },
        { name: "cidFontRevision", op: 1232, type: "number", value: 0 },
        { name: "cidFontType", op: 1233, type: "number", value: 0 },
        { name: "cidCount", op: 1234, type: "number", value: 8720 },
        { name: "uidBase", op: 1235, type: "number" },
        { name: "fdArray", op: 1236, type: "offset" },
        { name: "fdSelect", op: 1237, type: "offset" },
        { name: "fontName", op: 1238, type: "SID" }
      ];
      var TOP_DICT_META_CFF2 = [
        {
          name: "fontMatrix",
          op: 1207,
          type: ["real", "real", "real", "real", "real", "real"],
          value: [1e-3, 0, 0, 1e-3, 0, 0]
        },
        { name: "charStrings", op: 17, type: "offset" },
        { name: "fdArray", op: 1236, type: "offset" },
        { name: "fdSelect", op: 1237, type: "offset" },
        { name: "vstore", op: 24, type: "offset" }
      ];
      var PRIVATE_DICT_META = [
        { name: "subrs", op: 19, type: "offset", value: 0 },
        { name: "defaultWidthX", op: 20, type: "number", value: 0 },
        { name: "nominalWidthX", op: 21, type: "number", value: 0 }
      ];
      var PRIVATE_DICT_META_CFF2 = [
        { name: "blueValues", op: 6, type: "delta" },
        { name: "otherBlues", op: 7, type: "delta" },
        { name: "familyBlues", op: 7, type: "delta" },
        { name: "familyBlues", op: 8, type: "delta" },
        { name: "familyOtherBlues", op: 9, type: "delta" },
        { name: "blueScale", op: 1209, type: "number", value: 0.039625 },
        { name: "blueShift", op: 1210, type: "number", value: 7 },
        { name: "blueFuzz", op: 1211, type: "number", value: 1 },
        { name: "stdHW", op: 10, type: "number" },
        { name: "stdVW", op: 11, type: "number" },
        { name: "stemSnapH", op: 1212, type: "number" },
        { name: "stemSnapV", op: 1213, type: "number" },
        { name: "languageGroup", op: 1217, type: "number", value: 0 },
        { name: "expansionFactor", op: 1218, type: "number", value: 0.06 },
        { name: "vsindex", op: 22, type: "number", value: 0 },
        { name: "subrs", op: 19, type: "offset" }
      ];
      var FONT_DICT_META = [
        { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] }
      ];
      function parseCFFTopDict(data, start, strings, version) {
        const dict = parseCFFDict(data, start, data.byteLength, version);
        return interpretDict(dict, version > 1 ? TOP_DICT_META_CFF2 : TOP_DICT_META, strings);
      }
      function parseCFFPrivateDict(data, start, size, strings, version) {
        const dict = parseCFFDict(data, start, size, version);
        return interpretDict(dict, version > 1 ? PRIVATE_DICT_META_CFF2 : PRIVATE_DICT_META, strings);
      }
      function parseFontDict(data, start, version) {
        const dict = parseCFFDict(data, start, void 0, version);
        return interpretDict(dict, FONT_DICT_META);
      }
      function gatherCFF2FontDicts(data, start, fdArray) {
        const fontDictArray = [];
        for (let i = 0; i < fdArray.length; i++) {
          const fontDictData = new DataView(new Uint8Array(fdArray[i]).buffer);
          const fontDict = parseFontDict(fontDictData, 0, 2);
          const privateSize = fontDict.private[0];
          const privateOffset = fontDict.private[1];
          if (privateSize !== 0 && privateOffset !== 0) {
            const privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, [], 2);
            if (privateDict.subrs) {
              const subrOffset = privateOffset + privateDict.subrs;
              const subrIndex = parseCFFIndex(data, subrOffset + start, void 0, 2);
              fontDict._subrs = subrIndex.objects;
              fontDict._subrsBias = calcCFFSubroutineBias(fontDict._subrs);
            }
            fontDict._privateDict = privateDict;
          }
          fontDictArray.push(fontDict);
        }
        return fontDictArray;
      }
      function gatherCFFTopDicts(data, start, cffIndex, strings, version) {
        const topDictArray = [];
        for (let iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
          const topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
          const topDict = parseCFFTopDict(topDictData, 0, strings, version);
          topDict._subrs = [];
          topDict._subrsBias = 0;
          topDict._defaultWidthX = 0;
          topDict._nominalWidthX = 0;
          const privateSize = version < 2 ? topDict.private[0] : 0;
          const privateOffset = version < 2 ? topDict.private[1] : 0;
          if (privateSize !== 0 && privateOffset !== 0) {
            const privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings, version);
            topDict._defaultWidthX = privateDict.defaultWidthX;
            topDict._nominalWidthX = privateDict.nominalWidthX;
            if (privateDict.subrs !== 0) {
              const subrOffset = privateOffset + privateDict.subrs;
              const subrIndex = parseCFFIndex(data, subrOffset + start, void 0, version);
              topDict._subrs = subrIndex.objects;
              topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
            }
            topDict._privateDict = privateDict;
          }
          topDictArray.push(topDict);
        }
        return topDictArray;
      }
      function parseCFFCharset(data, start, nGlyphs, strings, isCIDFont) {
        let sid;
        let count;
        const parser = new parse_default.Parser(data, start);
        nGlyphs -= 1;
        const charset = [".notdef"];
        const format = parser.parseCard8();
        if (format === 0) {
          for (let i = 0; i < nGlyphs; i += 1) {
            sid = parser.parseSID();
            if (isCIDFont) {
              charset.push(sid);
            } else {
              charset.push(getCFFString(strings, sid) || sid);
            }
          }
        } else if (format === 1) {
          while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard8();
            for (let i = 0; i <= count; i += 1) {
              if (isCIDFont) {
                charset.push("cid" + ("00000" + sid).slice(-5));
              } else {
                charset.push(getCFFString(strings, sid) || sid);
              }
              sid += 1;
            }
          }
        } else if (format === 2) {
          while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard16();
            for (let i = 0; i <= count; i += 1) {
              if (isCIDFont) {
                charset.push("cid" + ("00000" + sid).slice(-5));
              } else {
                charset.push(getCFFString(strings, sid) || sid);
              }
              sid += 1;
            }
          }
        } else {
          throw new Error("Unknown charset format " + format);
        }
        return charset;
      }
      function parseCFFEncoding(data, start) {
        let code;
        const encoding = {};
        const parser = new parse_default.Parser(data, start);
        const format = parser.parseCard8();
        if (format === 0) {
          const nCodes = parser.parseCard8();
          for (let i = 0; i < nCodes; i += 1) {
            code = parser.parseCard8();
            encoding[code] = i;
          }
        } else if (format === 1) {
          const nRanges = parser.parseCard8();
          code = 1;
          for (let i = 0; i < nRanges; i += 1) {
            const first = parser.parseCard8();
            const nLeft = parser.parseCard8();
            for (let j = first; j <= first + nLeft; j += 1) {
              encoding[j] = code;
              code += 1;
            }
          }
        } else {
          throw new Error("Unknown encoding format " + format);
        }
        return encoding;
      }
      function parseBlend(operands) {
        let numberOfBlends = operands.pop();
        while (operands.length > numberOfBlends) {
          operands.pop();
        }
      }
      function applyPaintType(font, path) {
        const paintType = font.tables.cff && font.tables.cff.topDict && font.tables.cff.topDict.paintType || 0;
        if (paintType === 2) {
          path.fill = null;
          path.stroke = "black";
          path.strokeWidth = font.tables.cff.topDict.strokeWidth || 0;
        }
        return paintType;
      }
      function parseCFFCharstring(font, glyph, code, version, coords) {
        let c1x;
        let c1y;
        let c2x;
        let c2y;
        const p = new path_default();
        const stack = [];
        let nStems = 0;
        let haveWidth = false;
        let open = false;
        let x = 0;
        let y = 0;
        let subrs;
        let subrsBias;
        let defaultWidthX;
        let nominalWidthX;
        let vsindex = 0;
        let vstore = [];
        let blendVector;
        let callDepth = 0;
        const cffTable = font.tables.cff2 || font.tables.cff;
        defaultWidthX = cffTable.topDict._defaultWidthX;
        nominalWidthX = cffTable.topDict._nominalWidthX;
        coords = coords || font.variation && font.variation.get();
        if (!glyph.getBlendPath) {
          glyph.getBlendPath = function(variationCoords) {
            return parseCFFCharstring(font, glyph, code, version, variationCoords);
          };
        }
        if (font.isCIDFont || version > 1) {
          const fdIndex = cffTable.topDict._fdSelect ? cffTable.topDict._fdSelect[glyph.index] : 0;
          const fdDict = cffTable.topDict._fdArray[fdIndex];
          subrs = fdDict._subrs;
          subrsBias = fdDict._subrsBias;
          if (version > 1) {
            vstore = cffTable.topDict._vstore.itemVariationStore;
            vsindex = fdDict._privateDict.vsindex;
          } else {
            defaultWidthX = fdDict._defaultWidthX;
            nominalWidthX = fdDict._nominalWidthX;
          }
        } else {
          subrs = cffTable.topDict._subrs;
          subrsBias = cffTable.topDict._subrsBias;
        }
        const paintType = applyPaintType(font, p);
        let width = defaultWidthX;
        function newContour(x2, y2) {
          if (open && paintType !== 2) {
            p.closePath();
          }
          p.moveTo(x2, y2);
          open = true;
        }
        function parseStems() {
          let hasWidthArg;
          hasWidthArg = (stack.length & 1) !== 0;
          if (hasWidthArg && !haveWidth) {
            width = stack.shift() + nominalWidthX;
          }
          nStems += stack.length >> 1;
          stack.length = 0;
          haveWidth = true;
        }
        function parse(code2) {
          let b1;
          let b2;
          let b3;
          let b4;
          let codeIndex;
          let subrCode;
          let jpx;
          let jpy;
          let c3x;
          let c3y;
          let c4x;
          let c4y;
          let i = 0;
          while (i < code2.length) {
            let v = code2[i];
            i += 1;
            switch (v) {
              case 1:
                parseStems();
                break;
              case 3:
                parseStems();
                break;
              case 4:
                if (stack.length > 1 && !haveWidth) {
                  width = stack.shift() + nominalWidthX;
                  haveWidth = true;
                }
                y += stack.pop();
                newContour(x, y);
                break;
              case 5:
                while (stack.length > 0) {
                  x += stack.shift();
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 6:
                while (stack.length > 0) {
                  x += stack.shift();
                  p.lineTo(x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 7:
                while (stack.length > 0) {
                  y += stack.shift();
                  p.lineTo(x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  x += stack.shift();
                  p.lineTo(x, y);
                }
                break;
              case 8:
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 10:
                codeIndex = stack.pop() + subrsBias;
                subrCode = subrs[codeIndex];
                if (subrCode) {
                  if (callDepth >= MAX_CALL_DEPTH) {
                    console.warn("CFF charstring subroutine call depth exceeded, skipping callsubr");
                    break;
                  }
                  callDepth++;
                  parse(subrCode);
                  callDepth--;
                }
                break;
              case 11:
                if (version > 1) {
                  console.error("CFF CharString operator return (11) is not supported in CFF2");
                  break;
                }
                return;
              case 12:
                v = code2[i];
                i += 1;
                switch (v) {
                  case 35:
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y + stack.shift();
                    c3x = jpx + stack.shift();
                    c3y = jpy + stack.shift();
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    x = c4x + stack.shift();
                    y = c4y + stack.shift();
                    stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                  case 34:
                    c1x = x + stack.shift();
                    c1y = y;
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y;
                    c3x = jpx + stack.shift();
                    c3y = c2y;
                    c4x = c3x + stack.shift();
                    c4y = y;
                    x = c4x + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                  case 36:
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y;
                    c3x = jpx + stack.shift();
                    c3y = c2y;
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    x = c4x + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                  case 37:
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    jpx = c2x + stack.shift();
                    jpy = c2y + stack.shift();
                    c3x = jpx + stack.shift();
                    c3y = jpy + stack.shift();
                    c4x = c3x + stack.shift();
                    c4y = c3y + stack.shift();
                    if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                      x = c4x + stack.shift();
                    } else {
                      y = c4y + stack.shift();
                    }
                    p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                    p.curveTo(c3x, c3y, c4x, c4y, x, y);
                    break;
                  default:
                    console.log("Glyph " + glyph.index + ": unknown operator 1200" + v);
                    stack.length = 0;
                }
                break;
              case 14:
                if (version > 1) {
                  console.error("CFF CharString operator endchar (14) is not supported in CFF2");
                  break;
                }
                if (stack.length >= 4) {
                  const acharName = cffStandardEncoding[stack.pop()];
                  const bcharName = cffStandardEncoding[stack.pop()];
                  const ady = stack.pop();
                  const adx = stack.pop();
                  if (acharName && bcharName) {
                    glyph.isComposite = true;
                    glyph.components = [];
                    const acharGlyphIndex = font.cffEncoding.charset.indexOf(acharName);
                    const bcharGlyphIndex = font.cffEncoding.charset.indexOf(bcharName);
                    glyph.components.push({
                      glyphIndex: bcharGlyphIndex,
                      dx: 0,
                      dy: 0
                    });
                    glyph.components.push({
                      glyphIndex: acharGlyphIndex,
                      dx: adx,
                      dy: ady
                    });
                    p.extend(font.glyphs.get(bcharGlyphIndex).path);
                    const acharGlyph = font.glyphs.get(acharGlyphIndex);
                    const shiftedCommands = JSON.parse(JSON.stringify(acharGlyph.path.commands));
                    for (let i2 = 0; i2 < shiftedCommands.length; i2 += 1) {
                      const cmd = shiftedCommands[i2];
                      if (cmd.type !== "Z") {
                        cmd.x += adx;
                        cmd.y += ady;
                      }
                      if (cmd.type === "Q" || cmd.type === "C") {
                        cmd.x1 += adx;
                        cmd.y1 += ady;
                      }
                      if (cmd.type === "C") {
                        cmd.x2 += adx;
                        cmd.y2 += ady;
                      }
                    }
                    p.extend(shiftedCommands);
                  }
                } else if (stack.length > 0 && !haveWidth) {
                  width = stack.shift() + nominalWidthX;
                  haveWidth = true;
                }
                if (open && paintType !== 2) {
                  p.closePath();
                  open = false;
                }
                break;
              case 15:
                if (version < 2) {
                  console.error("CFF2 CharString operator vsindex (15) is not supported in CFF");
                  break;
                }
                vsindex = stack.pop();
                break;
              case 16:
                if (version < 2) {
                  console.error("CFF2 CharString operator blend (16) is not supported in CFF");
                  break;
                }
                if (!blendVector) {
                  blendVector = font.variation && coords && font.variation.process.getBlendVector(vstore, vsindex, coords);
                }
                var n = stack.pop();
                var axisCount = blendVector ? blendVector.length : vstore.itemVariationSubtables[vsindex].regionIndexes.length;
                var deltaSetCount = n * axisCount;
                var delta = stack.length - deltaSetCount;
                var deltaSetIndex = delta - n;
                if (blendVector) {
                  for (let i2 = 0; i2 < n; i2++) {
                    var sum = stack[deltaSetIndex + i2];
                    for (let j = 0; j < axisCount; j++) {
                      sum += blendVector[j] * stack[delta++];
                    }
                    stack[deltaSetIndex + i2] = sum;
                  }
                }
                while (deltaSetCount--) {
                  stack.pop();
                }
                break;
              case 18:
                parseStems();
                break;
              case 19:
              // hintmask
              case 20:
                parseStems();
                i += nStems + 7 >> 3;
                break;
              case 21:
                if (stack.length > 2 && !haveWidth) {
                  width = stack.shift() + nominalWidthX;
                  haveWidth = true;
                }
                y += stack.pop();
                x += stack.pop();
                newContour(x, y);
                break;
              case 22:
                if (stack.length > 1 && !haveWidth) {
                  width = stack.shift() + nominalWidthX;
                  haveWidth = true;
                }
                x += stack.pop();
                newContour(x, y);
                break;
              case 23:
                parseStems();
                break;
              case 24:
                while (stack.length > 2) {
                  c1x = x + stack.shift();
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                x += stack.shift();
                y += stack.shift();
                p.lineTo(x, y);
                break;
              case 25:
                while (stack.length > 6) {
                  x += stack.shift();
                  y += stack.shift();
                  p.lineTo(x, y);
                }
                c1x = x + stack.shift();
                c1y = y + stack.shift();
                c2x = c1x + stack.shift();
                c2y = c1y + stack.shift();
                x = c2x + stack.shift();
                y = c2y + stack.shift();
                p.curveTo(c1x, c1y, c2x, c2y, x, y);
                break;
              case 26:
                if (stack.length & 1) {
                  x += stack.shift();
                }
                while (stack.length > 0) {
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x;
                  y = c2y + stack.shift();
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 27:
                if (stack.length & 1) {
                  y += stack.shift();
                }
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y;
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 28:
                b1 = code2[i];
                b2 = code2[i + 1];
                stack.push((b1 << 24 | b2 << 16) >> 16);
                i += 2;
                break;
              case 29:
                codeIndex = stack.pop() + font.gsubrsBias;
                subrCode = font.gsubrs[codeIndex];
                if (subrCode) {
                  if (callDepth >= MAX_CALL_DEPTH) {
                    console.warn("CFF charstring subroutine call depth exceeded, skipping callgsubr");
                    break;
                  }
                  callDepth++;
                  parse(subrCode);
                  callDepth--;
                }
                break;
              case 30:
                while (stack.length > 0) {
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  y = c2y + stack.shift();
                  x = c2x + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              case 31:
                while (stack.length > 0) {
                  c1x = x + stack.shift();
                  c1y = y;
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  y = c2y + stack.shift();
                  x = c2x + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                  if (stack.length === 0) {
                    break;
                  }
                  c1x = x;
                  c1y = y + stack.shift();
                  c2x = c1x + stack.shift();
                  c2y = c1y + stack.shift();
                  x = c2x + stack.shift();
                  y = c2y + (stack.length === 1 ? stack.shift() : 0);
                  p.curveTo(c1x, c1y, c2x, c2y, x, y);
                }
                break;
              default:
                if (v < 32) {
                  console.log("Glyph " + glyph.index + ": unknown operator " + v);
                } else if (v < 247) {
                  stack.push(v - 139);
                } else if (v < 251) {
                  b1 = code2[i];
                  i += 1;
                  stack.push((v - 247) * 256 + b1 + 108);
                } else if (v < 255) {
                  b1 = code2[i];
                  i += 1;
                  stack.push(-(v - 251) * 256 - b1 - 108);
                } else {
                  b1 = code2[i];
                  b2 = code2[i + 1];
                  b3 = code2[i + 2];
                  b4 = code2[i + 3];
                  i += 4;
                  stack.push((b1 << 24 | b2 << 16 | b3 << 8 | b4) / 65536);
                }
            }
          }
        }
        parse(code);
        if (font.variation && coords) {
          p.commands = p.commands.map((c) => {
            const keys = Object.keys(c);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              if (key === "type") continue;
              c[key] = Math.round(c[key]);
            }
            return c;
          });
        }
        if (haveWidth) {
          glyph.advanceWidth = width;
        }
        return p;
      }
      function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount, version) {
        const fdSelect = [];
        let fdIndex;
        const parser = new parse_default.Parser(data, start);
        const format = parser.parseCard8();
        if (format === 0) {
          for (let iGid = 0; iGid < nGlyphs; iGid++) {
            fdIndex = parser.parseCard8();
            if (fdIndex >= fdArrayCount) {
              throw new Error("CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")");
            }
            fdSelect.push(fdIndex);
          }
        } else if (format === 3 || version > 1 && format === 4) {
          const nRanges = format === 4 ? parser.parseULong() : parser.parseCard16();
          let first = format === 4 ? parser.parseULong() : parser.parseCard16();
          if (first !== 0) {
            throw new Error(`CFF Table CID Font FDSelect format ${format} range has bad initial GID ${first}`);
          }
          let next;
          for (let iRange = 0; iRange < nRanges; iRange++) {
            fdIndex = format === 4 ? parser.parseUShort() : parser.parseCard8();
            next = format === 4 ? parser.parseULong() : parser.parseCard16();
            if (fdIndex >= fdArrayCount) {
              throw new Error("CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")");
            }
            if (next > nGlyphs) {
              throw new Error(`CFF Table CID Font FDSelect format ${version} range has bad GID ${next}`);
            }
            for (; first < next; first++) {
              fdSelect.push(fdIndex);
            }
            first = next;
          }
          if (next !== nGlyphs) {
            throw new Error("CFF Table CID Font FDSelect format 3 range has bad final (Sentinal) GID " + next);
          }
        } else {
          throw new Error("CFF Table CID Font FDSelect table has unsupported format " + format);
        }
        return fdSelect;
      }
      function parseCFFTable(data, start, font, opt) {
        let resultTable;
        const header = parseCFFHeader(data, start);
        if (header.formatMajor === 2) {
          resultTable = font.tables.cff2 = {};
        } else {
          resultTable = font.tables.cff = {};
        }
        const nameIndex = header.formatMajor > 1 ? null : parseCFFIndex(data, header.endOffset, parse_default.bytesToString);
        const topDictIndex = header.formatMajor > 1 ? null : parseCFFIndex(data, nameIndex.endOffset);
        const stringIndex = header.formatMajor > 1 ? null : parseCFFIndex(data, topDictIndex.endOffset, parse_default.bytesToString);
        const globalSubrIndex = parseCFFIndex(data, header.formatMajor > 1 ? start + header.size + header.topDictLength : stringIndex.endOffset, void 0, header.formatMajor);
        font.gsubrs = globalSubrIndex.objects;
        font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);
        let topDict;
        if (header.formatMajor > 1) {
          const topDictOffset = start + header.size;
          const topDictData = parse_default.getBytes(data, topDictOffset, topDictOffset + header.topDictLength);
          topDict = gatherCFFTopDicts(data, 0, [topDictData], void 0, header.formatMajor)[0];
        } else {
          const topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects, header.formatMajor);
          if (topDictArray.length !== 1) {
            throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + topDictArray.length);
          }
          topDict = topDictArray[0];
        }
        resultTable.topDict = topDict;
        if (topDict._privateDict) {
          font.defaultWidthX = topDict._privateDict.defaultWidthX;
          font.nominalWidthX = topDict._privateDict.nominalWidthX;
        }
        if (header.formatMajor < 2 && topDict.ros[0] !== void 0 && topDict.ros[1] !== void 0) {
          font.isCIDFont = true;
        }
        if (header.formatMajor > 1) {
          let fdArrayIndexOffset = topDict.fdArray;
          let fdSelectOffset = topDict.fdSelect;
          if (!fdArrayIndexOffset) {
            throw new Error("This is a CFF2 font, but FDArray information is missing");
          }
          const fdArrayIndex = parseCFFIndex(data, start + fdArrayIndexOffset, null, header.formatMajor);
          const fdArray = gatherCFF2FontDicts(data, start, fdArrayIndex.objects);
          topDict._fdArray = fdArray;
          if (fdSelectOffset) {
            topDict._fdSelect = parseCFFFDSelect(data, start + fdSelectOffset, font.numGlyphs, fdArray.length, header.formatMajor);
          }
        } else if (font.isCIDFont) {
          let fdArrayOffset = topDict.fdArray;
          let fdSelectOffset = topDict.fdSelect;
          if (fdArrayOffset === 0 || fdSelectOffset === 0) {
            throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
          }
          fdArrayOffset += start;
          const fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
          const fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects, header.formatMajor);
          topDict._fdArray = fdArray;
          fdSelectOffset += start;
          topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length, header.formatMajor);
        }
        if (header.formatMajor < 2) {
          const privateDictOffset = start + topDict.private[1];
          const privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects, header.formatMajor);
          font.defaultWidthX = privateDict.defaultWidthX;
          font.nominalWidthX = privateDict.nominalWidthX;
          if (privateDict.subrs !== 0) {
            const subrOffset = privateDictOffset + privateDict.subrs;
            const subrIndex = parseCFFIndex(data, subrOffset);
            font.subrs = subrIndex.objects;
            font.subrsBias = calcCFFSubroutineBias(font.subrs);
          } else {
            font.subrs = [];
            font.subrsBias = 0;
          }
        }
        let charStringsIndex;
        if (opt.lowMemory) {
          charStringsIndex = parseCFFIndexLowMemory(data, start + topDict.charStrings, header.formatMajor);
          font.nGlyphs = charStringsIndex.offsets.length - (header.formatMajor > 1 ? 1 : 0);
        } else {
          charStringsIndex = parseCFFIndex(data, start + topDict.charStrings, null, header.formatMajor);
          font.nGlyphs = charStringsIndex.objects.length;
        }
        if (header.formatMajor > 1 && font.tables.maxp && font.nGlyphs !== font.tables.maxp.numGlyphs) {
          console.error(`Glyph count in the CFF2 table (${font.nGlyphs}) must correspond to the glyph count in the maxp table (${font.tables.maxp.numGlyphs})`);
        }
        if (header.formatMajor < 2) {
          let charset = [];
          let encoding = [];
          if (topDict.charset === 0) {
            charset = cffISOAdobeStrings;
          } else if (topDict.charset === 1) {
            charset = cffIExpertStrings;
          } else if (topDict.charset === 2) {
            charset = cffExpertSubsetStrings;
          } else {
            charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects, font.isCIDFont);
          }
          if (topDict.encoding === 0) {
            encoding = cffStandardEncoding;
          } else if (topDict.encoding === 1) {
            encoding = cffExpertEncoding;
          } else {
            encoding = parseCFFEncoding(data, start + topDict.encoding);
          }
          font.cffEncoding = new CffEncoding(encoding, charset);
          font.encoding = font.encoding || font.cffEncoding;
        }
        font.glyphs = new glyphset_default.GlyphSet(font);
        if (opt.lowMemory) {
          font._push = function(i) {
            const charString = getCffIndexObject(i, charStringsIndex.offsets, data, start + topDict.charStrings, void 0, header.formatMajor);
            font.glyphs.push(i, glyphset_default.cffGlyphLoader(font, i, parseCFFCharstring, charString, header.formatMajor));
          };
        } else {
          for (let i = 0; i < font.nGlyphs; i += 1) {
            const charString = charStringsIndex.objects[i];
            font.glyphs.push(i, glyphset_default.cffGlyphLoader(font, i, parseCFFCharstring, charString, header.formatMajor));
          }
        }
        if (topDict.vstore) {
          const p = new parse_default.Parser(data, start + topDict.vstore);
          topDict._vstore = p.parseVariationStore();
        }
      }
      function encodeString(s, strings) {
        let sid;
        let i = cffStandardStrings.indexOf(s);
        if (i >= 0) {
          sid = i;
        }
        i = strings.indexOf(s);
        if (i >= 0) {
          sid = i + cffStandardStrings.length;
        } else {
          sid = cffStandardStrings.length + strings.length;
          strings.push(s);
        }
        return sid;
      }
      function makeHeader() {
        return new table_default.Record("Header", [
          { name: "major", type: "Card8", value: 1 },
          { name: "minor", type: "Card8", value: 0 },
          { name: "hdrSize", type: "Card8", value: 4 },
          { name: "major", type: "Card8", value: 1 }
        ]);
      }
      function makeNameIndex(fontNames) {
        const t = new table_default.Record("Name INDEX", [
          { name: "names", type: "INDEX", value: [] }
        ]);
        t.names = [];
        for (let i = 0; i < fontNames.length; i += 1) {
          t.names.push({ name: "name_" + i, type: "NAME", value: fontNames[i] });
        }
        return t;
      }
      function makeDict(meta, attrs, strings) {
        const m = {};
        for (let i = 0; i < meta.length; i += 1) {
          const entry = meta[i];
          let value = attrs[entry.name];
          if (value !== void 0 && !equals(value, entry.value)) {
            if (entry.type === "SID") {
              value = encodeString(value, strings);
            }
            m[entry.op] = { name: entry.name, type: entry.type, value };
          }
        }
        return m;
      }
      function makeTopDict(attrs, strings, version) {
        const t = new table_default.Record("Top DICT", [
          { name: "dict", type: "DICT", value: {} }
        ]);
        t.dict = makeDict(version > 1 ? TOP_DICT_META_CFF2 : TOP_DICT_META, attrs, strings);
        return t;
      }
      function makeTopDictIndex(topDict) {
        const t = new table_default.Record("Top DICT INDEX", [
          { name: "topDicts", type: "INDEX", value: [] }
        ]);
        t.topDicts = [{ name: "topDict_0", type: "TABLE", value: topDict }];
        return t;
      }
      function makeStringIndex(strings) {
        const t = new table_default.Record("String INDEX", [
          { name: "strings", type: "INDEX", value: [] }
        ]);
        t.strings = [];
        for (let i = 0; i < strings.length; i += 1) {
          t.strings.push({ name: "string_" + i, type: "STRING", value: strings[i] });
        }
        return t;
      }
      function makeGlobalSubrIndex() {
        return new table_default.Record("Global Subr INDEX", [
          { name: "subrs", type: "INDEX", value: [] }
        ]);
      }
      function makeCharsets(glyphNames, strings) {
        const t = new table_default.Record("Charsets", [
          { name: "format", type: "Card8", value: 0 }
        ]);
        for (let i = 0; i < glyphNames.length; i += 1) {
          const glyphName = glyphNames[i];
          const glyphSID = encodeString(glyphName, strings);
          t.fields.push({ name: "glyph_" + i, type: "SID", value: glyphSID });
        }
        return t;
      }
      function glyphToOps(glyph, version) {
        const ops = [];
        const path = glyph.path;
        if (version < 2) {
          ops.push({ name: "width", type: "NUMBER", value: glyph.advanceWidth });
        }
        let x = 0;
        let y = 0;
        for (let i = 0; i < path.commands.length; i += 1) {
          let dx;
          let dy;
          let cmd = path.commands[i];
          if (cmd.type === "Q") {
            const _13 = 1 / 3;
            const _23 = 2 / 3;
            cmd = {
              type: "C",
              x: cmd.x,
              y: cmd.y,
              x1: Math.round(_13 * x + _23 * cmd.x1),
              y1: Math.round(_13 * y + _23 * cmd.y1),
              x2: Math.round(_13 * cmd.x + _23 * cmd.x1),
              y2: Math.round(_13 * cmd.y + _23 * cmd.y1)
            };
          }
          if (cmd.type === "M") {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({ name: "dx", type: "NUMBER", value: dx });
            ops.push({ name: "dy", type: "NUMBER", value: dy });
            ops.push({ name: "rmoveto", type: "OP", value: 21 });
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
          } else if (cmd.type === "L") {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({ name: "dx", type: "NUMBER", value: dx });
            ops.push({ name: "dy", type: "NUMBER", value: dy });
            ops.push({ name: "rlineto", type: "OP", value: 5 });
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
          } else if (cmd.type === "C") {
            const dx1 = Math.round(cmd.x1 - x);
            const dy1 = Math.round(cmd.y1 - y);
            const dx2 = Math.round(cmd.x2 - cmd.x1);
            const dy2 = Math.round(cmd.y2 - cmd.y1);
            dx = Math.round(cmd.x - cmd.x2);
            dy = Math.round(cmd.y - cmd.y2);
            ops.push({ name: "dx1", type: "NUMBER", value: dx1 });
            ops.push({ name: "dy1", type: "NUMBER", value: dy1 });
            ops.push({ name: "dx2", type: "NUMBER", value: dx2 });
            ops.push({ name: "dy2", type: "NUMBER", value: dy2 });
            ops.push({ name: "dx", type: "NUMBER", value: dx });
            ops.push({ name: "dy", type: "NUMBER", value: dy });
            ops.push({ name: "rrcurveto", type: "OP", value: 8 });
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
          }
        }
        if (version < 2) {
          ops.push({ name: "endchar", type: "OP", value: 14 });
        }
        return ops;
      }
      function makeCharStringsIndex(glyphs, version) {
        const t = new table_default.Record("CharStrings INDEX", [
          { name: "charStrings", type: "INDEX", value: [] }
        ]);
        for (let i = 0; i < glyphs.length; i += 1) {
          const glyph = glyphs.get(i);
          const ops = glyphToOps(glyph, version);
          t.charStrings.push({ name: glyph.name, type: "CHARSTRING", value: ops });
        }
        return t;
      }
      function makePrivateDict(attrs, strings, version) {
        const t = new table_default.Record("Private DICT", [
          { name: "dict", type: "DICT", value: {} }
        ]);
        t.dict = makeDict(version > 1 ? PRIVATE_DICT_META_CFF2 : PRIVATE_DICT_META, attrs, strings);
        return t;
      }
      function makeCFFTable(glyphs, options) {
        const cffVersion = 1;
        const t = new table_default.Table("CFF ", [
          { name: "header", type: "RECORD" },
          { name: "nameIndex", type: "RECORD" },
          { name: "topDictIndex", type: "RECORD" },
          { name: "stringIndex", type: "RECORD" },
          { name: "globalSubrIndex", type: "RECORD" },
          { name: "charsets", type: "RECORD" },
          { name: "charStringsIndex", type: "RECORD" },
          { name: "privateDict", type: "RECORD" }
        ]);
        const fontScale = 1 / options.unitsPerEm;
        const attrs = {
          version: options.version,
          fullName: options.fullName,
          familyName: options.familyName,
          weight: options.weightName,
          fontBBox: options.fontBBox || [0, 0, 0, 0],
          fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
          charset: 999,
          encoding: 0,
          charStrings: 999,
          private: [0, 999]
        };
        const topDictOptions = options && options.topDict || {};
        if (cffVersion < 2 && topDictOptions.paintType) {
          attrs.paintType = topDictOptions.paintType;
          attrs.strokeWidth = topDictOptions.strokeWidth || 0;
        }
        const privateAttrs = {};
        const glyphNames = [];
        let glyph;
        for (let i = 1; i < glyphs.length; i += 1) {
          glyph = glyphs.get(i);
          glyphNames.push(glyph.name);
        }
        const strings = [];
        t.header = makeHeader();
        t.nameIndex = makeNameIndex([options.postScriptName]);
        let topDict = makeTopDict(attrs, strings);
        t.topDictIndex = makeTopDictIndex(topDict);
        t.globalSubrIndex = makeGlobalSubrIndex();
        t.charsets = makeCharsets(glyphNames, strings);
        t.charStringsIndex = makeCharStringsIndex(glyphs, cffVersion);
        t.privateDict = makePrivateDict(privateAttrs, strings);
        t.stringIndex = makeStringIndex(strings);
        const startOffset = t.header.sizeOf() + t.nameIndex.sizeOf() + t.topDictIndex.sizeOf() + t.stringIndex.sizeOf() + t.globalSubrIndex.sizeOf();
        attrs.charset = startOffset;
        attrs.encoding = 0;
        attrs.charStrings = attrs.charset + t.charsets.sizeOf();
        attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();
        topDict = makeTopDict(attrs, strings);
        t.topDictIndex = makeTopDictIndex(topDict);
        return t;
      }
      var cff_default = { parse: parseCFFTable, make: makeCFFTable };
      function parseHeadTable(data, start) {
        const head = {};
        const p = new parse_default.Parser(data, start);
        head.version = p.parseVersion();
        head.fontRevision = Math.round(p.parseFixed() * 1e3) / 1e3;
        head.checkSumAdjustment = p.parseULong();
        head.magicNumber = p.parseULong();
        check_default.argument(head.magicNumber === 1594834165, "Font header has wrong magic number.");
        head.flags = p.parseUShort();
        head.unitsPerEm = p.parseUShort();
        head.created = p.parseLongDateTime();
        head.modified = p.parseLongDateTime();
        head.xMin = p.parseShort();
        head.yMin = p.parseShort();
        head.xMax = p.parseShort();
        head.yMax = p.parseShort();
        head.macStyle = p.parseUShort();
        head.lowestRecPPEM = p.parseUShort();
        head.fontDirectionHint = p.parseShort();
        head.indexToLocFormat = p.parseShort();
        head.glyphDataFormat = p.parseShort();
        return head;
      }
      function makeHeadTable(options) {
        const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) + 2082844800;
        let createdTimestamp = timestamp;
        let macStyle = options.macStyle || 0;
        if (options.createdTimestamp) {
          createdTimestamp = options.createdTimestamp + 2082844800;
        }
        return new table_default.Table("head", [
          { name: "version", type: "FIXED", value: 65536 },
          { name: "fontRevision", type: "FIXED", value: 65536 },
          { name: "checkSumAdjustment", type: "ULONG", value: 0 },
          { name: "magicNumber", type: "ULONG", value: 1594834165 },
          { name: "flags", type: "USHORT", value: 0 },
          { name: "unitsPerEm", type: "USHORT", value: 1e3 },
          { name: "created", type: "LONGDATETIME", value: createdTimestamp },
          { name: "modified", type: "LONGDATETIME", value: timestamp },
          { name: "xMin", type: "SHORT", value: 0 },
          { name: "yMin", type: "SHORT", value: 0 },
          { name: "xMax", type: "SHORT", value: 0 },
          { name: "yMax", type: "SHORT", value: 0 },
          { name: "macStyle", type: "USHORT", value: macStyle },
          { name: "lowestRecPPEM", type: "USHORT", value: 0 },
          { name: "fontDirectionHint", type: "SHORT", value: 2 },
          { name: "indexToLocFormat", type: "SHORT", value: 0 },
          { name: "glyphDataFormat", type: "SHORT", value: 0 }
        ], options);
      }
      var head_default = { parse: parseHeadTable, make: makeHeadTable };
      function parseHheaTable(data, start) {
        const hhea = {};
        const p = new parse_default.Parser(data, start);
        hhea.version = p.parseVersion();
        hhea.ascender = p.parseShort();
        hhea.descender = p.parseShort();
        hhea.lineGap = p.parseShort();
        hhea.advanceWidthMax = p.parseUShort();
        hhea.minLeftSideBearing = p.parseShort();
        hhea.minRightSideBearing = p.parseShort();
        hhea.xMaxExtent = p.parseShort();
        hhea.caretSlopeRise = p.parseShort();
        hhea.caretSlopeRun = p.parseShort();
        hhea.caretOffset = p.parseShort();
        p.relativeOffset += 8;
        hhea.metricDataFormat = p.parseShort();
        hhea.numberOfHMetrics = p.parseUShort();
        return hhea;
      }
      function makeHheaTable(options) {
        return new table_default.Table("hhea", [
          { name: "version", type: "FIXED", value: 65536 },
          { name: "ascender", type: "FWORD", value: 0 },
          { name: "descender", type: "FWORD", value: 0 },
          { name: "lineGap", type: "FWORD", value: 0 },
          { name: "advanceWidthMax", type: "UFWORD", value: 0 },
          { name: "minLeftSideBearing", type: "FWORD", value: 0 },
          { name: "minRightSideBearing", type: "FWORD", value: 0 },
          { name: "xMaxExtent", type: "FWORD", value: 0 },
          { name: "caretSlopeRise", type: "SHORT", value: 1 },
          { name: "caretSlopeRun", type: "SHORT", value: 0 },
          { name: "caretOffset", type: "SHORT", value: 0 },
          { name: "reserved1", type: "SHORT", value: 0 },
          { name: "reserved2", type: "SHORT", value: 0 },
          { name: "reserved3", type: "SHORT", value: 0 },
          { name: "reserved4", type: "SHORT", value: 0 },
          { name: "metricDataFormat", type: "SHORT", value: 0 },
          { name: "numberOfHMetrics", type: "USHORT", value: 0 }
        ], options);
      }
      var hhea_default = { parse: parseHheaTable, make: makeHheaTable };
      function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
        let advanceWidth;
        let leftSideBearing;
        const p = new parse_default.Parser(data, start);
        for (let i = 0; i < numGlyphs; i += 1) {
          if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
          }
          const glyph = glyphs.get(i);
          glyph.advanceWidth = advanceWidth;
          glyph.leftSideBearing = leftSideBearing;
        }
      }
      function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
        font._hmtxTableData = {};
        let advanceWidth;
        let leftSideBearing;
        const p = new parse_default.Parser(data, start);
        for (let i = 0; i < numGlyphs; i += 1) {
          if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
          }
          font._hmtxTableData[i] = {
            advanceWidth,
            leftSideBearing
          };
        }
      }
      function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
        if (opt.lowMemory)
          parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs);
        else
          parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs);
      }
      function makeHmtxTable(glyphs) {
        const t = new table_default.Table("hmtx", []);
        for (let i = 0; i < glyphs.length; i += 1) {
          const glyph = glyphs.get(i);
          const advanceWidth = glyph.advanceWidth || 0;
          const leftSideBearing = glyph.leftSideBearing || 0;
          t.fields.push({ name: "advanceWidth_" + i, type: "USHORT", value: advanceWidth });
          t.fields.push({ name: "leftSideBearing_" + i, type: "SHORT", value: leftSideBearing });
        }
        return t;
      }
      var hmtx_default = { parse: parseHmtxTable, make: makeHmtxTable };
      function makeLtagTable(tags) {
        const result = new table_default.Table("ltag", [
          { name: "version", type: "ULONG", value: 1 },
          { name: "flags", type: "ULONG", value: 0 },
          { name: "numTags", type: "ULONG", value: tags.length }
        ]);
        let stringPool = "";
        const stringPoolOffset = 12 + tags.length * 4;
        for (let i = 0; i < tags.length; ++i) {
          let pos = stringPool.indexOf(tags[i]);
          if (pos < 0) {
            pos = stringPool.length;
            stringPool += tags[i];
          }
          result.fields.push({ name: "offset " + i, type: "USHORT", value: stringPoolOffset + pos });
          result.fields.push({ name: "length " + i, type: "USHORT", value: tags[i].length });
        }
        result.fields.push({ name: "stringPool", type: "CHARARRAY", value: stringPool });
        return result;
      }
      function parseLtagTable(data, start) {
        const p = new parse_default.Parser(data, start);
        const tableVersion = p.parseULong();
        check_default.argument(tableVersion === 1, "Unsupported ltag table version.");
        p.skip("uLong", 1);
        const numTags = p.parseULong();
        const tags = [];
        for (let i = 0; i < numTags; i++) {
          let tag = "";
          const offset = start + p.parseUShort();
          const length = p.parseUShort();
          for (let j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.getInt8(j));
          }
          tags.push(tag);
        }
        return tags;
      }
      var ltag_default = { make: makeLtagTable, parse: parseLtagTable };
      function parseMaxpTable(data, start) {
        const maxp = {};
        const p = new parse_default.Parser(data, start);
        maxp.version = p.parseVersion();
        maxp.numGlyphs = p.parseUShort();
        if (maxp.version === 1) {
          maxp.maxPoints = p.parseUShort();
          maxp.maxContours = p.parseUShort();
          maxp.maxCompositePoints = p.parseUShort();
          maxp.maxCompositeContours = p.parseUShort();
          maxp.maxZones = p.parseUShort();
          maxp.maxTwilightPoints = p.parseUShort();
          maxp.maxStorage = p.parseUShort();
          maxp.maxFunctionDefs = p.parseUShort();
          maxp.maxInstructionDefs = p.parseUShort();
          maxp.maxStackElements = p.parseUShort();
          maxp.maxSizeOfInstructions = p.parseUShort();
          maxp.maxComponentElements = p.parseUShort();
          maxp.maxComponentDepth = p.parseUShort();
        }
        return maxp;
      }
      function makeMaxpTable(numGlyphs) {
        return new table_default.Table("maxp", [
          { name: "version", type: "FIXED", value: 20480 },
          { name: "numGlyphs", type: "USHORT", value: numGlyphs }
        ]);
      }
      var maxp_default = { parse: parseMaxpTable, make: makeMaxpTable };
      var unicodeRanges = [
        { begin: 0, end: 127 },
        // Basic Latin
        { begin: 128, end: 255 },
        // Latin-1 Supplement
        { begin: 256, end: 383 },
        // Latin Extended-A
        { begin: 384, end: 591 },
        // Latin Extended-B
        { begin: 592, end: 687 },
        // IPA Extensions
        { begin: 688, end: 767 },
        // Spacing Modifier Letters
        { begin: 768, end: 879 },
        // Combining Diacritical Marks
        { begin: 880, end: 1023 },
        // Greek and Coptic
        { begin: 11392, end: 11519 },
        // Coptic
        { begin: 1024, end: 1279 },
        // Cyrillic
        { begin: 1328, end: 1423 },
        // Armenian
        { begin: 1424, end: 1535 },
        // Hebrew
        { begin: 42240, end: 42559 },
        // Vai
        { begin: 1536, end: 1791 },
        // Arabic
        { begin: 1984, end: 2047 },
        // NKo
        { begin: 2304, end: 2431 },
        // Devanagari
        { begin: 2432, end: 2559 },
        // Bengali
        { begin: 2560, end: 2687 },
        // Gurmukhi
        { begin: 2688, end: 2815 },
        // Gujarati
        { begin: 2816, end: 2943 },
        // Oriya
        { begin: 2944, end: 3071 },
        // Tamil
        { begin: 3072, end: 3199 },
        // Telugu
        { begin: 3200, end: 3327 },
        // Kannada
        { begin: 3328, end: 3455 },
        // Malayalam
        { begin: 3584, end: 3711 },
        // Thai
        { begin: 3712, end: 3839 },
        // Lao
        { begin: 4256, end: 4351 },
        // Georgian
        { begin: 6912, end: 7039 },
        // Balinese
        { begin: 4352, end: 4607 },
        // Hangul Jamo
        { begin: 7680, end: 7935 },
        // Latin Extended Additional
        { begin: 7936, end: 8191 },
        // Greek Extended
        { begin: 8192, end: 8303 },
        // General Punctuation
        { begin: 8304, end: 8351 },
        // Superscripts And Subscripts
        { begin: 8352, end: 8399 },
        // Currency Symbol
        { begin: 8400, end: 8447 },
        // Combining Diacritical Marks For Symbols
        { begin: 8448, end: 8527 },
        // Letterlike Symbols
        { begin: 8528, end: 8591 },
        // Number Forms
        { begin: 8592, end: 8703 },
        // Arrows
        { begin: 8704, end: 8959 },
        // Mathematical Operators
        { begin: 8960, end: 9215 },
        // Miscellaneous Technical
        { begin: 9216, end: 9279 },
        // Control Pictures
        { begin: 9280, end: 9311 },
        // Optical Character Recognition
        { begin: 9312, end: 9471 },
        // Enclosed Alphanumerics
        { begin: 9472, end: 9599 },
        // Box Drawing
        { begin: 9600, end: 9631 },
        // Block Elements
        { begin: 9632, end: 9727 },
        // Geometric Shapes
        { begin: 9728, end: 9983 },
        // Miscellaneous Symbols
        { begin: 9984, end: 10175 },
        // Dingbats
        { begin: 12288, end: 12351 },
        // CJK Symbols And Punctuation
        { begin: 12352, end: 12447 },
        // Hiragana
        { begin: 12448, end: 12543 },
        // Katakana
        { begin: 12544, end: 12591 },
        // Bopomofo
        { begin: 12592, end: 12687 },
        // Hangul Compatibility Jamo
        { begin: 43072, end: 43135 },
        // Phags-pa
        { begin: 12800, end: 13055 },
        // Enclosed CJK Letters And Months
        { begin: 13056, end: 13311 },
        // CJK Compatibility
        { begin: 44032, end: 55215 },
        // Hangul Syllables
        { begin: 55296, end: 57343 },
        // Non-Plane 0 *
        { begin: 67840, end: 67871 },
        // Phoenicia
        { begin: 19968, end: 40959 },
        // CJK Unified Ideographs
        { begin: 57344, end: 63743 },
        // Private Use Area (plane 0)
        { begin: 12736, end: 12783 },
        // CJK Strokes
        { begin: 64256, end: 64335 },
        // Alphabetic Presentation Forms
        { begin: 64336, end: 65023 },
        // Arabic Presentation Forms-A
        { begin: 65056, end: 65071 },
        // Combining Half Marks
        { begin: 65040, end: 65055 },
        // Vertical Forms
        { begin: 65104, end: 65135 },
        // Small Form Variants
        { begin: 65136, end: 65279 },
        // Arabic Presentation Forms-B
        { begin: 65280, end: 65519 },
        // Halfwidth And Fullwidth Forms
        { begin: 65520, end: 65535 },
        // Specials
        { begin: 3840, end: 4095 },
        // Tibetan
        { begin: 1792, end: 1871 },
        // Syriac
        { begin: 1920, end: 1983 },
        // Thaana
        { begin: 3456, end: 3583 },
        // Sinhala
        { begin: 4096, end: 4255 },
        // Myanmar
        { begin: 4608, end: 4991 },
        // Ethiopic
        { begin: 5024, end: 5119 },
        // Cherokee
        { begin: 5120, end: 5759 },
        // Unified Canadian Aboriginal Syllabics
        { begin: 5760, end: 5791 },
        // Ogham
        { begin: 5792, end: 5887 },
        // Runic
        { begin: 6016, end: 6143 },
        // Khmer
        { begin: 6144, end: 6319 },
        // Mongolian
        { begin: 10240, end: 10495 },
        // Braille Patterns
        { begin: 40960, end: 42127 },
        // Yi Syllables
        { begin: 5888, end: 5919 },
        // Tagalog
        { begin: 66304, end: 66351 },
        // Old Italic
        { begin: 66352, end: 66383 },
        // Gothic
        { begin: 66560, end: 66639 },
        // Deseret
        { begin: 118784, end: 119039 },
        // Byzantine Musical Symbols
        { begin: 119808, end: 120831 },
        // Mathematical Alphanumeric Symbols
        { begin: 1044480, end: 1048573 },
        // Private Use (plane 15)
        { begin: 65024, end: 65039 },
        // Variation Selectors
        { begin: 917504, end: 917631 },
        // Tags
        { begin: 6400, end: 6479 },
        // Limbu
        { begin: 6480, end: 6527 },
        // Tai Le
        { begin: 6528, end: 6623 },
        // New Tai Lue
        { begin: 6656, end: 6687 },
        // Buginese
        { begin: 11264, end: 11359 },
        // Glagolitic
        { begin: 11568, end: 11647 },
        // Tifinagh
        { begin: 19904, end: 19967 },
        // Yijing Hexagram Symbols
        { begin: 43008, end: 43055 },
        // Syloti Nagri
        { begin: 65536, end: 65663 },
        // Linear B Syllabary
        { begin: 65856, end: 65935 },
        // Ancient Greek Numbers
        { begin: 66432, end: 66463 },
        // Ugaritic
        { begin: 66464, end: 66527 },
        // Old Persian
        { begin: 66640, end: 66687 },
        // Shavian
        { begin: 66688, end: 66735 },
        // Osmanya
        { begin: 67584, end: 67647 },
        // Cypriot Syllabary
        { begin: 68096, end: 68191 },
        // Kharoshthi
        { begin: 119552, end: 119647 },
        // Tai Xuan Jing Symbols
        { begin: 73728, end: 74751 },
        // Cuneiform
        { begin: 119648, end: 119679 },
        // Counting Rod Numerals
        { begin: 7040, end: 7103 },
        // Sundanese
        { begin: 7168, end: 7247 },
        // Lepcha
        { begin: 7248, end: 7295 },
        // Ol Chiki
        { begin: 43136, end: 43231 },
        // Saurashtra
        { begin: 43264, end: 43311 },
        // Kayah Li
        { begin: 43312, end: 43359 },
        // Rejang
        { begin: 43520, end: 43615 },
        // Cham
        { begin: 65936, end: 65999 },
        // Ancient Symbols
        { begin: 66e3, end: 66047 },
        // Phaistos Disc
        { begin: 66208, end: 66271 },
        // Carian
        { begin: 127024, end: 127135 }
        // Domino Tiles
      ];
      function getUnicodeRange(unicode) {
        for (let i = 0; i < unicodeRanges.length; i += 1) {
          const range = unicodeRanges[i];
          if (unicode >= range.begin && unicode < range.end) {
            return i;
          }
        }
        return -1;
      }
      function parseOS2Table(data, start) {
        const os2 = {};
        const p = new parse_default.Parser(data, start);
        os2.version = p.parseUShort();
        os2.xAvgCharWidth = p.parseShort();
        os2.usWeightClass = p.parseUShort();
        os2.usWidthClass = p.parseUShort();
        os2.fsType = p.parseUShort();
        os2.ySubscriptXSize = p.parseShort();
        os2.ySubscriptYSize = p.parseShort();
        os2.ySubscriptXOffset = p.parseShort();
        os2.ySubscriptYOffset = p.parseShort();
        os2.ySuperscriptXSize = p.parseShort();
        os2.ySuperscriptYSize = p.parseShort();
        os2.ySuperscriptXOffset = p.parseShort();
        os2.ySuperscriptYOffset = p.parseShort();
        os2.yStrikeoutSize = p.parseShort();
        os2.yStrikeoutPosition = p.parseShort();
        os2.sFamilyClass = p.parseShort();
        os2.panose = [];
        for (let i = 0; i < 10; i++) {
          os2.panose[i] = p.parseByte();
        }
        os2.ulUnicodeRange1 = p.parseULong();
        os2.ulUnicodeRange2 = p.parseULong();
        os2.ulUnicodeRange3 = p.parseULong();
        os2.ulUnicodeRange4 = p.parseULong();
        os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
        os2.fsSelection = p.parseUShort();
        os2.usFirstCharIndex = p.parseUShort();
        os2.usLastCharIndex = p.parseUShort();
        os2.sTypoAscender = p.parseShort();
        os2.sTypoDescender = p.parseShort();
        os2.sTypoLineGap = p.parseShort();
        os2.usWinAscent = p.parseUShort();
        os2.usWinDescent = p.parseUShort();
        if (os2.version >= 1) {
          os2.ulCodePageRange1 = p.parseULong();
          os2.ulCodePageRange2 = p.parseULong();
        }
        if (os2.version >= 2) {
          os2.sxHeight = p.parseShort();
          os2.sCapHeight = p.parseShort();
          os2.usDefaultChar = p.parseUShort();
          os2.usBreakChar = p.parseUShort();
          os2.usMaxContent = p.parseUShort();
        }
        return os2;
      }
      function makeOS2Table(options) {
        return new table_default.Table("OS/2", [
          { name: "version", type: "USHORT", value: 3 },
          { name: "xAvgCharWidth", type: "SHORT", value: 0 },
          { name: "usWeightClass", type: "USHORT", value: 0 },
          { name: "usWidthClass", type: "USHORT", value: 0 },
          { name: "fsType", type: "USHORT", value: 0 },
          { name: "ySubscriptXSize", type: "SHORT", value: 650 },
          { name: "ySubscriptYSize", type: "SHORT", value: 699 },
          { name: "ySubscriptXOffset", type: "SHORT", value: 0 },
          { name: "ySubscriptYOffset", type: "SHORT", value: 140 },
          { name: "ySuperscriptXSize", type: "SHORT", value: 650 },
          { name: "ySuperscriptYSize", type: "SHORT", value: 699 },
          { name: "ySuperscriptXOffset", type: "SHORT", value: 0 },
          { name: "ySuperscriptYOffset", type: "SHORT", value: 479 },
          { name: "yStrikeoutSize", type: "SHORT", value: 49 },
          { name: "yStrikeoutPosition", type: "SHORT", value: 258 },
          { name: "sFamilyClass", type: "SHORT", value: 0 },
          { name: "bFamilyType", type: "BYTE", value: 0 },
          { name: "bSerifStyle", type: "BYTE", value: 0 },
          { name: "bWeight", type: "BYTE", value: 0 },
          { name: "bProportion", type: "BYTE", value: 0 },
          { name: "bContrast", type: "BYTE", value: 0 },
          { name: "bStrokeVariation", type: "BYTE", value: 0 },
          { name: "bArmStyle", type: "BYTE", value: 0 },
          { name: "bLetterform", type: "BYTE", value: 0 },
          { name: "bMidline", type: "BYTE", value: 0 },
          { name: "bXHeight", type: "BYTE", value: 0 },
          { name: "ulUnicodeRange1", type: "ULONG", value: 0 },
          { name: "ulUnicodeRange2", type: "ULONG", value: 0 },
          { name: "ulUnicodeRange3", type: "ULONG", value: 0 },
          { name: "ulUnicodeRange4", type: "ULONG", value: 0 },
          { name: "achVendID", type: "CHARARRAY", value: "XXXX" },
          { name: "fsSelection", type: "USHORT", value: 0 },
          { name: "usFirstCharIndex", type: "USHORT", value: 0 },
          { name: "usLastCharIndex", type: "USHORT", value: 0 },
          { name: "sTypoAscender", type: "SHORT", value: 0 },
          { name: "sTypoDescender", type: "SHORT", value: 0 },
          { name: "sTypoLineGap", type: "SHORT", value: 0 },
          { name: "usWinAscent", type: "USHORT", value: 0 },
          { name: "usWinDescent", type: "USHORT", value: 0 },
          { name: "ulCodePageRange1", type: "ULONG", value: 0 },
          { name: "ulCodePageRange2", type: "ULONG", value: 0 },
          { name: "sxHeight", type: "SHORT", value: 0 },
          { name: "sCapHeight", type: "SHORT", value: 0 },
          { name: "usDefaultChar", type: "USHORT", value: 0 },
          { name: "usBreakChar", type: "USHORT", value: 0 },
          { name: "usMaxContext", type: "USHORT", value: 0 }
        ], options);
      }
      var os2_default = { parse: parseOS2Table, make: makeOS2Table, unicodeRanges, getUnicodeRange };
      function parsePostTable(data, start) {
        const post = {};
        const p = new parse_default.Parser(data, start);
        post.version = p.parseVersion();
        post.italicAngle = p.parseFixed();
        post.underlinePosition = p.parseShort();
        post.underlineThickness = p.parseShort();
        post.isFixedPitch = p.parseULong();
        post.minMemType42 = p.parseULong();
        post.maxMemType42 = p.parseULong();
        post.minMemType1 = p.parseULong();
        post.maxMemType1 = p.parseULong();
        switch (post.version) {
          case 1:
            post.names = standardNames.slice();
            break;
          case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
              post.glyphNameIndex[i] = p.parseUShort();
            }
            post.names = [];
            for (let i = 0; i < post.numberOfGlyphs; i++) {
              if (post.glyphNameIndex[i] >= standardNames.length) {
                const nameLength = p.parseChar();
                post.names.push(p.parseString(nameLength));
              }
            }
            break;
          case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
              post.offset[i] = p.parseChar();
            }
            break;
        }
        return post;
      }
      function makePostTable(font) {
        const {
          italicAngle = Math.round((font.italicAngle || 0) * 65536),
          underlinePosition = 0,
          underlineThickness = 0,
          isFixedPitch = 0,
          minMemType42 = 0,
          maxMemType42 = 0,
          minMemType1 = 0,
          maxMemType1 = 0
        } = font.tables.post || {};
        return new table_default.Table("post", [
          { name: "version", type: "FIXED", value: 196608 },
          { name: "italicAngle", type: "FIXED", value: italicAngle },
          { name: "underlinePosition", type: "FWORD", value: underlinePosition },
          { name: "underlineThickness", type: "FWORD", value: underlineThickness },
          { name: "isFixedPitch", type: "ULONG", value: isFixedPitch },
          { name: "minMemType42", type: "ULONG", value: minMemType42 },
          { name: "maxMemType42", type: "ULONG", value: maxMemType42 },
          { name: "minMemType1", type: "ULONG", value: minMemType1 },
          { name: "maxMemType1", type: "ULONG", value: maxMemType1 }
        ]);
      }
      var post_default = { parse: parsePostTable, make: makePostTable };
      var subtableParsers = new Array(9);
      subtableParsers[1] = function parseLookup1() {
        const start = this.offset + this.relativeOffset;
        const substFormat = this.parseUShort();
        if (substFormat === 1) {
          return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            deltaGlyphId: this.parseShort()
          };
        } else if (substFormat === 2) {
          return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            substitute: this.parseOffset16List()
          };
        }
        check_default.assert(false, "0x" + start.toString(16) + ": lookup type 1 format must be 1 or 2.");
      };
      subtableParsers[2] = function parseLookup2() {
        const substFormat = this.parseUShort();
        check_default.argument(substFormat === 1, "GSUB Multiple Substitution Subtable identifier-format must be 1");
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          sequences: this.parseListOfLists()
        };
      };
      subtableParsers[3] = function parseLookup3() {
        const substFormat = this.parseUShort();
        check_default.argument(substFormat === 1, "GSUB Alternate Substitution Subtable identifier-format must be 1");
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          alternateSets: this.parseListOfLists()
        };
      };
      subtableParsers[4] = function parseLookup4() {
        const substFormat = this.parseUShort();
        check_default.argument(substFormat === 1, "GSUB ligature table identifier-format must be 1");
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          ligatureSets: this.parseListOfLists(function() {
            return {
              ligGlyph: this.parseUShort(),
              components: this.parseUShortList(this.parseUShort() - 1)
            };
          })
        };
      };
      var lookupRecordDesc = {
        sequenceIndex: Parser.uShort,
        lookupListIndex: Parser.uShort
      };
      subtableParsers[5] = function parseLookup5() {
        const start = this.offset + this.relativeOffset;
        const substFormat = this.parseUShort();
        if (substFormat === 1) {
          return {
            substFormat,
            coverage: this.parsePointer(Parser.coverage),
            ruleSets: this.parseListOfLists(function() {
              const glyphCount = this.parseUShort();
              const substCount = this.parseUShort();
              return {
                input: this.parseUShortList(glyphCount - 1),
                lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
              };
            })
          };
        } else if (substFormat === 2) {
          return {
            substFormat,
            coverage: this.parsePointer(Parser.coverage),
            classDef: this.parsePointer(Parser.classDef),
            classSets: this.parseListOfLists(function() {
              const glyphCount = this.parseUShort();
              const substCount = this.parseUShort();
              return {
                classes: this.parseUShortList(glyphCount - 1),
                lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
              };
            })
          };
        } else if (substFormat === 3) {
          const glyphCount = this.parseUShort();
          const substCount = this.parseUShort();
          return {
            substFormat,
            coverages: this.parseList(glyphCount, Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
          };
        }
        check_default.assert(false, "0x" + start.toString(16) + ": lookup type 5 format must be 1, 2 or 3.");
      };
      subtableParsers[6] = function parseLookup6() {
        const start = this.offset + this.relativeOffset;
        const substFormat = this.parseUShort();
        if (substFormat === 1) {
          return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            chainRuleSets: this.parseListOfLists(function() {
              return {
                backtrack: this.parseUShortList(),
                input: this.parseUShortList(this.parseShort() - 1),
                lookahead: this.parseUShortList(),
                lookupRecords: this.parseRecordList(lookupRecordDesc)
              };
            })
          };
        } else if (substFormat === 2) {
          return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            backtrackClassDef: this.parsePointer(Parser.classDef),
            inputClassDef: this.parsePointer(Parser.classDef),
            lookaheadClassDef: this.parsePointer(Parser.classDef),
            chainClassSet: this.parseListOfLists(function() {
              return {
                backtrack: this.parseUShortList(),
                input: this.parseUShortList(this.parseShort() - 1),
                lookahead: this.parseUShortList(),
                lookupRecords: this.parseRecordList(lookupRecordDesc)
              };
            })
          };
        } else if (substFormat === 3) {
          return {
            substFormat: 3,
            backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(lookupRecordDesc)
          };
        }
        check_default.assert(false, "0x" + start.toString(16) + ": lookup type 6 format must be 1, 2 or 3.");
      };
      subtableParsers[7] = function parseLookup7() {
        const substFormat = this.parseUShort();
        check_default.argument(substFormat === 1, "GSUB Extension Substitution subtable identifier-format must be 1");
        const extensionLookupType = this.parseUShort();
        const extensionParser = new Parser(this.data, this.offset + this.parseULong());
        return {
          substFormat: 1,
          lookupType: extensionLookupType,
          extension: subtableParsers[extensionLookupType].call(extensionParser)
        };
      };
      subtableParsers[8] = function parseLookup8() {
        const substFormat = this.parseUShort();
        check_default.argument(substFormat === 1, "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1");
        return {
          substFormat,
          coverage: this.parsePointer(Parser.coverage),
          backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
          lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
          substitutes: this.parseUShortList()
        };
      };
      function parseGsubTable(data, start) {
        start = start || 0;
        const p = new Parser(data, start);
        const tableVersion = p.parseVersion(1);
        check_default.argument(tableVersion === 1 || tableVersion === 1.1, "Unsupported GSUB table version.");
        if (tableVersion === 1) {
          return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers)
          };
        } else {
          return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
            variations: p.parseFeatureVariationsList()
          };
        }
      }
      var subtableMakers = new Array(9);
      subtableMakers[1] = function makeLookup1(subtable) {
        if (subtable.substFormat === 1) {
          return new table_default.Table("substitutionTable", [
            { name: "substFormat", type: "USHORT", value: 1 },
            { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) },
            { name: "deltaGlyphID", type: "SHORT", value: subtable.deltaGlyphId }
          ]);
        } else if (subtable.substFormat === 2) {
          return new table_default.Table("substitutionTable", [
            { name: "substFormat", type: "USHORT", value: 2 },
            { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
          ].concat(table_default.ushortList("substitute", subtable.substitute)));
        }
        check_default.fail("Lookup type 1 substFormat must be 1 or 2.");
      };
      subtableMakers[2] = function makeLookup2(subtable) {
        check_default.assert(subtable.substFormat === 1, "Lookup type 2 substFormat must be 1.");
        return new table_default.Table("substitutionTable", [
          { name: "substFormat", type: "USHORT", value: 1 },
          { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
        ].concat(table_default.tableList("seqSet", subtable.sequences, function(sequenceSet) {
          return new table_default.Table("sequenceSetTable", table_default.ushortList("sequence", sequenceSet));
        })));
      };
      subtableMakers[3] = function makeLookup3(subtable) {
        check_default.assert(subtable.substFormat === 1, "Lookup type 3 substFormat must be 1.");
        return new table_default.Table("substitutionTable", [
          { name: "substFormat", type: "USHORT", value: 1 },
          { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
        ].concat(table_default.tableList("altSet", subtable.alternateSets, function(alternateSet) {
          return new table_default.Table("alternateSetTable", table_default.ushortList("alternate", alternateSet));
        })));
      };
      subtableMakers[4] = function makeLookup4(subtable) {
        check_default.assert(subtable.substFormat === 1, "Lookup type 4 substFormat must be 1.");
        return new table_default.Table("substitutionTable", [
          { name: "substFormat", type: "USHORT", value: 1 },
          { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
        ].concat(table_default.tableList("ligSet", subtable.ligatureSets, function(ligatureSet) {
          return new table_default.Table("ligatureSetTable", table_default.tableList("ligature", ligatureSet, function(ligature) {
            return new table_default.Table(
              "ligatureTable",
              [{ name: "ligGlyph", type: "USHORT", value: ligature.ligGlyph }].concat(table_default.ushortList("component", ligature.components, ligature.components.length + 1))
            );
          }));
        })));
      };
      subtableMakers[5] = function makeLookup5(subtable) {
        if (subtable.substFormat === 1) {
          return new table_default.Table("contextualSubstitutionTable", [
            { name: "substFormat", type: "USHORT", value: subtable.substFormat },
            { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
          ].concat(table_default.tableList("sequenceRuleSet", subtable.ruleSets, function(sequenceRuleSet) {
            if (!sequenceRuleSet) {
              return new table_default.Table("NULL", null);
            }
            return new table_default.Table("sequenceRuleSetTable", table_default.tableList("sequenceRule", sequenceRuleSet, function(sequenceRule) {
              let tableData = table_default.ushortList("seqLookup", [], sequenceRule.lookupRecords.length).concat(table_default.ushortList("inputSequence", sequenceRule.input, sequenceRule.input.length + 1));
              [tableData[0], tableData[1]] = [tableData[1], tableData[0]];
              for (let i = 0; i < sequenceRule.lookupRecords.length; i++) {
                const record = sequenceRule.lookupRecords[i];
                tableData = tableData.concat({ name: "sequenceIndex" + i, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: record.lookupListIndex });
              }
              return new table_default.Table("sequenceRuleTable", tableData);
            }));
          })));
        } else if (subtable.substFormat === 2) {
          return new table_default.Table("contextualSubstitutionTable", [
            { name: "substFormat", type: "USHORT", value: subtable.substFormat },
            { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) },
            { name: "classDef", type: "TABLE", value: new table_default.ClassDef(subtable.classDef) }
          ].concat(table_default.tableList("classSeqRuleSet", subtable.classSets, function(classSeqRuleSet) {
            if (!classSeqRuleSet) {
              return new table_default.Table("NULL", null);
            }
            return new table_default.Table("classSeqRuleSetTable", table_default.tableList("classSeqRule", classSeqRuleSet, function(classSeqRule) {
              let tableData = table_default.ushortList("classes", classSeqRule.classes, classSeqRule.classes.length + 1).concat(table_default.ushortList("seqLookupCount", [], classSeqRule.lookupRecords.length));
              for (let i = 0; i < classSeqRule.lookupRecords.length; i++) {
                const record = classSeqRule.lookupRecords[i];
                tableData = tableData.concat({ name: "sequenceIndex" + i, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: record.lookupListIndex });
              }
              return new table_default.Table("classSeqRuleTable", tableData);
            }));
          })));
        } else if (subtable.substFormat === 3) {
          let tableData = [
            { name: "substFormat", type: "USHORT", value: subtable.substFormat }
          ];
          tableData.push({ name: "inputGlyphCount", type: "USHORT", value: subtable.coverages.length });
          tableData.push({ name: "substitutionCount", type: "USHORT", value: subtable.lookupRecords.length });
          for (let i = 0; i < subtable.coverages.length; i++) {
            const coverage = subtable.coverages[i];
            tableData.push({ name: "inputCoverage" + i, type: "TABLE", value: new table_default.Coverage(coverage) });
          }
          for (let i = 0; i < subtable.lookupRecords.length; i++) {
            const record = subtable.lookupRecords[i];
            tableData = tableData.concat({ name: "sequenceIndex" + i, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: record.lookupListIndex });
          }
          let returnTable = new table_default.Table("contextualSubstitutionTable", tableData);
          return returnTable;
        }
        check_default.assert(false, "lookup type 5 format must be 1, 2 or 3.");
      };
      subtableMakers[6] = function makeLookup6(subtable) {
        if (subtable.substFormat === 1) {
          let returnTable = new table_default.Table("chainContextTable", [
            { name: "substFormat", type: "USHORT", value: subtable.substFormat },
            { name: "coverage", type: "TABLE", value: new table_default.Coverage(subtable.coverage) }
          ].concat(table_default.tableList("chainRuleSet", subtable.chainRuleSets, function(chainRuleSet) {
            return new table_default.Table("chainRuleSetTable", table_default.tableList("chainRule", chainRuleSet, function(chainRule) {
              let tableData = table_default.ushortList("backtrackGlyph", chainRule.backtrack, chainRule.backtrack.length).concat(table_default.ushortList("inputGlyph", chainRule.input, chainRule.input.length + 1)).concat(table_default.ushortList("lookaheadGlyph", chainRule.lookahead, chainRule.lookahead.length)).concat(table_default.ushortList("substitution", [], chainRule.lookupRecords.length));
              for (let i = 0; i < chainRule.lookupRecords.length; i++) {
                const record = chainRule.lookupRecords[i];
                tableData = tableData.concat({ name: "sequenceIndex" + i, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: record.lookupListIndex });
              }
              return new table_default.Table("chainRuleTable", tableData);
            }));
          })));
          return returnTable;
        } else if (subtable.substFormat === 2) {
          check_default.assert(false, "lookup type 6 format 2 is not yet supported.");
        } else if (subtable.substFormat === 3) {
          let tableData = [
            { name: "substFormat", type: "USHORT", value: subtable.substFormat }
          ];
          tableData.push({ name: "backtrackGlyphCount", type: "USHORT", value: subtable.backtrackCoverage.length });
          for (let i = 0; i < subtable.backtrackCoverage.length; i++) {
            const coverage = subtable.backtrackCoverage[i];
            tableData.push({ name: "backtrackCoverage" + i, type: "TABLE", value: new table_default.Coverage(coverage) });
          }
          tableData.push({ name: "inputGlyphCount", type: "USHORT", value: subtable.inputCoverage.length });
          for (let i = 0; i < subtable.inputCoverage.length; i++) {
            const coverage = subtable.inputCoverage[i];
            tableData.push({ name: "inputCoverage" + i, type: "TABLE", value: new table_default.Coverage(coverage) });
          }
          tableData.push({ name: "lookaheadGlyphCount", type: "USHORT", value: subtable.lookaheadCoverage.length });
          for (let i = 0; i < subtable.lookaheadCoverage.length; i++) {
            const coverage = subtable.lookaheadCoverage[i];
            tableData.push({ name: "lookaheadCoverage" + i, type: "TABLE", value: new table_default.Coverage(coverage) });
          }
          tableData.push({ name: "substitutionCount", type: "USHORT", value: subtable.lookupRecords.length });
          for (let i = 0; i < subtable.lookupRecords.length; i++) {
            const record = subtable.lookupRecords[i];
            tableData = tableData.concat({ name: "sequenceIndex" + i, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i, type: "USHORT", value: record.lookupListIndex });
          }
          let returnTable = new table_default.Table("chainContextTable", tableData);
          return returnTable;
        }
        check_default.assert(false, "lookup type 6 format must be 1, 2 or 3.");
      };
      function makeGsubTable(gsub) {
        return new table_default.Table("GSUB", [
          { name: "version", type: "ULONG", value: 65536 },
          { name: "scripts", type: "TABLE", value: new table_default.ScriptList(gsub.scripts) },
          { name: "features", type: "TABLE", value: new table_default.FeatureList(gsub.features) },
          { name: "lookups", type: "TABLE", value: new table_default.LookupList(gsub.lookups, subtableMakers) }
        ]);
      }
      var gsub_default = { parse: parseGsubTable, make: makeGsubTable };
      function parseMetaTable(data, start) {
        const p = new parse_default.Parser(data, start);
        const tableVersion = p.parseULong();
        check_default.argument(tableVersion === 1, "Unsupported META table version.");
        p.parseULong();
        p.parseULong();
        const numDataMaps = p.parseULong();
        const tags = {};
        for (let i = 0; i < numDataMaps; i++) {
          const tag = p.parseTag();
          const dataOffset = p.parseULong();
          const dataLength = p.parseULong();
          if (tag === "appl" || tag === "bild")
            continue;
          const text = decode.UTF8(data, start + dataOffset, dataLength);
          tags[tag] = text;
        }
        return tags;
      }
      function makeMetaTable(tags) {
        const numTags = Object.keys(tags).length;
        let stringPool = "";
        const stringPoolOffset = 16 + numTags * 12;
        const result = new table_default.Table("meta", [
          { name: "version", type: "ULONG", value: 1 },
          { name: "flags", type: "ULONG", value: 0 },
          { name: "offset", type: "ULONG", value: stringPoolOffset },
          { name: "numTags", type: "ULONG", value: numTags }
        ]);
        for (let tag in tags) {
          const pos = stringPool.length;
          stringPool += tags[tag];
          result.fields.push({ name: "tag " + tag, type: "TAG", value: tag });
          result.fields.push({ name: "offset " + tag, type: "ULONG", value: stringPoolOffset + pos });
          result.fields.push({ name: "length " + tag, type: "ULONG", value: tags[tag].length });
        }
        result.fields.push({ name: "stringPool", type: "CHARARRAY", value: stringPool });
        return result;
      }
      var meta_default = { parse: parseMetaTable, make: makeMetaTable };
      function parseColrTable(data, start) {
        const p = new Parser(data, start);
        const version = p.parseUShort();
        if (version !== 0) {
          console.warn("Only COLRv0 is currently fully supported. A subset of color glyphs might be available in this font if provided in the v0 format.");
        }
        const numBaseGlyphRecords = p.parseUShort();
        const baseGlyphRecordsOffset = p.parseOffset32();
        const layerRecordsOffset = p.parseOffset32();
        const numLayerRecords = p.parseUShort();
        p.relativeOffset = baseGlyphRecordsOffset;
        const baseGlyphRecords = p.parseRecordList(numBaseGlyphRecords, {
          glyphID: Parser.uShort,
          firstLayerIndex: Parser.uShort,
          numLayers: Parser.uShort
        });
        p.relativeOffset = layerRecordsOffset;
        const layerRecords = p.parseRecordList(numLayerRecords, {
          glyphID: Parser.uShort,
          paletteIndex: Parser.uShort
        });
        return {
          version,
          baseGlyphRecords,
          layerRecords
        };
      }
      function makeColrTable({ version = 0, baseGlyphRecords = [], layerRecords = [] }) {
        check_default.argument(version === 0, "Only COLRv0 supported.");
        const baseGlyphRecordsOffset = 14;
        const layerRecordsOffset = baseGlyphRecordsOffset + baseGlyphRecords.length * 6;
        return new table_default.Table("COLR", [
          { name: "version", type: "USHORT", value: version },
          { name: "numBaseGlyphRecords", type: "USHORT", value: baseGlyphRecords.length },
          { name: "baseGlyphRecordsOffset", type: "ULONG", value: baseGlyphRecordsOffset },
          { name: "layerRecordsOffset", type: "ULONG", value: layerRecordsOffset },
          { name: "numLayerRecords", type: "USHORT", value: layerRecords.length },
          ...baseGlyphRecords.map((glyph, i) => [
            { name: "glyphID_" + i, type: "USHORT", value: glyph.glyphID },
            { name: "firstLayerIndex_" + i, type: "USHORT", value: glyph.firstLayerIndex },
            { name: "numLayers_" + i, type: "USHORT", value: glyph.numLayers }
          ]).flat(),
          ...layerRecords.map((layer, i) => [
            { name: "LayerGlyphID_" + i, type: "USHORT", value: layer.glyphID },
            { name: "paletteIndex_" + i, type: "USHORT", value: layer.paletteIndex }
          ]).flat()
        ]);
      }
      var colr_default = { parse: parseColrTable, make: makeColrTable };
      function makeFvarAxis(n, axis) {
        return [
          { name: "tag_" + n, type: "TAG", value: axis.tag },
          { name: "minValue_" + n, type: "FIXED", value: axis.minValue << 16 },
          { name: "defaultValue_" + n, type: "FIXED", value: axis.defaultValue << 16 },
          { name: "maxValue_" + n, type: "FIXED", value: axis.maxValue << 16 },
          { name: "flags_" + n, type: "USHORT", value: 0 },
          { name: "nameID_" + n, type: "USHORT", value: axis.axisNameID }
        ];
      }
      function parseFvarAxis(data, start, names) {
        const axis = {};
        const p = new parse_default.Parser(data, start);
        axis.tag = p.parseTag();
        axis.minValue = p.parseFixed();
        axis.defaultValue = p.parseFixed();
        axis.maxValue = p.parseFixed();
        p.skip("uShort", 1);
        const axisNameID = p.parseUShort();
        axis.axisNameID = axisNameID;
        axis.name = getNameByID(names, axisNameID);
        return axis;
      }
      function makeFvarInstance(n, inst, axes, optionalFields = {}) {
        const fields = [
          { name: "nameID_" + n, type: "USHORT", value: inst.subfamilyNameID },
          { name: "flags_" + n, type: "USHORT", value: 0 }
        ];
        for (let i = 0; i < axes.length; ++i) {
          const axisTag = axes[i].tag;
          fields.push({
            name: "axis_" + n + " " + axisTag,
            type: "FIXED",
            value: inst.coordinates[axisTag] << 16
          });
        }
        if (optionalFields && optionalFields.postScriptNameID) {
          fields.push({
            name: "postScriptNameID_",
            type: "USHORT",
            value: inst.postScriptNameID !== void 0 ? inst.postScriptNameID : 65535
          });
        }
        return fields;
      }
      function parseFvarInstance(data, start, axes, names, instanceSize) {
        const inst = {};
        const p = new parse_default.Parser(data, start);
        const subfamilyNameID = p.parseUShort();
        inst.subfamilyNameID = subfamilyNameID;
        inst.name = getNameByID(names, subfamilyNameID, [2, 17]);
        p.skip("uShort", 1);
        inst.coordinates = {};
        for (let i = 0; i < axes.length; ++i) {
          inst.coordinates[axes[i].tag] = p.parseFixed();
        }
        if (p.relativeOffset === instanceSize) {
          inst.postScriptNameID = void 0;
          inst.postScriptName = void 0;
          return inst;
        }
        const postScriptNameID = p.parseUShort();
        inst.postScriptNameID = postScriptNameID == 65535 ? void 0 : postScriptNameID;
        inst.postScriptName = inst.postScriptNameID !== void 0 ? getNameByID(names, postScriptNameID, [6]) : "";
        return inst;
      }
      function makeFvarTable(fvar, names) {
        const result = new table_default.Table("fvar", [
          { name: "version", type: "ULONG", value: 65536 },
          { name: "offsetToData", type: "USHORT", value: 0 },
          { name: "countSizePairs", type: "USHORT", value: 2 },
          { name: "axisCount", type: "USHORT", value: fvar.axes.length },
          { name: "axisSize", type: "USHORT", value: 20 },
          { name: "instanceCount", type: "USHORT", value: fvar.instances.length },
          { name: "instanceSize", type: "USHORT", value: 4 + fvar.axes.length * 4 }
        ]);
        result.offsetToData = result.sizeOf();
        for (let i = 0; i < fvar.axes.length; i++) {
          result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
        }
        const optionalFields = {};
        for (let j = 0; j < fvar.instances.length; j++) {
          if (fvar.instances[j].postScriptNameID !== void 0) {
            result.instanceSize += 2;
            optionalFields.postScriptNameID = true;
            break;
          }
        }
        for (let j = 0; j < fvar.instances.length; j++) {
          result.fields = result.fields.concat(makeFvarInstance(
            j,
            fvar.instances[j],
            fvar.axes,
            optionalFields
          ));
        }
        return result;
      }
      function parseFvarTable(data, start, names) {
        const p = new parse_default.Parser(data, start);
        const tableVersion = p.parseULong();
        check_default.argument(tableVersion === 65536, "Unsupported fvar table version.");
        const offsetToData = p.parseOffset16();
        p.skip("uShort", 1);
        const axisCount = p.parseUShort();
        const axisSize = p.parseUShort();
        const instanceCount = p.parseUShort();
        const instanceSize = p.parseUShort();
        const axes = [];
        for (let i = 0; i < axisCount; i++) {
          axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
        }
        const instances = [];
        const instanceStart = start + offsetToData + axisCount * axisSize;
        for (let j = 0; j < instanceCount; j++) {
          instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names, instanceSize));
        }
        return { axes, instances };
      }
      var fvar_default = { make: makeFvarTable, parse: parseFvarTable };
      var axisRecordStruct = {
        tag: Parser.tag,
        nameID: Parser.uShort,
        ordering: Parser.uShort
      };
      var axisValueParsers = new Array(5);
      axisValueParsers[1] = function axisValueParser1() {
        return {
          axisIndex: this.parseUShort(),
          flags: this.parseUShort(),
          valueNameID: this.parseUShort(),
          value: this.parseFixed()
        };
      };
      axisValueParsers[2] = function axisValueParser2() {
        return {
          axisIndex: this.parseUShort(),
          flags: this.parseUShort(),
          valueNameID: this.parseUShort(),
          nominalValue: this.parseFixed(),
          rangeMinValue: this.parseFixed(),
          rangeMaxValue: this.parseFixed()
        };
      };
      axisValueParsers[3] = function axisValueParser3() {
        return {
          axisIndex: this.parseUShort(),
          flags: this.parseUShort(),
          valueNameID: this.parseUShort(),
          value: this.parseFixed(),
          linkedValue: this.parseFixed()
        };
      };
      axisValueParsers[4] = function axisValueParser4() {
        const axisCount = this.parseUShort();
        return {
          flags: this.parseUShort(),
          valueNameID: this.parseUShort(),
          axisValues: this.parseList(axisCount, function() {
            return {
              axisIndex: this.parseUShort(),
              value: this.parseFixed()
            };
          })
        };
      };
      function parseSTATAxisValue() {
        const valueTableFormat = this.parseUShort();
        const axisValueParser = axisValueParsers[valueTableFormat];
        const formatStub = {
          format: valueTableFormat
        };
        if (axisValueParser === void 0) {
          console.warn(`Unknown axis value table format ${valueTableFormat}`);
          return formatStub;
        }
        return Object.assign(formatStub, this.parseStruct(axisValueParser.bind(this)));
      }
      function parseSTATTable(data, start, fvar) {
        if (!start) {
          start = 0;
        }
        const p = new parse_default.Parser(data, start);
        const tableVersionMajor = p.parseUShort();
        const tableVersionMinor = p.parseUShort();
        if (tableVersionMajor !== 1) {
          console.warn(`Unsupported STAT table version ${tableVersionMajor}.${tableVersionMinor}`);
        }
        const version = [
          tableVersionMajor,
          tableVersionMinor
        ];
        const designAxisSize = p.parseUShort();
        const designAxisCount = p.parseUShort();
        const designAxesOffset = p.parseOffset32();
        const axisValueCount = p.parseUShort();
        const offsetToAxisValueOffsets = p.parseOffset32();
        const elidedFallbackNameID = tableVersionMajor > 1 || tableVersionMinor > 0 ? p.parseUShort() : void 0;
        if (fvar !== void 0) {
          check_default.argument(designAxisCount >= fvar.axes.length, "STAT axis count must be greater than or equal to fvar axis count");
        }
        if (axisValueCount > 0) {
          check_default.argument(designAxisCount >= 0, "STAT axis count must be greater than 0 if STAT axis value count is greater than 0");
        }
        const axes = [];
        for (let i = 0; i < designAxisCount; i++) {
          p.offset = start + designAxesOffset;
          p.relativeOffset = i * designAxisSize;
          axes.push(p.parseStruct(axisRecordStruct));
        }
        p.offset = start;
        p.relativeOffset = offsetToAxisValueOffsets;
        const valueOffsets = p.parseUShortList(axisValueCount);
        const values = [];
        for (let i = 0; i < axisValueCount; i++) {
          p.offset = start + offsetToAxisValueOffsets;
          p.relativeOffset = valueOffsets[i];
          values.push(parseSTATAxisValue.apply(p));
        }
        return {
          version,
          axes,
          values,
          elidedFallbackNameID
        };
      }
      var axisValueMakers = new Array(5);
      axisValueMakers[1] = function axisValueMaker1(n, table) {
        return [
          { name: `format${n}`, type: "USHORT", value: 1 },
          { name: `axisIndex${n}`, type: "USHORT", value: table.axisIndex },
          { name: `flags${n}`, type: "USHORT", value: table.flags },
          { name: `valueNameID${n}`, type: "USHORT", value: table.valueNameID },
          { name: `value${n}`, type: "FLOAT", value: table.value }
        ];
      };
      axisValueMakers[2] = function axisValueMaker2(n, table) {
        return [
          { name: `format${n}`, type: "USHORT", value: 2 },
          { name: `axisIndex${n}`, type: "USHORT", value: table.axisIndex },
          { name: `flags${n}`, type: "USHORT", value: table.flags },
          { name: `valueNameID${n}`, type: "USHORT", value: table.valueNameID },
          { name: `nominalValue${n}`, type: "FLOAT", value: table.nominalValue },
          { name: `rangeMinValue${n}`, type: "FLOAT", value: table.rangeMinValue },
          { name: `rangeMaxValue${n}`, type: "FLOAT", value: table.rangeMaxValue }
        ];
      };
      axisValueMakers[3] = function axisValueMaker3(n, table) {
        return [
          { name: `format${n}`, type: "USHORT", value: 3 },
          { name: `axisIndex${n}`, type: "USHORT", value: table.axisIndex },
          { name: `flags${n}`, type: "USHORT", value: table.flags },
          { name: `valueNameID${n}`, type: "USHORT", value: table.valueNameID },
          { name: `value${n}`, type: "FLOAT", value: table.value },
          { name: `linkedValue${n}`, type: "FLOAT", value: table.linkedValue }
        ];
      };
      axisValueMakers[4] = function axisValueMaker4(n, table) {
        let returnFields = [
          { name: `format${n}`, type: "USHORT", value: 4 },
          { name: `axisCount${n}`, type: "USHORT", value: table.axisValues.length },
          { name: `flags${n}`, type: "USHORT", value: table.flags },
          { name: `valueNameID${n}`, type: "USHORT", value: table.valueNameID }
        ];
        for (let i = 0; i < table.axisValues.length; i++) {
          returnFields = returnFields.concat([
            { name: `format${n}axisIndex${i}`, type: "USHORT", value: table.axisValues[i].axisIndex },
            { name: `format${n}value${i}`, type: "FLOAT", value: table.axisValues[i].value }
          ]);
        }
        return returnFields;
      };
      function makeSTATAxisRecord(n, axis) {
        return new table_default.Record("axisRecord_" + n, [
          { name: "axisTag_" + n, type: "TAG", value: axis.tag },
          { name: "axisNameID_" + n, type: "USHORT", value: axis.nameID },
          { name: "axisOrdering_" + n, type: "USHORT", value: axis.ordering }
        ]);
      }
      function makeSTATValueTable(n, tableData) {
        const valueTableFormat = tableData.format;
        const axisValueMaker = axisValueMakers[valueTableFormat];
        check_default.argument(axisValueMaker !== void 0, `Unknown axis value table format ${valueTableFormat}`);
        const fields = axisValueMaker(n, tableData);
        return new table_default.Table("axisValueTable_" + n, fields);
      }
      function makeSTATTable(STAT) {
        const result = new table_default.Table("STAT", [
          { name: "majorVersion", type: "USHORT", value: 1 },
          { name: "minorVersion", type: "USHORT", value: 2 },
          { name: "designAxisSize", type: "USHORT", value: 8 },
          { name: "designAxisCount", type: "USHORT", value: STAT.axes.length },
          { name: "designAxesOffset", type: "ULONG", value: 0 },
          { name: "axisValueCount", type: "USHORT", value: STAT.values.length },
          { name: "offsetToAxisValueOffsets", type: "ULONG", value: 0 },
          { name: "elidedFallbackNameID", type: "USHORT", value: STAT.elidedFallbackNameID }
        ]);
        result.designAxesOffset = result.offsetToAxisValueOffsets = result.sizeOf();
        for (let i = 0; i < STAT.axes.length; i++) {
          const axisRecord = makeSTATAxisRecord(i, STAT.axes[i]);
          result.offsetToAxisValueOffsets += axisRecord.sizeOf();
          result.fields = result.fields.concat(axisRecord.fields);
        }
        const axisValueOffsets = [];
        let axisValueTables = [];
        let axisValueTableOffset = STAT.values.length * 2;
        for (let j = 0; j < STAT.values.length; j++) {
          const axisValueTable = makeSTATValueTable(j, STAT.values[j]);
          axisValueOffsets.push({
            name: "offset_" + j,
            type: "USHORT",
            value: axisValueTableOffset
          });
          axisValueTableOffset += axisValueTable.sizeOf();
          axisValueTables = axisValueTables.concat(axisValueTable.fields);
        }
        result.fields = result.fields.concat(axisValueOffsets);
        result.fields = result.fields.concat(axisValueTables);
        return result;
      }
      var stat_default = { make: makeSTATTable, parse: parseSTATTable };
      function makeAvarAxisValueMap(n, axisValueMap) {
        return new table_default.Record("axisValueMap_" + n, [
          { name: "fromCoordinate_" + n, type: "F2DOT14", value: axisValueMap.fromCoordinate },
          { name: "toCoordinate_" + n, type: "F2DOT14", value: axisValueMap.toCoordinate }
        ]);
      }
      function makeAvarSegmentMap(n, axis) {
        const returnTable = new table_default.Record("segmentMap_" + n, [
          { name: "positionMapCount_" + n, type: "USHORT", value: axis.axisValueMaps.length }
        ]);
        let axisValueMaps = [];
        for (let i = 0; i < axis.axisValueMaps.length; i++) {
          const valueMap = makeAvarAxisValueMap(`${n}_${i}`, axis.axisValueMaps[i]);
          axisValueMaps = axisValueMaps.concat(valueMap.fields);
        }
        returnTable.fields = returnTable.fields.concat(axisValueMaps);
        return returnTable;
      }
      function makeAvarTable(avar, fvar) {
        check_default.argument(avar.axisSegmentMaps.length === fvar.axes.length, "avar axis count must correspond to fvar axis count");
        const result = new table_default.Table("avar", [
          { name: "majorVersion", type: "USHORT", value: 1 },
          { name: "minorVersion", type: "USHORT", value: 0 },
          { name: "reserved", type: "USHORT", value: 0 },
          { name: "axisCount", type: "USHORT", value: avar.axisSegmentMaps.length }
        ]);
        for (let i = 0; i < avar.axisSegmentMaps.length; i++) {
          const axisRecord = makeAvarSegmentMap(i, avar.axisSegmentMaps[i]);
          result.fields = result.fields.concat(axisRecord.fields);
        }
        return result;
      }
      function parseAvarTable(data, start, fvar) {
        if (!start) {
          start = 0;
        }
        const p = new Parser(data, start);
        const tableVersionMajor = p.parseUShort();
        const tableVersionMinor = p.parseUShort();
        if (tableVersionMajor !== 1) {
          console.warn(`Unsupported avar table version ${tableVersionMajor}.${tableVersionMinor}`);
        }
        p.skip("uShort", 1);
        const axisCount = p.parseUShort();
        check_default.argument(axisCount === fvar.axes.length, "avar axis count must correspond to fvar axis count");
        const axisSegmentMaps = [];
        for (let i = 0; i < axisCount; i++) {
          const axisValueMaps = [];
          const positionMapCount = p.parseUShort();
          for (let j = 0; j < positionMapCount; j++) {
            const fromCoordinate = p.parseF2Dot14();
            const toCoordinate = p.parseF2Dot14();
            axisValueMaps.push({
              fromCoordinate,
              toCoordinate
            });
          }
          axisSegmentMaps.push({
            axisValueMaps
          });
        }
        return {
          version: [tableVersionMajor, tableVersionMinor],
          axisSegmentMaps
        };
      }
      var avar_default = { make: makeAvarTable, parse: parseAvarTable };
      function parseCvarTable(data, start, fvar, cvt) {
        const p = new parse_default.Parser(data, start);
        const cvtVariations = p.parseTupleVariationStore(
          p.relativeOffset,
          fvar.axes.length,
          "cvar",
          cvt
        );
        const tableVersionMajor = p.parseUShort();
        const tableVersionMinor = p.parseUShort();
        if (tableVersionMajor !== 1) {
          console.warn(`Unsupported cvar table version ${tableVersionMajor}.${tableVersionMinor}`);
        }
        return {
          version: [tableVersionMajor, tableVersionMinor],
          ...cvtVariations
        };
      }
      function makeCvarTable() {
        console.warn("Writing of cvar tables is not yet supported.");
      }
      var cvar_default = { make: makeCvarTable, parse: parseCvarTable };
      function parseGvarTable(data, start, fvar, glyphs) {
        const p = new parse_default.Parser(data, start);
        const tableVersionMajor = p.parseUShort();
        const tableVersionMinor = p.parseUShort();
        if (tableVersionMajor !== 1) {
          console.warn(`Unsupported gvar table version ${tableVersionMajor}.${tableVersionMinor}`);
        }
        const axisCount = p.parseUShort();
        if (axisCount !== fvar.axes.length) {
          console.warn(`axisCount ${axisCount} in gvar table does not match the number of axes ${fvar.axes.length} in the fvar table!`);
        }
        const sharedTupleCount = p.parseUShort();
        const sharedTuples = p.parsePointer32(function() {
          return this.parseTupleRecords(sharedTupleCount, axisCount);
        });
        const glyphVariations = p.parseTupleVariationStoreList(axisCount, "gvar", glyphs);
        return {
          version: [tableVersionMajor, tableVersionMinor],
          sharedTuples,
          glyphVariations
        };
      }
      function makeGvarTable() {
        console.warn("Writing of gvar tables is not yet supported.");
      }
      var gvar_default = { make: makeGvarTable, parse: parseGvarTable };
      function parseGaspTable(data, start) {
        const gasp = {};
        const p = new parse_default.Parser(data, start);
        gasp.version = p.parseUShort();
        check_default.argument(gasp.version <= 1, "Unsupported gasp table version.");
        gasp.numRanges = p.parseUShort();
        gasp.gaspRanges = [];
        for (let i = 0; i < gasp.numRanges; i++) {
          gasp.gaspRanges[i] = {
            rangeMaxPPEM: p.parseUShort(),
            rangeGaspBehavior: p.parseUShort()
          };
        }
        return gasp;
      }
      function makeGaspTable(gasp) {
        const result = new table_default.Table("gasp", [
          { name: "version", type: "USHORT", value: 1 },
          { name: "numRanges", type: "USHORT", value: gasp.numRanges }
        ]);
        for (let i in gasp.gaspRanges) {
          result.fields.push({ name: "rangeMaxPPEM", type: "USHORT", value: gasp.gaspRanges[i].rangeMaxPPEM });
          result.fields.push({ name: "rangeGaspBehavior", type: "USHORT", value: gasp.gaspRanges[i].rangeGaspBehavior });
        }
        return result;
      }
      var gasp_default = { parse: parseGaspTable, make: makeGaspTable };
      function parseSvgTable(data, offset) {
        const svgTable = /* @__PURE__ */ new Map();
        const buf = data.buffer;
        const p = new Parser(data, offset);
        const version = p.parseUShort();
        if (version !== 0) return svgTable;
        p.relativeOffset = p.parseOffset32();
        const svgDocumentListOffset = data.byteOffset + offset + p.relativeOffset;
        const numEntries = p.parseUShort();
        const svgDocMap = /* @__PURE__ */ new Map();
        for (let i = 0; i < numEntries; i++) {
          const startGlyphID = p.parseUShort();
          const endGlyphID = p.parseUShort();
          const svgDocOffset = svgDocumentListOffset + p.parseOffset32();
          const svgDocLength = p.parseULong();
          let svgDoc = svgDocMap.get(svgDocOffset);
          if (svgDoc === void 0) {
            svgDoc = new Uint8Array(buf, svgDocOffset, svgDocLength);
            svgDocMap.set(svgDocOffset, svgDoc);
          }
          for (let i2 = startGlyphID; i2 <= endGlyphID; i2++) {
            svgTable.set(i2, svgDoc);
          }
        }
        return svgTable;
      }
      function makeSvgTable(svgTable) {
        const glyphIds = Array.from(svgTable.keys()).sort();
        const documentRecords = [];
        const documentBuffers = [];
        const documentOffsets = /* @__PURE__ */ new Map();
        let nextSvgDocOffset = 0;
        let record = { endGlyphID: null };
        for (let i = 0, l = glyphIds.length; i < l; i++) {
          const glyphId = glyphIds[i];
          const svgDoc = svgTable.get(glyphId);
          let svgDocOffset = documentOffsets.get(svgDoc);
          if (svgDocOffset === void 0) {
            svgDocOffset = nextSvgDocOffset;
            documentBuffers.push(svgDoc);
            documentOffsets.set(svgDoc, svgDocOffset);
            nextSvgDocOffset += svgDoc.byteLength;
          }
          if (glyphId - 1 === record.endGlyphID && svgDocOffset === record.svgDocOffset) {
            record.endGlyphID = glyphId;
          } else {
            record = {
              startGlyphID: glyphId,
              endGlyphID: glyphId,
              svgDocOffset,
              svgDocLength: svgDoc.byteLength
            };
            documentRecords.push(record);
          }
        }
        const numEntries = documentRecords.length;
        const numDocuments = documentBuffers.length;
        const documentsOffset = 2 + numEntries * (2 + 2 + 4 + 4);
        const fields = new Array(3 + 1 + numEntries * 4 + numDocuments);
        let fieldIndex = 0;
        fields[fieldIndex++] = { name: "version", type: "USHORT", value: 0 };
        fields[fieldIndex++] = { name: "svgDocumentListOffset", type: "ULONG", value: 2 + 4 + 4 };
        fields[fieldIndex++] = { name: "reserved", type: "ULONG", value: 0 };
        fields[fieldIndex++] = { name: "numEntries", type: "USHORT", value: numEntries };
        for (let i = 0; i < numEntries; i++) {
          const namePrefix = "documentRecord_" + i;
          const { startGlyphID, endGlyphID, svgDocOffset, svgDocLength } = documentRecords[i];
          fields[fieldIndex++] = { name: namePrefix + "_startGlyphID", type: "USHORT", value: startGlyphID };
          fields[fieldIndex++] = { name: namePrefix + "_endGlyphID", type: "USHORT", value: endGlyphID };
          fields[fieldIndex++] = { name: namePrefix + "_svgDocOffset", type: "ULONG", value: documentsOffset + svgDocOffset };
          fields[fieldIndex++] = { name: namePrefix + "_svgDocLength", type: "ULONG", value: svgDocLength };
        }
        for (let i = 0; i < numDocuments; i++) {
          fields[fieldIndex++] = { name: "svgDoc_" + i, type: "LITERAL", value: documentBuffers[i] };
        }
        return new table_default.Table("SVG ", fields);
      }
      var svg_default = {
        make: makeSvgTable,
        parse: parseSvgTable
      };
      function log2(v) {
        return Math.log(v) / Math.log(2) | 0;
      }
      function computeCheckSum(bytes) {
        while (bytes.length % 4 !== 0) {
          bytes.push(0);
        }
        let sum = 0;
        for (let i = 0; i < bytes.length; i += 4) {
          sum += (bytes[i] << 24) + (bytes[i + 1] << 16) + (bytes[i + 2] << 8) + bytes[i + 3];
        }
        sum %= Math.pow(2, 32);
        return sum;
      }
      function makeTableRecord(tag, checkSum, offset, length) {
        return new table_default.Record("Table Record", [
          { name: "tag", type: "TAG", value: tag !== void 0 ? tag : "" },
          { name: "checkSum", type: "ULONG", value: checkSum !== void 0 ? checkSum : 0 },
          { name: "offset", type: "ULONG", value: offset !== void 0 ? offset : 0 },
          { name: "length", type: "ULONG", value: length !== void 0 ? length : 0 }
        ]);
      }
      function makeSfntTable(tables) {
        const sfnt = new table_default.Table("sfnt", [
          { name: "version", type: "TAG", value: "OTTO" },
          { name: "numTables", type: "USHORT", value: 0 },
          { name: "searchRange", type: "USHORT", value: 0 },
          { name: "entrySelector", type: "USHORT", value: 0 },
          { name: "rangeShift", type: "USHORT", value: 0 }
        ]);
        sfnt.tables = tables;
        sfnt.numTables = tables.length;
        const highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
        sfnt.searchRange = 16 * highestPowerOf2;
        sfnt.entrySelector = log2(highestPowerOf2);
        sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;
        const recordFields = [];
        const tableFields = [];
        let offset = sfnt.sizeOf() + makeTableRecord().sizeOf() * sfnt.numTables;
        while (offset % 4 !== 0) {
          offset += 1;
          tableFields.push({ name: "padding", type: "BYTE", value: 0 });
        }
        for (let i = 0; i < tables.length; i += 1) {
          const t = tables[i];
          check_default.argument(t.tableName.length === 4, "Table name" + t.tableName + " is invalid.");
          const tableLength = t.sizeOf();
          const tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
          recordFields.push({ name: tableRecord.tag + " Table Record", type: "RECORD", value: tableRecord });
          tableFields.push({ name: t.tableName + " table", type: "RECORD", value: t });
          offset += tableLength;
          check_default.argument(!isNaN(offset), "Something went wrong calculating the offset.");
          while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({ name: "padding", type: "BYTE", value: 0 });
          }
        }
        recordFields.sort(function(r1, r2) {
          if (r1.value.tag > r2.value.tag) {
            return 1;
          } else {
            return -1;
          }
        });
        sfnt.fields = sfnt.fields.concat(recordFields);
        sfnt.fields = sfnt.fields.concat(tableFields);
        return sfnt;
      }
      function metricsForChar(font, chars, notFoundMetrics) {
        for (let i = 0; i < chars.length; i += 1) {
          const glyphIndex = font.charToGlyphIndex(chars[i]);
          if (glyphIndex > 0) {
            const glyph = font.glyphs.get(glyphIndex);
            return glyph.getMetrics();
          }
        }
        return notFoundMetrics;
      }
      function average(vs) {
        let sum = 0;
        for (let i = 0; i < vs.length; i += 1) {
          sum += vs[i];
        }
        return sum / vs.length;
      }
      function fontToSfntTable(font) {
        const xMins = [];
        const yMins = [];
        const xMaxs = [];
        const yMaxs = [];
        const advanceWidths = [];
        const leftSideBearings = [];
        const rightSideBearings = [];
        let firstCharIndex;
        let lastCharIndex = 0;
        let ulUnicodeRange1 = 0;
        let ulUnicodeRange2 = 0;
        let ulUnicodeRange3 = 0;
        let ulUnicodeRange4 = 0;
        for (let i = 0; i < font.glyphs.length; i += 1) {
          const glyph = font.glyphs.get(i);
          const unicode = glyph.unicode | 0;
          if (isNaN(glyph.advanceWidth)) {
            throw new Error("Glyph " + glyph.name + " (" + i + "): advanceWidth is not a number.");
          }
          if (firstCharIndex > unicode || firstCharIndex === void 0) {
            if (unicode > 0) {
              firstCharIndex = unicode;
            }
          }
          if (lastCharIndex < unicode) {
            lastCharIndex = unicode;
          }
          const position = os2_default.getUnicodeRange(unicode);
          if (position < 32) {
            ulUnicodeRange1 |= 1 << position;
          } else if (position < 64) {
            ulUnicodeRange2 |= 1 << position - 32;
          } else if (position < 96) {
            ulUnicodeRange3 |= 1 << position - 64;
          } else if (position < 123) {
            ulUnicodeRange4 |= 1 << position - 96;
          } else {
            throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
          }
          if (glyph.name === ".notdef") continue;
          const metrics = glyph.getMetrics();
          xMins.push(metrics.xMin);
          yMins.push(metrics.yMin);
          xMaxs.push(metrics.xMax);
          yMaxs.push(metrics.yMax);
          leftSideBearings.push(metrics.leftSideBearing);
          rightSideBearings.push(metrics.rightSideBearing);
          advanceWidths.push(glyph.advanceWidth);
        }
        const globals = {
          xMin: Math.min.apply(null, xMins),
          yMin: Math.min.apply(null, yMins),
          xMax: Math.max.apply(null, xMaxs),
          yMax: Math.max.apply(null, yMaxs),
          advanceWidthMax: Math.max.apply(null, advanceWidths),
          advanceWidthAvg: average(advanceWidths),
          minLeftSideBearing: Math.min.apply(null, leftSideBearings),
          maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
          minRightSideBearing: Math.min.apply(null, rightSideBearings)
        };
        globals.ascender = font.ascender;
        globals.descender = font.descender;
        let macStyle = 0;
        if (font.weightClass >= 600) {
          macStyle |= font.macStyleValues.BOLD;
        }
        if (font.italicAngle < 0) {
          macStyle |= font.macStyleValues.ITALIC;
        }
        const headTable = head_default.make({
          flags: 3,
          // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
          unitsPerEm: font.unitsPerEm,
          xMin: globals.xMin,
          yMin: globals.yMin,
          xMax: globals.xMax,
          yMax: globals.yMax,
          lowestRecPPEM: 3,
          macStyle,
          createdTimestamp: font.createdTimestamp
        });
        const hheaTable = hhea_default.make({
          ascender: globals.ascender,
          descender: globals.descender,
          advanceWidthMax: globals.advanceWidthMax,
          minLeftSideBearing: globals.minLeftSideBearing,
          minRightSideBearing: globals.minRightSideBearing,
          xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
          numberOfHMetrics: font.glyphs.length
        });
        const maxpTable = maxp_default.make(font.glyphs.length);
        const os2Table = os2_default.make(Object.assign({
          xAvgCharWidth: Math.round(globals.advanceWidthAvg),
          usFirstCharIndex: firstCharIndex,
          usLastCharIndex: lastCharIndex,
          ulUnicodeRange1,
          ulUnicodeRange2,
          ulUnicodeRange3,
          ulUnicodeRange4,
          // See http://typophile.com/node/13081 for more info on vertical metrics.
          // We get metrics for typical characters (such as "x" for xHeight).
          // We provide some fallback characters if characters are unavailable: their
          // ordering was chosen experimentally.
          sTypoAscender: globals.ascender,
          sTypoDescender: globals.descender,
          sTypoLineGap: 0,
          usWinAscent: globals.yMax,
          usWinDescent: Math.abs(globals.yMin),
          ulCodePageRange1: 1,
          // FIXME: hard-code Latin 1 support for now
          sxHeight: metricsForChar(font, "xyvw", { yMax: Math.round(globals.ascender / 2) }).yMax,
          sCapHeight: metricsForChar(font, "HIKLEFJMNTZBDPRAGOQSUVWXY", globals).yMax,
          usDefaultChar: font.hasChar(" ") ? 32 : 0,
          // Use space as the default character, if available.
          usBreakChar: font.hasChar(" ") ? 32 : 0
          // Use space as the break character, if available.
        }, font.tables.os2));
        const hmtxTable = hmtx_default.make(font.glyphs);
        const cmapTable = cmap_default.make(font.glyphs);
        const englishFamilyName = font.getEnglishName("fontFamily");
        const englishStyleName = font.getEnglishName("fontSubfamily");
        const englishFullName = englishFamilyName + " " + englishStyleName;
        let postScriptName = font.getEnglishName("postScriptName");
        if (!postScriptName) {
          postScriptName = englishFamilyName.replace(/\s/g, "") + "-" + englishStyleName;
        }
        const names = {};
        for (let n in font.names) {
          names[n] = font.names[n];
        }
        names.unicode = names.unicode || {};
        names.macintosh = names.macintosh || {};
        names.windows = names.windows || {};
        const fontNamesUnicode = font.names.unicode || {};
        const fontNamesMacintosh = font.names.macintosh || {};
        const fontNamesWindows = font.names.windows || {};
        for (const platform in names) {
          names[platform] = names[platform] || {};
          if (!names[platform].uniqueID) {
            const manufacturer = font.getEnglishName("manufacturer") || "";
            names[platform].uniqueID = { en: `${manufacturer}: ${englishFullName}` };
          }
          if (!names[platform].postScriptName) {
            names[platform].postScriptName = { en: postScriptName };
          }
        }
        if (!names.unicode.preferredFamily) {
          names.unicode.preferredFamily = fontNamesUnicode.fontFamily || fontNamesMacintosh.fontFamily || fontNamesWindows.fontFamily;
        }
        if (!names.macintosh.preferredFamily) {
          names.macintosh.preferredFamily = fontNamesMacintosh.fontFamily || fontNamesUnicode.fontFamily || fontNamesWindows.fontFamily;
        }
        if (!names.windows.preferredFamily) {
          names.windows.preferredFamily = fontNamesWindows.fontFamily || fontNamesUnicode.fontFamily || fontNamesMacintosh.fontFamily;
        }
        if (!names.unicode.preferredSubfamily) {
          names.unicode.preferredSubfamily = fontNamesUnicode.fontSubfamily || fontNamesMacintosh.fontSubfamily || fontNamesWindows.fontSubfamily;
        }
        if (!names.macintosh.preferredSubfamily) {
          names.macintosh.preferredSubfamily = fontNamesMacintosh.fontSubfamily || fontNamesUnicode.fontSubfamily || fontNamesWindows.fontSubfamily;
        }
        if (!names.windows.preferredSubfamily) {
          names.windows.preferredSubfamily = fontNamesWindows.fontSubfamily || fontNamesUnicode.fontSubfamily || fontNamesMacintosh.fontSubfamily;
        }
        const languageTags = [];
        const nameTable = name_default.make(names, languageTags);
        const ltagTable = languageTags.length > 0 ? ltag_default.make(languageTags) : void 0;
        const postTable = post_default.make(font);
        const cffTable = cff_default.make(font.glyphs, {
          version: font.getEnglishName("version"),
          fullName: englishFullName,
          familyName: englishFamilyName,
          weightName: englishStyleName,
          postScriptName,
          unitsPerEm: font.unitsPerEm,
          fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax],
          topDict: font.tables.cff && font.tables.cff.topDict || {}
        });
        const metaTable = font.metas && Object.keys(font.metas).length > 0 ? meta_default.make(font.metas) : void 0;
        const tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
        if (ltagTable) {
          tables.push(ltagTable);
        }
        const optionalTables = {
          gsub: gsub_default,
          cpal: cpal_default,
          colr: colr_default,
          stat: stat_default,
          avar: avar_default,
          cvar: cvar_default,
          fvar: fvar_default,
          gvar: gvar_default,
          gasp: gasp_default,
          svg: svg_default
        };
        const optionalTableArgs = {
          avar: [font.tables.fvar],
          fvar: [font.names]
        };
        for (let tableName in optionalTables) {
          const table = font.tables[tableName];
          if (table) {
            const tableData = optionalTables[tableName].make.call(font, table, ...optionalTableArgs[tableName] || []);
            if (tableData) {
              tables.push(tableData);
            }
          }
        }
        if (metaTable) {
          tables.push(metaTable);
        }
        const sfntTable = makeSfntTable(tables);
        const bytes = sfntTable.encode();
        const checkSum = computeCheckSum(bytes);
        const tableFields = sfntTable.fields;
        let checkSumAdjusted = false;
        for (let i = 0; i < tableFields.length; i += 1) {
          if (tableFields[i].name === "head table") {
            tableFields[i].value.checkSumAdjustment = 2981146554 - checkSum;
            checkSumAdjusted = true;
            break;
          }
        }
        if (!checkSumAdjusted) {
          throw new Error("Could not find head table with checkSum to adjust.");
        }
        return sfntTable;
      }
      var sfnt_default = { make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum };
      function searchTag(arr, tag) {
        let imin = 0;
        let imax = arr.length - 1;
        while (imin <= imax) {
          const imid = imin + imax >>> 1;
          const val = arr[imid].tag;
          if (val === tag) {
            return imid;
          } else if (val < tag) {
            imin = imid + 1;
          } else {
            imax = imid - 1;
          }
        }
        return -imin - 1;
      }
      function binSearch(arr, value) {
        let imin = 0;
        let imax = arr.length - 1;
        while (imin <= imax) {
          const imid = imin + imax >>> 1;
          const val = arr[imid];
          if (val === value) {
            return imid;
          } else if (val < value) {
            imin = imid + 1;
          } else {
            imax = imid - 1;
          }
        }
        return -imin - 1;
      }
      function searchRange(ranges, value) {
        let range;
        let imin = 0;
        let imax = ranges.length - 1;
        while (imin <= imax) {
          const imid = imin + imax >>> 1;
          range = ranges[imid];
          const start = range.start;
          if (start === value) {
            return range;
          } else if (start < value) {
            imin = imid + 1;
          } else {
            imax = imid - 1;
          }
        }
        if (imin > 0) {
          range = ranges[imin - 1];
          if (value > range.end) return 0;
          return range;
        }
      }
      function Layout(font, tableName) {
        this.font = font;
        this.tableName = tableName;
      }
      Layout.prototype = {
        /**
         * Binary search an object by "tag" property
         * @instance
         * @function searchTag
         * @memberof opentype.Layout
         * @param  {Array} arr
         * @param  {string} tag
         * @return {number}
         */
        searchTag,
        /**
         * Binary search in a list of numbers
         * @instance
         * @function binSearch
         * @memberof opentype.Layout
         * @param  {Array} arr
         * @param  {number} value
         * @return {number}
         */
        binSearch,
        /**
         * Get or create the Layout table (GSUB, GPOS etc).
         * @param  {boolean} create - Whether to create a new one.
         * @return {Object} The GSUB or GPOS table.
         */
        getTable: function(create) {
          let layout = this.font.tables[this.tableName];
          if (!layout && create) {
            layout = this.font.tables[this.tableName] = this.createDefaultTable();
          }
          return layout;
        },
        /**
         * Returns all scripts in the substitution table.
         * @instance
         * @return {Array}
         */
        getScriptNames: function() {
          let layout = this.getTable();
          if (!layout) {
            return [];
          }
          return layout.scripts.map(function(script) {
            return script.tag;
          });
        },
        /**
         * Returns the best bet for a script name.
         * Returns 'DFLT' if it exists.
         * If not, returns 'latn' if it exists.
         * If neither exist, returns undefined.
         */
        getDefaultScriptName: function() {
          let layout = this.getTable();
          if (!layout) {
            return;
          }
          let hasLatn = false;
          for (let i = 0; i < layout.scripts.length; i++) {
            const name = layout.scripts[i].tag;
            if (name === "DFLT") return name;
            if (name === "latn") hasLatn = true;
          }
          if (hasLatn) return "latn";
        },
        /**
         * Returns all LangSysRecords in the given script.
         * @instance
         * @param {string} [script='DFLT']
         * @param {boolean} create - forces the creation of this script table if it doesn't exist.
         * @return {Object} An object with tag and script properties.
         */
        getScriptTable: function(script, create) {
          const layout = this.getTable(create);
          if (layout) {
            script = script || "DFLT";
            const scripts = layout.scripts;
            const pos = searchTag(layout.scripts, script);
            if (pos >= 0) {
              return scripts[pos].script;
            } else if (create) {
              const scr = {
                tag: script,
                script: {
                  defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
                  langSysRecords: []
                }
              };
              scripts.splice(-1 - pos, 0, scr);
              return scr.script;
            }
          }
        },
        /**
         * Returns a language system table
         * @instance
         * @param {string} [script='DFLT']
         * @param {string} [language='dlft']
         * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
         * @return {Object}
         */
        getLangSysTable: function(script, language, create) {
          const scriptTable = this.getScriptTable(script, create);
          if (scriptTable) {
            if (!language || language === "dflt" || language === "DFLT") {
              return scriptTable.defaultLangSys;
            }
            const pos = searchTag(scriptTable.langSysRecords, language);
            if (pos >= 0) {
              return scriptTable.langSysRecords[pos].langSys;
            } else if (create) {
              const langSysRecord = {
                tag: language,
                langSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }
              };
              scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
              return langSysRecord.langSys;
            }
          }
        },
        /**
         * Get a specific feature table.
         * @instance
         * @param {string} [script='DFLT']
         * @param {string} [language='dlft']
         * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
         * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
         * @return {Object}
         */
        getFeatureTable: function(script, language, feature, create) {
          const langSysTable2 = this.getLangSysTable(script, language, create);
          if (langSysTable2) {
            let featureRecord;
            const featIndexes = langSysTable2.featureIndexes;
            const allFeatures = this.font.tables[this.tableName].features;
            for (let i = 0; i < featIndexes.length; i++) {
              featureRecord = allFeatures[featIndexes[i]];
              if (featureRecord.tag === feature) {
                return featureRecord.feature;
              }
            }
            if (create) {
              const index = allFeatures.length;
              check_default.assert(index === 0 || feature >= allFeatures[index - 1].tag, "Features must be added in alphabetical order.");
              featureRecord = {
                tag: feature,
                feature: { params: 0, lookupListIndexes: [] }
              };
              allFeatures.push(featureRecord);
              featIndexes.push(index);
              return featureRecord.feature;
            }
          }
        },
        /**
         * Get the lookup tables of a given type for a script/language/feature.
         * @instance
         * @param {string} [script='DFLT']
         * @param {string} [language='dlft']
         * @param {string} feature - 4-letter feature code
         * @param {number} lookupType - 1 to 9
         * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
         * @return {Object[]}
         */
        getLookupTables: function(script, language, feature, lookupType, create) {
          const featureTable = this.getFeatureTable(script, language, feature, create);
          const tables = [];
          if (featureTable) {
            let lookupTable;
            const lookupListIndexes = featureTable.lookupListIndexes;
            const allLookups = this.font.tables[this.tableName].lookups;
            for (let i = 0; i < lookupListIndexes.length; i++) {
              lookupTable = allLookups[lookupListIndexes[i]];
              if (lookupTable.lookupType === lookupType) {
                tables.push(lookupTable);
              }
            }
            if (tables.length === 0 && create) {
              lookupTable = {
                lookupType,
                lookupFlag: 0,
                subtables: [],
                markFilteringSet: void 0
              };
              const index = allLookups.length;
              allLookups.push(lookupTable);
              lookupListIndexes.push(index);
              return [lookupTable];
            }
          }
          return tables;
        },
        /**
         * Find a glyph in a class definition table
         * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
         * @param {object} classDefTable - an OpenType Layout class definition table
         * @param {number} glyphIndex - the index of the glyph to find
         * @returns {number} -1 if not found
         */
        getGlyphClass: function(classDefTable, glyphIndex) {
          switch (classDefTable.format) {
            case 1: {
              if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
                return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
              }
              return 0;
            }
            case 2: {
              const range = searchRange(classDefTable.ranges, glyphIndex);
              return range ? range.classId : 0;
            }
          }
        },
        /**
         * Find a glyph in a coverage table
         * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
         * @param {object} coverageTable - an OpenType Layout coverage table
         * @param {number} glyphIndex - the index of the glyph to find
         * @returns {number} -1 if not found
         */
        getCoverageIndex: function(coverageTable, glyphIndex) {
          switch (coverageTable.format) {
            case 1: {
              const index = binSearch(coverageTable.glyphs, glyphIndex);
              return index >= 0 ? index : -1;
            }
            case 2: {
              const range = searchRange(coverageTable.ranges, glyphIndex);
              return range ? range.index + glyphIndex - range.start : -1;
            }
          }
        },
        /**
         * Returns the list of glyph indexes of a coverage table.
         * Format 1: the list is stored raw
         * Format 2: compact list as range records.
         * @instance
         * @param  {Object} coverageTable
         * @return {Array}
         */
        expandCoverage: function(coverageTable) {
          if (coverageTable.format === 1) {
            return coverageTable.glyphs;
          } else {
            const glyphs = [];
            const ranges = coverageTable.ranges;
            for (let i = 0; i < ranges.length; i++) {
              const range = ranges[i];
              const start = range.start;
              const end = range.end;
              for (let j = start; j <= end; j++) {
                glyphs.push(j);
              }
            }
            return glyphs;
          }
        }
      };
      var layout_default = Layout;
      function Position(font) {
        layout_default.call(this, font, "gpos");
      }
      Position.prototype = layout_default.prototype;
      Position.prototype.init = function() {
        const script = this.getDefaultScriptName();
        this.defaultKerningTables = this.getKerningTables(script);
      };
      Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
        for (let i = 0; i < kerningLookups.length; i++) {
          const subtables = kerningLookups[i].subtables;
          for (let j = 0; j < subtables.length; j++) {
            const subtable = subtables[j];
            const covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
            if (covIndex < 0) continue;
            switch (subtable.posFormat) {
              case 1: {
                let pairSet = subtable.pairSets[covIndex];
                for (let k = 0; k < pairSet.length; k++) {
                  let pair = pairSet[k];
                  if (pair.secondGlyph === rightIndex) {
                    return pair.value1 && pair.value1.xAdvance || 0;
                  }
                }
                break;
              }
              case 2: {
                const class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
                const class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
                const pair = subtable.classRecords[class1][class2];
                return pair.value1 && pair.value1.xAdvance || 0;
              }
            }
          }
        }
        return 0;
      };
      Position.prototype.getKerningTables = function(script, language) {
        if (this.font.tables.gpos) {
          return this.getLookupTables(script, language, "kern", 2);
        }
      };
      var position_default = Position;
      function arraysEqual(ar1, ar2) {
        const n = ar1.length;
        if (n !== ar2.length) {
          return false;
        }
        for (let i = 0; i < n; i++) {
          if (ar1[i] !== ar2[i]) {
            return false;
          }
        }
        return true;
      }
      function binarySearch(array, key, value) {
        let low = 0, high = array.length - 1;
        let result = null;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const record = array[mid];
          const recordValue = record[key];
          if (recordValue < value) {
            low = mid + 1;
          } else if (recordValue > value) {
            high = mid - 1;
          } else {
            result = record;
            break;
          }
        }
        return result;
      }
      function binarySearchIndex(array, key, value) {
        let low = 0, high = array.length - 1;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const element = array[mid];
          if (element[key] < value) {
            low = mid + 1;
          } else if (element[key] > value) {
            high = mid - 1;
          } else {
            return mid;
          }
        }
        return -1;
      }
      function binarySearchInsert(array, key, value) {
        let low = 0, high = array.length;
        const compare = (a, b) => a[key] - b[key];
        while (low < high) {
          const mid = low + high >>> 1;
          if (compare(array[mid], value) < 0) low = mid + 1;
          else high = mid;
        }
        array.splice(low, 0, value);
        return low;
      }
      function isGzip(buf) {
        return buf[0] === 31 && buf[1] === 139 && buf[2] === 8;
      }
      function unGzip(gzip) {
        const data = new DataView(gzip.buffer, gzip.byteOffset, gzip.byteLength);
        let start = 10;
        const end = gzip.byteLength - 8;
        const flg = data.getInt8(3);
        if (flg & 4) {
          start += 2 + data.getUint16(start, true);
        }
        if (flg & 8) {
          while (start < end) if (gzip[start++] === 0) break;
        }
        if (flg & 16) {
          while (start < end) if (gzip[start++] === 0) break;
        }
        if (flg & 2) {
          start += 2;
        }
        if (start >= end) throw new Error("Can't find compressed blocks");
        const isize = data.getUint32(data.byteLength - 4, true);
        return tinf_uncompress(gzip.subarray(start, end), new Uint8Array(isize));
      }
      function copyPoint(p) {
        return {
          x: p.x,
          y: p.y,
          onCurve: p.onCurve,
          lastPointOfContour: p.lastPointOfContour
        };
      }
      function copyComponent(c) {
        return {
          glyphIndex: c.glyphIndex,
          xScale: c.xScale,
          scale01: c.scale01,
          scale10: c.scale10,
          yScale: c.yScale,
          dx: c.dx,
          dy: c.dy
        };
      }
      function Substitution(font) {
        layout_default.call(this, font, "gsub");
      }
      function getSubstFormat(lookupTable, format, defaultSubtable) {
        const subtables = lookupTable.subtables;
        for (let i = 0; i < subtables.length; i++) {
          const subtable = subtables[i];
          if (subtable.substFormat === format) {
            return subtable;
          }
        }
        if (defaultSubtable) {
          subtables.push(defaultSubtable);
          return defaultSubtable;
        }
        return void 0;
      }
      Substitution.prototype = layout_default.prototype;
      Substitution.prototype.createDefaultTable = function() {
        return {
          version: 1,
          scripts: [{
            tag: "DFLT",
            script: {
              defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
              langSysRecords: []
            }
          }],
          features: [],
          lookups: []
        };
      };
      Substitution.prototype.getSingle = function(feature, script, language) {
        const substitutions = [];
        const lookupTables = this.getLookupTables(script, language, feature, 1);
        for (let idx = 0; idx < lookupTables.length; idx++) {
          const subtables = lookupTables[idx].subtables;
          for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            let j;
            if (subtable.substFormat === 1) {
              const delta = subtable.deltaGlyphId;
              for (j = 0; j < glyphs.length; j++) {
                const glyph = glyphs[j];
                substitutions.push({ sub: glyph, by: glyph + delta });
              }
            } else {
              const substitute = subtable.substitute;
              for (j = 0; j < glyphs.length; j++) {
                substitutions.push({ sub: glyphs[j], by: substitute[j] });
              }
            }
          }
        }
        return substitutions;
      };
      Substitution.prototype.getMultiple = function(feature, script, language) {
        const substitutions = [];
        const lookupTables = this.getLookupTables(script, language, feature, 2);
        for (let idx = 0; idx < lookupTables.length; idx++) {
          const subtables = lookupTables[idx].subtables;
          for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            let j;
            for (j = 0; j < glyphs.length; j++) {
              const glyph = glyphs[j];
              const replacements = subtable.sequences[j];
              substitutions.push({ sub: glyph, by: replacements });
            }
          }
        }
        return substitutions;
      };
      Substitution.prototype.getAlternates = function(feature, script, language) {
        const alternates = [];
        const lookupTables = this.getLookupTables(script, language, feature, 3);
        for (let idx = 0; idx < lookupTables.length; idx++) {
          const subtables = lookupTables[idx].subtables;
          for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            const alternateSets = subtable.alternateSets;
            for (let j = 0; j < glyphs.length; j++) {
              alternates.push({ sub: glyphs[j], by: alternateSets[j] });
            }
          }
        }
        return alternates;
      };
      Substitution.prototype.getLigatures = function(feature, script, language) {
        const ligatures = [];
        const lookupTables = this.getLookupTables(script, language, feature, 4);
        for (let idx = 0; idx < lookupTables.length; idx++) {
          const subtables = lookupTables[idx].subtables;
          for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            const ligatureSets = subtable.ligatureSets;
            for (let j = 0; j < glyphs.length; j++) {
              const startGlyph = glyphs[j];
              const ligSet = ligatureSets[j];
              for (let k = 0; k < ligSet.length; k++) {
                const lig = ligSet[k];
                ligatures.push({
                  sub: [startGlyph].concat(lig.components),
                  by: lig.ligGlyph
                });
              }
            }
          }
        }
        return ligatures;
      };
      Substitution.prototype.addSingle = function(feature, substitution, script, language) {
        const lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
        const subtable = getSubstFormat(lookupTable, 2, {
          // lookup type 1 subtable, format 2, coverage format 1
          substFormat: 2,
          coverage: { format: 1, glyphs: [] },
          substitute: []
        });
        check_default.assert(subtable.coverage.format === 1, "Single: unable to modify coverage table format " + subtable.coverage.format);
        const coverageGlyph = substitution.sub;
        let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
        if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.substitute.splice(pos, 0, 0);
        }
        subtable.substitute[pos] = substitution.by;
      };
      Substitution.prototype.addMultiple = function(feature, substitution, script, language) {
        check_default.assert(substitution.by instanceof Array && substitution.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
        const lookupTable = this.getLookupTables(script, language, feature, 2, true)[0];
        const subtable = getSubstFormat(lookupTable, 1, {
          // lookup type 2 subtable, format 1, coverage format 1
          substFormat: 1,
          coverage: { format: 1, glyphs: [] },
          sequences: []
        });
        check_default.assert(subtable.coverage.format === 1, "Multiple: unable to modify coverage table format " + subtable.coverage.format);
        const coverageGlyph = substitution.sub;
        let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
        if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.sequences.splice(pos, 0, 0);
        }
        subtable.sequences[pos] = substitution.by;
      };
      Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
        const lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
        const subtable = getSubstFormat(lookupTable, 1, {
          // lookup type 3 subtable, format 1, coverage format 1
          substFormat: 1,
          coverage: { format: 1, glyphs: [] },
          alternateSets: []
        });
        check_default.assert(subtable.coverage.format === 1, "Alternate: unable to modify coverage table format " + subtable.coverage.format);
        const coverageGlyph = substitution.sub;
        let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
        if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.alternateSets.splice(pos, 0, 0);
        }
        subtable.alternateSets[pos] = substitution.by;
      };
      Substitution.prototype.addLigature = function(feature, ligature, script, language) {
        const lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
        let subtable = lookupTable.subtables[0];
        if (!subtable) {
          subtable = {
            // lookup type 4 subtable, format 1, coverage format 1
            substFormat: 1,
            coverage: { format: 1, glyphs: [] },
            ligatureSets: []
          };
          lookupTable.subtables[0] = subtable;
        }
        check_default.assert(subtable.coverage.format === 1, "Ligature: unable to modify coverage table format " + subtable.coverage.format);
        const coverageGlyph = ligature.sub[0];
        const ligComponents = ligature.sub.slice(1);
        const ligatureTable = {
          ligGlyph: ligature.by,
          components: ligComponents
        };
        let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
        if (pos >= 0) {
          const ligatureSet = subtable.ligatureSets[pos];
          for (let i = 0; i < ligatureSet.length; i++) {
            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
              return;
            }
          }
          ligatureSet.push(ligatureTable);
        } else {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
        }
      };
      Substitution.prototype.getFeature = function(feature, script, language) {
        if (/ss\d\d/.test(feature)) {
          return this.getSingle(feature, script, language);
        }
        switch (feature) {
          case "aalt":
          case "salt":
            return this.getSingle(feature, script, language).concat(this.getAlternates(feature, script, language));
          case "dlig":
          case "liga":
          case "rlig":
            return this.getLigatures(feature, script, language);
          case "ccmp":
            return this.getMultiple(feature, script, language).concat(this.getLigatures(feature, script, language));
          case "stch":
            return this.getMultiple(feature, script, language);
        }
        return void 0;
      };
      Substitution.prototype.add = function(feature, sub, script, language) {
        if (/ss\d\d/.test(feature)) {
          return this.addSingle(feature, sub, script, language);
        }
        switch (feature) {
          case "aalt":
          case "salt":
            if (typeof sub.by === "number") {
              return this.addSingle(feature, sub, script, language);
            }
            return this.addAlternate(feature, sub, script, language);
          case "dlig":
          case "liga":
          case "rlig":
            return this.addLigature(feature, sub, script, language);
          case "ccmp":
            if (sub.by instanceof Array) {
              return this.addMultiple(feature, sub, script, language);
            }
            return this.addLigature(feature, sub, script, language);
        }
        return void 0;
      };
      var substitution_default = Substitution;
      var PaletteManager = class {
        // private properties don't work with reify
        // @TODO: refactor once we migrated to ES6 modules, see https://github.com/opentypejs/opentype.js/pull/579
        // #font = null;
        /**
         * @type {integer} CPAL color used to (pre)fill unset colors in a palette.
         * Format 0xBBGGRRAA
         */
        // defaultValue = 0x000000FF;
        /**
         * 
         * @param {opentype.Font} font 
         */
        constructor(font) {
          this.defaultValue = 255;
          this.font = font;
        }
        /**
         * Returns the font's cpal table object if present
         * @returns {Object}
         */
        cpal() {
          if (this.font.tables && this.font.tables.cpal) {
            return this.font.tables.cpal;
          }
          return false;
        }
        /**
         * Returns an array of arrays of color values for each palette, optionally in a specified color format
         * @param {string} colorFormat 
         * @returns {Array<Array>}
         */
        getAll(colorFormat) {
          const palettes = [];
          const cpal = this.cpal();
          if (!cpal) return palettes;
          for (let i = 0; i < cpal.colorRecordIndices.length; i++) {
            const startIndex = cpal.colorRecordIndices[i];
            const paletteColors = [];
            for (let j = startIndex; j < startIndex + cpal.numPaletteEntries; j++) {
              paletteColors.push(formatColor(cpal.colorRecords[j], colorFormat || "hexa"));
            }
            palettes.push(paletteColors);
          }
          return palettes;
        }
        /**
         * Converts a color value string or array of color value strings to CPAL integer color value(s)
         * @param {string|Array<string></string>} color 
         * @returns {integer}
         */
        toCPALcolor(color) {
          if (Array.isArray(color)) {
            return color.map((color2) => parseColor(color2, "raw"));
          }
          return parseColor(color, "raw");
        }
        /**
         * Fills a set of palette colors (from palette index, or a provided array of CPAL color values) with a set of colors, falling back to the default color value, until a given count
         * @param {Array<string>|integer} palette Palette index integer or Array of colors to be filled
         * @param {Array<string|integer>} colors Colors to fill the palette with
         * @param {integer} _colorCount Number of colors to fill the palette with, defaults to the value of the numPaletteEntries field. Used internally by extend() and shouldn't be set manually
         * @returns 
         */
        fillPalette(palette, colors = [], _colorCount = this.cpal().numPaletteEntries) {
          palette = Number.isInteger(palette) ? this.get(palette, "raw") : palette;
          return Object.assign(Array(_colorCount).fill(this.defaultValue), this.toCPALcolor(palette).concat(this.toCPALcolor(colors)));
        }
        /**
         * Extend existing palettes and numPaletteEntries by a number of color slots
         * @param {integer} num number of additional color slots to add to all palettes
         */
        extend(num) {
          if (this.ensureCPAL(Array(num).fill(this.defaultValue))) {
            return;
          }
          const cpal = this.cpal();
          const newCount = cpal.numPaletteEntries + num;
          const palettes = this.getAll().map((palette) => this.fillPalette(palette, [], newCount));
          cpal.numPaletteEntries = newCount;
          cpal.colorRecords = this.toCPALcolor(palettes.flat());
          this.updateIndices();
        }
        /**
         * Get a specific palette by its zero-based index
         * @param {integer} paletteIndex 
         * @param {string} [colorFormat='hexa']
         * @returns {Array}
         */
        get(paletteIndex, colorFormat = "hexa") {
          return this.getAll(colorFormat)[paletteIndex] || null;
        }
        /**
         * Get a color from a specific palette by its zero-based index
         * @param {integer} index 
         * @param {integer} paletteIndex
         * @param {string} [colorFormat ='hexa']
         * @returns 
         */
        getColor(index, paletteIndex = 0, colorFormat = "hexa") {
          return getPaletteColor(this.font, index, paletteIndex, colorFormat);
        }
        /**
         * Set one or more colors on a specific palette by its zero-based index
         * @param {integer} index zero-based color index to start filling from
         * @param {string|integer|Array<string|integer>} color color value or array of color values
         * @param {integer} paletteIndex
         * @returns 
         */
        setColor(index, colors, paletteIndex = 0) {
          index = parseInt(index);
          paletteIndex = parseInt(paletteIndex);
          let palettes = this.getAll("raw");
          let palette = palettes[paletteIndex];
          if (!palette) {
            throw Error(`paletteIndex ${paletteIndex} out of range`);
          }
          const cpal = this.cpal();
          const colorCount = cpal.numPaletteEntries;
          if (!Array.isArray(colors)) {
            colors = [colors];
          }
          if (colors.length + index > colorCount) {
            this.extend(colors.length + index - colorCount);
            palettes = this.getAll("raw");
            palette = palettes[paletteIndex];
          }
          for (let i = 0; i < colors.length; i++) {
            palette[i + index] = this.toCPALcolor(colors[i]);
          }
          cpal.colorRecords = palettes.flat();
          this.updateIndices();
        }
        /**
         * Add a new palette. 
         * @param {Array} colors (optional) colors to add to the palette, differences to existing palettes will be filled with the defaultValue.
         * @returns 
         */
        add(colors) {
          if (this.ensureCPAL(colors)) {
            return;
          }
          const cpal = this.cpal();
          const colorCount = cpal.numPaletteEntries;
          if (colors && colors.length) {
            colors = this.toCPALcolor(colors);
            if (colors.length > colorCount) {
              this.extend(colors.length - colorCount);
            } else if (colors.length < colorCount) {
              colors = this.fillPalette(colors);
            }
            cpal.colorRecordIndices.push(cpal.colorRecords.length);
            cpal.colorRecords.push(...colors);
          } else {
            cpal.colorRecordIndices.push(cpal.colorRecords.length);
            cpal.colorRecords.push(...Array(colorCount).fill(this.defaultValue));
          }
        }
        /**
         * deletes a palette by its zero-based index
         * @param {integer} paletteIndex 
         */
        delete(paletteIndex) {
          const palettes = this.getAll("raw");
          delete palettes[paletteIndex];
          const cpal = this.cpal();
          cpal.colorRecordIndices.pop();
          cpal.colorRecords = palettes.flat();
        }
        /**
         * Deletes a specific color index in all palettes and updates all layers using that color with the replacement index
         * @param {integer} colorIndex index of the color that should be deleted
         * @param {integer} replacementIndex index (according to the palette before deletion) of the color to replace in layers using the color to be to deleted
         */
        deleteColor(colorIndex, replacementIndex) {
          if (colorIndex === replacementIndex) {
            throw Error("replacementIndex cannot be the same as colorIndex");
          }
          const cpal = this.cpal();
          const palettes = this.getAll("raw");
          const updatedPalettes = [];
          if (replacementIndex > cpal.numPaletteEntries - 1) {
            throw Error(`Replacement index out of range: numPaletteEntries after deletion: ${cpal.numPaletteEntries - 1}, replacementIndex: ${replacementIndex})`);
          }
          for (let i = 0; i < palettes.length; i++) {
            const palette = palettes[i];
            const updatedPalette = palette.filter((color, index) => index !== colorIndex);
            updatedPalettes.push(updatedPalette);
          }
          const colrTable = this.font.tables.colr;
          if (colrTable) {
            const layerRecords = colrTable.layerRecords;
            for (let i = 0; i < layerRecords.length; i++) {
              const currentIndex = layerRecords[i].paletteIndex;
              if (currentIndex > colorIndex) {
                const shiftAmount = 1;
                layerRecords[i].paletteIndex -= shiftAmount;
              } else if (currentIndex === colorIndex) {
                let replacementShift = 0;
                for (let j = 0; j < palettes.length; j++) {
                  if (replacementIndex > colorIndex && replacementIndex <= colorIndex + palettes[j].length) {
                    replacementShift++;
                    break;
                  }
                }
                layerRecords[i].paletteIndex = replacementIndex - replacementShift;
              }
            }
            this.font.tables.colr = {
              ...colrTable,
              layerRecords
            };
          }
          const flattenedPalettes = updatedPalettes.flat();
          for (let i = 0; i < palettes.length; i++) {
            cpal.colorRecordIndices[i] -= i;
          }
          cpal.numPaletteEntries = Math.max(0, cpal.numPaletteEntries - 1);
          cpal.colorRecords = this.toCPALcolor(flattenedPalettes);
        }
        /**
         * Makes sure that the CPAL table exists and is populated with default values.
         * @param {Array} colors (optional) colors to populate on creation
         * @returns {Boolean} true if it was created, false if it already existed.
         */
        ensureCPAL(colors) {
          if (!this.cpal()) {
            if (!colors || !colors.length) {
              colors = [this.defaultValue];
            } else {
              colors = this.toCPALcolor(colors);
            }
            this.font.tables.cpal = {
              version: 0,
              numPaletteEntries: colors.length,
              colorRecords: colors,
              colorRecordIndices: [0]
            };
            return true;
          }
          return false;
        }
        /**
         * Mainly used internally. Recalculates the colorRecordIndices array based on the numPaletteEntries and number of palettes
         */
        updateIndices() {
          const cpal = this.cpal();
          const paletteCount = Math.ceil(cpal.colorRecords.length / cpal.numPaletteEntries);
          cpal.colorRecordIndices = [];
          for (let i = 0; i < paletteCount; i++) {
            cpal.colorRecordIndices.push(i * cpal.numPaletteEntries);
          }
        }
      };
      var LayerManager = class {
        // private properties don't work with reify
        // @TODO: refactor once we migrated to ES6 modules, see https://github.com/opentypejs/opentype.js/pull/579
        // #font = null;
        constructor(font) {
          this.font = font;
        }
        /**
         * Mainly used internally. Ensures that the COLR table exists and is populated with default values
         * @returns the LayerManager's font instance for chaining
         */
        ensureCOLR() {
          if (!this.font.tables.colr) {
            this.font.tables.colr = {
              version: 0,
              baseGlyphRecords: [],
              layerRecords: []
            };
          }
          return this.font;
        }
        /**
         * Gets the layers for a specific glyph
         * @param {integer} glyphIndex
         * @returns {Array<Object>} array of layer objects {glyph, paletteIndex}
         */
        get(glyphIndex) {
          const font = this.font;
          const layers = [];
          const colr = font.tables.colr;
          const cpal = font.tables.cpal;
          if (!colr || !cpal) {
            return layers;
          }
          const baseGlyph = binarySearch(colr.baseGlyphRecords, "glyphID", glyphIndex);
          if (!baseGlyph) {
            return layers;
          }
          const firstIndex = baseGlyph.firstLayerIndex;
          const numLayers = baseGlyph.numLayers;
          for (let l = 0; l < numLayers; l++) {
            const layer = colr.layerRecords[firstIndex + l];
            layers.push({
              glyph: font.glyphs.get(layer.glyphID),
              paletteIndex: layer.paletteIndex
            });
          }
          return layers;
        }
        /**
         * Adds one or more layers to a glyph, at the end or at a specific position.
         * @param {integer} glyphIndex glyph index to add the layer(s) to.
         * @param {Array|Object} layers layer object {glyph, paletteIndex}/{glyphID, paletteIndex} or array of layer objects.
         * @param {integer?} position position to insert the layers at (will default to adding at the end).
         */
        add(glyphIndex, layers, position) {
          const currentLayers = this.get(glyphIndex);
          layers = Array.isArray(layers) ? layers : [layers];
          if (position === void 0 || position === Infinity || position > currentLayers.length) {
            position = currentLayers.length;
          } else if (position < 0) {
            position = currentLayers.length + 1 + position % (currentLayers.length + 1);
            if (position >= currentLayers.length + 1) {
              position -= currentLayers.length + 1;
            }
          }
          const newLayers = [];
          for (let i = 0; i < position; i++) {
            const glyphID = Number.isInteger(currentLayers[i].glyph) ? currentLayers[i].glyph : currentLayers[i].glyph.index;
            newLayers.push({
              glyphID,
              paletteIndex: currentLayers[i].paletteIndex
            });
          }
          for (const layer of layers) {
            const glyphID = Number.isInteger(layer.glyph) ? layer.glyph : layer.glyph.index;
            newLayers.push({
              glyphID,
              paletteIndex: layer.paletteIndex
            });
          }
          for (let i = position; i < currentLayers.length; i++) {
            const glyphID = Number.isInteger(currentLayers[i].glyph) ? currentLayers[i].glyph : currentLayers[i].glyph.index;
            newLayers.push({
              glyphID,
              paletteIndex: currentLayers[i].paletteIndex
            });
          }
          this.updateColrTable(glyphIndex, newLayers);
        }
        /**
         * Sets a color glyph layer's paletteIndex property to a new index
         * @param {integer} glyphIndex glyph in the font by zero-based glyph index
         * @param {integer} layerIndex layer in the glyph by zero-based layer index
         * @param {integer} paletteIndex new color to set for the layer by zero-based index in any palette
         */
        setPaletteIndex(glyphIndex, layerIndex, paletteIndex) {
          let layers = this.get(glyphIndex);
          if (layers[layerIndex]) {
            layers = layers.map((layer, index) => ({
              glyphID: layer.glyph.index,
              paletteIndex: index === layerIndex ? paletteIndex : layer.paletteIndex
            }));
            this.updateColrTable(glyphIndex, layers);
          } else {
            console.error("Invalid layer index");
          }
        }
        /**
         * Removes one or more layers from a glyph.
         * @param {integer} glyphIndex glyph index to remove the layer(s) from
         * @param {integer} start index to remove the layer at
         * @param {integer?} end (optional) if provided, removes all layers from start index to (and including) end index
         */
        remove(glyphIndex, start, end = start) {
          let currentLayers = this.get(glyphIndex);
          currentLayers = currentLayers.map((layer) => ({
            glyphID: layer.glyph.index,
            paletteIndex: layer.paletteIndex
          }));
          currentLayers.splice(start, end - start + 1);
          this.updateColrTable(glyphIndex, currentLayers);
        }
        /**
         * Mainly used internally. Mainly used internally. Updates the colr table, adding a baseGlyphRecord if needed,
         * ensuring that it's inserted at the correct position, updating numLayers, and adjusting firstLayerIndex values
         * for all baseGlyphRecords according to any deletions or insertions.
         * @param {integer} glyphIndex 
         * @param {Array<Object>} layers array of layer objects {glyphID, paletteIndex}
         */
        updateColrTable(glyphIndex, layers) {
          this.ensureCOLR();
          const font = this.font;
          const colr = font.tables.colr;
          let index = binarySearchIndex(colr.baseGlyphRecords, "glyphID", glyphIndex);
          const addBaseGlyph = index === -1;
          if (addBaseGlyph) {
            const newBaseGlyphRecord = { glyphID: glyphIndex, firstLayerIndex: colr.layerRecords.length, numLayers: 0 };
            index = binarySearchInsert(colr.baseGlyphRecords, "glyphID", newBaseGlyphRecord);
          }
          const baseGlyphRecord = colr.baseGlyphRecords[index];
          const originalNumLayers = baseGlyphRecord.numLayers;
          const newNumLayers = layers.length;
          const layerDiff = newNumLayers - originalNumLayers;
          if (layerDiff > 0) {
            const newLayers = layers.slice(originalNumLayers).map((layer) => ({
              glyphID: layer.glyphID,
              paletteIndex: layer.paletteIndex
            }));
            colr.layerRecords.splice(baseGlyphRecord.firstLayerIndex + originalNumLayers, 0, ...newLayers);
          } else if (layerDiff < 0) {
            colr.layerRecords.splice(baseGlyphRecord.firstLayerIndex + newNumLayers, -layerDiff);
          }
          for (let i = 0; i < Math.min(originalNumLayers, newNumLayers); i++) {
            colr.layerRecords[baseGlyphRecord.firstLayerIndex + i] = {
              glyphID: layers[i].glyphID,
              paletteIndex: layers[i].paletteIndex
            };
          }
          baseGlyphRecord.numLayers = newNumLayers;
          if (layerDiff !== 0) {
            for (let i = 0; i < colr.baseGlyphRecords.length; i++) {
              const sibling = colr.baseGlyphRecords[i];
              if (i === index || sibling.firstLayerIndex < baseGlyphRecord.firstLayerIndex) continue;
              colr.baseGlyphRecords[i].firstLayerIndex += layerDiff;
            }
          }
        }
      };
      var SVGImageManager = class {
        /**
         * @param {opentype.Font} font
         */
        constructor(font) {
          this.font = font;
          this.cache = /* @__PURE__ */ new WeakMap();
        }
        /**
         * @param {number} glyphIndex
         * @returns {SvgImage | undefined}
         */
        get(glyphIndex) {
          const svgImageCacheEntry = this.getOrCreateSvgImageCacheEntry(glyphIndex);
          return svgImageCacheEntry && svgImageCacheEntry.image;
        }
        /**
         * @param {number} glyphIndex
         * @returns {Promise<SvgImage> | undefined}
         */
        getAsync(glyphIndex) {
          const svgImageCacheEntry = this.getOrCreateSvgImageCacheEntry(glyphIndex);
          return svgImageCacheEntry && svgImageCacheEntry.promise;
        }
        /**
         * @param {number} glyphIndex
         * @returns {SVGImageCacheEntry | undefined}
         */
        getOrCreateSvgImageCacheEntry(glyphIndex) {
          const svg = this.font.tables.svg;
          if (svg === void 0) return;
          const svgBuf = svg.get(glyphIndex);
          if (svgBuf === void 0) return;
          let svgDocCacheEntry = this.cache.get(svgBuf);
          if (svgDocCacheEntry === void 0) {
            svgDocCacheEntry = createSvgDocCacheEntry(svgBuf);
            this.cache.set(svgBuf, svgDocCacheEntry);
          }
          let svgImageCacheEntry = svgDocCacheEntry.images.get(glyphIndex);
          if (svgImageCacheEntry === void 0) {
            svgImageCacheEntry = createSvgImageCacheEntry(this.font, svgDocCacheEntry.template, glyphIndex);
            svgImageCacheEntry.promise.then((svgImage) => {
              svgImageCacheEntry.image = svgImage;
              if (typeof this.font.onGlyphUpdated === "function") {
                try {
                  this.font.onGlyphUpdated(glyphIndex);
                } catch (error) {
                  console.error("font.onGlyphUpdated", glyphIndex, error);
                }
              }
            });
            svgDocCacheEntry.images.set(glyphIndex, svgImageCacheEntry);
          }
          return svgImageCacheEntry;
        }
      };
      function createSvgDocCacheEntry(svgBuf) {
        return {
          template: decodeSvgDocument(svgBuf).then(makeSvgTemplate),
          images: /* @__PURE__ */ new Map()
        };
      }
      function createSvgImageCacheEntry(font, svgTemplatePromise, glyphIndex) {
        return {
          promise: svgTemplatePromise.then((svgTemplate) => {
            let svgText;
            if (typeof svgTemplate === "string") {
              svgText = svgTemplate;
            } else {
              svgTemplate[4] = glyphIndex;
              svgText = svgTemplate.join("");
            }
            const svgImage = makeSvgImage(svgText, font.unitsPerEm);
            return svgImage.image.decode().then(() => svgImage);
          }),
          image: void 0
        };
      }
      var decodeSvgDocument = typeof DecompressionStream === "function" ? decodeSvgDocumentWithDecompressionStream : decodeSvgDocumentWithTinyInflate;
      function decodeSvgDocumentWithTinyInflate(buf) {
        try {
          return Promise.resolve(new TextDecoder().decode(isGzip(buf) ? unGzip(buf) : buf));
        } catch (error) {
          return Promise.reject(error);
        }
      }
      function decodeSvgDocumentWithDecompressionStream(buf) {
        if (isGzip(buf)) {
          return new Response(new Response(buf).body.pipeThrough(new DecompressionStream("gzip"))).text();
        }
        try {
          return Promise.resolve(new TextDecoder().decode(buf));
        } catch (error) {
          return Promise.reject(error);
        }
      }
      function makeSvgTemplate(text) {
        const documentStart = text.indexOf("<svg");
        const contentStart = text.indexOf(">", documentStart + 4) + 1;
        if (/ id=['"]glyph\d+['"]/.test(text.substring(documentStart, contentStart))) {
          return text;
        }
        const contentEnd = text.lastIndexOf("</svg>");
        return [
          text.substring(0, contentStart),
          "<defs>",
          text.substring(contentStart, contentEnd),
          '</defs><use href="#glyph',
          "",
          '"/>',
          text.substring(contentEnd)
        ];
      }
      function makeSvgImage(text, unitsPerEm) {
        const svgDocument = new DOMParser().parseFromString(text, "image/svg+xml");
        const svg = svgDocument.documentElement;
        const viewBoxVal = svg.viewBox.baseVal;
        const widthVal = svg.width.baseVal;
        const heightVal = svg.height.baseVal;
        let xScale = 1;
        let yScale = 1;
        if (viewBoxVal.width > 0 && viewBoxVal.height > 0) {
          if (widthVal.unitType === 1) {
            xScale = widthVal.valueInSpecifiedUnits / viewBoxVal.width;
            yScale = heightVal.unitType === 1 ? heightVal.valueInSpecifiedUnits / viewBoxVal.height : xScale;
          } else if (heightVal.unitType === 1) {
            yScale = heightVal.valueInSpecifiedUnits / viewBoxVal.height;
            xScale = yScale;
          } else if (unitsPerEm) {
            xScale = unitsPerEm / viewBoxVal.width;
            yScale = unitsPerEm / viewBoxVal.height;
          }
        }
        const div = document.createElement("div");
        div.style.position = "fixed";
        div.style.visibility = "hidden";
        div.appendChild(svg);
        document.body.appendChild(div);
        const bbox = svg.getBBox();
        document.body.removeChild(div);
        const leftSideBearing = (bbox.x - viewBoxVal.x) * xScale;
        const baseline = (viewBoxVal.y - bbox.y) * yScale;
        const width = bbox.width * xScale;
        const height = bbox.height * yScale;
        svg.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));
        if (xScale !== 1) svg.setAttribute("width", width);
        if (yScale !== 1) svg.setAttribute("height", height);
        const image = new Image(width, height);
        image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.outerHTML);
        return { leftSideBearing, baseline, image };
      }
      var _resolving = /* @__PURE__ */ new WeakMap();
      function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
        let v;
        if ((flag & shortVectorBitMask) > 0) {
          v = p.parseByte();
          if ((flag & sameBitMask) === 0) {
            v = -v;
          }
          v = previousValue + v;
        } else {
          if ((flag & sameBitMask) > 0) {
            v = previousValue;
          } else {
            v = previousValue + p.parseShort();
          }
        }
        return v;
      }
      function parseGlyph(glyph, data, start) {
        const p = new parse_default.Parser(data, start);
        glyph._numberOfContours = p.parseShort();
        glyph._xMin = p.parseShort();
        glyph._yMin = p.parseShort();
        glyph._xMax = p.parseShort();
        glyph._yMax = p.parseShort();
        let flags;
        let flag;
        if (glyph._numberOfContours > 0) {
          const endPointIndices = glyph.endPointIndices = [];
          for (let i = 0; i < glyph._numberOfContours; i += 1) {
            endPointIndices.push(p.parseUShort());
          }
          glyph.instructionLength = p.parseUShort();
          glyph.instructions = [];
          for (let i = 0; i < glyph.instructionLength; i += 1) {
            glyph.instructions.push(p.parseByte());
          }
          const numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
          flags = [];
          for (let i = 0; i < numberOfCoordinates; i += 1) {
            flag = p.parseByte();
            flags.push(flag);
            if ((flag & 8) > 0) {
              const repeatCount = p.parseByte();
              for (let j = 0; j < repeatCount; j += 1) {
                flags.push(flag);
                i += 1;
              }
            }
          }
          check_default.argument(flags.length === numberOfCoordinates, "Bad flags.");
          if (endPointIndices.length > 0) {
            const points = [];
            let point;
            if (numberOfCoordinates > 0) {
              for (let i = 0; i < numberOfCoordinates; i += 1) {
                flag = flags[i];
                point = {};
                point.onCurve = !!(flag & 1);
                point.lastPointOfContour = endPointIndices.indexOf(i) >= 0;
                points.push(point);
              }
              let px = 0;
              for (let i = 0; i < numberOfCoordinates; i += 1) {
                flag = flags[i];
                point = points[i];
                point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                px = point.x;
              }
              let py = 0;
              for (let i = 0; i < numberOfCoordinates; i += 1) {
                flag = flags[i];
                point = points[i];
                point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                py = point.y;
              }
            }
            glyph.points = points;
          } else {
            glyph.points = [];
          }
        } else if (glyph._numberOfContours === 0) {
          glyph.points = [];
        } else {
          glyph.isComposite = true;
          glyph.points = [];
          glyph.components = [];
          let moreComponents = true;
          while (moreComponents) {
            flags = p.parseUShort();
            const component = {
              glyphIndex: p.parseUShort(),
              xScale: 1,
              scale01: 0,
              scale10: 0,
              yScale: 1,
              dx: 0,
              dy: 0
            };
            if ((flags & 1) > 0) {
              if ((flags & 2) > 0) {
                component.dx = p.parseShort();
                component.dy = p.parseShort();
              } else {
                component.matchedPoints = [p.parseUShort(), p.parseUShort()];
              }
            } else {
              if ((flags & 2) > 0) {
                component.dx = p.parseChar();
                component.dy = p.parseChar();
              } else {
                component.matchedPoints = [p.parseByte(), p.parseByte()];
              }
            }
            if ((flags & 8) > 0) {
              component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
              component.xScale = p.parseF2Dot14();
              component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
              component.xScale = p.parseF2Dot14();
              component.scale01 = p.parseF2Dot14();
              component.scale10 = p.parseF2Dot14();
              component.yScale = p.parseF2Dot14();
            }
            glyph.components.push(component);
            moreComponents = !!(flags & 32);
          }
          if (flags & 256) {
            glyph.instructionLength = p.parseUShort();
            glyph.instructions = [];
            for (let i = 0; i < glyph.instructionLength; i += 1) {
              glyph.instructions.push(p.parseByte());
            }
          }
        }
      }
      function transformPoints(points, transform) {
        const newPoints = [];
        for (let i = 0; i < points.length; i += 1) {
          const pt = points[i];
          const newPt = {
            x: transform.xScale * pt.x + transform.scale10 * pt.y + transform.dx,
            y: transform.scale01 * pt.x + transform.yScale * pt.y + transform.dy,
            onCurve: pt.onCurve,
            lastPointOfContour: pt.lastPointOfContour
          };
          newPoints.push(newPt);
        }
        return newPoints;
      }
      function getContours(points) {
        const contours = [];
        let currentContour = [];
        for (let i = 0; i < points.length; i += 1) {
          const pt = points[i];
          currentContour.push(pt);
          if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
          }
        }
        check_default.argument(currentContour.length === 0, "There are still points left in the current contour.");
        return contours;
      }
      function getPath(points) {
        const p = new path_default();
        if (!points) {
          return p;
        }
        const contours = getContours(points);
        for (let contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
          const contour = contours[contourIndex];
          let curr = contour[contour.length - 1];
          let next = contour[0];
          if (curr.onCurve) {
            p.moveTo(curr.x, curr.y);
          } else {
            if (next.onCurve) {
              p.moveTo(next.x, next.y);
            } else {
              const start = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
              p.moveTo(start.x, start.y);
            }
          }
          for (let i = 0; i < contour.length; ++i) {
            curr = next;
            next = contour[(i + 1) % contour.length];
            if (curr.onCurve) {
              p.lineTo(curr.x, curr.y);
            } else {
              let next2 = next;
              if (!next.onCurve) {
                next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
              }
              p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
            }
          }
          p.closePath();
        }
        return p;
      }
      function buildPath(glyphs, glyph) {
        if (glyph.isComposite) {
          if (!_resolving.has(glyphs)) {
            _resolving.set(glyphs, /* @__PURE__ */ new Set());
          }
          const resolving = _resolving.get(glyphs);
          resolving.add(glyph.index);
          try {
            for (let j = 0; j < glyph.components.length; j += 1) {
              const component = glyph.components[j];
              if (resolving.has(component.glyphIndex)) {
                continue;
              }
              const componentGlyph = glyphs.get(component.glyphIndex);
              componentGlyph.getPath();
              if (componentGlyph.points) {
                let transformedPoints;
                if (component.matchedPoints === void 0) {
                  transformedPoints = transformPoints(componentGlyph.points, component);
                } else {
                  if (component.matchedPoints[0] > glyph.points.length - 1 || component.matchedPoints[1] > componentGlyph.points.length - 1) {
                    throw Error("Matched points out of range in " + glyph.name);
                  }
                  const firstPt = glyph.points[component.matchedPoints[0]];
                  let secondPt = componentGlyph.points[component.matchedPoints[1]];
                  const transform = {
                    xScale: component.xScale,
                    scale01: component.scale01,
                    scale10: component.scale10,
                    yScale: component.yScale,
                    dx: 0,
                    dy: 0
                  };
                  secondPt = transformPoints([secondPt], transform)[0];
                  transform.dx = firstPt.x - secondPt.x;
                  transform.dy = firstPt.y - secondPt.y;
                  transformedPoints = transformPoints(componentGlyph.points, transform);
                }
                glyph.points = glyph.points.concat(transformedPoints);
              }
            }
          } finally {
            resolving.delete(glyph.index);
          }
        }
        return getPath(glyph.points);
      }
      function parseGlyfTableAll(data, start, loca, font) {
        const glyphs = new glyphset_default.GlyphSet(font);
        for (let i = 0; i < loca.length - 1; i += 1) {
          const offset = loca[i];
          const nextOffset = loca[i + 1];
          if (offset !== nextOffset) {
            glyphs.push(i, glyphset_default.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
          } else {
            glyphs.push(i, glyphset_default.glyphLoader(font, i));
          }
        }
        return glyphs;
      }
      function parseGlyfTableOnLowMemory(data, start, loca, font) {
        const glyphs = new glyphset_default.GlyphSet(font);
        font._push = function(i) {
          const offset = loca[i];
          const nextOffset = loca[i + 1];
          if (offset !== nextOffset) {
            glyphs.push(i, glyphset_default.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
          } else {
            glyphs.push(i, glyphset_default.glyphLoader(font, i));
          }
        };
        return glyphs;
      }
      function parseGlyfTable(data, start, loca, font, opt) {
        if (opt.lowMemory)
          return parseGlyfTableOnLowMemory(data, start, loca, font);
        else
          return parseGlyfTableAll(data, start, loca, font);
      }
      var glyf_default = { getPath, parse: parseGlyfTable };
      var VariationProcessor = class {
        constructor(font) {
          this.font = font;
        }
        /**
         * Modifies a coords object to make sure that tags have a length of 4
         * @param {Object} coords - variation coordinates
         */
        normalizeCoordTags(coords) {
          for (const tag in coords) {
            if (tag.length < 4) {
              const padded = tag.padEnd(4, " ");
              coords[padded] === void 0 && (coords[padded] = coords[tag]);
              delete coords[tag];
            }
          }
        }
        /**
         * Normalizes the coordinates from the axis ranges to a range of -1 to 1.
         * @param {Object} coords - The coordinates object to normalize.
         * @returns {Array<number>} The normalized coordinates as an array
         */
        getNormalizedCoords(coords) {
          if (!coords) {
            coords = this.font.variation.get();
          }
          let normalized = [];
          this.normalizeCoordTags(coords);
          for (let i = 0; i < this.fvar().axes.length; i++) {
            const axis = this.fvar().axes[i];
            let tagValue = coords[axis.tag];
            if (tagValue === void 0) {
              tagValue = axis.defaultValue;
            }
            if (tagValue < axis.defaultValue) {
              normalized.push((tagValue - axis.defaultValue + Number.EPSILON) / (axis.defaultValue - axis.minValue + Number.EPSILON));
            } else {
              normalized.push((tagValue - axis.defaultValue + Number.EPSILON) / (axis.maxValue - axis.defaultValue + Number.EPSILON));
            }
          }
          if (this.avar()) {
            for (let i = 0; i < this.avar().axisSegmentMaps.length; i++) {
              let segment = this.avar().axisSegmentMaps[i];
              for (let j = 0; j < segment.axisValueMaps.length; j++) {
                let pair = segment.axisValueMaps[j];
                if (j >= 1 && normalized[i] < pair.fromCoordinate) {
                  let prev = segment.axisValueMaps[j - 1];
                  normalized[i] = ((normalized[i] - prev.fromCoordinate) * (pair.toCoordinate - prev.toCoordinate) + Number.EPSILON) / (pair.fromCoordinate - prev.fromCoordinate + Number.EPSILON) + prev.toCoordinate;
                  break;
                }
              }
            }
          }
          return normalized;
        }
        /**
         * Interpolates points within a glyph if deltas are not provided for all points.
         * @param {Array<Object>} points - The points to be interpolated.
         * @param {Array<Object>} glyphPoints - Reference points from the glyph.
         * @param {Object} deltaMap - A map indicating which points have deltas.
         */
        interpolatePoints(points, glyphPoints, deltaMap) {
          if (points.length === 0) {
            return;
          }
          let pointIndex = 0;
          while (pointIndex < points.length) {
            let firstPoint = pointIndex;
            let endPoint = pointIndex;
            let point = points[endPoint];
            while (!point.lastPointOfContour) {
              point = points[++endPoint];
            }
            while (pointIndex <= endPoint && !deltaMap[pointIndex]) {
              pointIndex++;
            }
            if (pointIndex > endPoint) {
              continue;
            }
            let firstDelta = pointIndex;
            let curDelta = pointIndex;
            pointIndex++;
            while (pointIndex <= endPoint) {
              if (deltaMap[pointIndex]) {
                this.deltaInterpolate(curDelta + 1, pointIndex - 1, curDelta, pointIndex, glyphPoints, points);
                curDelta = pointIndex;
              }
              pointIndex++;
            }
            if (curDelta === firstDelta) {
              this.deltaShift(firstPoint, endPoint, curDelta, glyphPoints, points);
            } else {
              this.deltaInterpolate(curDelta + 1, endPoint, curDelta, firstDelta, glyphPoints, points);
              if (firstDelta > 0) {
                this.deltaInterpolate(firstPoint, firstDelta - 1, curDelta, firstDelta, glyphPoints, points);
              }
            }
            pointIndex = endPoint + 1;
          }
        }
        /**
         * Interpolates delta values between two points.
         * @param {number} p1 - Start point index for interpolation.
         * @param {number} p2 - End point index for interpolation.
         * @param {number} ref1 - Reference point index for the start delta.
         * @param {number} ref2 - Reference point index for the end delta.
         * @param {Array<Object>} glyphPoints - Reference points from the glyph.
         * @param {Array<Object>} points - The points to be adjusted.
         */
        deltaInterpolate(p1, p2, ref1, ref2, glyphPoints, points) {
          if (p1 > p2) {
            return;
          }
          let iterable = ["x", "y"];
          for (let i = 0; i < iterable.length; i++) {
            let k = iterable[i];
            if (glyphPoints[ref1][k] > glyphPoints[ref2][k]) {
              var p = ref1;
              ref1 = ref2;
              ref2 = p;
            }
            let in1 = glyphPoints[ref1][k];
            let in2 = glyphPoints[ref2][k];
            let out1 = points[ref1][k];
            let out2 = points[ref2][k];
            if (in1 !== in2 || out1 === out2) {
              let scale = in1 === in2 ? 0 : (out2 - out1) / (in2 - in1);
              for (let p3 = p1; p3 <= p2; p3++) {
                let out = glyphPoints[p3][k];
                if (out <= in1) {
                  out += out1 - in1;
                } else if (out >= in2) {
                  out += out2 - in2;
                } else {
                  out = out1 + (out - in1) * scale;
                }
                points[p3][k] = out;
              }
            }
          }
        }
        /**
         * Applies a delta shift to a range of points based on a reference point.
         * @param {number} p1 - Start point index for shifting.
         * @param {number} p2 - End point index for shifting.
         * @param {number} ref - Reference point index.
         * @param {Array<Object>} glyphPoints - Reference points from the glyph.
         * @param {Array<Object>} points - The points to be shifted.
         */
        deltaShift(p1, p2, ref, glyphPoints, points) {
          let deltaX = points[ref].x - glyphPoints[ref].x;
          let deltaY = points[ref].y - glyphPoints[ref].y;
          if (deltaX === 0 && deltaY === 0) {
            return;
          }
          for (let p = p1; p <= p2; p++) {
            if (p !== ref) {
              points[p].x += deltaX;
              points[p].y += deltaY;
            }
          }
        }
        /**
         * Transforms glyph components based on variation data.
         * @param {Glyph} glyph - The composite glyph to transform.
         * @param {Array<Object>} transformedPoints - Points that are already transformed.
         * @param {Object} coords - Variation coordinates.
         * @param {Array<number>} tuplePoints - Points that are part of the tuple.
         * @param {Object} header - Header information from the variation data.
         * @param {number} factor - The scaling factor for the transformation.
         */
        transformComponents(glyph, transformedPoints, coords, tuplePoints, header, factor) {
          let pointsIndex = 0;
          for (let c = 0; c < glyph.components.length; c++) {
            const component = glyph.components[c];
            const componentGlyph = this.font.glyphs.get(component.glyphIndex);
            const componentTransform = copyComponent(component);
            const deltaIndex = tuplePoints.indexOf(c);
            if (deltaIndex > -1) {
              componentTransform.dx += Math.round(header.deltas[deltaIndex] * factor);
              componentTransform.dy += Math.round(header.deltasY[deltaIndex] * factor);
            }
            const transformedComponentPoints = transformPoints(this.getTransform(componentGlyph, coords).points, componentTransform);
            transformedPoints.splice(pointsIndex, transformedComponentPoints.length, ...transformedComponentPoints);
            pointsIndex += componentGlyph.points.length;
          }
        }
        applyTupleVariationStore(variationData, points, coords, flavor = "gvar", args = {}) {
          if (!coords) {
            coords = this.font.variation.get();
          }
          const normalizedCoords = this.getNormalizedCoords(coords);
          const { headers, sharedPoints } = variationData;
          const axisCount = this.fvar().axes.length;
          let transformedPoints;
          if (flavor === "gvar") {
            transformedPoints = points.map(copyPoint);
          } else if (flavor === "cvar") {
            transformedPoints = [...points];
          }
          for (let h = 0; h < headers.length; h++) {
            const header = headers[h];
            let factor = 1;
            for (let a = 0; a < axisCount; a++) {
              let tupleCoords = [0];
              switch (flavor) {
                case "gvar":
                  tupleCoords = header.peakTuple ? header.peakTuple : this.gvar().sharedTuples[header.sharedTupleRecordsIndex];
                  break;
                case "cvar":
                  tupleCoords = header.peakTuple;
                  break;
              }
              if (tupleCoords[a] === 0) {
                continue;
              }
              if (normalizedCoords[a] === 0) {
                factor = 0;
                break;
              }
              if (!header.intermediateStartTuple) {
                if (normalizedCoords[a] < Math.min(0, tupleCoords[a]) || normalizedCoords[a] > Math.max(0, tupleCoords[a])) {
                  factor = 0;
                  break;
                }
                factor = (factor * normalizedCoords[a] + Number.EPSILON) / (tupleCoords[a] + Number.EPSILON);
              } else {
                if (normalizedCoords[a] < header.intermediateStartTuple[a] || normalizedCoords[a] > header.intermediateEndTuple[a]) {
                  factor = 0;
                  break;
                } else if (normalizedCoords[a] < tupleCoords[a]) {
                  factor = factor * (normalizedCoords[a] - header.intermediateStartTuple[a] + Number.EPSILON) / (tupleCoords[a] - header.intermediateStartTuple[a] + Number.EPSILON);
                } else {
                  factor = factor * (header.intermediateEndTuple[a] - normalizedCoords[a] + Number.EPSILON) / (header.intermediateEndTuple[a] - tupleCoords[a] + Number.EPSILON);
                }
              }
            }
            if (factor === 0) {
              continue;
            }
            const tuplePoints = header.privatePoints.length ? header.privatePoints : sharedPoints;
            if (flavor === "gvar" && args.glyph && args.glyph.isComposite) {
              this.transformComponents(args.glyph, transformedPoints, coords, tuplePoints, header, factor);
            } else if (tuplePoints.length === 0) {
              for (let i = 0; i < transformedPoints.length; i++) {
                const point = transformedPoints[i];
                if (flavor === "gvar") {
                  transformedPoints[i] = {
                    x: Math.round(point.x + header.deltas[i] * factor),
                    y: Math.round(point.y + header.deltasY[i] * factor),
                    onCurve: point.onCurve,
                    lastPointOfContour: point.lastPointOfContour
                  };
                } else if (flavor === "cvar") {
                  transformedPoints[i] = Math.round(point + header.deltas[i] * factor);
                }
              }
            } else {
              let interpolatedPoints;
              if (flavor === "gvar") {
                interpolatedPoints = transformedPoints.map(copyPoint);
              } else if (flavor === "cvar") {
                interpolatedPoints = transformedPoints;
              }
              const deltaMap = Array(points.length).fill(false);
              for (let i = 0; i < tuplePoints.length; i++) {
                let pointIndex = tuplePoints[i];
                if (pointIndex < points.length) {
                  let point = interpolatedPoints[pointIndex];
                  if (flavor === "gvar") {
                    deltaMap[pointIndex] = true;
                    point.x += header.deltas[i] * factor;
                    point.y += header.deltasY[i] * factor;
                  } else if (flavor === "cvar") {
                    transformedPoints[pointIndex] = Math.round(point + header.deltas[i] * factor);
                  }
                }
              }
              if (flavor === "gvar") {
                this.interpolatePoints(interpolatedPoints, transformedPoints, deltaMap);
                for (let i = 0; i < points.length; i++) {
                  let deltaX = interpolatedPoints[i].x - transformedPoints[i].x;
                  let deltaY = interpolatedPoints[i].y - transformedPoints[i].y;
                  transformedPoints[i].x = Math.round(transformedPoints[i].x + deltaX);
                  transformedPoints[i].y = Math.round(transformedPoints[i].y + deltaY);
                }
              }
            }
          }
          return transformedPoints;
        }
        /**
         * Retrieves a transformed copy of a glyph based on the provided variation coordinates, or the glyph itself if no variation was applied
         * @param {opentype.Glyph|number} glyph - Glyph or index of glyph to transform.
         * @param {Object} coords - Variation coords object (will fall back to variation coords in the defaultRenderOptions)
         * @returns {opentype.Glyph} - The transformed glyph.
         */
        getTransform(glyph, coords) {
          if (Number.isInteger(glyph)) {
            glyph = this.font.glyphs.get(glyph);
          }
          const hasBlend = glyph.getBlendPath;
          const hasPoints = !!(glyph.points && glyph.points.length);
          let transformedGlyph = glyph;
          if (hasBlend || hasPoints) {
            if (!coords) {
              coords = this.font.variation.get();
            }
            if (hasPoints) {
              const variationData = this.gvar() && this.gvar().glyphVariations[glyph.index];
              if (variationData) {
                const glyphPoints = glyph.points;
                let transformedPoints = this.applyTupleVariationStore(variationData, glyphPoints, coords, "gvar", { glyph });
                transformedGlyph = new glyph_default(Object.assign({}, glyph, { points: transformedPoints, path: getPath(transformedPoints) }));
              }
            } else if (hasBlend) {
              const blendPath = glyph.getBlendPath(coords);
              transformedGlyph = new glyph_default(Object.assign({}, glyph, { path: blendPath }));
            }
          }
          if (this.font.tables.hvar) {
            glyph._advanceWidth = typeof glyph._advanceWidth !== "undefined" ? glyph._advanceWidth : glyph.advanceWidth;
            glyph.advanceWidth = transformedGlyph.advanceWidth = Math.round(glyph._advanceWidth + this.getVariableAdjustment(transformedGlyph.index, "hvar", "advanceWidth", coords));
            glyph._leftSideBearing = typeof glyph._leftSideBearing !== "undefined" ? glyph._leftSideBearing : glyph.leftSideBearing;
            glyph.leftSideBearing = transformedGlyph.leftSideBearing = Math.round(glyph._leftSideBearing + this.getVariableAdjustment(transformedGlyph.index, "hvar", "lsb", coords));
          }
          return transformedGlyph;
        }
        getCvarTransform(coords) {
          const cvt = this.font.tables.cvt;
          const variationData = this.cvar();
          if (!cvt || !cvt.length || !variationData || !variationData.headers.length) return cvt;
          return this.applyTupleVariationStore(variationData, cvt, coords, "cvar");
        }
        /**
         * Calculates the variable adjustment for a glyph property from variation data.
         * @param {number} gid - Glyph ID.
         * @param {string} tableName - The name of the variation data table.
         * @param {string} parameter - The property to adjust.
         * @param {Object} coords - Variation coordinates.
         * @returns {number} - The calculated adjustment.
         */
        getVariableAdjustment(gid, tableName, parameter, coords) {
          coords = coords || this.font.variation.get();
          let outerIndex, innerIndex;
          const table = this.font.tables[tableName];
          if (!table) {
            throw Error(`trying to get variation adjustment from non-existent table "${table}"`);
          }
          if (!table.itemVariationStore) {
            throw Error(`trying to get variation adjustment from table "${table}" which does not have an itemVariationStore`);
          }
          const mapSize = table[parameter] && table[parameter].map.length;
          if (mapSize) {
            let i = gid;
            if (i >= mapSize) {
              i = mapSize - 1;
            }
            ({ outerIndex, innerIndex } = table[parameter].map[i]);
          } else {
            outerIndex = 0;
            innerIndex = gid;
          }
          return this.getDelta(table.itemVariationStore, outerIndex, innerIndex, coords);
        }
        /**
         * Retrieves the delta value from a variation store.
         * @param {Object} itemStore - The item variation store.
         * @param {number} outerIndex - The outer index in the variation subtables.
         * @param {number} innerIndex - The inner index in the delta sets.
         * @param {Object} coords - Variation coordinates.
         * @returns {number} - The delta value.
         */
        getDelta(itemStore, outerIndex, innerIndex, coords) {
          if (outerIndex >= itemStore.itemVariationSubtables.length) {
            return 0;
          }
          let varData = itemStore.itemVariationSubtables[outerIndex];
          if (innerIndex >= varData.deltaSets.length) {
            return 0;
          }
          let deltaSet = varData.deltaSets[innerIndex];
          let blendVector = this.getBlendVector(itemStore, outerIndex, coords);
          let netAdjustment = 0;
          for (let master = 0; master < varData.regionIndexes.length; master++) {
            netAdjustment += deltaSet[master] * blendVector[master];
          }
          return netAdjustment;
        }
        /**
         * Calculates the blend vector for a set of variation coordinates.
         * @param {Object} itemStore - The item variation store.
         * @param {number} itemIndex - Index of the current item in the variation subtables.
         * @param {Object} coords - Variation coordinates.
         * @returns {Array<number>} - The blend vector for the given coordinates.
         */
        getBlendVector(itemStore, itemIndex, coords) {
          if (!coords) {
            coords = this.font.variation.get();
          }
          let varData = itemStore.itemVariationSubtables[itemIndex];
          const normalizedCoords = this.getNormalizedCoords(coords);
          let blendVector = [];
          for (let master = 0; master < varData.regionIndexes.length; master++) {
            let scalar = 1;
            let regionIndex = varData.regionIndexes[master];
            let axes = itemStore.variationRegions[regionIndex].regionAxes;
            for (let j = 0; j < axes.length; j++) {
              let axis = axes[j];
              let axisScalar;
              if (axis.startCoord > axis.peakCoord || axis.peakCoord > axis.endCoord) {
                axisScalar = 1;
              } else if (axis.startCoord < 0 && axis.endCoord > 0 && axis.peakCoord !== 0) {
                axisScalar = 1;
              } else if (axis.peakCoord === 0) {
                axisScalar = 1;
              } else if (normalizedCoords[j] < axis.startCoord || normalizedCoords[j] > axis.endCoord) {
                axisScalar = 0;
              } else {
                if (normalizedCoords[j] === axis.peakCoord) {
                  axisScalar = 1;
                } else if (normalizedCoords[j] < axis.peakCoord) {
                  axisScalar = (normalizedCoords[j] - axis.startCoord + Number.EPSILON) / (axis.peakCoord - axis.startCoord + Number.EPSILON);
                } else {
                  axisScalar = (axis.endCoord - normalizedCoords[j] + Number.EPSILON) / (axis.endCoord - axis.peakCoord + Number.EPSILON);
                }
              }
              scalar *= axisScalar;
            }
            blendVector[master] = scalar;
          }
          return blendVector;
        }
        /**
         * Helper method that returns the font's avar table if present
         * @returns {Object|undefined}
         */
        avar() {
          return this.font.tables.avar;
        }
        /**
         * Helper method that returns the font's cvar table if present
         * @returns {Object|undefined}
         */
        cvar() {
          return this.font.tables.cvar;
        }
        /**
         * Helper method that returns the font's fvar table if present
         * @returns {Object|undefined}
         */
        fvar() {
          return this.font.tables.fvar;
        }
        /**
         * Helper method that returns the font's gvar table if present
         * @returns {Object|undefined}
         */
        gvar() {
          return this.font.tables.gvar;
        }
        /**
         * Helper method that returns the font's hvar table if present
         * @returns {Object|undefined}
         */
        hvar() {
          return this.font.tables.hvar;
        }
      };
      var VariationManager = class {
        constructor(font) {
          this.font = font;
          this.process = new VariationProcessor(this.font);
          this.activateDefaultVariation();
          this.getTransform = this.process.getTransform.bind(this.process);
        }
        /**
         * Tries to determine the default instance and sets its variation data as the font.defaultRenderOptions.
         * If not defaultInstance can be determined, the default coordinates of all axes are used.
         */
        activateDefaultVariation() {
          const defaultInstance = this.getDefaultInstanceIndex();
          if (defaultInstance > -1) {
            this.set(defaultInstance);
          } else {
            this.set(this.getDefaultCoordinates());
          }
        }
        /**
         * Retrieves the default coordinates for the font's variation axes.
         * @returns {Object} An object mapping axis tags to their default values.
         */
        getDefaultCoordinates() {
          return this.fvar().axes.reduce((acc, axis) => {
            acc[axis.tag] = axis.defaultValue;
            return acc;
          }, {});
        }
        /**
         * Gets the index of the default variation instance or -1 if not able to determine
         * @returns {integer} default index or -1
         */
        getDefaultInstanceIndex() {
          const defaultCoordinates = this.getDefaultCoordinates();
          let defaultInstanceIndex = this.getInstanceIndex(defaultCoordinates);
          if (defaultInstanceIndex < 0) {
            defaultInstanceIndex = this.fvar().instances.findIndex((instance) => instance.name && instance.name.en === "Regular");
          }
          return defaultInstanceIndex;
        }
        /**
         * Retrieves the index of the variation instance matching the coordinates object or -1 if not able to determine
         * @param {integer|Object} coordinates An object where keys are axis tags and values are the corresponding variation values.
         * @returns {integer} The index of the matching instance or -1 if no match is found.
         */
        getInstanceIndex(coordinates) {
          return this.fvar().instances.findIndex(
            (instance) => Object.keys(coordinates).every(
              (axis) => instance.coordinates[axis] === coordinates[axis]
            )
          );
        }
        /**
         * Retrieves a variation instance by its zero-based index
         * @param {integer} index - zero-based index of the variation instance
         * @returns {Object} - variation instance or null if the index is invalid.
         */
        getInstance(index) {
          return this.fvar().instances && this.fvar().instances[index];
        }
        /**
         * Set the variation coordinates to use by default for rendering in the font.defaultRenderOptions
         * @param {integer|Object} instanceIdOrObject Either the zero-based index of a variation instance or an object with axis tags as keys and variation values as values
         */
        set(instanceIdOrObject) {
          let variationData;
          if (Number.isInteger(instanceIdOrObject)) {
            const instance = this.getInstance(instanceIdOrObject);
            if (!instance) {
              throw Error(`Invalid instance index ${instanceIdOrObject}`);
            }
            variationData = { ...instance.coordinates };
          } else {
            variationData = instanceIdOrObject;
            this.process.normalizeCoordTags(variationData);
          }
          variationData = Object.assign(
            {},
            this.font.defaultRenderOptions.variation,
            variationData
          );
          this.font.defaultRenderOptions = Object.assign(
            {},
            this.font.defaultRenderOptions,
            { variation: variationData }
          );
        }
        /**
         * Returns the variation coordinates currently set in the font.defaultRenderOptions
         * @returns {Object}
         */
        get() {
          return Object.assign({}, this.font.defaultRenderOptions.variation);
        }
        /**
         * Helper method that returns the font's avar table if present
         * @returns {Object|undefined}
         */
        avar() {
          return this.font.tables.avar;
        }
        /**
         * Helper method that returns the font's cvar table if present
         * @returns {Object|undefined}
         */
        cvar() {
          return this.font.tables.cvar;
        }
        /**
         * Helper method that returns the font's fvar table if present
         * @returns {Object|undefined}
         */
        fvar() {
          return this.font.tables.fvar;
        }
        /**
         * Helper method that returns the font's gvar table if present
         * @returns {Object|undefined}
         */
        gvar() {
          return this.font.tables.gvar;
        }
        /**
         * Helper method that returns the font's hvar table if present
         * @returns {Object|undefined}
         */
        hvar() {
          return this.font.tables.hvar;
        }
      };
      var MAX_INSTRUCTIONS = 1e6;
      var MAX_CALL_DEPTH2 = 64;
      var MAX_LOOP_COUNT = 1e4;
      var instructionTable;
      var exec;
      var execGlyph;
      var execComponent;
      function Hinting(font) {
        this.font = font;
        this.getCommands = function(hPoints) {
          return glyf_default.getPath(hPoints).commands;
        };
        this._fpgmState = this._prepState = void 0;
        this._errorState = 0;
      }
      function roundOff(v) {
        return v;
      }
      function roundToGrid(v) {
        return Math.sign(v) * Math.round(Math.abs(v));
      }
      function roundToDoubleGrid(v) {
        return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
      }
      function roundToHalfGrid(v) {
        return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
      }
      function roundUpToGrid(v) {
        return Math.sign(v) * Math.ceil(Math.abs(v));
      }
      function roundDownToGrid(v) {
        return Math.sign(v) * Math.floor(Math.abs(v));
      }
      var roundSuper = function(v) {
        const period = this.srPeriod;
        let phase = this.srPhase;
        const threshold = this.srThreshold;
        let sign = 1;
        if (v < 0) {
          v = -v;
          sign = -1;
        }
        v += threshold - phase;
        v = Math.trunc(v / period) * period;
        v += phase;
        if (v < 0) return phase * sign;
        return v * sign;
      };
      var xUnitVector = {
        x: 1,
        y: 0,
        axis: "x",
        // Gets the projected distance between two points.
        // o1/o2 ... if true, respective original position is used.
        distance: function(p1, p2, o1, o2) {
          return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
        },
        // Moves point p so the moved position has the same relative
        // position to the moved positions of rp1 and rp2 than the
        // original positions had.
        //
        // See APPENDIX on INTERPOLATE at the bottom of this file.
        interpolate: function(p, rp1, rp2, pv) {
          let do1;
          let do2;
          let doa1;
          let doa2;
          let dm1;
          let dm2;
          let dt;
          if (!pv || pv === this) {
            do1 = p.xo - rp1.xo;
            do2 = p.xo - rp2.xo;
            dm1 = rp1.x - rp1.xo;
            dm2 = rp2.x - rp2.xo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;
            if (dt === 0) {
              p.x = p.xo + (dm1 + dm2) / 2;
              return;
            }
            p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
          }
          do1 = pv.distance(p, rp1, true, true);
          do2 = pv.distance(p, rp2, true, true);
          dm1 = pv.distance(rp1, rp1, false, true);
          dm2 = pv.distance(rp2, rp2, false, true);
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt = doa1 + doa2;
          if (dt === 0) {
            xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
          }
          xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
        },
        // Slope of line normal to this
        normalSlope: Number.NEGATIVE_INFINITY,
        // Sets the point 'p' relative to point 'rp'
        // by the distance 'd'.
        //
        // See APPENDIX on SETRELATIVE at the bottom of this file.
        //
        // p   ... point to set
        // rp  ... reference point
        // d   ... distance on projection vector
        // pv  ... projection vector (undefined = this)
        // org ... if true, uses the original position of rp as reference.
        setRelative: function(p, rp, d, pv, org) {
          if (!pv || pv === this) {
            p.x = (org ? rp.xo : rp.x) + d;
            return;
          }
          const rpx = org ? rp.xo : rp.x;
          const rpy = org ? rp.yo : rp.y;
          const rpdx = rpx + d * pv.x;
          const rpdy = rpy + d * pv.y;
          p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
        },
        // Slope of vector line.
        slope: 0,
        // Touches the point p.
        touch: function(p) {
          p.xTouched = true;
        },
        // Tests if a point p is touched.
        touched: function(p) {
          return p.xTouched;
        },
        // Untouches the point p.
        untouch: function(p) {
          p.xTouched = false;
        }
      };
      var yUnitVector = {
        x: 0,
        y: 1,
        axis: "y",
        // Gets the projected distance between two points.
        // o1/o2 ... if true, respective original position is used.
        distance: function(p1, p2, o1, o2) {
          return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
        },
        // Moves point p so the moved position has the same relative
        // position to the moved positions of rp1 and rp2 than the
        // original positions had.
        //
        // See APPENDIX on INTERPOLATE at the bottom of this file.
        interpolate: function(p, rp1, rp2, pv) {
          let do1;
          let do2;
          let doa1;
          let doa2;
          let dm1;
          let dm2;
          let dt;
          if (!pv || pv === this) {
            do1 = p.yo - rp1.yo;
            do2 = p.yo - rp2.yo;
            dm1 = rp1.y - rp1.yo;
            dm2 = rp2.y - rp2.yo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;
            if (dt === 0) {
              p.y = p.yo + (dm1 + dm2) / 2;
              return;
            }
            p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
          }
          do1 = pv.distance(p, rp1, true, true);
          do2 = pv.distance(p, rp2, true, true);
          dm1 = pv.distance(rp1, rp1, false, true);
          dm2 = pv.distance(rp2, rp2, false, true);
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt = doa1 + doa2;
          if (dt === 0) {
            yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
          }
          yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
        },
        // Slope of line normal to this.
        normalSlope: 0,
        // Sets the point 'p' relative to point 'rp'
        // by the distance 'd'
        //
        // See APPENDIX on SETRELATIVE at the bottom of this file.
        //
        // p   ... point to set
        // rp  ... reference point
        // d   ... distance on projection vector
        // pv  ... projection vector (undefined = this)
        // org ... if true, uses the original position of rp as reference.
        setRelative: function(p, rp, d, pv, org) {
          if (!pv || pv === this) {
            p.y = (org ? rp.yo : rp.y) + d;
            return;
          }
          const rpx = org ? rp.xo : rp.x;
          const rpy = org ? rp.yo : rp.y;
          const rpdx = rpx + d * pv.x;
          const rpdy = rpy + d * pv.y;
          p.y = rpdy + pv.normalSlope * (p.x - rpdx);
        },
        // Slope of vector line.
        slope: Number.POSITIVE_INFINITY,
        // Touches the point p.
        touch: function(p) {
          p.yTouched = true;
        },
        // Tests if a point p is touched.
        touched: function(p) {
          return p.yTouched;
        },
        // Untouches the point p.
        untouch: function(p) {
          p.yTouched = false;
        }
      };
      Object.freeze(xUnitVector);
      Object.freeze(yUnitVector);
      function UnitVector(x, y) {
        this.x = x;
        this.y = y;
        this.axis = void 0;
        this.slope = y / x;
        this.normalSlope = -x / y;
        Object.freeze(this);
      }
      UnitVector.prototype.distance = function(p1, p2, o1, o2) {
        return this.x * xUnitVector.distance(p1, p2, o1, o2) + this.y * yUnitVector.distance(p1, p2, o1, o2);
      };
      UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
        let dm1;
        let dm2;
        let do1;
        let do2;
        let doa1;
        let doa2;
        let dt;
        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;
        if (dt === 0) {
          this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
          return;
        }
        this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
      };
      UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
        pv = pv || this;
        const rpx = org ? rp.xo : rp.x;
        const rpy = org ? rp.yo : rp.y;
        const rpdx = rpx + d * pv.x;
        const rpdy = rpy + d * pv.y;
        const pvns = pv.normalSlope;
        const fvs = this.slope;
        const px = p.x;
        const py = p.y;
        p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
        p.y = fvs * (p.x - px) + py;
      };
      UnitVector.prototype.touch = function(p) {
        p.xTouched = true;
        p.yTouched = true;
      };
      function getUnitVector(x, y) {
        const d = Math.sqrt(x * x + y * y);
        x /= d;
        y /= d;
        if (x === 1 && y === 0) return xUnitVector;
        else if (x === 0 && y === 1) return yUnitVector;
        else return new UnitVector(x, y);
      }
      function HPoint(x, y, lastPointOfContour, onCurve) {
        this.x = this.xo = Math.round(x * 64) / 64;
        this.y = this.yo = Math.round(y * 64) / 64;
        this.lastPointOfContour = lastPointOfContour;
        this.onCurve = onCurve;
        this.prevPointOnContour = void 0;
        this.nextPointOnContour = void 0;
        this.xTouched = false;
        this.yTouched = false;
        Object.preventExtensions(this);
      }
      HPoint.prototype.nextTouched = function(v) {
        let p = this.nextPointOnContour;
        while (!v.touched(p) && p !== this) p = p.nextPointOnContour;
        return p;
      };
      HPoint.prototype.prevTouched = function(v) {
        let p = this.prevPointOnContour;
        while (!v.touched(p) && p !== this) p = p.prevPointOnContour;
        return p;
      };
      var HPZero = Object.freeze(new HPoint(0, 0));
      var defaultState = {
        cvCutIn: 17 / 16,
        // control value cut in
        deltaBase: 9,
        deltaShift: 0.125,
        loop: 1,
        // loops some instructions
        minDis: 1,
        // minimum distance
        autoFlip: true
      };
      function State(env, prog) {
        this.env = env;
        this.stack = [];
        this.prog = prog;
        switch (env) {
          case "glyf":
            this.zp0 = this.zp1 = this.zp2 = 1;
            this.rp0 = this.rp1 = this.rp2 = 0;
          /* fall through */
          case "prep":
            this.fv = this.pv = this.dpv = xUnitVector;
            this.round = roundToGrid;
        }
      }
      Hinting.prototype.exec = function(glyph, ppem) {
        if (typeof ppem !== "number") {
          throw new Error("Point size is not a number!");
        }
        if (this._errorState > 2) return;
        const font = this.font;
        let prepState = this._prepState;
        if (!prepState || prepState.ppem !== ppem) {
          let fpgmState = this._fpgmState;
          if (!fpgmState) {
            State.prototype = defaultState;
            fpgmState = this._fpgmState = new State("fpgm", font.tables.fpgm);
            fpgmState.funcs = [];
            fpgmState.font = font;
            fpgmState.instructionCount = 0;
            fpgmState.callDepth = 0;
            if (false) {
              console.log("---EXEC FPGM---");
              fpgmState.step = -1;
            }
            try {
              exec(fpgmState);
            } catch (e) {
              console.log("Hinting error in FPGM:" + e);
              this._errorState = 3;
              return;
            }
          }
          State.prototype = fpgmState;
          prepState = this._prepState = new State("prep", font.tables.prep);
          prepState.ppem = ppem;
          prepState.instructionCount = 0;
          prepState.callDepth = 0;
          const oCvt = font.variation && font.variation.process.getCvarTransform() || font.tables.cvt;
          if (oCvt) {
            const cvt = prepState.cvt = new Array(oCvt.length);
            const scale = ppem / font.unitsPerEm;
            for (let c = 0; c < oCvt.length; c++) {
              cvt[c] = oCvt[c] * scale;
            }
          } else {
            prepState.cvt = [];
          }
          if (false) {
            console.log("---EXEC PREP---");
            prepState.step = -1;
          }
          try {
            exec(prepState);
          } catch (e) {
            if (this._errorState < 2) {
              console.log("Hinting error in PREP:" + e);
            }
            this._errorState = 2;
          }
        }
        if (this._errorState > 1) return;
        try {
          return execGlyph(glyph, prepState);
        } catch (e) {
          if (this._errorState < 1) {
            console.log("Hinting error:" + e);
            console.log("Note: further hinting errors are silenced");
          }
          this._errorState = 1;
          return void 0;
        }
      };
      execGlyph = function(glyph, prepState) {
        const xScale = prepState.ppem / prepState.font.unitsPerEm;
        const yScale = xScale;
        let components = glyph.components;
        let contours;
        let gZone;
        let state;
        State.prototype = prepState;
        if (!components) {
          state = new State("glyf", glyph.instructions);
          state.instructionCount = 0;
          state.callDepth = 0;
          if (false) {
            console.log("---EXEC GLYPH---");
            state.step = -1;
          }
          execComponent(glyph, state, xScale, yScale);
          gZone = state.gZone;
        } else {
          const font = prepState.font;
          gZone = [];
          contours = [];
          for (let i = 0; i < components.length; i++) {
            const c = components[i];
            const cg = font.glyphs.get(c.glyphIndex);
            state = new State("glyf", cg.instructions);
            state.instructionCount = 0;
            state.callDepth = 0;
            if (false) {
              console.log("---EXEC COMP " + i + "---");
              state.step = -1;
            }
            execComponent(cg, state, xScale, yScale);
            const dx = Math.round(c.dx * xScale);
            const dy = Math.round(c.dy * yScale);
            const gz = state.gZone;
            const cc = state.contours;
            for (let pi = 0; pi < gz.length; pi++) {
              const p = gz[pi];
              p.xTouched = p.yTouched = false;
              p.xo = p.x = p.x + dx;
              p.yo = p.y = p.y + dy;
            }
            const gLen = gZone.length;
            gZone.push.apply(gZone, gz);
            for (let j = 0; j < cc.length; j++) {
              contours.push(cc[j] + gLen);
            }
          }
          if (glyph.instructions && !state.inhibitGridFit) {
            state = new State("glyf", glyph.instructions);
            state.gZone = state.z0 = state.z1 = state.z2 = gZone;
            state.contours = contours;
            gZone.push(
              new HPoint(0, 0),
              new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
            );
            if (false) {
              console.log("---EXEC COMPOSITE---");
              state.step = -1;
            }
            exec(state);
            gZone.length -= 2;
          }
        }
        return gZone;
      };
      execComponent = function(glyph, state, xScale, yScale) {
        const points = glyph.points || [];
        const pLen = points.length;
        const gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
        const contours = state.contours = [];
        let cp;
        for (let i = 0; i < pLen; i++) {
          cp = points[i];
          gZone[i] = new HPoint(
            cp.x * xScale,
            cp.y * yScale,
            cp.lastPointOfContour,
            cp.onCurve
          );
        }
        let sp;
        let np;
        for (let i = 0; i < pLen; i++) {
          cp = gZone[i];
          if (!sp) {
            sp = cp;
            contours.push(i);
          }
          if (cp.lastPointOfContour) {
            cp.nextPointOnContour = sp;
            sp.prevPointOnContour = cp;
            sp = void 0;
          } else {
            np = gZone[i + 1];
            cp.nextPointOnContour = np;
            np.prevPointOnContour = cp;
          }
        }
        if (state.inhibitGridFit) return;
        if (false) {
          console.log("PROCESSING GLYPH", state.stack);
          for (let i = 0; i < pLen; i++) {
            console.log(i, gZone[i].x, gZone[i].y);
          }
        }
        gZone.push(
          new HPoint(0, 0),
          new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
        );
        exec(state);
        gZone.length -= 2;
        if (false) {
          console.log("FINISHED GLYPH", state.stack);
          for (let i = 0; i < pLen; i++) {
            console.log(i, gZone[i].x, gZone[i].y);
          }
        }
      };
      exec = function(state) {
        let prog = state.prog;
        if (!prog) return;
        const pLen = prog.length;
        let ins;
        for (state.ip = 0; state.ip < pLen; state.ip++) {
          if (++state.instructionCount > MAX_INSTRUCTIONS) {
            throw new Error(
              "Hinting instructions exceeded maximum of " + MAX_INSTRUCTIONS
            );
          }
          if (false) state.step++;
          ins = instructionTable[prog[state.ip]];
          if (!ins) {
            throw new Error(
              "unknown instruction: 0x" + Number(prog[state.ip]).toString(16)
            );
          }
          ins(state);
        }
      };
      function initTZone(state) {
        const tZone = state.tZone = new Array(state.gZone.length);
        for (let i = 0; i < tZone.length; i++) {
          tZone[i] = new HPoint(0, 0);
        }
      }
      function skip(state, handleElse) {
        const prog = state.prog;
        let ip = state.ip;
        let nesting = 1;
        let ins;
        do {
          ins = prog[++ip];
          if (ins === 88)
            nesting++;
          else if (ins === 89)
            nesting--;
          else if (ins === 64)
            ip += prog[ip + 1] + 1;
          else if (ins === 65)
            ip += 2 * prog[ip + 1] + 1;
          else if (ins >= 176 && ins <= 183)
            ip += ins - 176 + 1;
          else if (ins >= 184 && ins <= 191)
            ip += (ins - 184 + 1) * 2;
          else if (handleElse && nesting === 1 && ins === 27)
            break;
        } while (nesting > 0);
        state.ip = ip;
      }
      function SVTCA(v, state) {
        if (false) console.log(state.step, "SVTCA[" + v.axis + "]");
        state.fv = state.pv = state.dpv = v;
      }
      function SPVTCA(v, state) {
        if (false) console.log(state.step, "SPVTCA[" + v.axis + "]");
        state.pv = state.dpv = v;
      }
      function SFVTCA(v, state) {
        if (false) console.log(state.step, "SFVTCA[" + v.axis + "]");
        state.fv = v;
      }
      function SPVTL(a, state) {
        const stack = state.stack;
        const p2i = stack.pop();
        const p1i = stack.pop();
        const p2 = state.z2[p2i];
        const p1 = state.z1[p1i];
        if (false) console.log("SPVTL[" + a + "]", p2i, p1i);
        let dx;
        let dy;
        if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
        } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
        }
        state.pv = state.dpv = getUnitVector(dx, dy);
      }
      function SFVTL(a, state) {
        const stack = state.stack;
        const p2i = stack.pop();
        const p1i = stack.pop();
        const p2 = state.z2[p2i];
        const p1 = state.z1[p1i];
        if (false) console.log("SFVTL[" + a + "]", p2i, p1i);
        let dx;
        let dy;
        if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
        } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
        }
        state.fv = getUnitVector(dx, dy);
      }
      function SPVFS(state) {
        const stack = state.stack;
        const y = stack.pop();
        const x = stack.pop();
        if (false) console.log(state.step, "SPVFS[]", y, x);
        state.pv = state.dpv = getUnitVector(x, y);
      }
      function SFVFS(state) {
        const stack = state.stack;
        const y = stack.pop();
        const x = stack.pop();
        if (false) console.log(state.step, "SPVFS[]", y, x);
        state.fv = getUnitVector(x, y);
      }
      function GPV(state) {
        const stack = state.stack;
        const pv = state.pv;
        if (false) console.log(state.step, "GPV[]");
        stack.push(pv.x * 16384);
        stack.push(pv.y * 16384);
      }
      function GFV(state) {
        const stack = state.stack;
        const fv = state.fv;
        if (false) console.log(state.step, "GFV[]");
        stack.push(fv.x * 16384);
        stack.push(fv.y * 16384);
      }
      function SFVTPV(state) {
        state.fv = state.pv;
        if (false) console.log(state.step, "SFVTPV[]");
      }
      function ISECT(state) {
        const stack = state.stack;
        const pa0i = stack.pop();
        const pa1i = stack.pop();
        const pb0i = stack.pop();
        const pb1i = stack.pop();
        const pi = stack.pop();
        const z0 = state.z0;
        const z1 = state.z1;
        const pa0 = z0[pa0i];
        const pa1 = z0[pa1i];
        const pb0 = z1[pb0i];
        const pb1 = z1[pb1i];
        const p = state.z2[pi];
        if (false) console.log("ISECT[], ", pa0i, pa1i, pb0i, pb1i, pi);
        const x1 = pa0.x;
        const y1 = pa0.y;
        const x2 = pa1.x;
        const y2 = pa1.y;
        const x3 = pb0.x;
        const y3 = pb0.y;
        const x4 = pb1.x;
        const y4 = pb1.y;
        const div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        const f1 = x1 * y2 - y1 * x2;
        const f2 = x3 * y4 - y3 * x4;
        p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
        p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
      }
      function SRP0(state) {
        state.rp0 = state.stack.pop();
        if (false) console.log(state.step, "SRP0[]", state.rp0);
      }
      function SRP1(state) {
        state.rp1 = state.stack.pop();
        if (false) console.log(state.step, "SRP1[]", state.rp1);
      }
      function SRP2(state) {
        state.rp2 = state.stack.pop();
        if (false) console.log(state.step, "SRP2[]", state.rp2);
      }
      function SZP0(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SZP0[]", n);
        state.zp0 = n;
        switch (n) {
          case 0:
            if (!state.tZone) initTZone(state);
            state.z0 = state.tZone;
            break;
          case 1:
            state.z0 = state.gZone;
            break;
          default:
            throw new Error("Invalid zone pointer");
        }
      }
      function SZP1(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SZP1[]", n);
        state.zp1 = n;
        switch (n) {
          case 0:
            if (!state.tZone) initTZone(state);
            state.z1 = state.tZone;
            break;
          case 1:
            state.z1 = state.gZone;
            break;
          default:
            throw new Error("Invalid zone pointer");
        }
      }
      function SZP2(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SZP2[]", n);
        state.zp2 = n;
        switch (n) {
          case 0:
            if (!state.tZone) initTZone(state);
            state.z2 = state.tZone;
            break;
          case 1:
            state.z2 = state.gZone;
            break;
          default:
            throw new Error("Invalid zone pointer");
        }
      }
      function SZPS(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SZPS[]", n);
        state.zp0 = state.zp1 = state.zp2 = n;
        switch (n) {
          case 0:
            if (!state.tZone) initTZone(state);
            state.z0 = state.z1 = state.z2 = state.tZone;
            break;
          case 1:
            state.z0 = state.z1 = state.z2 = state.gZone;
            break;
          default:
            throw new Error("Invalid zone pointer");
        }
      }
      function SLOOP(state) {
        state.loop = state.stack.pop();
        if (state.loop > MAX_LOOP_COUNT) {
          state.loop = MAX_LOOP_COUNT;
        }
        if (false) console.log(state.step, "SLOOP[]", state.loop);
      }
      function RTG(state) {
        if (false) console.log(state.step, "RTG[]");
        state.round = roundToGrid;
      }
      function RTHG(state) {
        if (false) console.log(state.step, "RTHG[]");
        state.round = roundToHalfGrid;
      }
      function SMD(state) {
        const d = state.stack.pop();
        if (false) console.log(state.step, "SMD[]", d);
        state.minDis = d / 64;
      }
      function ELSE(state) {
        if (false) console.log(state.step, "ELSE[]");
        skip(state, false);
      }
      function JMPR(state) {
        const o = state.stack.pop();
        if (false) console.log(state.step, "JMPR[]", o);
        state.ip += o - 1;
      }
      function SCVTCI(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SCVTCI[]", n);
        state.cvCutIn = n / 64;
      }
      function DUP(state) {
        const stack = state.stack;
        if (false) console.log(state.step, "DUP[]");
        stack.push(stack[stack.length - 1]);
      }
      function POP(state) {
        if (false) console.log(state.step, "POP[]");
        state.stack.pop();
      }
      function CLEAR(state) {
        if (false) console.log(state.step, "CLEAR[]");
        state.stack.length = 0;
      }
      function SWAP(state) {
        const stack = state.stack;
        const a = stack.pop();
        const b = stack.pop();
        if (false) console.log(state.step, "SWAP[]");
        stack.push(a);
        stack.push(b);
      }
      function DEPTH(state) {
        const stack = state.stack;
        if (false) console.log(state.step, "DEPTH[]");
        stack.push(stack.length);
      }
      function LOOPCALL(state) {
        const stack = state.stack;
        const fn = stack.pop();
        let c = stack.pop();
        if (c > MAX_LOOP_COUNT) c = MAX_LOOP_COUNT;
        if (false) console.log(state.step, "LOOPCALL[]", fn, c);
        if (++state.callDepth > MAX_CALL_DEPTH2) {
          throw new Error("Hinting call depth exceeded maximum of " + MAX_CALL_DEPTH2);
        }
        const cip = state.ip;
        const cprog = state.prog;
        state.prog = state.funcs[fn];
        for (let i = 0; i < c; i++) {
          exec(state);
          if (false) console.log(
            ++state.step,
            i + 1 < c ? "next loopcall" : "done loopcall",
            i
          );
        }
        state.ip = cip;
        state.prog = cprog;
        state.callDepth--;
      }
      function CALL(state) {
        const fn = state.stack.pop();
        if (false) console.log(state.step, "CALL[]", fn);
        if (++state.callDepth > MAX_CALL_DEPTH2) {
          throw new Error("Hinting call depth exceeded maximum of " + MAX_CALL_DEPTH2);
        }
        const cip = state.ip;
        const cprog = state.prog;
        state.prog = state.funcs[fn];
        exec(state);
        state.ip = cip;
        state.prog = cprog;
        state.callDepth--;
        if (false) console.log(++state.step, "returning from", fn);
      }
      function CINDEX(state) {
        const stack = state.stack;
        const k = stack.pop();
        if (false) console.log(state.step, "CINDEX[]", k);
        stack.push(stack[stack.length - k]);
      }
      function MINDEX(state) {
        const stack = state.stack;
        const k = stack.pop();
        if (false) console.log(state.step, "MINDEX[]", k);
        stack.push(stack.splice(stack.length - k, 1)[0]);
      }
      function FDEF(state) {
        if (state.env !== "fpgm") throw new Error("FDEF not allowed here");
        const stack = state.stack;
        const prog = state.prog;
        let ip = state.ip;
        const fn = stack.pop();
        const ipBegin = ip;
        if (false) console.log(state.step, "FDEF[]", fn);
        while (prog[++ip] !== 45) ;
        state.ip = ip;
        state.funcs[fn] = prog.slice(ipBegin + 1, ip);
      }
      function MDAP(round, state) {
        const pi = state.stack.pop();
        const p = state.z0[pi];
        const fv = state.fv;
        const pv = state.pv;
        if (false) console.log(state.step, "MDAP[" + round + "]", pi);
        let d = pv.distance(p, HPZero);
        if (round) d = state.round(d);
        fv.setRelative(p, HPZero, d, pv);
        fv.touch(p);
        state.rp0 = state.rp1 = pi;
      }
      function IUP(v, state) {
        const z2 = state.z2;
        const pLen = z2.length - 2;
        let cp;
        let pp;
        let np;
        if (false) console.log(state.step, "IUP[" + v.axis + "]");
        for (let i = 0; i < pLen; i++) {
          cp = z2[i];
          if (v.touched(cp)) continue;
          pp = cp.prevTouched(v);
          if (pp === cp) continue;
          np = cp.nextTouched(v);
          if (pp === np) {
            v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
          }
          v.interpolate(cp, pp, np, v);
        }
      }
      function SHP(a, state) {
        const stack = state.stack;
        const rpi = a ? state.rp1 : state.rp2;
        const rp = (a ? state.z0 : state.z1)[rpi];
        const fv = state.fv;
        const pv = state.pv;
        let loop = state.loop;
        const z2 = state.z2;
        while (loop--) {
          const pi = stack.pop();
          const p = z2[pi];
          const d = pv.distance(rp, rp, false, true);
          fv.setRelative(p, p, d, pv);
          fv.touch(p);
          if (false) {
            console.log(
              state.step,
              (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHP[" + (a ? "rp1" : "rp2") + "]",
              pi
            );
          }
        }
        state.loop = 1;
      }
      function SHC(a, state) {
        const stack = state.stack;
        const rpi = a ? state.rp1 : state.rp2;
        const rp = (a ? state.z0 : state.z1)[rpi];
        const fv = state.fv;
        const pv = state.pv;
        const ci = stack.pop();
        const sp = state.z2[state.contours[ci]];
        let p = sp;
        if (false) console.log(state.step, "SHC[" + a + "]", ci);
        const d = pv.distance(rp, rp, false, true);
        do {
          if (p !== rp) fv.setRelative(p, p, d, pv);
          p = p.nextPointOnContour;
        } while (p !== sp);
      }
      function SHZ(a, state) {
        const stack = state.stack;
        const rpi = a ? state.rp1 : state.rp2;
        const rp = (a ? state.z0 : state.z1)[rpi];
        const fv = state.fv;
        const pv = state.pv;
        const e = stack.pop();
        if (false) console.log(state.step, "SHZ[" + a + "]", e);
        let z;
        switch (e) {
          case 0:
            z = state.tZone;
            break;
          case 1:
            z = state.gZone;
            break;
          default:
            throw new Error("Invalid zone");
        }
        let p;
        const d = pv.distance(rp, rp, false, true);
        const pLen = z.length - 2;
        for (let i = 0; i < pLen; i++) {
          p = z[i];
          fv.setRelative(p, p, d, pv);
        }
      }
      function SHPIX(state) {
        const stack = state.stack;
        let loop = state.loop;
        const fv = state.fv;
        const d = stack.pop() / 64;
        const z2 = state.z2;
        while (loop--) {
          const pi = stack.pop();
          const p = z2[pi];
          if (false) {
            console.log(
              state.step,
              (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHPIX[]",
              pi,
              d
            );
          }
          fv.setRelative(p, p, d);
          fv.touch(p);
        }
        state.loop = 1;
      }
      function IP(state) {
        const stack = state.stack;
        const rp1i = state.rp1;
        const rp2i = state.rp2;
        let loop = state.loop;
        const rp1 = state.z0[rp1i];
        const rp2 = state.z1[rp2i];
        const fv = state.fv;
        const pv = state.dpv;
        const z2 = state.z2;
        while (loop--) {
          const pi = stack.pop();
          const p = z2[pi];
          if (false) {
            console.log(
              state.step,
              (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "IP[]",
              pi,
              rp1i,
              "<->",
              rp2i
            );
          }
          fv.interpolate(p, rp1, rp2, pv);
          fv.touch(p);
        }
        state.loop = 1;
      }
      function MSIRP(a, state) {
        const stack = state.stack;
        const d = stack.pop() / 64;
        const pi = stack.pop();
        const p = state.z1[pi];
        const rp0 = state.z0[state.rp0];
        const fv = state.fv;
        const pv = state.pv;
        fv.setRelative(p, rp0, d, pv);
        fv.touch(p);
        if (false) console.log(state.step, "MSIRP[" + a + "]", d, pi);
        state.rp1 = state.rp0;
        state.rp2 = pi;
        if (a) state.rp0 = pi;
      }
      function ALIGNRP(state) {
        const stack = state.stack;
        const rp0i = state.rp0;
        const rp0 = state.z0[rp0i];
        let loop = state.loop;
        const fv = state.fv;
        const pv = state.pv;
        const z1 = state.z1;
        while (loop--) {
          const pi = stack.pop();
          const p = z1[pi];
          if (false) {
            console.log(
              state.step,
              (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "ALIGNRP[]",
              pi
            );
          }
          fv.setRelative(p, rp0, 0, pv);
          fv.touch(p);
        }
        state.loop = 1;
      }
      function RTDG(state) {
        if (false) console.log(state.step, "RTDG[]");
        state.round = roundToDoubleGrid;
      }
      function MIAP(round, state) {
        const stack = state.stack;
        const n = stack.pop();
        const pi = stack.pop();
        const p = state.z0[pi];
        const fv = state.fv;
        const pv = state.pv;
        let cv = state.cvt[n];
        if (false) {
          console.log(
            state.step,
            "MIAP[" + round + "]",
            n,
            "(",
            cv,
            ")",
            pi
          );
        }
        let d = pv.distance(p, HPZero);
        if (round) {
          if (Math.abs(d - cv) < state.cvCutIn) d = cv;
          d = state.round(d);
        }
        fv.setRelative(p, HPZero, d, pv);
        if (state.zp0 === 0) {
          p.xo = p.x;
          p.yo = p.y;
        }
        fv.touch(p);
        state.rp0 = state.rp1 = pi;
      }
      function NPUSHB(state) {
        const prog = state.prog;
        let ip = state.ip;
        const stack = state.stack;
        const n = prog[++ip];
        if (false) console.log(state.step, "NPUSHB[]", n);
        for (let i = 0; i < n; i++) stack.push(prog[++ip]);
        state.ip = ip;
      }
      function NPUSHW(state) {
        let ip = state.ip;
        const prog = state.prog;
        const stack = state.stack;
        const n = prog[++ip];
        if (false) console.log(state.step, "NPUSHW[]", n);
        for (let i = 0; i < n; i++) {
          let w = prog[++ip] << 8 | prog[++ip];
          if (w & 32768) w = -((w ^ 65535) + 1);
          stack.push(w);
        }
        state.ip = ip;
      }
      function WS(state) {
        const stack = state.stack;
        let store = state.store;
        if (!store) store = state.store = [];
        const v = stack.pop();
        const l = stack.pop();
        if (false) console.log(state.step, "WS", v, l);
        store[l] = v;
      }
      function RS(state) {
        const stack = state.stack;
        const store = state.store;
        const l = stack.pop();
        if (false) console.log(state.step, "RS", l);
        const v = store && store[l] || 0;
        stack.push(v);
      }
      function WCVTP(state) {
        const stack = state.stack;
        const v = stack.pop();
        const l = stack.pop();
        if (false) console.log(state.step, "WCVTP", v, l);
        state.cvt[l] = v / 64;
      }
      function RCVT(state) {
        const stack = state.stack;
        const cvte = stack.pop();
        if (false) console.log(state.step, "RCVT", cvte);
        stack.push(state.cvt[cvte] * 64);
      }
      function GC(a, state) {
        const stack = state.stack;
        const pi = stack.pop();
        const p = state.z2[pi];
        if (false) console.log(state.step, "GC[" + a + "]", pi);
        stack.push(state.dpv.distance(p, HPZero, a, false) * 64);
      }
      function MD(a, state) {
        const stack = state.stack;
        const pi2 = stack.pop();
        const pi1 = stack.pop();
        const p2 = state.z1[pi2];
        const p1 = state.z0[pi1];
        const d = state.dpv.distance(p1, p2, a, a);
        if (false) console.log(state.step, "MD[" + a + "]", pi2, pi1, "->", d);
        state.stack.push(Math.round(d * 64));
      }
      function MPPEM(state) {
        if (false) console.log(state.step, "MPPEM[]");
        state.stack.push(state.ppem);
      }
      function FLIPON(state) {
        if (false) console.log(state.step, "FLIPON[]");
        state.autoFlip = true;
      }
      function LT(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "LT[]", e2, e1);
        stack.push(e1 < e2 ? 1 : 0);
      }
      function LTEQ(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "LTEQ[]", e2, e1);
        stack.push(e1 <= e2 ? 1 : 0);
      }
      function GT(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "GT[]", e2, e1);
        stack.push(e1 > e2 ? 1 : 0);
      }
      function GTEQ(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "GTEQ[]", e2, e1);
        stack.push(e1 >= e2 ? 1 : 0);
      }
      function EQ(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "EQ[]", e2, e1);
        stack.push(e2 === e1 ? 1 : 0);
      }
      function NEQ(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "NEQ[]", e2, e1);
        stack.push(e2 !== e1 ? 1 : 0);
      }
      function ODD(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "ODD[]", n);
        stack.push(Math.trunc(n) & 1 ? 1 : 0);
      }
      function EVEN(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "EVEN[]", n);
        stack.push(Math.trunc(n) & 1 ? 0 : 1);
      }
      function IF(state) {
        let test = state.stack.pop();
        let ins;
        if (false) console.log(state.step, "IF[]", test);
        if (!test) {
          skip(state, true);
          if (false) console.log(state.step, ins === 27 ? "ELSE[]" : "EIF[]");
        }
      }
      function EIF(state) {
        if (false) console.log(state.step, "EIF[]");
      }
      function AND(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "AND[]", e2, e1);
        stack.push(e2 && e1 ? 1 : 0);
      }
      function OR(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "OR[]", e2, e1);
        stack.push(e2 || e1 ? 1 : 0);
      }
      function NOT(state) {
        const stack = state.stack;
        const e = stack.pop();
        if (false) console.log(state.step, "NOT[]", e);
        stack.push(e ? 0 : 1);
      }
      function DELTAP123(b, state) {
        const stack = state.stack;
        const n = stack.pop();
        const fv = state.fv;
        const pv = state.pv;
        const ppem = state.ppem;
        const base = state.deltaBase + (b - 1) * 16;
        const ds = state.deltaShift;
        const z0 = state.z0;
        if (false) console.log(state.step, "DELTAP[" + b + "]", n, stack);
        for (let i = 0; i < n; i++) {
          const pi = stack.pop();
          const arg = stack.pop();
          const appem = base + ((arg & 240) >> 4);
          if (appem !== ppem) continue;
          let mag = (arg & 15) - 8;
          if (mag >= 0) mag++;
          if (false) console.log(state.step, "DELTAPFIX", pi, "by", mag * ds);
          const p = z0[pi];
          fv.setRelative(p, p, mag * ds, pv);
        }
      }
      function SDB(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "SDB[]", n);
        state.deltaBase = n;
      }
      function SDS(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "SDS[]", n);
        state.deltaShift = Math.pow(0.5, n);
      }
      function ADD(state) {
        const stack = state.stack;
        const n2 = stack.pop();
        const n1 = stack.pop();
        if (false) console.log(state.step, "ADD[]", n2, n1);
        stack.push(n1 + n2);
      }
      function SUB(state) {
        const stack = state.stack;
        const n2 = stack.pop();
        const n1 = stack.pop();
        if (false) console.log(state.step, "SUB[]", n2, n1);
        stack.push(n1 - n2);
      }
      function DIV(state) {
        const stack = state.stack;
        const n2 = stack.pop();
        const n1 = stack.pop();
        if (false) console.log(state.step, "DIV[]", n2, n1);
        stack.push(n1 * 64 / n2);
      }
      function MUL(state) {
        const stack = state.stack;
        const n2 = stack.pop();
        const n1 = stack.pop();
        if (false) console.log(state.step, "MUL[]", n2, n1);
        stack.push(n1 * n2 / 64);
      }
      function ABS(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "ABS[]", n);
        stack.push(Math.abs(n));
      }
      function NEG(state) {
        const stack = state.stack;
        let n = stack.pop();
        if (false) console.log(state.step, "NEG[]", n);
        stack.push(-n);
      }
      function FLOOR(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "FLOOR[]", n);
        stack.push(Math.floor(n / 64) * 64);
      }
      function CEILING(state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "CEILING[]", n);
        stack.push(Math.ceil(n / 64) * 64);
      }
      function ROUND(dt, state) {
        const stack = state.stack;
        const n = stack.pop();
        if (false) console.log(state.step, "ROUND[]");
        stack.push(state.round(n / 64) * 64);
      }
      function WCVTF(state) {
        const stack = state.stack;
        const v = stack.pop();
        const l = stack.pop();
        if (false) console.log(state.step, "WCVTF[]", v, l);
        state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
      }
      function DELTAC123(b, state) {
        const stack = state.stack;
        const n = stack.pop();
        const ppem = state.ppem;
        const base = state.deltaBase + (b - 1) * 16;
        const ds = state.deltaShift;
        if (false) console.log(state.step, "DELTAC[" + b + "]", n, stack);
        for (let i = 0; i < n; i++) {
          const c = stack.pop();
          const arg = stack.pop();
          const appem = base + ((arg & 240) >> 4);
          if (appem !== ppem) continue;
          let mag = (arg & 15) - 8;
          if (mag >= 0) mag++;
          const delta = mag * ds;
          if (false) console.log(state.step, "DELTACFIX", c, "by", delta);
          state.cvt[c] += delta;
        }
      }
      function SROUND(state) {
        let n = state.stack.pop();
        if (false) console.log(state.step, "SROUND[]", n);
        state.round = roundSuper;
        let period;
        switch (n & 192) {
          case 0:
            period = 0.5;
            break;
          case 64:
            period = 1;
            break;
          case 128:
            period = 2;
            break;
          default:
            throw new Error("invalid SROUND value");
        }
        state.srPeriod = period;
        switch (n & 48) {
          case 0:
            state.srPhase = 0;
            break;
          case 16:
            state.srPhase = 0.25 * period;
            break;
          case 32:
            state.srPhase = 0.5 * period;
            break;
          case 48:
            state.srPhase = 0.75 * period;
            break;
          default:
            throw new Error("invalid SROUND value");
        }
        n &= 15;
        if (n === 0) state.srThreshold = 0;
        else state.srThreshold = (n / 8 - 0.5) * period;
      }
      function S45ROUND(state) {
        let n = state.stack.pop();
        if (false) console.log(state.step, "S45ROUND[]", n);
        state.round = roundSuper;
        let period;
        switch (n & 192) {
          case 0:
            period = Math.sqrt(2) / 2;
            break;
          case 64:
            period = Math.sqrt(2);
            break;
          case 128:
            period = 2 * Math.sqrt(2);
            break;
          default:
            throw new Error("invalid S45ROUND value");
        }
        state.srPeriod = period;
        switch (n & 48) {
          case 0:
            state.srPhase = 0;
            break;
          case 16:
            state.srPhase = 0.25 * period;
            break;
          case 32:
            state.srPhase = 0.5 * period;
            break;
          case 48:
            state.srPhase = 0.75 * period;
            break;
          default:
            throw new Error("invalid S45ROUND value");
        }
        n &= 15;
        if (n === 0) state.srThreshold = 0;
        else state.srThreshold = (n / 8 - 0.5) * period;
      }
      function ROFF(state) {
        if (false) console.log(state.step, "ROFF[]");
        state.round = roundOff;
      }
      function RUTG(state) {
        if (false) console.log(state.step, "RUTG[]");
        state.round = roundUpToGrid;
      }
      function RDTG(state) {
        if (false) console.log(state.step, "RDTG[]");
        state.round = roundDownToGrid;
      }
      function SCANCTRL(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SCANCTRL[]", n);
      }
      function SDPVTL(a, state) {
        const stack = state.stack;
        const p2i = stack.pop();
        const p1i = stack.pop();
        const p2 = state.z2[p2i];
        const p1 = state.z1[p1i];
        if (false) console.log(state.step, "SDPVTL[" + a + "]", p2i, p1i);
        let dx;
        let dy;
        if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
        } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
        }
        state.dpv = getUnitVector(dx, dy);
      }
      function GETINFO(state) {
        const stack = state.stack;
        const sel = stack.pop();
        let r = 0;
        if (false) console.log(state.step, "GETINFO[]", sel);
        if (sel & 1) r = 35;
        if (sel & 32) r |= 4096;
        stack.push(r);
      }
      function ROLL(state) {
        const stack = state.stack;
        const a = stack.pop();
        const b = stack.pop();
        const c = stack.pop();
        if (false) console.log(state.step, "ROLL[]");
        stack.push(b);
        stack.push(a);
        stack.push(c);
      }
      function MAX(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "MAX[]", e2, e1);
        stack.push(Math.max(e1, e2));
      }
      function MIN(state) {
        const stack = state.stack;
        const e2 = stack.pop();
        const e1 = stack.pop();
        if (false) console.log(state.step, "MIN[]", e2, e1);
        stack.push(Math.min(e1, e2));
      }
      function SCANTYPE(state) {
        const n = state.stack.pop();
        if (false) console.log(state.step, "SCANTYPE[]", n);
      }
      function INSTCTRL(state) {
        const s = state.stack.pop();
        let v = state.stack.pop();
        if (false) console.log(state.step, "INSTCTRL[]", s, v);
        switch (s) {
          case 1:
            state.inhibitGridFit = !!v;
            return;
          case 2:
            state.ignoreCvt = !!v;
            return;
          default:
            throw new Error("invalid INSTCTRL[] selector");
        }
      }
      function PUSHB(n, state) {
        const stack = state.stack;
        const prog = state.prog;
        let ip = state.ip;
        if (false) console.log(state.step, "PUSHB[" + n + "]");
        for (let i = 0; i < n; i++) stack.push(prog[++ip]);
        state.ip = ip;
      }
      function PUSHW(n, state) {
        let ip = state.ip;
        const prog = state.prog;
        const stack = state.stack;
        if (false) console.log(state.ip, "PUSHW[" + n + "]");
        for (let i = 0; i < n; i++) {
          let w = prog[++ip] << 8 | prog[++ip];
          if (w & 32768) w = -((w ^ 65535) + 1);
          stack.push(w);
        }
        state.ip = ip;
      }
      function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
        const stack = state.stack;
        const cvte = indirect && stack.pop();
        const pi = stack.pop();
        const rp0i = state.rp0;
        const rp = state.z0[rp0i];
        const p = state.z1[pi];
        const md = state.minDis;
        const fv = state.fv;
        const pv = state.dpv;
        let od;
        let d;
        let sign;
        let cv;
        d = od = pv.distance(p, rp, true, true);
        sign = d >= 0 ? 1 : -1;
        d = Math.abs(d);
        if (indirect) {
          cv = state.cvt[cvte];
          if (ro && Math.abs(d - cv) < state.cvCutIn) d = cv;
        }
        if (keepD && d < md) d = md;
        if (ro) d = state.round(d);
        fv.setRelative(p, rp, sign * d, pv);
        fv.touch(p);
        if (false) {
          console.log(
            state.step,
            (indirect ? "MIRP[" : "MDRP[") + (setRp0 ? "M" : "m") + (keepD ? ">" : "_") + (ro ? "R" : "_") + (dt === 0 ? "Gr" : dt === 1 ? "Bl" : dt === 2 ? "Wh" : "") + "]",
            indirect ? cvte + "(" + state.cvt[cvte] + "," + cv + ")" : "",
            pi,
            "(d =",
            od,
            "->",
            sign * d,
            ")"
          );
        }
        state.rp1 = state.rp0;
        state.rp2 = pi;
        if (setRp0) state.rp0 = pi;
      }
      instructionTable = [
        /* 0x00 */
        SVTCA.bind(void 0, yUnitVector),
        /* 0x01 */
        SVTCA.bind(void 0, xUnitVector),
        /* 0x02 */
        SPVTCA.bind(void 0, yUnitVector),
        /* 0x03 */
        SPVTCA.bind(void 0, xUnitVector),
        /* 0x04 */
        SFVTCA.bind(void 0, yUnitVector),
        /* 0x05 */
        SFVTCA.bind(void 0, xUnitVector),
        /* 0x06 */
        SPVTL.bind(void 0, 0),
        /* 0x07 */
        SPVTL.bind(void 0, 1),
        /* 0x08 */
        SFVTL.bind(void 0, 0),
        /* 0x09 */
        SFVTL.bind(void 0, 1),
        /* 0x0A */
        SPVFS,
        /* 0x0B */
        SFVFS,
        /* 0x0C */
        GPV,
        /* 0x0D */
        GFV,
        /* 0x0E */
        SFVTPV,
        /* 0x0F */
        ISECT,
        /* 0x10 */
        SRP0,
        /* 0x11 */
        SRP1,
        /* 0x12 */
        SRP2,
        /* 0x13 */
        SZP0,
        /* 0x14 */
        SZP1,
        /* 0x15 */
        SZP2,
        /* 0x16 */
        SZPS,
        /* 0x17 */
        SLOOP,
        /* 0x18 */
        RTG,
        /* 0x19 */
        RTHG,
        /* 0x1A */
        SMD,
        /* 0x1B */
        ELSE,
        /* 0x1C */
        JMPR,
        /* 0x1D */
        SCVTCI,
        /* 0x1E */
        void 0,
        // TODO SSWCI
        /* 0x1F */
        void 0,
        // TODO SSW
        /* 0x20 */
        DUP,
        /* 0x21 */
        POP,
        /* 0x22 */
        CLEAR,
        /* 0x23 */
        SWAP,
        /* 0x24 */
        DEPTH,
        /* 0x25 */
        CINDEX,
        /* 0x26 */
        MINDEX,
        /* 0x27 */
        void 0,
        // TODO ALIGNPTS
        /* 0x28 */
        void 0,
        /* 0x29 */
        void 0,
        // TODO UTP
        /* 0x2A */
        LOOPCALL,
        /* 0x2B */
        CALL,
        /* 0x2C */
        FDEF,
        /* 0x2D */
        void 0,
        // ENDF (eaten by FDEF)
        /* 0x2E */
        MDAP.bind(void 0, 0),
        /* 0x2F */
        MDAP.bind(void 0, 1),
        /* 0x30 */
        IUP.bind(void 0, yUnitVector),
        /* 0x31 */
        IUP.bind(void 0, xUnitVector),
        /* 0x32 */
        SHP.bind(void 0, 0),
        /* 0x33 */
        SHP.bind(void 0, 1),
        /* 0x34 */
        SHC.bind(void 0, 0),
        /* 0x35 */
        SHC.bind(void 0, 1),
        /* 0x36 */
        SHZ.bind(void 0, 0),
        /* 0x37 */
        SHZ.bind(void 0, 1),
        /* 0x38 */
        SHPIX,
        /* 0x39 */
        IP,
        /* 0x3A */
        MSIRP.bind(void 0, 0),
        /* 0x3B */
        MSIRP.bind(void 0, 1),
        /* 0x3C */
        ALIGNRP,
        /* 0x3D */
        RTDG,
        /* 0x3E */
        MIAP.bind(void 0, 0),
        /* 0x3F */
        MIAP.bind(void 0, 1),
        /* 0x40 */
        NPUSHB,
        /* 0x41 */
        NPUSHW,
        /* 0x42 */
        WS,
        /* 0x43 */
        RS,
        /* 0x44 */
        WCVTP,
        /* 0x45 */
        RCVT,
        /* 0x46 */
        GC.bind(void 0, 0),
        /* 0x47 */
        GC.bind(void 0, 1),
        /* 0x48 */
        void 0,
        // TODO SCFS
        /* 0x49 */
        MD.bind(void 0, 0),
        /* 0x4A */
        MD.bind(void 0, 1),
        /* 0x4B */
        MPPEM,
        /* 0x4C */
        void 0,
        // TODO MPS
        /* 0x4D */
        FLIPON,
        /* 0x4E */
        void 0,
        // TODO FLIPOFF
        /* 0x4F */
        void 0,
        // TODO DEBUG
        /* 0x50 */
        LT,
        /* 0x51 */
        LTEQ,
        /* 0x52 */
        GT,
        /* 0x53 */
        GTEQ,
        /* 0x54 */
        EQ,
        /* 0x55 */
        NEQ,
        /* 0x56 */
        ODD,
        /* 0x57 */
        EVEN,
        /* 0x58 */
        IF,
        /* 0x59 */
        EIF,
        /* 0x5A */
        AND,
        /* 0x5B */
        OR,
        /* 0x5C */
        NOT,
        /* 0x5D */
        DELTAP123.bind(void 0, 1),
        /* 0x5E */
        SDB,
        /* 0x5F */
        SDS,
        /* 0x60 */
        ADD,
        /* 0x61 */
        SUB,
        /* 0x62 */
        DIV,
        /* 0x63 */
        MUL,
        /* 0x64 */
        ABS,
        /* 0x65 */
        NEG,
        /* 0x66 */
        FLOOR,
        /* 0x67 */
        CEILING,
        /* 0x68 */
        ROUND.bind(void 0, 0),
        /* 0x69 */
        ROUND.bind(void 0, 1),
        /* 0x6A */
        ROUND.bind(void 0, 2),
        /* 0x6B */
        ROUND.bind(void 0, 3),
        /* 0x6C */
        void 0,
        // TODO NROUND[ab]
        /* 0x6D */
        void 0,
        // TODO NROUND[ab]
        /* 0x6E */
        void 0,
        // TODO NROUND[ab]
        /* 0x6F */
        void 0,
        // TODO NROUND[ab]
        /* 0x70 */
        WCVTF,
        /* 0x71 */
        DELTAP123.bind(void 0, 2),
        /* 0x72 */
        DELTAP123.bind(void 0, 3),
        /* 0x73 */
        DELTAC123.bind(void 0, 1),
        /* 0x74 */
        DELTAC123.bind(void 0, 2),
        /* 0x75 */
        DELTAC123.bind(void 0, 3),
        /* 0x76 */
        SROUND,
        /* 0x77 */
        S45ROUND,
        /* 0x78 */
        void 0,
        // TODO JROT[]
        /* 0x79 */
        void 0,
        // TODO JROF[]
        /* 0x7A */
        ROFF,
        /* 0x7B */
        void 0,
        /* 0x7C */
        RUTG,
        /* 0x7D */
        RDTG,
        /* 0x7E */
        POP,
        // actually SANGW, supposed to do only a pop though
        /* 0x7F */
        POP,
        // actually AA, supposed to do only a pop though
        /* 0x80 */
        void 0,
        // TODO FLIPPT
        /* 0x81 */
        void 0,
        // TODO FLIPRGON
        /* 0x82 */
        void 0,
        // TODO FLIPRGOFF
        /* 0x83 */
        void 0,
        /* 0x84 */
        void 0,
        /* 0x85 */
        SCANCTRL,
        /* 0x86 */
        SDPVTL.bind(void 0, 0),
        /* 0x87 */
        SDPVTL.bind(void 0, 1),
        /* 0x88 */
        GETINFO,
        /* 0x89 */
        void 0,
        // TODO IDEF
        /* 0x8A */
        ROLL,
        /* 0x8B */
        MAX,
        /* 0x8C */
        MIN,
        /* 0x8D */
        SCANTYPE,
        /* 0x8E */
        INSTCTRL,
        /* 0x8F */
        void 0,
        /* 0x90 */
        void 0,
        /* 0x91 */
        void 0,
        /* 0x92 */
        void 0,
        /* 0x93 */
        void 0,
        /* 0x94 */
        void 0,
        /* 0x95 */
        void 0,
        /* 0x96 */
        void 0,
        /* 0x97 */
        void 0,
        /* 0x98 */
        void 0,
        /* 0x99 */
        void 0,
        /* 0x9A */
        void 0,
        /* 0x9B */
        void 0,
        /* 0x9C */
        void 0,
        /* 0x9D */
        void 0,
        /* 0x9E */
        void 0,
        /* 0x9F */
        void 0,
        /* 0xA0 */
        void 0,
        /* 0xA1 */
        void 0,
        /* 0xA2 */
        void 0,
        /* 0xA3 */
        void 0,
        /* 0xA4 */
        void 0,
        /* 0xA5 */
        void 0,
        /* 0xA6 */
        void 0,
        /* 0xA7 */
        void 0,
        /* 0xA8 */
        void 0,
        /* 0xA9 */
        void 0,
        /* 0xAA */
        void 0,
        /* 0xAB */
        void 0,
        /* 0xAC */
        void 0,
        /* 0xAD */
        void 0,
        /* 0xAE */
        void 0,
        /* 0xAF */
        void 0,
        /* 0xB0 */
        PUSHB.bind(void 0, 1),
        /* 0xB1 */
        PUSHB.bind(void 0, 2),
        /* 0xB2 */
        PUSHB.bind(void 0, 3),
        /* 0xB3 */
        PUSHB.bind(void 0, 4),
        /* 0xB4 */
        PUSHB.bind(void 0, 5),
        /* 0xB5 */
        PUSHB.bind(void 0, 6),
        /* 0xB6 */
        PUSHB.bind(void 0, 7),
        /* 0xB7 */
        PUSHB.bind(void 0, 8),
        /* 0xB8 */
        PUSHW.bind(void 0, 1),
        /* 0xB9 */
        PUSHW.bind(void 0, 2),
        /* 0xBA */
        PUSHW.bind(void 0, 3),
        /* 0xBB */
        PUSHW.bind(void 0, 4),
        /* 0xBC */
        PUSHW.bind(void 0, 5),
        /* 0xBD */
        PUSHW.bind(void 0, 6),
        /* 0xBE */
        PUSHW.bind(void 0, 7),
        /* 0xBF */
        PUSHW.bind(void 0, 8),
        /* 0xC0 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 0),
        /* 0xC1 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 1),
        /* 0xC2 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 2),
        /* 0xC3 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 3),
        /* 0xC4 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 0),
        /* 0xC5 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 1),
        /* 0xC6 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 2),
        /* 0xC7 */
        MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 3),
        /* 0xC8 */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 0),
        /* 0xC9 */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 1),
        /* 0xCA */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 2),
        /* 0xCB */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 3),
        /* 0xCC */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 0),
        /* 0xCD */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 1),
        /* 0xCE */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 2),
        /* 0xCF */
        MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 3),
        /* 0xD0 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 0),
        /* 0xD1 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 1),
        /* 0xD2 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 2),
        /* 0xD3 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 3),
        /* 0xD4 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 0),
        /* 0xD5 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 1),
        /* 0xD6 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 2),
        /* 0xD7 */
        MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 3),
        /* 0xD8 */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 0),
        /* 0xD9 */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 1),
        /* 0xDA */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 2),
        /* 0xDB */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 3),
        /* 0xDC */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 0),
        /* 0xDD */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 1),
        /* 0xDE */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 2),
        /* 0xDF */
        MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 3),
        /* 0xE0 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 0),
        /* 0xE1 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 1),
        /* 0xE2 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 2),
        /* 0xE3 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 3),
        /* 0xE4 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 0),
        /* 0xE5 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 1),
        /* 0xE6 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 2),
        /* 0xE7 */
        MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 3),
        /* 0xE8 */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 0),
        /* 0xE9 */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 1),
        /* 0xEA */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 2),
        /* 0xEB */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 3),
        /* 0xEC */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 0),
        /* 0xED */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 1),
        /* 0xEE */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 2),
        /* 0xEF */
        MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 3),
        /* 0xF0 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 0),
        /* 0xF1 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 1),
        /* 0xF2 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 2),
        /* 0xF3 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 3),
        /* 0xF4 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 0),
        /* 0xF5 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 1),
        /* 0xF6 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 2),
        /* 0xF7 */
        MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 3),
        /* 0xF8 */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 0),
        /* 0xF9 */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 1),
        /* 0xFA */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 2),
        /* 0xFB */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 3),
        /* 0xFC */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 0),
        /* 0xFD */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 1),
        /* 0xFE */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 2),
        /* 0xFF */
        MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 3)
      ];
      var hintingtt_default = Hinting;
      function Token(char) {
        this.char = char;
        this.state = {};
        this.activeState = null;
      }
      function ContextRange(startIndex, endOffset, contextName) {
        this.contextName = contextName;
        this.startIndex = startIndex;
        this.endOffset = endOffset;
      }
      function ContextChecker(contextName, checkStart, checkEnd) {
        this.contextName = contextName;
        this.openRange = null;
        this.ranges = [];
        this.checkStart = checkStart;
        this.checkEnd = checkEnd;
      }
      function ContextParams(context, currentIndex) {
        this.context = context;
        this.index = currentIndex;
        this.length = context.length;
        this.current = context[currentIndex];
        this.backtrack = context.slice(0, currentIndex);
        this.lookahead = context.slice(currentIndex + 1);
      }
      function Event(eventId) {
        this.eventId = eventId;
        this.subscribers = [];
      }
      function initializeCoreEvents(events) {
        const coreEvents = [
          "start",
          "end",
          "next",
          "newToken",
          "contextStart",
          "contextEnd",
          "insertToken",
          "removeToken",
          "removeRange",
          "replaceToken",
          "replaceRange",
          "composeRUD",
          "updateContextsRanges"
        ];
        for (let i = 0; i < coreEvents.length; i++) {
          const eventId = coreEvents[i];
          Object.defineProperty(this.events, eventId, {
            value: new Event(eventId)
          });
        }
        if (events) {
          for (let i = 0; i < coreEvents.length; i++) {
            const eventId = coreEvents[i];
            const event = events[eventId];
            if (typeof event === "function") {
              this.events[eventId].subscribe(event);
            }
          }
        }
        const requiresContextUpdate = [
          "insertToken",
          "removeToken",
          "removeRange",
          "replaceToken",
          "replaceRange",
          "composeRUD"
        ];
        for (let i = 0; i < requiresContextUpdate.length; i++) {
          const eventId = requiresContextUpdate[i];
          this.events[eventId].subscribe(
            this.updateContextsRanges
          );
        }
      }
      function Tokenizer(events) {
        this.tokens = [];
        this.registeredContexts = {};
        this.contextCheckers = [];
        this.events = {};
        this.registeredModifiers = [];
        initializeCoreEvents.call(this, events);
      }
      Token.prototype.setState = function(key, value) {
        this.state[key] = value;
        this.activeState = { key, value: this.state[key] };
        return this.activeState;
      };
      Token.prototype.getState = function(stateId) {
        return this.state[stateId] || null;
      };
      Tokenizer.prototype.inboundIndex = function(index) {
        return index >= 0 && index < this.tokens.length;
      };
      Tokenizer.prototype.composeRUD = function(RUDs) {
        const silent = true;
        const state = RUDs.map((RUD) => this[RUD[0]].apply(this, RUD.slice(1).concat(silent)));
        const hasFAILObject = (obj) => typeof obj === "object" && Object.prototype.hasOwnProperty.call(obj, "FAIL");
        if (state.every(hasFAILObject)) {
          return {
            FAIL: "composeRUD: one or more operations hasn't completed successfully",
            report: state.filter(hasFAILObject)
          };
        }
        this.dispatch("composeRUD", [state.filter((op) => !hasFAILObject(op))]);
      };
      Tokenizer.prototype.replaceRange = function(startIndex, offset, tokens, silent) {
        offset = offset !== null ? offset : this.tokens.length;
        const isTokenType = tokens.every((token) => token instanceof Token);
        if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
          const replaced = this.tokens.splice.apply(
            this.tokens,
            [startIndex, offset].concat(tokens)
          );
          if (!silent) this.dispatch("replaceToken", [startIndex, offset, tokens]);
          return [replaced, tokens];
        } else {
          return { FAIL: "replaceRange: invalid tokens or startIndex." };
        }
      };
      Tokenizer.prototype.replaceToken = function(index, token, silent) {
        if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
          const replaced = this.tokens.splice(index, 1, token);
          if (!silent) this.dispatch("replaceToken", [index, token]);
          return [replaced[0], token];
        } else {
          return { FAIL: "replaceToken: invalid token or index." };
        }
      };
      Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
        offset = !isNaN(offset) ? offset : this.tokens.length;
        const tokens = this.tokens.splice(startIndex, offset);
        if (!silent) this.dispatch("removeRange", [tokens, startIndex, offset]);
        return tokens;
      };
      Tokenizer.prototype.removeToken = function(index, silent) {
        if (!isNaN(index) && this.inboundIndex(index)) {
          const token = this.tokens.splice(index, 1);
          if (!silent) this.dispatch("removeToken", [token, index]);
          return token;
        } else {
          return { FAIL: "removeToken: invalid token index." };
        }
      };
      Tokenizer.prototype.insertToken = function(tokens, index, silent) {
        const tokenType = tokens.every(
          (token) => token instanceof Token
        );
        if (tokenType) {
          this.tokens.splice.apply(
            this.tokens,
            [index, 0].concat(tokens)
          );
          if (!silent) this.dispatch("insertToken", [tokens, index]);
          return tokens;
        } else {
          return { FAIL: "insertToken: invalid token(s)." };
        }
      };
      Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
        this.events.newToken.subscribe(function(token, contextParams) {
          const conditionParams = [token, contextParams];
          const canApplyModifier = condition === null || condition.apply(this, conditionParams) === true;
          const modifierParams = [token, contextParams];
          if (canApplyModifier) {
            let newStateValue = modifier.apply(this, modifierParams);
            token.setState(modifierId, newStateValue);
          }
        });
        this.registeredModifiers.push(modifierId);
      };
      Event.prototype.subscribe = function(eventHandler) {
        if (typeof eventHandler === "function") {
          return this.subscribers.push(eventHandler) - 1;
        } else {
          return { FAIL: `invalid '${this.eventId}' event handler` };
        }
      };
      Event.prototype.unsubscribe = function(subsId) {
        this.subscribers.splice(subsId, 1);
      };
      ContextParams.prototype.setCurrentIndex = function(index) {
        this.index = index;
        this.current = this.context[index];
        this.backtrack = this.context.slice(0, index);
        this.lookahead = this.context.slice(index + 1);
      };
      ContextParams.prototype.get = function(offset) {
        switch (true) {
          case offset === 0:
            return this.current;
          case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
            return this.backtrack.slice(offset)[0];
          case (offset > 0 && offset <= this.lookahead.length):
            return this.lookahead[offset - 1];
          default:
            return null;
        }
      };
      Tokenizer.prototype.rangeToText = function(range) {
        if (range instanceof ContextRange) {
          return this.getRangeTokens(range).map((token) => token.char).join("");
        }
      };
      Tokenizer.prototype.getText = function() {
        return this.tokens.map((token) => token.char).join("");
      };
      Tokenizer.prototype.getContext = function(contextName) {
        let context = this.registeredContexts[contextName];
        return context ? context : null;
      };
      Tokenizer.prototype.on = function(eventName, eventHandler) {
        const event = this.events[eventName];
        if (event) {
          return event.subscribe(eventHandler);
        } else {
          return null;
        }
      };
      Tokenizer.prototype.dispatch = function(eventName, args) {
        const event = this.events[eventName];
        if (event instanceof Event) {
          for (let i = 0; i < event.subscribers.length; i++) {
            const subscriber = event.subscribers[i];
            subscriber.apply(this, args || []);
          }
        }
      };
      Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
        if (this.getContext(contextName)) return {
          FAIL: `context name '${contextName}' is already registered.`
        };
        if (typeof contextStartCheck !== "function") return {
          FAIL: "missing context start check."
        };
        if (typeof contextEndCheck !== "function") return {
          FAIL: "missing context end check."
        };
        const contextCheckers = new ContextChecker(
          contextName,
          contextStartCheck,
          contextEndCheck
        );
        this.registeredContexts[contextName] = contextCheckers;
        this.contextCheckers.push(contextCheckers);
        return contextCheckers;
      };
      Tokenizer.prototype.getRangeTokens = function(range) {
        const endIndex = range.startIndex + range.endOffset;
        return [].concat(
          this.tokens.slice(range.startIndex, endIndex)
        );
      };
      Tokenizer.prototype.getContextRanges = function(contextName) {
        const context = this.getContext(contextName);
        if (context) {
          return context.ranges;
        } else {
          return { FAIL: `context checker '${contextName}' is not registered.` };
        }
      };
      Tokenizer.prototype.resetContextsRanges = function() {
        const registeredContexts = this.registeredContexts;
        for (const contextName in registeredContexts) {
          if (Object.prototype.hasOwnProperty.call(registeredContexts, contextName)) {
            const context = registeredContexts[contextName];
            context.ranges = [];
          }
        }
      };
      Tokenizer.prototype.updateContextsRanges = function() {
        this.resetContextsRanges();
        const chars = this.tokens.map((token) => token.char);
        for (let i = 0; i < chars.length; i++) {
          const contextParams = new ContextParams(chars, i);
          this.runContextCheck(contextParams);
        }
        this.dispatch("updateContextsRanges", [this.registeredContexts]);
      };
      Tokenizer.prototype.setEndOffset = function(offset, contextName) {
        const startIndex = this.getContext(contextName).openRange.startIndex;
        let range = new ContextRange(startIndex, offset, contextName);
        const ranges = this.getContext(contextName).ranges;
        range.rangeId = `${contextName}.${ranges.length}`;
        ranges.push(range);
        this.getContext(contextName).openRange = null;
        return range;
      };
      Tokenizer.prototype.runContextCheck = function(contextParams) {
        const index = contextParams.index;
        for (let i = 0; i < this.contextCheckers.length; i++) {
          const contextChecker = this.contextCheckers[i];
          let contextName = contextChecker.contextName;
          let openRange = this.getContext(contextName).openRange;
          if (!openRange && contextChecker.checkStart(contextParams)) {
            openRange = new ContextRange(index, null, contextName);
            this.getContext(contextName).openRange = openRange;
            this.dispatch("contextStart", [contextName, index]);
          }
          if (!!openRange && contextChecker.checkEnd(contextParams)) {
            const offset = index - openRange.startIndex + 1;
            const range = this.setEndOffset(offset, contextName);
            this.dispatch("contextEnd", [contextName, range]);
          }
        }
      };
      Tokenizer.prototype.tokenize = function(text) {
        this.tokens = [];
        this.resetContextsRanges();
        let chars = Array.from(text);
        this.dispatch("start");
        for (let i = 0; i < chars.length; i++) {
          const char = chars[i];
          const contextParams = new ContextParams(chars, i);
          this.dispatch("next", [contextParams]);
          this.runContextCheck(contextParams);
          let token = new Token(char);
          this.tokens.push(token);
          this.dispatch("newToken", [token, contextParams]);
        }
        this.dispatch("end", [this.tokens]);
        return this.tokens;
      };
      var tokenizer_default = Tokenizer;
      function isArabicChar(c) {
        return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c);
      }
      function isIsolatedArabicChar(char) {
        return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
      }
      function isTashkeelArabicChar(char) {
        return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
      }
      function isThaiChar(c) {
        return /[\u0E00-\u0E7F]/.test(c);
      }
      function isLatinChar(c) {
        return /[A-z]/.test(c);
      }
      function isWhiteSpace(c) {
        return /\s/.test(c);
      }
      function FeatureQuery(font) {
        this.font = font;
        this.features = {};
      }
      function SubstitutionAction(action) {
        this.id = action.id;
        this.tag = action.tag;
        this.substitution = action.substitution;
      }
      function lookupCoverage(glyphIndex, coverage) {
        if (!glyphIndex) return -1;
        switch (coverage.format) {
          case 1:
            return coverage.glyphs.indexOf(glyphIndex);
          case 2: {
            let ranges = coverage.ranges;
            for (let i = 0; i < ranges.length; i++) {
              const range = ranges[i];
              if (glyphIndex >= range.start && glyphIndex <= range.end) {
                let offset = glyphIndex - range.start;
                return range.index + offset;
              }
            }
            break;
          }
          default:
            return -1;
        }
        return -1;
      }
      function singleSubstitutionFormat1(glyphIndex, subtable) {
        let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
        if (substituteIndex === -1) return null;
        return glyphIndex + subtable.deltaGlyphId;
      }
      function singleSubstitutionFormat2(glyphIndex, subtable) {
        let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
        if (substituteIndex === -1) return null;
        return subtable.substitute[substituteIndex];
      }
      function lookupCoverageList(coverageList, contextParams) {
        let lookupList = [];
        for (let i = 0; i < coverageList.length; i++) {
          const coverage = coverageList[i];
          let glyphIndex = contextParams.current;
          glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
          const lookupIndex = lookupCoverage(glyphIndex, coverage);
          if (lookupIndex !== -1) {
            lookupList.push(lookupIndex);
          }
        }
        if (lookupList.length !== coverageList.length) return -1;
        return lookupList;
      }
      function chainingSubstitutionFormat3(contextParams, subtable) {
        const lookupsCount = subtable.inputCoverage.length + subtable.lookaheadCoverage.length + subtable.backtrackCoverage.length;
        if (contextParams.context.length < lookupsCount) return [];
        let inputLookups = lookupCoverageList(
          subtable.inputCoverage,
          contextParams
        );
        if (inputLookups === -1) return [];
        const lookaheadOffset = subtable.inputCoverage.length - 1;
        if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) return [];
        let lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
        while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
          lookaheadContext.shift();
        }
        const lookaheadParams = new ContextParams(lookaheadContext, 0);
        let lookaheadLookups = lookupCoverageList(
          subtable.lookaheadCoverage,
          lookaheadParams
        );
        let backtrackContext = [].concat(contextParams.backtrack);
        backtrackContext.reverse();
        while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
          backtrackContext.shift();
        }
        if (backtrackContext.length < subtable.backtrackCoverage.length) return [];
        const backtrackParams = new ContextParams(backtrackContext, 0);
        let backtrackLookups = lookupCoverageList(
          subtable.backtrackCoverage,
          backtrackParams
        );
        const contextRulesMatch = inputLookups.length === subtable.inputCoverage.length && lookaheadLookups.length === subtable.lookaheadCoverage.length && backtrackLookups.length === subtable.backtrackCoverage.length;
        let substitutions = [];
        if (contextRulesMatch) {
          for (let i = 0; i < subtable.lookupRecords.length; i++) {
            const lookupRecord = subtable.lookupRecords[i];
            const lookupListIndex = lookupRecord.lookupListIndex;
            const lookupTable = this.getLookupByIndex(lookupListIndex);
            for (let s = 0; s < lookupTable.subtables.length; s++) {
              let subtable2 = lookupTable.subtables[s];
              let lookup;
              let substitutionType = this.getSubstitutionType(lookupTable, subtable2);
              if (substitutionType === "71") {
                substitutionType = this.getSubstitutionType(subtable2, subtable2.extension);
                lookup = this.getLookupMethod(subtable2, subtable2.extension);
                subtable2 = subtable2.extension;
              } else {
                lookup = this.getLookupMethod(lookupTable, subtable2);
              }
              if (substitutionType === "12") {
                const glyphIndex = contextParams.get(lookupRecord.sequenceIndex);
                const substitution = lookup(glyphIndex);
                if (substitution) substitutions.push(substitution);
              } else if (substitutionType === "21") {
                const glyphIndex = contextParams.get(lookupRecord.sequenceIndex);
                const substitution = lookup(glyphIndex);
                if (substitution) substitutions.push(substitution);
              } else {
                throw new Error(`Substitution type ${substitutionType} is not supported in chaining substitution`);
              }
            }
          }
        }
        return substitutions;
      }
      function ligatureSubstitutionFormat1(contextParams, subtable) {
        let glyphIndex = contextParams.current;
        let ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
        if (ligSetIndex === -1) return null;
        let ligature;
        let ligatureSet = subtable.ligatureSets[ligSetIndex];
        for (let s = 0; s < ligatureSet.length; s++) {
          ligature = ligatureSet[s];
          for (let l = 0; l < ligature.components.length; l++) {
            const lookaheadItem = contextParams.lookahead[l];
            const component = ligature.components[l];
            if (lookaheadItem !== component) break;
            if (l === ligature.components.length - 1) return ligature;
          }
        }
        return null;
      }
      function contextSubstitutionFormat1(contextParams, subtable) {
        let glyphId = contextParams.current;
        let ligSetIndex = lookupCoverage(glyphId, subtable.coverage);
        if (ligSetIndex === -1)
          return null;
        for (const ruleSet of subtable.ruleSets) {
          for (const rule of ruleSet) {
            let matched = true;
            for (let i = 0; i < rule.input.length; i++) {
              if (contextParams.lookahead[i] !== rule.input[i]) {
                matched = false;
                break;
              }
            }
            if (matched) {
              let substitutions = [];
              substitutions.push(glyphId);
              for (let i = 0; i < rule.input.length; i++) {
                substitutions.push(rule.input[i]);
              }
              const parser = (substitutions2, lookupRecord) => {
                const { lookupListIndex, sequenceIndex } = lookupRecord;
                const { subtables } = this.getLookupByIndex(lookupListIndex);
                for (const subtable2 of subtables) {
                  let ligSetIndex2 = lookupCoverage(substitutions2[sequenceIndex], subtable2.coverage);
                  if (ligSetIndex2 !== -1) {
                    substitutions2[sequenceIndex] = subtable2.deltaGlyphId;
                  }
                }
              };
              for (let i = 0; i < rule.lookupRecords.length; i++) {
                const lookupRecord = rule.lookupRecords[i];
                parser(substitutions, lookupRecord);
              }
              return substitutions;
            }
          }
        }
        return null;
      }
      function contextSubstitutionFormat3(contextParams, subtable) {
        if (contextParams.context.length < subtable.coverages.length) {
          return [];
        }
        for (let i = 0; i < subtable.coverages.length; i++) {
          let glyphIndex = contextParams.get(i);
          glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
          if (lookupCoverage(glyphIndex, subtable.coverages[i]) === -1) {
            return [];
          }
        }
        let substitutions = [];
        for (let i = 0; i < subtable.lookupRecords.length; i++) {
          const lookupRecord = subtable.lookupRecords[i];
          const lookupListIndex = lookupRecord.lookupListIndex;
          const lookupTable = this.getLookupByIndex(lookupListIndex);
          for (let s = 0; s < lookupTable.subtables.length; s++) {
            let subtable2 = lookupTable.subtables[s];
            let lookup;
            let substitutionType = this.getSubstitutionType(lookupTable, subtable2);
            if (substitutionType === "71") {
              substitutionType = this.getSubstitutionType(subtable2, subtable2.extension);
              lookup = this.getLookupMethod(subtable2, subtable2.extension);
              subtable2 = subtable2.extension;
            } else {
              lookup = this.getLookupMethod(lookupTable, subtable2);
            }
            if (substitutionType === "12") {
              const glyphIndex = contextParams.get(lookupRecord.sequenceIndex);
              const substitution = lookup(glyphIndex);
              if (substitution) substitutions.push(substitution);
            } else if (substitutionType === "21") {
              const glyphIndex = contextParams.get(lookupRecord.sequenceIndex);
              const substitution = lookup(glyphIndex);
              if (substitution) substitutions.push(substitution);
            }
          }
        }
        return substitutions;
      }
      function decompositionSubstitutionFormat1(glyphIndex, subtable) {
        let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
        if (substituteIndex === -1) return null;
        return subtable.sequences[substituteIndex];
      }
      FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function() {
        const scripts = this.font.tables.gsub.scripts;
        for (let s = 0; s < scripts.length; s++) {
          const script = scripts[s];
          if (script.tag === "DFLT") return script.script.defaultLangSys.featureIndexes;
        }
        return [];
      };
      FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
        const tables = this.font.tables;
        if (!tables.gsub) return [];
        if (!scriptTag) return this.getDefaultScriptFeaturesIndexes();
        const scripts = this.font.tables.gsub.scripts;
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i];
          if (script.tag === scriptTag && script.script.defaultLangSys) {
            return script.script.defaultLangSys.featureIndexes;
          } else {
            let langSysRecords = script.langSysRecords;
            if (langSysRecords) {
              for (let j = 0; j < langSysRecords.length; j++) {
                const langSysRecord = langSysRecords[j];
                if (langSysRecord.tag === scriptTag) {
                  let langSys = langSysRecord.langSys;
                  return langSys.featureIndexes;
                }
              }
            }
          }
        }
        return this.getDefaultScriptFeaturesIndexes();
      };
      FeatureQuery.prototype.mapTagsToFeatures = function(features, scriptTag) {
        let tags = {};
        for (let i = 0; i < features.length; i++) {
          const tag = features[i].tag;
          const feature = features[i].feature;
          tags[tag] = feature;
        }
        this.features[scriptTag].tags = tags;
      };
      FeatureQuery.prototype.getScriptFeatures = function(scriptTag) {
        let features = this.features[scriptTag];
        if (Object.prototype.hasOwnProperty.call(this.features, scriptTag)) return features;
        const featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
        if (!featuresIndexes) return null;
        const gsub = this.font.tables.gsub;
        features = featuresIndexes.map((index) => gsub.features[index]);
        this.features[scriptTag] = features;
        this.mapTagsToFeatures(features, scriptTag);
        return features;
      };
      FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
        const lookupType = lookupTable.lookupType.toString();
        const substFormat = subtable.substFormat.toString();
        return lookupType + substFormat;
      };
      FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
        let substitutionType = this.getSubstitutionType(lookupTable, subtable);
        switch (substitutionType) {
          case "11":
            return (glyphIndex) => singleSubstitutionFormat1.apply(
              this,
              [glyphIndex, subtable]
            );
          case "12":
            return (glyphIndex) => singleSubstitutionFormat2.apply(
              this,
              [glyphIndex, subtable]
            );
          case "63":
            return (contextParams) => chainingSubstitutionFormat3.apply(
              this,
              [contextParams, subtable]
            );
          case "41":
            return (contextParams) => ligatureSubstitutionFormat1.apply(
              this,
              [contextParams, subtable]
            );
          case "21":
            return (glyphIndex) => decompositionSubstitutionFormat1.apply(
              this,
              [glyphIndex, subtable]
            );
          case "51":
            return (contextParams) => contextSubstitutionFormat1.apply(
              this,
              [contextParams, subtable]
            );
          case "53":
            return (contextParams) => contextSubstitutionFormat3.apply(
              this,
              [contextParams, subtable]
            );
          default:
            throw new Error(
              `substitutionType : ${substitutionType} lookupType: ${lookupTable.lookupType} - substFormat: ${subtable.substFormat} is not yet supported`
            );
        }
      };
      FeatureQuery.prototype.lookupFeature = function(query) {
        let contextParams = query.contextParams;
        let currentIndex = contextParams.index;
        const feature = this.getFeature({
          tag: query.tag,
          script: query.script
        });
        if (!feature) return new Error(
          `font '${(this.font.names.unicode || this.font.names.windows || this.font.names.macintosh).fullName.en}' doesn't support feature '${query.tag}' for script '${query.script}'.`
        );
        const lookups = this.getFeatureLookups(feature);
        const substitutions = [].concat(contextParams.context);
        for (let l = 0; l < lookups.length; l++) {
          const lookupTable = lookups[l];
          const subtables = this.getLookupSubtables(lookupTable);
          for (let s = 0; s < subtables.length; s++) {
            let subtable = subtables[s];
            let substType = this.getSubstitutionType(lookupTable, subtable);
            let lookup;
            if (substType === "71") {
              substType = this.getSubstitutionType(subtable, subtable.extension);
              lookup = this.getLookupMethod(subtable, subtable.extension);
              subtable = subtable.extension;
            } else {
              lookup = this.getLookupMethod(lookupTable, subtable);
            }
            let substitution;
            switch (substType) {
              case "11":
                substitution = lookup(contextParams.current);
                if (substitution) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: 11,
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
              case "12":
                substitution = lookup(contextParams.current);
                if (substitution) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: 12,
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
              case "63":
                substitution = lookup(contextParams);
                if (Array.isArray(substitution) && substitution.length) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: 63,
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
              case "41":
                substitution = lookup(contextParams);
                if (substitution) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: 41,
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
              case "21":
                substitution = lookup(contextParams.current);
                if (substitution) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: 21,
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
              case "51":
              case "53":
                substitution = lookup(contextParams);
                if (Array.isArray(substitution) && substitution.length) {
                  substitutions.splice(currentIndex, 1, new SubstitutionAction({
                    id: parseInt(substType),
                    tag: query.tag,
                    substitution
                  }));
                }
                break;
            }
            contextParams = new ContextParams(substitutions, currentIndex);
            if (Array.isArray(substitution) && !substitution.length) continue;
            substitution = null;
          }
        }
        return substitutions.length ? substitutions : null;
      };
      FeatureQuery.prototype.supports = function(query) {
        if (!query.script) return false;
        this.getScriptFeatures(query.script);
        const supportedScript = Object.prototype.hasOwnProperty.call(this.features, query.script);
        if (!query.tag) return supportedScript;
        const supportedFeature = this.features[query.script].some((feature) => feature.tag === query.tag);
        return supportedScript && supportedFeature;
      };
      FeatureQuery.prototype.getLookupSubtables = function(lookupTable) {
        return lookupTable.subtables || null;
      };
      FeatureQuery.prototype.getLookupByIndex = function(index) {
        const lookups = this.font.tables.gsub.lookups;
        return lookups[index] || null;
      };
      FeatureQuery.prototype.getFeatureLookups = function(feature) {
        return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
      };
      FeatureQuery.prototype.getFeature = function getFeature(query) {
        if (!this.font) return { FAIL: "No font was found" };
        if (!Object.prototype.hasOwnProperty.call(this.features, query.script)) {
          this.getScriptFeatures(query.script);
        }
        const scriptFeatures = this.features[query.script];
        if (!scriptFeatures) return { FAIL: `No feature for script ${query.script}` };
        if (!scriptFeatures.tags[query.tag]) return null;
        return this.features[query.script].tags[query.tag];
      };
      var featureQuery_default = FeatureQuery;
      function arabicWordStartCheck(contextParams) {
        const char = contextParams.current;
        const prevChar = contextParams.get(-1);
        return (
          // ? arabic first char
          prevChar === null && isArabicChar(char) || // ? arabic char preceded with a non arabic char
          !isArabicChar(prevChar) && isArabicChar(char)
        );
      }
      function arabicWordEndCheck(contextParams) {
        const nextChar = contextParams.get(1);
        return (
          // ? last arabic char
          nextChar === null || // ? next char is not arabic
          !isArabicChar(nextChar)
        );
      }
      var arabicWord_default = {
        startCheck: arabicWordStartCheck,
        endCheck: arabicWordEndCheck
      };
      function arabicSentenceStartCheck(contextParams) {
        const char = contextParams.current;
        const prevChar = contextParams.get(-1);
        return (
          // ? an arabic char preceded with a non arabic char
          (isArabicChar(char) || isTashkeelArabicChar(char)) && !isArabicChar(prevChar)
        );
      }
      function arabicSentenceEndCheck(contextParams) {
        const nextChar = contextParams.get(1);
        switch (true) {
          case nextChar === null:
            return true;
          case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)): {
            const nextIsWhitespace = isWhiteSpace(nextChar);
            if (!nextIsWhitespace) return true;
            if (nextIsWhitespace) {
              let arabicCharAhead = false;
              arabicCharAhead = contextParams.lookahead.some(
                (c) => isArabicChar(c) || isTashkeelArabicChar(c)
              );
              if (!arabicCharAhead) return true;
            }
            break;
          }
          default:
            return false;
        }
      }
      var arabicSentence_default = {
        startCheck: arabicSentenceStartCheck,
        endCheck: arabicSentenceEndCheck
      };
      function singleSubstitutionFormat12(action, tokens, index) {
        tokens[index].setState(action.tag, action.substitution);
      }
      function singleSubstitutionFormat22(action, tokens, index) {
        tokens[index].setState(action.tag, action.substitution);
      }
      function chainingSubstitutionFormat32(action, tokens, index) {
        for (let i = 0; i < action.substitution.length; i++) {
          const subst = action.substitution[i];
          const token = tokens[index + i];
          if (Array.isArray(subst)) {
            if (subst.length) {
              token.setState(action.tag, subst[0]);
            } else {
              token.setState("deleted", true);
            }
            continue;
          }
          token.setState(action.tag, subst);
        }
      }
      function ligatureSubstitutionFormat12(action, tokens, index) {
        let token = tokens[index];
        token.setState(action.tag, action.substitution.ligGlyph);
        const compsCount = action.substitution.components.length;
        for (let i = 0; i < compsCount; i++) {
          token = tokens[index + i + 1];
          token.setState("deleted", true);
        }
      }
      var SUBSTITUTIONS = {
        11: singleSubstitutionFormat12,
        12: singleSubstitutionFormat22,
        63: chainingSubstitutionFormat32,
        41: ligatureSubstitutionFormat12,
        51: chainingSubstitutionFormat32,
        53: chainingSubstitutionFormat32
      };
      function applySubstitution(action, tokens, index) {
        if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
          SUBSTITUTIONS[action.id](action, tokens, index);
        }
      }
      var applySubstitution_default = applySubstitution;
      function willConnectPrev(charContextParams) {
        let backtrack = [].concat(charContextParams.backtrack);
        for (let i = backtrack.length - 1; i >= 0; i--) {
          const prevChar = backtrack[i];
          const isolated = isIsolatedArabicChar(prevChar);
          const tashkeel = isTashkeelArabicChar(prevChar);
          if (!isolated && !tashkeel) return true;
          if (isolated) return false;
        }
        return false;
      }
      function willConnectNext(charContextParams) {
        if (isIsolatedArabicChar(charContextParams.current)) return false;
        for (let i = 0; i < charContextParams.lookahead.length; i++) {
          const nextChar = charContextParams.lookahead[i];
          const tashkeel = isTashkeelArabicChar(nextChar);
          if (!tashkeel) return true;
        }
        return false;
      }
      function arabicPresentationForms(range) {
        const script = "arab";
        const tags = this.featuresTags[script];
        const tokens = this.tokenizer.getRangeTokens(range);
        if (tokens.length === 1) return;
        let contextParams = new ContextParams(
          tokens.map(
            (token) => token.getState("glyphIndex")
          ),
          0
        );
        const charContextParams = new ContextParams(
          tokens.map(
            (token) => token.char
          ),
          0
        );
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          if (isTashkeelArabicChar(token.char)) continue;
          contextParams.setCurrentIndex(i);
          charContextParams.setCurrentIndex(i);
          let CONNECT = 0;
          if (willConnectPrev(charContextParams)) CONNECT |= 1;
          if (willConnectNext(charContextParams)) CONNECT |= 2;
          let tag;
          switch (CONNECT) {
            case 1:
              tag = "fina";
              break;
            case 2:
              tag = "init";
              break;
            case 3:
              tag = "medi";
              break;
          }
          if (tags.indexOf(tag) === -1) continue;
          let substitutions = this.query.lookupFeature({
            tag,
            script,
            contextParams
          });
          if (substitutions instanceof Error) {
            console.info(substitutions.message);
            continue;
          }
          for (let j = 0; j < substitutions.length; j++) {
            const action = substitutions[j];
            if (action instanceof SubstitutionAction) {
              applySubstitution_default(action, tokens, j);
              contextParams.context[j] = action.substitution;
            }
          }
        }
      }
      var arabicPresentationForms_default = arabicPresentationForms;
      function getContextParams(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function arabicRequiredLigatures(range) {
        const script = "arab";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams(tokens);
        for (let index = 0; index < contextParams.context.length; index++) {
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag: "rlig",
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams(tokens);
          }
        }
      }
      var arabicRequiredLigatures_default = arabicRequiredLigatures;
      function ccmpReplacementStartCheck(contextParams) {
        return contextParams.index === 0 && contextParams.context.length > 1;
      }
      function ccmpReplacementEndCheck(contextParams) {
        return contextParams.index === contextParams.context.length - 1;
      }
      var ccmpReplacement_default = {
        startCheck: ccmpReplacementStartCheck,
        endCheck: ccmpReplacementEndCheck
      };
      function getContextParams2(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function ccmpReplacementLigatures(range) {
        const script = "delf";
        const tag = "ccmp";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams2(tokens);
        for (let index = 0; index < contextParams.context.length; index++) {
          if (!this.query.getFeature({ tag, script, contextParams })) {
            continue;
          }
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag,
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams2(tokens);
          }
        }
      }
      var ccmpReplacementLigatures_default = ccmpReplacementLigatures;
      function latinWordStartCheck(contextParams) {
        const char = contextParams.current;
        const prevChar = contextParams.get(-1);
        return (
          // ? latin first char
          prevChar === null && isLatinChar(char) || // ? latin char preceded with a non latin char
          !isLatinChar(prevChar) && isLatinChar(char)
        );
      }
      function latinWordEndCheck(contextParams) {
        const nextChar = contextParams.get(1);
        return (
          // ? last latin char
          nextChar === null || // ? next char is not latin
          !isLatinChar(nextChar)
        );
      }
      var latinWord_default = {
        startCheck: latinWordStartCheck,
        endCheck: latinWordEndCheck
      };
      function getContextParams3(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function latinLigature(range) {
        const script = "latn";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams3(tokens);
        for (let index = 0; index < contextParams.context.length; index++) {
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag: "liga",
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams3(tokens);
          }
        }
      }
      var latinLigatures_default = latinLigature;
      function thaiWordStartCheck(contextParams) {
        const char = contextParams.current;
        const prevChar = contextParams.get(-1);
        return (
          // ? thai first char
          prevChar === null && isThaiChar(char) || // ? thai char preceded with a non thai char
          !isThaiChar(prevChar) && isThaiChar(char)
        );
      }
      function thaiWordEndCheck(contextParams) {
        const nextChar = contextParams.get(1);
        return (
          // ? last thai char
          nextChar === null || // ? next char is not thai
          !isThaiChar(nextChar)
        );
      }
      var thaiWord_default = {
        startCheck: thaiWordStartCheck,
        endCheck: thaiWordEndCheck
      };
      function getContextParams4(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function thaiGlyphComposition(range) {
        const script = "thai";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams4(tokens, 0);
        for (let index = 0; index < contextParams.context.length; index++) {
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag: "ccmp",
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams4(tokens, index);
          }
        }
      }
      var thaiGlyphComposition_default = thaiGlyphComposition;
      function getContextParams5(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function thaiLigatures(range) {
        const script = "thai";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams5(tokens, 0);
        for (let index = 0; index < contextParams.context.length; index++) {
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag: "liga",
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams5(tokens, index);
          }
        }
      }
      var thaiLigatures_default = thaiLigatures;
      function getContextParams6(tokens, index) {
        const context = tokens.map((token) => token.activeState.value);
        return new ContextParams(context, index || 0);
      }
      function thaiRequiredLigatures(range) {
        const script = "thai";
        let tokens = this.tokenizer.getRangeTokens(range);
        let contextParams = getContextParams6(tokens, 0);
        for (let index = 0; index < contextParams.context.length; index++) {
          contextParams.setCurrentIndex(index);
          let substitutions = this.query.lookupFeature({
            tag: "rlig",
            script,
            contextParams
          });
          if (substitutions.length) {
            for (let i = 0; i < substitutions.length; i++) {
              const action = substitutions[i];
              applySubstitution_default(action, tokens, index);
            }
            contextParams = getContextParams6(tokens, index);
          }
        }
      }
      var thaiRequiredLigatures_default = thaiRequiredLigatures;
      function isVariationSequenceSelector(char) {
        if (char === null) return false;
        const charCode = char.codePointAt(0);
        return (
          // Mongolian Variation Selectors
          charCode >= 6155 && charCode <= 6157 || // Generic Variation Selectors
          charCode >= 65024 && charCode <= 65039 || // Ideographic Variation Sequences
          charCode >= 917760 && charCode <= 917999
        );
      }
      function unicodeVariationSequenceStartCheck(contextParams) {
        const char = contextParams.current;
        const nextChar = contextParams.get(1);
        return nextChar === null && isVariationSequenceSelector(char) || isVariationSequenceSelector(nextChar);
      }
      function unicodeVariationSequenceEndCheck(contextParams) {
        const nextChar = contextParams.get(1);
        return nextChar === null || !isVariationSequenceSelector(nextChar);
      }
      var variationSequenceCheck_default = {
        startCheck: unicodeVariationSequenceStartCheck,
        endCheck: unicodeVariationSequenceEndCheck
      };
      function unicodeVariationSequence(range) {
        const font = this.query.font;
        const tokens = this.tokenizer.getRangeTokens(range);
        tokens[1].setState("deleted", true);
        if (font.tables.cmap && font.tables.cmap.varSelectorList) {
          const baseCodePoint = tokens[0].char.codePointAt(0);
          const vsCodePoint = tokens[1].char.codePointAt(0);
          const selectorLookup = font.tables.cmap.varSelectorList[vsCodePoint];
          if (selectorLookup !== void 0) {
            if (selectorLookup.nonDefaultUVS) {
              const mappings = selectorLookup.nonDefaultUVS.uvsMappings;
              if (mappings[baseCodePoint]) {
                const replacementGlyphId = mappings[baseCodePoint].glyphID;
                if (font.glyphs.glyphs[replacementGlyphId] !== void 0) {
                  tokens[0].setState("glyphIndex", replacementGlyphId);
                }
              }
            }
          }
        }
      }
      var variationSequences_default = unicodeVariationSequence;
      function Bidi(baseDir) {
        this.baseDir = baseDir || "ltr";
        this.tokenizer = new tokenizer_default();
        this.featuresTags = {};
      }
      Bidi.prototype.setText = function(text) {
        this.text = text;
      };
      Bidi.prototype.contextChecks = {
        ccmpReplacementCheck: ccmpReplacement_default,
        latinWordCheck: latinWord_default,
        arabicWordCheck: arabicWord_default,
        arabicSentenceCheck: arabicSentence_default,
        thaiWordCheck: thaiWord_default,
        unicodeVariationSequenceCheck: variationSequenceCheck_default
      };
      function registerContextChecker(checkId) {
        const check = this.contextChecks[`${checkId}Check`];
        return this.tokenizer.registerContextChecker(
          checkId,
          check.startCheck,
          check.endCheck
        );
      }
      function tokenizeText() {
        registerContextChecker.call(this, "ccmpReplacement");
        registerContextChecker.call(this, "latinWord");
        registerContextChecker.call(this, "arabicWord");
        registerContextChecker.call(this, "arabicSentence");
        registerContextChecker.call(this, "thaiWord");
        registerContextChecker.call(this, "unicodeVariationSequence");
        return this.tokenizer.tokenize(this.text);
      }
      function reverseArabicSentences() {
        const ranges = this.tokenizer.getContextRanges("arabicSentence");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          let rangeTokens = this.tokenizer.getRangeTokens(range);
          this.tokenizer.replaceRange(
            range.startIndex,
            range.endOffset,
            rangeTokens.reverse()
          );
        }
      }
      Bidi.prototype.registerFeatures = function(script, tags) {
        const supportedTags = tags.filter(
          (tag) => this.query.supports({ script, tag })
        );
        if (!Object.prototype.hasOwnProperty.call(this.featuresTags, script)) {
          this.featuresTags[script] = supportedTags;
        } else {
          this.featuresTags[script] = this.featuresTags[script].concat(supportedTags);
        }
      };
      Bidi.prototype.applyFeatures = function(font, features) {
        if (!font) throw new Error(
          "No valid font was provided to apply features"
        );
        if (!this.query) this.query = new featureQuery_default(font);
        for (let f = 0; f < features.length; f++) {
          const feature = features[f];
          if (!this.query.supports({ script: feature.script })) continue;
          this.registerFeatures(feature.script, feature.tags);
        }
      };
      Bidi.prototype.registerModifier = function(modifierId, condition, modifier) {
        this.tokenizer.registerModifier(modifierId, condition, modifier);
      };
      function checkGlyphIndexStatus() {
        if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1) {
          throw new Error(
            "glyphIndex modifier is required to apply arabic presentation features."
          );
        }
      }
      function applyArabicPresentationForms() {
        const script = "arab";
        if (!Object.prototype.hasOwnProperty.call(this.featuresTags, script)) return;
        checkGlyphIndexStatus.call(this);
        const ranges = this.tokenizer.getContextRanges("arabicWord");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          arabicPresentationForms_default.call(this, range);
        }
      }
      function applyCcmpReplacement() {
        checkGlyphIndexStatus.call(this);
        const ranges = this.tokenizer.getContextRanges("ccmpReplacement");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          ccmpReplacementLigatures_default.call(this, range);
        }
      }
      function applyArabicRequireLigatures() {
        if (!this.hasFeatureEnabled("arab", "rlig")) return;
        checkGlyphIndexStatus.call(this);
        const ranges = this.tokenizer.getContextRanges("arabicWord");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          arabicRequiredLigatures_default.call(this, range);
        }
      }
      function applyLatinLigatures() {
        if (!this.hasFeatureEnabled("latn", "liga")) return;
        checkGlyphIndexStatus.call(this);
        const ranges = this.tokenizer.getContextRanges("latinWord");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          latinLigatures_default.call(this, range);
        }
      }
      function applyUnicodeVariationSequences() {
        const ranges = this.tokenizer.getContextRanges("unicodeVariationSequence");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          variationSequences_default.call(this, range);
        }
      }
      function applyThaiFeatures() {
        checkGlyphIndexStatus.call(this);
        const ranges = this.tokenizer.getContextRanges("thaiWord");
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          if (this.hasFeatureEnabled("thai", "liga")) thaiLigatures_default.call(this, range);
          if (this.hasFeatureEnabled("thai", "rlig")) thaiRequiredLigatures_default.call(this, range);
          if (this.hasFeatureEnabled("thai", "ccmp")) thaiGlyphComposition_default.call(this, range);
        }
      }
      Bidi.prototype.checkContextReady = function(contextId) {
        return !!this.tokenizer.getContext(contextId);
      };
      Bidi.prototype.applyFeaturesToContexts = function() {
        if (this.checkContextReady("ccmpReplacement")) {
          applyCcmpReplacement.call(this);
        }
        if (this.checkContextReady("arabicWord")) {
          applyArabicPresentationForms.call(this);
          applyArabicRequireLigatures.call(this);
        }
        if (this.checkContextReady("latinWord")) {
          applyLatinLigatures.call(this);
        }
        if (this.checkContextReady("arabicSentence")) {
          reverseArabicSentences.call(this);
        }
        if (this.checkContextReady("thaiWord")) {
          applyThaiFeatures.call(this);
        }
        if (this.checkContextReady("unicodeVariationSequence")) {
          applyUnicodeVariationSequences.call(this);
        }
      };
      Bidi.prototype.hasFeatureEnabled = function(script, tag) {
        return (this.featuresTags[script] || []).indexOf(tag) !== -1;
      };
      Bidi.prototype.processText = function(text) {
        if (!this.text || this.text !== text) {
          this.setText(text);
          tokenizeText.call(this);
          this.applyFeaturesToContexts();
        }
      };
      Bidi.prototype.getBidiText = function(text) {
        this.processText(text);
        return this.tokenizer.getText();
      };
      Bidi.prototype.getTextGlyphs = function(text) {
        this.processText(text);
        let indexes = [];
        for (let i = 0; i < this.tokenizer.tokens.length; i++) {
          const token = this.tokenizer.tokens[i];
          if (token.state.deleted) continue;
          const index = token.activeState.value;
          indexes.push(Array.isArray(index) ? index[0] : index);
        }
        return indexes;
      };
      var bidi_default = Bidi;
      function createDefaultNamesInfo(options) {
        return {
          fontFamily: { en: options.familyName || " " },
          fontSubfamily: { en: options.styleName || " " },
          fullName: { en: options.fullName || options.familyName + " " + options.styleName },
          // postScriptName may not contain any whitespace
          postScriptName: { en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, "") },
          designer: { en: options.designer || " " },
          designerURL: { en: options.designerURL || " " },
          manufacturer: { en: options.manufacturer || " " },
          manufacturerURL: { en: options.manufacturerURL || " " },
          license: { en: options.license || " " },
          licenseURL: { en: options.licenseURL || " " },
          version: { en: options.version || "Version 0.1" },
          description: { en: options.description || " " },
          copyright: { en: options.copyright || " " },
          trademark: { en: options.trademark || " " }
        };
      }
      function Font2(options) {
        options = options || {};
        options.tables = options.tables || {};
        if (!options.empty) {
          if (!options.familyName) throw new Error("When creating a new Font object, familyName is required.");
          if (!options.styleName) throw new Error("When creating a new Font object, styleName is required.");
          if (!options.unitsPerEm) throw new Error("When creating a new Font object, unitsPerEm is required.");
          if (!options.ascender) throw new Error("When creating a new Font object, ascender is required.");
          if (options.descender > 0) throw new Error("When creating a new Font object, negative descender value is required.");
          this.names = {};
          this.names.unicode = createDefaultNamesInfo(options);
          this.names.macintosh = createDefaultNamesInfo(options);
          this.names.windows = createDefaultNamesInfo(options);
          this.unitsPerEm = options.unitsPerEm || 1e3;
          this.ascender = options.ascender;
          this.descender = options.descender;
          this.createdTimestamp = options.createdTimestamp;
          this.italicAngle = options.italicAngle || 0;
          this.weightClass = options.weightClass || 0;
          let selection = 0;
          if (options.fsSelection) {
            selection = options.fsSelection;
          } else {
            if (this.italicAngle < 0) {
              selection |= this.fsSelectionValues.ITALIC;
            } else if (this.italicAngle > 0) {
              selection |= this.fsSelectionValues.OBLIQUE;
            }
            if (this.weightClass >= 600) {
              selection |= this.fsSelectionValues.BOLD;
            }
            if (selection === 0) {
              selection = this.fsSelectionValues.REGULAR;
            }
          }
          if (!options.panose || !Array.isArray(options.panose)) {
            options.panose = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          this.tables = Object.assign(options.tables, {
            os2: Object.assign({
              usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
              usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
              bFamilyType: options.panose[0] || 0,
              bSerifStyle: options.panose[1] || 0,
              bWeight: options.panose[2] || 0,
              bProportion: options.panose[3] || 0,
              bContrast: options.panose[4] || 0,
              bStrokeVariation: options.panose[5] || 0,
              bArmStyle: options.panose[6] || 0,
              bLetterform: options.panose[7] || 0,
              bMidline: options.panose[8] || 0,
              bXHeight: options.panose[9] || 0,
              fsSelection: selection
            }, options.tables.os2)
          });
        }
        this.supported = true;
        this.glyphs = new glyphset_default.GlyphSet(this, options.glyphs || []);
        this.encoding = new DefaultEncoding(this);
        this.position = new position_default(this);
        this.substitution = new substitution_default(this);
        this.tables = this.tables || {};
        this.tables = new Proxy(this.tables, {
          set: (tables, tableName, tableData) => {
            tables[tableName] = tableData;
            if (tables.fvar && (tables.gvar || tables.cff2) && !this.variation) {
              this.variation = new VariationManager(this);
            }
            return true;
          }
        });
        this.palettes = new PaletteManager(this);
        this.layers = new LayerManager(this);
        this.svgImages = new SVGImageManager(this);
        this._push = null;
        this._hmtxTableData = {};
        Object.defineProperty(this, "hinting", {
          get: function() {
            if (this._hinting) return this._hinting;
            if (this.outlinesFormat === "truetype") {
              return this._hinting = new hintingtt_default(this);
            }
            return null;
          }
        });
      }
      Font2.prototype.hasChar = function(c) {
        return this.encoding.charToGlyphIndex(c) > 0;
      };
      Font2.prototype.charToGlyphIndex = function(s) {
        return this.encoding.charToGlyphIndex(s);
      };
      Font2.prototype.charToGlyph = function(c) {
        const glyphIndex = this.charToGlyphIndex(c);
        let glyph = this.glyphs.get(glyphIndex);
        if (!glyph) {
          glyph = this.glyphs.get(0);
        }
        return glyph;
      };
      Font2.prototype.updateFeatures = function(options) {
        return this.defaultRenderOptions.features.map((feature) => {
          if (feature.script === "latn") {
            return {
              script: "latn",
              tags: feature.tags.filter((tag) => options[tag])
            };
          } else {
            return feature;
          }
        });
      };
      Font2.prototype.stringToGlyphIndexes = function(s, options) {
        const bidi = new bidi_default();
        const charToGlyphIndexMod = (token) => this.charToGlyphIndex(token.char);
        bidi.registerModifier("glyphIndex", null, charToGlyphIndexMod);
        let features = options ? this.updateFeatures(options.features) : this.defaultRenderOptions.features;
        bidi.applyFeatures(this, features);
        return bidi.getTextGlyphs(s);
      };
      Font2.prototype.stringToGlyphs = function(s, options) {
        const indexes = this.stringToGlyphIndexes(s, options);
        let length = indexes.length;
        const glyphs = new Array(length);
        const notdef = this.glyphs.get(0);
        for (let i = 0; i < length; i += 1) {
          glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
        }
        return glyphs;
      };
      Font2.prototype.nameToGlyphIndex = function(name) {
        return this.glyphNames.nameToGlyphIndex(name);
      };
      Font2.prototype.nameToGlyph = function(name) {
        const glyphIndex = this.nameToGlyphIndex(name);
        let glyph = this.glyphs.get(glyphIndex);
        if (!glyph) {
          glyph = this.glyphs.get(0);
        }
        return glyph;
      };
      Font2.prototype.glyphIndexToName = function(gid) {
        if (!this.glyphNames.glyphIndexToName) {
          return "";
        }
        return this.glyphNames.glyphIndexToName(gid);
      };
      Font2.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
        leftGlyph = leftGlyph.index || leftGlyph;
        rightGlyph = rightGlyph.index || rightGlyph;
        const gposKerning = this.position.defaultKerningTables;
        if (gposKerning) {
          return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
        }
        return this.kerningPairs[leftGlyph + "," + rightGlyph] || 0;
      };
      Font2.prototype.defaultRenderOptions = {
        kerning: true,
        features: [
          /**
           * these 4 features are required to render Arabic text properly
           * and shouldn't be turned off when rendering arabic text.
           */
          { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
          { script: "latn", tags: ["liga", "rlig"] },
          { script: "thai", tags: ["liga", "rlig", "ccmp"] }
        ],
        hinting: false,
        usePalette: 0,
        drawLayers: true,
        drawSVG: true
      };
      Font2.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
        x = x !== void 0 ? x : 0;
        y = y !== void 0 ? y : 0;
        fontSize = fontSize !== void 0 ? fontSize : 72;
        options = Object.assign({}, this.defaultRenderOptions, options);
        const fontScale = 1 / this.unitsPerEm * fontSize;
        const glyphs = this.stringToGlyphs(text, options);
        let kerningLookups;
        if (options.kerning) {
          const script = options.script || this.position.getDefaultScriptName();
          kerningLookups = this.position.getKerningTables(script, options.language);
        }
        for (let i = 0; i < glyphs.length; i += 1) {
          const glyph = glyphs[i];
          callback.call(this, glyph, x, y, fontSize, options);
          if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
          }
          if (options.kerning && i < glyphs.length - 1) {
            const kerningValue = kerningLookups ? this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) : this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
          }
          if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
          } else if (options.tracking) {
            x += options.tracking / 1e3 * fontSize;
          }
        }
        return x;
      };
      Font2.prototype.getPath = function(text, x, y, fontSize, options) {
        options = Object.assign({}, this.defaultRenderOptions, options);
        const fullPath = new path_default();
        fullPath._layers = [];
        applyPaintType(this, fullPath, fontSize);
        if (fullPath.stroke) {
          const scale = 1 / (fullPath.unitsPerEm || 1e3) * fontSize;
          fullPath.strokeWidth *= scale;
        }
        this.forEachGlyph(text, x, y, fontSize, options, (glyph, gX, gY, gFontSize) => {
          const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          if (options.drawSVG || options.drawLayers) {
            const layers = glyphPath._layers;
            if (layers && layers.length) {
              for (let l = 0; l < layers.length; l++) {
                const layer = layers[l];
                fullPath._layers.push(layer);
              }
              return;
            }
          }
          fullPath.extend(glyphPath);
        });
        return fullPath;
      };
      Font2.prototype.getPaths = function(text, x, y, fontSize, options) {
        options = Object.assign({}, this.defaultRenderOptions, options);
        const glyphPaths = [];
        this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          glyphPaths.push(glyphPath);
        });
        return glyphPaths;
      };
      Font2.prototype.getAdvanceWidth = function(text, fontSize, options) {
        options = Object.assign({}, this.defaultRenderOptions, options);
        return this.forEachGlyph(text, 0, 0, fontSize, options, function() {
        });
      };
      Font2.prototype.draw = function(ctx, text, x, y, fontSize, options) {
        const path = this.getPath(text, x, y, fontSize, options);
        path.draw(ctx);
      };
      Font2.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
        options = Object.assign({}, this.defaultRenderOptions, options);
        this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          glyph.drawPoints(ctx, gX, gY, gFontSize, options, this);
        });
      };
      Font2.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
        options = Object.assign({}, this.defaultRenderOptions, options);
        this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          glyph.drawMetrics(ctx, gX, gY, gFontSize);
        });
      };
      Font2.prototype.getEnglishName = function(name) {
        const translations = (this.names.unicode || this.names.macintosh || this.names.windows)[name];
        if (translations) {
          return translations.en;
        }
      };
      Font2.prototype.validate = function() {
        const warnings = [];
        const _this = this;
        function assert(predicate, message) {
          if (!predicate) {
            console.warn(`[opentype.js] ${message}`);
            warnings.push(message);
          }
        }
        function assertNamePresent(name) {
          const englishName = _this.getEnglishName(name);
          assert(
            englishName && englishName.trim().length > 0,
            "No English " + name + " specified."
          );
        }
        assertNamePresent("fontFamily");
        assertNamePresent("weightName");
        assertNamePresent("manufacturer");
        assertNamePresent("copyright");
        assertNamePresent("version");
        assert(this.unitsPerEm > 0, "No unitsPerEm specified.");
        if (this.tables.colr) {
          const baseGlyphs = this.tables.colr.baseGlyphRecords;
          let previousID = -1;
          for (let b = 0; b < baseGlyphs.length; b++) {
            const currentGlyphID = baseGlyphs[b].glyphID;
            assert(previousID < baseGlyphs[b].glyphID, `baseGlyphs must be sorted by GlyphID in ascending order, but glyphID ${currentGlyphID} comes after ${previousID}`);
            if (previousID > baseGlyphs[b].glyphID) {
              break;
            }
            previousID = currentGlyphID;
          }
        }
        return warnings;
      };
      Font2.prototype.toTables = function() {
        return sfnt_default.fontToTable(this);
      };
      Font2.prototype.toBuffer = function() {
        console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.");
        return this.toArrayBuffer();
      };
      Font2.prototype.toArrayBuffer = function() {
        const sfntTable = this.toTables();
        const bytes = sfntTable.encode();
        const buffer = new ArrayBuffer(bytes.length);
        const intArray = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
          intArray[i] = bytes[i];
        }
        return buffer;
      };
      Font2.prototype.download = function() {
        console.error("DEPRECATED: platform-specific actions are to be implemented on user-side");
      };
      Font2.prototype.fsSelectionValues = {
        ITALIC: 1,
        //1
        UNDERSCORE: 2,
        //2
        NEGATIVE: 4,
        //4
        OUTLINED: 8,
        //8
        STRIKEOUT: 16,
        //16
        BOLD: 32,
        //32
        REGULAR: 64,
        //64
        USER_TYPO_METRICS: 128,
        //128
        WWS: 256,
        //256
        OBLIQUE: 512
        //512
      };
      Font2.prototype.macStyleValues = {
        BOLD: 1,
        //1
        ITALIC: 2,
        //2
        UNDERLINE: 4,
        //4
        OUTLINED: 8,
        //8
        SHADOW: 16,
        //16
        CONDENSED: 32,
        //32
        EXTENDED: 64
        //64
      };
      Font2.prototype.usWidthClasses = {
        ULTRA_CONDENSED: 1,
        EXTRA_CONDENSED: 2,
        CONDENSED: 3,
        SEMI_CONDENSED: 4,
        MEDIUM: 5,
        SEMI_EXPANDED: 6,
        EXPANDED: 7,
        EXTRA_EXPANDED: 8,
        ULTRA_EXPANDED: 9
      };
      Font2.prototype.usWeightClasses = {
        THIN: 100,
        EXTRA_LIGHT: 200,
        LIGHT: 300,
        NORMAL: 400,
        MEDIUM: 500,
        SEMI_BOLD: 600,
        BOLD: 700,
        EXTRA_BOLD: 800,
        BLACK: 900
      };
      var font_default = Font2;
      function parseHvarTable(data, start) {
        const p = new parse_default.Parser(data, start);
        const tableVersionMajor = p.parseUShort();
        const tableVersionMinor = p.parseUShort();
        if (tableVersionMajor !== 1) {
          console.warn(`Unsupported hvar table version ${tableVersionMajor}.${tableVersionMinor}`);
        }
        const version = [
          tableVersionMajor,
          tableVersionMinor
        ];
        const itemVariationStore = p.parsePointer32(function() {
          return this.parseItemVariationStore();
        });
        const advanceWidth = p.parsePointer32(function() {
          return this.parseDeltaSetIndexMap();
        });
        const lsb = p.parsePointer32(function() {
          return this.parseDeltaSetIndexMap();
        });
        const rsb = p.parsePointer32(function() {
          return this.parseDeltaSetIndexMap();
        });
        return {
          version,
          itemVariationStore,
          advanceWidth,
          lsb,
          rsb
        };
      }
      function makeHvarTable() {
        console.warn("Writing of hvar tables is not yet supported.");
      }
      var hvar_default = { make: makeHvarTable, parse: parseHvarTable };
      var attachList = function() {
        return {
          coverage: this.parsePointer(Parser.coverage),
          attachPoints: this.parseList(Parser.pointer(Parser.uShortList))
        };
      };
      var caretValue = function() {
        var format = this.parseUShort();
        check_default.argument(
          format === 1 || format === 2 || format === 3,
          "Unsupported CaretValue table version."
        );
        if (format === 1) {
          return { coordinate: this.parseShort() };
        } else if (format === 2) {
          return { pointindex: this.parseShort() };
        } else if (format === 3) {
          return { coordinate: this.parseShort() };
        }
      };
      var ligGlyph = function() {
        return this.parseList(Parser.pointer(caretValue));
      };
      var ligCaretList = function() {
        return {
          coverage: this.parsePointer(Parser.coverage),
          ligGlyphs: this.parseList(Parser.pointer(ligGlyph))
        };
      };
      var markGlyphSets = function() {
        this.parseUShort();
        return this.parseList(Parser.pointer(Parser.coverage));
      };
      function parseGDEFTable(data, start) {
        start = start || 0;
        const p = new Parser(data, start);
        const tableVersion = p.parseVersion(1);
        check_default.argument(
          tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
          "Unsupported GDEF table version."
        );
        var gdef = {
          version: tableVersion,
          classDef: p.parsePointer(Parser.classDef),
          attachList: p.parsePointer(attachList),
          ligCaretList: p.parsePointer(ligCaretList),
          markAttachClassDef: p.parsePointer(Parser.classDef)
        };
        if (tableVersion >= 1.2) {
          gdef.markGlyphSets = p.parsePointer(markGlyphSets);
        }
        return gdef;
      }
      var gdef_default = { parse: parseGDEFTable };
      var subtableParsers2 = new Array(10);
      subtableParsers2[1] = function parseLookup12() {
        const start = this.offset + this.relativeOffset;
        const posformat = this.parseUShort();
        if (posformat === 1) {
          return {
            posFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            value: this.parseValueRecord()
          };
        } else if (posformat === 2) {
          return {
            posFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            values: this.parseValueRecordList()
          };
        }
        check_default.assert(false, "0x" + start.toString(16) + ": GPOS lookup type 1 format must be 1 or 2.");
      };
      subtableParsers2[2] = function parseLookup22() {
        const start = this.offset + this.relativeOffset;
        const posFormat = this.parseUShort();
        check_default.assert(posFormat === 1 || posFormat === 2, "0x" + start.toString(16) + ": GPOS lookup type 2 format must be 1 or 2.");
        const coverage = this.parsePointer(Parser.coverage);
        const valueFormat1 = this.parseUShort();
        const valueFormat2 = this.parseUShort();
        if (posFormat === 1) {
          return {
            posFormat,
            coverage,
            valueFormat1,
            valueFormat2,
            pairSets: this.parseList(Parser.pointer(Parser.list(function() {
              return {
                // pairValueRecord
                secondGlyph: this.parseUShort(),
                value1: this.parseValueRecord(valueFormat1),
                value2: this.parseValueRecord(valueFormat2)
              };
            })))
          };
        } else if (posFormat === 2) {
          const classDef1 = this.parsePointer(Parser.classDef);
          const classDef2 = this.parsePointer(Parser.classDef);
          const class1Count = this.parseUShort();
          const class2Count = this.parseUShort();
          return {
            // Class Pair Adjustment
            posFormat,
            coverage,
            valueFormat1,
            valueFormat2,
            classDef1,
            classDef2,
            class1Count,
            class2Count,
            classRecords: this.parseList(class1Count, Parser.list(class2Count, function() {
              return {
                value1: this.parseValueRecord(valueFormat1),
                value2: this.parseValueRecord(valueFormat2)
              };
            }))
          };
        }
      };
      subtableParsers2[3] = function parseLookup32() {
        return { error: "GPOS Lookup 3 not supported" };
      };
      subtableParsers2[4] = function parseLookup42() {
        return { error: "GPOS Lookup 4 not supported" };
      };
      subtableParsers2[5] = function parseLookup52() {
        return { error: "GPOS Lookup 5 not supported" };
      };
      subtableParsers2[6] = function parseLookup62() {
        return { error: "GPOS Lookup 6 not supported" };
      };
      subtableParsers2[7] = function parseLookup72() {
        return { error: "GPOS Lookup 7 not supported" };
      };
      subtableParsers2[8] = function parseLookup82() {
        return { error: "GPOS Lookup 8 not supported" };
      };
      subtableParsers2[9] = function parseLookup9() {
        return { error: "GPOS Lookup 9 not supported" };
      };
      function parseGposTable(data, start) {
        start = start || 0;
        const p = new Parser(data, start);
        const tableVersion = p.parseVersion(1);
        check_default.argument(tableVersion === 1 || tableVersion === 1.1, "Unsupported GPOS table version " + tableVersion);
        if (tableVersion === 1) {
          return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers2)
          };
        } else {
          return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers2),
            variations: p.parseFeatureVariationsList()
          };
        }
      }
      var subtableMakers2 = new Array(10);
      function makeGposTable(gpos) {
        return new table_default.Table("GPOS", [
          { name: "version", type: "ULONG", value: 65536 },
          { name: "scripts", type: "TABLE", value: new table_default.ScriptList(gpos.scripts) },
          { name: "features", type: "TABLE", value: new table_default.FeatureList(gpos.features) },
          { name: "lookups", type: "TABLE", value: new table_default.LookupList(gpos.lookups, subtableMakers2) }
        ]);
      }
      var gpos_default = { parse: parseGposTable, make: makeGposTable };
      function parseWindowsKernTable(p) {
        const pairs = {};
        p.skip("uShort");
        const subtableVersion = p.parseUShort();
        check_default.argument(subtableVersion === 0, "Unsupported kern sub-table version.");
        p.skip("uShort", 2);
        const nPairs = p.parseUShort();
        p.skip("uShort", 3);
        for (let i = 0; i < nPairs; i += 1) {
          const leftIndex = p.parseUShort();
          const rightIndex = p.parseUShort();
          const value = p.parseShort();
          pairs[leftIndex + "," + rightIndex] = value;
        }
        return pairs;
      }
      function parseMacKernTable(p) {
        const pairs = {};
        p.skip("uShort");
        const nTables = p.parseULong();
        if (nTables > 1) {
          console.warn("Only the first kern subtable is supported.");
        }
        p.skip("uLong");
        const coverage = p.parseUShort();
        const subtableVersion = coverage & 255;
        p.skip("uShort");
        if (subtableVersion === 0) {
          const nPairs = p.parseUShort();
          p.skip("uShort", 3);
          for (let i = 0; i < nPairs; i += 1) {
            const leftIndex = p.parseUShort();
            const rightIndex = p.parseUShort();
            const value = p.parseShort();
            pairs[leftIndex + "," + rightIndex] = value;
          }
        }
        return pairs;
      }
      function parseKernTable(data, start) {
        const p = new parse_default.Parser(data, start);
        const tableVersion = p.parseUShort();
        if (tableVersion === 0) {
          return parseWindowsKernTable(p);
        } else if (tableVersion === 1) {
          return parseMacKernTable(p);
        } else {
          throw new Error("Unsupported kern table version (" + tableVersion + ").");
        }
      }
      var kern_default = { parse: parseKernTable };
      function parseLocaTable(data, start, numGlyphs, shortVersion) {
        const p = new parse_default.Parser(data, start);
        const parseFn = shortVersion ? p.parseUShort : p.parseULong;
        const glyphOffsets = [];
        for (let i = 0; i < numGlyphs + 1; i += 1) {
          let glyphOffset = parseFn.call(p);
          if (shortVersion) {
            glyphOffset *= 2;
          }
          glyphOffsets.push(glyphOffset);
        }
        return glyphOffsets;
      }
      var loca_default = { parse: parseLocaTable };
      function parseOpenTypeTableEntries(data, numTables) {
        const tableEntries = [];
        let p = 12;
        for (let i = 0; i < numTables; i += 1) {
          const tag = parse_default.getTag(data, p);
          const checksum = parse_default.getULong(data, p + 4);
          const offset = parse_default.getULong(data, p + 8);
          const length = parse_default.getULong(data, p + 12);
          tableEntries.push({ tag, checksum, offset, length, compression: false });
          p += 16;
        }
        return tableEntries;
      }
      function parseWOFFTableEntries(data, numTables) {
        const tableEntries = [];
        let p = 44;
        for (let i = 0; i < numTables; i += 1) {
          const tag = parse_default.getTag(data, p);
          const offset = parse_default.getULong(data, p + 4);
          const compLength = parse_default.getULong(data, p + 8);
          const origLength = parse_default.getULong(data, p + 12);
          let compression;
          if (compLength < origLength) {
            compression = "WOFF";
          } else {
            compression = false;
          }
          tableEntries.push({
            tag,
            offset,
            compression,
            compressedLength: compLength,
            length: origLength
          });
          p += 20;
        }
        return tableEntries;
      }
      function uncompressTable(data, tableEntry) {
        if (tableEntry.compression === "WOFF") {
          const inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
          const outBuffer = new Uint8Array(tableEntry.length);
          tinf_uncompress(inBuffer, outBuffer);
          if (outBuffer.byteLength !== tableEntry.length) {
            throw new Error("Decompression error: " + tableEntry.tag + " decompressed length doesn't match recorded length");
          }
          const view = new DataView(outBuffer.buffer, 0);
          return { data: view, offset: 0 };
        } else {
          return { data, offset: tableEntry.offset };
        }
      }
      function parseBuffer(buffer, opt = {}) {
        let indexToLocFormat;
        let ltagTable;
        const font = new font_default({ empty: true });
        if (buffer.constructor !== ArrayBuffer) {
          buffer = new Uint8Array(buffer).buffer;
        }
        const data = new DataView(buffer, 0);
        let numTables;
        let tableEntries = [];
        const signature = parse_default.getTag(data, 0);
        if (signature === String.fromCharCode(0, 1, 0, 0) || signature === "true" || signature === "typ1") {
          font.outlinesFormat = "truetype";
          numTables = parse_default.getUShort(data, 4);
          tableEntries = parseOpenTypeTableEntries(data, numTables);
        } else if (signature === "OTTO") {
          font.outlinesFormat = "cff";
          numTables = parse_default.getUShort(data, 4);
          tableEntries = parseOpenTypeTableEntries(data, numTables);
        } else if (signature === "wOFF") {
          const flavor = parse_default.getTag(data, 4);
          if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            font.outlinesFormat = "truetype";
          } else if (flavor === "OTTO") {
            font.outlinesFormat = "cff";
          } else {
            throw new Error("Unsupported OpenType flavor " + signature);
          }
          numTables = parse_default.getUShort(data, 12);
          tableEntries = parseWOFFTableEntries(data, numTables);
        } else if (signature === "wOF2") {
          const issue = "https://github.com/opentypejs/opentype.js/issues/183#issuecomment-1147228025";
          throw new Error("WOFF2 require an external decompressor library, see examples at: " + issue);
        } else {
          throw new Error("Unsupported OpenType signature " + signature);
        }
        let cffTableEntry;
        let cff2TableEntry;
        let fvarTableEntry;
        let statTableEntry;
        let gvarTableEntry;
        let cvarTableEntry;
        let avarTableEntry;
        let glyfTableEntry;
        let gdefTableEntry;
        let gposTableEntry;
        let gsubTableEntry;
        let hmtxTableEntry;
        let hvarTableEntry;
        let kernTableEntry;
        let locaTableEntry;
        let nameTableEntry;
        let metaTableEntry;
        let p;
        for (let i = 0; i < numTables; i += 1) {
          const tableEntry = tableEntries[i];
          let table;
          switch (tableEntry.tag) {
            case "avar":
              avarTableEntry = tableEntry;
              break;
            case "cmap":
              table = uncompressTable(data, tableEntry);
              font.tables.cmap = cmap_default.parse(table.data, table.offset);
              font.encoding = new CmapEncoding(font.tables.cmap);
              break;
            case "cvt ":
              table = uncompressTable(data, tableEntry);
              p = new parse_default.Parser(table.data, table.offset);
              font.tables.cvt = p.parseShortList(tableEntry.length / 2);
              break;
            case "fvar":
              fvarTableEntry = tableEntry;
              break;
            case "STAT":
              statTableEntry = tableEntry;
              break;
            case "gvar":
              gvarTableEntry = tableEntry;
              break;
            case "cvar":
              cvarTableEntry = tableEntry;
              break;
            case "fpgm":
              table = uncompressTable(data, tableEntry);
              p = new parse_default.Parser(table.data, table.offset);
              font.tables.fpgm = p.parseByteList(tableEntry.length);
              break;
            case "head":
              table = uncompressTable(data, tableEntry);
              font.tables.head = head_default.parse(table.data, table.offset);
              font.unitsPerEm = font.tables.head.unitsPerEm;
              indexToLocFormat = font.tables.head.indexToLocFormat;
              break;
            case "hhea":
              table = uncompressTable(data, tableEntry);
              font.tables.hhea = hhea_default.parse(table.data, table.offset);
              font.ascender = font.tables.hhea.ascender;
              font.descender = font.tables.hhea.descender;
              font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
              break;
            case "HVAR":
              hvarTableEntry = tableEntry;
              break;
            case "hmtx":
              hmtxTableEntry = tableEntry;
              break;
            case "ltag":
              table = uncompressTable(data, tableEntry);
              ltagTable = ltag_default.parse(table.data, table.offset);
              break;
            case "COLR":
              table = uncompressTable(data, tableEntry);
              font.tables.colr = colr_default.parse(table.data, table.offset);
              break;
            case "CPAL":
              table = uncompressTable(data, tableEntry);
              font.tables.cpal = cpal_default.parse(table.data, table.offset);
              break;
            case "maxp":
              table = uncompressTable(data, tableEntry);
              font.tables.maxp = maxp_default.parse(table.data, table.offset);
              font.numGlyphs = font.tables.maxp.numGlyphs;
              break;
            case "name":
              nameTableEntry = tableEntry;
              break;
            case "OS/2":
              table = uncompressTable(data, tableEntry);
              font.tables.os2 = os2_default.parse(table.data, table.offset);
              break;
            case "post":
              table = uncompressTable(data, tableEntry);
              font.tables.post = post_default.parse(table.data, table.offset);
              font.glyphNames = new GlyphNames(font.tables.post);
              break;
            case "prep":
              table = uncompressTable(data, tableEntry);
              p = new parse_default.Parser(table.data, table.offset);
              font.tables.prep = p.parseByteList(tableEntry.length);
              break;
            case "glyf":
              glyfTableEntry = tableEntry;
              break;
            case "loca":
              locaTableEntry = tableEntry;
              break;
            case "CFF ":
              cffTableEntry = tableEntry;
              break;
            case "CFF2":
              cff2TableEntry = tableEntry;
              break;
            case "kern":
              kernTableEntry = tableEntry;
              break;
            case "GDEF":
              gdefTableEntry = tableEntry;
              break;
            case "GPOS":
              gposTableEntry = tableEntry;
              break;
            case "GSUB":
              gsubTableEntry = tableEntry;
              break;
            case "meta":
              metaTableEntry = tableEntry;
              break;
            case "gasp":
              try {
                table = uncompressTable(data, tableEntry);
                font.tables.gasp = gasp_default.parse(table.data, table.offset);
              } catch (e) {
                console.warn("Failed to parse gasp table, skipping.");
                console.warn(e);
              }
              break;
            case "SVG ":
              table = uncompressTable(data, tableEntry);
              font.tables.svg = svg_default.parse(table.data, table.offset);
              break;
            default:
              break;
          }
        }
        const nameTable = uncompressTable(data, nameTableEntry);
        font.tables.name = name_default.parse(nameTable.data, nameTable.offset, ltagTable);
        font.names = font.tables.name;
        if (glyfTableEntry && locaTableEntry) {
          const shortVersion = indexToLocFormat === 0;
          const locaTable = uncompressTable(data, locaTableEntry);
          const locaOffsets = loca_default.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
          const glyfTable = uncompressTable(data, glyfTableEntry);
          font.glyphs = glyf_default.parse(glyfTable.data, glyfTable.offset, locaOffsets, font, opt);
        } else if (cffTableEntry) {
          const cffTable = uncompressTable(data, cffTableEntry);
          cff_default.parse(cffTable.data, cffTable.offset, font, opt);
        } else if (cff2TableEntry) {
          const cffTable2 = uncompressTable(data, cff2TableEntry);
          cff_default.parse(cffTable2.data, cffTable2.offset, font, opt);
        } else {
          throw new Error("Font doesn't contain TrueType, CFF or CFF2 outlines.");
        }
        const hmtxTable = uncompressTable(data, hmtxTableEntry);
        hmtx_default.parse(font, hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs, opt);
        addGlyphNames(font, opt);
        if (kernTableEntry) {
          const kernTable = uncompressTable(data, kernTableEntry);
          font.kerningPairs = kern_default.parse(kernTable.data, kernTable.offset);
        } else {
          font.kerningPairs = {};
        }
        if (gdefTableEntry) {
          const gdefTable = uncompressTable(data, gdefTableEntry);
          font.tables.gdef = gdef_default.parse(gdefTable.data, gdefTable.offset);
        }
        if (gposTableEntry) {
          const gposTable = uncompressTable(data, gposTableEntry);
          font.tables.gpos = gpos_default.parse(gposTable.data, gposTable.offset);
          font.position.init();
        }
        if (gsubTableEntry) {
          const gsubTable = uncompressTable(data, gsubTableEntry);
          font.tables.gsub = gsub_default.parse(gsubTable.data, gsubTable.offset);
        }
        if (fvarTableEntry) {
          const fvarTable = uncompressTable(data, fvarTableEntry);
          font.tables.fvar = fvar_default.parse(fvarTable.data, fvarTable.offset, font.names);
        }
        if (statTableEntry) {
          const statTable = uncompressTable(data, statTableEntry);
          font.tables.stat = stat_default.parse(statTable.data, statTable.offset, font.tables.fvar);
        }
        if (gvarTableEntry) {
          if (!fvarTableEntry) {
            console.warn("This font provides a gvar table, but no fvar table, which is required for variable fonts.");
          }
          if (!glyfTableEntry) {
            console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");
          }
          const gvarTable = uncompressTable(data, gvarTableEntry);
          font.tables.gvar = gvar_default.parse(gvarTable.data, gvarTable.offset, font.tables.fvar, font.glyphs);
        }
        if (cvarTableEntry) {
          if (!fvarTableEntry) {
            console.warn("This font provides a cvar table, but no fvar table, which is required for variable fonts.");
          }
          if (!font.tables.cvt) {
            console.warn("This font provides a cvar table, but no cvt table which could be made variable.");
          }
          if (!glyfTableEntry) {
            console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");
          }
          const cvarTable = uncompressTable(data, cvarTableEntry);
          font.tables.cvar = cvar_default.parse(cvarTable.data, cvarTable.offset, font.tables.fvar, font.tables.cvt || []);
        }
        if (avarTableEntry) {
          if (!fvarTableEntry) {
            console.warn("This font provides an avar table, but no fvar table, which is required for variable fonts.");
          }
          const avarTable = uncompressTable(data, avarTableEntry);
          font.tables.avar = avar_default.parse(avarTable.data, avarTable.offset, font.tables.fvar);
        }
        if (hvarTableEntry) {
          if (!fvarTableEntry) {
            console.warn("This font provides an HVAR table, but no fvar table, which is required for variable fonts.");
          }
          if (!hmtxTableEntry) {
            console.warn("This font provides an HVAR table, but no hmtx table to vary.");
          }
          const hvarTable = uncompressTable(data, hvarTableEntry);
          font.tables.hvar = hvar_default.parse(hvarTable.data, hvarTable.offset, font.tables.fvar);
        }
        if (metaTableEntry) {
          const metaTable = uncompressTable(data, metaTableEntry);
          font.tables.meta = meta_default.parse(metaTable.data, metaTable.offset);
          font.metas = font.tables.meta;
        }
        font.palettes = new PaletteManager(font);
        return font;
      }
      function load() {
        console.error("DEPRECATED! migrate to: opentype.parse(buffer, opt) See: https://github.com/opentypejs/opentype.js/issues/675");
      }
      function loadSync() {
        console.error('DEPRECATED! migrate to: opentype.parse(require("fs").readFileSync(url), opt)');
      }
      return __toCommonJS(opentype_exports);
    })();
    (function(root, factory) {
      if (typeof define === "function" && define.amd) define(factory);
      else if (typeof module === "object" && module.exports) module.exports = factory();
      else root.opentype = factory();
    })(typeof self !== "undefined" ? self : exports, () => ({ ...opentype3, "default": opentype3 }));
  }
});

// atoms/annons/bygg.ts
import { mkdirSync, mkdtempSync, readFileSync as readFileSync2, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join as join2, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// node_modules/mupdf/dist/mupdf-wasm.js
var _ = async function(_2 = {}) {
  var a, e, t = _2, s = new Promise((_3, t2) => {
    a = _3, e = t2;
  }), n = "object" == typeof window, i = "undefined" != typeof WorkerGlobalScope, m = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node && "renderer" != process.type;
  if (m) {
    const { createRequire: _3 } = await import("module");
    var o = _3(import.meta.url);
  }
  var r, p, d = "./this.program", w = (_3, a2) => {
    throw a2;
  }, f = import.meta.url, l = "";
  if (m) {
    var c = o("fs"), g = o("path");
    f.startsWith("file:") && (l = g.dirname(o("url").fileURLToPath(f)) + "/"), p = (_3) => (_3 = U(_3) ? new URL(_3) : _3, c.readFileSync(_3)), r = async (_3, a2 = true) => (_3 = U(_3) ? new URL(_3) : _3, c.readFileSync(_3, a2 ? void 0 : "utf8")), process.argv.length > 1 && (d = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), w = (_3, a2) => {
      throw process.exitCode = _3, a2;
    };
  } else if (n || i) {
    try {
      l = new URL(".", f).href;
    } catch {
    }
    i && (p = (_3) => {
      var a2 = new XMLHttpRequest();
      return a2.open("GET", _3, false), a2.responseType = "arraybuffer", a2.send(null), new Uint8Array(a2.response);
    }), r = async (_3) => {
      if (U(_3)) return new Promise((a3, e2) => {
        var t2 = new XMLHttpRequest();
        t2.open("GET", _3, true), t2.responseType = "arraybuffer", t2.onload = () => {
          200 == t2.status || 0 == t2.status && t2.response ? a3(t2.response) : e2(t2.status);
        }, t2.onerror = e2, t2.send(null);
      });
      var a2 = await fetch(_3, { credentials: "same-origin" });
      if (a2.ok) return a2.arrayBuffer();
      throw new Error(a2.status + " : " + a2.url);
    };
  }
  var u, b, h, v, y, x, k, T = console.log.bind(console), j = console.error.bind(console), $ = false, A = false, U = (_3) => _3.startsWith("file://");
  function R() {
    var _3 = b.buffer;
    new Int8Array(_3), new Int16Array(_3), t.HEAPU8 = h = new Uint8Array(_3), new Uint16Array(_3), t.HEAP32 = v = new Int32Array(_3), t.HEAPU32 = y = new Uint32Array(_3), t.HEAPF32 = new Float32Array(_3), k = new Float64Array(_3), x = new BigInt64Array(_3), new BigUint64Array(_3);
  }
  var E, C = 0, S = null;
  function M(_3) {
    t.onAbort?.(_3), j(_3 = "Aborted(" + _3 + ")"), $ = true, _3 += ". Build with -sASSERTIONS for more info.", A && p_();
    var a2 = new WebAssembly.RuntimeError(_3);
    throw e(a2), a2;
  }
  function D() {
    return t.locateFile ? (_3 = "mupdf-wasm.wasm", t.locateFile ? t.locateFile(_3, l) : l + _3) : new URL("mupdf-wasm.wasm", import.meta.url).href;
    var _3;
  }
  async function F(_3) {
    if (!u) try {
      var a2 = await r(_3);
      return new Uint8Array(a2);
    } catch {
    }
    return (function(_4) {
      if (_4 == E && u) return new Uint8Array(u);
      if (p) return p(_4);
      throw "both async and sync fetching of the wasm failed";
    })(_3);
  }
  async function I(_3, a2, e2) {
    if (!_3 && "function" == typeof WebAssembly.instantiateStreaming && !U(a2) && !m) try {
      var t2 = fetch(a2, { credentials: "same-origin" });
      return await WebAssembly.instantiateStreaming(t2, e2);
    } catch (_4) {
      j(`wasm streaming compile failed: ${_4}`), j("falling back to ArrayBuffer instantiation");
    }
    return (async function(_4, a3) {
      try {
        var e3 = await F(_4);
        return await WebAssembly.instantiate(e3, a3);
      } catch (_5) {
        j(`failed to asynchronously prepare wasm: ${_5}`), M(_5);
      }
    })(a2, e2);
  }
  class P {
    name = "ExitStatus";
    constructor(_3) {
      this.message = `Program terminated with exit(${_3})`, this.status = _3;
    }
  }
  var B = (_3) => {
    for (; _3.length > 0; ) _3.shift()(t);
  }, q = [], L = (_3) => q.push(_3), z = [], H = (_3) => z.push(_3), W = true, N = new TextDecoder(), G = (_3, a2) => {
    if (!_3) return "";
    for (var e2 = _3 + a2, t2 = _3; !(t2 >= e2) && h[t2]; ) ++t2;
    return N.decode(h.subarray(_3, t2));
  }, O = { varargs: void 0, getStr: (_3) => G(_3) }, Y = (_3) => _3 < -9007199254740992 || _3 > 9007199254740992 ? NaN : Number(_3), X = (_3, a2, e2) => ((_4, a3, e3, t2) => {
    if (!(t2 > 0)) return 0;
    for (var s2 = e3, n2 = e3 + t2 - 1, i2 = 0; i2 < _4.length; ++i2) {
      var m2 = _4.charCodeAt(i2);
      if (m2 >= 55296 && m2 <= 57343 && (m2 = 65536 + ((1023 & m2) << 10) | 1023 & _4.charCodeAt(++i2)), m2 <= 127) {
        if (e3 >= n2) break;
        a3[e3++] = m2;
      } else if (m2 <= 2047) {
        if (e3 + 1 >= n2) break;
        a3[e3++] = 192 | m2 >> 6, a3[e3++] = 128 | 63 & m2;
      } else if (m2 <= 65535) {
        if (e3 + 2 >= n2) break;
        a3[e3++] = 224 | m2 >> 12, a3[e3++] = 128 | m2 >> 6 & 63, a3[e3++] = 128 | 63 & m2;
      } else {
        if (e3 + 3 >= n2) break;
        a3[e3++] = 240 | m2 >> 18, a3[e3++] = 128 | m2 >> 12 & 63, a3[e3++] = 128 | m2 >> 6 & 63, a3[e3++] = 128 | 63 & m2;
      }
    }
    return a3[e3] = 0, e3 - s2;
  })(_3, h, a2, e2), J = () => Date.now(), K = [], Q = (_3, a2, e2) => {
    var t2 = ((_4, a3) => {
      var e3;
      for (K.length = 0; e3 = h[_4++]; ) {
        var t3 = 105 != e3;
        a3 += (t3 &= 112 != e3) && a3 % 8 ? 4 : 0, K.push(112 == e3 ? y[a3 >> 2] : 106 == e3 ? x[a3 >> 3] : 105 == e3 ? v[a3 >> 2] : k[a3 >> 3]), a3 += t3 ? 8 : 4;
      }
      return K;
    })(a2, e2);
    return m_[_3](...t2);
  }, V = (_3, a2) => Math.ceil(_3 / a2) * a2, Z = (_3) => {
    var a2 = (_3 - b.buffer.byteLength + 65535) / 65536 | 0;
    try {
      return b.grow(a2), R(), 1;
    } catch (_4) {
    }
  }, __ = {}, a_ = () => {
    if (!a_.strings) {
      var _3 = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: d || "./this.program" };
      for (var a2 in __) void 0 === __[a2] ? delete _3[a2] : _3[a2] = __[a2];
      var e2 = [];
      for (var a2 in _3) e2.push(`${a2}=${_3[a2]}`);
      a_.strings = e2;
    }
    return a_.strings;
  }, e_ = (_3) => {
    for (var a2 = 0, e2 = 0; e2 < _3.length; ++e2) {
      var t2 = _3.charCodeAt(e2);
      t2 <= 127 ? a2++ : t2 <= 2047 ? a2 += 2 : t2 >= 55296 && t2 <= 57343 ? (a2 += 4, ++e2) : a2 += 3;
    }
    return a2;
  }, t_ = (_3) => {
    W || (t.onExit?.(_3), $ = true), w(_3, new P(_3));
  }, s_ = (_3, a2) => {
    t_(_3);
  }, n_ = [null, [], []], i_ = (_3, a2) => {
    var e2 = n_[_3];
    0 === a2 || 10 === a2 ? ((1 === _3 ? T : j)(((_4, a3 = 0, e3 = NaN) => {
      for (var t2 = a3 + e3, s2 = a3; _4[s2] && !(s2 >= t2); ) ++s2;
      return N.decode(_4.buffer ? _4.subarray(a3, s2) : new Uint8Array(_4.slice(a3, s2)));
    })(e2)), e2.length = 0) : e2.push(a2);
  };
  t.noExitRuntime && (W = t.noExitRuntime), t.print && (T = t.print), t.printErr && (j = t.printErr), t.wasmBinary && (u = t.wasmBinary), t.arguments && t.arguments, t.thisProgram && (d = t.thisProgram), t.UTF8ToString = G, t.stringToUTF8 = X, t.lengthBytesUTF8 = e_;
  var m_ = { 6168464: () => {
    throw "TRYLATER";
  }, 6168486: () => {
    throw "ABORT";
  }, 6168505: (_3) => {
    throw new Error(G(_3));
  }, 6168544: () => {
    throw new Error("Cannot create MuPDF context!");
  }, 6168597: (_3, a2, e2, t2, s2, n2, i2) => {
    globalThis.$libmupdf_text_walk.begin_span(_3, a2, e2, t2, s2, n2, i2);
  }, 6168671: (_3, a2, e2, t2, s2, n2, i2, m2) => {
    globalThis.$libmupdf_text_walk.show_glyph(_3, a2, e2, t2, s2, n2, i2, m2);
  }, 6168749: (_3) => {
    globalThis.$libmupdf_text_walk.end_span(_3);
  }, 6168797: (_3, a2, e2, t2) => globalThis.$libmupdf_load_font_file(_3, a2, e2, t2), 6168860: (_3, a2, e2, t2) => globalThis.$libmupdf_stm_read(_3, a2, e2, t2), 6168918: (_3) => {
    globalThis.$libmupdf_stm_close(_3);
  }, 6168958: (_3, a2, e2, t2) => globalThis.$libmupdf_stm_seek(_3, a2, e2, t2), 6169016: (_3, a2, e2) => {
    globalThis.$libmupdf_path_walk.moveto(_3, a2, e2);
  }, 6169070: (_3, a2, e2) => {
    globalThis.$libmupdf_path_walk.lineto(_3, a2, e2);
  }, 6169124: (_3, a2, e2, t2, s2, n2, i2) => {
    globalThis.$libmupdf_path_walk.curveto(_3, a2, e2, t2, s2, n2, i2);
  }, 6169195: (_3) => {
    globalThis.$libmupdf_path_walk.closepath(_3);
  }, 6169244: (_3) => {
    globalThis.$libmupdf_log_error(_3);
  }, 6169283: (_3) => {
    globalThis.$libmupdf_log_warning(_3);
  }, 6169324: (_3) => {
    globalThis.$libmupdf_device.close_device(_3);
  }, 6169373: (_3) => {
    globalThis.$libmupdf_device.drop_device(_3);
  }, 6169421: (_3, a2, e2, t2, s2, n2, i2, m2) => {
    globalThis.$libmupdf_device.fill_path(_3, a2, e2, t2, s2, n2, i2, m2);
  }, 6169495: (_3, a2, e2, t2, s2, n2, i2, m2) => {
    globalThis.$libmupdf_device.stroke_path(_3, a2, e2, t2, s2, n2, i2, m2);
  }, 6169571: (_3, a2, e2, t2) => {
    globalThis.$libmupdf_device.clip_path(_3, a2, e2, t2);
  }, 6169629: (_3, a2, e2, t2) => {
    globalThis.$libmupdf_device.clip_stroke_path(_3, a2, e2, t2);
  }, 6169694: (_3, a2, e2, t2, s2, n2, i2) => {
    globalThis.$libmupdf_device.fill_text(_3, a2, e2, t2, s2, n2, i2);
  }, 6169764: (_3, a2, e2, t2, s2, n2, i2, m2) => {
    globalThis.$libmupdf_device.stroke_text(_3, a2, e2, t2, s2, n2, i2, m2);
  }, 6169840: (_3, a2, e2) => {
    globalThis.$libmupdf_device.clip_text(_3, a2, e2);
  }, 6169894: (_3, a2, e2, t2) => {
    globalThis.$libmupdf_device.clip_stroke_text(_3, a2, e2, t2);
  }, 6169959: (_3, a2, e2) => {
    globalThis.$libmupdf_device.ignore_text(_3, a2, e2);
  }, 6170015: (_3, a2, e2, t2) => {
    globalThis.$libmupdf_device.fill_shade(_3, a2, e2, t2);
  }, 6170074: (_3, a2, e2, t2) => {
    globalThis.$libmupdf_device.fill_image(_3, a2, e2, t2);
  }, 6170133: (_3, a2, e2, t2, s2, n2, i2) => {
    globalThis.$libmupdf_device.fill_image_mask(_3, a2, e2, t2, s2, n2, i2);
  }, 6170209: (_3, a2, e2) => {
    globalThis.$libmupdf_device.clip_image_mask(_3, a2, e2);
  }, 6170269: (_3) => {
    globalThis.$libmupdf_device.pop_clip(_3);
  }, 6170314: (_3, a2, e2, t2, s2, n2) => {
    globalThis.$libmupdf_device.begin_mask(_3, a2, e2, t2, s2, n2);
  }, 6170381: (_3, a2) => {
    globalThis.$libmupdf_device.end_mask(_3, a2);
  }, 6170430: (_3, a2, e2, t2, s2, n2, i2) => {
    globalThis.$libmupdf_device.begin_group(_3, a2, e2, t2, s2, n2, i2);
  }, 6170502: (_3) => {
    globalThis.$libmupdf_device.end_group(_3);
  }, 6170548: (_3, a2, e2, t2, s2, n2, i2) => globalThis.$libmupdf_device.begin_tile(_3, a2, e2, t2, s2, n2, i2), 6170626: (_3) => {
    globalThis.$libmupdf_device.end_tile(_3);
  }, 6170671: (_3, a2) => {
    globalThis.$libmupdf_device.begin_layer(_3, a2);
  }, 6170723: (_3) => {
    globalThis.$libmupdf_device.end_layer(_3);
  } }, o_ = { g: function(_3, a2, e2) {
    return O.varargs = e2, 0;
  }, v: function(_3, a2) {
    a2 = Y(a2);
  }, u: function(_3, a2, e2) {
    return O.varargs = e2, 0;
  }, f: function(_3, a2, e2, t2) {
    O.varargs = t2;
  }, t: (_3) => {
  }, e: (_3, a2, e2) => {
  }, n: () => M(""), m: function(_3, a2) {
    _3 = Y(_3);
    var e2 = new Date(1e3 * _3);
    v[a2 >> 2] = e2.getUTCSeconds(), v[a2 + 4 >> 2] = e2.getUTCMinutes(), v[a2 + 8 >> 2] = e2.getUTCHours(), v[a2 + 12 >> 2] = e2.getUTCDate(), v[a2 + 16 >> 2] = e2.getUTCMonth(), v[a2 + 20 >> 2] = e2.getUTCFullYear() - 1900, v[a2 + 24 >> 2] = e2.getUTCDay();
    var t2 = Date.UTC(e2.getUTCFullYear(), 0, 1, 0, 0, 0, 0), s2 = (e2.getTime() - t2) / 864e5 | 0;
    v[a2 + 28 >> 2] = s2;
  }, l: function(_3) {
    var a2 = (() => {
      var a3 = Date.UTC(v[_3 + 20 >> 2] + 1900, v[_3 + 16 >> 2], v[_3 + 12 >> 2], v[_3 + 8 >> 2], v[_3 + 4 >> 2], v[_3 >> 2], 0), e2 = new Date(a3);
      v[_3 + 24 >> 2] = e2.getUTCDay();
      var t2 = Date.UTC(e2.getUTCFullYear(), 0, 1, 0, 0, 0, 0), s2 = (e2.getTime() - t2) / 864e5 | 0;
      return v[_3 + 28 >> 2] = s2, e2.getTime() / 1e3;
    })();
    return BigInt(a2);
  }, k: (_3, a2, e2, t2) => {
    var s2 = (/* @__PURE__ */ new Date()).getFullYear(), n2 = new Date(s2, 0, 1), i2 = new Date(s2, 6, 1), m2 = n2.getTimezoneOffset(), o2 = i2.getTimezoneOffset(), r2 = Math.max(m2, o2);
    y[_3 >> 2] = 60 * r2, v[a2 >> 2] = Number(m2 != o2);
    var p2 = (_4) => {
      var a3 = _4 >= 0 ? "-" : "+", e3 = Math.abs(_4);
      return `UTC${a3}${String(Math.floor(e3 / 60)).padStart(2, "0")}${String(e3 % 60).padStart(2, "0")}`;
    }, d2 = p2(m2), w2 = p2(o2);
    o2 < m2 ? (X(d2, e2, 17), X(w2, t2, 17)) : (X(d2, t2, 17), X(w2, e2, 17));
  }, s: function(_3, a2, e2) {
    if (a2 = Y(a2), !((t2 = _3) >= 0 && t2 <= 3)) return 28;
    var t2, s2;
    s2 = 0 === _3 ? J() : performance.now();
    var n2 = Math.round(1e3 * s2 * 1e3);
    return x[e2 >> 3] = BigInt(n2), 0;
  }, a: (_3, a2, e2) => Q(_3, a2, e2), j: (_3, a2, e2) => Q(_3, a2, e2), i: J, h: (_3) => {
    var a2 = h.length, e2 = 2147483648;
    if ((_3 >>>= 0) > e2) return false;
    for (var t2 = 1; t2 <= 4; t2 *= 2) {
      var s2 = a2 * (1 + 0.2 / t2);
      s2 = Math.min(s2, _3 + 100663296);
      var n2 = Math.min(e2, V(Math.max(_3, s2), 65536));
      if (Z(n2)) return true;
    }
    return false;
  }, r: (_3, a2) => {
    var e2 = 0, t2 = 0;
    for (var s2 of a_()) {
      var n2 = a2 + e2;
      y[_3 + t2 >> 2] = n2, e2 += X(s2, n2, 1 / 0) + 1, t2 += 4;
    }
    return 0;
  }, q: (_3, a2) => {
    var e2 = a_();
    y[_3 >> 2] = e2.length;
    var t2 = 0;
    for (var s2 of e2) t2 += e_(s2) + 1;
    return y[a2 >> 2] = t2, 0;
  }, b: s_, d: (_3) => 52, p: (_3, a2, e2, t2) => 52, o: function(_3, a2, e2, t2) {
    return a2 = Y(a2), 70;
  }, c: (_3, a2, e2, t2) => {
    for (var s2 = 0, n2 = 0; n2 < e2; n2++) {
      var i2 = y[a2 >> 2], m2 = y[a2 + 4 >> 2];
      a2 += 8;
      for (var o2 = 0; o2 < m2; o2++) i_(_3, h[i2 + o2]);
      s2 += m2;
    }
    return y[t2 >> 2] = s2, 0;
  } }, r_ = await (async function() {
    function _3(_4, a3) {
      return r_ = _4.exports, b = r_.w, R(), (function() {
        if (C--, t.monitorRunDependencies?.(C), 0 == C && S) {
          var _5 = S;
          S = null, _5();
        }
      })(), r_;
    }
    C++, t.monitorRunDependencies?.(C);
    var a2 = { a: o_ };
    if (t.instantiateWasm) return new Promise((e2, s3) => {
      t.instantiateWasm(a2, (a3, t2) => {
        e2(_3(a3));
      });
    });
    E ??= D();
    try {
      var s2 = (function(a3) {
        return _3(a3.instance);
      })(await I(u, E, a2));
      return s2;
    } catch (_4) {
      return e(_4), Promise.reject(_4);
    }
  })(), p_ = (r_.x, t._wasm_init_context = r_.y, t._wasm_malloc = r_.z, t._wasm_free = r_.A, t._wasm_enable_icc = r_.B, t._wasm_disable_icc = r_.C, t._wasm_set_user_css = r_.D, t._wasm_empty_store = r_.E, t._wasm_shrink_store = r_.F, t._wasm_Memento_checkAllMemory = r_.G, t._wasm_Memento_listBlocks = r_.H, t._wasm_keep_buffer = r_.I, t._wasm_drop_buffer = r_.J, t._wasm_keep_stream = r_.K, t._wasm_drop_stream = r_.L, t._wasm_keep_colorspace = r_.M, t._wasm_drop_colorspace = r_.N, t._wasm_keep_pixmap = r_.O, t._wasm_drop_pixmap = r_.P, t._wasm_keep_font = r_.Q, t._wasm_drop_font = r_.R, t._wasm_keep_stroke_state = r_.S, t._wasm_drop_stroke_state = r_.T, t._wasm_keep_image = r_.U, t._wasm_drop_image = r_.V, t._wasm_keep_shade = r_.W, t._wasm_drop_shade = r_.X, t._wasm_keep_path = r_.Y, t._wasm_drop_path = r_.Z, t._wasm_keep_text = r_._, t._wasm_drop_text = r_.$, t._wasm_keep_device = r_.aa, t._wasm_drop_device = r_.ba, t._wasm_keep_display_list = r_.ca, t._wasm_drop_display_list = r_.da, t._wasm_drop_stext_page = r_.ea, t._wasm_drop_document_writer = r_.fa, t._wasm_drop_outline_iterator = r_.ga, t._wasm_keep_document = r_.ha, t._wasm_drop_document = r_.ia, t._wasm_keep_page = r_.ja, t._wasm_drop_page = r_.ka, t._wasm_keep_link = r_.la, t._wasm_drop_link = r_.ma, t._wasm_keep_outline = r_.na, t._wasm_drop_outline = r_.oa, t._wasm_pdf_keep_annot = r_.pa, t._wasm_pdf_drop_annot = r_.qa, t._wasm_pdf_keep_obj = r_.ra, t._wasm_pdf_drop_obj = r_.sa, t._wasm_pdf_keep_graft_map = r_.ta, t._wasm_pdf_drop_graft_map = r_.ua, t._wasm_buffer_get_data = r_.va, t._wasm_buffer_get_len = r_.wa, t._wasm_colorspace_get_type = r_.xa, t._wasm_colorspace_get_n = r_.ya, t._wasm_colorspace_get_name = r_.za, t._wasm_pixmap_get_w = r_.Aa, t._wasm_pixmap_get_h = r_.Ba, t._wasm_pixmap_get_x = r_.Ca, t._wasm_pixmap_get_y = r_.Da, t._wasm_pixmap_get_n = r_.Ea, t._wasm_pixmap_get_stride = r_.Fa, t._wasm_pixmap_get_alpha = r_.Ga, t._wasm_pixmap_get_xres = r_.Ha, t._wasm_pixmap_get_yres = r_.Ia, t._wasm_pixmap_get_colorspace = r_.Ja, t._wasm_pixmap_get_samples = r_.Ka, t._wasm_pixmap_set_xres = r_.La, t._wasm_pixmap_set_yres = r_.Ma, t._wasm_font_get_name = r_.Na, t._wasm_stroke_state_get_start_cap = r_.Oa, t._wasm_stroke_state_set_start_cap = r_.Pa, t._wasm_stroke_state_get_dash_cap = r_.Qa, t._wasm_stroke_state_set_dash_cap = r_.Ra, t._wasm_stroke_state_get_end_cap = r_.Sa, t._wasm_stroke_state_set_end_cap = r_.Ta, t._wasm_stroke_state_get_linejoin = r_.Ua, t._wasm_stroke_state_set_linejoin = r_.Va, t._wasm_stroke_state_get_linewidth = r_.Wa, t._wasm_stroke_state_set_linewidth = r_.Xa, t._wasm_stroke_state_get_miterlimit = r_.Ya, t._wasm_stroke_state_set_miterlimit = r_.Za, t._wasm_stroke_state_get_dash_phase = r_._a, t._wasm_stroke_state_set_dash_phase = r_.$a, t._wasm_stroke_state_get_dash_len = r_.ab, t._wasm_image_get_w = r_.bb, t._wasm_image_get_h = r_.cb, t._wasm_image_get_n = r_.db, t._wasm_image_get_bpc = r_.eb, t._wasm_image_get_xres = r_.fb, t._wasm_image_get_yres = r_.gb, t._wasm_image_get_imagemask = r_.hb, t._wasm_image_get_colorspace = r_.ib, t._wasm_image_get_mask = r_.jb, t._wasm_outline_get_title = r_.kb, t._wasm_outline_get_uri = r_.lb, t._wasm_outline_get_next = r_.mb, t._wasm_outline_get_down = r_.nb, t._wasm_outline_get_is_open = r_.ob, t._wasm_outline_item_get_title = r_.pb, t._wasm_outline_item_get_uri = r_.qb, t._wasm_outline_item_get_is_open = r_.rb, t._wasm_link_get_rect = r_.sb, t._wasm_link_get_uri = r_.tb, t._wasm_link_get_next = r_.ub, t._wasm_stext_page_get_mediabox = r_.vb, t._wasm_stext_page_get_first_block = r_.wb, t._wasm_stext_block_get_next = r_.xb, t._wasm_stext_block_get_type = r_.yb, t._wasm_stext_block_get_bbox = r_.zb, t._wasm_stext_block_get_first_line = r_.Ab, t._wasm_stext_block_get_transform = r_.Bb, t._wasm_stext_block_get_image = r_.Cb, t._wasm_stext_block_get_v_flags = r_.Db, t._wasm_stext_block_get_v_argb = r_.Eb, t._wasm_stext_line_get_next = r_.Fb, t._wasm_stext_line_get_wmode = r_.Gb, t._wasm_stext_line_get_dir = r_.Hb, t._wasm_stext_line_get_bbox = r_.Ib, t._wasm_stext_line_get_first_char = r_.Jb, t._wasm_stext_char_get_next = r_.Kb, t._wasm_stext_char_get_c = r_.Lb, t._wasm_stext_char_get_origin = r_.Mb, t._wasm_stext_char_get_quad = r_.Nb, t._wasm_stext_char_get_size = r_.Ob, t._wasm_stext_char_get_font = r_.Pb, t._wasm_stext_char_get_argb = r_.Qb, t._wasm_stext_char_get_bidi = r_.Rb, t._wasm_link_dest_get_chapter = r_.Sb, t._wasm_link_dest_get_page = r_.Tb, t._wasm_link_dest_get_type = r_.Ub, t._wasm_link_dest_get_x = r_.Vb, t._wasm_link_dest_get_y = r_.Wb, t._wasm_link_dest_get_w = r_.Xb, t._wasm_link_dest_get_h = r_.Yb, t._wasm_link_dest_get_zoom = r_.Zb, t._wasm_pdf_layer_config_ui_get_text = r_._b, t._wasm_pdf_layer_config_ui_get_depth = r_.$b, t._wasm_pdf_layer_config_ui_get_type = r_.ac, t._wasm_pdf_layer_config_ui_get_selected = r_.bc, t._wasm_pdf_layer_config_ui_get_locked = r_.cc, t._wasm_pdf_filespec_params_get_filename = r_.dc, t._wasm_pdf_filespec_params_get_mimetype = r_.ec, t._wasm_pdf_filespec_params_get_size = r_.fc, t._wasm_pdf_filespec_params_get_created = r_.gc, t._wasm_pdf_filespec_params_get_modified = r_.hc, t._wasm_pdf_page_get_obj = r_.ic, t._wasm_new_buffer = r_.jc, t._wasm_new_buffer_from_data = r_.kc, t._wasm_append_string = r_.lc, t._wasm_append_byte = r_.mc, t._wasm_append_buffer = r_.nc, t._wasm_slice_buffer = r_.oc, t._wasm_string_from_buffer = r_.pc, t._wasm_device_gray = r_.qc, t._wasm_device_rgb = r_.rc, t._wasm_device_bgr = r_.sc, t._wasm_device_cmyk = r_.tc, t._wasm_device_lab = r_.uc, t._wasm_new_icc_colorspace = r_.vc, t._wasm_new_stroke_state = r_.wc, t._wasm_stroke_state_get_dash_item = r_.xc, t._wasm_stroke_state_set_dash_item = r_.yc, t._wasm_new_base14_font = r_.zc, t._wasm_new_cjk_font = r_.Ac, t._wasm_new_font_from_buffer = r_.Bc, t._wasm_encode_character = r_.Cc, t._wasm_advance_glyph = r_.Dc, t._wasm_font_is_monospaced = r_.Ec, t._wasm_font_is_serif = r_.Fc, t._wasm_font_is_bold = r_.Gc, t._wasm_font_is_italic = r_.Hc, t._wasm_new_image_from_pixmap = r_.Ic, t._wasm_new_image_from_buffer = r_.Jc, t._wasm_get_pixmap_from_image = r_.Kc, t._wasm_new_pixmap_from_page = r_.Lc, t._wasm_new_pixmap_from_page_contents = r_.Mc, t._wasm_pdf_new_pixmap_from_page_with_usage = r_.Nc, t._wasm_pdf_new_pixmap_from_page_contents_with_usage = r_.Oc, t._wasm_new_pixmap_with_bbox = r_.Pc, t._wasm_clear_pixmap = r_.Qc, t._wasm_clear_pixmap_with_value = r_.Rc, t._wasm_invert_pixmap = r_.Sc, t._wasm_invert_pixmap_luminance = r_.Tc, t._wasm_gamma_pixmap = r_.Uc, t._wasm_tint_pixmap = r_.Vc, t._wasm_new_buffer_from_pixmap_as_png = r_.Wc, t._wasm_new_buffer_from_pixmap_as_pam = r_.Xc, t._wasm_new_buffer_from_pixmap_as_psd = r_.Yc, t._wasm_new_buffer_from_pixmap_as_jpeg = r_.Zc, t._wasm_convert_pixmap = r_._c, t._wasm_warp_pixmap = r_.$c, t._wasm_bound_shade = r_.ad, t._wasm_new_display_list = r_.bd, t._wasm_bound_display_list = r_.cd, t._wasm_run_display_list = r_.dd, t._wasm_new_pixmap_from_display_list = r_.ed, t._wasm_new_stext_page_from_display_list = r_.fd, t._wasm_search_display_list = r_.gd, t._wasm_new_path = r_.hd, t._wasm_moveto = r_.id, t._wasm_lineto = r_.jd, t._wasm_curveto = r_.kd, t._wasm_curvetov = r_.ld, t._wasm_curvetoy = r_.md, t._wasm_closepath = r_.nd, t._wasm_rectto = r_.od, t._wasm_transform_path = r_.pd, t._wasm_bound_path = r_.qd, t._wasm_new_text = r_.rd, t._wasm_bound_text = r_.sd, t._wasm_show_glyph = r_.td, t._wasm_show_string = r_.ud, t._wasm_new_draw_device = r_.vd, t._wasm_new_display_list_device = r_.wd, t._wasm_close_device = r_.xd, t._wasm_fill_path = r_.yd, t._wasm_stroke_path = r_.zd, t._wasm_clip_path = r_.Ad, t._wasm_clip_stroke_path = r_.Bd, t._wasm_fill_text = r_.Cd, t._wasm_stroke_text = r_.Dd, t._wasm_clip_text = r_.Ed, t._wasm_clip_stroke_text = r_.Fd, t._wasm_ignore_text = r_.Gd, t._wasm_fill_shade = r_.Hd, t._wasm_fill_image = r_.Id, t._wasm_fill_image_mask = r_.Jd, t._wasm_clip_image_mask = r_.Kd, t._wasm_pop_clip = r_.Ld, t._wasm_begin_mask = r_.Md, t._wasm_end_mask = r_.Nd, t._wasm_begin_group = r_.Od, t._wasm_end_group = r_.Pd, t._wasm_begin_tile = r_.Qd, t._wasm_end_tile = r_.Rd, t._wasm_begin_layer = r_.Sd, t._wasm_end_layer = r_.Td, t._wasm_new_document_writer_with_buffer = r_.Ud, t._wasm_begin_page = r_.Vd, t._wasm_end_page = r_.Wd, t._wasm_close_document_writer = r_.Xd, t._wasm_print_stext_page_as_json = r_.Yd, t._wasm_search_stext_page = r_.Zd, t._wasm_snap_selection = r_._d, t._wasm_copy_selection = r_.$d, t._wasm_highlight_selection = r_.ae, t._wasm_print_stext_page_as_html = r_.be, t._wasm_print_stext_page_as_text = r_.ce, t._wasm_open_document_with_buffer = r_.de, t._wasm_open_document_with_stream = r_.ee, t._wasm_format_link_uri = r_.fe, t._wasm_needs_password = r_.ge, t._wasm_authenticate_password = r_.he, t._wasm_has_permission = r_.ie, t._wasm_count_pages = r_.je, t._wasm_load_page = r_.ke, t._wasm_lookup_metadata = r_.le, t._wasm_set_metadata = r_.me, t._wasm_resolve_link = r_.ne, t._wasm_resolve_link_dest = r_.oe, t._wasm_load_outline = r_.pe, t._wasm_outline_get_page = r_.qe, t._wasm_style_document = r_.re, t._wasm_layout_document = r_.se, t._wasm_is_document_reflowable = r_.te, t._wasm_link_set_rect = r_.ue, t._wasm_link_set_uri = r_.ve, t._wasm_bound_page = r_.we, t._wasm_load_links = r_.xe, t._wasm_create_link = r_.ye, t._wasm_delete_link = r_.ze, t._wasm_run_page = r_.Ae, t._wasm_run_page_contents = r_.Be, t._wasm_run_page_annots = r_.Ce, t._wasm_run_page_widgets = r_.De, t._wasm_new_stext_page_from_page = r_.Ee, t._wasm_new_display_list_from_page = r_.Fe, t._wasm_new_display_list_from_page_contents = r_.Ge, t._wasm_page_label = r_.He, t._wasm_search_page = r_.Ie, t._wasm_new_outline_iterator = r_.Je, t._wasm_outline_iterator_next = r_.Ke, t._wasm_outline_iterator_prev = r_.Le, t._wasm_outline_iterator_up = r_.Me, t._wasm_outline_iterator_down = r_.Ne, t._wasm_outline_iterator_delete = r_.Oe, t._wasm_outline_iterator_item = r_.Pe, t._wasm_outline_iterator_insert = r_.Qe, t._wasm_outline_iterator_update = r_.Re, t._wasm_pdf_document_from_fz_document = r_.Se, t._wasm_pdf_page_from_fz_page = r_.Te, t._wasm_pdf_create_document = r_.Ue, t._wasm_pdf_version = r_.Ve, t._wasm_pdf_was_repaired = r_.We, t._wasm_pdf_has_unsaved_changes = r_.Xe, t._wasm_pdf_can_be_saved_incrementally = r_.Ye, t._wasm_pdf_count_versions = r_.Ze, t._wasm_pdf_count_unsaved_versions = r_._e, t._wasm_pdf_validate_change_history = r_.$e, t._wasm_pdf_enable_journal = r_.af, t._wasm_pdf_undoredo_state_position = r_.bf, t._wasm_pdf_undoredo_state_count = r_.cf, t._wasm_pdf_undoredo_step = r_.df, t._wasm_pdf_begin_operation = r_.ef, t._wasm_pdf_begin_implicit_operation = r_.ff, t._wasm_pdf_end_operation = r_.gf, t._wasm_pdf_abandon_operation = r_.hf, t._wasm_pdf_undo = r_.jf, t._wasm_pdf_redo = r_.kf, t._wasm_pdf_can_undo = r_.lf, t._wasm_pdf_can_redo = r_.mf, t._wasm_pdf_document_language = r_.nf, t._wasm_pdf_set_document_language = r_.of, t._wasm_pdf_trailer = r_.pf, t._wasm_pdf_xref_len = r_.qf, t._wasm_pdf_lookup_page_obj = r_.rf, t._wasm_pdf_add_object = r_.sf, t._wasm_pdf_create_object = r_.tf, t._wasm_pdf_delete_object = r_.uf, t._wasm_pdf_add_stream = r_.vf, t._wasm_pdf_add_simple_font = r_.wf, t._wasm_pdf_add_cjk_font = r_.xf, t._wasm_pdf_add_cid_font = r_.yf, t._wasm_pdf_add_image = r_.zf, t._wasm_pdf_load_image = r_.Af, t._wasm_pdf_set_page_tree_cache = r_.Bf, t._wasm_pdf_add_page = r_.Cf, t._wasm_pdf_insert_page = r_.Df, t._wasm_pdf_delete_page = r_.Ef, t._wasm_pdf_set_page_labels = r_.Ff, t._wasm_pdf_delete_page_labels = r_.Gf, t._wasm_pdf_is_embedded_file = r_.Hf, t._wasm_pdf_get_filespec_params = r_.If, t._wasm_pdf_add_embedded_file = r_.Jf, t._wasm_pdf_load_embedded_file_contents = r_.Kf, t._wasm_pdf_write_document_buffer = r_.Lf, t._wasm_pdf_js_supported = r_.Mf, t._wasm_pdf_enable_js = r_.Nf, t._wasm_pdf_disable_js = r_.Of, t._wasm_pdf_rearrange_pages = r_.Pf, t._wasm_pdf_subset_fonts = r_.Qf, t._wasm_pdf_bake_document = r_.Rf, t._wasm_pdf_count_layer_configs = r_.Sf, t._wasm_pdf_layer_config_creator = r_.Tf, t._wasm_pdf_layer_config_name = r_.Uf, t._wasm_pdf_select_layer_config = r_.Vf, t._wasm_pdf_count_layer_config_uis = r_.Wf, t._wasm_pdf_layer_config_ui_info = r_.Xf, t._wasm_pdf_count_layers = r_.Yf, t._wasm_pdf_layer_name = r_.Zf, t._wasm_pdf_layer_is_enabled = r_._f, t._wasm_pdf_enable_layer = r_.$f, t._wasm_pdf_page_transform = r_.ag, t._wasm_pdf_set_page_box = r_.bg, t._wasm_pdf_first_annot = r_.cg, t._wasm_pdf_next_annot = r_.dg, t._wasm_pdf_first_widget = r_.eg, t._wasm_pdf_next_widget = r_.fg, t._wasm_pdf_create_annot = r_.gg, t._wasm_pdf_delete_annot = r_.hg, t._wasm_pdf_update_page = r_.ig, t._wasm_pdf_redact_page = r_.jg, t._wasm_pdf_new_graft_map = r_.kg, t._wasm_pdf_graft_mapped_object = r_.lg, t._wasm_pdf_graft_object = r_.mg, t._wasm_pdf_graft_mapped_page = r_.ng, t._wasm_pdf_graft_page = r_.og, t._wasm_pdf_bound_annot = r_.pg, t._wasm_pdf_run_annot = r_.qg, t._wasm_pdf_new_pixmap_from_annot = r_.rg, t._wasm_pdf_new_display_list_from_annot = r_.sg, t._wasm_pdf_update_annot = r_.tg, t._wasm_pdf_annot_obj = r_.ug, t._wasm_pdf_annot_type = r_.vg, t._wasm_pdf_annot_flags = r_.wg, t._wasm_pdf_set_annot_flags = r_.xg, t._wasm_pdf_annot_contents = r_.yg, t._wasm_pdf_set_annot_contents = r_.zg, t._wasm_pdf_annot_name = r_.Ag, t._wasm_pdf_set_annot_name = r_.Bg, t._wasm_pdf_annot_author = r_.Cg, t._wasm_pdf_set_annot_author = r_.Dg, t._wasm_pdf_annot_subject = r_.Eg, t._wasm_pdf_set_annot_subject = r_.Fg, t._wasm_pdf_annot_creation_date = r_.Gg, t._wasm_pdf_set_annot_creation_date = r_.Hg, t._wasm_pdf_annot_modification_date = r_.Ig, t._wasm_pdf_set_annot_modification_date = r_.Jg, t._wasm_pdf_annot_border_width = r_.Kg, t._wasm_pdf_set_annot_border_width = r_.Lg, t._wasm_pdf_annot_border_style = r_.Mg, t._wasm_pdf_set_annot_border_style = r_.Ng, t._wasm_pdf_annot_border_effect = r_.Og, t._wasm_pdf_set_annot_border_effect = r_.Pg, t._wasm_pdf_annot_border_effect_intensity = r_.Qg, t._wasm_pdf_set_annot_border_effect_intensity = r_.Rg, t._wasm_pdf_annot_opacity = r_.Sg, t._wasm_pdf_set_annot_opacity = r_.Tg, t._wasm_pdf_annot_filespec = r_.Ug, t._wasm_pdf_set_annot_filespec = r_.Vg, t._wasm_pdf_annot_quadding = r_.Wg, t._wasm_pdf_set_annot_quadding = r_.Xg, t._wasm_pdf_annot_is_open = r_.Yg, t._wasm_pdf_set_annot_is_open = r_.Zg, t._wasm_pdf_annot_hidden_for_editing = r_._g, t._wasm_pdf_set_annot_hidden_for_editing = r_.$g, t._wasm_pdf_annot_icon_name = r_.ah, t._wasm_pdf_set_annot_icon_name = r_.bh, t._wasm_pdf_annot_intent = r_.ch, t._wasm_pdf_set_annot_intent = r_.dh, t._wasm_pdf_annot_callout_style = r_.eh, t._wasm_pdf_set_annot_callout_style = r_.fh, t._wasm_pdf_annot_line_leader = r_.gh, t._wasm_pdf_set_annot_line_leader = r_.hh, t._wasm_pdf_annot_line_leader_extension = r_.ih, t._wasm_pdf_set_annot_line_leader_extension = r_.jh, t._wasm_pdf_annot_line_leader_offset = r_.kh, t._wasm_pdf_set_annot_line_leader_offset = r_.lh, t._wasm_pdf_annot_line_caption = r_.mh, t._wasm_pdf_set_annot_line_caption = r_.nh, t._wasm_pdf_annot_rich_defaults = r_.oh, t._wasm_pdf_set_annot_rich_defaults = r_.ph, t._wasm_pdf_annot_callout_point = r_.qh, t._wasm_pdf_annot_line_caption_offset = r_.rh, t._wasm_pdf_annot_rect = r_.sh, t._wasm_pdf_annot_popup = r_.th, t._wasm_pdf_annot_quad_point_count = r_.uh, t._wasm_pdf_annot_quad_point = r_.vh, t._wasm_pdf_annot_vertex_count = r_.wh, t._wasm_pdf_annot_vertex = r_.xh, t._wasm_pdf_annot_ink_list_count = r_.yh, t._wasm_pdf_annot_ink_list_stroke_count = r_.zh, t._wasm_pdf_annot_ink_list_stroke_vertex = r_.Ah, t._wasm_pdf_annot_rich_contents = r_.Bh, t._wasm_pdf_annot_border_dash_count = r_.Ch, t._wasm_pdf_annot_border_dash_item = r_.Dh, t._wasm_pdf_annot_has_rect = r_.Eh, t._wasm_pdf_annot_has_ink_list = r_.Fh, t._wasm_pdf_annot_has_quad_points = r_.Gh, t._wasm_pdf_annot_has_vertices = r_.Hh, t._wasm_pdf_annot_has_line = r_.Ih, t._wasm_pdf_annot_has_interior_color = r_.Jh, t._wasm_pdf_annot_has_line_ending_styles = r_.Kh, t._wasm_pdf_annot_has_border = r_.Lh, t._wasm_pdf_annot_has_border_effect = r_.Mh, t._wasm_pdf_annot_has_icon_name = r_.Nh, t._wasm_pdf_annot_has_open = r_.Oh, t._wasm_pdf_annot_has_author = r_.Ph, t._wasm_pdf_annot_has_subject = r_.Qh, t._wasm_pdf_annot_has_filespec = r_.Rh, t._wasm_pdf_annot_has_callout = r_.Sh, t._wasm_pdf_annot_has_rich_contents = r_.Th, t._wasm_pdf_annot_language = r_.Uh, t._wasm_pdf_set_annot_language = r_.Vh, t._wasm_pdf_set_annot_popup = r_.Wh, t._wasm_pdf_set_annot_rect = r_.Xh, t._wasm_pdf_clear_annot_quad_points = r_.Yh, t._wasm_pdf_clear_annot_vertices = r_.Zh, t._wasm_pdf_clear_annot_ink_list = r_._h, t._wasm_pdf_clear_annot_border_dash = r_.$h, t._wasm_pdf_add_annot_quad_point = r_.ai, t._wasm_pdf_add_annot_vertex = r_.bi, t._wasm_pdf_add_annot_ink_list_stroke = r_.ci, t._wasm_pdf_add_annot_ink_list_stroke_vertex = r_.di, t._wasm_pdf_add_annot_border_dash_item = r_.ei, t._wasm_pdf_annot_line_ending_styles_start = r_.fi, t._wasm_pdf_annot_line_1 = r_.gi, t._wasm_pdf_annot_line_2 = r_.hi, t._wasm_pdf_set_annot_line = r_.ii, t._wasm_pdf_set_annot_callout_point = r_.ji, t._wasm_pdf_annot_callout_line = r_.ki, t._wasm_pdf_set_annot_callout_line = r_.li, t._wasm_pdf_set_annot_line_caption_offset = r_.mi, t._wasm_pdf_annot_line_ending_styles_end = r_.ni, t._wasm_pdf_set_annot_line_ending_styles = r_.oi, t._wasm_pdf_annot_color = r_.pi, t._wasm_pdf_annot_interior_color = r_.qi, t._wasm_pdf_set_annot_color = r_.ri, t._wasm_pdf_set_annot_interior_color = r_.si, t._wasm_pdf_set_annot_default_appearance = r_.ti, t._wasm_pdf_annot_default_appearance_font = r_.ui, t._wasm_pdf_annot_default_appearance_size = r_.vi, t._wasm_pdf_annot_default_appearance_color = r_.wi, t._wasm_pdf_set_annot_rich_contents = r_.xi, t._wasm_pdf_set_annot_stamp_image = r_.yi, t._wasm_pdf_set_annot_appearance_from_display_list = r_.zi, t._wasm_pdf_set_annot_appearance = r_.Ai, t._wasm_pdf_apply_redaction = r_.Bi, t._wasm_pdf_reset_form = r_.Ci, t._wasm_pdf_annot_field_type = r_.Di, t._wasm_pdf_annot_field_flags = r_.Ei, t._wasm_pdf_annot_field_label = r_.Fi, t._wasm_pdf_annot_field_value = r_.Gi, t._wasm_pdf_load_field_name = r_.Hi, t._wasm_pdf_annot_text_widget_max_len = r_.Ii, t._wasm_pdf_set_annot_text_field_value = r_.Ji, t._wasm_pdf_set_annot_choice_field_value = r_.Ki, t._wasm_pdf_annot_choice_field_option_count = r_.Li, t._wasm_pdf_annot_choice_field_option = r_.Mi, t._wasm_pdf_toggle_widget = r_.Ni, t._wasm_pdf_is_indirect = r_.Oi, t._wasm_pdf_is_bool = r_.Pi, t._wasm_pdf_is_int = r_.Qi, t._wasm_pdf_is_real = r_.Ri, t._wasm_pdf_is_number = r_.Si, t._wasm_pdf_is_name = r_.Ti, t._wasm_pdf_is_string = r_.Ui, t._wasm_pdf_is_array = r_.Vi, t._wasm_pdf_is_dict = r_.Wi, t._wasm_pdf_is_stream = r_.Xi, t._wasm_pdf_to_num = r_.Yi, t._wasm_pdf_to_bool = r_.Zi, t._wasm_pdf_to_real = r_._i, t._wasm_pdf_to_name = r_.$i, t._wasm_pdf_to_text_string = r_.aj, t._wasm_pdf_new_indirect = r_.bj, t._wasm_pdf_new_array = r_.cj, t._wasm_pdf_new_dict = r_.dj, t._wasm_pdf_new_bool = r_.ej, t._wasm_pdf_new_int = r_.fj, t._wasm_pdf_new_real = r_.gj, t._wasm_pdf_new_name = r_.hj, t._wasm_pdf_new_text_string = r_.ij, t._wasm_pdf_new_string = r_.jj, t._wasm_pdf_resolve_indirect = r_.kj, t._wasm_pdf_array_len = r_.lj, t._wasm_pdf_array_get = r_.mj, t._wasm_pdf_dict_get = r_.nj, t._wasm_pdf_dict_len = r_.oj, t._wasm_pdf_dict_get_key = r_.pj, t._wasm_pdf_dict_get_val = r_.qj, t._wasm_pdf_dict_get_inheritable = r_.rj, t._wasm_pdf_dict_gets = r_.sj, t._wasm_pdf_dict_gets_inheritable = r_.tj, t._wasm_pdf_dict_put = r_.uj, t._wasm_pdf_dict_puts = r_.vj, t._wasm_pdf_dict_del = r_.wj, t._wasm_pdf_dict_dels = r_.xj, t._wasm_pdf_array_put = r_.yj, t._wasm_pdf_array_push = r_.zj, t._wasm_pdf_array_delete = r_.Aj, t._wasm_pdf_sprint_obj = r_.Bj, t._wasm_pdf_load_stream = r_.Cj, t._wasm_pdf_load_raw_stream = r_.Dj, t._wasm_pdf_update_object = r_.Ej, t._wasm_pdf_update_stream = r_.Fj, t._wasm_pdf_to_string = r_.Gj, t._wasm_new_stream = r_.Hj, t._wasm_walk_path = r_.Ij, t._wasm_walk_text = r_.Jj, t._wasm_enable_log_callback = r_.Kj, t._wasm_new_js_device = r_.Lj, r_.Mj);
  return (function() {
    if (t.preInit) for ("function" == typeof t.preInit && (t.preInit = [t.preInit]); t.preInit.length > 0; ) t.preInit.shift()();
  })(), (function _3() {
    function e2() {
      t.calledRun = true, $ || (A = true, r_.x(), a(t), t.onRuntimeInitialized?.(), (function() {
        if (t.postRun) for ("function" == typeof t.postRun && (t.postRun = [t.postRun]); t.postRun.length; ) L(t.postRun.shift());
        B(q);
      })());
    }
    C > 0 ? S = _3 : ((function() {
      if (t.preRun) for ("function" == typeof t.preRun && (t.preRun = [t.preRun]); t.preRun.length; ) H(t.preRun.shift());
      B(z);
    })(), C > 0 ? S = _3 : t.setStatus ? (t.setStatus("Running..."), setTimeout(() => {
      setTimeout(() => t.setStatus(""), 1), e2();
    }, 1)) : e2());
  })(), s;
};
var mupdf_wasm_default = _;

// node_modules/mupdf/dist/mupdf.js
var node_fs = null;
if (typeof process !== "undefined" && process.versions && process.versions.node)
  node_fs = await import("node:fs");
var libmupdf = await mupdf_wasm_default(globalThis["$libmupdf_wasm_Module"]);
libmupdf._wasm_init_context();
function Malloc(size) {
  return libmupdf._wasm_malloc(size);
}
function Free(ptr) {
  libmupdf._wasm_free(ptr);
}
var Matrix = {
  identity: [1, 0, 0, 1, 0, 0],
  scale(sx, sy) {
    return [sx, 0, 0, sy, 0, 0];
  },
  translate(tx, ty) {
    return [1, 0, 0, 1, tx, ty];
  },
  rotate(d) {
    while (d < 0)
      d += 360;
    while (d >= 360)
      d -= 360;
    let s = Math.sin(d * Math.PI / 180);
    let c = Math.cos(d * Math.PI / 180);
    return [c, s, -s, c, 0, 0];
  },
  invert(m) {
    checkMatrix(m);
    let det = m[0] * m[3] - m[1] * m[2];
    if (det > -1e-23 && det < 1e-23)
      return m;
    let rdet = 1 / det;
    let inva = m[3] * rdet;
    let invb = -m[1] * rdet;
    let invc = -m[2] * rdet;
    let invd = m[0] * rdet;
    let inve = -m[4] * inva - m[5] * invc;
    let invf = -m[4] * invb - m[5] * invd;
    return [inva, invb, invc, invd, inve, invf];
  },
  concat(one, two) {
    checkMatrix(one);
    checkMatrix(two);
    return [
      one[0] * two[0] + one[1] * two[2],
      one[0] * two[1] + one[1] * two[3],
      one[2] * two[0] + one[3] * two[2],
      one[2] * two[1] + one[3] * two[3],
      one[4] * two[0] + one[5] * two[2] + two[4],
      one[4] * two[1] + one[5] * two[3] + two[5]
    ];
  }
};
var $libmupdf_log = null;
globalThis.$libmupdf_log_error = function(message) {
  $libmupdf_log?.error?.(fromString(message));
};
globalThis.$libmupdf_log_warning = function(message) {
  $libmupdf_log?.warning?.(fromString(message));
};
var _wasm_int = Malloc(4);
var _wasm_point = Malloc(4 * 6) >> 2;
var _wasm_rect = Malloc(4 * 8) >> 2;
var _wasm_matrix = Malloc(4 * 6) >> 2;
var _wasm_color = Malloc(4 * 4) >> 2;
var _wasm_quad = Malloc(4 * 8) >> 2;
var _wasm_string = [0, 0];
function checkType(value, type) {
  if (typeof type === "string" && typeof value !== type)
    throw new TypeError("expected " + type);
  if (typeof type === "function" && !(value instanceof type))
    throw new TypeError("expected " + type.name);
}
function checkPoint(value) {
  if (!Array.isArray(value) || value.length !== 2)
    throw new TypeError("expected point");
}
function checkRect(value) {
  if (!Array.isArray(value) || value.length !== 4)
    throw new TypeError("expected rectangle");
}
function checkMatrix(value) {
  if (!Array.isArray(value) || value.length !== 6)
    throw new TypeError("expected matrix");
}
function checkQuad(value) {
  if (!Array.isArray(value) || value.length !== 8)
    throw new TypeError("expected quad");
}
function checkColor(value) {
  if (!Array.isArray(value) || value.length !== 1 && value.length !== 3 && value.length !== 4)
    throw new TypeError("expected color array");
}
function checkAnnotColor(value) {
  if (!Array.isArray(value) || value.length !== 0 && value.length !== 1 && value.length !== 3 && value.length !== 4)
    throw new TypeError("expected color array");
}
function BUFFER(input) {
  if (input instanceof Buffer2)
    return input.pointer;
  if (input instanceof ArrayBuffer || input instanceof Uint8Array)
    return new Buffer2(input).pointer;
  if (typeof input === "string")
    return new Buffer2(input).pointer;
  throw new TypeError("expected buffer");
}
function ENUM(value, list) {
  if (typeof value === "number") {
    if (value >= 0 && value < list.length)
      return value;
  }
  if (typeof value === "string") {
    let idx = list.indexOf(value);
    if (idx >= 0)
      return idx;
  }
  throw new TypeError(`invalid enum value ("${value}"; expected ${list.join(", ")})`);
}
function allocateUTF8(str) {
  var size = libmupdf.lengthBytesUTF8(str) + 1;
  var pointer = Malloc(size);
  libmupdf.stringToUTF8(str, pointer, size);
  return pointer;
}
function STRING_N(s, i) {
  if (_wasm_string[i]) {
    Free(_wasm_string[i]);
    _wasm_string[i] = 0;
  }
  return _wasm_string[i] = allocateUTF8(s);
}
function STRING(s) {
  return STRING_N(s, 0);
}
function STRING2(s) {
  return STRING_N(s, 1);
}
function STRING_OPT(s) {
  return typeof s === "string" ? STRING_N(s, 0) : 0;
}
function STRING2_OPT(s) {
  return typeof s === "string" ? STRING_N(s, 1) : 0;
}
function POINT(p) {
  libmupdf.HEAPF32[_wasm_point + 0] = p[0];
  libmupdf.HEAPF32[_wasm_point + 1] = p[1];
  return _wasm_point << 2;
}
function POINT2(p) {
  libmupdf.HEAPF32[_wasm_point + 2] = p[0];
  libmupdf.HEAPF32[_wasm_point + 3] = p[1];
  return _wasm_point + 2 << 2;
}
function POINT3(p) {
  libmupdf.HEAPF32[_wasm_point + 4] = p[0];
  libmupdf.HEAPF32[_wasm_point + 5] = p[1];
  return _wasm_point + 4 << 2;
}
function RECT(r) {
  libmupdf.HEAPF32[_wasm_rect + 0] = r[0];
  libmupdf.HEAPF32[_wasm_rect + 1] = r[1];
  libmupdf.HEAPF32[_wasm_rect + 2] = r[2];
  libmupdf.HEAPF32[_wasm_rect + 3] = r[3];
  return _wasm_rect << 2;
}
function RECT2(r) {
  libmupdf.HEAPF32[_wasm_rect + 4] = r[0];
  libmupdf.HEAPF32[_wasm_rect + 5] = r[1];
  libmupdf.HEAPF32[_wasm_rect + 6] = r[2];
  libmupdf.HEAPF32[_wasm_rect + 7] = r[3];
  return _wasm_rect + 4 << 2;
}
function MATRIX(m) {
  libmupdf.HEAPF32[_wasm_matrix + 0] = m[0];
  libmupdf.HEAPF32[_wasm_matrix + 1] = m[1];
  libmupdf.HEAPF32[_wasm_matrix + 2] = m[2];
  libmupdf.HEAPF32[_wasm_matrix + 3] = m[3];
  libmupdf.HEAPF32[_wasm_matrix + 4] = m[4];
  libmupdf.HEAPF32[_wasm_matrix + 5] = m[5];
  return _wasm_matrix << 2;
}
function QUAD(q) {
  libmupdf.HEAPF32[_wasm_quad + 0] = q[0];
  libmupdf.HEAPF32[_wasm_quad + 1] = q[1];
  libmupdf.HEAPF32[_wasm_quad + 2] = q[2];
  libmupdf.HEAPF32[_wasm_quad + 3] = q[3];
  libmupdf.HEAPF32[_wasm_quad + 4] = q[4];
  libmupdf.HEAPF32[_wasm_quad + 5] = q[5];
  libmupdf.HEAPF32[_wasm_quad + 6] = q[6];
  libmupdf.HEAPF32[_wasm_quad + 7] = q[7];
  return _wasm_quad << 2;
}
function COLOR(c) {
  if (typeof c !== "undefined") {
    switch (c.length) {
      case 0:
        break;
      case 1:
        libmupdf.HEAPF32[_wasm_color + 0] = c[0];
        break;
      case 3:
        libmupdf.HEAPF32[_wasm_color + 0] = c[0];
        libmupdf.HEAPF32[_wasm_color + 1] = c[1];
        libmupdf.HEAPF32[_wasm_color + 2] = c[2];
        break;
      case 4:
        libmupdf.HEAPF32[_wasm_color + 0] = c[0];
        libmupdf.HEAPF32[_wasm_color + 1] = c[1];
        libmupdf.HEAPF32[_wasm_color + 2] = c[2];
        libmupdf.HEAPF32[_wasm_color + 3] = c[3];
        break;
    }
  }
  return _wasm_color << 2;
}
function ensureOptions(value) {
  if (value === void 0 || value === null)
    return "";
  if (typeof value === "string")
    return value;
  return JSON.stringify(value);
}
function fromColor(n) {
  if (n === 1)
    return [
      libmupdf.HEAPF32[_wasm_color]
    ];
  if (n === 3)
    return [
      libmupdf.HEAPF32[_wasm_color + 0],
      libmupdf.HEAPF32[_wasm_color + 1],
      libmupdf.HEAPF32[_wasm_color + 2]
    ];
  if (n === 4)
    return [
      libmupdf.HEAPF32[_wasm_color + 0],
      libmupdf.HEAPF32[_wasm_color + 1],
      libmupdf.HEAPF32[_wasm_color + 2],
      libmupdf.HEAPF32[_wasm_color + 3]
    ];
  throw new TypeError("invalid number of components for Color: " + n);
}
function fromAnnotColor(n) {
  if (n === 0)
    return [];
  return fromColor(n);
}
function fromColorArray(n, ptr) {
  let addr = ptr >> 2;
  let color = [];
  for (let i = 0; i < n; ++i)
    color.push(libmupdf.HEAPF32[addr + i]);
  return color;
}
function fromStringOrNull(ptr) {
  if (ptr === 0)
    return null;
  return libmupdf.UTF8ToString(ptr);
}
function fromString(ptr) {
  return libmupdf.UTF8ToString(ptr);
}
function fromStringFree(ptr) {
  let str = libmupdf.UTF8ToString(ptr);
  Free(ptr);
  return str;
}
function fromPoint(ptr) {
  let addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0],
    libmupdf.HEAPF32[addr + 1]
  ];
}
function fromRect(ptr) {
  let addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0],
    libmupdf.HEAPF32[addr + 1],
    libmupdf.HEAPF32[addr + 2],
    libmupdf.HEAPF32[addr + 3]
  ];
}
function fromMatrix(ptr) {
  let addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0],
    libmupdf.HEAPF32[addr + 1],
    libmupdf.HEAPF32[addr + 2],
    libmupdf.HEAPF32[addr + 3],
    libmupdf.HEAPF32[addr + 4],
    libmupdf.HEAPF32[addr + 5]
  ];
}
function fromQuad(ptr) {
  let addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0],
    libmupdf.HEAPF32[addr + 1],
    libmupdf.HEAPF32[addr + 2],
    libmupdf.HEAPF32[addr + 3],
    libmupdf.HEAPF32[addr + 4],
    libmupdf.HEAPF32[addr + 5],
    libmupdf.HEAPF32[addr + 6],
    libmupdf.HEAPF32[addr + 7]
  ];
}
function fromBuffer(ptr) {
  let data = libmupdf._wasm_buffer_get_data(ptr);
  let size = libmupdf._wasm_buffer_get_len(ptr);
  return libmupdf.HEAPU8.slice(data, data + size);
}
function fromLayerConfigUIInfo(ptr) {
  return {
    text: libmupdf._wasm_pdf_layer_config_ui_get_text(ptr),
    depth: libmupdf._wasm_pdf_layer_config_ui_get_depth(ptr),
    type: libmupdf._wasm_pdf_layer_config_ui_get_type(ptr),
    selected: libmupdf._wasm_pdf_layer_config_ui_get_selected(ptr),
    locked: libmupdf._wasm_pdf_layer_config_ui_get_locked(ptr)
  };
}
function colorFromNumber(argb) {
  var r = argb >> 16 & 255;
  var g = argb >> 8 & 255;
  var b = argb & 255;
  return [r / 255, g / 255, b / 255];
}
function runSearch(searchFun, haystack, needle, options) {
  const max_hits = 500;
  checkType(needle, "string");
  options = ensureOptions(options);
  let hits = 0;
  let marks = 0;
  try {
    hits = Malloc(32 * max_hits);
    marks = Malloc(4 * max_hits);
    let n = searchFun(haystack, STRING(needle), marks, hits, max_hits, STRING2(options));
    let outer = [];
    if (n > 0) {
      let inner = [];
      for (let i = 0; i < n; ++i) {
        let mark = libmupdf.HEAP32[(marks >> 2) + i];
        let quad = fromQuad(hits + i * 32);
        if (i > 0 && mark) {
          outer.push(inner);
          inner = [];
        }
        inner.push(quad);
      }
      outer.push(inner);
    }
    return outer;
  } finally {
    Free(marks);
    Free(hits);
  }
}
var Userdata = class {
  constructor(pointer) {
    if (typeof pointer !== "number")
      throw new Error("invalid pointer: " + typeof pointer);
    if (pointer !== 0) {
      let ctor = this.constructor;
      if (!ctor._finalizer)
        ctor._finalizer = new FinalizationRegistry(ctor._drop);
      ctor._finalizer.register(this, pointer, this);
    }
    this.pointer = pointer;
  }
  destroy() {
    if (this.pointer !== 0) {
      let ctor = this.constructor;
      ctor._finalizer.unregister(this);
      ctor._drop(this.pointer);
    }
    this.pointer = 0;
  }
  // Custom "console.log" formatting for Node
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }
  toString() {
    return `[${this.constructor.name} ${this.pointer}]`;
  }
  valueOf() {
    throw new Error("cannot convert Userdata to Javascript value");
  }
};
var Buffer2 = class _Buffer extends Userdata {
  constructor(arg) {
    if (typeof arg === "undefined")
      super(libmupdf._wasm_new_buffer(1024));
    else if (typeof arg === "number")
      super(arg);
    else if (typeof arg === "string") {
      let data_len = libmupdf.lengthBytesUTF8(arg);
      let data_ptr = Malloc(data_len + 1);
      libmupdf.stringToUTF8(arg, data_ptr, data_len + 1);
      super(libmupdf._wasm_new_buffer_from_data(data_ptr, data_len));
    } else if (arg instanceof ArrayBuffer || arg instanceof Uint8Array) {
      let data_len = arg.byteLength;
      let data_ptr = Malloc(data_len);
      libmupdf.HEAPU8.set(new Uint8Array(arg), data_ptr);
      super(libmupdf._wasm_new_buffer_from_data(data_ptr, data_len));
    }
  }
  get length() {
    return this.getLength();
  }
  set length(_2) {
    throw new TypeError("buffer length is read-only");
  }
  getLength() {
    return libmupdf._wasm_buffer_get_len(this.pointer);
  }
  readByte(at) {
    let data = libmupdf._wasm_buffer_get_data(this.pointer);
    return libmupdf.HEAPU8[data + at];
  }
  write(s) {
    libmupdf._wasm_append_string(this.pointer, STRING(s));
  }
  writeByte(b) {
    libmupdf._wasm_append_byte(this.pointer, b);
  }
  writeLine(s) {
    this.write(s);
    this.writeByte(10);
  }
  writeBuffer(other) {
    libmupdf._wasm_append_buffer(this.pointer, BUFFER(other));
  }
  asUint8Array() {
    let data = libmupdf._wasm_buffer_get_data(this.pointer);
    let size = libmupdf._wasm_buffer_get_len(this.pointer);
    return libmupdf.HEAPU8.subarray(data, data + size);
  }
  slice(start, end) {
    if (typeof end === "undefined")
      end = this.getLength();
    return new _Buffer(libmupdf._wasm_slice_buffer(this.pointer, start, end));
  }
  asString() {
    return fromString(libmupdf._wasm_string_from_buffer(this.pointer));
  }
  save(filename) {
    if (node_fs)
      node_fs.writeFileSync(filename, this.asUint8Array());
    else
      throw new Error("missing 'fs' module");
  }
};
Buffer2._drop = libmupdf._wasm_drop_buffer;
var ColorSpace = class _ColorSpace extends Userdata {
  constructor(from, name) {
    if (typeof from === "number") {
      super(from);
    } else {
      if (typeof from === "string") {
        if (node_fs)
          from = node_fs.readFileSync(from);
        else
          throw new Error("missing 'fs' module");
      }
      super(libmupdf._wasm_new_icc_colorspace(STRING_OPT(name), BUFFER(from)));
    }
  }
  getName() {
    return fromString(libmupdf._wasm_colorspace_get_name(this.pointer));
  }
  getType() {
    return _ColorSpace.COLORSPACE_TYPES[libmupdf._wasm_colorspace_get_type(this.pointer)] || "None";
  }
  getNumberOfComponents() {
    return libmupdf._wasm_colorspace_get_n(this.pointer);
  }
  isGray() {
    return this.getType() === "Gray";
  }
  isRGB() {
    return this.getType() === "RGB";
  }
  isCMYK() {
    return this.getType() === "CMYK";
  }
  isIndexed() {
    return this.getType() === "Indexed";
  }
  isLab() {
    return this.getType() === "Lab";
  }
  isDeviceN() {
    return this.getType() === "Separation";
  }
  isSubtractive() {
    return this.getType() === "CMYK" || this.getType() === "Separation";
  }
  toString() {
    return "[ColorSpace " + this.getName() + "]";
  }
};
ColorSpace._drop = libmupdf._wasm_drop_colorspace;
ColorSpace.COLORSPACE_TYPES = [
  "None",
  "Gray",
  "RGB",
  "BGR",
  "CMYK",
  "Lab",
  "Indexed",
  "Separation"
];
ColorSpace.DeviceGray = new ColorSpace(libmupdf._wasm_device_gray());
ColorSpace.DeviceRGB = new ColorSpace(libmupdf._wasm_device_rgb());
ColorSpace.DeviceBGR = new ColorSpace(libmupdf._wasm_device_bgr());
ColorSpace.DeviceCMYK = new ColorSpace(libmupdf._wasm_device_cmyk());
ColorSpace.Lab = new ColorSpace(libmupdf._wasm_device_lab());
var Font = class _Font extends Userdata {
  constructor(name_or_pointer, data, subfont = 0) {
    let pointer = 0;
    if (typeof name_or_pointer === "number") {
      pointer = libmupdf._wasm_keep_font(name_or_pointer);
    } else {
      if (typeof data === "string") {
        if (node_fs)
          data = node_fs.readFileSync(data);
        else
          throw new Error("missing 'fs' module");
      }
      if (data)
        pointer = libmupdf._wasm_new_font_from_buffer(STRING(name_or_pointer), BUFFER(data), subfont);
      else if (name_or_pointer === "zh-Hant")
        pointer = libmupdf._wasm_new_cjk_font(_Font.ADOBE_CNS);
      else if (name_or_pointer === "zh-Hans")
        pointer = libmupdf._wasm_new_cjk_font(_Font.ADOBE_GB);
      else if (name_or_pointer === "ja")
        pointer = libmupdf._wasm_new_cjk_font(_Font.ADOBE_JAPAN);
      else if (name_or_pointer === "ko")
        pointer = libmupdf._wasm_new_cjk_font(_Font.ADOBE_KOREA);
      else
        pointer = libmupdf._wasm_new_base14_font(STRING(name_or_pointer));
    }
    super(pointer);
  }
  getName() {
    return fromString(libmupdf._wasm_font_get_name(this.pointer));
  }
  encodeCharacter(uni) {
    if (typeof uni === "string")
      uni = uni.charCodeAt(0);
    return libmupdf._wasm_encode_character(this.pointer, uni);
  }
  advanceGlyph(gid, wmode = 0) {
    return libmupdf._wasm_advance_glyph(this.pointer, gid, wmode);
  }
  isMono() {
    return !!libmupdf._wasm_font_is_monospaced(this.pointer);
  }
  isSerif() {
    return !!libmupdf._wasm_font_is_serif(this.pointer);
  }
  isBold() {
    return !!libmupdf._wasm_font_is_bold(this.pointer);
  }
  isItalic() {
    return !!libmupdf._wasm_font_is_italic(this.pointer);
  }
};
Font._drop = libmupdf._wasm_drop_font;
Font.SIMPLE_ENCODING = [
  "Latin",
  "Greek",
  "Cyrillic"
];
Font.SIMPLE_ENCODING_LATIN = "Latin";
Font.SIMPLE_ENCODING_GREEK = "Greek";
Font.SIMPLE_ENCODING_CYRILLIC = "Cyrillic";
Font.ADOBE_CNS = 0;
Font.ADOBE_GB = 1;
Font.ADOBE_JAPAN = 2;
Font.ADOBE_KOREA = 3;
Font.CJK_ORDERING_BY_LANG = {
  "Adobe-CNS1": 0,
  "Adobe-GB1": 1,
  "Adobe-Japan1": 2,
  "Adobe-Korea1": 3,
  "zh-Hant": 0,
  "zh-TW": 0,
  "zh-HK": 0,
  "zh-Hans": 1,
  "zh-CN": 1,
  "ja": 2,
  "ko": 3
};
var Image2 = class _Image extends Userdata {
  constructor(data, mask) {
    let pointer = 0;
    if (typeof data === "number") {
      pointer = libmupdf._wasm_keep_image(data);
    } else if (data instanceof Pixmap) {
      pointer = libmupdf._wasm_new_image_from_pixmap(data.pointer, mask ? mask.pointer : 0);
    } else {
      if (typeof data === "string") {
        if (node_fs)
          data = node_fs.readFileSync(data);
        else
          throw new Error("missing 'fs' module");
      }
      pointer = libmupdf._wasm_new_image_from_buffer(BUFFER(data));
    }
    super(pointer);
  }
  getWidth() {
    return libmupdf._wasm_image_get_w(this.pointer);
  }
  getHeight() {
    return libmupdf._wasm_image_get_h(this.pointer);
  }
  getNumberOfComponents() {
    return libmupdf._wasm_image_get_n(this.pointer);
  }
  getBitsPerComponent() {
    return libmupdf._wasm_image_get_bpc(this.pointer);
  }
  getXResolution() {
    return libmupdf._wasm_image_get_xres(this.pointer);
  }
  getYResolution() {
    return libmupdf._wasm_image_get_yres(this.pointer);
  }
  getImageMask() {
    return !!libmupdf._wasm_image_get_imagemask(this.pointer);
  }
  getColorSpace() {
    let cs = libmupdf._wasm_image_get_colorspace(this.pointer);
    if (cs)
      return new ColorSpace(libmupdf._wasm_keep_colorspace(cs));
    return null;
  }
  getMask() {
    let mask = libmupdf._wasm_image_get_mask(this.pointer);
    if (mask)
      return new _Image(libmupdf._wasm_keep_image(mask));
    return null;
  }
  toPixmap() {
    return new Pixmap(libmupdf._wasm_get_pixmap_from_image(this.pointer));
  }
};
Image2._drop = libmupdf._wasm_drop_image;
var StrokeState = class _StrokeState extends Userdata {
  constructor(data) {
    if (typeof data === "number") {
      super(data);
      return this;
    }
    super(libmupdf._wasm_new_stroke_state(data?.dashes?.length ?? 0));
    let lineCap = ENUM(data.lineCap, _StrokeState.LINE_CAP);
    let lineJoin = ENUM(data.lineJoin, _StrokeState.LINE_JOIN);
    libmupdf._wasm_stroke_state_set_start_cap(this.pointer, lineCap);
    libmupdf._wasm_stroke_state_set_dash_cap(this.pointer, lineCap);
    libmupdf._wasm_stroke_state_set_end_cap(this.pointer, lineCap);
    libmupdf._wasm_stroke_state_set_linejoin(this.pointer, lineJoin);
    libmupdf._wasm_stroke_state_set_linewidth(this.pointer, data.lineWidth);
    libmupdf._wasm_stroke_state_set_miterlimit(this.pointer, data.miterLimit);
    libmupdf._wasm_stroke_state_set_dash_phase(this.pointer, data.dashPhase ?? 0);
    if (data.dashes) {
      for (let i = 0; i < data.dashes.length; ++i)
        libmupdf._wasm_stroke_state_set_dash_item(this.pointer, i, data.dashes[i] ?? 0);
    }
  }
  getLineCap() {
    return libmupdf._wasm_stroke_state_get_start_cap(this.pointer);
  }
  getLineJoin() {
    return libmupdf._wasm_stroke_state_get_linejoin(this.pointer);
  }
  getLineWidth() {
    return libmupdf._wasm_stroke_state_get_linewidth(this.pointer);
  }
  getMiterLimit() {
    return libmupdf._wasm_stroke_state_get_miterlimit(this.pointer);
  }
  getDashPhase() {
    return libmupdf._wasm_stroke_state_get_dash_phase(this.pointer);
  }
  getDashes() {
    var n = libmupdf._wasm_stroke_state_get_dash_len(this.pointer);
    if (n > 0) {
      var out = [];
      for (let i = 0; i < n; ++i)
        out[i] = libmupdf._wasm_stroke_state_get_dash_item(this.pointer, i);
      return out;
    }
    return null;
  }
};
StrokeState._drop = libmupdf._wasm_drop_stroke_state;
StrokeState.LINE_CAP = [
  "Butt",
  "Round",
  "Square",
  "Triangle"
];
StrokeState.LINE_JOIN = [
  "Miter",
  "Round",
  "Bevel",
  "MiterXPS"
];
var Path = class extends Userdata {
  constructor(pointer) {
    if (typeof pointer === "number")
      super(pointer);
    else
      super(libmupdf._wasm_new_path());
  }
  getBounds(strokeState, transform) {
    if (strokeState !== null)
      checkType(strokeState, StrokeState);
    checkMatrix(transform);
    return fromRect(libmupdf._wasm_bound_path(this.pointer, strokeState?.pointer, MATRIX(transform)));
  }
  moveTo(x, y) {
    checkType(x, "number");
    checkType(y, "number");
    libmupdf._wasm_moveto(this.pointer, x, y);
  }
  lineTo(x, y) {
    checkType(x, "number");
    checkType(y, "number");
    libmupdf._wasm_lineto(this.pointer, x, y);
  }
  curveTo(x1, y1, x2, y2, x3, y3) {
    checkType(x1, "number");
    checkType(y1, "number");
    checkType(x2, "number");
    checkType(y2, "number");
    checkType(x3, "number");
    checkType(y3, "number");
    libmupdf._wasm_curveto(this.pointer, x1, y1, x2, y2, x3, y3);
  }
  curveToV(cx, cy, ex, ey) {
    checkType(cx, "number");
    checkType(cy, "number");
    checkType(ex, "number");
    checkType(ey, "number");
    libmupdf._wasm_curvetov(this.pointer, cx, cy, ex, ey);
  }
  curveToY(cx, cy, ex, ey) {
    checkType(cx, "number");
    checkType(cy, "number");
    checkType(ex, "number");
    checkType(ey, "number");
    libmupdf._wasm_curvetoy(this.pointer, cx, cy, ex, ey);
  }
  closePath() {
    libmupdf._wasm_closepath(this.pointer);
  }
  rect(x1, y1, x2, y2) {
    checkType(x1, "number");
    checkType(y1, "number");
    checkType(x2, "number");
    checkType(y2, "number");
    libmupdf._wasm_rectto(this.pointer, x1, y1, x2, y2);
  }
  transform(matrix) {
    checkMatrix(matrix);
    libmupdf._wasm_transform_path(this.pointer, MATRIX(matrix));
  }
  walk(walker) {
    let id = $libmupdf_path_id++;
    $libmupdf_path_table.set(id, walker);
    libmupdf._wasm_walk_path(this.pointer, id);
    $libmupdf_path_table.delete(id);
  }
};
Path._drop = libmupdf._wasm_drop_path;
var Text = class extends Userdata {
  constructor(pointer) {
    if (typeof pointer === "number")
      super(pointer);
    else
      super(libmupdf._wasm_new_text());
  }
  getBounds(strokeState, transform) {
    if (strokeState !== null)
      checkType(strokeState, StrokeState);
    checkMatrix(transform);
    return fromRect(libmupdf._wasm_bound_text(this.pointer, strokeState?.pointer, MATRIX(transform)));
  }
  showGlyph(font, trm, gid, uni, wmode = 0) {
    checkType(font, Font);
    checkMatrix(trm);
    checkType(gid, "number");
    checkType(uni, "number");
    libmupdf._wasm_show_glyph(this.pointer, font.pointer, MATRIX(trm), gid, uni, wmode);
  }
  showString(font, trm, str, wmode = 0) {
    checkType(font, Font);
    checkMatrix(trm);
    checkType(str, "string");
    return fromMatrix(libmupdf._wasm_show_string(this.pointer, font.pointer, MATRIX(trm), STRING(str), wmode));
  }
  walk(walker) {
    let id = $libmupdf_text_id++;
    $libmupdf_text_table.set(id, walker);
    libmupdf._wasm_walk_text(this.pointer, id);
    $libmupdf_text_table.delete(id);
  }
};
Text._drop = libmupdf._wasm_drop_text;
var DisplayList = class extends Userdata {
  constructor(arg1) {
    let pointer = 0;
    if (typeof arg1 === "number") {
      pointer = arg1;
    } else {
      checkRect(arg1);
      pointer = libmupdf._wasm_new_display_list(RECT(arg1));
    }
    super(pointer);
  }
  getBounds() {
    return fromRect(libmupdf._wasm_bound_display_list(this.pointer));
  }
  toPixmap(matrix, colorspace, alpha = false) {
    checkMatrix(matrix);
    checkType(colorspace, ColorSpace);
    return new Pixmap(libmupdf._wasm_new_pixmap_from_display_list(this.pointer, MATRIX(matrix), colorspace.pointer, alpha));
  }
  toStructuredText(options) {
    options = ensureOptions(options);
    return new StructuredText(libmupdf._wasm_new_stext_page_from_display_list(this.pointer, STRING(options)));
  }
  run(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_run_display_list(this.pointer, device.pointer, MATRIX(matrix));
  }
  search(needle, options) {
    return runSearch(libmupdf._wasm_search_display_list, this.pointer, needle, options);
  }
};
DisplayList._drop = libmupdf._wasm_drop_display_list;
var Pixmap = class _Pixmap extends Userdata {
  constructor(arg1, bbox, alpha = false) {
    if (typeof arg1 === "number") {
      super(arg1);
    }
    if (arg1 instanceof ColorSpace) {
      checkRect(bbox);
      super(libmupdf._wasm_new_pixmap_with_bbox(arg1.pointer, RECT(bbox), alpha));
    }
    if (arg1 === null) {
      checkRect(bbox);
      super(libmupdf._wasm_new_pixmap_with_bbox(0, RECT(bbox), alpha));
    }
  }
  getBounds() {
    let x = libmupdf._wasm_pixmap_get_x(this.pointer);
    let y = libmupdf._wasm_pixmap_get_y(this.pointer);
    let w = libmupdf._wasm_pixmap_get_w(this.pointer);
    let h = libmupdf._wasm_pixmap_get_h(this.pointer);
    return [x, y, x + w, y + h];
  }
  clear(value) {
    if (typeof value === "undefined")
      libmupdf._wasm_clear_pixmap(this.pointer);
    else
      libmupdf._wasm_clear_pixmap_with_value(this.pointer, value);
  }
  getWidth() {
    return libmupdf._wasm_pixmap_get_w(this.pointer);
  }
  getHeight() {
    return libmupdf._wasm_pixmap_get_h(this.pointer);
  }
  getX() {
    return libmupdf._wasm_pixmap_get_x(this.pointer);
  }
  getY() {
    return libmupdf._wasm_pixmap_get_y(this.pointer);
  }
  getStride() {
    return libmupdf._wasm_pixmap_get_stride(this.pointer);
  }
  getNumberOfComponents() {
    return libmupdf._wasm_pixmap_get_n(this.pointer);
  }
  getAlpha() {
    return libmupdf._wasm_pixmap_get_alpha(this.pointer);
  }
  getXResolution() {
    return libmupdf._wasm_pixmap_get_xres(this.pointer);
  }
  getYResolution() {
    return libmupdf._wasm_pixmap_get_yres(this.pointer);
  }
  setResolution(x, y) {
    libmupdf._wasm_pixmap_set_xres(this.pointer, x);
    libmupdf._wasm_pixmap_set_yres(this.pointer, y);
  }
  getColorSpace() {
    let cs = libmupdf._wasm_pixmap_get_colorspace(this.pointer);
    if (cs)
      return new ColorSpace(libmupdf._wasm_keep_colorspace(cs));
    return null;
  }
  getPixels() {
    let s = libmupdf._wasm_pixmap_get_stride(this.pointer);
    let h = libmupdf._wasm_pixmap_get_h(this.pointer);
    let p = libmupdf._wasm_pixmap_get_samples(this.pointer);
    return new Uint8ClampedArray(libmupdf.HEAPU8.buffer, p, s * h);
  }
  asPNG() {
    let buf = libmupdf._wasm_new_buffer_from_pixmap_as_png(this.pointer);
    try {
      return fromBuffer(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }
  asPSD() {
    let buf = libmupdf._wasm_new_buffer_from_pixmap_as_psd(this.pointer);
    try {
      return fromBuffer(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }
  asPAM() {
    let buf = libmupdf._wasm_new_buffer_from_pixmap_as_pam(this.pointer);
    try {
      return fromBuffer(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }
  asJPEG(quality, invert_cmyk = false) {
    let buf = libmupdf._wasm_new_buffer_from_pixmap_as_jpeg(this.pointer, quality, invert_cmyk);
    try {
      return fromBuffer(buf);
    } finally {
      libmupdf._wasm_drop_buffer(buf);
    }
  }
  invert() {
    libmupdf._wasm_invert_pixmap(this.pointer);
  }
  invertLuminance() {
    libmupdf._wasm_invert_pixmap_luminance(this.pointer);
  }
  gamma(p) {
    libmupdf._wasm_gamma_pixmap(this.pointer, p);
  }
  tint(black, white) {
    let black_hex = 0;
    let white_hex = 16777215;
    if (typeof black === "number")
      black_hex = black;
    else if (black instanceof Array && black.length === 3)
      black_hex = black[0] * 255 << 16 | black[1] * 255 << 8 | black[2] * 255;
    if (typeof white === "number")
      white_hex = white;
    else if (white instanceof Array && white.length === 3)
      white = white[0] * 255 << 16 | white[1] * 255 << 8 | white[2] * 255;
    libmupdf._wasm_tint_pixmap(this.pointer, black_hex, white_hex);
  }
  convertToColorSpace(colorspace, keepAlpha = false) {
    checkType(colorspace, ColorSpace);
    checkType(keepAlpha, "boolean");
    return new _Pixmap(libmupdf._wasm_convert_pixmap(this.pointer, colorspace.pointer, keepAlpha));
  }
  warp(points, width, height) {
    let quad = points.flat();
    checkQuad(quad);
    checkType(width, "number");
    checkType(height, "number");
    return new _Pixmap(libmupdf._wasm_warp_pixmap(this.pointer, QUAD(quad), width, height));
  }
};
Pixmap._drop = libmupdf._wasm_drop_pixmap;
var Shade = class extends Userdata {
  getBounds() {
    return fromRect(libmupdf._wasm_bound_shade(this.pointer));
  }
};
Shade._drop = libmupdf._wasm_drop_shade;
var StructuredText = class _StructuredText extends Userdata {
  walk(walker) {
    let block = libmupdf._wasm_stext_page_get_first_block(this.pointer);
    while (block) {
      let block_type = libmupdf._wasm_stext_block_get_type(block);
      let block_bbox = fromRect(libmupdf._wasm_stext_block_get_bbox(block));
      if (block_type === 0) {
        if (walker.beginTextBlock)
          walker.beginTextBlock(block_bbox);
        let line = libmupdf._wasm_stext_block_get_first_line(block);
        while (line) {
          let line_bbox = fromRect(libmupdf._wasm_stext_line_get_bbox(line));
          let line_wmode = libmupdf._wasm_stext_line_get_wmode(line);
          let line_dir = fromPoint(libmupdf._wasm_stext_line_get_dir(line));
          if (walker.beginLine)
            walker.beginLine(line_bbox, line_wmode, line_dir);
          if (walker.onChar) {
            let ch = libmupdf._wasm_stext_line_get_first_char(line);
            while (ch) {
              let ch_rune = String.fromCharCode(libmupdf._wasm_stext_char_get_c(ch));
              let ch_origin = fromPoint(libmupdf._wasm_stext_char_get_origin(ch));
              let ch_font = new Font(libmupdf._wasm_stext_char_get_font(ch));
              let ch_size = libmupdf._wasm_stext_char_get_size(ch);
              let ch_quad = fromQuad(libmupdf._wasm_stext_char_get_quad(ch));
              let ch_color = colorFromNumber(libmupdf._wasm_stext_char_get_argb(ch));
              let ch_bidi = libmupdf._wasm_stext_char_get_bidi(ch);
              walker.onChar(ch_rune, ch_origin, ch_font, ch_size, ch_quad, ch_color, ch_bidi);
              ch = libmupdf._wasm_stext_char_get_next(ch);
            }
          }
          if (walker.endLine)
            walker.endLine();
          line = libmupdf._wasm_stext_line_get_next(line);
        }
        if (walker.endTextBlock)
          walker.endTextBlock();
      } else if (block_type === 1) {
        if (walker.onImageBlock) {
          let matrix = fromMatrix(libmupdf._wasm_stext_block_get_transform(block));
          let image = new Image2(libmupdf._wasm_stext_block_get_image(block));
          walker.onImageBlock(block_bbox, matrix, image);
        }
      } else if (block_type === 2) {
      } else if (block_type === 3) {
        if (walker.onVector) {
          let v_flags_word = libmupdf._wasm_stext_block_get_v_flags(block);
          let v_flags = {
            isStroked: !!(v_flags_word & 1),
            isRectangle: !!(v_flags_word & 2)
          };
          let v_color = colorFromNumber(libmupdf._wasm_stext_block_get_v_argb(block));
          walker.onVector(block_bbox, v_flags, v_color);
        }
      } else if (block_type === 4) {
      }
      block = libmupdf._wasm_stext_block_get_next(block);
    }
  }
  asJSON(scale = 1) {
    return fromStringFree(libmupdf._wasm_print_stext_page_as_json(this.pointer, scale));
  }
  asHTML(id) {
    return fromStringFree(libmupdf._wasm_print_stext_page_as_html(this.pointer, id));
  }
  asText() {
    return fromStringFree(libmupdf._wasm_print_stext_page_as_text(this.pointer));
  }
  snap(p, q, mode) {
    let mm = ENUM(mode, _StructuredText.SELECT_MODE);
    return fromQuad(libmupdf._wasm_snap_selection(this.pointer, POINT(p), POINT2(q), mm));
  }
  copy(p, q) {
    return fromStringFree(libmupdf._wasm_copy_selection(this.pointer, POINT(p), POINT2(q)));
  }
  highlight(p, q, max_hits = 100) {
    let hits = 0;
    let result = [];
    try {
      hits = Malloc(32 * max_hits);
      let n = libmupdf._wasm_highlight_selection(this.pointer, POINT(p), POINT2(q), hits, max_hits);
      for (let i = 0; i < n; ++i)
        result.push(fromQuad(hits + i * 32));
    } finally {
      Free(hits);
    }
    return result;
  }
  search(needle, options) {
    return runSearch(libmupdf._wasm_search_stext_page, this.pointer, needle, options);
  }
};
StructuredText._drop = libmupdf._wasm_drop_stext_page;
StructuredText.SELECT_MODE = [
  "chars",
  "words",
  "lines"
];
StructuredText.SELECT_CHARS = "chars";
StructuredText.SELECT_WORDS = "words";
StructuredText.SELECT_LINES = "lines";
var Device = class _Device extends Userdata {
  constructor(pointer_or_callbacks) {
    if (typeof pointer_or_callbacks === "number")
      super(pointer_or_callbacks);
    else {
      let id = $libmupdf_device_id++;
      $libmupdf_device_table.set(id, pointer_or_callbacks);
      super(libmupdf._wasm_new_js_device(id));
    }
  }
  fillPath(path, evenOdd, ctm, colorspace, color, alpha) {
    checkType(path, Path);
    checkMatrix(ctm);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_fill_path(this.pointer, path.pointer, evenOdd, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha);
  }
  strokePath(path, stroke, ctm, colorspace, color, alpha) {
    checkType(path, Path);
    checkType(stroke, StrokeState);
    checkMatrix(ctm);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_stroke_path(this.pointer, path.pointer, stroke.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha);
  }
  clipPath(path, evenOdd, ctm) {
    checkType(path, Path);
    checkMatrix(ctm);
    libmupdf._wasm_clip_path(this.pointer, path.pointer, evenOdd, MATRIX(ctm));
  }
  clipStrokePath(path, stroke, ctm) {
    checkType(path, Path);
    checkType(stroke, StrokeState);
    checkMatrix(ctm);
    libmupdf._wasm_clip_stroke_path(this.pointer, path.pointer, stroke.pointer, MATRIX(ctm));
  }
  fillText(text, ctm, colorspace, color, alpha) {
    checkType(text, Text);
    checkMatrix(ctm);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_fill_text(this.pointer, text.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha);
  }
  strokeText(text, stroke, ctm, colorspace, color, alpha) {
    checkType(text, Text);
    checkType(stroke, StrokeState);
    checkMatrix(ctm);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_stroke_text(this.pointer, text.pointer, stroke.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha);
  }
  clipText(text, ctm) {
    checkType(text, Text);
    checkMatrix(ctm);
    libmupdf._wasm_clip_text(this.pointer, text.pointer, MATRIX(ctm));
  }
  clipStrokeText(text, stroke, ctm) {
    checkType(text, Text);
    checkType(stroke, StrokeState);
    checkMatrix(ctm);
    libmupdf._wasm_clip_stroke_text(this.pointer, text.pointer, stroke.pointer, MATRIX(ctm));
  }
  ignoreText(text, ctm) {
    checkType(text, Text);
    checkMatrix(ctm);
    libmupdf._wasm_ignore_text(this.pointer, text.pointer, MATRIX(ctm));
  }
  fillShade(shade, ctm, alpha) {
    checkType(shade, Shade);
    checkMatrix(ctm);
    libmupdf._wasm_fill_shade(this.pointer, shade.pointer, MATRIX(ctm), alpha);
  }
  fillImage(image, ctm, alpha) {
    checkType(image, Image2);
    checkMatrix(ctm);
    libmupdf._wasm_fill_image(this.pointer, image.pointer, MATRIX(ctm), alpha);
  }
  fillImageMask(image, ctm, colorspace, color, alpha) {
    checkType(image, Image2);
    checkMatrix(ctm);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_fill_image_mask(this.pointer, image.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha);
  }
  clipImageMask(image, ctm) {
    checkType(image, Image2);
    checkMatrix(ctm);
    libmupdf._wasm_clip_image_mask(this.pointer, image.pointer, MATRIX(ctm));
  }
  popClip() {
    libmupdf._wasm_pop_clip(this.pointer);
  }
  beginMask(area, luminosity, colorspace, color) {
    checkRect(area);
    checkType(colorspace, ColorSpace);
    checkColor(color);
    libmupdf._wasm_begin_mask(this.pointer, RECT(area), luminosity, colorspace.pointer, COLOR(color));
  }
  endMask() {
    libmupdf._wasm_end_mask(this.pointer);
  }
  beginGroup(area, colorspace, isolated, knockout, blendmode, alpha) {
    checkRect(area);
    checkType(colorspace, ColorSpace);
    let blendmode_ix = ENUM(blendmode, _Device.BLEND_MODES);
    libmupdf._wasm_begin_group(this.pointer, RECT(area), colorspace.pointer, isolated, knockout, blendmode_ix, alpha);
  }
  endGroup() {
    libmupdf._wasm_end_group(this.pointer);
  }
  beginTile(area, view, xstep, ystep, ctm, id, doc_id) {
    checkRect(area);
    checkRect(view);
    checkMatrix(ctm);
    return libmupdf._wasm_begin_tile(this.pointer, RECT(area), RECT2(view), xstep, ystep, MATRIX(ctm), id, doc_id);
  }
  endTile() {
    libmupdf._wasm_end_tile(this.pointer);
  }
  beginLayer(name) {
    libmupdf._wasm_begin_layer(this.pointer, STRING(name));
  }
  endLayer() {
    libmupdf._wasm_end_layer(this.pointer);
  }
  close() {
    libmupdf._wasm_close_device(this.pointer);
  }
};
Device._drop = libmupdf._wasm_drop_device;
Device.BLEND_MODES = [
  "Normal",
  "Multiply",
  "Screen",
  "Overlay",
  "Darken",
  "Lighten",
  "ColorDodge",
  "ColorBurn",
  "HardLight",
  "SoftLight",
  "Difference",
  "Exclusion",
  "Hue",
  "Saturation",
  "Color",
  "Luminosity"
];
Device.BLEND_NORMAL = "Normal";
Device.BLEND_MULTIPLY = "Multiply";
Device.BLEND_SCREEN = "Screen";
Device.BLEND_OVERLAY = "Overlay";
Device.BLEND_DARKEN = "Darken";
Device.BLEND_LIGHTEN = "Lighten";
Device.BLEND_COLOR_DODGE = "ColorDodge";
Device.BLEND_COLOR_BURN = "ColorBurn";
Device.BLEND_HARD_LIGHT = "HardLight";
Device.BLEND_SOFT_LIGHT = "SoftLight";
Device.BLEND_DIFFERENCE = "Difference";
Device.BLEND_EXCLUSION = "Exclusion";
Device.BLEND_HUE = "Hue";
Device.BLEND_SATURATION = "Saturation";
Device.BLEND_COLOR = "Color";
Device.BLEND_LUMINOSITY = "Luminosity";
var DrawDevice = class extends Device {
  constructor(matrix, pixmap) {
    checkMatrix(matrix);
    checkType(pixmap, Pixmap);
    super(libmupdf._wasm_new_draw_device(MATRIX(matrix), pixmap.pointer));
  }
};
var DocumentWriter = class extends Userdata {
  constructor(buffer, format, options) {
    options = ensureOptions(options);
    super(libmupdf._wasm_new_document_writer_with_buffer(BUFFER(buffer), STRING(format), STRING2(options)));
  }
  beginPage(mediabox) {
    checkRect(mediabox);
    return new Device(libmupdf._wasm_keep_device(libmupdf._wasm_begin_page(this.pointer, RECT(mediabox))));
  }
  endPage() {
    libmupdf._wasm_end_page(this.pointer);
  }
  close() {
    libmupdf._wasm_close_document_writer(this.pointer);
  }
};
DocumentWriter._drop = libmupdf._wasm_drop_document_writer;
var LinkDestination = class {
  constructor(chapter = 0, page = 0, type = "Fit", x = NaN, y = NaN, width = NaN, height = NaN, zoom = NaN) {
    this.chapter = chapter;
    this.page = page;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zoom = zoom;
  }
};
LinkDestination.LINK_DEST = [
  "Fit",
  "FitB",
  "FitH",
  "FitBH",
  "FitV",
  "FitBV",
  "FitR",
  "XYZ"
];
LinkDestination.FIT = "Fit";
LinkDestination.FIT_B = "FitB";
LinkDestination.FIT_H = "FitH";
LinkDestination.FIT_BH = "FitBH";
LinkDestination.FIT_V = "FitV";
LinkDestination.FIT_BV = "FitBV";
LinkDestination.FIT_R = "FitR";
LinkDestination.XYZ = "XYZ";
var Document = class _Document extends Userdata {
  static openDocument(from, magic) {
    let pointer = 0;
    let free_from = false;
    if (typeof from === "string") {
      magic = from;
      if (node_fs)
        from = node_fs.readFileSync(from);
      else
        throw new Error("missing 'fs' module");
    } else {
      if (typeof magic === "undefined")
        magic = "application/pdf";
    }
    checkType(magic, "string");
    if (from instanceof ArrayBuffer || from instanceof Uint8Array) {
      from = new Buffer2(from);
      free_from = true;
    }
    if (from instanceof Buffer2)
      pointer = libmupdf._wasm_open_document_with_buffer(STRING(magic), from.pointer);
    else if (from instanceof Stream)
      pointer = libmupdf._wasm_open_document_with_stream(STRING(magic), from.pointer);
    else
      throw new Error("not a Buffer or Stream");
    if (free_from) {
      from.destroy();
    }
    let pdf = libmupdf._wasm_pdf_document_from_fz_document(pointer);
    if (pdf)
      return new PDFDocument(pdf);
    return new _Document(pointer);
  }
  formatLinkURI(dest) {
    return fromStringFree(libmupdf._wasm_format_link_uri(this.pointer, dest.chapter | 0, dest.page | 0, ENUM(dest.type, LinkDestination.LINK_DEST), +dest.x, +dest.y, +dest.width, +dest.height, +dest.zoom));
  }
  asPDF() {
    if (this instanceof PDFDocument)
      return this;
    return null;
  }
  isPDF() {
    return this instanceof PDFDocument;
  }
  needsPassword() {
    return !!libmupdf._wasm_needs_password(this.pointer);
  }
  authenticatePassword(password) {
    return libmupdf._wasm_authenticate_password(this.pointer, STRING(password));
  }
  hasPermission(perm) {
    let perm_ix = typeof perm === "number" ? perm : _Document.PERMISSION[perm];
    return !!libmupdf._wasm_has_permission(this.pointer, perm_ix);
  }
  getMetaData(key) {
    let value = libmupdf._wasm_lookup_metadata(this.pointer, STRING(key));
    if (value)
      return fromString(value);
    return void 0;
  }
  setMetaData(key, value) {
    libmupdf._wasm_set_metadata(this.pointer, STRING(key), STRING2(value));
  }
  countPages() {
    return libmupdf._wasm_count_pages(this.pointer);
  }
  isReflowable() {
    libmupdf._wasm_is_document_reflowable(this.pointer);
  }
  style(publisherCSS, userCSS) {
    checkType(publisherCSS, "boolean");
    checkType(userCSS, "string");
    libmupdf._wasm_style_document(this.pointer, publisherCSS, STRING(userCSS));
  }
  layout(w, h, em) {
    libmupdf._wasm_layout_document(this.pointer, w, h, em);
  }
  loadPage(index) {
    let fz_ptr = libmupdf._wasm_load_page(this.pointer, index);
    if (this instanceof PDFDocument) {
      let pdf_ptr = libmupdf._wasm_pdf_page_from_fz_page(fz_ptr);
      if (pdf_ptr)
        return new PDFPage(this, pdf_ptr);
    }
    return new Page(fz_ptr);
  }
  loadOutline() {
    let doc = this.pointer;
    function to_outline(outline) {
      let result = [];
      while (outline) {
        let title = libmupdf._wasm_outline_get_title(outline);
        let uri = libmupdf._wasm_outline_get_uri(outline);
        let open = libmupdf._wasm_outline_get_is_open(outline);
        let item = {
          title: title ? fromString(title) : void 0,
          uri: uri ? fromString(uri) : void 0,
          open: !!open
        };
        let page = libmupdf._wasm_outline_get_page(doc, outline);
        if (page >= 0)
          item.page = page;
        let down = libmupdf._wasm_outline_get_down(outline);
        if (down)
          item.down = to_outline(down);
        result.push(item);
        outline = libmupdf._wasm_outline_get_next(outline);
      }
      return result;
    }
    let root = libmupdf._wasm_load_outline(doc);
    if (root)
      return to_outline(root);
    return null;
  }
  resolveLink(link) {
    if (link instanceof Link)
      return libmupdf._wasm_resolve_link(this.pointer, libmupdf._wasm_link_get_uri(link.pointer));
    return libmupdf._wasm_resolve_link(this.pointer, STRING(link));
  }
  resolveLinkDestination(link) {
    let dest;
    if (link instanceof Link)
      dest = libmupdf._wasm_resolve_link_dest(this.pointer, libmupdf._wasm_link_get_uri(link.pointer));
    else
      dest = libmupdf._wasm_resolve_link_dest(this.pointer, STRING(link));
    return {
      type: LinkDestination.LINK_DEST[libmupdf._wasm_link_dest_get_type(dest)],
      chapter: libmupdf._wasm_link_dest_get_chapter(dest),
      page: libmupdf._wasm_link_dest_get_page(dest),
      x: libmupdf._wasm_link_dest_get_x(dest),
      y: libmupdf._wasm_link_dest_get_y(dest),
      width: libmupdf._wasm_link_dest_get_w(dest),
      height: libmupdf._wasm_link_dest_get_h(dest),
      zoom: libmupdf._wasm_link_dest_get_zoom(dest)
    };
  }
  outlineIterator() {
    return new OutlineIterator(libmupdf._wasm_new_outline_iterator(this.pointer));
  }
};
Document._drop = libmupdf._wasm_drop_document;
Document.META_FORMAT = "format";
Document.META_ENCRYPTION = "encryption";
Document.META_INFO_AUTHOR = "info:Author";
Document.META_INFO_TITLE = "info:Title";
Document.META_INFO_SUBJECT = "info:Subject";
Document.META_INFO_KEYWORDS = "info:Keywords";
Document.META_INFO_CREATOR = "info:Creator";
Document.META_INFO_PRODUCER = "info:Producer";
Document.META_INFO_CREATIONDATE = "info:CreationDate";
Document.META_INFO_MODIFICATIONDATE = "info:ModDate";
Document.PERMISSION_PRINT = "print";
Document.PERMISSION_COPY = "copy";
Document.PERMISSION_EDIT = "eedit";
Document.PERMISSION_ANNOTATE = "annotate";
Document.PERMISSION_FORM = "form";
Document.PERMISSION_ACCESSIBILITY = "accessibility";
Document.PERMISSION_ASSEMBLE = "assemble";
Document.PERMISSION_PRINT_HQ = "print-hq";
Document.PERMISSION = {
  "print": "p".charCodeAt(0),
  "copy": "c".charCodeAt(0),
  "edit": "e".charCodeAt(0),
  "annotate": "n".charCodeAt(0),
  "form": "f".charCodeAt(0),
  "accessibility": "y".charCodeAt(0),
  "assemble": "a".charCodeAt(0),
  "print-hq": "h".charCodeAt(0)
};
var OutlineIterator = class extends Userdata {
  item() {
    let item = libmupdf._wasm_outline_iterator_item(this.pointer);
    if (item) {
      let title_ptr = libmupdf._wasm_outline_item_get_title(item);
      let uri_ptr = libmupdf._wasm_outline_item_get_uri(item);
      let is_open = libmupdf._wasm_outline_item_get_is_open(item);
      return {
        title: title_ptr ? fromString(title_ptr) : void 0,
        uri: uri_ptr ? fromString(uri_ptr) : void 0,
        open: !!is_open
      };
    }
    return null;
  }
  next() {
    return libmupdf._wasm_outline_iterator_next(this.pointer);
  }
  prev() {
    return libmupdf._wasm_outline_iterator_prev(this.pointer);
  }
  up() {
    return libmupdf._wasm_outline_iterator_up(this.pointer);
  }
  down() {
    return libmupdf._wasm_outline_iterator_down(this.pointer);
  }
  delete() {
    return libmupdf._wasm_outline_iterator_delete(this.pointer);
  }
  insert(item) {
    return libmupdf._wasm_outline_iterator_insert(this.pointer, STRING_OPT(item.title), STRING2_OPT(item.uri), item.open);
  }
  update(item) {
    libmupdf._wasm_outline_iterator_update(this.pointer, STRING_OPT(item.title), STRING2_OPT(item.uri), item.open);
  }
};
OutlineIterator._drop = libmupdf._wasm_drop_outline_iterator;
OutlineIterator.ITERATOR_DID_NOT_MOVE = -1;
OutlineIterator.ITERATOR_AT_ITEM = 0;
OutlineIterator.ITERATOR_AT_EMPTY = 1;
OutlineIterator.FLAG_BOLD = 1;
OutlineIterator.FLAG_ITALIC = 2;
var Link = class extends Userdata {
  getBounds() {
    return fromRect(libmupdf._wasm_link_get_rect(this.pointer));
  }
  setBounds(rect) {
    checkRect(rect);
    libmupdf._wasm_link_set_rect(this.pointer, RECT(rect));
  }
  getURI() {
    return fromString(libmupdf._wasm_link_get_uri(this.pointer));
  }
  setURI(uri) {
    checkType(uri, "string");
    libmupdf._wasm_link_set_uri(this.pointer, STRING(uri));
  }
  isExternal() {
    return /^\w[\w+-.]*:/.test(this.getURI());
  }
};
Link._drop = libmupdf._wasm_drop_link;
var Page = class _Page extends Userdata {
  isPDF() {
    return this instanceof PDFPage;
  }
  getBounds(box = "CropBox") {
    let box_ix = ENUM(box, _Page.BOXES);
    return fromRect(libmupdf._wasm_bound_page(this.pointer, box_ix));
  }
  getLabel() {
    return fromString(libmupdf._wasm_page_label(this.pointer));
  }
  run(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_run_page(this.pointer, device.pointer, MATRIX(matrix));
  }
  runPageContents(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_run_page_contents(this.pointer, device.pointer, MATRIX(matrix));
  }
  runPageAnnots(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_run_page_annots(this.pointer, device.pointer, MATRIX(matrix));
  }
  runPageWidgets(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_run_page_widgets(this.pointer, device.pointer, MATRIX(matrix));
  }
  toPixmap(matrix, colorspace, alpha = false, showExtras = true) {
    checkType(colorspace, ColorSpace);
    checkMatrix(matrix);
    let result;
    if (showExtras)
      result = libmupdf._wasm_new_pixmap_from_page(this.pointer, MATRIX(matrix), colorspace.pointer, alpha);
    else
      result = libmupdf._wasm_new_pixmap_from_page_contents(this.pointer, MATRIX(matrix), colorspace.pointer, alpha);
    return new Pixmap(result);
  }
  toDisplayList(showExtras = true) {
    let result;
    if (showExtras)
      result = libmupdf._wasm_new_display_list_from_page(this.pointer);
    else
      result = libmupdf._wasm_new_display_list_from_page_contents(this.pointer);
    return new DisplayList(result);
  }
  toStructuredText(options) {
    options = ensureOptions(options);
    return new StructuredText(libmupdf._wasm_new_stext_page_from_page(this.pointer, STRING(options)));
  }
  getLinks() {
    let links = [];
    let link = libmupdf._wasm_load_links(this.pointer);
    while (link) {
      links.push(new Link(libmupdf._wasm_keep_link(link)));
      link = libmupdf._wasm_link_get_next(link);
    }
    return links;
  }
  createLink(bbox, uri) {
    checkRect(bbox);
    return new Link(libmupdf._wasm_create_link(this.pointer, RECT(bbox), STRING(uri)));
  }
  deleteLink(link) {
    checkType(link, Link);
    libmupdf._wasm_delete_link(this.pointer, link.pointer);
  }
  search(needle, options) {
    return runSearch(libmupdf._wasm_search_page, this.pointer, needle, options);
  }
};
Page._drop = libmupdf._wasm_drop_page;
Page.BOXES = [
  "MediaBox",
  "CropBox",
  "BleedBox",
  "TrimBox",
  "ArtBox"
];
Page.MEDIA_BOX = "MediaBox";
Page.CROP_BOX = "CropBox";
Page.BLEED_BOX = "BleedBox";
Page.TRIM_BOX = "TrimBox";
Page.ART_BOX = "ArtBox";
var PDFDocument = class _PDFDocument extends Document {
  constructor(arg1) {
    if (typeof arg1 === "undefined")
      super(libmupdf._wasm_pdf_create_document());
    else if (typeof arg1 === "number")
      super(arg1);
    else if (arg1 instanceof _PDFDocument) {
      super(arg1.pointer);
      libmupdf._wasm_keep_document(this.pointer);
    } else {
      let doc = Document.openDocument(arg1, "application/pdf");
      if (doc instanceof _PDFDocument)
        return doc;
      throw new Error("not a PDF document");
    }
  }
  loadPage(index) {
    return super.loadPage(index);
  }
  // PDFObject instances are always bound to a document, so the WASM/JS value interface lives here.
  // Wrap a pdf_obj in a Userdata object. The pointer must be newly created or we already own it.
  _fromPDFObjectNew(ptr) {
    if (ptr === 0)
      return PDFObject.Null;
    return new PDFObject(this, ptr);
  }
  // Wrap a pdf_obj in a Userdata object. The pointer must be a borrowed pointer, so we have to take ownership.
  _fromPDFObjectKeep(ptr) {
    if (ptr === 0)
      return PDFObject.Null;
    return new PDFObject(this, libmupdf._wasm_pdf_keep_obj(ptr));
  }
  _toPDFObject(obj) {
    if (obj instanceof PDFObject)
      return obj;
    if (obj === null || obj === void 0)
      return this.newNull();
    if (typeof obj === "string") {
      if (obj.startsWith("(") && obj.endsWith(")"))
        return this.newString(obj.slice(1, -1));
      return this.newName(obj);
    }
    if (typeof obj === "number") {
      if (obj === (obj | 0))
        return this.newInteger(obj);
      return this.newReal(obj);
    }
    if (typeof obj === "boolean")
      return this.newBoolean(obj);
    if (obj instanceof Array) {
      let result = this.newArray();
      for (let item of obj)
        result.push(item);
      return result;
    }
    if (obj instanceof Object) {
      let result = this.newDictionary();
      for (let key in obj)
        result.put(key, obj[key]);
      return result;
    }
    throw new TypeError("cannot convert value to PDFObject");
  }
  _PDFOBJ(obj) {
    return this._toPDFObject(obj).pointer;
  }
  getVersion() {
    return libmupdf._wasm_pdf_version(this.pointer);
  }
  getLanguage() {
    return fromStringOrNull(libmupdf._wasm_pdf_document_language(this.pointer));
  }
  setLanguage(lang) {
    libmupdf._wasm_pdf_set_document_language(this.pointer, STRING(lang));
  }
  countObjects() {
    return libmupdf._wasm_pdf_xref_len(this.pointer);
  }
  getTrailer() {
    return new PDFObject(this, libmupdf._wasm_pdf_trailer(this.pointer));
  }
  createObject() {
    let num = libmupdf._wasm_pdf_create_object(this.pointer);
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_indirect(this.pointer, num));
  }
  newNull() {
    return PDFObject.Null;
  }
  newBoolean(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_bool(v));
  }
  newInteger(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_int(v));
  }
  newReal(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_real(v));
  }
  newName(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_name(STRING(v)));
  }
  newString(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_text_string(STRING(v)));
  }
  newByteString(v) {
    if (v instanceof Array)
      v = Uint8Array.from(v);
    checkType(v, Uint8Array);
    let len = v.byteLength;
    let ptr = Malloc(len);
    libmupdf.HEAPU8.set(v, ptr);
    try {
      return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_string(ptr, len));
    } finally {
      Free(ptr);
    }
  }
  newIndirect(v) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_indirect(this.pointer, v));
  }
  newArray() {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_array(this.pointer));
  }
  newDictionary() {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_dict(this.pointer));
  }
  deleteObject(num) {
    if (num instanceof PDFObject)
      num = num.asIndirect();
    else
      checkType(num, "number");
    libmupdf._wasm_pdf_delete_object(this.pointer, num);
  }
  addObject(obj) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_object(this.pointer, this._PDFOBJ(obj)));
  }
  addStream(buf, obj) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_stream(this.pointer, BUFFER(buf), this._PDFOBJ(obj), 0));
  }
  addRawStream(buf, obj) {
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_stream(this.pointer, BUFFER(buf), this._PDFOBJ(obj), 1));
  }
  newGraftMap() {
    return new PDFGraftMap(this, libmupdf._wasm_pdf_new_graft_map(this.pointer));
  }
  graftObject(obj) {
    checkType(obj, PDFObject);
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_graft_object(this.pointer, obj.pointer));
  }
  graftPage(to, srcDoc, srcPage) {
    checkType(to, "number");
    checkType(srcDoc, _PDFDocument);
    checkType(srcPage, "number");
    libmupdf._wasm_pdf_graft_page(this.pointer, to, srcDoc.pointer, srcPage);
  }
  addSimpleFont(font, encoding = "Latin") {
    checkType(font, Font);
    var encoding_ix = ENUM(encoding, Font.SIMPLE_ENCODING);
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_simple_font(this.pointer, font.pointer, encoding_ix));
  }
  addCJKFont(font, lang, wmode = 0, serif = true) {
    checkType(font, Font);
    if (typeof lang === "string")
      lang = Font.CJK_ORDERING_BY_LANG[lang];
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_cjk_font(this.pointer, font.pointer, lang, wmode, serif));
  }
  addFont(font) {
    checkType(font, Font);
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_cid_font(this.pointer, font.pointer));
  }
  addImage(image) {
    checkType(image, Image2);
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_image(this.pointer, image.pointer));
  }
  loadImage(ref) {
    checkType(ref, PDFObject);
    return new Image2(libmupdf._wasm_pdf_load_image(this.pointer, ref.pointer));
  }
  findPage(index) {
    checkType(index, "number");
    return this._fromPDFObjectKeep(libmupdf._wasm_pdf_lookup_page_obj(this.pointer, index));
  }
  setPageTreeCache(enabled) {
    checkType(enabled, "boolean");
    libmupdf._wasm_pdf_set_page_tree_cache(this.pointer, enabled);
  }
  addPage(mediabox, rotate, resources, contents) {
    checkRect(mediabox);
    checkType(rotate, "number");
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_page(this.pointer, RECT(mediabox), rotate, this._PDFOBJ(resources), BUFFER(contents)));
  }
  insertPage(at, obj) {
    checkType(at, "number");
    libmupdf._wasm_pdf_insert_page(this.pointer, at, this._PDFOBJ(obj));
  }
  deletePage(at) {
    checkType(at, "number");
    libmupdf._wasm_pdf_delete_page(this.pointer, at);
  }
  isEmbeddedFile(ref) {
    checkType(ref, PDFObject);
    return !!libmupdf._wasm_pdf_is_embedded_file(ref.pointer);
  }
  addEmbeddedFile(filename, mimetype, contents, created, modified, checksum = false) {
    checkType(filename, "string");
    checkType(mimetype, "string");
    checkType(created, Date);
    checkType(modified, Date);
    checkType(checksum, "boolean");
    return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_embedded_file(this.pointer, STRING(filename), STRING2(mimetype), BUFFER(contents), created.getTime() / 1e3 | 0, modified.getTime() / 1e3 | 0, checksum));
  }
  getFilespecParams(ref) {
    checkType(ref, PDFObject);
    let ptr = libmupdf._wasm_pdf_get_filespec_params(ref.pointer);
    return {
      filename: fromString(libmupdf._wasm_pdf_filespec_params_get_filename(ptr)),
      mimetype: fromString(libmupdf._wasm_pdf_filespec_params_get_mimetype(ptr)),
      size: libmupdf._wasm_pdf_filespec_params_get_filename(ptr),
      creationDate: new Date(libmupdf._wasm_pdf_filespec_params_get_created(ptr) * 1e3),
      modificationDate: new Date(libmupdf._wasm_pdf_filespec_params_get_modified(ptr) * 1e3)
    };
  }
  getEmbeddedFileContents(ref) {
    checkType(ref, PDFObject);
    let contents = libmupdf._wasm_pdf_load_embedded_file_contents(ref.pointer);
    if (contents)
      return new Buffer2(contents);
    return null;
  }
  getEmbeddedFiles() {
    function _getEmbeddedFilesRec(result, N) {
      var i, n;
      if (N.isDictionary()) {
        var NN = N.get("Names");
        if (NN)
          for (i = 0, n = NN.length; i < n; i += 2)
            result[NN.get(i + 0).asString()] = NN.get(i + 1);
        var NK = N.get("Kids");
        if (NK)
          for (i = 0, n = NK.length; i < n; i += 1)
            _getEmbeddedFilesRec(result, NK.get(i));
      }
      return result;
    }
    return _getEmbeddedFilesRec({}, this.getTrailer().get("Root", "Names", "EmbeddedFiles"));
  }
  loadNameTree(treeName) {
    function _loadNameTreeRec(dict2, node2) {
      var kids = node2.get("Kids");
      if (kids && kids.isArray())
        for (var i = 0; i < kids.length; i += 1)
          _loadNameTreeRec(dict2, kids.get(i));
      var names = node2.get("Names");
      if (names && names.isArray())
        for (var i = 0; i < names.length; i += 2)
          dict2[names.get(i).asString()] = names.get(i + 1);
    }
    var node = this.getTrailer().get("Root").get("Names").get(treeName);
    var dict = {};
    if (node.isDictionary())
      _loadNameTreeRec(dict, node);
    return dict;
  }
  insertEmbeddedFile(filename, filespec) {
    var efs = this.getEmbeddedFiles();
    efs[filename] = filespec;
    this._rewriteEmbeddedFiles(efs);
  }
  deleteEmbeddedFile(filename) {
    var efs = this.getEmbeddedFiles();
    delete efs[filename];
    this._rewriteEmbeddedFiles(efs);
  }
  _rewriteEmbeddedFiles(efs) {
    var efs_keys = Object.keys(efs);
    efs_keys.sort();
    var root = this.getTrailer().get("Root");
    var root_names = root.get("Names");
    if (!root_names.isDictionary())
      root_names = root.put("Names", this.newDictionary());
    var root_names_efs = root_names.put("EmbeddedFiles", this.newDictionary());
    var root_names_efs_names = root_names_efs.put("Names", this.newArray());
    for (var key of efs_keys) {
      root_names_efs_names.push(this.newString(key));
      root_names_efs_names.push(efs[key]);
    }
  }
  saveToBuffer(options) {
    options = ensureOptions(options);
    return new Buffer2(libmupdf._wasm_pdf_write_document_buffer(this.pointer, STRING(options)));
  }
  save(filename, options) {
    if (node_fs)
      node_fs.writeFileSync(filename, this.saveToBuffer(options).asUint8Array());
    else
      throw new Error("missing 'fs' module");
  }
  setPageLabels(index, style = "D", prefix = "", start = 1) {
    libmupdf._wasm_pdf_set_page_labels(this.pointer, index, style.charCodeAt(0), STRING(prefix), start);
  }
  deletePageLabels(index) {
    libmupdf._wasm_pdf_delete_page_labels(this.pointer, index);
  }
  wasRepaired() {
    return !!libmupdf._wasm_pdf_was_repaired(this.pointer);
  }
  hasUnsavedChanges() {
    return !!libmupdf._wasm_pdf_has_unsaved_changes(this.pointer);
  }
  countVersions() {
    return libmupdf._wasm_pdf_count_versions(this.pointer);
  }
  countUnsavedVersions() {
    return libmupdf._wasm_pdf_count_unsaved_versions(this.pointer);
  }
  validateChangeHistory() {
    return libmupdf._wasm_pdf_validate_change_history(this.pointer);
  }
  canBeSavedIncrementally() {
    return !!libmupdf._wasm_pdf_can_be_saved_incrementally(this.pointer);
  }
  enableJournal() {
    libmupdf._wasm_pdf_enable_journal(this.pointer);
  }
  getJournal() {
    let position = libmupdf._wasm_pdf_undoredo_state_position(this.pointer);
    let n = libmupdf._wasm_pdf_undoredo_state_count(this.pointer);
    let steps = [];
    for (let i = 0; i < n; ++i)
      steps.push(fromString(libmupdf._wasm_pdf_undoredo_step(this.pointer, i)));
    return { position, steps };
  }
  beginOperation(op) {
    libmupdf._wasm_pdf_begin_operation(this.pointer, STRING(op));
  }
  beginImplicitOperation() {
    libmupdf._wasm_pdf_begin_implicit_operation(this.pointer);
  }
  endOperation() {
    libmupdf._wasm_pdf_end_operation(this.pointer);
  }
  abandonOperation() {
    libmupdf._wasm_pdf_abandon_operation(this.pointer);
  }
  canUndo() {
    return !!libmupdf._wasm_pdf_can_undo(this.pointer);
  }
  canRedo() {
    return !!libmupdf._wasm_pdf_can_redo(this.pointer);
  }
  undo() {
    libmupdf._wasm_pdf_undo(this.pointer);
  }
  redo() {
    libmupdf._wasm_pdf_redo(this.pointer);
  }
  isJSSupported() {
    return !!libmupdf._wasm_pdf_js_supported(this.pointer);
  }
  enableJS() {
    libmupdf._wasm_pdf_enable_js(this.pointer);
  }
  disableJS() {
    libmupdf._wasm_pdf_disable_js(this.pointer);
  }
  setJSEventListener(_listener) {
    throw "TODO";
  }
  rearrangePages(pages) {
    let n = pages.length;
    let ptr = Malloc(n << 2);
    for (let i = 0; i < n; ++i)
      libmupdf.HEAPU32[(ptr >> 2) + i] = pages[i] || 0;
    try {
      libmupdf._wasm_pdf_rearrange_pages(this.pointer, n, ptr);
    } finally {
      Free(ptr);
    }
  }
  subsetFonts() {
    libmupdf._wasm_pdf_subset_fonts(this.pointer);
  }
  bake(bakeAnnots = true, bakeWidgets = true) {
    libmupdf._wasm_pdf_bake_document(this.pointer, bakeAnnots, bakeWidgets);
  }
  countLayerConfigs() {
    return libmupdf._wasm_pdf_count_layer_configs(this.pointer);
  }
  getLayerConfigCreator(config) {
    return fromString(libmupdf._wasm_pdf_layer_config_creator(this.pointer, config));
  }
  getLayerConfigName(config) {
    return fromString(libmupdf._wasm_pdf_layer_config_name(this.pointer, config));
  }
  selectLayerConfig(config) {
    libmupdf._wasm_pdf_select_layer_config(this.pointer, config);
  }
  countLayerConfigUIs() {
    return libmupdf._wasm_pdf_count_layer_config_uis(this.pointer);
  }
  getLayerConfigUIInfo(configui) {
    return fromLayerConfigUIInfo(libmupdf._wasm_pdf_layer_config_ui_info(this.pointer, configui));
  }
  countLayers() {
    return libmupdf._wasm_pdf_count_layers(this.pointer);
  }
  isLayerVisible(layer) {
    return !!libmupdf._wasm_pdf_layer_is_enabled(this.pointer, layer);
  }
  setLayerVisible(layer, visible) {
    libmupdf._wasm_pdf_enable_layer(this.pointer, layer, Number(visible));
  }
  getLayerName(layer) {
    return fromString(libmupdf._wasm_pdf_layer_name(this.pointer, layer));
  }
  resetForm(fields, exclude) {
    libmupdf._wasm_pdf_reset_form(this.pointer, this._PDFOBJ(fields), Number(exclude));
  }
};
PDFDocument.PAGE_LABEL_NONE = "\0";
PDFDocument.PAGE_LABEL_DECIMAL = "D";
PDFDocument.PAGE_LABEL_ROMAN_UC = "R";
PDFDocument.PAGE_LABEL_ROMAN_LC = "r";
PDFDocument.PAGE_LABEL_ALPHA_UC = "A";
PDFDocument.PAGE_LABEL_ALPHA_LC = "a";
var PDFPage = class extends Page {
  // PRIVATE
  constructor(doc, pointer) {
    super(pointer);
    this._doc = doc;
    this._annots = null;
    this._widgets = null;
  }
  getObject() {
    return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_page_get_obj(this.pointer));
  }
  getTransform() {
    return fromMatrix(libmupdf._wasm_pdf_page_transform(this.pointer));
  }
  setPageBox(box, rect) {
    let box_ix = ENUM(box, Page.BOXES);
    checkRect(rect);
    libmupdf._wasm_pdf_set_page_box(this.pointer, box_ix, RECT(rect));
  }
  toPixmap(matrix, colorspace, alpha = false, showExtras = true, usage = "View", box = "CropBox") {
    checkMatrix(matrix);
    checkType(colorspace, ColorSpace);
    let box_ix = ENUM(box, Page.BOXES);
    let result;
    if (showExtras)
      result = libmupdf._wasm_pdf_new_pixmap_from_page_with_usage(this.pointer, MATRIX(matrix), colorspace.pointer, alpha, STRING(usage), box_ix);
    else
      result = libmupdf._wasm_pdf_new_pixmap_from_page_contents_with_usage(this.pointer, MATRIX(matrix), colorspace.pointer, alpha, STRING(usage), box_ix);
    return new Pixmap(result);
  }
  getWidgets() {
    if (!this._widgets) {
      this._widgets = [];
      let widget = libmupdf._wasm_pdf_first_widget(this.pointer);
      while (widget) {
        this._widgets.push(new PDFWidget(this._doc, libmupdf._wasm_pdf_keep_annot(widget)));
        widget = libmupdf._wasm_pdf_next_widget(widget);
      }
    }
    return this._widgets;
  }
  getAnnotations() {
    if (!this._annots) {
      this._annots = [];
      let annot = libmupdf._wasm_pdf_first_annot(this.pointer);
      while (annot) {
        this._annots.push(new PDFAnnotation(this._doc, libmupdf._wasm_pdf_keep_annot(annot)));
        annot = libmupdf._wasm_pdf_next_annot(annot);
      }
    }
    return this._annots;
  }
  createAnnotation(type) {
    let type_ix = ENUM(type, PDFAnnotation.ANNOT_TYPES);
    let annot = new PDFAnnotation(this._doc, libmupdf._wasm_pdf_create_annot(this.pointer, type_ix));
    if (this._annots)
      this._annots.push(annot);
    return annot;
  }
  deleteAnnotation(annot) {
    checkType(annot, PDFAnnotation);
    libmupdf._wasm_pdf_delete_annot(this.pointer, annot.pointer);
    if (this._annots) {
      let ix = this._annots.indexOf(annot);
      if (ix >= 0)
        this._annots.splice(ix, 1);
    }
  }
  applyRedactions(black_boxes = true, image_method = 2, line_art_method = 1, text_method = 0) {
    libmupdf._wasm_pdf_redact_page(this.pointer, Number(black_boxes), image_method, line_art_method, text_method);
  }
  update() {
    return !!libmupdf._wasm_pdf_update_page(this.pointer);
  }
};
PDFPage.REDACT_IMAGE_NONE = 0;
PDFPage.REDACT_IMAGE_REMOVE = 1;
PDFPage.REDACT_IMAGE_PIXELS = 2;
PDFPage.REDACT_IMAGE_UNLESS_INVISIBLE = 3;
PDFPage.REDACT_LINE_ART_NONE = 0;
PDFPage.REDACT_LINE_ART_REMOVE_IF_COVERED = 1;
PDFPage.REDACT_LINE_ART_REMOVE_IF_TOUCHED = 2;
PDFPage.REDACT_TEXT_REMOVE = 0;
PDFPage.REDACT_TEXT_NONE = 1;
var PDFObject = class _PDFObject extends Userdata {
  // PRIVATE
  constructor(doc, pointer) {
    super(libmupdf._wasm_pdf_keep_obj(pointer));
    this._doc = doc;
  }
  isNull() {
    return this === _PDFObject.Null;
  }
  isIndirect() {
    return !!libmupdf._wasm_pdf_is_indirect(this.pointer);
  }
  isBoolean() {
    return !!libmupdf._wasm_pdf_is_bool(this.pointer);
  }
  isInteger() {
    return !!libmupdf._wasm_pdf_is_int(this.pointer);
  }
  isReal() {
    return !!libmupdf._wasm_pdf_is_real(this.pointer);
  }
  isNumber() {
    return !!libmupdf._wasm_pdf_is_number(this.pointer);
  }
  isName() {
    return !!libmupdf._wasm_pdf_is_name(this.pointer);
  }
  isString() {
    return !!libmupdf._wasm_pdf_is_string(this.pointer);
  }
  isArray() {
    return !!libmupdf._wasm_pdf_is_array(this.pointer);
  }
  isDictionary() {
    return !!libmupdf._wasm_pdf_is_dict(this.pointer);
  }
  isStream() {
    return !!libmupdf._wasm_pdf_is_stream(this.pointer);
  }
  asIndirect() {
    return libmupdf._wasm_pdf_to_num(this.pointer);
  }
  asBoolean() {
    return !!libmupdf._wasm_pdf_to_bool(this.pointer);
  }
  asNumber() {
    return libmupdf._wasm_pdf_to_real(this.pointer);
  }
  asName() {
    return fromString(libmupdf._wasm_pdf_to_name(this.pointer));
  }
  asString() {
    return fromString(libmupdf._wasm_pdf_to_text_string(this.pointer));
  }
  asByteString() {
    let ptr = libmupdf._wasm_pdf_to_string(this.pointer, _wasm_int);
    let len = libmupdf.HEAPU32[_wasm_int >> 2];
    return libmupdf.HEAPU8.slice(ptr, ptr + len);
  }
  readStream() {
    return new Buffer2(libmupdf._wasm_pdf_load_stream(this.pointer));
  }
  readRawStream() {
    return new Buffer2(libmupdf._wasm_pdf_load_raw_stream(this.pointer));
  }
  writeObject(obj) {
    if (!this.isIndirect())
      throw new TypeError("can only call PDFObject.writeObject on an indirect reference");
    libmupdf._wasm_pdf_update_object(this._doc.pointer, this.asIndirect(), this._doc._PDFOBJ(obj));
  }
  writeStream(buf) {
    if (!this.isIndirect())
      throw new TypeError("can only call PDFObject.writeStream on an indirect reference");
    libmupdf._wasm_pdf_update_stream(this._doc.pointer, this.pointer, BUFFER(buf), 0);
  }
  writeRawStream(buf) {
    if (!this.isIndirect())
      throw new TypeError("can only call PDFObject.writeRawStream on an indirect reference");
    libmupdf._wasm_pdf_update_stream(this._doc.pointer, this.pointer, BUFFER(buf), 1);
  }
  resolve() {
    return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_resolve_indirect(this.pointer));
  }
  get length() {
    return libmupdf._wasm_pdf_array_len(this.pointer);
  }
  set length(_2) {
    throw new TypeError("object length is read-only");
  }
  _get(path) {
    let obj = this.pointer;
    for (let key of path) {
      if (typeof key === "number")
        obj = libmupdf._wasm_pdf_array_get(obj, key);
      else if (key instanceof _PDFObject)
        obj = libmupdf._wasm_pdf_dict_get(obj, key.pointer);
      else
        obj = libmupdf._wasm_pdf_dict_gets(obj, STRING(key));
      if (obj === 0)
        break;
    }
    return obj;
  }
  get(...path) {
    return this._doc._fromPDFObjectKeep(this._get(path));
  }
  getInheritable(key) {
    if (key instanceof _PDFObject)
      return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_inheritable(this.pointer, key.pointer));
    return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_gets_inheritable(this.pointer, STRING(key)));
  }
  put(key, value) {
    value = this._doc._toPDFObject(value);
    if (typeof key === "number")
      libmupdf._wasm_pdf_array_put(this.pointer, key, value.pointer);
    else if (key instanceof _PDFObject)
      libmupdf._wasm_pdf_dict_put(this.pointer, key.pointer, value.pointer);
    else
      libmupdf._wasm_pdf_dict_puts(this.pointer, STRING(key), value.pointer);
    return value;
  }
  push(value) {
    value = this._doc._toPDFObject(value);
    libmupdf._wasm_pdf_array_push(this.pointer, value.pointer);
    return value;
  }
  delete(key) {
    if (typeof key === "number")
      libmupdf._wasm_pdf_array_delete(this.pointer, key);
    else if (key instanceof _PDFObject)
      libmupdf._wasm_pdf_dict_del(this.pointer, key.pointer);
    else
      libmupdf._wasm_pdf_dict_dels(this.pointer, STRING(key));
  }
  valueOf() {
    if (this.isNull())
      return null;
    if (this.isBoolean())
      return this.asBoolean();
    if (this.isNumber())
      return this.asNumber();
    if (this.isName())
      return this.asName();
    if (this.isString())
      return this.asString();
    if (this.isIndirect())
      return `${this.asIndirect()} 0 R`;
    return this;
  }
  toString(tight = true, ascii = true) {
    return fromStringFree(libmupdf._wasm_pdf_sprint_obj(this.pointer, tight, ascii));
  }
  forEach(fn) {
    if (this.isArray()) {
      let n = this.length;
      for (let i = 0; i < n; ++i)
        fn(this.get(i), i, this);
    } else if (this.isDictionary()) {
      let n = libmupdf._wasm_pdf_dict_len(this.pointer);
      for (let i = 0; i < n; ++i) {
        let key = this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_key(this.pointer, i));
        let val = this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_val(this.pointer, i));
        fn(val, key.asName(), this);
      }
    }
  }
  // Convert to plain Javascript values, objects, and arrays.
  // If you want to resolve indirect references, pass an empty object or array as the first argument.
  // On exit, this object will contain all indirect objects encountered indexed by object number.
  // Note: This function will omit cyclic references.
  asJS(seen) {
    if (this.isIndirect()) {
      let ref = this.asIndirect();
      if (!seen)
        return `${ref} 0 R`;
      if (ref in seen)
        return seen[ref];
      seen[ref] = _PDFObject.Null;
      return seen[ref] = this.resolve().asJS(seen);
    }
    if (this.isArray()) {
      let result = [];
      this.forEach((val) => {
        result.push(val.asJS(seen));
      });
      return result;
    }
    if (this.isDictionary()) {
      let result = {};
      this.forEach((val, key) => {
        result[key] = val.asJS(seen);
      });
      return result;
    }
    return this.valueOf();
  }
};
PDFObject._drop = libmupdf._wasm_pdf_drop_obj;
PDFObject.Null = new PDFObject(null, 0);
var PDFGraftMap = class extends Userdata {
  // PRIVATE
  constructor(doc, pointer) {
    super(pointer);
    this._doc = doc;
  }
  graftObject(obj) {
    checkType(obj, PDFObject);
    return this._doc._fromPDFObjectNew(libmupdf._wasm_pdf_graft_mapped_object(this.pointer, obj.pointer));
  }
  graftPage(to, srcDoc, srcPage) {
    checkType(to, "number");
    checkType(srcDoc, PDFDocument);
    checkType(srcPage, "number");
    libmupdf._wasm_pdf_graft_mapped_page(this.pointer, to, srcDoc.pointer, srcPage);
  }
};
PDFGraftMap._drop = libmupdf._wasm_pdf_drop_graft_map;
var PDFAnnotation = class _PDFAnnotation extends Userdata {
  // PRIVATE
  constructor(doc, pointer) {
    super(pointer);
    this._doc = doc;
  }
  getObject() {
    return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_annot_obj(this.pointer));
  }
  getBounds() {
    return fromRect(libmupdf._wasm_pdf_bound_annot(this.pointer));
  }
  run(device, matrix) {
    checkType(device, Device);
    checkMatrix(matrix);
    libmupdf._wasm_pdf_run_annot(this.pointer, device.pointer, MATRIX(matrix));
  }
  toPixmap(matrix, colorspace, alpha = false) {
    checkMatrix(matrix);
    checkType(colorspace, ColorSpace);
    return new Pixmap(libmupdf._wasm_pdf_new_pixmap_from_annot(this.pointer, MATRIX(matrix), colorspace.pointer, alpha));
  }
  toDisplayList() {
    return new DisplayList(libmupdf._wasm_pdf_new_display_list_from_annot(this.pointer));
  }
  update() {
    return !!libmupdf._wasm_pdf_update_annot(this.pointer);
  }
  getType() {
    let type = libmupdf._wasm_pdf_annot_type(this.pointer);
    return _PDFAnnotation.ANNOT_TYPES[type] || "Text";
  }
  getLanguage() {
    return fromStringOrNull(libmupdf._wasm_pdf_annot_language(this.pointer));
  }
  setLanguage(lang) {
    libmupdf._wasm_pdf_set_annot_language(this.pointer, STRING(lang));
  }
  getFlags() {
    return libmupdf._wasm_pdf_annot_flags(this.pointer);
  }
  setFlags(flags) {
    return libmupdf._wasm_pdf_set_annot_flags(this.pointer, flags);
  }
  getContents() {
    return fromString(libmupdf._wasm_pdf_annot_contents(this.pointer));
  }
  setContents(text) {
    libmupdf._wasm_pdf_set_annot_contents(this.pointer, STRING(text));
  }
  getName() {
    return fromString(libmupdf._wasm_pdf_annot_name(this.pointer));
  }
  setName(text) {
    libmupdf._wasm_pdf_set_annot_name(this.pointer, STRING(text));
  }
  getAuthor() {
    return fromString(libmupdf._wasm_pdf_annot_author(this.pointer));
  }
  setAuthor(text) {
    libmupdf._wasm_pdf_set_annot_author(this.pointer, STRING(text));
  }
  getSubject() {
    return fromString(libmupdf._wasm_pdf_annot_subject(this.pointer));
  }
  setSubject(text) {
    libmupdf._wasm_pdf_set_annot_subject(this.pointer, STRING(text));
  }
  getCreationDate() {
    return new Date(libmupdf._wasm_pdf_annot_creation_date(this.pointer) * 1e3);
  }
  setCreationDate(date) {
    checkType(date, Date);
    libmupdf._wasm_pdf_set_annot_creation_date(this.pointer, date.getTime() / 1e3);
  }
  getModificationDate() {
    return new Date(libmupdf._wasm_pdf_annot_modification_date(this.pointer) * 1e3);
  }
  setModificationDate(date) {
    checkType(date, Date);
    libmupdf._wasm_pdf_set_annot_modification_date(this.pointer, date.getTime() / 1e3);
  }
  hasRect() {
    return !!libmupdf._wasm_pdf_annot_has_rect(this.pointer);
  }
  hasInkList() {
    return !!libmupdf._wasm_pdf_annot_has_ink_list(this.pointer);
  }
  hasQuadPoints() {
    return !!libmupdf._wasm_pdf_annot_has_quad_points(this.pointer);
  }
  hasVertices() {
    return !!libmupdf._wasm_pdf_annot_has_vertices(this.pointer);
  }
  hasLine() {
    return !!libmupdf._wasm_pdf_annot_has_line(this.pointer);
  }
  hasInteriorColor() {
    return !!libmupdf._wasm_pdf_annot_has_interior_color(this.pointer);
  }
  hasLineEndingStyles() {
    return !!libmupdf._wasm_pdf_annot_has_line_ending_styles(this.pointer);
  }
  hasBorder() {
    return !!libmupdf._wasm_pdf_annot_has_border(this.pointer);
  }
  hasBorderEffect() {
    return !!libmupdf._wasm_pdf_annot_has_border_effect(this.pointer);
  }
  hasIcon() {
    return !!libmupdf._wasm_pdf_annot_has_icon_name(this.pointer);
  }
  hasOpen() {
    return !!libmupdf._wasm_pdf_annot_has_open(this.pointer);
  }
  hasAuthor() {
    return !!libmupdf._wasm_pdf_annot_has_author(this.pointer);
  }
  hasSubject() {
    return !!libmupdf._wasm_pdf_annot_has_subject(this.pointer);
  }
  hasFilespec() {
    return !!libmupdf._wasm_pdf_annot_has_filespec(this.pointer);
  }
  hasCallout() {
    return !!libmupdf._wasm_pdf_annot_has_callout(this.pointer);
  }
  hasRichContents() {
    return !!libmupdf._wasm_pdf_annot_has_rich_contents(this.pointer);
  }
  getRect() {
    return fromRect(libmupdf._wasm_pdf_annot_rect(this.pointer));
  }
  setRect(rect) {
    checkRect(rect);
    libmupdf._wasm_pdf_set_annot_rect(this.pointer, RECT(rect));
  }
  getPopup() {
    return fromRect(libmupdf._wasm_pdf_annot_popup(this.pointer));
  }
  setPopup(rect) {
    checkRect(rect);
    libmupdf._wasm_pdf_set_annot_popup(this.pointer, RECT(rect));
  }
  getIsOpen() {
    return !!libmupdf._wasm_pdf_annot_is_open(this.pointer);
  }
  setIsOpen(isOpen) {
    checkType(isOpen, "boolean");
    libmupdf._wasm_pdf_set_annot_is_open(this.pointer, isOpen);
  }
  getHiddenForEditing() {
    return !!libmupdf._wasm_pdf_annot_hidden_for_editing(this.pointer);
  }
  setHiddenForEditing(isHidden) {
    checkType(isHidden, "boolean");
    libmupdf._wasm_pdf_set_annot_hidden_for_editing(this.pointer, isHidden);
  }
  getIcon() {
    return fromString(libmupdf._wasm_pdf_annot_icon_name(this.pointer));
  }
  setIcon(text) {
    checkType(text, "string");
    libmupdf._wasm_pdf_set_annot_icon_name(this.pointer, STRING(text));
  }
  getOpacity() {
    return libmupdf._wasm_pdf_annot_opacity(this.pointer);
  }
  setOpacity(opacity) {
    checkType(opacity, "number");
    libmupdf._wasm_pdf_set_annot_opacity(this.pointer, opacity);
  }
  getQuadding() {
    return libmupdf._wasm_pdf_annot_quadding(this.pointer);
  }
  setQuadding(quadding) {
    checkType(quadding, "number");
    libmupdf._wasm_pdf_set_annot_quadding(this.pointer, quadding);
  }
  getLine() {
    let a = fromPoint(libmupdf._wasm_pdf_annot_line_1(this.pointer));
    let b = fromPoint(libmupdf._wasm_pdf_annot_line_2(this.pointer));
    return [a, b];
  }
  setLine(a, b) {
    checkPoint(a);
    checkPoint(b);
    libmupdf._wasm_pdf_set_annot_line(this.pointer, POINT(a), POINT2(b));
  }
  getLineEndingStyles() {
    let a = libmupdf._wasm_pdf_annot_line_ending_styles_start(this.pointer);
    let b = libmupdf._wasm_pdf_annot_line_ending_styles_end(this.pointer);
    return {
      start: _PDFAnnotation.LINE_ENDING[a] || "None",
      end: _PDFAnnotation.LINE_ENDING[b] || "None"
    };
  }
  setLineEndingStyles(start, end) {
    let start_ix = ENUM(start, _PDFAnnotation.LINE_ENDING);
    let end_ix = ENUM(end, _PDFAnnotation.LINE_ENDING);
    libmupdf._wasm_pdf_set_annot_line_ending_styles(this.pointer, start_ix, end_ix);
  }
  getLineCaption() {
    return libmupdf._wasm_pdf_annot_line_caption(this.pointer);
  }
  setLineCaption(on) {
    return libmupdf._wasm_pdf_set_annot_line_caption(this.pointer, on);
  }
  getLineCaptionOffset() {
    return fromPoint(libmupdf._wasm_pdf_annot_line_caption_offset(this.pointer));
  }
  setLineCaptionOffset(p) {
    return libmupdf._wasm_pdf_set_annot_line_caption_offset(this.pointer, POINT(p));
  }
  getLineLeader() {
    return libmupdf._wasm_pdf_annot_line_leader(this.pointer);
  }
  getLineLeaderExtension() {
    return libmupdf._wasm_pdf_annot_line_leader_extension(this.pointer);
  }
  getLineLeaderOffset() {
    return libmupdf._wasm_pdf_annot_line_leader_offset(this.pointer);
  }
  setLineLeader(v) {
    return libmupdf._wasm_pdf_set_annot_line_leader(this.pointer, v);
  }
  setLineLeaderExtension(v) {
    return libmupdf._wasm_pdf_set_annot_line_leader_extension(this.pointer, v);
  }
  setLineLeaderOffset(v) {
    return libmupdf._wasm_pdf_set_annot_line_leader_offset(this.pointer, v);
  }
  getCalloutStyle() {
    let style = libmupdf._wasm_pdf_annot_callout_style(this.pointer);
    return _PDFAnnotation.LINE_ENDING[style] || "None";
  }
  setCalloutStyle(style) {
    let style_ix = ENUM(style, _PDFAnnotation.LINE_ENDING);
    libmupdf._wasm_pdf_set_annot_callout_style(this.pointer, style_ix);
  }
  getCalloutLine() {
    let n = libmupdf._wasm_pdf_annot_callout_line(this.pointer, _wasm_point << 2);
    if (n == 3)
      return [
        fromPoint(_wasm_point + 0 << 2),
        fromPoint(_wasm_point + 1 << 2),
        fromPoint(_wasm_point + 2 << 2)
      ];
    if (n == 2)
      return [
        fromPoint(_wasm_point + 0 << 2),
        fromPoint(_wasm_point + 1 << 2)
      ];
    return null;
  }
  setCalloutLine(line) {
    let a = line[0] || [0, 0];
    let b = line[1] || [0, 0];
    let c = line[2] || [0, 0];
    libmupdf._wasm_pdf_set_annot_callout_line(this.pointer, line.length, POINT(a), POINT2(b), POINT3(c));
  }
  getCalloutPoint() {
    let line = this.getCalloutLine();
    if (line)
      return line[0];
    return void 0;
  }
  setCalloutPoint(p) {
    libmupdf._wasm_pdf_set_annot_callout_point(this.pointer, POINT(p));
  }
  getColor() {
    return fromAnnotColor(libmupdf._wasm_pdf_annot_color(this.pointer, COLOR()));
  }
  getInteriorColor() {
    return fromAnnotColor(libmupdf._wasm_pdf_annot_interior_color(this.pointer, COLOR()));
  }
  setColor(color) {
    checkAnnotColor(color);
    libmupdf._wasm_pdf_set_annot_color(this.pointer, color.length, COLOR(color));
  }
  setInteriorColor(color) {
    checkAnnotColor(color);
    libmupdf._wasm_pdf_set_annot_interior_color(this.pointer, color.length, COLOR(color));
  }
  getBorderWidth() {
    return libmupdf._wasm_pdf_annot_border_width(this.pointer);
  }
  setBorderWidth(value) {
    checkType(value, "number");
    return libmupdf._wasm_pdf_set_annot_border_width(this.pointer, value);
  }
  getBorderStyle() {
    return _PDFAnnotation.BORDER_STYLE[libmupdf._wasm_pdf_annot_border_style(this.pointer)] || "Solid";
  }
  setBorderStyle(value) {
    let value_ix = ENUM(value, _PDFAnnotation.BORDER_STYLE);
    return libmupdf._wasm_pdf_set_annot_border_style(this.pointer, value_ix);
  }
  getBorderEffect() {
    return _PDFAnnotation.BORDER_EFFECT[libmupdf._wasm_pdf_annot_border_effect(this.pointer)] || "None";
  }
  setBorderEffect(value) {
    let value_ix = ENUM(value, _PDFAnnotation.BORDER_EFFECT);
    return libmupdf._wasm_pdf_set_annot_border_effect(this.pointer, value_ix);
  }
  getBorderEffectIntensity() {
    return libmupdf._wasm_pdf_annot_border_effect_intensity(this.pointer);
  }
  setBorderEffectIntensity(value) {
    checkType(value, "number");
    return libmupdf._wasm_pdf_set_annot_border_effect_intensity(this.pointer, value);
  }
  getBorderDashCount() {
    return libmupdf._wasm_pdf_annot_border_dash_count(this.pointer);
  }
  getBorderDashItem(idx) {
    return libmupdf._wasm_pdf_annot_border_dash_item(this.pointer, idx);
  }
  clearBorderDash() {
    libmupdf._wasm_pdf_clear_annot_border_dash(this.pointer);
  }
  addBorderDashItem(v) {
    checkType(v, "number");
    return libmupdf._wasm_pdf_add_annot_border_dash_item(this.pointer, v);
  }
  getBorderDashPattern() {
    let n = this.getBorderDashCount();
    let result = new Array(n);
    for (let i = 0; i < n; ++i)
      result[i] = this.getBorderDashItem(i);
    return result;
  }
  setBorderDashPattern(list) {
    this.clearBorderDash();
    for (let v of list)
      this.addBorderDashItem(v);
  }
  getIntent() {
    return _PDFAnnotation.INTENT[libmupdf._wasm_pdf_annot_intent(this.pointer)] || null;
  }
  setIntent(value) {
    let value_ix = ENUM(value, _PDFAnnotation.INTENT);
    return libmupdf._wasm_pdf_set_annot_intent(this.pointer, value_ix);
  }
  setDefaultAppearance(fontName, size, color) {
    checkType(fontName, "string");
    checkType(size, "number");
    checkAnnotColor(color);
    libmupdf._wasm_pdf_set_annot_default_appearance(this.pointer, STRING(fontName), size, color.length, COLOR(color));
  }
  getDefaultAppearance() {
    let font = fromString(libmupdf._wasm_pdf_annot_default_appearance_font(this.pointer));
    let size = libmupdf._wasm_pdf_annot_default_appearance_size(this.pointer);
    let color = fromAnnotColor(libmupdf._wasm_pdf_annot_default_appearance_color(this.pointer, COLOR()));
    return { font, size, color };
  }
  getFileSpec() {
    return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_annot_filespec(this.pointer));
  }
  setFileSpec(fs) {
    return libmupdf._wasm_pdf_set_annot_filespec(this.pointer, this._doc._PDFOBJ(fs));
  }
  getQuadPoints() {
    let n = libmupdf._wasm_pdf_annot_quad_point_count(this.pointer);
    let result = [];
    for (let i = 0; i < n; ++i)
      result.push(fromQuad(libmupdf._wasm_pdf_annot_quad_point(this.pointer, i)));
    return result;
  }
  clearQuadPoints() {
    libmupdf._wasm_pdf_clear_annot_quad_points(this.pointer);
  }
  addQuadPoint(quad) {
    checkQuad(quad);
    libmupdf._wasm_pdf_add_annot_quad_point(this.pointer, QUAD(quad));
  }
  setQuadPoints(quadlist) {
    this.clearQuadPoints();
    for (let quad of quadlist)
      this.addQuadPoint(quad);
  }
  getVertices() {
    let n = libmupdf._wasm_pdf_annot_vertex_count(this.pointer);
    let result = new Array(n);
    for (let i = 0; i < n; ++i)
      result[i] = fromPoint(libmupdf._wasm_pdf_annot_vertex(this.pointer, i));
    return result;
  }
  clearVertices() {
    libmupdf._wasm_pdf_clear_annot_vertices(this.pointer);
  }
  addVertex(vertex) {
    checkPoint(vertex);
    libmupdf._wasm_pdf_add_annot_vertex(this.pointer, POINT(vertex));
  }
  setVertices(vertexlist) {
    this.clearVertices();
    for (let vertex of vertexlist)
      this.addVertex(vertex);
  }
  getInkList() {
    let n = libmupdf._wasm_pdf_annot_ink_list_count(this.pointer);
    let outer = [];
    for (let i = 0; i < n; ++i) {
      let m = libmupdf._wasm_pdf_annot_ink_list_stroke_count(this.pointer, i);
      let inner = new Array(m);
      for (let k = 0; k < m; ++k)
        inner[k] = fromPoint(libmupdf._wasm_pdf_annot_ink_list_stroke_vertex(this.pointer, i, k));
      outer.push(inner);
    }
    return outer;
  }
  clearInkList() {
    libmupdf._wasm_pdf_clear_annot_ink_list(this.pointer);
  }
  addInkListStroke() {
    libmupdf._wasm_pdf_add_annot_ink_list_stroke(this.pointer);
  }
  addInkListStrokeVertex(v) {
    checkPoint(v);
    libmupdf._wasm_pdf_add_annot_ink_list_stroke_vertex(this.pointer, POINT(v));
  }
  setInkList(inklist) {
    this.clearInkList();
    for (let stroke of inklist) {
      this.addInkListStroke();
      for (let vertex of stroke)
        this.addInkListStrokeVertex(vertex);
    }
  }
  getRichContents() {
    return fromString(libmupdf._wasm_pdf_annot_rich_contents(this.pointer));
  }
  setRichContents(plain, html) {
    checkType(plain, "string");
    checkType(html, "string");
    libmupdf._wasm_pdf_set_annot_rich_contents(this.pointer, STRING(plain), STRING2(html));
  }
  getRichDefaults() {
    return fromString(libmupdf._wasm_pdf_annot_rich_defaults(this.pointer));
  }
  setRichDefaults(style) {
    checkType(style, "string");
    libmupdf._wasm_pdf_set_annot_rich_defaults(this.pointer, STRING(style));
  }
  setStampImage(image) {
    libmupdf._wasm_pdf_set_annot_stamp_image(this.pointer, image.pointer);
  }
  setAppearanceFromDisplayList(appearance, state, transform, list) {
    checkMatrix(transform);
    checkType(list, DisplayList);
    libmupdf._wasm_pdf_set_annot_appearance_from_display_list(this.pointer, STRING_OPT(appearance), STRING2_OPT(state), MATRIX(transform), list.pointer);
  }
  setAppearance(appearance, state, transform, bbox, resources, contents) {
    checkMatrix(transform);
    checkRect(bbox);
    libmupdf._wasm_pdf_set_annot_appearance(this.pointer, STRING_OPT(appearance), STRING2_OPT(state), MATRIX(transform), RECT(bbox), this._doc._PDFOBJ(resources), BUFFER(contents));
  }
  applyRedaction(black_boxes = 1, image_method = 2, line_art_method = 1, text_method = 0) {
    libmupdf._wasm_pdf_apply_redaction(this.pointer, black_boxes, image_method, line_art_method, text_method);
  }
};
PDFAnnotation._drop = libmupdf._wasm_pdf_drop_annot;
PDFAnnotation.ANNOT_TYPES = [
  "Text",
  "Link",
  "FreeText",
  "Line",
  "Square",
  "Circle",
  "Polygon",
  "PolyLine",
  "Highlight",
  "Underline",
  "Squiggly",
  "StrikeOut",
  "Redact",
  "Stamp",
  "Caret",
  "Ink",
  "Popup",
  "FileAttachment",
  "Sound",
  "Movie",
  "RichMedia",
  "Widget",
  "Screen",
  "PrinterMark",
  "TrapNet",
  "Watermark",
  "3D",
  "Projection"
];
PDFAnnotation.LINE_ENDING = [
  "None",
  "Square",
  "Circle",
  "Diamond",
  "OpenArrow",
  "ClosedArrow",
  "Butt",
  "ROpenArrow",
  "RClosedArrow",
  "Slash"
];
PDFAnnotation.BORDER_STYLE = ["Solid", "Dashed", "Beveled", "Inset", "Underline"];
PDFAnnotation.BORDER_EFFECT = ["None", "Cloudy"];
PDFAnnotation.INTENT = [
  null,
  "FreeTextCallout",
  "FreeTextTypeWriter",
  "LineArrow",
  "LineDimension",
  "PloyLine",
  "PolygonCloud",
  "PolygonDimension",
  "StampImage",
  "StampSnapshot"
];
PDFAnnotation.IS_INVISIBLE = 1 << 1 - 1;
PDFAnnotation.IS_HIDDEN = 1 << 2 - 1;
PDFAnnotation.IS_PRINT = 1 << 3 - 1;
PDFAnnotation.IS_NO_ZOOM = 1 << 4 - 1;
PDFAnnotation.IS_NO_ROTATE = 1 << 5 - 1;
PDFAnnotation.IS_NO_VIEW = 1 << 6 - 1;
PDFAnnotation.IS_READ_ONLY = 1 << 7 - 1;
PDFAnnotation.IS_LOCKED = 1 << 8 - 1;
PDFAnnotation.IS_TOGGLE_NO_VIEW = 1 << 9 - 1;
PDFAnnotation.IS_LOCKED_CONTENTS = 1 << 10 - 1;
var PDFWidget = class _PDFWidget extends PDFAnnotation {
  getFieldType() {
    return _PDFWidget.WIDGET_TYPES[libmupdf._wasm_pdf_annot_field_type(this.pointer)] || "button";
  }
  isButton() {
    let type = this.getFieldType();
    return type === "button" || type === "checkbox" || type === "radiobutton";
  }
  isPushButton() {
    return this.getFieldType() === "button";
  }
  isCheckbox() {
    return this.getFieldType() === "checkbox";
  }
  isRadioButton() {
    return this.getFieldType() === "radiobutton";
  }
  isText() {
    return this.getFieldType() === "text";
  }
  isChoice() {
    let type = this.getFieldType();
    return type === "combobox" || type === "listbox";
  }
  isListBox() {
    return this.getFieldType() === "listbox";
  }
  isComboBox() {
    return this.getFieldType() === "combobox";
  }
  getFieldFlags() {
    return libmupdf._wasm_pdf_annot_field_flags(this.pointer);
  }
  isMultiline() {
    return (this.getFieldFlags() & _PDFWidget.TX_FIELD_IS_MULTILINE) !== 0;
  }
  isPassword() {
    return (this.getFieldFlags() & _PDFWidget.TX_FIELD_IS_PASSWORD) !== 0;
  }
  isComb() {
    return (this.getFieldFlags() & _PDFWidget.TX_FIELD_IS_COMB) !== 0;
  }
  isReadOnly() {
    return (this.getFieldFlags() & _PDFWidget.FIELD_IS_READ_ONLY) !== 0;
  }
  getLabel() {
    return fromString(libmupdf._wasm_pdf_annot_field_label(this.pointer));
  }
  getName() {
    return fromStringFree(libmupdf._wasm_pdf_load_field_name(this.pointer));
  }
  setName() {
    throw new Error("widget field name is read-only");
  }
  getValue() {
    return fromString(libmupdf._wasm_pdf_annot_field_value(this.pointer));
  }
  setTextValue(value) {
    return libmupdf._wasm_pdf_set_annot_text_field_value(this.pointer, STRING(value));
  }
  getMaxLen() {
    return libmupdf._wasm_pdf_annot_text_widget_max_len(this.pointer);
  }
  setChoiceValue(value) {
    return libmupdf._wasm_pdf_set_annot_choice_field_value(this.pointer, STRING(value));
  }
  getOptions(isExport = false) {
    let result = [];
    let n = libmupdf._wasm_pdf_annot_choice_field_option_count(this.pointer);
    for (let i = 0; i < n; ++i) {
      result.push(fromString(libmupdf._wasm_pdf_annot_choice_field_option(this.pointer, isExport, i)));
    }
    return result;
  }
  toggle() {
    return libmupdf._wasm_pdf_toggle_widget(this.pointer);
  }
};
PDFWidget.WIDGET_TYPES = [
  "widget",
  // unknown
  "button",
  "checkbox",
  "combobox",
  "listbox",
  "radiobutton",
  "signature",
  "text"
];
PDFWidget.FIELD_IS_READ_ONLY = 1;
PDFWidget.FIELD_IS_REQUIRED = 1 << 1;
PDFWidget.FIELD_IS_NO_EXPORT = 1 << 2;
PDFWidget.TX_FIELD_IS_MULTILINE = 1 << 12;
PDFWidget.TX_FIELD_IS_PASSWORD = 1 << 13;
PDFWidget.TX_FIELD_IS_FILE_SELECT = 1 << 20;
PDFWidget.TX_FIELD_IS_DO_NOT_SPELL_CHECK = 1 << 22;
PDFWidget.TX_FIELD_IS_DO_NOT_SCROLL = 1 << 23;
PDFWidget.TX_FIELD_IS_COMB = 1 << 24;
PDFWidget.TX_FIELD_IS_RICH_TEXT = 1 << 25;
PDFWidget.BTN_FIELD_IS_NO_TOGGLE_TO_OFF = 1 << 14;
PDFWidget.BTN_FIELD_IS_RADIO = 1 << 15;
PDFWidget.BTN_FIELD_IS_PUSHBUTTON = 1 << 16;
PDFWidget.BTN_FIELD_IS_RADIOS_IN_UNISON = 1 << 25;
PDFWidget.CH_FIELD_IS_COMBO = 1 << 17;
PDFWidget.CH_FIELD_IS_EDIT = 1 << 18;
PDFWidget.CH_FIELD_IS_SORT = 1 << 19;
PDFWidget.CH_FIELD_IS_MULTI_SELECT = 1 << 21;
PDFWidget.CH_FIELD_IS_DO_NOT_SPELL_CHECK = 1 << 22;
PDFWidget.CH_FIELD_IS_COMMIT_ON_SEL_CHANGE = 1 << 25;
var $libmupdf_stm_id = 0;
var $libmupdf_stm_table = /* @__PURE__ */ new Map();
globalThis.$libmupdf_stm_close = function(id) {
  let handle = $libmupdf_stm_table.get(id);
  if (handle) {
    handle.close();
    $libmupdf_stm_table.delete(id);
    return;
  }
  throw new Error("invalid file handle");
};
globalThis.$libmupdf_stm_seek = function(id, pos, offset, whence) {
  let handle = $libmupdf_stm_table.get(id);
  if (handle) {
    if (whence === 0)
      return offset;
    if (whence === 1)
      return pos + offset;
    if (whence === 2) {
      let size = handle.fileSize();
      if (size < 0)
        return -1;
      return size + offset;
    }
    throw new Error("invalid whence argument");
  }
  throw new Error("invalid file handle");
};
globalThis.$libmupdf_stm_read = function(id, pos, addr, size) {
  let handle = $libmupdf_stm_table.get(id);
  if (handle) {
    return handle.read(libmupdf.HEAPU8, addr, size, pos);
  }
  throw new Error("invalid file handle");
};
var Stream = class extends Userdata {
  constructor(handle) {
    let id = $libmupdf_stm_id++;
    $libmupdf_stm_table.set(id, handle);
    super(libmupdf._wasm_new_stream(id));
  }
};
Stream._drop = libmupdf._wasm_drop_stream;
var $libmupdf_load_font_file_js;
globalThis.$libmupdf_load_font_file = function(name, script, bold, italic) {
  if ($libmupdf_load_font_file_js) {
    var font = $libmupdf_load_font_file_js(fromString(name), fromString(script), bold, italic);
    if (font) {
      checkType(font, Font);
      return font.pointer;
    }
  }
  return 0;
};
var $libmupdf_device_id = 0;
var $libmupdf_device_table = /* @__PURE__ */ new Map();
var $libmupdf_path_id = 0;
var $libmupdf_path_table = /* @__PURE__ */ new Map();
var $libmupdf_text_id = 0;
var $libmupdf_text_table = /* @__PURE__ */ new Map();
globalThis.$libmupdf_path_walk = {
  moveto(id, x, y) {
    $libmupdf_path_table.get(id)?.moveTo?.(x, y);
  },
  lineto(id, x, y) {
    $libmupdf_path_table.get(id)?.lineTo?.(x, y);
  },
  curveto(id, x1, y1, x2, y2, x3, y3) {
    $libmupdf_path_table.get(id)?.curveTo?.(x1, y1, x2, y2, x3, y3);
  },
  closepath(id) {
    $libmupdf_path_table.get(id)?.closePath?.();
  }
};
var $libmupdf_text_font = null;
globalThis.$libmupdf_text_walk = {
  begin_span(id, font, trm, wmode, bidi, dir, lang) {
    if (font !== $libmupdf_text_font?.pointer)
      $libmupdf_text_font = new Font(font);
    $libmupdf_text_table.get(id)?.beginSpan?.($libmupdf_text_font, fromMatrix(trm), wmode, bidi, dir, fromString(lang));
  },
  end_span(id) {
    $libmupdf_text_table.get(id)?.endSpan?.();
  },
  show_glyph(id, font, trm, glyph, unicode, wmode, bidi) {
    if (font !== $libmupdf_text_font?.pointer)
      $libmupdf_text_font = new Font(font);
    $libmupdf_text_table.get(id)?.showGlyph?.($libmupdf_text_font, fromMatrix(trm), glyph, unicode, wmode, bidi);
  }
};
globalThis.$libmupdf_device = {
  drop_device(id) {
    $libmupdf_device_table.get(id)?.drop?.();
    $libmupdf_device_table.delete(id);
  },
  close_device(id) {
    $libmupdf_device_table.get(id)?.close?.();
  },
  fill_path(id, path, even_odd, ctm, colorspace, color_n, color_arr, alpha) {
    $libmupdf_device_table.get(id)?.fillPath?.(new Path(libmupdf._wasm_keep_path(path)), !!even_odd, fromMatrix(ctm), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr), alpha);
  },
  clip_path(id, path, even_odd, ctm) {
    $libmupdf_device_table.get(id)?.clipPath?.(new Path(libmupdf._wasm_keep_path(path)), !!even_odd, fromMatrix(ctm));
  },
  stroke_path(id, path, stroke, ctm, colorspace, color_n, color_arr, alpha) {
    $libmupdf_device_table.get(id)?.strokePath?.(new Path(libmupdf._wasm_keep_path(path)), new StrokeState(libmupdf._wasm_keep_stroke_state(stroke)), fromMatrix(ctm), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr), alpha);
  },
  clip_stroke_path(id, path, stroke, ctm) {
    $libmupdf_device_table.get(id)?.clipStrokePath?.(new Path(libmupdf._wasm_keep_path(path)), new StrokeState(libmupdf._wasm_keep_stroke_state(stroke)), fromMatrix(ctm));
  },
  fill_text(id, text, ctm, colorspace, color_n, color_arr, alpha) {
    $libmupdf_device_table.get(id)?.fillText?.(new Text(libmupdf._wasm_keep_text(text)), fromMatrix(ctm), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr), alpha);
  },
  stroke_text(id, text, stroke, ctm, colorspace, color_n, color_arr, alpha) {
    $libmupdf_device_table.get(id)?.strokeText?.(new Text(libmupdf._wasm_keep_text(text)), new StrokeState(libmupdf._wasm_keep_stroke_state(stroke)), fromMatrix(ctm), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr), alpha);
  },
  clip_text(id, text, ctm) {
    $libmupdf_device_table.get(id)?.clipText?.(new Text(libmupdf._wasm_keep_text(text)), fromMatrix(ctm));
  },
  clip_stroke_text(id, text, stroke, ctm) {
    $libmupdf_device_table.get(id)?.clipStrokeText?.(new Text(libmupdf._wasm_keep_text(text)), new StrokeState(libmupdf._wasm_keep_stroke_state(stroke)), fromMatrix(ctm));
  },
  ignore_text(id, text, ctm) {
    $libmupdf_device_table.get(id)?.ignoreText?.(new Text(libmupdf._wasm_keep_text(text)), fromMatrix(ctm));
  },
  fill_shade(id, shade, ctm, alpha) {
    $libmupdf_device_table.get(id)?.fillShade?.(new Shade(shade), fromMatrix(ctm), alpha);
  },
  fill_image(id, image, ctm, alpha) {
    $libmupdf_device_table.get(id)?.fillImage?.(new Image2(image), fromMatrix(ctm), alpha);
  },
  fill_image_mask(id, image, ctm, colorspace, color_n, color_arr, alpha) {
    $libmupdf_device_table.get(id)?.fillImageMask?.(new Image2(image), fromMatrix(ctm), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr), alpha);
  },
  clip_image_mask(id, image, ctm) {
    $libmupdf_device_table.get(id)?.clipImageMask?.(new Image2(image), fromMatrix(ctm));
  },
  pop_clip(id) {
    $libmupdf_device_table.get(id)?.popClip?.();
  },
  begin_mask(id, bbox, luminosity, colorspace, color_n, color_arr) {
    $libmupdf_device_table.get(id)?.beginMask?.(fromRect(bbox), !!luminosity, new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), fromColorArray(color_n, color_arr));
  },
  begin_group(id, bbox, colorspace, isolated, knockout, blendmode, alpha) {
    $libmupdf_device_table.get(id)?.beginGroup?.(fromRect(bbox), new ColorSpace(libmupdf._wasm_keep_colorspace(colorspace)), !!isolated, !!knockout, Device.BLEND_MODES[blendmode], alpha);
  },
  begin_tile(id, area, view, xstep, ystep, ctm, tile_id, doc_id) {
    return $libmupdf_device_table.get(id)?.beginTile?.(fromRect(area), fromRect(view), xstep, ystep, fromMatrix(ctm), tile_id, doc_id) || 0;
  },
  begin_layer(id, name) {
    $libmupdf_device_table.get(id)?.beginLayer?.(fromString(name));
  },
  end_mask(id) {
    $libmupdf_device_table.get(id)?.endMask?.();
  },
  end_group(id) {
    $libmupdf_device_table.get(id)?.endGroup?.();
  },
  end_tile(id) {
    $libmupdf_device_table.get(id)?.endTile?.();
  },
  end_layer(id) {
    $libmupdf_device_table.get(id)?.endLayer?.();
  }
};

// atoms/illustrator/rityta.ts
var IngenPdfDel = class extends Error {
  constructor() {
    super("filen har ingen PDF-del \u2014 spara om den i Illustrator med Create PDF Compatible File p\xE5slaget");
  }
};
var b\u00F6rjarSomPdf = (b) => new TextDecoder("latin1").decode(b.subarray(0, 1024)).includes("%PDF-");
function \u00F6ppna(bytes) {
  if (!b\u00F6rjarSomPdf(bytes)) throw new IngenPdfDel();
  const doc = Document.openDocument(bytes, "application/pdf");
  const pdf = doc.asPDF();
  if (!pdf || doc.countPages() === 0) throw new IngenPdfDel();
  return pdf;
}
var yta = (r) => Math.max(0, r[2] - r[0]) * Math.max(0, r[3] - r[1]);
var sk\u00E4r = (a, b) => [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
function enhetsrekt(m) {
  const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = m;
  const xs = [e, a + e, c + e, a + c + e], ys = [f, b + f, d + f, b + d + f];
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
function banansRekt(path, ctm) {
  const [a = 1, b = 0, c = 0, d = 1, e = 0, f = 0] = ctm;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const punkt = (x, y) => {
    const px = a * x + c * y + e, py = b * x + d * y + f;
    x0 = Math.min(x0, px);
    y0 = Math.min(y0, py);
    x1 = Math.max(x1, px);
    y1 = Math.max(y1, py);
  };
  path.walk({
    moveTo: punkt,
    lineTo: punkt,
    curveTo: (x1_, y1_, x2, y2, x3, y3) => {
      punkt(x1_, y1_);
      punkt(x2, y2);
      punkt(x3, y3);
    }
  });
  return [x0, y0, x1, y1];
}
function l\u00E4sRityta(doc, index) {
  const sida = doc.loadPage(index);
  const [sx0, sy0, sx1, sy1] = sida.getBounds();
  const bredd = sx1 - sx0, h\u00F6jd = sy1 - sy0;
  const sidrekt = [0, 0, bredd, h\u00F6jd];
  const bilder = [], klipp = [], stack = [];
  const \u00F6ppnaKlipp = (r) => {
    const topp = stack.at(-1);
    const k = topp ? sk\u00E4r(topp, r) : sk\u00E4r(r, sidrekt);
    stack.push(k);
    klipp.push(k);
  };
  const or\u00F6rt = () => {
    stack.push(stack.at(-1) ?? sidrekt);
  };
  const enhet = new Device({
    clipPath: (path, _eo, ctm) => \u00F6ppnaKlipp(banansRekt(path, ctm)),
    clipStrokePath: (path, _s, ctm) => \u00F6ppnaKlipp(banansRekt(path, ctm)),
    clipText: or\u00F6rt,
    clipStrokeText: or\u00F6rt,
    clipImageMask: (_bild, ctm) => \u00F6ppnaKlipp(enhetsrekt(ctm)),
    popClip: () => {
      stack.pop();
    },
    fillImage: (bild, ctm) => {
      bilder.push({ bredd: bild.getWidth(), h\u00F6jd: bild.getHeight(), rekt: enhetsrekt(ctm), ram: stack.at(-1) ?? null });
    }
  });
  sida.runPageContents(enhet, Matrix.identity);
  enhet.close();
  const text = [];
  const stext = sida.toStructuredText("preserve-whitespace");
  stext.walk({
    onChar(c, origin, _font, grad, quad, f\u00E4rg) {
      const [x, y] = origin;
      if (x < 0 || x >= bredd || y <= 0 || y > h\u00F6jd) return;
      const xs = [quad[0], quad[2], quad[4], quad[6]], ys = [quad[1], quad[3], quad[5], quad[7]];
      const q = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
      const f = [f\u00E4rg[0] ?? 0, f\u00E4rg[1] ?? 0, f\u00E4rg[2] ?? 0];
      const sista = text.at(-1);
      const sammaRad = sista && Math.abs(sista.baslinje - y) < 0.5 && Math.abs(sista.grad - grad) < 0.01 && sista.f\u00E4rg.every((v, i) => Math.abs(v - f[i]) < 0.01) && x - sista.slutX < grad;
      if (sista && sammaRad) {
        sista.text += c;
        sista.slutX = q[2];
        sista.rekt = [Math.min(sista.rekt[0], q[0]), Math.min(sista.rekt[1], q[1]), Math.max(sista.rekt[2], q[2]), Math.max(sista.rekt[3], q[3])];
      } else {
        text.push({ text: c, x, baslinje: y, grad, f\u00E4rg: f, rekt: [...q], slutX: q[2] });
      }
    }
  });
  stext.destroy();
  sida.destroy();
  return { index, bredd, h\u00F6jd, bilder, klipp, text: text.map(({ slutX: _s, ...r }) => r) };
}
function fotoram(r) {
  const sidrekt = [0, 0, r.bredd, r.h\u00F6jd];
  const synlig = (b) => sk\u00E4r(b.ram ?? sidrekt, b.rekt);
  const bild = [...r.bilder].sort((a, b) => yta(synlig(b)) - yta(synlig(a)))[0];
  return bild ? { bild, ram: synlig(bild) } : null;
}
function fotoFr\u00E5nRityta(doc, index, kvalitet = 95, maxBredd = 2560) {
  const sida = doc.loadPage(index);
  const sidrekt = [0, 0, sida.getBounds()[2] - sida.getBounds()[0], sida.getBounds()[3] - sida.getBounds()[1]];
  let b\u00E4st = null;
  const stack = [];
  const enhet = new Device({
    clipPath: (path, _eo, ctm) => {
      const t = stack.at(-1) ?? sidrekt;
      stack.push(sk\u00E4r(t, banansRekt(path, ctm)));
    },
    clipStrokePath: (path, _s, ctm) => {
      const t = stack.at(-1) ?? sidrekt;
      stack.push(sk\u00E4r(t, banansRekt(path, ctm)));
    },
    clipText: () => {
      stack.push(stack.at(-1) ?? sidrekt);
    },
    clipStrokeText: () => {
      stack.push(stack.at(-1) ?? sidrekt);
    },
    clipImageMask: (_b, ctm) => {
      const t = stack.at(-1) ?? sidrekt;
      stack.push(sk\u00E4r(t, enhetsrekt(ctm)));
    },
    popClip: () => {
      stack.pop();
    },
    fillImage: (bild, ctm) => {
      const y = yta(sk\u00E4r(stack.at(-1) ?? sidrekt, enhetsrekt(ctm)));
      if (!b\u00E4st || y > b\u00E4st.yta) {
        b\u00E4st?.pix.destroy();
        const skala = Math.min(1, maxBredd / bild.getWidth());
        const W = Math.round(bild.getWidth() * skala), H = Math.round(bild.getHeight() * skala);
        const pix = new Pixmap(ColorSpace.DeviceRGB, [0, 0, W, H], false);
        const rit = new DrawDevice(Matrix.identity, pix);
        rit.fillImage(bild, [W, 0, 0, H, 0, 0], 1);
        rit.close();
        b\u00E4st = { yta: y, pix };
      }
    }
  });
  sida.runPageContents(enhet, Matrix.identity);
  enhet.close();
  sida.destroy();
  const vald = b\u00E4st;
  if (!vald) throw new Error(`ritytan ${index + 1} har inget foto`);
  const jpeg = vald.pix.asJPEG(kvalitet);
  vald.pix.destroy();
  return jpeg;
}
function rendera(doc, index) {
  return doc.loadPage(index).toPixmap(Matrix.identity, ColorSpace.DeviceRGB, false);
}
function underkantEfter(pix, fr\u00E5nY, glapp = 20, tr\u00F6skel = 12, bakgrund) {
  const W = pix.getWidth(), H = pix.getHeight(), n = pix.getNumberOfComponents(), px = pix.getPixels();
  const bg = bakgrund ? bakgrund.map((v) => v * 255) : [px[(10 * W + 10) * n], px[(10 * W + 10) * n + 1], px[(10 * W + 10) * n + 2]];
  const tom = (y2) => {
    for (let x = 0; x < W; x += 2) {
      const i = (y2 * W + x) * n;
      if (Math.abs(px[i] - bg[0]) > tr\u00F6skel || Math.abs(px[i + 1] - bg[1]) > tr\u00F6skel || Math.abs(px[i + 2] - bg[2]) > tr\u00F6skel) return false;
    }
    return true;
  };
  let y = Math.ceil(fr\u00E5nY) + 2;
  while (y < H && tom(y)) y++;
  let botten = y, tomma = 0;
  for (; y < H && tomma < glapp; y++) {
    if (tom(y)) tomma++;
    else {
      botten = y;
      tomma = 0;
    }
  }
  return botten + 1;
}

// atoms/illustrator/bakgrund.ts
function besk\u00E4rning(foto, R, F) {
  const [rx0, ry0, rx1, ry1] = R, [fx0, fy0, fx1, fy1] = F;
  const rw = rx1 - rx0, rh = ry1 - ry0;
  const u0 = (fx0 - rx0) / rw, u1 = (fx1 - rx0) / rw, v0 = (fy0 - ry0) / rh, v1 = (fy1 - ry0) / rh;
  const ramAspekt = (fx1 - fx0) / (fy1 - fy0);
  const [fw, fh] = foto.bredd / foto.h\u00F6jd > ramAspekt ? [foto.h\u00F6jd * ramAspekt, foto.h\u00F6jd] : [foto.bredd, foto.bredd / ramAspekt];
  const bredd = fw / (u1 - u0), h\u00F6jd = fh / (v1 - v0);
  return { x: foto.bredd / 2 - fw / 2 - u0 * bredd, y: foto.h\u00F6jd / 2 - fh / 2 - v0 * h\u00F6jd, bredd, h\u00F6jd };
}
function besk\u00E4rFoto(bytes, R, F, fyllnad) {
  const foto = new Image2(bytes);
  const b = besk\u00E4rning({ bredd: foto.getWidth(), h\u00F6jd: foto.getHeight() }, R, F);
  const skala = Math.min(1, 2 * (R[2] - R[0]) / b.bredd);
  const W = Math.round(b.bredd * skala), H = Math.round(b.h\u00F6jd * skala);
  const pix = new Pixmap(ColorSpace.DeviceRGB, [0, 0, W, H], false);
  pix.clear(fyllnad);
  const rit = new DrawDevice(Matrix.identity, pix);
  rit.fillImage(foto, [foto.getWidth() * skala, 0, 0, foto.getHeight() * skala, -b.x * skala, -b.y * skala], 1);
  rit.close();
  foto.destroy();
  return new Image2(pix);
}
function bytBild(sida, gammal, ny) {
  let bytta = 0;
  const sedda = /* @__PURE__ */ new Set();
  const g\u00E5 = (resurser) => {
    if (!resurser || !resurser.isDictionary()) return;
    const xobj = resurser.get("XObject");
    if (!xobj || !xobj.isDictionary()) return;
    xobj.forEach((v\u00E4rde, nyckel) => {
      if (v\u00E4rde.isIndirect()) {
        const n = v\u00E4rde.asIndirect();
        if (sedda.has(n)) return;
        sedda.add(n);
      }
      const o = v\u00E4rde.resolve();
      const typ = o.get("Subtype");
      if (typ.isName() && typ.asName() === "Image" && o.get("Width").asNumber() === gammal.bredd && o.get("Height").asNumber() === gammal.h\u00F6jd) {
        xobj.put(nyckel, ny);
        bytta++;
      } else if (typ.isName() && typ.asName() === "Form") {
        g\u00E5(o.get("Resources"));
      }
    });
  };
  g\u00E5(sida.getObject().get("Resources"));
  return bytta;
}
function somSvg(sida) {
  const buf = new Buffer2();
  const skrivare = new DocumentWriter(buf, "svg", "text=path");
  const enhet = skrivare.beginPage(sida.getBounds());
  sida.run(enhet, Matrix.identity);
  skrivare.endPage();
  skrivare.close();
  const svg = buf.asString();
  buf.destroy();
  return svg;
}
function byggBakgrund(k\u00E4lla, index, uppdrag) {
  const doc = new PDFDocument();
  try {
    doc.graftPage(-1, k\u00E4lla, index);
    const l\u00E4st = l\u00E4sRityta(doc, 0);
    const rityta = { ...l\u00E4st, index };
    const sida = doc.loadPage(0);
    const bort = rityta.text.filter(uppdrag.taBort);
    for (const rad of bort) sida.createAnnotation("Redact").setRect([...rad.rekt]);
    if (bort.length) sida.applyRedactions(
      false,
      PDFPage.REDACT_IMAGE_NONE,
      PDFPage.REDACT_LINE_ART_NONE,
      PDFPage.REDACT_TEXT_REMOVE
    );
    if (uppdrag.foto) {
      const f = fotoram(rityta);
      if (!f) throw new Error(`ritytan ${index + 1} har ingen bild att byta`);
      const beskuret = besk\u00E4rFoto(uppdrag.foto, f.bild.rekt, f.ram, uppdrag.fyllnad ?? 241);
      const ny = doc.addImage(beskuret);
      beskuret.destroy();
      if (bytBild(sida, f.bild, ny) === 0) throw new Error(`fotot p\xE5 ritytan ${index + 1} gick inte att byta`);
    }
    const pix = sida.toPixmap(Matrix.identity, ColorSpace.DeviceRGB, false);
    const png = pix.asPNG();
    pix.destroy();
    const svg = somSvg(sida);
    sida.destroy();
    return { png, svg, rityta, borttagna: bort.length };
  } finally {
    doc.destroy();
  }
}

// atoms/typografi/typsnitt.ts
var import_opentype = __toESM(require_opentype(), 1);
import { readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
var NBSP = /\u00A0/g;
var vanlig = (t) => t.replace(NBSP, " ");
function kontur(glyf, x, baslinje, s) {
  const f = (v) => String(Math.round(v * 100) / 100);
  const px = (v) => f(x + (v ?? 0) * s);
  const py = (v) => f(baslinje - (v ?? 0) * s);
  return glyf.path.commands.map((c) => {
    switch (c.type) {
      case "M":
      case "L":
        return `${c.type}${px(c.x)} ${py(c.y)}`;
      case "Q":
        return `Q${px(c.x1)} ${py(c.y1)} ${px(c.x)} ${py(c.y)}`;
      case "C":
        return `C${px(c.x1)} ${py(c.y1)} ${px(c.x2)} ${py(c.y2)} ${px(c.x)} ${py(c.y)}`;
      case "Z":
        return "Z";
    }
  }).join("");
}
function fr\u00E5nOpentype(font) {
  const skala = (grad) => grad / font.unitsPerEm;
  const placera = (text, x, grad) => {
    const glyfer = font.stringToGlyphs(vanlig(text));
    const tabeller = font.position.getKerningTables(font.position.getDefaultScriptName());
    const kern = tabeller && tabeller.length > 0 ? (a, b) => font.position.getKerningValue(tabeller, a.index, b.index) : (a, b) => font.getKerningValue(a, b);
    const ut = [];
    let pos = x;
    glyfer.forEach((g, i) => {
      ut.push({ glyf: g, x: pos });
      pos += (g.advanceWidth ?? 0) * skala(grad);
      const n\u00E4sta = glyfer[i + 1];
      if (n\u00E4sta) pos += kern(g, n\u00E4sta) * skala(grad);
    });
    return { glyfer: ut, slut: pos };
  };
  return {
    postScriptNamn: font.getEnglishName("postScriptName") ?? "",
    harTecken: (tecken) => /\s/.test(tecken) || font.charToGlyphIndex(tecken) > 0,
    bredd: (text, grad) => placera(text, 0, grad).slut,
    bl\u00E4ckTopp(text, grad) {
      let topp = 0;
      for (const g of font.stringToGlyphs(vanlig(text))) {
        const b = g.getBoundingBox();
        if (b.y2 > topp) topp = b.y2;
      }
      return topp * skala(grad);
    },
    bana: (text, x, baslinje, grad) => placera(text, x, grad).glyfer.map(({ glyf, x: gx }) => kontur(glyf, gx, baslinje, skala(grad))).filter(Boolean).join(" ")
  };
}
function l\u00E4sTypsnitt(bytes) {
  const kopia = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return fr\u00E5nOpentype(import_opentype.default.parse(kopia));
}
function adobeCache(hem = homedir()) {
  return join(hem, "Library", "Application Support", "Adobe", "CoreSync", "plugins", "livetype");
}
function hittaIAdobeCache(postScriptNamn, katalog = adobeCache()) {
  for (const under of [".w", ".r"]) {
    let filer;
    try {
      filer = readdirSync(join(katalog, under));
    } catch {
      continue;
    }
    for (const f of filer) {
      if (!/\.(otf|ttf)$/i.test(f)) continue;
      try {
        const bytes = readFileSync(join(katalog, under, f));
        if (l\u00E4sTypsnitt(bytes).postScriptNamn === postScriptNamn) return bytes;
      } catch {
      }
    }
  }
  return null;
}

// atoms/typografi/web-fonts.ts
var WebFontError = class extends Error {
};
var unquote = (s) => s.trim().replace(/^['"]|['"]$/g, "").trim();
function fontFaces(css) {
  const out = [];
  for (const m of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const body = m[1];
    const prop = (name) => new RegExp(`(?:^|;|\\s)${name}\\s*:\\s*([^;]+)`, "i").exec(body)?.[1]?.trim();
    const family = prop("font-family");
    const src = prop("src") ?? "";
    if (!family) continue;
    const weightText = prop("font-weight") ?? "400";
    const weight = weightText === "bold" ? 700 : weightText === "normal" ? 400 : Number.parseInt(weightText, 10) || 400;
    const sources = [...src.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)(?:\s*format\(\s*['"]?([^'")]+)['"]?\s*\))?/g)].map((s) => ({ url: s[2], format: (s[3] ?? "").toLowerCase() }));
    out.push({ family: unquote(family), weight, style: (prop("font-style") ?? "normal").toLowerCase(), sources });
  }
  return out;
}
var WEIGHT_WORDS = [
  [/hairline|thin/i, 100],
  [/extra-?light|ultra-?light/i, 200],
  [/light/i, 300],
  [/medium/i, 500],
  [/semi-?bold|demi-?bold/i, 600],
  [/extra-?bold|ultra-?bold/i, 800],
  [/black|heavy/i, 900],
  [/bold/i, 700]
];
function weightFromName(postScriptName) {
  const style = postScriptName.split("-").slice(1).join("-");
  for (const [re, w] of WEIGHT_WORDS) if (re.test(style)) return w;
  return 400;
}
var READABLE = ["opentype", "truetype", "woff"];
var formatOf = (s) => s.format || (/\.otf(\?|$)/i.test(s.url) ? "opentype" : /\.ttf(\?|$)/i.test(s.url) ? "truetype" : /\.woff(\?|$)/i.test(s.url) ? "woff" : "");
async function fontFromWebProject(postScriptName, fonts, fetchImpl = fetch) {
  const wanted = fonts?.families?.[postScriptName];
  if (!wanted) return null;
  if (!fonts?.stylesheets?.length)
    throw new WebFontError(`typsnittet ${postScriptName} har familjen ${wanted.family} men inget webbprojekt att h\xE4mta den ur`);
  const weight = wanted.weight ?? weightFromName(postScriptName);
  const style = wanted.style ?? "normal";
  const seen = [];
  for (const sheet of fonts.stylesheets) {
    let res;
    try {
      res = await fetchImpl(sheet);
    } catch (e) {
      throw new WebFontError(`webbprojektet ${sheet} gick inte att l\xE4sa: ${e instanceof Error ? e.message : String(e)}`);
    }
    if (!res.ok) throw new WebFontError(`webbprojektet ${sheet} svarade ${res.status}`);
    const faces = fontFaces(await res.text());
    const family = faces.filter((f) => f.family.toLowerCase() === wanted.family.toLowerCase());
    seen.push(...family.map((f) => `${f.weight}${f.style === "italic" ? " kursiv" : ""}`));
    const face = family.find((f) => f.weight === weight && f.style === style);
    if (!face) continue;
    const source = READABLE.map((fmt) => face.sources.find((s) => formatOf(s) === fmt)).find(Boolean);
    if (!source)
      throw new WebFontError(`webbprojektet ${sheet} har ${wanted.family} ${weight} bara som ${face.sources.map(formatOf).join(", ") || "ok\xE4nt format"}, som typografi-atomen inte l\xE4ser`);
    const file = await fetchImpl(new URL(source.url, sheet).href);
    if (!file.ok) throw new WebFontError(`typsnittsfilen f\xF6r ${postScriptName} i ${sheet} svarade ${file.status}`);
    return new Uint8Array(await file.arrayBuffer());
  }
  throw new WebFontError(`webbprojektet har inte ${wanted.family} i vikt ${weight}${style === "italic" ? " kursiv" : ""} (typsnittet ${postScriptName})` + (seen.length ? `; d\xE4r finns ${wanted.family} i ${[...new Set(seen)].join(", ")}` : `; familjen ${wanted.family} finns inte d\xE4r alls`));
}

// atoms/typografi/konturer.ts
function radSomBanor(typsnitt, rad, x, baslinje, grad) {
  let f\u00F6re = "";
  return rad.flatMap((s) => {
    const sx = x + (f\u00F6re ? typsnitt.bredd(f\u00F6re, grad) : 0);
    f\u00F6re += s.text;
    const d = typsnitt.bana(s.text, sx, baslinje, grad);
    return d ? [{ d, f\u00E4rg: s.f\u00E4rg }] : [];
  });
}

// atoms/typografi/radbryt.ts
var NBSP2 = "\xA0";
function bindTankstreck(text) {
  return text.replace(/ –(?= |$)/g, NBSP2 + "\u2013");
}
function girig(text, m\u00E4t, max) {
  const rader = [];
  let rad = "";
  for (const ord of text.split(" ")) {
    const prov = rad ? `${rad} ${ord}` : ord;
    if (rad && m\u00E4t(prov) > max) {
      rader.push(rad);
      rad = ord;
    } else rad = prov;
  }
  if (rad) rader.push(rad);
  return rader;
}
function balanserad(text, m\u00E4t, max) {
  const ord = text.split(" ");
  const minsta = girig(text, m\u00E4t, max).length;
  const bredd = /* @__PURE__ */ new Map();
  const w = (i, j) => {
    const k = `${i},${j}`;
    let v = bredd.get(k);
    if (v === void 0) {
      v = m\u00E4t(ord.slice(i, j).join(" "));
      bredd.set(k, v);
    }
    return v;
  };
  const minne = /* @__PURE__ */ new Map();
  const b\u00E4st = (i, k) => {
    const nyckel = `${i},${k}`;
    const k\u00E4nd = minne.get(nyckel);
    if (k\u00E4nd) return k\u00E4nd;
    let svar = { kostnad: Infinity, brott: [] };
    if (k === 1) {
      if (w(i, ord.length) <= max) svar = { kostnad: 0, brott: [ord.length] };
    } else {
      for (let j = i + 1; j < ord.length; j++) {
        if (w(i, j) > max) break;
        const rest = b\u00E4st(j, k - 1);
        if (rest.kostnad === Infinity) continue;
        const c = rest.kostnad + (max - w(i, j)) ** 2;
        if (c < svar.kostnad) svar = { kostnad: c, brott: [j, ...rest.brott] };
      }
    }
    minne.set(nyckel, svar);
    return svar;
  };
  const { kostnad, brott } = b\u00E4st(0, minsta);
  if (kostnad === Infinity) return girig(text, m\u00E4t, max);
  const rader = [];
  let fr\u00E5n = 0;
  for (const b of brott) {
    rader.push(ord.slice(fr\u00E5n, b).join(" "));
    fr\u00E5n = b;
  }
  return rader;
}
function rubrikAlternativ(delar, m\u00E4t, max) {
  const icketomma = delar.map((d) => ({ text: d.text.trim(), f\u00E4rg: d.f\u00E4rg })).filter((d) => d.text);
  if (!icketomma.length) return [];
  const vidByte = icketomma.flatMap((d) => balanserad(bindTankstreck(d.text), m\u00E4t, max).map((text) => [{ text, f\u00E4rg: d.f\u00E4rg }]));
  if (icketomma.length === 1) return [{ rader: vidByte, l\u00E4ge: "f\xE4rgbyte" }];
  const hel = icketomma.map((d) => d.text).join(" ");
  const f\u00E4rger = icketomma.flatMap((d, i) => [...d.text].map(() => d.f\u00E4rg).concat(i < icketomma.length - 1 ? [d.f\u00E4rg] : []));
  let pos = 0;
  const fri = balanserad(bindTankstreck(hel), m\u00E4t, max).map((rad) => {
    const segment = [];
    for (const tecken of rad) {
      const f\u00E4rg = f\u00E4rger[pos++] ?? icketomma[0].f\u00E4rg;
      const sista = segment.at(-1);
      if (sista && sista.f\u00E4rg === f\u00E4rg) segment[segment.length - 1] = { text: sista.text + tecken, f\u00E4rg };
      else segment.push({ text: tecken, f\u00E4rg });
    }
    pos++;
    return segment;
  });
  return [{ rader: vidByte, l\u00E4ge: "f\xE4rgbyte" }, { rader: fri, l\u00E4ge: "fri" }];
}

// atoms/annons/satt.ts
var F\u00E5rIntePlats = class extends Error {
};
var STEG = [1, 0.935, 0.87, 0.805, 0.74];
function s\u00E4tt(k, format, regler, typsnitt) {
  if (!format.ritytor.length) throw new Error(`formatet ${format.namn} har inga ritytor`);
  const ritytor = [...format.ritytor].sort((a, b) => a.maxRader - b.maxRader);
  const st\u00F6rstaAntal = ritytor.at(-1).maxRader;
  let delar = [{ text: k.rubrik, f\u00E4rg: regler.textF\u00E4rg }];
  if (k.markerad) {
    const i = k.rubrik.indexOf(k.markerad);
    if (i < 0) throw new Error(`den markerade delen st\xE5r inte i rubriken: "${k.markerad}"`);
    delar = [
      { text: k.rubrik.slice(0, i), f\u00E4rg: regler.textF\u00E4rg },
      { text: k.markerad, f\u00E4rg: regler.markeradF\u00E4rg },
      { text: k.rubrik.slice(i + k.markerad.length), f\u00E4rg: regler.textF\u00E4rg }
    ];
  }
  const underF\u00F6r = (g) => {
    const alternativ = regler.underBredder.map((b) => balanserad(bindTankstreck(k.underrubrik), (t) => typsnitt.under.bredd(t, g), b));
    return alternativ.sort((a, b) => a.length - b.length || Math.max(...a.map((r) => typsnitt.under.bredd(r, g))) - Math.max(...b.map((r) => typsnitt.under.bredd(r, g))))[0];
  };
  let underGrad = regler.underGrader[0], underrader = underF\u00F6r(underGrad);
  for (const g of regler.underGrader.slice(1)) {
    const r = underF\u00F6r(g);
    if (r.length < underrader.length) {
      underGrad = g;
      underrader = r;
    }
  }
  const grader = regler.grader ?? STEG.map((s) => Math.round(ritytor[0].rubrikGrad * s * 100) / 100);
  for (const grad of grader) {
    const m\u00E4t = (t) => typsnitt.rubrik.bredd(t, grad);
    for (const brytning of rubrikAlternativ(delar, m\u00E4t, regler.maxBredd)) {
      if (brytning.rader.length > st\u00F6rstaAntal) continue;
      const rityta = ritytor.find((r) => r.maxRader >= brytning.rader.length);
      const radavst\u00E5nd = grad * regler.radavst\u00E5nd;
      const f\u00F6rstaRaden = brytning.rader[0].map((s) => s.text).join("");
      const rubrikBaslinje = rityta.logoBotten + regler.luft\u00D6verRubrik + typsnitt.rubrik.bl\u00E4ckTopp(f\u00F6rstaRaden, grad);
      const underBaslinje = rubrikBaslinje + radavst\u00E5nd * (brytning.rader.length - 1) + regler.glapp;
      const botten = underBaslinje + regler.underRadavst\u00E5nd * (underrader.length - 1);
      if (botten > format.maxBotten) continue;
      return {
        rityta,
        grad,
        radavst\u00E5nd,
        rader: brytning.rader,
        l\u00E4ge: brytning.l\u00E4ge,
        rubrikBaslinje,
        underGrad,
        underrader,
        underBaslinje,
        luft: regler.luft\u00D6verRubrik,
        botten
      };
    }
  }
  throw new F\u00E5rIntePlats(`rubriken f\xE5r inte plats i ${format.namn} i n\xE5gon av graderna ${grader.join(", ")}: "${k.rubrik}"`);
}

// atoms/annons/rita.ts
function svgBana(d) {
  const bana = new Path();
  const delar = d.match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, kommando = "";
  const tal = () => Number(delar[i++]);
  while (i < delar.length) {
    if (/^[MLQCZ]$/i.test(delar[i])) kommando = delar[i++].toUpperCase();
    switch (kommando) {
      case "M":
        cx = tal();
        cy = tal();
        sx = cx;
        sy = cy;
        bana.moveTo(cx, cy);
        kommando = "L";
        break;
      case "L":
        cx = tal();
        cy = tal();
        bana.lineTo(cx, cy);
        break;
      case "Q": {
        const qx = tal(), qy = tal(), x = tal(), y = tal();
        bana.curveTo(cx + 2 / 3 * (qx - cx), cy + 2 / 3 * (qy - cy), x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), x, y);
        cx = x;
        cy = y;
        break;
      }
      case "C": {
        const x1 = tal(), y1 = tal(), x2 = tal(), y2 = tal(), x = tal(), y = tal();
        bana.curveTo(x1, y1, x2, y2, x, y);
        cx = x;
        cy = y;
        break;
      }
      case "Z":
        bana.closePath();
        cx = sx;
        cy = sy;
        break;
      default:
        throw new Error(`ok\xE4nt kommando i bandata: ${delar[i]}`);
    }
  }
  return bana;
}
function hexF\u00E4rg(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`ogiltig f\xE4rg: ${hex}`);
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16) / 255);
}
function ritaBanor(bakgrundPng, banor) {
  const pix = new Image2(bakgrundPng).toPixmap();
  const rit = new DrawDevice(Matrix.identity, pix);
  for (const b of banor)
    rit.fillPath(svgBana(b.d), false, Matrix.identity, ColorSpace.DeviceRGB, hexF\u00E4rg(b.f\u00E4rg), 1);
  rit.close();
  const png = pix.asPNG();
  pix.destroy();
  return png;
}
function svgMedBanor(svg, banor) {
  const slut = svg.lastIndexOf("</svg>");
  if (slut < 0) throw new Error("bakgrunden \xE4r ingen SVG");
  const esc = (x) => x.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const v\u00E4gar = banor.map((b) => `<path fill="${esc(b.f\u00E4rg)}" d="${b.d}"/>`).join("\n");
  return `${svg.slice(0, slut)}<g id="text">
${v\u00E4gar}
</g>
${svg.slice(slut)}`;
}

// atoms/annons/prov.ts
var import_opentype2 = __toESM(require_opentype(), 1);
function provmall() {
  const doc = new PDFDocument();
  const font = doc.addSimpleFont(new Font("Helvetica"));
  const foto = new Pixmap(ColorSpace.DeviceRGB, [0, 0, 80, 50], false);
  const p = foto.getPixels();
  for (let i = 0; i < p.length; i += 3) {
    p[i] = 40;
    p[i + 1] = 90;
    p[i + 2] = 200;
  }
  const bild = doc.addImage(new Image2(foto));
  const fonter = doc.newDictionary();
  fonter.put("F1", font);
  const xobj = doc.newDictionary();
  xobj.put("Im0", bild);
  const resurser = doc.newDictionary();
  resurser.put("Font", fonter);
  resurser.put("XObject", xobj);
  const inneh\u00E5ll = [
    "0.94 g 0 0 400 500 re f",
    "q 20 280 360 200 re W n 400 0 0 250 0 260 cm /Im0 Do Q",
    "0 g 20 250 60 10 re f",
    "BT /F1 30 Tf 0 0 0 rg 24 200 Td (Platshallare rad ett) Tj ET",
    "BT /F1 30 Tf 0 0 0 rg 24 160 Td (rad tva) Tj ET",
    "BT /F1 12 Tf 0 0 0 rg 24 120 Td (Underrubrik) Tj ET",
    "BT /F1 10 Tf 1 1 1 rg 30 460 Td (TAGG) Tj ET"
  ].join("\n");
  doc.insertPage(-1, doc.addPage([0, 0, 400, 500], 0, resurser, inneh\u00E5ll));
  const ut = doc.saveToBuffer("").asUint8Array();
  doc.destroy();
  return ut;
}
function provtypsnitt() {
  const ruta = () => {
    const p = new import_opentype2.default.Path();
    p.moveTo(50, 0);
    p.lineTo(450, 0);
    p.lineTo(450, 700);
    p.lineTo(50, 700);
    p.close();
    return p;
  };
  const tecken = [..."abcdefghijklmnopqrstuvwxyz\xE5\xE4\xF6ABCDEFGHIJKLMNOPQRSTUVWXYZ\xC5\xC4\xD60123456789\u2013.,"];
  const glyfer = [
    new import_opentype2.default.Glyph({ name: ".notdef", advanceWidth: 500, path: new import_opentype2.default.Path() }),
    new import_opentype2.default.Glyph({ name: "space", unicodes: [32, 160], advanceWidth: 250, path: new import_opentype2.default.Path() }),
    ...tecken.map((c) => new import_opentype2.default.Glyph({ name: `g${c.codePointAt(0)}`, unicode: c.codePointAt(0), advanceWidth: 500, path: ruta() }))
  ];
  const font = new import_opentype2.default.Font({ familyName: "Prov", styleName: "Regular", unitsPerEm: 1e3, ascender: 800, descender: -200, glyphs: glyfer });
  return new Uint8Array(font.toArrayBuffer());
}

// atoms/annons/bygg.ts
var TypsnittSaknas = class extends Error {
};
function typsnittsfil(k\u00E4lla, bas) {
  if (k\u00E4lla.fil) return readFileSync2(resolve(bas, k\u00E4lla.fil));
  const bytes = hittaIAdobeCache(k\u00E4lla.postScriptNamn);
  if (!bytes) throw new TypsnittSaknas(`typsnittet ${k\u00E4lla.postScriptNamn} finns varken som fil i uppdraget eller aktiverat i Adobe Fonts p\xE5 den h\xE4r datorn`);
  return bytes;
}
function typsnittUr(k\u00E4lla, bas) {
  return l\u00E4sTypsnitt(typsnittsfil(k\u00E4lla, bas));
}
var FONTS_WHERE = "Ange typsnittet som fil i uppdraget, eller kundens webbprojekt i uppdragets fonts (kundens typsnitt i kundposten: stilmallarna och vilken familj och vikt typsnittsnamnet motsvarar), eller aktivera det i Adobe Fonts p\xE5 datorn.";
async function loadFont(source, fonts, base, fetchImpl) {
  if (source.fil) return l\u00E4sTypsnitt(readFileSync2(resolve(base, source.fil)));
  let web;
  try {
    web = await fontFromWebProject(source.postScriptNamn, fonts, fetchImpl);
  } catch (e) {
    if (e instanceof WebFontError) throw new TypsnittSaknas(`typsnittet ${source.postScriptNamn} kunde inte h\xE4mtas ur kundens webbprojekt: ${e.message}. ${FONTS_WHERE}`);
    throw e;
  }
  if (web) return l\u00E4sTypsnitt(web);
  const cached = hittaIAdobeCache(source.postScriptNamn);
  if (!cached) throw new TypsnittSaknas(`typsnittet ${source.postScriptNamn} finns inte: varken som fil i uppdraget, bland kundens webbprojekt (fonts) eller aktiverat i Adobe Fonts p\xE5 den h\xE4r datorn. ${FONTS_WHERE}`);
  return l\u00E4sTypsnitt(cached);
}
async function loadAdFonts(uppdrag, base, fetchImpl) {
  return {
    rubrik: await loadFont(uppdrag.typsnitt.rubrik, uppdrag.fonts, base, fetchImpl),
    under: await loadFont(uppdrag.typsnitt.underrubrik, uppdrag.fonts, base, fetchImpl)
  };
}
function m\u00E4tRityta(doc, nummer) {
  const r = l\u00E4sRityta(doc, nummer - 1);
  const f = fotoram(r);
  if (!f) throw new Error(`ritytan ${nummer} har inget foto i en ram`);
  const under = r.text.filter((t) => t.baslinje > f.ram[3] && t.text.trim());
  if (!under.length) throw new Error(`ritytan ${nummer} har ingen text under fotot \u2014 rubrik och underrubrik ska ligga som redigerbar text`);
  const rubrikGrad = Math.max(...under.map((t) => t.grad));
  const rubrik = under.filter((t) => Math.abs(t.grad - rubrikGrad) < 0.5);
  const pix = rendera(doc, nummer - 1);
  const logoBotten = underkantEfter(pix, f.ram[3]);
  pix.destroy();
  return {
    nummer,
    ram: f.ram,
    rubrikGrad,
    logoBotten,
    maxRader: new Set(rubrik.map((t) => Math.round(t.baslinje))).size,
    x: Math.min(...rubrik.map((t) => t.x))
  };
}
function bygg(uppdrag, bas, ut, loaded) {
  const typsnitt = loaded ?? { rubrik: typsnittUr(uppdrag.typsnitt.rubrik, bas), under: typsnittUr(uppdrag.typsnitt.underrubrik, bas) };
  const doc = \u00F6ppna(readFileSync2(resolve(bas, uppdrag.mall.fil)));
  mkdirSync(ut, { recursive: true });
  try {
    const m\u00E4tta = /* @__PURE__ */ new Map();
    const m\u00E4t = (n) => {
      let m = m\u00E4tta.get(n);
      if (!m) {
        m = m\u00E4tRityta(doc, n);
        m\u00E4tta.set(n, m);
      }
      return m;
    };
    const format = uppdrag.mall.format.map((f) => ({ namn: f.namn, maxBotten: f.maxBotten, ritytor: f.ritytor.map(m\u00E4t) }));
    const l\u00E5nade = /* @__PURE__ */ new Map();
    const resultat = [];
    let nr = 0;
    for (const k of uppdrag.koncept) {
      for (const f of format) {
        nr++;
        const s = s\u00E4tt(k, f, uppdrag.regler, typsnitt);
        const n = s.rityta.nummer;
        let foto, fotoK\u00E4lla = "mallens";
        if (k.foto && "fil" in k.foto) {
          foto = readFileSync2(resolve(bas, k.foto.fil));
          fotoK\u00E4lla = "fil";
        } else if (k.foto && "rityta" in k.foto) {
          const fr\u00E5n = k.foto.rityta[f.namn];
          if (fr\u00E5n !== void 0 && fr\u00E5n !== n) {
            let b = l\u00E5nade.get(fr\u00E5n);
            if (!b) {
              b = fotoFr\u00E5nRityta(doc, fr\u00E5n - 1);
              l\u00E5nade.set(fr\u00E5n, b);
            }
            foto = b;
            fotoK\u00E4lla = "annan rityta";
          }
        }
        const ram = m\u00E4tta.get(n).ram;
        const bakgrund = byggBakgrund(doc, n - 1, { taBort: (t) => t.baslinje > ram[3], ...foto ? { foto } : {} });
        const banor = [
          ...s.rader.flatMap((rad, i) => radSomBanor(typsnitt.rubrik, rad, s.rityta.x, s.rubrikBaslinje + i * s.radavst\u00E5nd, s.grad)),
          ...s.underrader.flatMap((text, i) => radSomBanor(
            typsnitt.under,
            [{ text, f\u00E4rg: uppdrag.regler.textF\u00E4rg }],
            s.rityta.x,
            s.underBaslinje + i * uppdrag.regler.underRadavst\u00E5nd,
            s.underGrad
          ))
        ];
        const fil = uppdrag.filnamn.replace("{nr}", String(nr).padStart(2, "0")).replace("{slug}", k.slug).replace("{format}", f.namn);
        const svg = fil.replace(/\.[^.]+$/, "") + ".svg";
        writeFileSync(join2(ut, fil), ritaBanor(bakgrund.png, banor));
        writeFileSync(join2(ut, svg), svgMedBanor(bakgrund.svg, banor));
        resultat.push({
          fil,
          svg,
          koncept: k.slug,
          format: f.namn,
          rityta: n,
          grad: s.grad,
          l\u00E4ge: s.l\u00E4ge,
          rader: s.rader.map((r) => r.map((x) => x.text).join("").replace(/\u00A0/g, " ")),
          underGrad: s.underGrad,
          underrader: s.underrader.map((r) => r.replace(/\u00A0/g, " ")),
          luft\u00D6verRubrik: s.luft,
          underrubrikensBotten: s.botten,
          foto: fotoK\u00E4lla
        });
      }
    }
    writeFileSync(join2(ut, "manifest.json"), JSON.stringify({ mall: basename(uppdrag.mall.fil), resultat }, null, 2) + "\n");
    return resultat;
  } finally {
    doc.destroy();
  }
}
var PROVREGLER = {
  radavst\u00E5nd: 1.3,
  underGrader: [12],
  underRadavst\u00E5nd: 16,
  glapp: 30,
  maxBredd: 340,
  underBredder: [340],
  luft\u00D6verRubrik: 20,
  textF\u00E4rg: "#000000",
  markeradF\u00E4rg: "#2500f9"
};
async function sj\u00E4lvtest() {
  const dir = mkdtempSync(join2(tmpdir(), "annons-"));
  try {
    writeFileSync(join2(dir, "mall.pdf"), provmall());
    writeFileSync(join2(dir, "typsnitt.otf"), provtypsnitt());
    const uppdrag = {
      mall: { fil: "mall.pdf", format: [{ namn: "45", ritytor: [1], maxBotten: 480 }] },
      typsnitt: { rubrik: { postScriptNamn: "Prov", fil: "typsnitt.otf" }, underrubrik: { postScriptNamn: "Prov", fil: "typsnitt.otf" } },
      regler: PROVREGLER,
      koncept: [{ slug: "prov", rubrik: "Ett prov \u2013 med bl\xE5tt", markerad: "med bl\xE5tt", underrubrik: "En underrubrik" }],
      filnamn: "a{nr}_{slug}-{format}.png"
    };
    const r = bygg(uppdrag, dir, join2(dir, "ut"), await loadAdFonts(uppdrag, dir));
    if (r.length !== 1 || r[0].fil !== "a01_prov-45.png") throw new Error(`sj\xE4lvtestet gav ${JSON.stringify(r)}`);
    readFileSync2(join2(dir, "ut", "a01_prov-45.png"));
    const svg = readFileSync2(join2(dir, "ut", r[0].svg), "utf8");
    if (r[0].svg !== "a01_prov-45.svg" || !svg.includes('<g id="text">') || !svg.trimEnd().endsWith("</svg>"))
      throw new Error("sj\xE4lvtestet gav ingen SVG med textbanor");
    console.log(`self-test ok \xB7 ${r[0].fil} \xB7 ${r[0].rader.length} rubrikrader i ${r[0].grad} pt`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
async function main(argv) {
  if (argv.includes("--self-test")) return sj\u00E4lvtest();
  const [uppdragsfil, ut] = argv;
  if (!uppdragsfil || !ut) {
    console.error("anv\xE4ndning: node dist/atoms/annons/bygg.js <uppdrag.json> <utkatalog> | --self-test");
    process.exit(2);
  }
  const uppdrag = JSON.parse(readFileSync2(uppdragsfil, "utf8"));
  const base = dirname(resolve(uppdragsfil));
  const r = bygg(uppdrag, base, resolve(ut), await loadAdFonts(uppdrag, base));
  for (const x of r) console.log(`${x.fil} \xB7 rityta ${x.rityta} \xB7 ${x.grad} pt \xB7 ${x.rader.length} rader (${x.l\u00E4ge}) \xB7 underrubrik ${x.underrader.length} rader`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main(process.argv.slice(2)).catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
export {
  PROVREGLER,
  TypsnittSaknas,
  bygg,
  loadAdFonts,
  loadFont,
  m\u00E4tRityta,
  typsnittsfil
};
