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
  var client_bundle_hash_file_default = "520259533399d75cd1155c8d8e3146a4c10bb569590c0c54390d24ce707d8c76 *./src/frontend/client-bundle.js.br\n";

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
