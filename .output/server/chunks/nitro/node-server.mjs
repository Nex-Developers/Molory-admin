globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=2592000, immutable"}}}},"public":{"BASE_URL":"https://molory.xyz/backend/api"}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "\"use strict\";const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _YkoWel7yuI = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _YkoWel7yuI
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.node.req.url?.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-09-19T06:21:46.806Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"f452-ag78OxQFfR142GE/+8fnSKZSKJo\"",
    "mtime": "2023-09-19T06:21:46.805Z",
    "size": 62546,
    "path": "../public/favicon.png"
  },
  "/_nuxt/_id_.7cf5f009.js": {
    "type": "application/javascript",
    "etag": "\"f08-2IjutuTVaiqXohAcV/wPhUuSd6c\"",
    "mtime": "2023-09-19T06:21:46.791Z",
    "size": 3848,
    "path": "../public/_nuxt/_id_.7cf5f009.js"
  },
  "/_nuxt/_id_.7efd68be.js": {
    "type": "application/javascript",
    "etag": "\"d69-R5jHQEf5Yx61O9aLzX/9xJPRbpk\"",
    "mtime": "2023-09-19T06:21:46.790Z",
    "size": 3433,
    "path": "../public/_nuxt/_id_.7efd68be.js"
  },
  "/_nuxt/_id_.ad2ee551.js": {
    "type": "application/javascript",
    "etag": "\"2f09-eCuTQEceWK+IxYRNt4tS6xwVFd8\"",
    "mtime": "2023-09-19T06:21:46.789Z",
    "size": 12041,
    "path": "../public/_nuxt/_id_.ad2ee551.js"
  },
  "/_nuxt/_id_.efb252c1.js": {
    "type": "application/javascript",
    "etag": "\"186f-bFUcN+1zTxtjTSSWSjL3D8Ym8gw\"",
    "mtime": "2023-09-19T06:21:46.789Z",
    "size": 6255,
    "path": "../public/_nuxt/_id_.efb252c1.js"
  },
  "/_nuxt/auth.a5829692.js": {
    "type": "application/javascript",
    "etag": "\"db-yDAXPB5kt6dlmSXm8sQWkG7LTjM\"",
    "mtime": "2023-09-19T06:21:46.788Z",
    "size": 219,
    "path": "../public/_nuxt/auth.a5829692.js"
  },
  "/_nuxt/composables.a9318829.js": {
    "type": "application/javascript",
    "etag": "\"61-AlUNZ+5Not1qimhup9CkUonHBzc\"",
    "mtime": "2023-09-19T06:21:46.787Z",
    "size": 97,
    "path": "../public/_nuxt/composables.a9318829.js"
  },
  "/_nuxt/default.6649e3b9.js": {
    "type": "application/javascript",
    "etag": "\"1a1-NhEr1r9GGw1Ksj1jHag0VyoyNSU\"",
    "mtime": "2023-09-19T06:21:46.787Z",
    "size": 417,
    "path": "../public/_nuxt/default.6649e3b9.js"
  },
  "/_nuxt/entry.c4e1b39e.js": {
    "type": "application/javascript",
    "etag": "\"22716-e2nehbZKlAwUIUGxNNFWmPkUHIw\"",
    "mtime": "2023-09-19T06:21:46.786Z",
    "size": 141078,
    "path": "../public/_nuxt/entry.c4e1b39e.js"
  },
  "/_nuxt/entry.debcb684.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5995-sgEwMmOXlgR06sarPduihg/dZ4s\"",
    "mtime": "2023-09-19T06:21:46.784Z",
    "size": 22933,
    "path": "../public/_nuxt/entry.debcb684.css"
  },
  "/_nuxt/error-404.097be809.js": {
    "type": "application/javascript",
    "etag": "\"8f4-iCwbIUHilB1G+9KFs5DCIhX/hxw\"",
    "mtime": "2023-09-19T06:21:46.783Z",
    "size": 2292,
    "path": "../public/_nuxt/error-404.097be809.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-09-19T06:21:46.782Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.3f53ea7a.js": {
    "type": "application/javascript",
    "etag": "\"778-zVH/2k46zCbtA9LI8xxPTuq5uDM\"",
    "mtime": "2023-09-19T06:21:46.782Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.3f53ea7a.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-09-19T06:21:46.781Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.b5860987.js": {
    "type": "application/javascript",
    "etag": "\"4b0-EUhbPq3xhr3bX0ljM2PA9ub6wJ4\"",
    "mtime": "2023-09-19T06:21:46.780Z",
    "size": 1200,
    "path": "../public/_nuxt/error-component.b5860987.js"
  },
  "/_nuxt/guest.76bbd2fd.js": {
    "type": "application/javascript",
    "etag": "\"c8-6HHbilOFmu+um5Q0rQKE4mKyVdk\"",
    "mtime": "2023-09-19T06:21:46.780Z",
    "size": 200,
    "path": "../public/_nuxt/guest.76bbd2fd.js"
  },
  "/_nuxt/index.0373e5e7.js": {
    "type": "application/javascript",
    "etag": "\"1953-8C0wnFdUPB1to7SMQPnDyWKGn9g\"",
    "mtime": "2023-09-19T06:21:46.778Z",
    "size": 6483,
    "path": "../public/_nuxt/index.0373e5e7.js"
  },
  "/_nuxt/index.67e76cb0.js": {
    "type": "application/javascript",
    "etag": "\"24f1-b+LEWXatLjn7xoB8APQSSdvSApc\"",
    "mtime": "2023-09-19T06:21:46.778Z",
    "size": 9457,
    "path": "../public/_nuxt/index.67e76cb0.js"
  },
  "/_nuxt/index.7c2b7cdb.js": {
    "type": "application/javascript",
    "etag": "\"1ad6-Kj/HjkxlmE5MDJv/U2OpJi1OUDg\"",
    "mtime": "2023-09-19T06:21:46.777Z",
    "size": 6870,
    "path": "../public/_nuxt/index.7c2b7cdb.js"
  },
  "/_nuxt/index.8bc9e86e.js": {
    "type": "application/javascript",
    "etag": "\"1a62-y/rwa0aQc+Bo1nuwfyTMIzNEx5c\"",
    "mtime": "2023-09-19T06:21:46.776Z",
    "size": 6754,
    "path": "../public/_nuxt/index.8bc9e86e.js"
  },
  "/_nuxt/index.906535f0.js": {
    "type": "application/javascript",
    "etag": "\"97-bZErVdI/LA64R44+I+AXwiqKOoA\"",
    "mtime": "2023-09-19T06:21:46.776Z",
    "size": 151,
    "path": "../public/_nuxt/index.906535f0.js"
  },
  "/_nuxt/index.96825596.js": {
    "type": "application/javascript",
    "etag": "\"97-bZErVdI/LA64R44+I+AXwiqKOoA\"",
    "mtime": "2023-09-19T06:21:46.775Z",
    "size": 151,
    "path": "../public/_nuxt/index.96825596.js"
  },
  "/_nuxt/index.9ea11fa7.js": {
    "type": "application/javascript",
    "etag": "\"89d-LeRGIZq7uJjADkb2xU1zUpfpb5c\"",
    "mtime": "2023-09-19T06:21:46.774Z",
    "size": 2205,
    "path": "../public/_nuxt/index.9ea11fa7.js"
  },
  "/_nuxt/index.b11bd0a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b-ImEvqXh5JZi377yituJag5/8YcQ\"",
    "mtime": "2023-09-19T06:21:46.773Z",
    "size": 43,
    "path": "../public/_nuxt/index.b11bd0a7.css"
  },
  "/_nuxt/index.df0a788c.js": {
    "type": "application/javascript",
    "etag": "\"160e-vcOxTC+CLwx9psSrhaSFK4CL1jE\"",
    "mtime": "2023-09-19T06:21:46.773Z",
    "size": 5646,
    "path": "../public/_nuxt/index.df0a788c.js"
  },
  "/_nuxt/index.e84def70.js": {
    "type": "application/javascript",
    "etag": "\"1808-Dk1M9aklx2eu5CAMswdR051vbvo\"",
    "mtime": "2023-09-19T06:21:46.772Z",
    "size": 6152,
    "path": "../public/_nuxt/index.e84def70.js"
  },
  "/_nuxt/index.e99d5a56.js": {
    "type": "application/javascript",
    "etag": "\"1cc4-dHUkB7lQlTQdqZCq7NaTGgZa6d8\"",
    "mtime": "2023-09-19T06:21:46.771Z",
    "size": 7364,
    "path": "../public/_nuxt/index.e99d5a56.js"
  },
  "/_nuxt/index.f02fbf24.js": {
    "type": "application/javascript",
    "etag": "\"2627-r/jGRCI7OcS+bEpj/LI0LoiFfg4\"",
    "mtime": "2023-09-19T06:21:46.770Z",
    "size": 9767,
    "path": "../public/_nuxt/index.f02fbf24.js"
  },
  "/_nuxt/item.vue.d7e2cfad.js": {
    "type": "application/javascript",
    "etag": "\"19cb-SYG7R9o3QY7GEJPAmt1Hj3ad8PU\"",
    "mtime": "2023-09-19T06:21:46.769Z",
    "size": 6603,
    "path": "../public/_nuxt/item.vue.d7e2cfad.js"
  },
  "/_nuxt/loader.vue.d893f0d1.js": {
    "type": "application/javascript",
    "etag": "\"6bd-fg967bgkx59Ws4D1LEEDIiO2BLQ\"",
    "mtime": "2023-09-19T06:21:46.769Z",
    "size": 1725,
    "path": "../public/_nuxt/loader.vue.d893f0d1.js"
  },
  "/_nuxt/login.1de11275.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b-rmfx765wPwPHxiJjY8KVTRTADVQ\"",
    "mtime": "2023-09-19T06:21:46.768Z",
    "size": 59,
    "path": "../public/_nuxt/login.1de11275.css"
  },
  "/_nuxt/login.c507f626.js": {
    "type": "application/javascript",
    "etag": "\"1138-SfGrAFHw77MPVjZn3ianuiFykuQ\"",
    "mtime": "2023-09-19T06:21:46.767Z",
    "size": 4408,
    "path": "../public/_nuxt/login.c507f626.js"
  },
  "/_nuxt/nuxt-link.68495e76.js": {
    "type": "application/javascript",
    "etag": "\"e53-xLKtasdB13Fn6JoO7tKva1o6gHI\"",
    "mtime": "2023-09-19T06:21:46.767Z",
    "size": 3667,
    "path": "../public/_nuxt/nuxt-link.68495e76.js"
  },
  "/_nuxt/pagetitle.be586eb7.js": {
    "type": "application/javascript",
    "etag": "\"fb-YrZvDrScjquSxT/theBctk7/n6M\"",
    "mtime": "2023-09-19T06:21:46.763Z",
    "size": 251,
    "path": "../public/_nuxt/pagetitle.be586eb7.js"
  },
  "/_nuxt/payment-_id_.b16082f2.js": {
    "type": "application/javascript",
    "etag": "\"97-K9ojMMuIIemle/GcXzZvfWeKIuA\"",
    "mtime": "2023-09-19T06:21:46.761Z",
    "size": 151,
    "path": "../public/_nuxt/payment-_id_.b16082f2.js"
  },
  "/_nuxt/private.041df752.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-yjZMpbWcFBcUln4G3kdaH5xMF/4\"",
    "mtime": "2023-09-19T06:21:46.760Z",
    "size": 55,
    "path": "../public/_nuxt/private.041df752.css"
  },
  "/_nuxt/private.9941861d.js": {
    "type": "application/javascript",
    "etag": "\"2a58-qbgzTwshxzgJw8hFJ4dvp1ONhpc\"",
    "mtime": "2023-09-19T06:21:46.759Z",
    "size": 10840,
    "path": "../public/_nuxt/private.9941861d.js"
  },
  "/_nuxt/right-side-panel.vue.b6deb3a8.js": {
    "type": "application/javascript",
    "etag": "\"6ed-59cLh4pwm1f1ZvX0HChaQxEab94\"",
    "mtime": "2023-09-19T06:21:46.759Z",
    "size": 1773,
    "path": "../public/_nuxt/right-side-panel.vue.b6deb3a8.js"
  },
  "/_nuxt/useAlert.d4368e4e.js": {
    "type": "application/javascript",
    "etag": "\"7b-F1iQ0vqwLokyS+Yf2N0jQg7pVMI\"",
    "mtime": "2023-09-19T06:21:46.758Z",
    "size": 123,
    "path": "../public/_nuxt/useAlert.d4368e4e.js"
  },
  "/_nuxt/useAuth.420e90ee.js": {
    "type": "application/javascript",
    "etag": "\"447-JPzukDT1hHKAV58wbzelyZdH5nA\"",
    "mtime": "2023-09-19T06:21:46.758Z",
    "size": 1095,
    "path": "../public/_nuxt/useAuth.420e90ee.js"
  },
  "/_nuxt/useDocument.8f3518de.js": {
    "type": "application/javascript",
    "etag": "\"4cd-jLHXHzkOJwb3qaJABB4Y1ALt8eo\"",
    "mtime": "2023-09-19T06:21:46.757Z",
    "size": 1229,
    "path": "../public/_nuxt/useDocument.8f3518de.js"
  },
  "/_nuxt/useStat.fe8d38f0.js": {
    "type": "application/javascript",
    "etag": "\"18e-rmy7DURlfi+0xc+Al6Fy70AH05E\"",
    "mtime": "2023-09-19T06:21:46.757Z",
    "size": 398,
    "path": "../public/_nuxt/useStat.fe8d38f0.js"
  },
  "/_nuxt/useTransaction.fe199686.js": {
    "type": "application/javascript",
    "etag": "\"222-0Ptn+zDsNSedmrA67EbkizjVqQ0\"",
    "mtime": "2023-09-19T06:21:46.756Z",
    "size": 546,
    "path": "../public/_nuxt/useTransaction.fe199686.js"
  },
  "/_nuxt/useTrip.badd1b12.js": {
    "type": "application/javascript",
    "etag": "\"2d1-6v8aqY2pdjbPnlIM0uqPeiaNjMU\"",
    "mtime": "2023-09-19T06:21:46.756Z",
    "size": 721,
    "path": "../public/_nuxt/useTrip.badd1b12.js"
  },
  "/_nuxt/useUser.14f00cb8.js": {
    "type": "application/javascript",
    "etag": "\"5dd-OIto1ij11rPPguw3G4JUAjTJtPY\"",
    "mtime": "2023-09-19T06:21:46.755Z",
    "size": 1501,
    "path": "../public/_nuxt/useUser.14f00cb8.js"
  },
  "/_nuxt/user-infos.vue.f0b9be48.js": {
    "type": "application/javascript",
    "etag": "\"c38-7cqXxZe91fhqyPbi88qhMX5vno0\"",
    "mtime": "2023-09-19T06:21:46.755Z",
    "size": 3128,
    "path": "../public/_nuxt/user-infos.vue.f0b9be48.js"
  },
  "/_nuxt/withdrawal-_id_.df1c576d.js": {
    "type": "application/javascript",
    "etag": "\"97-PCMekMXncUOCAiHTZ7T+GxovbzQ\"",
    "mtime": "2023-09-19T06:21:46.754Z",
    "size": 151,
    "path": "../public/_nuxt/withdrawal-_id_.df1c576d.js"
  },
  "/img/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c176-kTqq3wA4rm1IEDm0+EH7OjGJvlg\"",
    "mtime": "2023-09-19T06:21:46.803Z",
    "size": 180598,
    "path": "../public/img/bg.jpg"
  },
  "/img/logo.png": {
    "type": "image/png",
    "etag": "\"3184-nge9ze9G5B8hqC0YDfHjYFoTwwk\"",
    "mtime": "2023-09-19T06:21:46.798Z",
    "size": 12676,
    "path": "../public/img/logo.png"
  },
  "/img/logo1.png": {
    "type": "image/png",
    "etag": "\"1649-EBupSTVY6+/zGp/QxEckt+BtEOQ\"",
    "mtime": "2023-09-19T06:21:46.795Z",
    "size": 5705,
    "path": "../public/img/logo1.png"
  },
  "/img/logo2.png": {
    "type": "image/png",
    "etag": "\"8cdc-zGGj7baMhkL4UeMCkdpBdN3ur58\"",
    "mtime": "2023-09-19T06:21:46.794Z",
    "size": 36060,
    "path": "../public/img/logo2.png"
  },
  "/img/user.jpeg": {
    "type": "image/jpeg",
    "etag": "\"6c0-ltgvljA7vMvxLuqIjom0RQA0ZhU\"",
    "mtime": "2023-09-19T06:21:46.793Z",
    "size": 1728,
    "path": "../public/img/user.jpeg"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":2592000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_lEk6CN = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_lEk6CN, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_lEk6CN, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
