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
  var client_bundle_hash_file_default = "5533e02fd465ce8e1876c3468f0cf566a87447c464890d295d80a633815df0ef *./src/frontend/client-bundle.js.br\n";

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
