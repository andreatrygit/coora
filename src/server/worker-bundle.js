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
  var client_bundle_hash_file_default = "f0b412907c2ed1297de631603490fecdd86955939baeb5427bbc2cb6164420e8 *./src/frontend/client-bundle.js.br\n";

  // src/frontend/index-hash-file.txt
  var index_hash_file_default = "98f703352948b0a5401a8698e2ba6a50c2d627bc896234836583df47fcb0583e  ./src/frontend/index.html\n";

  // src/server/utils.js
  function toughCookie(key, value, maxAge = null) {
    return "__Host-" + key + "=" + value + "; path=/; Secure; HttpOnly; SameSite=Strict" + (maxAge ? "; Max-Age=" + maxAge.toString() : "");
  }
  function getCookie(context, key) {
    const cookies = context.req.header("Cookie");
    if (!cookies) {
      return null;
    }
    const cookiesList = cookies.split(";");
    const trimmedList = cookiesList.map((x) => x.trim());
    const derivedKey = "__Host-" + key;
    const item = trimmedList.find((x) => x.startsWith(derivedKey));
    if (!item) {
      return null;
    }
    return item.split("=")[1];
  }
  function verifyCookieValue(context, key, value) {
    const foundValue = getCookie(context, key);
    return foundValue === value;
  }

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
  app.post("/api/website/is-cookie-policy-set", (c) => {
    if (verifyCookieValue(c, "coora-cookie-policy", "ok")) {
      c.status(200);
      return c.json({ value: "yes" });
    } else {
      c.status(200);
      c.header("Set-Cookie", toughCookie("coora-cookie-policy", "ok", 365 * 24 * 60 * 60));
      return c.json({ value: "no" });
    }
  });
  app.notFound((c) => {
    return c.text("Qui non c'\xE8 nulla.", 404);
  });
  app.fire();
})();
