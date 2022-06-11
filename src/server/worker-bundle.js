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
  var client_bundle_hash_file_default = "6349ec1ed531d833f59c4322d4b19e0ad7503c3f5d2234d947730f353a635b49 *./src/frontend/client-bundle.js.br\n";

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
