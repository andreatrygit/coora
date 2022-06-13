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
  var client_bundle_hash_file_default = "e863c349a1d48116a49c44ffedab5d2e0847a7df5e7da0db5695a210d41b3f15 *./src/frontend/client-bundle.js.br\n";

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
