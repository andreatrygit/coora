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
  var client_bundle_hash_file_default = "0dcecc37cbe50378c87a96db202bbd6ddd685c41e8d66a81f9e07bab3e496ed7 *./src/frontend/client-bundle.js.br\n";

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
