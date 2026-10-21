// scripts/gmail-las.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// dist/src/v2/domain/moment-standard.js
var STANDARD_KEY = /^[a-z][a-z0-9_]*$/;

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header2] = jwt.split(".");
    const base64 = header2.replace(/-/g, "+").replace(/_/g, "/").padEnd(header2.length + (4 - header2.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step2) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step2.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step2.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect2 = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect2.type === "preprocess") {
      const processed = effect2.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect2.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect2.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect2.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect2.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect2.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect2);
  }
};
ZodEffects.create = (schema, effect2, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect: effect2,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// dist/src/registry/instruction-names.js
var OLD_INSTRUCTION_KEYS = {
  syfte: "purpose",
  laes_foerst: "read_first",
  saa_goer_du: "how_to",
  svarsform: "answer_format",
  far_inte: "must_not",
  fraaga_naer: "ask_when"
};
function modernInstruction(x) {
  if (!x || typeof x !== "object" || Array.isArray(x))
    return x;
  const o = x;
  if (!Object.keys(o).some((k) => k in OLD_INSTRUCTION_KEYS))
    return x;
  const out = {};
  for (const [k, v] of Object.entries(o))
    out[OLD_INSTRUCTION_KEYS[k] ?? k] = v;
  return out;
}

// dist/src/registry/references.js
var REFERENCE_KINDS = ["call", "link", "asset", "node"];
var reference = z.object({
  /** Vad referensen är: ett anrop, en länk, en fil i banken eller en nod i registret. */
  kind: z.enum(REFERENCE_KINDS),
  /** Vad den är, i människans ord: «Kundens användare i HubSpot». Visas i stället för id:t. */
  label: z.string().min(1),
  /**
   * Var den pekar. `call`: verktyget och op:en, «read.context» eller
   * «search»; `link`: adressen (https://…); `asset`: tillgångens id i banken;
   * `node`: nodens id i registret.
   */
  target: z.string().min(1),
  /** Argumenten till anropet (`call`). Platshållare {customer}, {task}, {step} fylls ur uppgiften. */
  args: z.record(z.unknown()).optional(),
  /** När eller varför den används, en bisats. */
  note: z.string().min(1).optional()
}).strict();

// dist/src/types/common.js
var grounding = z.enum(["decided", "observed", "proposed"]);
var regime = z.enum(["calendar", "trigger", "order"]);
var binding = z.enum(["contract", "decision"]);
var stepType = z.enum(["executable", "manual", "choice", "unbuilt", "blocked"]);
var leadTimeOrigin = z.enum(["measured", "inferred", "guessed", "decided"]);
var onMissing = z.enum(["block", "defer", "assume"]);
var whyBlock = z.enum(["external", "money_or_contract", "customer_system"]);
var acquisition = z.enum(["fetched", "provided"]);
var caseClass = z.enum([
  "incident",
  "change",
  "question",
  "idea",
  "order",
  "coordination",
  "noise"
]);
var actorKind = z.enum(["human", "clock", "script", "mcp", "ai"]);
var actor = z.object({
  kind: actorKind,
  /** Vem inom sin sort: en persons id, ett skriptnamn, en modellidentitet. */
  id: z.string().min(1),
  /** MCP-sessionens id när sådan finns. Gör en händelse spårbar till ett samtal. */
  session: z.string().min(1).optional()
}).strict();
var SHARED_TENANT = "@shared";
var tenantId = z.string().min(1).refine((t) => t === SHARED_TENANT || !t.startsWith("@"), { message: "tenant f\xE5r inte b\xF6rja med @ \u2014 det \xE4r reserverat f\xF6r det delade biblioteket" });
var scope = z.enum(["shared", "tenant"]);
var leadTimeUnit = z.enum(["calendar", "workdays"]);
var leadTime = z.object({
  days: z.number().int().min(0),
  origin: leadTimeOrigin,
  unit: leadTimeUnit.optional()
}).strict();
var NAME_SHAPE = /^[a-z][a-z0-9_]*\.[a-z_]+\.[a-z][a-z0-9_]*$/;
var nodeHead = {
  id: z.string().min(1),
  name: z.string().regex(NAME_SHAPE),
  grounding,
  /**
   * Tomt är tillåtet av schemat med flit: regeln `common.found_in` ska vara
   * den som avvisar, så att felet blir "härkomst saknas" och inte "för kort
   * sträng". Ett åtgärdbart fel är hela poängen med grinden.
   */
  found_in: z.string(),
  scope,
  /**
   * Posten går i pension (som en metod kan, se `Method.retiring`): den finns
   * kvar och det som redan pekar på den följer med, men sökningen och
   * förslagen föreslår den inte. Gäller anrop, operationer, steg och övriga
   * sorter med huvud. Själva tillbakadragandet görs med seed, efter ja.
   */
  retiring: z.literal(true).optional()
};

// dist/src/plan/standards.js
var STANDARD_STEP_HOURS = {
  // Kod kör själv, men någon startar den och kontrollerar resultatet (Daniel P 2026-09-30).
  code: 0.25,
  // En modell gör arbetet; en människa granskar.
  llm: 0.25,
  // Handarbete, och steg där kod och människa blandas.
  human: 1,
  mixed: 1
};
var DEFAULT_BREAK_MINUTES = 60;
var DEFAULT_PLANNABLE_SHARE = 0.8;
var STANDARD_CAPACITY_HOURS_PER_WEEK = Math.round(5 * (18 - 8 - DEFAULT_BREAK_MINUTES / 60) * DEFAULT_PLANNABLE_SHARE * 100) / 100;

// dist/src/plan/goal-plan.js
var ACTORS = ["human", "claude", "code", "customer"];
var MOMENT_KINDS = ["work", "approve", "wait", "decide"];
var MOMENT_MODES = ["do", "review"];
var HARD_REASONS = [
  "cannot_without",
  "leaves_house",
  "money_or_contract",
  "customer_system",
  "rights_or_consent"
];
var EFFECTS = ["internal", "leaves_house", "customer_system", "money_or_contract", "rights_or_consent"];
var GOAL_CLARITY = ["clear", "vague"];
var PARAM_TYPES = ["number", "text", "list", "date", "ref"];
var MOMENT_DEFAULT_HOURS = {
  human: STANDARD_STEP_HOURS.human,
  claude: STANDARD_STEP_HOURS.llm,
  code: 0,
  customer: 0
};

// dist/src/plan/goal-tools.js
var TOOL_MODES = ["do", "review", "approve", "decide", "wait"];
var DEFAULT_TOOLS = [
  {
    id: "image_picker",
    label: "Bildv\xE4ljaren",
    handles: { types: ["post_image", "image.*", "image", "images", "*_image", "*_images"], modes: ["do"] },
    component: "image-picker"
  },
  {
    id: "image_viewer",
    label: "Bildvisaren",
    handles: { types: ["post_image", "post_formats", "image.*", "image", "images", "*_image", "*_images"], modes: ["review", "approve"], actors: ["human", "claude", "code"] },
    component: "image-viewer"
  },
  {
    id: "preview",
    label: "F\xF6rhandsvisningen",
    handles: {
      types: [
        "page",
        "email",
        "social_post",
        "campaign",
        "campaigns",
        "ad_template",
        "ad_concept",
        "product_sheet",
        "blog_article",
        "deck",
        "presentation",
        "presentation_draft",
        "approval_package",
        "page.*",
        "email.*",
        "ad.*",
        "social.*",
        "*_page",
        "*_email",
        "*_post",
        "*_ad"
      ],
      modes: ["do", "review", "approve"],
      actors: ["human", "claude", "code"]
    },
    component: "preview"
  },
  {
    id: "text_editor",
    label: "Textredigeraren",
    handles: {
      types: [
        "meaning_notes",
        "text.*",
        "findings",
        "summary",
        "reply",
        "report",
        "plan",
        "proposal",
        "principles",
        "recommendation",
        "structure",
        "sources",
        "house_standard",
        "*_report",
        "*_notes",
        "*_plan",
        "*_texts",
        "*_summary",
        "*_brief",
        "*_basis",
        "*_questions",
        "*_proposal",
        "*_structure"
      ],
      // Vårt eget ja till en text; kundens ja går till presentationen.
      modes: ["do", "review", "approve"],
      actors: ["human", "claude", "code"]
    },
    component: "text-editor"
  },
  {
    id: "decision_form",
    label: "Beslutsformul\xE4ret",
    handles: { types: ["structure_decision", "metric_decision", "decision.*", "decision", "*_decision"], modes: ["do"] },
    component: "decision-form"
  },
  {
    id: "scheduler",
    label: "Schemal\xE4ggaren",
    handles: { types: ["post_scheduled", "schedule.*", "*_scheduled"], modes: ["do"] },
    component: "scheduler"
  },
  {
    id: "presenter",
    label: "Kundens vy (presentationen)",
    handles: {
      types: [
        "plan_approval",
        "post_approval",
        "budget_approval",
        "ads_approval",
        "approval.*",
        "approval",
        "approval_request",
        "presentation",
        "presentation_draft",
        "*_approval"
      ],
      modes: ["approve"],
      actors: ["customer"]
    },
    component: "presenter"
  },
  {
    // Husets förval (del H3b, src/plan/present-as.ts): momentet som skickar materialet till kunden, och det som lämnar
    // en presentation, görs i presentatören: presentationssidan med delbar länk. En specialisering av förhandsvisningen.
    id: "presentation_page",
    label: "Presentationssidan",
    handles: { types: ["approval_request", "presentation", "presentation_draft"], modes: ["do", "review"], actors: ["human", "claude", "code"] },
    component: "presenter",
    extends: "preview"
  },
  {
    id: "decision_cards",
    label: "Beslutskorten",
    handles: { types: ["*"], modes: ["decide"] },
    component: "decision-cards",
    extends: "generic"
  },
  {
    id: "wait_card",
    label: "V\xE4ntekortet",
    handles: { types: ["*"], modes: ["wait"] },
    component: "wait-card",
    extends: "generic"
  },
  {
    id: "generic",
    label: "Kontrollfr\xE5gan",
    handles: { types: ["*"], modes: [...TOOL_MODES] },
    component: "generic-check"
  }
];
var EXACT = Number.MAX_SAFE_INTEGER;

// dist/src/plan/present-as.js
var PRESENT_FORMATS = ["presentation", "pdf", "other"];

// dist/src/types/registered.js
var accessLevel = z.enum(["read", "draft", "write", "admin"]);
var EMAIL_ADDRESS = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
var LABEL_NAME = /^[\p{L}\p{N}][\p{L}\p{N} _\-/]{0,100}$/u;
var mailLabels = z.object({
  labels: z.array(z.string().min(1)).optional(),
  never_labels: z.array(z.string().min(1)).optional()
}).strict();
var grant = z.object({
  surface: z.string().min(1),
  level: accessLevel
}).strict();
var accessGroup = z.object({
  ...nodeHead,
  kind: z.literal("access_group"),
  label: z.string().min(1),
  grants: z.array(grant).min(1),
  /**
   * Vilka kunder gruppens medlemmar SER — skilt från vad de får GÖRA.
   *
   * `"all"` eller en lista med kundparters id. Förvalet är tomt: en grupp som
   * inte säger något ser ingenting. Ett förval som öppnar vore en läcka som
   * ingen skrivit, och den syns inte förrän någon ser fel kunds ärenden.
   */
  sees: z.union([z.literal("all"), z.array(z.string().min(1))]).default([])
}).strict();
var humanName = {
  label: z.string().optional(),
  summary: z.string().optional(),
  /**
   * Orden någon använder när de letar efter posten, men som inte står i namnet
   * (B-255). "Skapa användare i HubSpot" söks som "ny kollega" och "konto".
   *
   * Posten säger sina egna ord. En handskriven lista i koden över vilka ord
   * som hör ihop växer inte med biblioteket; det här gör det, eftersom varje
   * ny del bär sina ord från början. Väger som namnet i sökningen.
   */
  keywords: z.array(z.string().min(1)).optional()
};
var effectVerb = z.enum(["reads", "creates", "updates", "deletes", "sends", "publishes"]);
var effect = z.object({
  verb: effectVerb,
  /** Objektet effekten gäller, t.ex. "hubspot.saljare", "email", "file.pdf". */
  object: z.string().min(1),
  /** Fälten som får skrivas. Utelämnat: hela objektet (t.ex. en fil). */
  fields: z.array(z.string().min(1)).optional()
}).strict();
var performer = z.enum(["code", "llm", "human"]);
var operationRisk = z.enum(["reads", "writes", "reaches_outside", "costs_money"]);
var fieldType = z.enum([
  "string",
  "id",
  "integer",
  "number",
  "boolean",
  "date",
  "datetime",
  "url",
  "list",
  "object"
]);
var operationField = z.object({
  type: fieldType,
  /** Ett påhittat exempel på formen, aldrig ett kundvärde. */
  example: z.unknown().optional(),
  /** Det som inte syns i typen: enhet, format, vad som gäller tillsammans. */
  note: z.string().min(1).optional()
}).strict();
var operationChoice = z.discriminatedUnion("from", [
  z.object({ from: z.literal("account"), call: z.string().min(1), note: z.string().min(1).optional() }).strict(),
  z.object({ from: z.literal("list"), values: z.array(z.string().min(1)).min(1), note: z.string().min(1).optional() }).strict(),
  z.object({
    from: z.literal("dirigent"),
    source: z.enum(["content", "bank", "plan", "registry"]),
    call: z.string().min(1).optional(),
    note: z.string().min(1).optional()
  }).strict()
]);
var operationStructure = z.object({
  /** Objekt utöver det som härleds ur effekten, ur systemets ordlista. */
  objects: z.array(z.string().min(1)).optional(),
  /** Handlingar utöver effektens verb, ur ordlistan för handlingar. */
  actions: z.array(z.string().min(1)).optional(),
  /** Operationer (anropens id) som måste ha körts först. */
  requires: z.array(z.string().min(1)).optional(),
  /** Operationer som brukar komma efter. */
  leads_to: z.array(z.string().min(1)).optional(),
  /** Operationer som gör samma sak på ett annat sätt, eller i stället. */
  alternatives: z.array(z.string().min(1)).optional(),
  /** Indata med typ och exempel, per namn i `input`. */
  fields: z.record(operationField).optional(),
  /** Varifrån värdena kommer, per namn i `input`. */
  choices: z.record(operationChoice).optional(),
  /** Bara när risken är större än den som härleds ur effekten. */
  risk: operationRisk.optional()
}).strict();
var leaves = z.object({
  schema: z.record(z.string().min(1)),
  done_when: z.array(z.string().min(1)),
  where: z.string(),
  asset_type: z.string().min(1).optional()
}).strict();
var instruktion = z.preprocess(modernInstruction, z.object({
  /** Vad som ska göras och varför. En mening. */
  purpose: z.string().min(1),
  /**
   * Vad som ska läsas innan något skrivs: tillgångstyper, noder och tidigare
   * beslut som REFERENSER — inte fri text, för en referens går att slå upp.
   */
  read_first: z.array(z.string().min(1)),
  /** Stegen i ordning. */
  how_to: z.array(z.string().min(1)),
  /** Exakt form på svaret och hur den kontrolleras: fält, typer, längder. */
  answer_format: z.string().min(1),
  /** Vad som inte får göras: gissa fakta, ändra tonläge, kontakta någon. */
  must_not: z.array(z.string().min(1)),
  /** När steget ska stanna och fråga i stället för att gissa. */
  ask_when: z.array(z.string().min(1)),
  /**
   * Den ordagranna prompten till verktyget (UX-genomgången 2026-09-27), som
   * «Kopiera prompt» i vyn lägger i urklipp. Den har **Hämta först:** med
   * verktyg och id för allt den bygger på. Platshållarna fylls i ur
   * uppgiften: {customer}, {customer_id}, {task}, {step}, och för ett steg
   * före i samma uppgift {content:<stegets id>} (textens id) och
   * {approved:<stegets id>} («godkänd 26 sep», eller att den inte är det).
   * Grinden prövar att en text eller bild den nämner har en plats
   * (molecule.prompt).
   */
  prompt: z.string().min(1).optional(),
  /**
   * Det instruktionen pekar på, strukturerat (src/registry/references.ts):
   * anrop med verktyg och argument, länkar, filer i banken och noder. Claude
   * får anropsmönstret färdigt att köra; vyn visar en knapp, aldrig ett id.
   */
  references: z.array(reference).optional(),
  /**
   * Avsteg från promptstandarden (guide { topic: "promptstandard" }, Daniel P
   * 2026-10-07: «tvinga den att motivera tydligt varför den INTE gör som
   * instruerat»): en del som saknas eller avviker godtas bara med ett konkret
   * skäl (src/plan/prompt-lint.ts).
   */
  deviations: z.array(z.object({
    part: z.enum(["purpose", "read_first", "how_to", "must_not", "answer_format", "ask_when"]),
    reason: z.string().min(1)
  }).strict()).optional()
}).strict());
var browserRecipe = z.object({
  /** Systemet, t.ex. HubSpot. */
  system: z.string(),
  /** Var man börjar: URL eller sida. */
  start: z.string(),
  /** Menyvägen steg för steg. */
  path: z.array(z.string()),
  /** Menyvägen per värde på en parameter, t.ex. `action`: clone, insert_token. */
  paths_by: z.object({ param: z.string().min(1), paths: z.record(z.array(z.string())) }).strict().optional(),
  /** Vad man ska se när det lyckats. */
  expect: z.string(),
  /** Kontrollen efteråt, i ord. */
  check: z.string(),
  /** Kontrollen som en javascript-rad som läser av sidan (javascript_tool). */
  check_js: z.string().optional(),
  /** Hur man ångrar. */
  undo: z.string(),
  /** Allvarsgrad enligt reglerna för ja: ● sparas direkt med ångra, ◐ förhandsvisning och ja, ■ fråga alltid. */
  severity: z.enum(["\u25CF", "\u25D0", "\u25A0"])
}).strict();
var call = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("call"),
  /** Systemet anropet talar med. Måste matcha prefixet i `name`. */
  surface: z.string().min(1),
  input: z.array(z.string()),
  /**
   * Indata som anropet klarar sig utan (provet av Meta-metoden 2026-09-25:
   * kampanjen krävde både dagsbudget, totalbudget och budstrategi, som i Meta
   * är valfria och varandras alternativ). Står de här frågar planen inte efter
   * dem innan steget körs; de skickas med när de finns. Varje namn står i `input`.
   */
  optional_input: z.array(z.string()).optional(),
  output: z.array(z.string()),
  /** Uppmätt, inte påstådd. `test.idempotence` gör den till fakta. */
  idempotent: z.boolean(),
  /** Ofarlig körningsväg. Utan den kan anropet inte testas — och avvisas. */
  test_target: z.string(),
  /**
   * Behörighetsnivån anropet kräver av den som kör det. Obligatorisk av samma
   * skäl som `test_target`: ett anrop utan deklarerad räckvidd går inte att
   * ge någon åtkomst till på ett ansvarigt sätt.
   */
  requires: accessLevel,
  /**
   * För ytan `script`: kommandot som argv-LISTA, aldrig en sträng.
   *
   * Ett element är antingen en literal eller exakt en platshållare `{namn}`
   * som fylls av argumentet med samma namn. Inget skal, ingen konkatenering —
   * ett värde som kommer från ett steg får aldrig kunna bli ett kommando.
   *
   *   ["python3", "cms.py", "find", "{query}"]
   */
  command: z.array(z.string().min(1)).optional(),
  /**
   * Miljövariabler anropet inte kan köras utan.
   *
   * Grinden prövar INTE den här listan mot miljön, och ska inte göra det:
   * grinden avgör om en deklaration är riktig, inte om just den här maskinen
   * råkar vara utrustad. Det är två frågor, och att blanda dem gör att samma
   * nod passerar på en dator och avvisas på en annan.
   *
   * I stället gör listan skillnaden SYNLIG. Utan den påstår registret att ett
   * anrop är körbart för att det är korrekt beskrivet — och fyra Google
   * Ads-atomer stod deklarerade i månader utan att någon hade credentials.
   * Se `readiness()` i src/registry/readiness.ts.
   */
  needs_env: z.array(z.string().min(1)).optional(),
  usage_unit: z.enum(["token", "second", "request"]).optional(),
  /**
   * Den generella atomen i kod som molekylen binder, t.ex. "hubspot.record.update".
   *
   * VALFRI bara för ett mänskligt steg. Hantverk — ett frilägg i Photoshop,
   * en avstämning, en granskning — har ingen kod att binda, och kravet gjorde
   * att rådet blev "bygg den i kod" för något som ingen ska bygga. Ett sådant
   * steg bär i stället ett recept i `instruction`: Vad behövs, Så gör du,
   * Kontrollera. Grinden prövar det (`call.atom`).
   */
  atom: z.string().min(1).optional(),
  /**
   * Värdena molekylen binder atomen med (2026-10-02, «En atom är en sak
   * systemet kan»): typen, formatet eller källan som gör en generell atom
   * specifik, t.ex. `{ format: "video" }` för `meta.creative.create`. Det
   * specifika ligger i molekylen, aldrig i atomens namn. Gamla atomnamn som
   * slagits ihop pekar hit via `MERGED_ATOMS` (src/registry/atom-aliases.ts).
   */
  atom_args: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  /**
   * Kopplingarna steget använder (B-252), t.ex. "Smyra", "HubSpot" eller
   * "Smyra/smyra_design" när ett bestämt verktyg avses.
   *
   * Ett Claude-steg binder `llm.instruction`, och då säger atomen ingenting om
   * vilka system steget rör. Fältet gör det synligt — i "Så görs steget" och
   * för den som ska ge någon åtkomst — i stället för att det bara står i
   * instruktionens text.
   */
  connections: z.array(z.string().min(1)).optional(),
  /**
   * Atomförslaget molekylen byggdes ur (B-107).
   *
   * Övergången från förslag till atom är en händelse, inte en överskrivning:
   * förslaget står kvar med varför det behövdes och vem som bad om det. Det
   * här fältet är den andra halvan av samma koppling, och det bor i REGISTRET
   * därför att registret är det som överlever en ominläsning — en händelse i
   * loggen räcker inte för `npm test`, som läser filerna från början.
   */
  built_from: z.string().min(1).optional(),
  /**
   * Atomförslaget den här reservmolekylen står i för tills koden finns.
   *
   * Ett steg vars atom saknar kod sparas ändå: molekylen är då ett människo-
   * eller Claude-steg med recept eller instruktion, och det här fältet pekar
   * på förslaget. Byggs koden (en molekyl med `built_from` mot förslaget)
   * byter steget till koden av sig själv; receptet ligger kvar som reserv.
   */
  stands_in_for: z.string().min(1).optional(),
  /**
   * Hur färdig atomen är (den lätta vägen, Daniel P 2026-10-01: «enklare att
   * få in enskilda atomer utan ett jättebygge»). `draft`: yta, effekt, in/ut
   * och testväg räcker, och anropet körs bara som torrkörning (ytan sätter
   * `dry_run`). `published`, eller utelämnat: grinden prövar allt, och
   * anropet körs på riktigt. Sätts i atomfilen (`atoms/<yta>/<namn>.atom.ts`).
   */
  stage: z.enum(["draft", "published"]).optional(),
  effect,
  performer,
  /**
   * Obligatorisk för llm och human: vad som ska göras, i klartext.
   *
   * Äldre form (B-102). Den håller för en människa som läser, men en modell
   * som får den vet inte vad den skulle ha läst först eller när den ska
   * stanna och fråga. Nya llm-molekyler skriver `instruktion` i stället.
   */
  instruction: z.string().min(1).optional(),
  /** Den kontrollerbara instruktionen (B-102). Se `instruktion` ovan. */
  instruktion: instruktion.optional(),
  /**
   * Referenser för ett steg med recept i `instruction` (fri text): samma form
   * som `instruktion.references`. Ett Claude-steg bär dem i `instruktion`.
   */
  references: z.array(reference).optional(),
  /**
   * Stoppunkt utöver det effekten redan säger: ändrar något live eller kostar
   * pengar. `sends`, `publishes` och `deletes` är alltid stoppunkter.
   */
  stop: z.boolean().optional(),
  leaves,
  /**
   * Generell först (Daniel P 2026-10-06): finns en atom eller molekyl på samma
   * yta med samma verb (molekyl: samma effekt och atom) stoppar grinden en ny.
   * Undantaget är uttryckligt: `extend_existing: false` och ett `because` som
   * säger varför den inte kan vara en parameter i den befintliga. Skälet syns
   * i förhandsvisningen.
   */
  extend_existing: z.boolean().optional(),
  because: z.string().min(1).optional(),
  /** De fasta fälten för sökningen (etapp 1). Se `operationStructure`. */
  structure: operationStructure.optional(),
  /**
   * Hur atomen utförs: kod (förval), webbläsaren (Claude in Chrome, med
   * receptet i `browser`) eller en människa. Se docs/atom-recept.md.
   */
  means: z.enum(["code", "browser", "human"]).optional(),
  /** Receptet när `means` är `browser`. */
  browser: browserRecipe.optional()
}).strict();
var atomProposal = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("atom_proposal"),
  /** Systemet atomen skulle tala med. Måste matcha prefixet i `name`. */
  surface: z.string().min(1),
  /** EN effekt: verb och objekt. Samma krav som på en molekyl. */
  effect,
  input: z.array(z.string()),
  output: z.array(z.string()),
  /** Behörighetsnivån effekten kräver. Härleds ur effekten, prövas som en atoms. */
  requires: accessLevel,
  /**
   * Ofarlig körningsväg. Utan den går atomen inte att pröva när den väl finns.
   *
   * Tom sträng är tillåten av schemat med flit, precis som på en molekyl:
   * regeln `atom_proposal.test_target` ska vara den som avvisar, så att felet
   * blir "saknar ofarlig körningsväg" och inte "för kort sträng".
   */
  test_target: z.string(),
  /** Namnet den generella koden ska få, t.ex. bank.file.read. */
  atom: z.string().min(1),
  /** Varför den behövs — i klartext, inte "saknas". */
  why: z.string().min(1),
  /** Planen och steget som efterfrågade den. Ett förslag utan beställare är en gissning. */
  /**
   * Planen och steget som efterfrågade den. Valfritt sedan den lätta vägen
   * (2026-10-01): `why` säger varför, och en fråga ska inte kräva en hel plan.
   */
  requested_by: z.object({
    /** Planen eller metoden frågan kom ur, i klartext. */
    plan: z.string().min(1),
    /** Steget som behövde den, i klartext. */
    step: z.string().min(1)
  }).strict().optional(),
  /** Vad den skulle lämna. Samma form som en molekyls, så att kedjan går att pröva. */
  leaves,
  /**
   * Hur atomen kan göras (B-260): en anteckning till den som bygger den, inte
   * något användaren ser. Daniel P 2026-09-25: medlen är det Claude Code har
   * för att utforska och utforma atomer — atomerna kan nyttja dem, men
   * slutanvändaren behöver inte ha koll på det.
   *
   * Valfri med flit. Att kolla om en automationsväg finns görs på begäran,
   * inte som standard, och `checked` säger om någon faktiskt gjort det.
   * Finns ingen väg är `human` svaret: en mänsklig atom med recept.
   */
  means: z.object({
    /** api · mcp · llm (vilken modell som helst) · web_search (sökning med en LLM) · browser (Claude in Chrome) · human */
    via: z.enum(["api", "mcp", "llm", "web_search", "browser", "human"]),
    /** Receptet när `via` är `browser`: stegen som lyckades i Chrome (upptagningen). */
    recipe: browserRecipe.optional(),
    /** Vilket API, vilken MCP eller vilken leverantör — i klartext. */
    note: z.string().optional(),
    /** Har någon kollat att vägen finns? Utelämnat: nej, det är en gissning ur steget. */
    checked: z.boolean().optional(),
    /** Kräver en betaltjänst eller prenumeration vi inte har. Då är vägen mindre intressant. */
    paid: z.boolean().optional()
  }).strict().optional(),
  /**
   * Generell först (Daniel P 2026-10-06): finns en atom eller molekyl på samma
   * yta med samma verb (molekyl: samma effekt och atom) stoppar grinden en ny.
   * Undantaget är uttryckligt: `extend_existing: false` och ett `because` som
   * säger varför den inte kan vara en parameter i den befintliga. Skälet syns
   * i förhandsvisningen.
   */
  extend_existing: z.boolean().optional(),
  because: z.string().min(1).optional()
}).strict();
var callBinding = z.object({
  call: z.string().min(1),
  bind: z.record(z.string()).default({})
}).strict();
var operationCall = z.union([z.string(), callBinding]);
var operation = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("operation"),
  owner: z.string().min(1),
  /** Anropssekvensen. `inline` tillåtet för befintliga skript. */
  calls: z.array(operationCall),
  parameters: z.array(z.string()),
  requires: z.array(z.string()),
  produces: z.array(z.string()),
  render_name: z.string().optional(),
  prohibitions: z.array(z.string()).default([])
}).strict();
function removedListField(name, instead) {
  return z.unknown().refine((v) => v === void 0 || v === null, {
    message: `${name} finns inte l\xE4ngre: listmetodernas ordning \xE4r borttagen och planen r\xE4knas ur m\xE5lmodellen. ${instead} Se docs/plan-malstyrd.md.`
  }).optional();
}
var requirement = z.object({
  needs: z.string().min(1),
  on_missing: removedListField("on_missing", "Ett krav v\xE4ntar alltid; ett stopp s\xE4gs med why_block."),
  /**
   * Värdena kravet frågar efter (Daniel P 2026-10-09: «detta måste vi kunna
   * fråga om när man sätter upp»). Kravet är uppfyllt när uppdraget har dem —
   * uppdragets värden, eller stegets i kundens sätt — och svaret skrivs som
   * uppdragets värden, som stegen läser. «a|b» betyder ett av dem.
   */
  values: z.array(z.string().min(1)).min(1).optional(),
  /**
   * Skälet till ett stopp (regel 3). Ett krav med skäl stoppar steget som
   * ställer det; utan skäl väntar det (arbetet fortsätter, det saknade fylls på).
   */
  why_block: whyBlock.optional(),
  acquire_via: z.string().min(1),
  request_at: z.string().min(1),
  blocks_at: removedListField("blocks_at", "Kravet g\xE4ller steget som st\xE4ller det; i m\xE5lmodellen \xE4r det momentets underlag."),
  /** Frågan i klartext, som den ställs till en människa (B-082). */
  question: z.string().min(1).optional(),
  /** Ett förslag på svar som betyder något — inte "ja". */
  proposal: z.string().min(1).optional(),
  /**
   * Svarsalternativen (B-094), när frågan har ett bestämt antal svar: "Pro"
   * eller "Enterprise", "content staging" eller "separat testmiljö". Då ska
   * den som svarar välja, inte formulera. Utelämnat: fritext, som förut.
   */
  options: z.array(z.string().min(1)).min(2).optional(),
  /** Alternativet vi rekommenderar. Måste finnas i `options`; skälet står i `proposal`. */
  recommended: z.string().min(1).optional(),
  /**
   * Vem som kan svara. `internal` är ingen fråga till någon: det är något vi
   * själva ska ta reda på, och det blir en uppgift, inte en fråga.
   */
  asked_of: z.enum(["internal", "customer", "partner"]).optional(),
  /**
   * Kravet är en MATERIALMÄNGD, inte en tillgångstyp (B-105). `needs` bär då
   * mängdens namn, och kravet är uppfyllt när mängden är tillräcklig — inte
   * när den är komplett, för det blir den aldrig.
   */
  corpus: z.boolean().optional(),
  /** Vad som räcker för just det här steget, utöver mängdens eget villkor. */
  enough_here: z.array(z.string().min(1)).optional(),
  assume_approved: removedListField("assume_approved", "I m\xE5lmodellen l\xE5ser bara effekten p\xE5 kundens ja.")
}).strict();
var effortPhase = z.enum(["prepare", "do", "follow_up"]);
var effortCertainty = z.enum(["known", "partly", "new"]);
var effortLine = z.object({
  party: z.string().min(1),
  phase: effortPhase,
  likely_hours: z.number(),
  worst_hours: z.number(),
  certainty: effortCertainty,
  /** Skälet till bedömningen. En siffra utan skäl går inte att ompröva. */
  reason: z.string().min(1),
  origin: leadTimeOrigin
}).strict();
var demandKind = z.enum(["access", "person", "material", "knowledge", "decision"]);
var demand = z.object({
  kind: demandKind,
  text: z.string().min(1)
}).strict();
var actorRef = z.string().min(1);
var stepPerformers = z.array(actorRef).min(1);
var stepCadence = z.enum(["per_period"]);
var stepFanOut = z.object({
  /**
   * Steget som tar fram mängden. Måste ligga före det här steget i metoden —
   * en mängd som tas fram efteråt går aldrig att räkna fram.
   */
  produced_by: z.string().min(1),
  /** Vad mängden är, i klartext: "formaten annonsen ska finnas i". */
  over: z.string().min(1),
  /**
   * Antalet planeringen räknar med innan mängden är känd. Ett ärligt tal med
   * ett skäl, inte en etta: en etta gör att tio omgångar ser ut som en.
   */
  expected_parts: z.number().int().positive(),
  /**
   * Taket. Blir delarna fler än så är det en fråga till en människa, aldrig en
   * tyst omplanering. Saknas: inget tak, och planen räknar om med det verkliga
   * antalet och säger att marginalen ändrats.
   */
  max_parts: z.number().int().positive().optional(),
  /**
   * Steg med delar som görs i varv (Daniel P 2026-10-01: «det kanske saknas denna typ av steg, som
   * man liksom stannar upp vid och jobbar med iterativt»). Steget görs i flera
   * varv: delarna fylls på en efter en, i valfri ordning, var och en med sitt
   * läge (inte börjad · pågår · inne · räcker). Det som lämnas sparas som nya
   * versioner, aldrig över det gamla. Steget är klart när varje del räcker —
   * inget ja per del. Härleds i src/plan/workspace.ts.
   */
  iterative: z.boolean().optional(),
  /**
   * Värdet `produced_by` lämnar som är delarna, t.ex. `approved_tracks`: en
   * lista med delarnas namn, given när steget markeras klart
   * (`execute_step { mark: "done", values: { approved_tracks: [...] } }`).
   * Då blir mängden känd utan att någon skriver delarna en gång till.
   */
  parts_from: z.string().min(1).optional()
}).strict();
var awaitMode = z.enum([
  /** Alla omgångar. Standardfallet: leveransen gäller hela mängden. */
  "all",
  /** Ett minsta antal. `count` säger hur många. */
  "at_least",
  /** De som är klara hittills. Steget kan börja så snart en omgång är klar. */
  "ready"
]);
var stepAwait = z.object({
  /** Steget med omgångar. */
  step: z.string().min(1),
  mode: awaitMode,
  /** Minsta antal klara omgångar. Krävs av `at_least`, och bara av den. */
  count: z.number().int().positive().optional()
}).strict();
var outcomeEnding = z.enum(["continue", "other_path", "stop"]);
var stepOutcome = z.object({
  /** Utfallets id inom steget, på engelska: `approved`, `needs_change`, `rejected` (B-104). */
  id: z.string().regex(/^[a-z][a-z0-9_]*$/),
  /** Vad utfallet heter för den som avgör steget. Svenska. */
  label: z.string().min(1),
  /** Vad utfallet betyder — en mening, så att valet går att göra utan att gissa. */
  meaning: z.string().min(1),
  ending: outcomeEnding,
  /**
   * Steget utfallet leder till. Null bara vid `stop`: ett stopp leder
   * ingenstans, och allt annat måste leda någonstans.
   */
  leads_to: z.string().min(1).nullable(),
  /**
   * Taket för antalet varv när vägen går bakåt. Vid taket blir det en fråga
   * till en människa, aldrig ett varv till (B-106).
   */
  max_rounds: z.number().int().positive().optional()
}).strict();
var stepBranch = z.object({
  /** Steget som avgör grenen. Måste ha `outcomes` och komma tidigare i flödet. */
  decided_by: z.string().min(1),
  /** Utfallet på det steget som öppnar grenen. */
  outcome: z.string().min(1)
}).strict();
var step = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("step"),
  owner: z.string().min(1),
  operation: z.string().min(1),
  /** Bundna värden. Varje nyckel måste vara en parameter operationen deklarerar. */
  values: z.record(z.string()),
  lead_time: leadTime,
  /** Ansvarig person. Skilt från `owner`, som är modulen. */
  responsible: z.string().min(1),
  step_type: stepType,
  requirements: z.array(requirement).default([]),
  /**
   * Insatsen per person och del (B-076). Valfri och inte `default([])`: vyn
   * bär posten som den skrevs, så ett äldre steg saknar fältet även efter
   * tolkning. Läs alltid som `step.effort ?? []`.
   */
  effort: z.array(effortLine).optional(),
  /**
   * Människans egen tid i ett Claude- eller kodsteg (start och granskning),
   * Daniel P 2026-10-07. Det är den som räknas i belastningen; insatsraderna
   * och ledtiden säger hur länge steget tar. Saknas: 0,25 h för både Claude och kod (uppstarten).
   */
  attended_hours: z.number().min(0).max(100).optional(),
  demands: z.array(demand).optional(),
  cadence: stepCadence.optional(),
  /** Vem som gör jobbet (B-079). Saknas: den ansvarige. */
  /**
   * Går steget att dela i flera arbetspass (B-097)? Utelämnat härleds det:
   * ett steg som skickar, publicerar, tar bort eller kräver ett ja är ett
   * tillfälle, inte ett arbete som kan spridas över dagen. Se
   * `isDivisible` i src/plan/sessions.ts — regeln står där, en gång.
   */
  divisible: z.boolean().optional(),
  /**
   * Görs steget i samma pass som steget före (src/plan/sittings.ts)? Metodens
   * standard, ur detaljplaneringens «Gör till standard». Sant slår ihop, falskt
   * delar. Utelämnat: planen avgör själv.
   */
  same_sitting: z.boolean().optional(),
  performer: stepPerformers.optional(),
  /** Vem som måste säga ja för att steget ska vara klart (B-079). Saknas: ingen. */
  approver: actorRef.optional(),
  /**
   * Varför steget har ett ja (Daniel P 2026-10-01: ja bara vid verkliga
   * beslut; målbilden, docs/malbild-arbetssteg.md, regel 2). `leaves_house`:
   * når någon utanför Rotor. `money`: binder pengar eller avtal. `direction`:
   * väljer riktning som flera steg bygger på (vilka spår). `method`: ändrar
   * metoden. Kräver `approver`. Ligger på steget tills arbetssteget
   * (`work_step` på metodens stegreferens, etapp 3) finns; då lyfts det dit
   * som `approval.kind`.
   */
  approval_kind: z.enum(["leaves_house", "money", "direction", "method"]).optional(),
  /**
   * Vad som räcker för att arbetssteget är klart, i klartext och kontrollerbart
   * («så vet du att du är klar»). För ett steg med delar (`fan_out.iterative`)
   * gäller det varje del. Lyfts till `work_step.enough` i etapp 3.
   */
  enough: z.string().min(1).optional(),
  work_step: removedListField("work_step", "Arbetsstegen \xE4r m\xE5lmodellens moment."),
  /**
   * Steget gäller en mängd och görs en gång per del (B-106). Saknas: steget
   * görs en gång. Ledtiden och insatsen gäller då EN omgång — se `stepFanOut`.
   */
  fan_out: stepFanOut.optional(),
  /**
   * Vad steget väntar på hos ett steg med omgångar (B-106). Saknas: steget
   * väntar bara på kedjan, som förut.
   */
  awaits: z.array(stepAwait).optional(),
  /**
   * Utfallen steget kan sluta på (B-084, B-106). Saknas: steget slutar bara
   * på ett sätt — vidare. Högst fyra; blir det fler är det två beslut i rad
   * eller ett värde (docs/villkor.md). Fem till sju bara med ett uttryckligt
   * skäl i `outcomes_reason` (grinden: `step.outcome_count`). Sju sedan
   * supportärendets «Gör till projekt» (Daniel P 2026-10-07).
   */
  outcomes: z.array(stepOutcome).min(2).max(7).optional(),
  /**
   * Varför steget har fler än fyra utfall: varför de inte går att dela i två
   * beslut i rad. Krävs vid fem till sju utfall, och bara då.
   */
  outcomes_reason: z.string().min(1).optional().describe("sk\xE4let till fler \xE4n fyra utfall; kr\xE4vs vid fem till sju"),
  /** Grenen steget hör till (B-084). Saknas: steget hör till huvudflödet. */
  branch: stepBranch.optional(),
  needed_by: removedListField("needed_by", "Ordningen r\xE4knas bakl\xE4nges ur m\xE5let: ett moment v\xE4ntar bara p\xE5 det det l\xE4ser."),
  assume_approved: removedListField("assume_approved", "I m\xE5lmodellen l\xE5ser bara effekten p\xE5 kundens ja.")
}).strict();
var hardReason = z.union([z.enum(HARD_REASONS), z.literal(true)]);
var momentReadSpec = z.union([
  z.string().min(1),
  z.object({
    /** Delmålet (id eller tekniskt namn). Utelämnat: samma delmål. */
    milestone: z.string().min(1).optional(),
    moment: z.string().min(1),
    hard: hardReason.optional()
  }).strict()
]);
var milestoneReadSpec = z.object({
  milestone: z.string().min(1),
  draft: z.string().min(1).optional(),
  hard: hardReason.optional()
}).strict();
var momentSpec = z.object({
  /** Stegnodens id eller tekniska namn. */
  step: z.string().min(1),
  label: z.string().min(1).optional(),
  by: z.enum(ACTORS).optional(),
  /** Rollen i metoden (`method.roles`) som utför momentet. */
  by_role: z.string().min(1).optional(),
  /** Förval work. */
  kind: z.enum(MOMENT_KINDS).optional(),
  /** Förval internal. */
  effect: z.enum(EFFECTS).optional(),
  /** Typ-id för det momentet lämnar (kontraktet för en människa eller kunden). */
  leaves: z.string().min(1).optional(),
  /** En ja/nej-fråga som avgör om momentet är gjort. */
  check: z.string().min(1).optional(),
  mode: z.enum(MOMENT_MODES).optional(),
  /** Verktyget (view_tool: id, tekniskt namn eller verktygets id) när det inte ska väljas ur typ och läge. */
  tool: z.string().min(1).optional(),
  /** Bara för `kind: "wait"`: en datumparameter i metoden eller ett datum. */
  until: z.union([
    z.object({ param: z.string().min(1) }).strict(),
    z.object({ date: z.string().min(1) }).strict()
  ]).optional(),
  reads: z.array(momentReadSpec).optional(),
  /** Id:n i lagret som momentet behöver. */
  inputs: z.array(z.string().min(1)).optional()
}).strict();
var growthPatchSpec = z.object({
  add_milestones: z.array(z.string().min(1)).optional(),
  /** Delmålet (hänvisning) till momenten som läggs till, nycklade på id. */
  add_moments: z.record(z.record(momentSpec)).optional(),
  add_reads: z.array(z.object({ milestone: z.string().min(1), read: milestoneReadSpec }).strict()).optional(),
  remove_milestones: z.array(z.string().min(1)).optional(),
  /** Delmålet (hänvisning) till momentens id som tas bort. */
  remove_moments: z.record(z.array(z.string().min(1))).optional(),
  remove_reads: z.array(z.object({ milestone: z.string().min(1), read: milestoneReadSpec }).strict()).optional(),
  goal_needs: z.object({
    add: z.array(z.string().min(1)).optional(),
    remove: z.array(z.string().min(1)).optional()
  }).strict().optional(),
  clarity: z.literal("clear").optional(),
  goal_label: z.string().min(1).optional()
}).strict();
var libraryId = z.string().regex(/^[a-z][a-z0-9_]*$/);
var momentRecipe = z.object({
  needs: z.array(z.string().min(1)).min(1),
  how: z.array(z.string().min(1)).min(1),
  check: z.array(z.string().min(1)).min(1)
}).strict();
var momentCapability = z.object({
  surface: z.string().min(1).max(60),
  verb: z.enum(["reads", "creates", "updates", "deletes", "sends", "publishes"]),
  object: z.string().min(1).max(80)
}).strict();
var moleculeBindings = z.record(z.string().regex(/^[a-z][a-z0-9_]*\/[a-z][a-z0-9_]*$/), z.string().min(1));
var recipeKey = z.string().regex(/^[a-z][a-z0-9_]*\/[a-z][a-z0-9_]*$/);
var templateMoment = z.object({
  label: z.string().min(1),
  /** Verbet för momentets rubrik (runda D1), före objektet: «Samla källor om». */
  verb: z.string().min(1).max(60).optional(),
  by: z.union([z.enum(ACTORS), z.string().regex(/^\{[a-z][a-z0-9_]*\}$/)]).optional(),
  /** Rollslotten (id i mallens `roles`) som utför momentet. */
  by_role: libraryId.optional(),
  kind: z.enum(MOMENT_KINDS),
  effect: z.enum(EFFECTS).optional(),
  /** Typen momentet lämnar; får ha hållare (`{result}`). */
  leaves: z.string().min(1).optional(),
  check: z.string().min(1).optional(),
  mode: z.enum(MOMENT_MODES).optional(),
  reads: z.array(z.union([libraryId, z.object({ moment: libraryId, hard: z.literal(true).optional() }).strict()])).optional(),
  /** Bara för `kind: "wait"`: väntan är över på modellens datumparameter `<delmål>_date`. */
  until_date: z.literal(true).optional(),
  /** Bara för `kind: "wait"`: väntan är över så många dagar (mallens parameter) efter att delmålets hårda läsningar blev klara. */
  until_days: libraryId.optional(),
  /** Momentet finns bara när valet (id i mallens `options`) tas med. */
  option: libraryId.optional(),
  /** Momentet finns bara när rollslotten är bunden till en roll med den utföraren. */
  only_for: z.object({ role: libraryId, by: z.enum(ACTORS) }).strict().optional(),
  /** Momentet finns inte när kundens ja i delmålet står i beställningen (omgång 4: att skicka för godkännande behövs inte då). */
  only_without_order: z.literal(true).optional(),
  /** Receptet när en människa gör momentet (runda D3). */
  recipe: momentRecipe.optional(),
  /**
   * Standardmomentets mall, en post `moment_template` i registret (src/v2/domain/moment-standard.ts, Daniel P 2026-10-20: «en
   * central text som är på många»): syfte, följd, recept eller instruktion läses därifrån med momentets värden.
   * Momentet bär bara referensen, aldrig en kopia av texten.
   */
  standard: z.string().regex(STANDARD_KEY).optional(),
  /**
   * Förmågan momentet behöver när kod eller Claude gör det (etapp 2): ytan
   * (systemet, får vara en hållare som `{system}`), effektens verb och
   * objektet. Det sparade målet eller kundens sätt binder momentet till en
   * molekyl (`molecules`); utan bindning föreslår planeringen den närmaste
   * atomen att utöka eller ett ifyllt atomförslag ur det här.
   */
  capability: momentCapability.optional()
}).strict();
var milestoneTemplate = z.object({
  /** Tillstånden som förklaras här: varje tillstånd förklaras på exakt ett biblioteksdelmål. */
  states: z.record(libraryId, z.object({
    meaning: z.string().min(1),
    aliases: z.array(libraryId).optional(),
    not_in_goal: z.literal(true).optional(),
    /**
     * Resultatet är en beställning som kan stå för kundens ja i en ren kedja
     * (omgång 4): momentet vars resultat bär räkningen `when_zero` (öppna frågor), som ska vara 0.
     */
    customer_yes: z.object({ moment: libraryId, when_zero: libraryId }).strict().optional()
  }).strict()).optional(),
  leaves: z.array(libraryId).min(1),
  /** Verbet för delmålets rubrik (runda D1), före objektet: «Ta reda på». */
  verb: z.string().min(1).max(60).optional(),
  reads: z.array(z.object({ state: libraryId, hard: z.literal(true).optional(), otherwise: libraryId.optional() }).strict()).optional(),
  params: z.record(libraryId, z.object({
    label: z.string().min(1),
    type: z.enum(["text", "type_id", "actor", "list"]).optional(),
    default: z.string().optional(),
    /** Förvalet när en annan parameter är bunden (goal-library.ts, LibraryParam). */
    default_when: z.object({ param: libraryId, value: z.string().min(1) }).strict().optional()
  }).strict()).optional(),
  roles: z.record(libraryId, z.object({ label: z.string().min(1), default: libraryId.optional() }).strict()).optional(),
  options: z.record(libraryId, z.object({ label: z.string().min(1), covers: z.array(libraryId).optional() }).strict()).optional(),
  /** Sorterna av resultat delmålet täcker (RESULT_KINDS i src/plan/goal-library.ts). */
  covers: z.array(libraryId).min(1),
  /** Ett beslut: utfallen är listparametern `options`. */
  decision: z.literal(true).optional(),
  /** Ett delmål över alla punkter när objektet upprepas per punkt («godkänt i omgång»). */
  group: z.literal(true).optional(),
  /** Momentet som lämnar varje tillstånd (tillståndet till momentets id); utan post momentet vars leaves är tillståndet. */
  delivers: z.record(libraryId, libraryId).optional(),
  moments: z.record(libraryId, templateMoment)
}).strict();
var milestone = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("milestone"),
  /** Delmålets art: `decision` är ett beslut med `outcomes` och ett valmoment (`kind: "decide"`). Som `kind_of_work` på metoden. */
  kind_of_milestone: z.literal("decision").optional(),
  multi: z.boolean().optional(),
  outcomes: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9_]*$/),
    label: z.string().min(1).optional(),
    adds: growthPatchSpec.optional()
  }).strict()).optional(),
  goal_label: z.string().min(1).optional(),
  goal_label_for: z.record(z.string().min(1)).optional(),
  /** Listparametern (id i `method.params`) som delmålet upprepas för. */
  for_each: z.string().min(1).optional(),
  /** Momenten, nycklade på id. Ordning finns bara där ett moment läser ett annat. */
  moments: z.record(momentSpec).default({}),
  /** Det delmålet läser: förkortning för att varje moment läser det. */
  reads: z.array(milestoneReadSpec).optional(),
  /** Behövs bara om beslutet (delmål, hänvisning) fått utfallet, eller något av `outcomes` (omgång 4). */
  only_if: z.object({ decision: z.string().min(1), outcome: z.string().min(1), outcomes: z.array(z.string().min(1)).min(1).optional() }).strict().optional(),
  /** Dimma: antalet är okänt tills delmålet (hänvisning) är klart. */
  unknown_until: z.string().min(1).optional(),
  /** Biblioteksdelmålet: allmänt, med typade resultat. Har det en mall har det inga egna moment (`moments`). */
  template: milestoneTemplate.optional()
}).strict();
var bandEdits = z.object({
  rename: z.record(z.string().min(1), z.string().min(1).max(40)).optional(),
  move: z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), z.string().min(1).max(40)).optional()
}).strict();
var savedValue = z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]);
var resultShape = /^[a-z][a-z0-9_]*:([a-z][a-z0-9_]*)$/;
var bindObject = z.union([libraryId, z.literal("*")]);
var bindKey = z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)?$/);
var goalSpec = z.object({
  label: z.string().min(1),
  /** Delmålen (id eller tekniskt namn) som måste finnas för att målet är nått. */
  needs: z.array(z.string().min(1)).min(1).optional(),
  clarity: z.enum(GOAL_CLARITY).optional(),
  /** Delmålet som gör ett vagt mål klart (typiskt ett beslut). */
  clarified_by: z.string().min(1).optional(),
  /** Det sparade målet: resultaten när leveransen är klar. */
  results: z.array(z.union([
    z.string().regex(resultShape),
    z.object({
      result: z.string().regex(resultShape),
      /** Resultatet behövs bara om beslutet (ett av `decisions`) fått något av utfallen (omgång 4). */
      only_if: z.object({ decision: libraryId, outcomes: z.array(libraryId).min(1) }).strict().optional(),
      /** Målresultatet (id i `aims`) resultatet är ett kriterium för. */
      aim: libraryId.optional()
    }).catchall(savedValue)
  ])).optional(),
  /** Besluten som villkoren pekar på, med utfallens namn (omgång 4: namnen hör till leveranstypen). */
  decisions: z.record(libraryId, z.object({
    label: z.string().min(1),
    outcomes: z.record(libraryId, z.string().min(1))
  }).strict()).optional(),
  /**
   * Per objekt (eller `*` för alla): bindningar till objektets delmål (`label`
   * = objektet i ord, roller, `with` = valfria moment, `<mall>.<parameter>`
   * bara för den mallens delmål, `for_each` = listobjektet som delmålen
   * upprepas över, `level` = house eller customer för det som återanvänds).
   */
  bind: z.record(bindObject, z.record(bindKey, savedValue)).optional(),
  /** Per objekt: resultat hos andra objekt som objektet bygger på (mjuka; `hard` med skäl, `by` = mallens delmål). */
  reads: z.record(libraryId, z.array(z.union([
    z.string().regex(resultShape),
    z.object({ result: z.string().regex(resultShape), hard: z.literal(true).optional(), by: libraryId.optional() }).strict()
  ])).min(1)).optional(),
  /** Målresultaten (Daniel P 2026-10-11): det som ska vara sant, med avgörbara kriterier; resultaten pekar dit med `aim`. */
  aims: z.record(libraryId, z.object({
    label: z.string().min(1),
    criteria: z.array(z.string().min(1)).min(1),
    /** Bandets korta namn (runda D1); målresultat med samma namn delar band. */
    band: z.string().min(1).max(40).optional()
  }).strict()).optional(),
  /** Namnen på de gemensamma banden: det flera målresultat bygger på (`shared`) och utredningarna bland det (`research`). */
  band_names: z.object({ shared: z.string().min(1).max(40).optional(), research: z.string().min(1).max(40).optional() }).strict().optional(),
  /** Dagens material som räknas som målets resultat: typen (fil, text, operationens produces, molekylens asset_type) till `<tillstånd>:<objekt>` eller `<tillstånd>:*`. */
  material: z.record(z.string().min(1), z.string().regex(/^[a-z][a-z0-9_]*:([a-z][a-z0-9_]*|\*)$/)).optional(),
  /** Recept per moment i målet (runda D3): `<objekt>/<moment>` till receptet; går före bibliotekets. */
  recipes: z.record(recipeKey, momentRecipe).optional(),
  /** Molekylerna per moment (etapp 2): `<objekt>/<moment>` till molekylen eller atomförslaget som gör det. */
  molecules: moleculeBindings.optional()
}).strict().refine((g) => (g.needs?.length ?? 0) > 0 || (g.results?.length ?? 0) > 0 || g.clarity === "vague", {
  message: "m\xE5let beh\xF6ver needs (delm\xE5len), results (det sparade m\xE5let) eller clarity: vague"
});
var goalRoles = z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), z.object({ label: z.string().min(1) }).strict());
var goalParams = z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), z.object({ label: z.string().min(1), type: z.enum(PARAM_TYPES) }).strict());
var inventoryItem = z.object({
  id: z.string().min(1),
  present: z.boolean(),
  soft: z.boolean().optional(),
  satisfies: z.string().min(1).optional()
}).strict();
var viewTool = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("view_tool"),
  handles: z.object({
    /** Exakta typ-id:n, ett prefix som slutar på `.*`, ett efterled som börjar på `*_`, eller `*` för vad som helst. */
    types: z.array(z.string().min(1)).min(1),
    modes: z.array(z.enum(TOOL_MODES)).min(1),
    actors: z.array(z.enum(ACTORS)).min(1).optional()
  }).strict(),
  component: z.string().min(1),
  extends: z.string().min(1).optional(),
  because: z.string().min(1).optional()
}).strict();
var method = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("method"),
  owner: z.string().min(1),
  delivers: z.string().min(1),
  /**
   * Art (Daniel P 2026-09-29). `delivery` (förvalet): något som beställts eller
   * avtalats, med datum mot kunden, som räknas mot avtalet och faktureras.
   * `ongoing`: löpande arbete som ingen beställer (veckomöten, uppföljning,
   * bevakning): rytm, ansvarig och tid, inget kunddatum, räknas inte mot
   * avtalet. Löpande arbete kopplas till kunden med en rytm
   * (src/plan/ongoing.ts), aldrig till en avtalsrad.
   * `internal` (Daniel P 2026-09-29): arbete för en kund som ingen beställt och
   * inget datum lovats för, som kundavstämning. Bara ett internt mål, aldrig ett
   * kunddatum; räknas aldrig sen mot kund; klar när stegen är gjorda.
   */
  kind_of_work: z.enum(["delivery", "ongoing", "internal"]).optional(),
  /**
   * Stegföljden (listmetoden). Tom för en metod med `milestones`: grinden
   * avvisar båda på samma metod (`goal.method_shape`). Fältet tas bort i
   * etapp 3 när ingen metod använder det (docs/plan-malstyrd.md). Läs som
   * `method.steps ?? []` i en vy: posten lagras som den skrevs.
   */
  steps: z.array(z.string()).default([]),
  /**
   * Målmodellens delmål (docs/plan-malstyrd.md, etapp 1a): delmålsnoderna
   * (id eller tekniskt namn) som metoden planeras med, baklänges från
   * leveranstypens `goal`. Ordningen i listan betyder ingenting; den enda
   * ordningen är delmålens och momentens `reads`.
   */
  milestones: z.array(z.string().min(1)).optional(),
  /**
   * De sparade valen (Daniel P 2026-10-10: en metod är ett sparat mål och
   * sparade val): resultatet (`<tillstånd>:<objekt>`, eller `<tillstånd>:*`
   * för varje objekt utan eget val) till biblioteksdelmålet (delmålsnodens id
   * eller tekniska namn) som lämnar det, där flera kan. Med dem och utan `milestones` räknas
   * modellen baklänges ur leveranstypens sparade mål (`goalModelOf`);
   * `milestones` vinner när båda finns.
   */
  goal_choices: z.record(z.string().regex(/^[a-z][a-z0-9_]*:([a-z][a-z0-9_]*|\*)$/), z.string().min(1)).optional(),
  /**
   * Metoden går i pension (docs/plan-malstyrd.md, «Pension, sammanlagt 24
   * metoder»): den finns kvar och pågående uppgifter följer den, men den
   * föreslås inte i vägledningen, sökningen eller metodvalet när leveranstypen
   * har en annan metod. Själva pensionen görs i etapp 3, efter ja.
   */
  retiring: z.literal(true).optional(),
  /** Roller i målmodellen (`by_role`, `{role:<id>}`), utan namn: kundens sätt binder dem. */
  roles: goalRoles.optional(),
  /** Parametrar i målmodellen (`for_each`, `until`, `{param:<id>}`), utan värden: kundens sätt sätter dem. */
  params: goalParams.optional(),
  completion: z.string().min(1),
  leaves_behind: z.string().optional(),
  handover: removedListField("handover", "V\xE5rt datum g\xE4ller m\xE5lets slutresultat; det kunden g\xF6r efter \xE4r egna moment."),
  after: removedListField("after", "Ordningen r\xE4knas bakl\xE4nges ur m\xE5let: ett moment v\xE4ntar bara p\xE5 det det l\xE4ser."),
  /**
   * Nytt arbete på metoden går genom projektstarten (docs/plan-projektstart.md,
   * etapp 15–16, Daniel P 2026-10-07): en ny beställning eller ett nytt uppdrag
   * på metoden avvisas utan ett projektutkast med godkänd genomgång. Sätts på
   * metoder med flera delar, flera personer eller en kundleverans över ca 4 h;
   * support och små återkommande metoder har den inte och går som förut.
   * Gäller grundmetoden; kundens variant ärver den.
   */
  requires_project_start: z.boolean().optional(),
  /**
   * Bufferten före ett ankare i utjämningen (src/plan/goal-level.ts), i
   * arbetsdagar (kartans kvar, Daniel P 2026-10-13: «bufferten inställbar per
   * metod och kund»). Utelämnat: 20 % av fönstret, minst en dag. Kundens sätt
   * går före metoden, och uppgiftens egen `margin_days` före båda.
   */
  buffer_days: z.number().int().min(0).max(60).optional()
}).strict();
var variantAddition = z.object({
  step: z.string().min(1),
  after: z.string().min(1).nullable()
}).strict();
var variantReplacement = z.object({
  step: z.string().min(1),
  with: z.string().min(1)
}).strict();
var variantRule = z.object({
  text: z.string().min(1).max(600),
  fields: z.array(z.string().min(1)).optional()
}).strict();
var variantRequirement = z.object({
  step: z.string().min(1),
  requirement
}).strict();
var methodVariant = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("method_variant"),
  /**
   * Kunden varianten gäller (part-id). Planeraren väljer bara en kunds egna
   * varianter — en annan kunds variant väljs aldrig.
   */
  customer: z.string().min(1),
  /**
   * Beställningarna sättet gäller när kunden har flera sätt av samma metod
   * (Daniel P 2026-10-13): leveranstyper (id, tekniskt namn eller namn) eller
   * ord i beställningen, t.ex. «annonsrapport» eller «lagerrapport».
   * Går det inte att avgöra frågar planeringen (src/registry/way-choice.ts).
   */
  for_orders: z.array(z.string().min(1)).optional(),
  /** Grundmetodens id. */
  base: z.string().min(1),
  /** Den version av grundmetoden varianten bygger på. */
  base_version: z.number().int().positive(),
  /** Bundna värden per steg; slås ihop med stegets egna, variantens vinner. */
  values: z.record(z.record(z.string())).default({}),
  /** Ansvarig per steg; ersätter stegets. */
  responsible: z.record(z.string().min(1)).default({}),
  /** Utförare per steg; ersätter stegets (B-079). */
  performer: z.record(stepPerformers).optional(),
  /** Godkännare per steg; ersätter stegets (B-079). */
  approver: z.record(actorRef).optional(),
  /**
   * Kundens instruktion per steg; ersätter molekylens (B-114).
   *
   * Molekylen bär husets sätt — vad steget är, svarsformen, det som aldrig
   * får göras oavsett kund. Kunden bär sitt: vinkeln, listorna, tonläget,
   * det just den kunden inte vill se. Utan det här fältet fanns bara två
   * utvägar, och båda var dåliga: en instruktion så allmän att den inte
   * styr någon, eller en kopia av hela molekylen per kund för att ändra en
   * text — och då är det inte längre samma steg som utförs.
   *
   * ERSÄTTER, som `responsible` och `performer` redan gör. En hopslagning
   * fält för fält skulle göra det omöjligt att läsa en instruktion och veta
   * vad modellen faktiskt får: svaret skulle ligga i två filer och en
   * sammanslagningsregel.
   */
  instruktion: z.record(instruktion).optional(),
  /**
   * Kundens tillägg till stegets prompt (Daniel P 2026-10-05: «metoden är
   * generell; kundspecifik metod innehåller det som är specifikt för
   * kunden»). Bara tillägget, aldrig en kopia av hela prompten: Claude får
   * metodens prompt och under den «Tillägg för <kund>:» med den här texten.
   * Platshållarna fylls i som i prompten.
   */
  prompt_addition: z.record(z.string().min(1).max(4e3)).optional(),
  /**
   * Kundens tillägg till stegets instruktion, som står på egen hand (vyprov
   * runda 23): bara de delar kunden har, även när metoden saknar instruktion
   * för steget. Listor läggs till metodens; syfte och svarets form ersätter.
   * `instruktion` ovan ersätter en hel instruktion och kräver alla delar.
   */
  instruction_addition: z.record(z.object({
    purpose: z.string().min(1).optional(),
    read_first: z.array(z.string().min(1)).optional(),
    how_to: z.array(z.string().min(1)).optional(),
    must_not: z.array(z.string().min(1)).optional(),
    answer_format: z.string().min(1).optional(),
    ask_when: z.array(z.string().min(1)).optional()
  }).strict()).optional(),
  /**
   * Kundens regler som inte hör till ett enda steg (blindprov 5): utan
   * `fields` gäller regeln hela kundflödet, med `fields` varje steg som
   * lämnar eller läser fälten (t.ex. bildrubrik och bildunderrubrik). Regeln
   * visas i stegets lägesbild och prövas när innehållet sparas (varning).
   */
  rules: z.array(variantRule).optional(),
  add: z.array(variantAddition).default([]),
  remove: z.array(z.string().min(1)).default([]),
  replace: z.array(variantReplacement).default([]),
  requirements: z.array(variantRequirement).default([]),
  /*
   * Kundens sätt i målmodellen (docs/plan-malstyrd.md, etapp 1a). En variant
   * vars grund har `milestones` använder bara de här fälten, `prompt_addition`,
   * `instruktion` och `rules` (grinden: `goal.variant`); stegfälten ovan tas
   * bort i etapp 3. En variant vars grund är ett sparat mål har dem också
   * (runda D3), bredvid `goal_bind`; `params` är då kundens värden, som når
   * de steg vars operation har parametern.
   */
  /** Roll till person: `<part>` eller `<part>/<person>`; för ett `for_each`-delmål får det vara en per punkt. */
  roles: z.record(z.union([z.string().min(1), z.record(z.string().min(1))])).optional(),
  /** Parametrarnas värden (metodens `params`). */
  params: z.record(z.unknown()).optional(),
  /** Det som alltid finns hos kunden, i alla uppdrag. */
  customer_inventory: z.array(inventoryItem).optional(),
  /** Kundens verktyg: typ-id (eller prefix som `image.*`) till verktyget (view_tool). */
  tools: z.record(z.string().min(1)).optional(),
  /**
   * Hur kunden får material att ta ställning till (del H3b, src/plan/present-as.ts):
   * presentationssida (husets förval), PDF eller annat sätt. Ett val per moment eller
   * delmål i uppdraget går före.
   */
  present_as: z.enum(PRESENT_FORMATS).optional(),
  /** Kundens tillväxt: delmål och moment som läggs till eller tas bort. */
  growth: growthPatchSpec.optional(),
  /**
   * Kundens sätt för en metod med sparat mål (omgång 4): bindningar per objekt
   * ovanpå leveranstypens (`goal.bind`), t.ex. valfria moment (`with`) och
   * deras parametrar. Kundens värden vinner; `with` slås ihop.
   */
  goal_bind: z.record(bindObject, z.record(bindKey, savedValue)).optional(),
  /**
   * Bufferten före ett ankare i utjämningen (src/plan/goal-level.ts), i
   * arbetsdagar (kartans kvar, Daniel P 2026-10-13: «bufferten inställbar per
   * metod och kund»). Utelämnat: 20 % av fönstret, minst en dag. Kundens sätt
   * går före metoden, och uppgiftens egen `margin_days` före båda.
   */
  buffer_days: z.number().int().min(0).max(60).optional(),
  /**
   * Kundens översättning av material till det sparade målets resultat (omgång
   * 6), ovanpå leveranstypens `goal.material`: en typ, eller `<typ>#<del>` för
   * en del av ett steg (ett spår i kundens research), till `<tillstånd>:<objekt>`.
   */
  goal_material: z.record(z.string().min(1), z.string().regex(/^[a-z][a-z0-9_]*:([a-z][a-z0-9_]*|\*)$/)).optional(),
  /** Kundens recept per moment (runda D3): `<objekt>/<moment>` till receptet; går före målets och bibliotekets. */
  goal_recipes: z.record(recipeKey, momentRecipe).optional(),
  /** Kundens molekyler per moment (etapp 2): `<objekt>/<moment>` till molekylen för kundens system; går före målets. */
  goal_molecules: moleculeBindings.optional(),
  /** Kundens band (runda D1): byt namn på ett band (bandets id eller namn) eller flytta ett delmål till ett band. */
  goal_bands: bandEdits.optional()
}).strict();
var authority = z.enum(["own", "mirror"]);
var assetForm = z.enum(["file", "answer", "either"]);
var assetGrouping = z.enum(["unit", "part", "none"]);
var assetVariantBy = z.enum(["ratio"]);
var assetWorksAs = z.enum(["image", "image_prompt", "text", "preview", "approval", "send"]);
var asset = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("asset"),
  authority,
  /**
   * Obligatorisk med standard (B-094): en typ som inte säger något får
   * `either`, vilket är det svagaste påståendet — båda vägarna erbjuds.
   * Grinden släpper bara igenom de tre värdena.
   */
  form: assetForm.default("either"),
  /**
   * Svarsalternativen för typen (B-094), när den alltid besvaras med ett av
   * ett bestämt antal svar. Kravet kan ange egna; då gäller kravets.
   */
  options: z.array(z.string().min(1)).min(2).optional(),
  /** Alternativet vi rekommenderar. Måste finnas i `options`. */
  recommended: z.string().min(1).optional(),
  /** Vilket system som äger sanningen. Obligatoriskt för speglar. */
  system_of_record: z.string().optional(),
  retention: z.string().optional(),
  /** Hur typen grupperas i materialet. Regeln `asset.grouping` prövar fälten tillsammans. */
  grouping: assetGrouping.optional(),
  /** Delens namn i materialet: «Text», «Bild», «PDF», «Tryckfil». Krävs för `unit` och `part`. */
  part_label: z.string().min(1).optional(),
  /** Delarna finns i varianter som alla ska finnas (bildformaten). Saknas: en del räcker. */
  variant_by: assetVariantBy.optional(),
  /**
   * Innehållsslagen (`kind` i content_save) som är typen. Ett innehåll av
   * slaget grupperas som typen; en typ med slag är en text.
   */
  content_kinds: z.array(z.string().min(1)).min(1).optional(),
  /** Hur en människa arbetar med typen: väljer verktyget i steget (se `assetWorksAs`). */
  works_as: assetWorksAs.optional()
}).strict();
var sourceRoute = z.object({
  ...nodeHead,
  kind: z.literal("source_route"),
  asset_type: z.string().min(1),
  channel: z.string().min(1),
  party: z.string().optional(),
  expected: acquisition,
  /** Falskt betyder att referensen dör — filen måste hämtas in vid mottagande. */
  persistent: z.boolean()
}).strict();
var partyRole = z.enum(["customer", "supplier", "internal", "prospect", "superadmin"]);
var PERSON_ID = /^[a-z][a-z0-9_]*$/;
var person = z.object({
  id: z.string().regex(PERSON_ID),
  name: z.string().min(1),
  /** Vad personen är hos parten, i klartext: "VD", "marknadsansvarig". */
  role: z.string().min(1),
  contact: z.string().min(1).optional()
}).strict();
var overviewFilter = z.object({
  cust: z.array(z.string().min(1)).max(50).optional(),
  owner: z.array(z.string().min(1)).max(50).optional(),
  status: z.array(z.enum(["todo", "doing", "customer", "ready"])).max(4).optional(),
  type: z.array(z.enum(["project", "recurring", "stream", "once"])).max(4).optional(),
  late: z.boolean().optional(),
  mine: z.boolean().optional(),
  /** Tidsfiltret (Daniel P 2026-10-07): vilket tidsval, efter vilket datum (leveransdatum när `by` saknas), och den egna periodens dagar. */
  when: z.enum(["late", "this_week", "next_week", "this_month", "next_30", "no_date", "range"]).optional(),
  by: z.enum(["due", "next"]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).strict();
var overviewGroup = z.enum(["none", "cust", "owner", "week", "type"]);
var overviewView = z.object({
  filter: overviewFilter,
  group: overviewGroup.default("none"),
  /** En sparad vy är filtret och, när den valts, grupperingen. */
  saved: z.array(z.object({ name: z.string().trim().min(1).max(40), filter: overviewFilter, group: overviewGroup.optional() }).strict()).max(5).default([])
}).strict();
var party = z.object({
  ...nodeHead,
  kind: z.literal("party"),
  label: z.string().min(1),
  roles: z.array(partyRole).min(1),
  contact: z.string().min(1),
  /** Vägar som uttryckligen inte får användas. `info@` är obevakad. */
  prohibitions: z.array(z.string()).default([]),
  lead_time: leadTime.optional(),
  /**
   * Personerna hos parten. Äldre poster har bara namn som strängar; de läses
   * som personer med ett id ur namnet (`peopleOf` i src/registry/people.ts).
   * Datan skrivs inte om.
   */
  people: z.array(z.union([z.string(), person])).default([]),
  /** Personen (id i `people`) som godkänner när ett steg kräver kundens ja. */
  default_approver: z.string().min(1).optional(),
  /** Behörighetsgrupper parten tillhör. Endast meningsfullt för roll `internal`. */
  member_of: z.array(z.string()).default([]),
  /** Timmar per vecka personen har för projekten. Utan den räknas antal steg. */
  capacity_hours_per_week: z.number().min(0).optional(),
  /**
   * Kundens färg i vyerna (B-098), som `#rrggbb`. Ett medvetet val hör hemma
   * här, inte i koden: en tabell kund → färg i en vy är kunddata och blir en
   * kodändring för varje ny kund. Utan fältet härleds en stabil ton ur partens
   * id (`src/registry/colors.ts`).
   *
   * Formatet prövas av regeln `party.color`, inte av schemat, så att felet blir
   * åtgärdbart i stället för "string did not match pattern".
   */
  color: z.string().min(1).optional(),
  /**
   * Kundens profil i presentationer (2026-10-07, src/present/theme.ts):
   * accentfärgen som `#rrggbb`, en ljus ton av den (räknas fram om den
   * saknas) och logon som bankreferens (`bank://…`), ljus och mörk. Värdena
   * sätts i registret, aldrig i koden. Dirigentens typsnitt och grund gäller
   * alltid; kundens färg är bara accent.
   */
  brand: z.object({
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accent_soft: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    logo: z.string().regex(/^bank:\/\//).optional(),
    logo_dark: z.string().regex(/^bank:\/\//).optional()
  }).strict().optional(),
  /**
   * Kundens typsnitt (Daniel P 2026-10-08: «den ska veta om var man hittar
   * gällande typsnitt»), ett ställe för alla som renderar åt kunden: annonser,
   * SoMe-bilder och mallar. `stylesheets` är webbprojektens stilmallar
   * (Adobe Fonts/Typekit, Google Fonts), `families` säger vilken familj och
   * vikt i webbprojektet ett namn i mallen (PostScript-namnet) motsvarar, och
   * `sample` är typsnittsprovet som visar att rätt snitt laddats. En
   * metodvariants egna värden går före (src/content/customer-fonts.ts).
   * Presentationerna har dirigentens typsnitt; det här gäller kundens material.
   */
  fonts: z.object({
    stylesheets: z.array(z.string().url()).optional(),
    families: z.record(z.string().min(1), z.object({
      family: z.string().min(1),
      weight: z.number().int().min(1).max(1e3).optional(),
      style: z.enum(["normal", "italic"]).optional()
    }).strict()).optional(),
    sample: z.object({
      text: z.string().min(1),
      references: z.array(z.object({
        family: z.string().min(1),
        weight: z.number().int(),
        width: z.number().positive(),
        name: z.string().min(1)
      }).strict()).min(1),
      tolerance: z.number().positive().max(1).optional()
    }).strict().optional()
  }).strict().optional(),
  /**
   * Kundens designregler (Daniel P 2026-10-09: «Framför allt vill jag ha en bra
   * struktur för hur designregler läggs upp för respektive kund»), lika för
   * alla kunder och alla delar valfria. De gäller allt som görs åt kunden —
   * SoMe, annonser, mejl, tryck — och bor därför här, inte i en metodvariant.
   * Varje regel är en mening och varifrån den kom (`source`). Guiden «Visuell
   * produktion» med kunden visar dem (src/content/design-rules.ts).
   */
  design: z.object({
    colors: z.array(z.object({
      name: z.string().min(1),
      hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      /** Exakt CMYK i tryck (0–100): tryck-PDF:en ger färgen just de värdena i stället för profilens omräkning. */
      cmyk: z.tuple([z.number().min(0).max(100), z.number().min(0).max(100), z.number().min(0).max(100), z.number().min(0).max(100)]).optional(),
      role: z.enum(["carrier", "complement", "accent", "text", "background", "other"]),
      use: z.string().min(1).max(400).optional(),
      source: z.string().min(1).optional()
    }).strict()).optional(),
    type_levels: z.array(z.object({
      level: z.string().min(1),
      family: z.string().min(1),
      weight: z.number().int().min(1).max(1e3).optional(),
      style: z.enum(["normal", "italic"]).optional(),
      uppercase: z.boolean().optional(),
      use: z.string().min(1).max(400).optional(),
      source: z.string().min(1).optional()
    }).strict()).optional(),
    logo: z.object({
      files: z.array(z.object({ name: z.string().min(1), variant: z.string().min(1), use: z.string().min(1).max(400).optional() }).strict()).optional(),
      rules: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional()
    }).strict().optional(),
    symbols: z.array(z.object({
      name: z.string().min(1),
      file: z.string().min(1).optional(),
      rules: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).min(1)
    }).strict()).optional(),
    references: z.array(z.object({
      name: z.string().min(1),
      folder: z.string().min(1).optional(),
      what: z.string().min(1).max(400)
    }).strict()).optional(),
    images: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional(),
    details: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional(),
    words: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional(),
    platforms: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional(),
    never: z.array(z.object({ text: z.string().min(1).max(400), source: z.string().min(1).optional() }).strict()).optional()
  }).strict().optional(),
  /** Frånvaro, båda datumen inräknade. En frånvarodag ger noll kapacitet. */
  absence: z.array(z.object({ from: z.string().min(1), to: z.string().min(1) }).strict()).optional(),
  /**
   * Kalenderinställningar (B-096). Filtret bor i REGISTRET, inte i koden: vilka
   * kalendrar som räknas som arbetstid är ett omdöme per person, och det ska
   * gå att ändra utan en kodändring.
   *
   * `calendars`: kalender-id som räknas. Utelämnat betyder alla personens
   * delade kalendrar. Tom lista betyder ingen — kalendern räknas inte alls.
   * `skip_word`: ett ord i händelsens rubrik som betyder "räkna inte". Ordet
   * jämförs i atomen; rubriken lagras aldrig och lämnar aldrig atomen.
   *
   * Fältet kan utökas senare — skrivning till kalendern finns inte och byggs
   * inte nu.
   */
  calendar: z.object({
    calendars: z.array(z.string().min(1)).optional(),
    skip_word: z.string().min(1).optional(),
    /**
     * Googles färg-id på enskilda händelser som betyder "räkna inte" (B-100).
     * En färg är det enklaste en människa kan sätta i sin kalender utan att
     * skriva något. Färgen jämförs i atomen och lämnar den aldrig.
     */
    skip_colors: z.array(z.string().regex(/^\d{1,2}$/)).optional(),
    /**
     * Ska bara det man tackat ja till räknas? Utelämnat betyder ja — en
     * obesvarad inbjudan är ingen bokad tid.
     */
    only_accepted: z.boolean().optional(),
    /**
     * Ska tid personen märkt PRIVAT i sin kalender räknas som arbetstid
     * (B-096)? Utelämnat betyder nej: privatmärkningen är personens eget sätt
     * att säga "det här är min tid", och den ska inte äta av planens
     * kapacitet. Mötet syns ändå i personens EGEN vy, med rubrik — synlighet
     * och belastning är två frågor.
     */
    private_counts: z.boolean().optional(),
    /**
     * Att LÄGGA IN arbetspass i personens kalender (B-101).
     *
     * Syskon till läsinställningarna ovan, och avsiktligt ett eget fält: att
     * läsa upptagen tid och att skriva in pass är två olika ja, precis som
     * `mail.send` är ett eget ja vid sidan av att läsa posten. Saknat fält
     * betyder NEJ — skrivning sker aldrig för någon som inte slagit på den.
     *
     * `calendar_id`: kalendern passen läggs i. Utelämnat betyder personens egen
     * primära. Aldrig någon annans: tokenen är personens egen, och `primary`
     * kan bara betyda personens egen.
     */
    write: z.object({
      enabled: z.boolean(),
      calendar_id: z.string().min(1).optional()
    }).strict().optional(),
    /**
     * Läs upptaget via en annan persons koppling (Daniel P 2026-10-07).
     *
     * För den som inte kopplat sin egen kalender: `party` är personen vars
     * Google-koppling används, `calendar` kalender-id:t (oftast personens
     * e-post, en kalender som delats med `party`). Bara freeBusy: antal
     * upptagna timmar per dag, aldrig rubriker, deltagare eller innehåll.
     *
     * Personens egen koppling går före när den finns. `off`: personen har
     * själv stängt av läsningen (Inställningar → Arbetstid), och det går före
     * inställningen.
     */
    via: z.object({
      party: z.string().min(1),
      calendar: z.string().min(1),
      off: z.literal(true).optional()
    }).strict().optional()
  }).strict().optional(),
  /**
   * Vyns gruppering (B-110). Förvalet är område, leveranstyp och kund; en
   * person kan välja en annan ordning — kund först när man jobbar med en kund,
   * ansvarig när man fördelar, brådska när man ska beta av.
   *
   * Valet bor på PERSONEN och inte i webbläsaren: det ska följa med mellan
   * maskiner, och två personer ska kunna se olika utan att röra varandras vy.
   * Det gäller alla listor samtidigt — en vy där inkommande grupperas på ett
   * sätt och dagens arbete på ett annat är två vyer.
   */
  view: z.object({
    grouping: z.enum(["area", "customer", "responsible", "urgency"]),
    /**
     * Låt Claude bedöma ny post av sig själv (B-142).
     *
     * Bedömningen blir ett FÖRSLAG, aldrig en skrivning: ett ärende som
     * satts upp utan att någon sett det är ett ärende ingen kan lita på.
     * Vinsten är att förslagen redan står där när man öppnar sidan, i
     * stället för att man ska trycka på en knapp och vänta.
     *
     * Utelämnad betyder av. Den som inte valt ska inte få en modell som
     * läser posten utan att ha sagt ja till det.
     */
    auto_triage: z.boolean().optional()
  }).strict().optional(),
  /**
   * Personens egen vyadress (Daniel P 2026-09-29): adressen till den kopia av
   * dirigentvyn som personen lagt ut i Claude-appen. En artefakt når
   * kopplingarna bara för sin ägare, så adressen är personlig. Vyn sparar den
   * själv när kopian läggs ut; saknas den länkas serverns egen sida.
   */
  views_url: z.string().url().optional(),
  /**
   * Översiktens val (ordning, del 3 — Daniel P 2026-10-07): filtret, grupperingen
   * och högst fem sparade vyer. Bor på personen, inte i webbläsaren, så att valen
   * följer med mellan datorer. Delas inte (svar 8).
   */
  overview_view: overviewView.optional(),
  /**
   * Vem som får ta över personens steg (Daniel P 2026-10-05: «det kanske kan
   * vara en setting att tillåta att andra tar över ens uppgifter, eller
   * vilka»). `all`: alla hos oss. `listed`: bara `people`. `none`: ingen — den
   * som vill ta över skickar en överlämningsförfrågan som personen svarar på.
   * Utelämnad betyder `all`. Personen ställer den själv i Inställningar.
   */
  take_over: z.object({
    allow: z.enum(["all", "listed", "none"]),
    people: z.array(z.string().min(1)).default([])
  }).strict().optional(),
  /**
   * Arbetsdagen (B-100). Kalenderberäkningen behöver den: ett kvällsmöte
   * stjäl ingen tid planen ändå inte har, och en heldagsmarkering är en
   * arbetsdag — inte ett dygn. Utelämnad betyder 08–18 i Europe/Stockholm.
   */
  workday: z.object({
    from: z.number().min(0).max(24),
    to: z.number().min(0).max(24),
    timezone: z.string().min(1)
  }).strict().optional(),
  /**
   * Personens tid för dirigentens arbete (Daniel P 2026-09-28), ställd på
   * inställningssidan bredvid arbetsdagen. Kapaciteten per dag räknas i
   * src/plan/capacity.ts: (arbetsdagen − lunch och pauser − möten − annat
   * arbete) × andelen som får planeras. Utelämnat fält: förvalet (60 minuter,
   * 0 timmar, 0,8), och kapaciteten är gissad.
   */
  planning: z.object({
    /** Lunch och pauser per dag, i minuter. */
    breaks_minutes: z.number().min(0).max(600).optional(),
    /** Fast tid för annat arbete, i timmar per vecka. Dras av före dirigentens arbete. */
    other_hours_per_week: z.number().min(0).max(100).optional(),
    /**
     * Hur stor del av den tid som blir kvar som får planeras, 0,1–1. Över 0,8
     * bara med `share_deliberate` (Daniel P 2026-09-28: "man ska kunna fylla
     * på mer än 80% men det är ett medvetet val i så fall"); grinden prövar det.
     */
    plannable_share: z.number().min(0.1).max(1).optional(),
    /** Personen har valt att planera mer än 80 % av dagen, medvetet. */
    share_deliberate: z.literal(true).optional(),
    /**
     * Tryck på under en period (Daniel P 2026-09-28: "man ska kunna trycka på
     * ibland också - även om default är 80 kanske"): en högre andel från–till,
     * båda dagarna inräknade, med skäl. Ett medvetet val som gäller bara under
     * perioden; efteråt gäller andelen ovan, eller förvalet, av sig själv.
     */
    pushes: z.array(z.object({
      from: z.string().min(1),
      to: z.string().min(1),
      share: z.number().min(0.1).max(1),
      reason: z.string().min(1)
    }).strict()).optional()
  }).strict().optional(),
  /**
   * Mejlinställningar (B-101). Eget fält, med flit skilt från `calendar` och
   * från allt annat som senare kan hamna på parten: vilka Gmail-etiketter som
   * blir ärenden är ett omdöme per person, och det ska gå att ändra — och att
   * läsa — utan att röra något annat på parten.
   *
   * `labels`: etiketterna som blir ärenden. Utelämnat eller tomt betyder allt
   * utom det interna, alltså den befintliga `inflowQuery`-logiken. Ett förval
   * som sorterar bort vore ett tyst beslut ingen fattat.
   * `never_labels`: etiketterna som ALDRIG tas in. Väger tyngst.
   *
   * Etikettnamnen blir en del av en Gmail-sökfråga. Formen prövas i
   * `src/intake/mail-labels.ts`, där frågan byggs, så att felet blir
   * åtgärdbart där det uppstår.
   */
  mail: z.object({
    labels: z.array(z.string().min(1)).optional(),
    never_labels: z.array(z.string().min(1)).optional(),
    /**
     * Utskick från personens EGEN adress (B-101, B-100).
     *
     * AVSTÄNGT TILLS PERSONEN SLÅR PÅ DET. Fältet saknas för den som inte tagit
     * ställning, och saknat betyder nej — inte "inte bestämt än, så vi provar".
     * Att skicka post i någons namn är det mest ingripande dirigenten kan göra,
     * och det får bara följa av ett uttryckligt ja.
     *
     * `from` är adressen posten skickas från när den skiljer sig från partens
     * `contact` — ett alias. Utelämnat: partens kontaktadress.
     *
     * Medgivandet hos Google (scopet `gmail.send`) är en annan sak och räcker
     * inte: Google vet inte vad dirigenten får göra, bara vad den KAN. Gränsen
     * ligger här.
     */
    send: z.object({
      enabled: z.boolean(),
      from: z.string().regex(EMAIL_ADDRESS).optional()
    }).strict().optional(),
    /**
     * Utkast i personens EGEN Gmail, med bilagor (scopet `gmail.compose`).
     * Eget ja vid sidan av `send`; saknat betyder nej. Ett utkast går inte ut
     * förrän personen själv trycker skicka i Gmail.
     */
    draft: z.object({
      enabled: z.boolean()
    }).strict().optional()
  }).strict().optional(),
  /**
   * The customer's asset configuration for the image picker (image picker
   * plan E1): which image sources the customer has, as data, never code.
   * Upload and dirigenten's own bank need no declaration — they are always
   * there. `sources` lists the rest ("hubspot", "unsplash", "adobe_stock");
   * `adobe_stock_allowed` must also be true before a stock licence may be
   * used for the customer, because a licence cannot be undone.
   */
  assets: z.object({
    image_sources: z.array(z.enum(["hubspot", "unsplash", "adobe_stock"])).optional(),
    adobe_stock_allowed: z.boolean().optional()
  }).strict().optional()
}).strict();
var calendar = z.object({
  ...nodeHead,
  kind: z.literal("calendar"),
  label: z.string().min(1),
  /** ISO-datum, `ÅÅÅÅ-MM-DD`. */
  holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
}).strict();
var deliverableType = z.object({
  ...nodeHead,
  kind: z.literal("deliverable_type"),
  label: z.string().min(1),
  /**
   * Orden någon använder när de letar efter leveranstypen, som på metoderna
   * (`humanName.keywords`, B-255): «kundmejl» och «utskick till kunderna» för
   * Nyhetsbrev. Sökningen läser dem före modulens namn (src/registry/library.ts).
   */
  keywords: humanName.keywords,
  module: z.string().min(1),
  /**
   * Leveranstypen typen är en del av (B-275, docs/plan-leveransmall.md
   * avsnitt 1): «Webbdesign» del av «Ny webbplats». En uppgift av deltypen
   * täcks av åtagandets rad för helheten, så att åtagandet inte behöver en
   * rad per del. Ett led: helheten är inte själv en del.
   */
  part_of: z.string().min(1).optional(),
  /**
   * Typen levereras som en annan typs mål (bytet i etapp 3, Daniel P
   * 2026-10-13): en uppgift av typen byter till den metod med sparat mål som
   * levererar `delivered_as` (id eller tekniskt namn), med kundens sätt av
   * den. Ett led. Annonsrapporten blir rapportmålet, nyhetsbrevet
   * utskicksmålet. Inga kunddata.
   */
  delivered_as: z.string().min(1).optional(),
  /**
   * Målet (docs/plan-malstyrd.md, etapp 1a): roten som en metod med
   * `milestones` planeras baklänges från. `needs` är delmålen (id eller
   * tekniskt namn) som måste finnas; ett vagt mål (`clarity: "vague"`) blir
   * klart genom `clarified_by`.
   */
  goal: goalSpec.optional(),
  /**
   * Typen levereras som en uppsättning per period (Del F, Daniel P
   * 2026-10-13: «inte EN post x5 utan fem poster x1»): en kvot per period på
   * raden ger ETT uppdrag per period med målet `label`, och typens objekt
   * upprepas för varje punkt i listan `list` (ett objekt i typens mål), dimma
   * tills listan är bestämd. Målet räknas ur `goal` (src/plan/period-set.ts,
   * `periodGoalOf`). Utan fältet är varje förekomst ett eget uppdrag.
   */
  per_period: z.object({
    label: z.string().min(1),
    list: z.string().regex(/^[a-z][a-z0-9_]*$/),
    each: z.string().min(1)
  }).strict().optional(),
  /**
   * Undantaget från «gör en variant» (grinden `goal.variant_existing`, Daniel P
   * 2026-10-13): en ny typ vars sparade mål i stort sett är ett befintligt
   * måls får bara bli egen med `extend_existing: false` och `because`.
   */
  extend_existing: z.boolean().optional(),
  because: z.string().min(1).optional(),
  /**
   * Områdets tillägg till instruktionen (nivå 2, Daniel P 2026-10-07): det som
   * gäller allt arbete av det här slaget för vilken kund som helst («ny
   * webbplats», «kampanj»), mellan metodens allmänna instruktion (nivå 1) och
   * kundens sätt (nivå 3). Nyckeln är stegets id, eller "*" för alla steg i
   * arbete av typen. Listor läggs till; syfte och svarets form ersätter.
   * En deltyp ärver helhetens (`part_of`). Inga kunddata (promptlinten).
   */
  instruction_addition: z.record(z.object({
    purpose: z.string().min(1).optional(),
    read_first: z.array(z.string().min(1)).optional(),
    how_to: z.array(z.string().min(1)).optional(),
    must_not: z.array(z.string().min(1)).optional(),
    answer_format: z.string().min(1).optional(),
    ask_when: z.array(z.string().min(1)).optional()
  }).strict()).optional()
}).strict();
var coverage = z.object({
  deliverable_type: z.string().min(1),
  quantity: z.number().int().positive().nullable(),
  /**
   * Över vilken tid kvantiteten räknas. `month` kom till när en retainer
   * kartlades: fem SoMe-poster i månaden går inte att uttrycka med kvartal
   * som minsta fönster, och en månadskvot som räknas per kvartal ser aldrig
   * ut att ta slut.
   */
  period: z.enum(["week", "month", "quarter", "year", "total"]).nullable(),
  regime,
  /** Endast för kalenderregim. `weekly` · `monthly`. */
  cadence: z.string().nullable(),
  /** Veckodag för en rytm per vecka (weekly, eller period week): förekomsterna hamnar den dagen. */
  weekday: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).optional(),
  /**
   * `true`: de `quantity` exemplaren per period görs tillsammans (Freebos
   * SoMe-poster: sex poster som görs på en gång). Då räknas EN uppgift fram
   * per period, med antalet på uppgiften, och stegen görs en gång. Utelämnad
   * eller `false`: en uppgift per exemplar, som förut.
   */
  produced_together: z.boolean().optional(),
  /** Klockslag HH:MM för förekomsten, när det spelar roll. */
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  /**
   * `proposed`: raden lades till underhand vid en beställning som avtalet
   * inte hade en rad för (Daniel P 2026-09-29). Daniel P bekräftar den senare;
   * tills dess står den som «tillagd underhand (?)».
   */
  grounding: z.literal("proposed").optional(),
  /** Vad som hänt raden, t.ex. «tillagd underhand (?)». */
  note: z.string().max(300).optional(),
  /** Utlovad ledtid PER LEVERANSTYP — det sprint 0 frågade efter. */
  promised_lead_time: leadTime,
  /** Det externa datumet — det kunden fått. */
  due: z.string().nullable(),
  /**
   * Det interna målet vi planerar mot (B-075). Går aldrig till kund.
   * Skillnaden mot `due` är bufferten, och den ska synas.
   */
  internal_target: z.string().nullable().optional(),
  /**
   * Metoden eller kundvarianten raden följer (B-087). Utan den slår
   * planeraren upp metoden som levererar typen, och rapporterar tvetydighet
   * när flera gör det.
   */
  method: z.string().min(1).optional()
}).strict();
var commitment = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("commitment"),
  /** Parten i kundroll. */
  party: z.string().min(1),
  invoice_line: z.string().min(1),
  covers: z.array(coverage).min(1),
  binding,
  /**
   * Sista dagen åtagandet gäller, eller `null` för ett löpande avtal (B-172).
   *
   * En retainer tar aldrig slut, och så länge varje åtagande var en retainer
   * behövdes fältet inte. Ett projektåtagande har ett slut, och utan det här
   * fältet fortsatte kalenderraderna att förgenerera uppgifter i evighet:
   * Indexos Build slutar 29 november, men veckorapporten planerades till
   * 18 december och hade fortsatt lika långt som horisonten räckte.
   *
   * Dagen är INKLUSIVE — en uppgift som förfaller på `until` hör till
   * åtagandet. Bara kalenderregimen filtreras; en trigger eller beställning
   * kommer ur en kandidat i loggen och den har redan skett.
   */
  until: z.string().nullable().default(null),
  /**
   * Första dagen åtagandet gäller (blindprovet 2026-09-27, F05). Utelämnad:
   * det gäller sedan det skrevs in, som förut.
   *
   * Ett månadsavtal «från och med oktober» som skrevs in i september fick
   * septemberposter, eftersom kalenderraderna räknade från dagens period.
   * Dagen är INKLUSIVE, och bara kalenderregimen filtreras, som med `until`:
   * en förekomst som förfaller före `starts` finns inte. Grinden kräver
   * `starts` på eller före `until`.
   */
  starts: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).strict();
var mappingKind = z.enum(["sender_to_party", "phrase_to_type", "thread_to_task"]);
var mapping = z.object({
  ...nodeHead,
  kind: z.literal("mapping"),
  maps: mappingKind,
  from: z.string().min(1),
  to: z.string().min(1),
  /** Vilket svar som lärde oss detta. Utan det går kopplingen inte att ompröva. */
  learned_from: z.string().min(1)
}).strict();
var modul = z.object({
  ...nodeHead,
  kind: z.literal("module"),
  label: z.string().min(1)
}).strict();
var setting = z.object({
  ...nodeHead,
  kind: z.literal("setting"),
  label: z.string().min(1),
  summary: z.string().min(1),
  /** Värdet, som det ska läsas. Tomt är inte en inställning — utelämna posten. */
  value: z.string().min(1)
}).strict();
var vocabularyTerm = z.object({
  value: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string().min(1),
  words: z.array(z.string().min(1)).optional(),
  /** Sista ledet i `effect.object` som betyder samma sak ("custom_audience" → audience). */
  effect_objects: z.array(z.string().regex(/^[a-z][a-z0-9_]*$/)).optional()
}).strict();
var vocabulary = z.object({
  ...nodeHead,
  kind: z.literal("vocabulary"),
  label: z.string().min(1),
  summary: z.string().min(1),
  /**
   * Objekt per system; handlingar för alla (`axis: action`, `system: core`).
   * Frågetyperna för sökningen (`axis: question`, `system: core`, etapp D i
   * docs/plan-sok-och-verktyg.md): orden som säger att en fråga gäller
   * läget, en person, agendan, en fil eller kunden.
   */
  axis: z.enum(["object", "action", "question"]),
  /** Systemet ordlistan gäller — `surface` på anropen, eller `core` för alla. */
  system: z.string().min(1),
  /**
   * Orden som pekar ut systemet i en fråga ("facebook", "instagram"). Nämns
   * ett av dem söks bara anrop i system vars ordlista har ordet — därför
   * står "hubspot" även på cms och blogg, som går mot HubSpot.
   */
  words: z.array(z.string().min(1)).optional(),
  terms: z.array(vocabularyTerm).min(1)
}).strict();
var rule = z.object({
  ...nodeHead,
  kind: z.literal("rule"),
  label: z.string().min(1),
  summary: z.string().min(1),
  /** Var regeln gäller. `mail` är inkommande post; fler ytor när de finns. */
  applies_to: z.enum(["mail"]),
  /** Villkoren. Alla som står med måste stämma; de som utelämnas prövas inte. */
  when: z.object({
    /** Avsändarens adress eller domän. `@freebo.se` matchar hela domänen. */
    from: z.string().min(1).optional(),
    /** Ord i ämnesraden, skiftlägesokänsligt. */
    subject_contains: z.string().min(1).optional(),
    /** Brevlådan posten kom till. */
    mailbox: z.string().min(1).optional(),
    /** Kunden ärendet redan knutits till. */
    customer: z.string().min(1).optional()
  }).strict(),
  /** Vad som ska hända. Minst ett fält — en regel utan verkan är en åsikt. */
  then: z.object({
    /**
     * Utfallet regeln sätter. `resolved` saknas med FLIT: att ett ärende
     * redan är avklarat går inte att veta av avsändare och ämnesrad — det
     * kräver att någon läst tråden. En regel som kunde säga det skulle tyst
     * stänga ärenden på en gissning.
     */
    outcome: z.enum(["delivery", "own_reply", "ignored", "waiting"]).optional(),
    deliverable_type: z.string().min(1).optional(),
    customer: z.string().min(1).optional(),
    responsible: z.string().min(1).optional(),
    /** Ordningen regeln föreslår. 1 är först. */
    rank: z.number().int().positive().optional(),
    /** Skälet som följer med utfallet, för den som läser efteråt. */
    reason: z.string().min(1).optional()
  }).strict(),
  /** Avstängd regel står kvar och syns, men gäller inte. */
  enabled: z.boolean().default(true)
}).strict();
var captureRoute = z.object({
  ...nodeHead,
  kind: z.literal("capture_route"),
  label: z.string().min(1),
  /**
   * Vad som brukar komma hit, med de ord det brukar handla om (B-255). Daniel
   * P 2026-09-24: hubspot@ är support för HubSpot, freebo@ beställningar av
   * material och marknadsföringsfrågor — "i stora drag", och frågor om
   * mätning kan komma till båda. Sökningen väger in det, filtrerar aldrig.
   */
  summary: z.string().min(1).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  /**
   * Fler metoder som post hit kan följa (B-258). `method` är standard; till
   * hubspot@ kommer både frågor och fel, och blindprovet 2026-09-25 visade att
   * ett fel fick frågemetoden som ram. Sökningen väljer bland dem efter frågan.
   */
  methods: z.array(z.string().min(1)).optional(),
  /** Matchar `Inflow.source` — `gmail`, `rotor_notes`, `jotform`. */
  channel: z.string().min(1),
  /**
   * `publish`: fångst skriver direkt i loggen. Gäller när avsändaren själv
   * redan riktat posten till byrån — ett mejl till hubspot@, ett ifyllt
   * formulär. Den delade den i och med att den skickades.
   *
   * `hold`: fångst skriver INGENTING. Posten bor kvar hos källan tills ägaren
   * släpper den. Gäller det ingen adresserat till oss — ett möte någon spelat
   * in, en egen inkorg.
   *
   * Att hålla betyder aldrig skrivet, inte skrivet-och-skyddat. En
   * append-only-logg kan inte ta tillbaka, så det som ska kunna förbli
   * privat får inte hamna där först.
   */
  on_capture: z.enum(["publish", "hold"]),
  /** Parten posten normalt kommer ifrån, när vägen är kundspecifik. */
  party: z.string().optional(),
  /**
   * Adressen som bevakas, för kanalen `gmail`. DATA, inte kod: en ny bevakad
   * inkorg är en nod, inte en kodändring. Bara gemener och ingenting som kan
   * bli en sökoperator — adressen blir en del av en Gmail-sökfråga.
   */
  address: z.string().regex(EMAIL_ADDRESS).optional(),
  /**
   * ── Bevakad källa (v6, Daniel P 2026-10-06) ───────────────────────────────
   *
   * En bevakad källa är i första hand en filtrerad Gmail-mapp (`gmail_label`),
   * annars en till-adress hos Rotor (`address`) eller en från-adress hos
   * kunden (`from_address`). Exakt en av de tre per väg i kanalen `gmail`
   * (`capture-rules.ts`). Träffar ett mejl flera källor gäller mapp > till >
   * från (`sourceFor` i `src/intake/routes.ts`).
   *
   * En mapp är en persons etikett och läses bara i den personens brevlåda,
   * och ägaren står utskriven på källan (beslut 2026-10-06: mappar bara i
   * Daniel P:s brevlåda). Namnet `label` är upptaget av visningsnamnet.
   */
  gmail_label: z.object({
    name: z.string().min(1),
    /** Personen vars brevlåda mappen ligger i: `<part-id>/<person-id>` eller en intern parts id. */
    owner: z.string().min(1)
  }).strict().optional(),
  /** Avsändaradressen hos kunden som bevakas. Samma form som `address`. */
  from_address: z.string().regex(EMAIL_ADDRESS).optional(),
  /**
   * Vad det som kommer hit blir när det inte hör till något som pågår:
   * `support` → ärende, `order` → beställning, `possibility` → möjligt,
   * `nothing` → behöver inget, `inbox` → husadressen, till Inkommet.
   * Utelämnat är ett hål som syns, inte ett förval.
   */
  way: z.enum(["support", "order", "possibility", "nothing", "inbox"]).optional(),
  /**
   * ── Brevlådan är data, inte kod (B-101) ──────────────────────────────────
   *
   * Fälten nedan gör fångstvägen till en BREVLÅDA: vad som kommer dit, vilken
   * kund det gäller, vilken metod som gäller för det som kommer in, vem som
   * svarar och vart svaret går, vilka etiketter som tas in — och om den är
   * påslagen. Ingen adress, ingen kund och ingen ärendetyp i koden: en ny
   * brevlåda ska vara en post här, inte en kodändring.
   *
   * Alla är valfria i SCHEMAT och prövas av `capture-rules.ts`, så att felet
   * blir åtgärdbart ("case_type pekar på n0999 som inte är en leveranstyp") i
   * stället för "invalid literal union".
   */
  /** Ärendetypen posten hit blir. Leveranstypens id. */
  case_type: z.string().min(1).optional(),
  /**
   * Kunden ärendet gäller: en parts id, eller `per_mail` när brevlådan tar
   * emot post om flera kunder och kunden avgörs per mejl. Skilt från `party`,
   * som säger vem posten normalt KOMMER IFRÅN — en leverantör kan mejla om en
   * kund, och de två är inte samma fråga.
   */
  customer: z.union([z.literal("per_mail"), z.string().min(1)]).optional(),
  /** Metoden eller kundvarianten som gäller för det som kommer in hit. */
  method: z.string().min(1).optional(),
  /**
   * Den löpande leveransen posten hit hör till: en leveransmall med
   * periodiciteten `ongoing` (Daniel P 2026-10-03: *"slå ihop inboxen (för
   * supportmail i alla fall) dit som oklassificerade"*). Obedömd post hit
   * står då i leveransens kö under Obedömda, inte i In, och In säger hur
   * många som ligger där. Utelämnat: posten står i In.
   */
  delivery_template: z.string().min(1).optional(),
  /** Parten som svarar. En intern part, eller `<part-id>/<person-id>`. */
  answered_by: z.string().min(1).optional(),
  /**
   * Vart svaret går. `sender`: till den som frågade. `mailbox`: till brevlådan.
   * `copy`: adresser som alltid får en kopia — typiskt brevlådan själv, så att
   * ärendet och svaret ligger på samma ställe.
   */
  reply: z.object({
    to: z.enum(["sender", "mailbox"]),
    copy: z.array(z.string().regex(EMAIL_ADDRESS)).default([])
  }).strict().optional(),
  /** Etiketterna som tas in respektive aldrig tas in ur just den här brevlådan. */
  mail: mailLabels.optional(),
  /**
   * Tidigast den här dagen får posten läsas, som `ÅÅÅÅ-MM-DD` (B-101).
   *
   * Den FÖRSTA körningen har inget vattenmärke att utgå från, och måste ändå
   * veta var den börjar. Utan fältet skulle den behöva gissa — och en gissning
   * åt fel håll drar hem år av gammal post som ingen bett om, till en
   * append-only-logg som inte kan ta tillbaka.
   *
   * Efter första körningen styr vattenmärket (`inbox_read`), och det här
   * fältet är ett golv: en vanlig körning går aldrig längre bakåt än det
   * senare av de två. Äldre post hämtas bara när någon uttryckligen ber om
   * ett intervall.
   */
  read_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /**
   * Vem som får skicka för brevlådan, och till vem (B-101).
   *
   * BEGRÄNSNINGARNA LIGGER I DIRIGENTEN, INTE HOS GOOGLE. Ett `gmail.send`-scope
   * ger rätt att skicka till vem som helst från personens konto; det som gör
   * utskicket avgränsat är den här posten, och därför måste den finnas för att
   * något ska få skickas.
   *
   * `senders`: interna parter som får skicka för brevlådan. Tom lista betyder
   * bara den som står som `answered_by` — den snävaste tolkningen, eftersom en
   * tom lista lika gärna kan vara glömska.
   *
   * `recipients`: `sender` — bara till den som skrev in i tråden. `party` —
   * till vem som helst hos den kund ärendet gäller. Utelämnat läses som
   * `sender`; ett förval som vidgar vore ett beslut ingen skrivit.
   */
  send: z.object({
    senders: z.array(z.string().min(1)).default([]),
    recipients: z.enum(["sender", "party"]).optional()
  }).strict().optional(),
  /**
   * Är brevlådan påslagen? Utelämnat betyder JA, därför att de fångstvägar som
   * redan står i registret läses i dag och inte tyst ska sluta läsas när
   * fältet läggs till. Att stänga av är alltså ett skrivet beslut, inte ett
   * förval — och det syns i posten.
   */
  enabled: z.boolean().optional()
}).strict();
var corpusPartKind = z.enum([
  "document",
  "fact",
  "hypothesis",
  "angle",
  "reasoning",
  "question"
]);
var corpusPartBelagg = z.enum(["belagd", "partsinlaga", "obekraftad", "felaktig"]);
var corpusPartReach = z.enum(["general", "conditional", "customer"]);
var corpusPartDirection = z.enum(["for", "against", "neutral"]);
var corpus = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("corpus"),
  /** Modulen som äger mängden. */
  owner: z.string().min(1),
  /** Vad materialet ska handla om, i klartext. */
  about: z.string().min(1),
  /** Vilka sorters källor som duger. En källsort som inte står här duger inte. */
  source_kinds: z.array(z.string().min(1)).min(1),
  /**
   * Källsorter mängden inte är tillräcklig UTAN. Skilt från `source_kinds`
   * med flit: att en intervju duger betyder inte att den krävs, och en
   * mängd som kräver varje sort den godtar går aldrig att nå.
   */
  required_source_kinds: z.array(z.string().min(1)).default([]),
  /** Vad som gör underlaget tillräckligt. Villkor som går att kontrollera. */
  enough: z.array(z.string().min(1)).min(1),
  /** Minsta antal delar som inte är felaktiga. 0 betyder att antalet inte avgör. */
  min_parts: z.number().int().nonnegative().default(0)
}).strict();
var corpusPart = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("corpus_part"),
  /** Mängden delen ligger i. */
  corpus: z.string().min(1),
  part: corpusPartKind,
  /** Källan i klartext: vad den är och var den står. Tom är inte tillåtet. */
  source: z.string().min(1),
  belagg: corpusPartBelagg,
  /** Var innehållet finns: bank://…, ett innehålls id, eller texten själv. */
  content: z.string().min(1),
  /** Delen den här delen väger om. Den gamla står kvar. */
  supersedes: z.string().min(1).optional(),
  /** Varför delen är fel. Krävs när beläggningen är felaktig. */
  wrong_because: z.string().min(1).optional(),
  /**
   * Räckvidden (B-278): allmän, villkorat allmän eller bara för en kund.
   * Heter inte `scope` — det namnet bär redan varje post (delad eller
   * tenantens). Utelämnat: inte bedömt, som före B-278. Det som ärvs av
   * nästa uppdrag är det som är allmänt; en kunds del ärvs aldrig av en annan.
   */
  reach: corpusPartReach.optional(),
  /** Kunden delen gäller (part-id). Krävs när räckvidden är kund, och bara då. */
  customer: z.string().min(1).optional(),
  /** Villkoret en villkorat allmän del gäller under. Krävs för `conditional`. */
  condition: z.string().min(1).optional(),
  /** Gränsen: vad delen INTE bär, var den inte gäller. */
  not_valid_for: z.string().min(1).optional(),
  /** Talar delen för, emot eller varken eller — så att ett ensidigt spår syns. */
  direction: corpusPartDirection.optional(),
  /** Dokumenttypen bredvid beläggningen: «belagt — kvartalsrapport», inte bara «belagt». */
  document_type: z.string().min(1).optional(),
  /** Spåret delen kom ur i en kunskapsresearch, t.ex. S3. */
  track: z.string().min(1).optional(),
  /** Rundan i spåret. */
  round: z.number().int().positive().optional(),
  /** Frågan i spåret delen svarar på, i klartext. */
  question: z.string().min(1).optional()
}).strict();
var templatePeriodicity = z.enum(["none", "week", "month", "quarter", "phase", "ongoing"]);
var templatePart = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string().min(1),
  /**
   * Metoden eller kundvarianten delen görs med. Valfri (2026-09-27): nyhetsbrev,
   * VD-post, annonsrapport och sökordskarta har ingen metod än, men hör ändå
   * till månaden. Utan metod anger delen sin leveranstyp i `deliverable_type`,
   * och uppgiften står som «utan steg» tills den får steg eller en metod.
   */
  method: z.string().min(1).optional(),
  /** Leveranstypen, för en del utan metod. Med metod: det metoden levererar. */
  deliverable_type: z.string().min(1).optional(),
  /**
   * `order`: instansieringen skapar uppgiften. `calendar` och `trigger`:
   * uppgiften uppstår ur åtagandets rad (kalendern, ärendena) och samlas i
   * perioden — mallen skapar den aldrig (etapp 3).
   */
  source: z.enum(["order", "calendar", "trigger"]).default("order"),
  /** Delarna som ska vara klara först, med sina `key`. */
  after: z.array(z.string().min(1)).default([]),
  /** Obligatorisk: en kundmall kan inte ta bort den, och att hoppa över den kräver skäl. */
  required: z.boolean().default(false),
  /** Uppgiften behåller sitt eget datum och följer inte leveransens när den flyttas. */
  own_dates: z.boolean().default(false),
  /** Fasen delen hör till, när mallen har periodiciteten `phase`. */
  phase: z.string().min(1).optional()
}).strict();
var deliveryTemplate = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("delivery_template"),
  /** Kunden (part) för en kundmall; null för en allmän mall. */
  customer: z.string().min(1).nullable().default(null),
  /** Den allmänna mallen en kundmall bygger på. */
  base: z.string().min(1).nullable().default(null),
  periodicity: templatePeriodicity,
  /** För `phase`: faserna i ordning. */
  phases: z.array(z.string().min(1)).default([]),
  parts: z.array(templatePart).default([]),
  /** Kundmallens delar ur grunden som inte ingår, med sina `key`. Aldrig en obligatorisk. */
  drops: z.array(z.string().min(1)).default([]),
  /**
   * Kundmall: vilka åtagandesrader som hör till vilken del (etapp 3 samlar
   * uppgifterna ur dem per period). Två mallar samlar aldrig samma rad.
   */
  collects: z.array(z.object({
    commitment: z.string().min(1),
    deliverable_type: z.string().min(1),
    part: z.string().min(1)
  }).strict()).default([]),
  /** `given`: datumet anges vid instansieringen. `period_end`/`phase_end`: periodens eller fasens slut. `open`: ingen slutdag (löpande). */
  due_rule: z.enum(["given", "period_end", "phase_end", "open"]),
  /**
   * Den första perioden mallen samlar (förslaget för leveransmallarna
   * 2026-09-27): `2026-09`, `2026-W40` eller `2026-Q4`, i mallens form.
   * Utelämnad: bakåtblicken tar fram två perioder bakåt, och «Freebo månad»
   * fick juli och augusti med sena uppgifter. Samma idé som åtagandets
   * `starts`: det som ligger före finns inte i mallens leveranser.
   */
  first_period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2]|W(0[1-9]|[1-4]\d|5[0-3])|Q[1-4])$/).optional(),
  /**
   * Leveransernas namn, när det inte är mallens (samma förslag): mallen
   * «Freebo månad» ger «Freebo september» med `delivery_label: "Freebo"`.
   * Utelämnat: mallens namn, som förut.
   */
  delivery_label: z.string().min(1).max(100).optional(),
  /**
   * Hur leveransen visas (Daniel P 2026-10-14: «för just supportärendena kan inte
   * alla ligga samtidigt i kartan – det blir kaos»): `map` när uppdragen är delar
   * av ett gemensamt mål, `queue` när de är fristående tillfällen av samma sort.
   * Utelämnad: förvalet i src/views/queue.ts (löpande eller bara utlösta uppdrag ger kö).
   */
  view: z.enum(["queue", "map"]).optional()
}).strict();
var PROMPT_BLOCK_SLOTS = ["rule", "proof", "fallback", "effect_forbid", "done_check", "fallback_recipe"];
var PROMPT_EVIDENCE_GRADES = ["H\xC4RDAT", "BELAGT", "TR\xC5D"];
var promptBlockRound = z.object({
  /** ISO-datum. */
  at: z.string().min(1),
  /** Formuleringen som prövades (en ändring mot den gällande). */
  text: z.string().min(1),
  /** Vem som körde: den lokala modellen (förprov) eller en Claude-session (slutprovet). */
  runner: z.enum(["local_model", "claude_session"]),
  model: z.string().min(1),
  /** Kalla körningar per fall och formulering. */
  n: z.number().int().min(1),
  /** Utfallet per fall: gällande mot föreslagen, och körning för körning. */
  spread: z.string().min(1),
  /** Den nya formuleringen klarade varje fall minst lika bra och minst 8 av 10. */
  held: z.boolean(),
  /** Det motsatta kontrollfallet blev inte sämre (ingen överanpassning). */
  contrast_held: z.boolean(),
  /**
   * no_block: ett evidensvarv för den gällande formuleringen (rättelseomgång 2):
   * blocket ordagrant mot samma prompt utan blocket. Byter aldrig texten och
   * räknas inte bland de tre varven för en ny formulering.
   */
  against: z.literal("no_block").optional(),
  note: z.string().min(1).optional()
}).strict();
var promptBlock = z.object({
  ...nodeHead,
  ...humanName,
  kind: z.literal("prompt_block"),
  slot: z.enum(PROMPT_BLOCK_SLOTS),
  /** Språket formuleringen prövades på; den prövade texten översätts aldrig. */
  lang: z.enum(["en", "sv"]),
  /** Den exakta formuleringen. `{param}` fylls i ur skelettet; inget annat ändras. */
  text: z.string().min(1),
  /** Parametrarna i texten, med vad de fylls med. Varje `{x}` i texten står här och tvärtom. */
  params: z.record(z.string().regex(/^[a-zåäö][a-zåäö0-9_]*$/), z.string().min(1)).optional(),
  /** Bara för starka modeller (bevisplikten: på svaga ger den falska kvittenser). */
  strong_model_only: z.boolean().optional(),
  evidence: z.object({
    /** Källan: fil, avsnitt och prov. */
    source: z.string().min(1),
    models: z.array(z.string().min(1)),
    n: z.number().int().min(0),
    spread: z.string().min(1),
    grade: z.enum(PROMPT_EVIDENCE_GRADES),
    /** Vad läget gäller: själva formuleringen, eller formen (formuleringen är då vår och inte prövad ordagrant). */
    basis: z.enum(["wording", "form"]),
    /** Provslingans varv: högst tre för en ny formulering, och högst tre evidensvarv för den gällande (`against: "no_block"`). */
    rounds: z.array(promptBlockRound).max(6).optional(),
    /** Daniel P:s beslut efter tre varv utan att hålla: formuleringen som gäller, vem och när. */
    decision: z.object({ by: z.string().min(1), at: z.string().min(1), text: z.string().min(1) }).strict().optional()
  }).strict()
}).strict();
var houseRoleCover = z.object({
  milestone: z.array(z.string().regex(/^[a-z0-9_*]+$/)).min(1).optional(),
  moment: z.array(z.string().min(1)).min(1).optional(),
  module: z.array(z.string().min(1)).min(1).optional(),
  role: z.array(z.string().min(1)).min(1).optional(),
  by: z.array(z.enum(ACTORS)).min(1).optional(),
  kind: z.array(z.enum(MOMENT_KINDS)).min(1).optional(),
  effect: z.array(z.enum(EFFECTS)).min(1).optional()
}).strict();
var houseRole = z.object({
  ...nodeHead,
  kind: z.literal("house_role"),
  label: z.string().min(1),
  summary: z.string().min(1),
  holder: z.string().min(1).optional(),
  performer: z.enum(ACTORS).optional(),
  covers: z.array(houseRoleCover).min(1)
}).strict();
var registered = z.discriminatedUnion("kind", [
  houseRole,
  call,
  atomProposal,
  operation,
  step,
  method,
  methodVariant,
  asset,
  sourceRoute,
  captureRoute,
  party,
  deliverableType,
  commitment,
  mapping,
  accessGroup,
  modul,
  setting,
  calendar,
  corpus,
  corpusPart,
  rule,
  vocabulary,
  deliveryTemplate,
  milestone,
  viewTool,
  promptBlock
]);

// dist/src/intake/gmail.js
var BODY_HEAD_CHARS = 1500;
var MAX_DAYS = 365;
var addressTerm = (address) => `{deliveredto:${address} to:${address} cc:${address}}`;
function inflowQuery(address, days, mailbox) {
  if (!EMAIL_ADDRESS.test(address))
    throw new Error(`"${address}" \xE4r ingen ren adress \u2014 gemener, en adress, inga operatorer`);
  if (address === mailbox.trim().toLowerCase())
    throw new Error(`${address} \xE4r brevl\xE5dan sj\xE4lv \u2014 det vore all post, inte en bevakad adress`);
  if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS)
    throw new Error(`dagar m\xE5ste vara ett heltal 1\u2013${MAX_DAYS}, fick ${days}`);
  return `${addressTerm(address)} newer_than:${days}d`;
}
var DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
var gmailDate = (iso) => {
  const m = DATE.exec(iso);
  if (!m)
    throw new Error(`"${iso}" \xE4r inget datum \u2014 skriv det som \xC5\xC5\xC5\xC5-MM-DD`);
  return `${m[1]}/${m[2]}/${m[3]}`;
};
var dayAfter = (iso) => new Date(Date.parse(`${iso}T00:00:00Z`) + 864e5).toISOString().slice(0, 10);
function inflowQueryRange(address, from, to, mailbox) {
  inflowQuery(address, 1, mailbox);
  const bas = addressTerm(address);
  const fromDay = gmailDate(from), toDay = gmailDate(to);
  if (fromDay > toDay)
    throw new Error(`${from} \xE4r efter ${to} \u2014 intervallet \xE4r bakv\xE4nt`);
  const dagar = Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  if (!Number.isFinite(dagar) || dagar > MAX_DAYS)
    throw new Error(`intervallet \xE4r l\xE4ngre \xE4n ${MAX_DAYS} dagar \u2014 det \xE4r en export, inte en l\xE4sning`);
  return `${bas} after:${fromDay} before:${gmailDate(dayAfter(to))}`;
}
function inflowQueryBetween(address, from, to, mailbox) {
  if (!EMAIL_ADDRESS.test(address))
    throw new Error(`"${address}" \xE4r ingen ren adress \u2014 gemener, en adress, inga operatorer`);
  if (address === mailbox.trim().toLowerCase())
    throw new Error(`${address} \xE4r brevl\xE5dan sj\xE4lv \u2014 det vore all post, inte en bevakad adress`);
  const f = Date.parse(from);
  const t = Date.parse(to);
  if (Number.isNaN(f) || Number.isNaN(t))
    throw new Error(`f\xF6nstret ${from}\u2013${to} \xE4r inga tidpunkter`);
  if (f >= t)
    throw new Error(`f\xF6nstret ${from}\u2013${to} g\xE5r bakl\xE4nges`);
  return `${addressTerm(address)} after:${Math.floor(f / 1e3)} before:${Math.ceil(t / 1e3) + 1}`;
}
function isInternal(address, domains) {
  const at = address.lastIndexOf("@");
  return at > 0 && domains.has(address.slice(at + 1));
}
async function accessToken(auth2, fetchFn) {
  const r = await fetchFn("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: auth2.client_id,
      client_secret: auth2.client_secret,
      refresh_token: auth2.refresh_token,
      grant_type: "refresh_token"
    }).toString()
  });
  if (!r.ok)
    throw new Error(`kunde inte f\xF6rnya \xE5tkomsten (${r.status})`);
  const t = await r.json().catch(() => ({}));
  if (!t.access_token)
    throw new Error("inget access_token i svaret");
  return t.access_token;
}
var header = (h, name) => h.find((x) => x.name.toLowerCase() === name.toLowerCase())?.value ?? "";
var bareAddress = (address) => (/<([^>]+)>/.exec(address)?.[1] ?? address).trim().toLowerCase();
function senderDisplayName(value) {
  const lt = value.indexOf("<");
  if (lt <= 0)
    return void 0;
  const name = value.slice(0, lt).trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"').trim();
  if (!name || /@/.test(name) || /=\?[^?]+\?[bq]\?/i.test(name) || name.length > 120)
    return void 0;
  return name;
}
var addressList = (value) => {
  const ut = [];
  for (const m of value.replace(/"[^"]*"/g, "").matchAll(/<([^<>\s]+@[^<>\s]+)>|([^\s<>",;]+@[^\s<>",;]+)/g)) {
    const a = (m[1] ?? m[2] ?? "").trim().toLowerCase();
    if (a && !ut.includes(a))
      ut.push(a);
  }
  return ut;
};
var avkoda = (data) => Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
var MAX_MIME_DEPTH = 20;
function plainText(payload, depth = 0) {
  if (depth > MAX_MIME_DEPTH)
    return "";
  const p = payload;
  if (!p || typeof p !== "object")
    return "";
  if (p.mimeType === "text/plain" && p.body?.data)
    return avkoda(p.body.data);
  if (!Array.isArray(p.parts))
    return "";
  for (const del of p.parts) {
    const t = plainText(del, depth + 1);
    if (t)
      return t;
  }
  return "";
}
function toRawMessage(m, body, domains) {
  const h = m.payload?.headers ?? [];
  const from = bareAddress(header(h, "From"));
  const fromName = senderDisplayName(header(h, "From"));
  const to = addressList(header(h, "To"));
  const cc = addressList(header(h, "Cc"));
  return {
    id: m.id,
    from,
    ...fromName ? { from_name: fromName } : {},
    subject: header(h, "Subject"),
    internal: isInternal(from, domains),
    body_head: body.slice(0, BODY_HEAD_CHARS),
    /**
     * Kroppens längd — `undefined` när vi inte hämtat kroppen.
     *
     * Två försök till genväg, båda mätta och båda förkastade:
     *
     *   `body.length` med tom kropp → 0, och brusregeln
     *   (`internal && body_chars < TRIVIAL_CHARS`) tände på VARJE internt
     *   meddelande. All vår korrespondens försvann som skräp.
     *
     *   `snippet.length` → Gmail KAPAR snippet vid ungefär 200 tecken, och
     *   tröskeln är 200. Varje meddelande med en kropp mätte då 192-199 och
     *   hamnade strax under gränsen. Mätt mot verkligt material: 17 korta
     *   svar i kundtrådar kastades som brus. En mätsticka som mättar precis
     *   vid gränsen man testar mot mäter ingenting.
     *
     * Så: okänt är okänt. Brusregeln får inte tända på en gissning, och
     * signalen den egentligen behöver är strukturell — ett kort svar i en
     * tråd med kundpost är ett svar, inte skräp. Tråden avgör det, inte
     * längden.
     */
    ...body ? { body_chars: body.length } : {},
    thread_id: m.threadId,
    // Ordningen i tråden går inte att avgöra utan tidpunkt, och det är
    // ordningen som säger vem som väntar på vem.
    ...m.internalDate ? { at: new Date(Number(m.internalDate)).toISOString() } : {},
    attachments: m.payload?.parts?.filter((p) => p.filename).length ?? 0,
    ...to.length ? { to } : {},
    ...cc.length ? { cc } : {},
    ...header(h, "Message-ID").trim() ? { message_id: header(h, "Message-ID").trim() } : {},
    ...header(h, "References").trim() ? { references: header(h, "References").trim().split(/\s+/) } : {}
  };
}

// dist/src/intake/normalize.js
var VIDARE_PREFIX = /^\s*((fwd?|vb|vidarebefordrat)\s*:\s*)+/i;
function looksForwarded(subject) {
  return VIDARE_PREFIX.test(subject);
}

// dist/src/intake/attachments.js
function attachmentParts(payload, depth = 0) {
  if (depth > MAX_MIME_DEPTH)
    return [];
  const p = payload;
  if (!p || typeof p !== "object")
    return [];
  const ut = [];
  if (p.filename && p.body?.attachmentId)
    ut.push({
      attachment_id: p.body.attachmentId,
      filename: p.filename,
      mime: p.mimeType ?? "application/octet-stream",
      size: p.body.size ?? 0
    });
  if (Array.isArray(p.parts))
    for (const del of p.parts)
      ut.push(...attachmentParts(del, depth + 1));
  return ut;
}
function decodeAttachment(data) {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function safeFilename(name, fallback = "bilaga") {
  const rent = name.replace(/[\u0000-\u001f\u007f]/g, "").split(/[/\\]/).pop().replace(/^\.+/, "").trim().slice(0, 200);
  return rent || fallback;
}

// dist/src/intake/mail-labels.js
function labelTerm(label, exclude) {
  const namn = label.trim();
  if (!LABEL_NAME.test(namn))
    throw new Error(`"${label}" \xE4r inget etikettnamn \u2014 bokst\xE4ver, siffror, mellanslag och -_/ , inga operatorer`);
  return `${exclude ? "-" : ""}label:"${namn}"`;
}

// scripts/gmail-las.mjs
var etikettDel = ({ labels = [], never_labels = [] }) => {
  const med = labels.filter((l) => l.trim());
  const urval = med.length ? med.length === 1 ? labelTerm(med[0], false) : `{${med.map((l) => labelTerm(l, false)).join(" ")}}` : "";
  const bort = never_labels.filter((l) => l.trim()).map((l) => labelTerm(l, true)).join(" ");
  return [urval, bort].filter(Boolean).join(" ");
};
var ROT = dirname(dirname(fileURLToPath(import.meta.url)));
var v\u00E4nta = (ms) => new Promise((r) => setTimeout(r, ms));
var HUVUDEN = ["From", "Subject", "To", "Date", "Delivered-To"];
var CACHE = join(process.env.CLAUDE_PLUGIN_DATA ?? ROT, ".cache", "inflode");
var avbryt = (m) => {
  process.stderr.write(`gmail-las: ${m}
`);
  process.exit(2);
};
var argv = process.argv.slice(2);
var l\u00E4ge = argv[0] === "bilagor" ? "bilagor" : "inflode";
var flagga = (namn) => {
  const i = argv.indexOf(namn);
  return i === -1 ? [] : String(argv[i + 1] ?? "").split(",").map((x) => x.trim()).filter(Boolean);
};
var auth = JSON.parse(readFileSync(join(homedir(), ".config", "rotor", "gmail.json"), "utf8"));
if (!auth.mailbox) avbryt("gmail.json saknar mailbox \u2014 k\xF6r npm run gmail-oauth igen");
var adress;
var dom\u00E4ner;
var fr\u00E5ga;
var mejlId;
if (l\u00E4ge === "bilagor") {
  mejlId = argv[1];
  if (!mejlId) avbryt("anv\xE4ndning: gmail-las.mjs bilagor <mejl-id>");
} else {
  const [a, fr\u00E5n, till, interna] = argv;
  adress = a;
  if (!adress || !fr\u00E5n || !till || interna === void 0)
    avbryt("anv\xE4ndning: gmail-las.mjs <adress> <fr\xE5n> <till> <interna dom\xE4ner> [--etiketter a,b] [--utom c,d]");
  dom\u00E4ner = new Set(interna.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean));
  if (!dom\u00E4ner.size) avbryt("inga interna dom\xE4ner \u2014 utan dem g\xE5r uppackningen inte att avg\xF6ra");
  const med = flagga("--etiketter");
  const utom = flagga("--utom");
  try {
    const DATUM = /^\d{4}-\d{2}-\d{2}$/;
    fr\u00E5ga = DATUM.test(fr\u00E5n) && DATUM.test(till) ? inflowQueryRange(adress, fr\u00E5n, till, auth.mailbox) : inflowQueryBetween(adress, fr\u00E5n, till, auth.mailbox);
    if (med.length || utom.length)
      fr\u00E5ga = [fr\u00E5ga, etikettDel({ labels: med, never_labels: utom })].filter(Boolean).join(" ");
  } catch (e) {
    avbryt(e.message);
  }
}
var token = await accessToken(auth, fetch);
async function api(path, params = {}) {
  const u = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`);
  for (const [k, v] of Object.entries(params))
    if (Array.isArray(v)) for (const x of v) u.searchParams.append(k, String(x));
    else u.searchParams.set(k, String(v));
  for (const backoff of [0, 2e3, 8e3, 2e4, 45e3]) {
    if (backoff) {
      process.stderr.write(`  (kvottak \u2014 v\xE4ntar ${backoff / 1e3}s)
`);
      await v\u00E4nta(backoff);
    }
    const r = await fetch(u, { headers: { authorization: `Bearer ${token}` } });
    if (r.ok) return r.json();
    const text = await r.text();
    const \u00F6verg\u00E5ende = r.status === 429 || r.status === 403 && text.includes("rateLimitExceeded");
    if (!\u00F6verg\u00E5ende) throw new Error(`${path}: ${r.status} ${text.slice(0, 300)}`);
  }
  throw new Error(`${path}: kvottaket gav inte med sig`);
}
mkdirSync(CACHE, { recursive: true });
async function cachat(nyckel, h\u00E4mta) {
  const fil = join(CACHE, `${nyckel}.json`);
  if (existsSync(fil)) return JSON.parse(readFileSync(fil, "utf8"));
  const v = await h\u00E4mta();
  writeFileSync(fil, JSON.stringify(v));
  return v;
}
var huvudenF\u00F6r = (id) => cachat(`h_${id}`, () => api(`messages/${id}`, { format: "metadata", metadataHeaders: HUVUDEN }));
var kroppF\u00F6r = (id) => cachat(`b_${id}`, async () => {
  const m = await api(`messages/${id}`, { format: "full" });
  return { text: plainText(m.payload).slice(0, 4e3) };
});
if (l\u00E4ge === "bilagor") {
  const m = await api(`messages/${mejlId}`, { format: "full" });
  const delar = attachmentParts(m.payload);
  const katalog = join(CACHE, "bilagor", mejlId);
  if (delar.length) mkdirSync(katalog, { recursive: true });
  const bilagor = [];
  const trasiga = [];
  for (const [n, del] of delar.entries()) {
    try {
      const svar = await api(`messages/${mejlId}/attachments/${del.attachment_id}`);
      const data = decodeAttachment(svar.data ?? "");
      const namn = `${String(n + 1).padStart(2, "0")}-${safeFilename(del.filename)}`;
      const v\u00E4g = join(katalog, namn);
      writeFileSync(v\u00E4g, data);
      bilagor.push({
        mejl: mejlId,
        filnamn: safeFilename(del.filename),
        mime: del.mime,
        storlek: data.byteLength,
        path: v\u00E4g
      });
    } catch (e) {
      if (e instanceof ReferenceError || e instanceof TypeError) throw e;
      trasiga.push({ filnamn: del.filename, error: String(e.message).slice(0, 90) });
      process.stderr.write(`  kunde inte h\xE4mta ${del.filename}: ${String(e.message).slice(0, 90)}
`);
    }
  }
  process.stdout.write(JSON.stringify({ mejl: mejlId, bilagor, broken: trasiga }));
  process.exit(0);
}
var tr\u00E5dIdn = /* @__PURE__ */ new Set();
var sida;
do {
  const r = await api("messages", {
    q: fr\u00E5ga,
    maxResults: 500,
    ...sida ? { pageToken: sida } : {}
  });
  for (const m of r.messages ?? []) tr\u00E5dIdn.add(m.threadId ?? m.id);
  sida = r.nextPageToken;
} while (sida);
var tr\u00E5denF\u00F6r = (id) => cachat(`t_${id}`, () => api(`threads/${id}`, { format: "metadata", metadataHeaders: HUVUDEN }));
var ids = [];
var r\u00E5PerId = /* @__PURE__ */ new Map();
for (const t of tr\u00E5dIdn) {
  try {
    const tr\u00E5d = await tr\u00E5denF\u00F6r(t);
    for (const m of tr\u00E5d.messages ?? []) {
      ids.push(m.id);
      r\u00E5PerId.set(m.id, m);
    }
  } catch (e) {
    if (e instanceof ReferenceError || e instanceof TypeError) throw e;
    process.stderr.write(`  kunde inte l\xE4sa tr\xE5den ${t}: ${String(e.message).slice(0, 90)}
`);
  }
}
var messages = [];
var broken = [];
var bodies = 0;
for (const id of ids) {
  try {
    const m = r\u00E5PerId.get(id) ?? await huvudenF\u00F6r(id);
    const utan = toRawMessage(m, "", dom\u00E4ner);
    if (!utan.from) throw new Error("svaret bar inga huvuden \u2014 kontrollera metadataHeaders");
    const beh\u00F6ver = utan.internal && looksForwarded(utan.subject);
    if (beh\u00F6ver) bodies += 1;
    messages.push(beh\u00F6ver ? toRawMessage(m, (await kroppF\u00F6r(id)).text, dom\u00E4ner) : utan);
  } catch (e) {
    if (e instanceof ReferenceError || e instanceof TypeError) throw e;
    broken.push({ id, error: String(e.message).slice(0, 90) });
    process.stderr.write(`  kunde inte l\xE4sa ${id}: ${String(e.message).slice(0, 90)}
`);
  }
}
var sistaITr\u00E5d = /* @__PURE__ */ new Map();
for (const m of messages) {
  const k = m.thread_id ?? m.id;
  const f = sistaITr\u00E5d.get(k);
  if (!f || Number(m.at ? Date.parse(m.at) : 0) >= Number(f.at ? Date.parse(f.at) : 0))
    sistaITr\u00E5d.set(k, m);
}
for (const [, m] of sistaITr\u00E5d) {
  if (m.internal || m.body_chars !== void 0) continue;
  try {
    const r\u00E5 = r\u00E5PerId.get(m.id) ?? await huvudenF\u00F6r(m.id);
    const hel = toRawMessage(r\u00E5, (await kroppF\u00F6r(m.id)).text, dom\u00E4ner);
    bodies += 1;
    messages[messages.indexOf(m)] = hel;
  } catch (e) {
    if (e instanceof ReferenceError || e instanceof TypeError) throw e;
    process.stderr.write(`  kunde inte l\xE4sa kroppen f\xF6r ${m.id}: ${String(e.message).slice(0, 90)}
`);
  }
}
process.stdout.write(JSON.stringify({ mailbox: auth.mailbox, query: fr\u00E5ga, messages, broken, bodies }));
