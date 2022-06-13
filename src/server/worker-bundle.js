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
  var client_bundle_hash_file_default = "0e4a0aa81a80858e7b6e2733b3ad993d7e7727d92d8983a223d4b8a8b0347c84 *./src/frontend/client-bundle.js.br\n";

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
