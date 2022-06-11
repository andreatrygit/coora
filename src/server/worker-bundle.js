(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __toBinary = /* @__PURE__ */ (() => {
    var table = new Uint8Array(128);
    for (var i = 0; i < 64; i++)
      table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
    return (base64) => {
      var n = base64.length, bytes = new Uint8Array((n - (base64[n - 1] == "=") - (base64[n - 2] == "=")) * 3 / 4 | 0);
      for (var i2 = 0, j = 0; i2 < n; ) {
        var c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
        var c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
        bytes[j++] = c0 << 2 | c1 >> 4;
        bytes[j++] = c1 << 4 | c2 >> 2;
        bytes[j++] = c2 << 6 | c3;
      }
      return bytes;
    };
  })();

  // node_modules/hono/dist/response.js
  var require_response = __commonJS({
    "node_modules/hono/dist/response.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.HonoResponse = void 0;
      var errorMessage = "Response is not finalized";
      var HonoResponse = class {
        constructor(_data, init) {
          var _a;
          this.headers = new Headers(init.headers);
          this.status = (_a = init.status) !== null && _a !== void 0 ? _a : 404;
          this._finalized = false;
        }
        clone() {
          throw new Error(errorMessage);
        }
        arrayBuffer() {
          throw new Error(errorMessage);
        }
        blob() {
          throw new Error(errorMessage);
        }
        formData() {
          throw new Error(errorMessage);
        }
        json() {
          throw new Error(errorMessage);
        }
        text() {
          throw new Error(errorMessage);
        }
      };
      exports.HonoResponse = HonoResponse;
    }
  });

  // node_modules/hono/dist/utils/url.js
  var require_url = __commonJS({
    "node_modules/hono/dist/utils/url.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.mergePath = exports.isAbsoluteURL = exports.getPathFromURL = exports.getPattern = exports.splitPath = void 0;
      var URL_REGEXP = /^https?:\/\/[a-zA-Z0-9\-\.:]+(\/?[^?#]*)/;
      var splitPath = (path) => {
        const paths = path.split(/\//);
        if (paths[0] === "") {
          paths.shift();
        }
        return paths;
      };
      exports.splitPath = splitPath;
      var patternCache = {};
      var getPattern = (label) => {
        if (label === "*") {
          return "*";
        }
        const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        if (match) {
          if (!patternCache[label]) {
            if (match[2]) {
              patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
            } else {
              patternCache[label] = [label, match[1], true];
            }
          }
          return patternCache[label];
        }
        return null;
      };
      exports.getPattern = getPattern;
      var getPathFromURL = (url, params = { strict: true }) => {
        if (params.strict === false && url.endsWith("/")) {
          url = url.slice(0, -1);
        }
        const match = url.match(URL_REGEXP);
        if (match) {
          return match[1];
        }
        return "";
      };
      exports.getPathFromURL = getPathFromURL;
      var isAbsoluteURL = (url) => {
        const match = url.match(URL_REGEXP);
        if (match) {
          return true;
        }
        return false;
      };
      exports.isAbsoluteURL = isAbsoluteURL;
      var mergePath = (...paths) => {
        let p = "";
        let endsWithSlash = false;
        for (let path of paths) {
          if (p.endsWith("/")) {
            p = p.slice(0, -1);
            endsWithSlash = true;
          }
          if (!path.startsWith("/")) {
            path = `/${path}`;
          }
          if (path === "/" && endsWithSlash) {
            p = `${p}/`;
          } else if (path !== "/") {
            p = `${p}${path}`;
          }
          if (path === "/" && p === "") {
            p = "/";
          }
        }
        return p;
      };
      exports.mergePath = mergePath;
    }
  });

  // node_modules/hono/dist/context.js
  var require_context = __commonJS({
    "node_modules/hono/dist/context.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Context = void 0;
      var response_1 = require_response();
      var url_1 = require_url();
      var Context = class {
        constructor(req, opts = {
          env: {},
          event: void 0,
          res: void 0
        }) {
          this._status = 200;
          this._pretty = false;
          this._prettySpace = 2;
          this.req = this.initRequest(req);
          this._map = {};
          Object.assign(this, opts);
          if (!this.res) {
            const res = new response_1.HonoResponse(null, { status: 404 });
            res._finalized = false;
            this.res = res;
          }
        }
        initRequest(req) {
          req.header = (name) => {
            if (name) {
              return req.headers.get(name);
            } else {
              const result = {};
              for (const [key, value] of req.headers) {
                result[key] = value;
              }
              return result;
            }
          };
          req.query = (key) => {
            const url = new URL(req.url);
            if (key) {
              return url.searchParams.get(key);
            } else {
              const result = {};
              for (const key2 of url.searchParams.keys()) {
                result[key2] = url.searchParams.get(key2) || "";
              }
              return result;
            }
          };
          req.queries = (key) => {
            const url = new URL(req.url);
            if (key) {
              return url.searchParams.getAll(key);
            } else {
              const result = {};
              for (const key2 of url.searchParams.keys()) {
                result[key2] = url.searchParams.getAll(key2);
              }
              return result;
            }
          };
          return req;
        }
        header(name, value) {
          this.res.headers.set(name, value);
        }
        status(status) {
          this._status = status;
        }
        set(key, value) {
          this._map[key] = value;
        }
        get(key) {
          return this._map[key];
        }
        pretty(prettyJSON, space = 2) {
          this._pretty = prettyJSON;
          this._prettySpace = space;
        }
        newResponse(data, init = {}) {
          init.status = init.status || this._status || 200;
          const headers = {};
          this.res.headers.forEach((v, k) => {
            headers[k] = v;
          });
          init.headers = Object.assign(headers, init.headers);
          return new Response(data, init);
        }
        body(data, status = this._status, headers = {}) {
          return this.newResponse(data, {
            status,
            headers
          });
        }
        text(text, status = this._status, headers = {}) {
          if (typeof text !== "string") {
            throw new TypeError("text method arg must be a string!");
          }
          headers["Content-Type"] || (headers["Content-Type"] = "text/plain; charset=UTF-8");
          return this.body(text, status, headers);
        }
        json(object, status = this._status, headers = {}) {
          if (typeof object !== "object") {
            throw new TypeError("json method arg must be an object!");
          }
          const body = this._pretty ? JSON.stringify(object, null, this._prettySpace) : JSON.stringify(object);
          headers["Content-Type"] || (headers["Content-Type"] = "application/json; charset=UTF-8");
          return this.body(body, status, headers);
        }
        html(html, status = this._status, headers = {}) {
          if (typeof html !== "string") {
            throw new TypeError("html method arg must be a string!");
          }
          headers["Content-Type"] || (headers["Content-Type"] = "text/html; charset=UTF-8");
          return this.body(html, status, headers);
        }
        redirect(location, status = 302) {
          if (typeof location !== "string") {
            throw new TypeError("location must be a string!");
          }
          if (!(0, url_1.isAbsoluteURL)(location)) {
            const url = new URL(this.req.url);
            url.pathname = location;
            location = url.toString();
          }
          return this.newResponse(null, {
            status,
            headers: {
              Location: location
            }
          });
        }
      };
      exports.Context = Context;
    }
  });

  // node_modules/hono/dist/compose.js
  var require_compose = __commonJS({
    "node_modules/hono/dist/compose.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.compose = void 0;
      var context_1 = require_context();
      var compose = (middleware, onError, onNotFound) => {
        return async (context, next) => {
          let index = -1;
          return dispatch(0);
          async function dispatch(i) {
            if (i <= index) {
              return Promise.reject(new Error("next() called multiple times"));
            }
            let handler = middleware[i];
            index = i;
            if (i === middleware.length && next)
              handler = next;
            if (!handler) {
              if (context instanceof context_1.Context && context.res._finalized === false && onNotFound) {
                context.res = onNotFound(context);
                context.res._finalized = true;
              }
              return Promise.resolve(context);
            }
            return Promise.resolve(handler(context, dispatch.bind(null, i + 1))).then(async (res) => {
              if (res && context instanceof context_1.Context) {
                context.res = res;
                context.res._finalized = true;
              }
              return context;
            }).catch((err) => {
              if (context instanceof context_1.Context && onError) {
                if (err instanceof Error) {
                  context.res = onError(err, context);
                  context.res._finalized = true;
                }
                return context;
              } else {
                throw err;
              }
            });
          }
        };
      };
      exports.compose = compose;
    }
  });

  // node_modules/hono/dist/router.js
  var require_router = __commonJS({
    "node_modules/hono/dist/router.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.METHOD_NAME_ALL_LOWERCASE = exports.METHOD_NAME_ALL = void 0;
      exports.METHOD_NAME_ALL = "ALL";
      exports.METHOD_NAME_ALL_LOWERCASE = "all";
    }
  });

  // node_modules/hono/dist/router/trie-router/node.js
  var require_node = __commonJS({
    "node_modules/hono/dist/router/trie-router/node.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Node = void 0;
      var router_1 = require_router();
      var url_1 = require_url();
      function findParam(node, name) {
        for (let i = 0, len = node.patterns.length; i < len; i++) {
          if (typeof node.patterns[i] === "object" && node.patterns[i][1] === name) {
            return true;
          }
        }
        const nodes = Object.values(node.children);
        for (let i = 0, len = nodes.length; i < len; i++) {
          if (findParam(nodes[i], name)) {
            return true;
          }
        }
        return false;
      }
      var Node = class {
        constructor(method, handler, children) {
          this.order = 0;
          this.children = children || {};
          this.methods = [];
          if (method && handler) {
            const m = {};
            m[method] = { handler, score: 0, name: this.name };
            this.methods = [m];
          }
          this.patterns = [];
        }
        insert(method, path, handler) {
          this.name = `${method} ${path}`;
          this.order = ++this.order;
          let curNode = this;
          const parts = (0, url_1.splitPath)(path);
          const parentPatterns = [];
          const errorMessage = (name) => {
            return `Duplicate param name, use another name instead of '${name}' - ${method} ${path} <--- '${name}'`;
          };
          for (let i = 0, len = parts.length; i < len; i++) {
            const p = parts[i];
            if (Object.keys(curNode.children).includes(p)) {
              parentPatterns.push(...curNode.patterns);
              curNode = curNode.children[p];
              continue;
            }
            curNode.children[p] = new Node();
            const pattern = (0, url_1.getPattern)(p);
            if (pattern) {
              if (typeof pattern === "object") {
                for (let j = 0, len2 = parentPatterns.length; j < len2; j++) {
                  if (typeof parentPatterns[j] === "object" && parentPatterns[j][1] === pattern[1]) {
                    throw new Error(errorMessage(pattern[1]));
                  }
                }
                if (Object.values(curNode.children).some((n) => findParam(n, pattern[1]))) {
                  throw new Error(errorMessage(pattern[1]));
                }
              }
              curNode.patterns.push(pattern);
              parentPatterns.push(...curNode.patterns);
            }
            parentPatterns.push(...curNode.patterns);
            curNode = curNode.children[p];
          }
          let score = 1;
          if (path === "*") {
            score = score + this.order * 0.01;
          } else {
            score = parts.length + this.order * 0.01;
          }
          if (!curNode.methods.length) {
            curNode.methods = [];
          }
          const m = {};
          const handlerSet = { handler, name: this.name, score };
          m[method] = handlerSet;
          curNode.methods.push(m);
          return curNode;
        }
        getHandlerSets(node, method, wildcard) {
          const handlerSets = [];
          node.methods.map((m) => {
            const handlerSet = m[method] || m[router_1.METHOD_NAME_ALL];
            if (handlerSet !== void 0) {
              const hs = Object.assign({}, handlerSet);
              if (wildcard) {
                hs.score = handlerSet.score - 1;
              }
              handlerSets.push(hs);
              return;
            }
          });
          return handlerSets;
        }
        next(node, part, method, isLast) {
          const handlerSets = [];
          const nextNodes = [];
          const params = {};
          for (let j = 0, len = node.patterns.length; j < len; j++) {
            const pattern = node.patterns[j];
            if (pattern === "*") {
              const astNode = node.children["*"];
              if (astNode) {
                handlerSets.push(...this.getHandlerSets(astNode, method));
                nextNodes.push(astNode);
              }
            }
            if (part === "")
              continue;
            const [key, name, matcher] = pattern;
            if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
              if (typeof key === "string") {
                if (isLast === true) {
                  handlerSets.push(...this.getHandlerSets(node.children[key], method));
                }
                nextNodes.push(node.children[key]);
              }
              if (typeof name === "string") {
                params[name] = part;
              }
            }
          }
          const nextNode = node.children[part];
          if (nextNode) {
            if (isLast === true) {
              if (nextNode.children["*"]) {
                handlerSets.push(...this.getHandlerSets(nextNode.children["*"], method, true));
              }
              handlerSets.push(...this.getHandlerSets(nextNode, method));
            }
            nextNodes.push(nextNode);
          }
          const next = {
            nodes: nextNodes,
            handlerSets,
            params
          };
          return next;
        }
        search(method, path) {
          const handlerSets = [];
          let params = {};
          const curNode = this;
          let curNodes = [curNode];
          const parts = (0, url_1.splitPath)(path);
          for (let i = 0, len = parts.length; i < len; i++) {
            const p = parts[i];
            const isLast = i === len - 1;
            const tempNodes = [];
            for (let j = 0, len2 = curNodes.length; j < len2; j++) {
              const res = this.next(curNodes[j], p, method, isLast);
              if (res.nodes.length === 0) {
                continue;
              }
              handlerSets.push(...res.handlerSets);
              params = Object.assign(params, res.params);
              tempNodes.push(...res.nodes);
            }
            curNodes = tempNodes;
          }
          if (handlerSets.length <= 0)
            return null;
          const handlers = handlerSets.sort((a, b) => {
            return a.score - b.score;
          }).map((s) => {
            return s.handler;
          });
          return { handlers, params };
        }
      };
      exports.Node = Node;
    }
  });

  // node_modules/hono/dist/router/trie-router/router.js
  var require_router2 = __commonJS({
    "node_modules/hono/dist/router/trie-router/router.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TrieRouter = void 0;
      var node_1 = require_node();
      var TrieRouter = class {
        constructor() {
          this.node = new node_1.Node();
        }
        add(method, path, handler) {
          this.node.insert(method, path, handler);
        }
        match(method, path) {
          return this.node.search(method, path);
        }
      };
      exports.TrieRouter = TrieRouter;
    }
  });

  // node_modules/hono/dist/router/trie-router/index.js
  var require_trie_router = __commonJS({
    "node_modules/hono/dist/router/trie-router/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TrieRouter = void 0;
      var router_1 = require_router2();
      Object.defineProperty(exports, "TrieRouter", { enumerable: true, get: function() {
        return router_1.TrieRouter;
      } });
    }
  });

  // node_modules/hono/dist/hono.js
  var require_hono = __commonJS({
    "node_modules/hono/dist/hono.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Hono = void 0;
      var compose_1 = require_compose();
      var context_1 = require_context();
      var router_1 = require_router();
      var trie_router_1 = require_trie_router();
      var url_1 = require_url();
      var methods = ["get", "post", "put", "delete", "head", "options", "patch"];
      function defineDynamicClass() {
        return class {
        };
      }
      var Hono2 = class extends defineDynamicClass() {
        constructor(init = {}) {
          super();
          this.router = new trie_router_1.TrieRouter();
          this.strict = true;
          this._tempPath = "";
          this.path = "/";
          this.routes = [];
          this.notFoundHandler = (c) => {
            const message = "404 Not Found";
            return c.text(message, 404);
          };
          this.errorHandler = (err, c) => {
            console.error(`${err.stack || err.message}`);
            const message = "Internal Server Error";
            return c.text(message, 500);
          };
          const allMethods = [...methods, router_1.METHOD_NAME_ALL_LOWERCASE];
          allMethods.map((method) => {
            this[method] = (args1, ...args) => {
              if (typeof args1 === "string") {
                this.path = args1;
              } else {
                this.addRoute(method, this.path, args1);
              }
              args.map((handler) => {
                if (typeof handler !== "string") {
                  this.addRoute(method, this.path, handler);
                }
              });
              return this;
            };
          });
          Object.assign(this, init);
        }
        route(path, app2) {
          this._tempPath = path;
          if (app2) {
            app2.routes.map((r) => {
              this.addRoute(r.method, r.path, r.handler);
            });
            this._tempPath = "";
          }
          return this;
        }
        use(arg1, ...handlers) {
          if (typeof arg1 === "string") {
            this.path = arg1;
          } else {
            handlers.unshift(arg1);
          }
          handlers.map((handler) => {
            this.addRoute(router_1.METHOD_NAME_ALL, this.path, handler);
          });
          return this;
        }
        onError(handler) {
          this.errorHandler = handler;
          return this;
        }
        notFound(handler) {
          this.notFoundHandler = handler;
          return this;
        }
        addRoute(method, path, handler) {
          method = method.toUpperCase();
          if (this._tempPath) {
            path = (0, url_1.mergePath)(this._tempPath, path);
          }
          this.router.add(method, path, handler);
          const r = { path, method, handler };
          this.routes.push(r);
        }
        async matchRoute(method, path) {
          return this.router.match(method, path);
        }
        async dispatch(request, event, env) {
          const path = (0, url_1.getPathFromURL)(request.url, { strict: this.strict });
          const method = request.method;
          const result = await this.matchRoute(method, path);
          request.param = (key) => {
            if (result) {
              if (key) {
                return result.params[key];
              } else {
                return result.params;
              }
            }
            return null;
          };
          const handlers = result ? result.handlers : [this.notFoundHandler];
          const c = new context_1.Context(request, {
            env,
            event
          });
          c.notFound = () => this.notFoundHandler(c);
          const composed = (0, compose_1.compose)(handlers, this.errorHandler, this.notFoundHandler);
          let context;
          try {
            context = await composed(c);
          } catch (err) {
            if (err instanceof Error) {
              return this.errorHandler(err, c);
            }
            throw err;
          }
          if (!context.res)
            return context.notFound();
          return context.res;
        }
        async handleEvent(event) {
          return this.dispatch(event.request, event);
        }
        async fetch(request, env, event) {
          return this.dispatch(request, event, env);
        }
        request(input, requestInit) {
          const req = input instanceof Request ? input : new Request(input, requestInit);
          return this.dispatch(req);
        }
        fire() {
          addEventListener("fetch", (event) => {
            event.respondWith(this.handleEvent(event));
          });
        }
      };
      exports.Hono = Hono2;
    }
  });

  // node_modules/hono/dist/index.js
  var require_dist = __commonJS({
    "node_modules/hono/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Context = exports.Hono = void 0;
      var hono_1 = require_hono();
      Object.defineProperty(exports, "Hono", { enumerable: true, get: function() {
        return hono_1.Hono;
      } });
      var context_1 = require_context();
      Object.defineProperty(exports, "Context", { enumerable: true, get: function() {
        return context_1.Context;
      } });
    }
  });

  // src/server/worker-main.js
  var import_hono = __toESM(require_dist());

  // src/frontend/index.html
  var frontend_default = '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    \n    <meta charset="utf-8">\n    <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0"/>\n    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="author" content="Andrea Scotti">\n    \n    <title>Coora</title>\n\n    <script defer src="https://ti.coora.workers.dev/client-bundle.js"><\/script>\n\n</head>\n\n<body>\n\n    <div id="spa"></div>\n    \n</body>';

  // src/frontend/client-bundle.js.br
  var client_bundle_js_default = __toBinary("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");

  // src/frontend/client-bundle-hash-file.txt
  var client_bundle_hash_file_default = "a93950171cc87b219f0ffd5543017dc39e993505e0153b064e5d11f48f5fc344 *./src/frontend/client-bundle.js.br\n";

  // src/frontend/index-hash-file.txt
  var index_hash_file_default = "98f703352948b0a5401a8698e2ba6a50c2d627bc896234836583df47fcb0583e  ./src/frontend/index.html\n";

  // src/server/worker-main.js
  var clientBundleEtag = '"' + client_bundle_hash_file_default.split(" ")[0] + '"';
  var indexEtag = '"' + index_hash_file_default.split(" ")[0] + '"';
  var app = new import_hono.Hono();
  app.get("/client-bundle.js", (c) => {
    const ifNoneMatchValue = c.req.header("If-None-Match") || c.req.header("if-none-match");
    if (ifNoneMatchValue === clientBundleEtag) {
      c.status(304);
      return c.body("");
    } else {
      c.status(200);
      c.header("Content-Type", "text/javascript");
      c.header("Content-Encoding", "br");
      c.header("Cache-Control", "no-cache");
      c.header("Etag", clientBundleEtag);
      return c.body(client_bundle_js_default);
    }
  });
  app.get("/*", (c) => {
    const ifNoneMatchValue = c.req.header("If-None-Match") || c.req.header("if-none-match");
    if (ifNoneMatchValue === indexEtag) {
      c.status(304);
      return c.body("");
    } else {
      c.status(200);
      c.header("Cache-Control", "no-cache");
      c.header("Etag", indexEtag);
      return c.html(frontend_default);
    }
  });
  app.post("/api/*", async (c, next) => {
    await next();
    c.header("Cache-Control", "no-store");
  });
  app.notFound((c) => {
    return c.text("Qui non c'\xE8 nulla.", 404);
  });
  app.fire();
})();
