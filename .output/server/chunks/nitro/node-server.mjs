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

const _l58246QNXb = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _l58246QNXb
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
    "mtime": "2023-04-16T10:23:09.550Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"f452-ag78OxQFfR142GE/+8fnSKZSKJo\"",
    "mtime": "2023-04-16T10:23:09.550Z",
    "size": 62546,
    "path": "../public/favicon.png"
  },
  "/_nuxt/_id_.b3496b03.js": {
    "type": "application/javascript",
    "etag": "\"2d5f-9HC5LiSwHGkGGcKz0S9J0frxy+E\"",
    "mtime": "2023-04-16T10:23:09.530Z",
    "size": 11615,
    "path": "../public/_nuxt/_id_.b3496b03.js"
  },
  "/_nuxt/_id_.da220998.js": {
    "type": "application/javascript",
    "etag": "\"1f5b-3OVO2nBpsHTSVI63X7S7LgjnDIo\"",
    "mtime": "2023-04-16T10:23:09.526Z",
    "size": 8027,
    "path": "../public/_nuxt/_id_.da220998.js"
  },
  "/_nuxt/_id_.f5d33a88.js": {
    "type": "application/javascript",
    "etag": "\"151c-fuYTDzG49LFlBFc4SKCnixAXg3A\"",
    "mtime": "2023-04-16T10:23:09.526Z",
    "size": 5404,
    "path": "../public/_nuxt/_id_.f5d33a88.js"
  },
  "/_nuxt/auth.3c89fa37.js": {
    "type": "application/javascript",
    "etag": "\"db-zNTA8Mm95BaAI77if1dm+x5amEw\"",
    "mtime": "2023-04-16T10:23:09.526Z",
    "size": 219,
    "path": "../public/_nuxt/auth.3c89fa37.js"
  },
  "/_nuxt/composables.2746e546.js": {
    "type": "application/javascript",
    "etag": "\"61-PczYO51pbnhEZitLOFFL1oCxs5M\"",
    "mtime": "2023-04-16T10:23:09.526Z",
    "size": 97,
    "path": "../public/_nuxt/composables.2746e546.js"
  },
  "/_nuxt/default.c2823c45.js": {
    "type": "application/javascript",
    "etag": "\"1a1-ZDm4y0BDDXFT01/GfRdJmpRP77U\"",
    "mtime": "2023-04-16T10:23:09.522Z",
    "size": 417,
    "path": "../public/_nuxt/default.c2823c45.js"
  },
  "/_nuxt/entry.035ea4dc.js": {
    "type": "application/javascript",
    "etag": "\"21fa0-JGrz7xJ++Ix1dq+Fz3bfcKzHctk\"",
    "mtime": "2023-04-16T10:23:09.522Z",
    "size": 139168,
    "path": "../public/_nuxt/entry.035ea4dc.js"
  },
  "/_nuxt/entry.29b7e700.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5764-iFG3sWb3SJViuyUEVLyK2MmHsBs\"",
    "mtime": "2023-04-16T10:23:09.518Z",
    "size": 22372,
    "path": "../public/_nuxt/entry.29b7e700.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-04-16T10:23:09.514Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.f7cf310e.js": {
    "type": "application/javascript",
    "etag": "\"8f4-j/uzoCCjSofmV6lo+5hnzTYY7Us\"",
    "mtime": "2023-04-16T10:23:09.514Z",
    "size": 2292,
    "path": "../public/_nuxt/error-404.f7cf310e.js"
  },
  "/_nuxt/error-500.263be9c0.js": {
    "type": "application/javascript",
    "etag": "\"778-AcL10IZcJX8Hue4+wAuLsJ2X/y8\"",
    "mtime": "2023-04-16T10:23:09.514Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.263be9c0.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-04-16T10:23:09.510Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.c3fd3296.js": {
    "type": "application/javascript",
    "etag": "\"4b0-l26GGt+04iM18C5yw1btwbwI9sg\"",
    "mtime": "2023-04-16T10:23:09.510Z",
    "size": 1200,
    "path": "../public/_nuxt/error-component.c3fd3296.js"
  },
  "/_nuxt/guest.8b96b670.js": {
    "type": "application/javascript",
    "etag": "\"c8-L9fwRZnkhmt7tdcSapWVKcYlVKY\"",
    "mtime": "2023-04-16T10:23:09.510Z",
    "size": 200,
    "path": "../public/_nuxt/guest.8b96b670.js"
  },
  "/_nuxt/index.0528622a.js": {
    "type": "application/javascript",
    "etag": "\"423-F3LXe8UN1xPDRNuuHDoUamwySow\"",
    "mtime": "2023-04-16T10:23:09.510Z",
    "size": 1059,
    "path": "../public/_nuxt/index.0528622a.js"
  },
  "/_nuxt/index.0d132dda.js": {
    "type": "application/javascript",
    "etag": "\"19d2-PMQ3/zMNHtYBvd+2u/aOe6PRGjU\"",
    "mtime": "2023-04-16T10:23:09.506Z",
    "size": 6610,
    "path": "../public/_nuxt/index.0d132dda.js"
  },
  "/_nuxt/index.1017798c.js": {
    "type": "application/javascript",
    "etag": "\"3148e-GSkBSva5w9CsjqWDWoyK/7u9hNg\"",
    "mtime": "2023-04-16T10:23:09.506Z",
    "size": 201870,
    "path": "../public/_nuxt/index.1017798c.js"
  },
  "/_nuxt/index.14491d3c.js": {
    "type": "application/javascript",
    "etag": "\"17ec-r0+biTZVgc3a67lN1zYoRtiCKgY\"",
    "mtime": "2023-04-16T10:23:09.506Z",
    "size": 6124,
    "path": "../public/_nuxt/index.14491d3c.js"
  },
  "/_nuxt/index.1718bae2.js": {
    "type": "application/javascript",
    "etag": "\"18a3-cgOl6f5P5Z4ycj6ktJf/ys7RS/Q\"",
    "mtime": "2023-04-16T10:23:09.502Z",
    "size": 6307,
    "path": "../public/_nuxt/index.1718bae2.js"
  },
  "/_nuxt/index.23b91f34.js": {
    "type": "application/javascript",
    "etag": "\"1a8b-w0AdU+ilxaq2LHT+2qheW0pIUQo\"",
    "mtime": "2023-04-16T10:23:09.502Z",
    "size": 6795,
    "path": "../public/_nuxt/index.23b91f34.js"
  },
  "/_nuxt/index.683f3b2a.js": {
    "type": "application/javascript",
    "etag": "\"13cd-OP70fJAF0y08XGOip9sFtaGEW+k\"",
    "mtime": "2023-04-16T10:23:09.502Z",
    "size": 5069,
    "path": "../public/_nuxt/index.683f3b2a.js"
  },
  "/_nuxt/index.70d8b26a.js": {
    "type": "application/javascript",
    "etag": "\"97-VY1X/RGu2IDDbvOVBQsjB2lW4Mg\"",
    "mtime": "2023-04-16T10:23:09.502Z",
    "size": 151,
    "path": "../public/_nuxt/index.70d8b26a.js"
  },
  "/_nuxt/index.905534a5.js": {
    "type": "application/javascript",
    "etag": "\"97-VY1X/RGu2IDDbvOVBQsjB2lW4Mg\"",
    "mtime": "2023-04-16T10:23:09.502Z",
    "size": 151,
    "path": "../public/_nuxt/index.905534a5.js"
  },
  "/_nuxt/index.b11bd0a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b-ImEvqXh5JZi377yituJag5/8YcQ\"",
    "mtime": "2023-04-16T10:23:09.498Z",
    "size": 43,
    "path": "../public/_nuxt/index.b11bd0a7.css"
  },
  "/_nuxt/index.b6103035.js": {
    "type": "application/javascript",
    "etag": "\"2527-EzMJLB1AuwpHRXAhIOFPojvoAwU\"",
    "mtime": "2023-04-16T10:23:09.498Z",
    "size": 9511,
    "path": "../public/_nuxt/index.b6103035.js"
  },
  "/_nuxt/index.e4dc7a81.js": {
    "type": "application/javascript",
    "etag": "\"1af4-xFGbcbst8FsvOI+QcxHZvqJvo4A\"",
    "mtime": "2023-04-16T10:23:09.494Z",
    "size": 6900,
    "path": "../public/_nuxt/index.e4dc7a81.js"
  },
  "/_nuxt/infos-panel.vue.69e152e8.js": {
    "type": "application/javascript",
    "etag": "\"1344-1z3f89oesduexOF+9PSdfa2SJJQ\"",
    "mtime": "2023-04-16T10:23:09.490Z",
    "size": 4932,
    "path": "../public/_nuxt/infos-panel.vue.69e152e8.js"
  },
  "/_nuxt/loader.vue.59f357c1.js": {
    "type": "application/javascript",
    "etag": "\"6bd-nxBtG3E5QKGvrPT8Bn+PqsiJBMg\"",
    "mtime": "2023-04-16T10:23:09.490Z",
    "size": 1725,
    "path": "../public/_nuxt/loader.vue.59f357c1.js"
  },
  "/_nuxt/login.1de11275.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b-rmfx765wPwPHxiJjY8KVTRTADVQ\"",
    "mtime": "2023-04-16T10:23:09.490Z",
    "size": 59,
    "path": "../public/_nuxt/login.1de11275.css"
  },
  "/_nuxt/login.e0636880.js": {
    "type": "application/javascript",
    "etag": "\"1138-Q55c2wofDp7SJWrA8C4lYRN77Eo\"",
    "mtime": "2023-04-16T10:23:09.486Z",
    "size": 4408,
    "path": "../public/_nuxt/login.e0636880.js"
  },
  "/_nuxt/nuxt-link.e02f573c.js": {
    "type": "application/javascript",
    "etag": "\"e49-LsWG2HvO5BhpDh4+DoI4Hyj1974\"",
    "mtime": "2023-04-16T10:23:09.486Z",
    "size": 3657,
    "path": "../public/_nuxt/nuxt-link.e02f573c.js"
  },
  "/_nuxt/pagetitle.9ec62357.js": {
    "type": "application/javascript",
    "etag": "\"fb-pp60iA8DXgR0jO7eXqaXxqEbyrM\"",
    "mtime": "2023-04-16T10:23:09.486Z",
    "size": 251,
    "path": "../public/_nuxt/pagetitle.9ec62357.js"
  },
  "/_nuxt/payment-_id_.16cc41c1.js": {
    "type": "application/javascript",
    "etag": "\"97-aj+g4HceuEzN2eE87ytjkEqY4jQ\"",
    "mtime": "2023-04-16T10:23:09.486Z",
    "size": 151,
    "path": "../public/_nuxt/payment-_id_.16cc41c1.js"
  },
  "/_nuxt/private.041df752.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-yjZMpbWcFBcUln4G3kdaH5xMF/4\"",
    "mtime": "2023-04-16T10:23:09.482Z",
    "size": 55,
    "path": "../public/_nuxt/private.041df752.css"
  },
  "/_nuxt/private.0fb510f5.js": {
    "type": "application/javascript",
    "etag": "\"2984-n4A52lyNVk9WCFbOBYS19110CSE\"",
    "mtime": "2023-04-16T10:23:09.482Z",
    "size": 10628,
    "path": "../public/_nuxt/private.0fb510f5.js"
  },
  "/_nuxt/right-side-panel.vue.c197f1e9.js": {
    "type": "application/javascript",
    "etag": "\"6ed-PSx9byaHcteXZxp1RYjYWcuLz1w\"",
    "mtime": "2023-04-16T10:23:09.482Z",
    "size": 1773,
    "path": "../public/_nuxt/right-side-panel.vue.c197f1e9.js"
  },
  "/_nuxt/table.236dfbcb.js": {
    "type": "application/javascript",
    "etag": "\"4e4-PKdiAP916xWX8ZDHBc7NdSYcNaI\"",
    "mtime": "2023-04-16T10:23:09.478Z",
    "size": 1252,
    "path": "../public/_nuxt/table.236dfbcb.js"
  },
  "/_nuxt/useAlert.3ff3785f.js": {
    "type": "application/javascript",
    "etag": "\"93-LcMKfc8zw/FglOtzmYWYEuRArdc\"",
    "mtime": "2023-04-16T10:23:09.478Z",
    "size": 147,
    "path": "../public/_nuxt/useAlert.3ff3785f.js"
  },
  "/_nuxt/useAuth.b1cf9173.js": {
    "type": "application/javascript",
    "etag": "\"447-0IZVH3xUg71v+EaiDczgdfULS88\"",
    "mtime": "2023-04-16T10:23:09.478Z",
    "size": 1095,
    "path": "../public/_nuxt/useAuth.b1cf9173.js"
  },
  "/_nuxt/useDocument.0c296db6.js": {
    "type": "application/javascript",
    "etag": "\"460-ngBFJv638509rGUGPqJ3e3k4I/M\"",
    "mtime": "2023-04-16T10:23:09.474Z",
    "size": 1120,
    "path": "../public/_nuxt/useDocument.0c296db6.js"
  },
  "/_nuxt/useTrip.90562c29.js": {
    "type": "application/javascript",
    "etag": "\"2c3-275Ahr3K6Uc4rggDSbFFZa0DzIo\"",
    "mtime": "2023-04-16T10:23:09.474Z",
    "size": 707,
    "path": "../public/_nuxt/useTrip.90562c29.js"
  },
  "/_nuxt/useUser.35a2ae44.js": {
    "type": "application/javascript",
    "etag": "\"5a1-z3Tf3pCjb84LLY4CYn378eGJXc0\"",
    "mtime": "2023-04-16T10:23:09.474Z",
    "size": 1441,
    "path": "../public/_nuxt/useUser.35a2ae44.js"
  },
  "/_nuxt/withdrawal-_id_.1f19d73d.js": {
    "type": "application/javascript",
    "etag": "\"97-pZt8j2dooRXl4pYayK0UGsTtHJE\"",
    "mtime": "2023-04-16T10:23:09.470Z",
    "size": 151,
    "path": "../public/_nuxt/withdrawal-_id_.1f19d73d.js"
  },
  "/img/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c176-kTqq3wA4rm1IEDm0+EH7OjGJvlg\"",
    "mtime": "2023-04-16T10:23:09.542Z",
    "size": 180598,
    "path": "../public/img/bg.jpg"
  },
  "/img/logo.png": {
    "type": "image/png",
    "etag": "\"3184-nge9ze9G5B8hqC0YDfHjYFoTwwk\"",
    "mtime": "2023-04-16T10:23:09.542Z",
    "size": 12676,
    "path": "../public/img/logo.png"
  },
  "/img/logo1.png": {
    "type": "image/png",
    "etag": "\"1649-EBupSTVY6+/zGp/QxEckt+BtEOQ\"",
    "mtime": "2023-04-16T10:23:09.538Z",
    "size": 5705,
    "path": "../public/img/logo1.png"
  },
  "/img/logo2.png": {
    "type": "image/png",
    "etag": "\"8cdc-zGGj7baMhkL4UeMCkdpBdN3ur58\"",
    "mtime": "2023-04-16T10:23:09.538Z",
    "size": 36060,
    "path": "../public/img/logo2.png"
  },
  "/img/user.jpeg": {
    "type": "image/jpeg",
    "etag": "\"6c0-ltgvljA7vMvxLuqIjom0RQA0ZhU\"",
    "mtime": "2023-04-16T10:23:09.534Z",
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

const _lazy_r7Qp4V = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_r7Qp4V, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_r7Qp4V, lazy: true, middleware: false, method: undefined }
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
