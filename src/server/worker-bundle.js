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
  var frontend_default = '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n    \n    <meta charset="utf-8">\n    <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0"/>\n    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="author" content="Andrea Scotti">\n    \n    <title>Coora</title>\n\n    <script defer src="./client-bundle.js"><\/script>\n\n</head>\n\n<body>\n\n    <div id="spa"></div>\n    \n</body>';

  // src/frontend/client-bundle.js.br
  var client_bundle_js_default = __toBinary("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");

  // src/frontend/client-bundle-hash-file.txt
  var client_bundle_hash_file_default = "737ca8bf65a82deb7df55b4d89320cdf368632139dd973104da71fd7c1f89be8 *./src/frontend/client-bundle.js.br\n";

  // src/server/worker-main.js
  var clientBundleHash = client_bundle_hash_file_default.split(" ")[0];
  var app = new import_hono.Hono();
  app.get("/client-bundle.js", (c) => {
    c.status(200);
    c.header("Content-Type", "text/javascript");
    c.header("Content-Encoding", "br");
    c.header("Cache-Control", "no-cache");
    c.header("Etag", '"' + clientBundleHash + '"');
    return c.body(client_bundle_js_default);
  });
  app.get("/*", (c) => {
    c.status(200);
    c.header("Content-Encoding", "");
    return c.html(frontend_default);
  });
  app.fire();
})();
