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
  var client_bundle_hash_file_default = "7bee66a8c3753373f702c533ff2c43ed6864bd81a1c444223f2836b6003629b0 *./src/frontend/client-bundle.js.br\n";

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
