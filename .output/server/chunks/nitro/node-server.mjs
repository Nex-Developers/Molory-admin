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
    "mtime": "2023-10-15T17:12:24.571Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"f452-ag78OxQFfR142GE/+8fnSKZSKJo\"",
    "mtime": "2023-10-15T17:12:24.570Z",
    "size": 62546,
    "path": "../public/favicon.png"
  },
  "/_nuxt/_id_.2f88bbbe.js": {
    "type": "application/javascript",
    "etag": "\"186f-1fCgRUBfbimGexshKr8OlWPT7As\"",
    "mtime": "2023-10-15T17:12:24.564Z",
    "size": 6255,
    "path": "../public/_nuxt/_id_.2f88bbbe.js"
  },
  "/_nuxt/_id_.30ee0c5b.js": {
    "type": "application/javascript",
    "etag": "\"e0a-GzOs/LxwFl20jdeloZdQdCcOhbI\"",
    "mtime": "2023-10-15T17:12:24.564Z",
    "size": 3594,
    "path": "../public/_nuxt/_id_.30ee0c5b.js"
  },
  "/_nuxt/_id_.395141b7.js": {
    "type": "application/javascript",
    "etag": "\"f08-jyFPZjCOW1svJ5CyOd3lbzIEjTk\"",
    "mtime": "2023-10-15T17:12:24.564Z",
    "size": 3848,
    "path": "../public/_nuxt/_id_.395141b7.js"
  },
  "/_nuxt/_id_.7561eee5.js": {
    "type": "application/javascript",
    "etag": "\"3c20-zfTIWKvNjlHBo79c+egyY8qXb+g\"",
    "mtime": "2023-10-15T17:12:24.563Z",
    "size": 15392,
    "path": "../public/_nuxt/_id_.7561eee5.js"
  },
  "/_nuxt/auth.b07172d0.js": {
    "type": "application/javascript",
    "etag": "\"db-gUIu13yyW7i9KgdToEvSdgWYD18\"",
    "mtime": "2023-10-15T17:12:24.563Z",
    "size": 219,
    "path": "../public/_nuxt/auth.b07172d0.js"
  },
  "/_nuxt/composables.6c5e6029.js": {
    "type": "application/javascript",
    "etag": "\"61-9SCHZwKNUqFScP+jLKcpVir0f14\"",
    "mtime": "2023-10-15T17:12:24.562Z",
    "size": 97,
    "path": "../public/_nuxt/composables.6c5e6029.js"
  },
  "/_nuxt/default.38dff73e.js": {
    "type": "application/javascript",
    "etag": "\"1a1-oBnMm5Aazd1ivMfja3i2wHeb57k\"",
    "mtime": "2023-10-15T17:12:24.562Z",
    "size": 417,
    "path": "../public/_nuxt/default.38dff73e.js"
  },
  "/_nuxt/entry.18acea98.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"59d8-63M3snmCKjo2+eMVc1dg3xdn1q4\"",
    "mtime": "2023-10-15T17:12:24.561Z",
    "size": 23000,
    "path": "../public/_nuxt/entry.18acea98.css"
  },
  "/_nuxt/entry.2737b89d.js": {
    "type": "application/javascript",
    "etag": "\"22716-OJZ4P52ZFxNlrFNB6T9GfToHOkQ\"",
    "mtime": "2023-10-15T17:12:24.561Z",
    "size": 141078,
    "path": "../public/_nuxt/entry.2737b89d.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-10-15T17:12:24.560Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.983b5743.js": {
    "type": "application/javascript",
    "etag": "\"8f4-J8JLbvIfO48vkjFXV0cHlE6wIfw\"",
    "mtime": "2023-10-15T17:12:24.559Z",
    "size": 2292,
    "path": "../public/_nuxt/error-404.983b5743.js"
  },
  "/_nuxt/error-500.75c27e9c.js": {
    "type": "application/javascript",
    "etag": "\"778-6CM13C8GwbV2enViqI5K8L6Qsuo\"",
    "mtime": "2023-10-15T17:12:24.559Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.75c27e9c.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-10-15T17:12:24.559Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.be822170.js": {
    "type": "application/javascript",
    "etag": "\"4b0-0pMjYavMxhByHYfNi+HgQFCWm0k\"",
    "mtime": "2023-10-15T17:12:24.558Z",
    "size": 1200,
    "path": "../public/_nuxt/error-component.be822170.js"
  },
  "/_nuxt/guest.8bc81564.js": {
    "type": "application/javascript",
    "etag": "\"c8-VFFQNBMWdqIoJO9xTHGfVl2+ThQ\"",
    "mtime": "2023-10-15T17:12:24.558Z",
    "size": 200,
    "path": "../public/_nuxt/guest.8bc81564.js"
  },
  "/_nuxt/index.034c79b8.js": {
    "type": "application/javascript",
    "etag": "\"97-DIGKH+F2XEnad4/Uh77ZY0Ohdls\"",
    "mtime": "2023-10-15T17:12:24.558Z",
    "size": 151,
    "path": "../public/_nuxt/index.034c79b8.js"
  },
  "/_nuxt/index.0949bb02.js": {
    "type": "application/javascript",
    "etag": "\"1cca-nmijtCtmKz9vk2Kcc3dqRKehbGw\"",
    "mtime": "2023-10-15T17:12:24.557Z",
    "size": 7370,
    "path": "../public/_nuxt/index.0949bb02.js"
  },
  "/_nuxt/index.13ba1931.js": {
    "type": "application/javascript",
    "etag": "\"89d-fs++Nqis23+EYDvfOKgI/7XjuiQ\"",
    "mtime": "2023-10-15T17:12:24.557Z",
    "size": 2205,
    "path": "../public/_nuxt/index.13ba1931.js"
  },
  "/_nuxt/index.153a6870.js": {
    "type": "application/javascript",
    "etag": "\"160e-6y/W6cr1mpCtrbQ2O/nP0xABgeo\"",
    "mtime": "2023-10-15T17:12:24.556Z",
    "size": 5646,
    "path": "../public/_nuxt/index.153a6870.js"
  },
  "/_nuxt/index.46a8c2f2.js": {
    "type": "application/javascript",
    "etag": "\"1a62-OwqJ44tfdkh1JUiYbvFSp/RmV28\"",
    "mtime": "2023-10-15T17:12:24.556Z",
    "size": 6754,
    "path": "../public/_nuxt/index.46a8c2f2.js"
  },
  "/_nuxt/index.6be2180e.js": {
    "type": "application/javascript",
    "etag": "\"1953-qfAEDc3m4jM55PAqKN6FmSmqVqc\"",
    "mtime": "2023-10-15T17:12:24.555Z",
    "size": 6483,
    "path": "../public/_nuxt/index.6be2180e.js"
  },
  "/_nuxt/index.6c820696.js": {
    "type": "application/javascript",
    "etag": "\"97-DIGKH+F2XEnad4/Uh77ZY0Ohdls\"",
    "mtime": "2023-10-15T17:12:24.555Z",
    "size": 151,
    "path": "../public/_nuxt/index.6c820696.js"
  },
  "/_nuxt/index.7584a008.js": {
    "type": "application/javascript",
    "etag": "\"24f1-vZZ8+5oounl6jB6wPuYYmn3o9Hk\"",
    "mtime": "2023-10-15T17:12:24.554Z",
    "size": 9457,
    "path": "../public/_nuxt/index.7584a008.js"
  },
  "/_nuxt/index.83daefed.js": {
    "type": "application/javascript",
    "etag": "\"2627-D3QjFB5UKA2nDd12aEU3XShmf+I\"",
    "mtime": "2023-10-15T17:12:24.554Z",
    "size": 9767,
    "path": "../public/_nuxt/index.83daefed.js"
  },
  "/_nuxt/index.8aad1ec3.js": {
    "type": "application/javascript",
    "etag": "\"1ad6-0fwsKDVGMDWnMqztX3vQHINo0vY\"",
    "mtime": "2023-10-15T17:12:24.554Z",
    "size": 6870,
    "path": "../public/_nuxt/index.8aad1ec3.js"
  },
  "/_nuxt/index.a8394593.js": {
    "type": "application/javascript",
    "etag": "\"1863-erdcOeiMm2f8O+Qguc8ZVJzgSmg\"",
    "mtime": "2023-10-15T17:12:24.553Z",
    "size": 6243,
    "path": "../public/_nuxt/index.a8394593.js"
  },
  "/_nuxt/index.b11bd0a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b-ImEvqXh5JZi377yituJag5/8YcQ\"",
    "mtime": "2023-10-15T17:12:24.553Z",
    "size": 43,
    "path": "../public/_nuxt/index.b11bd0a7.css"
  },
  "/_nuxt/item.vue.865b54a0.js": {
    "type": "application/javascript",
    "etag": "\"19cb-uetItvUxxjiWA3+4T6wkMMjzfIg\"",
    "mtime": "2023-10-15T17:12:24.552Z",
    "size": 6603,
    "path": "../public/_nuxt/item.vue.865b54a0.js"
  },
  "/_nuxt/loader.vue.5f077fd8.js": {
    "type": "application/javascript",
    "etag": "\"6bd-UdZvfC3wz4W3BGWuZifenqc4Uf8\"",
    "mtime": "2023-10-15T17:12:24.552Z",
    "size": 1725,
    "path": "../public/_nuxt/loader.vue.5f077fd8.js"
  },
  "/_nuxt/login.1de11275.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b-rmfx765wPwPHxiJjY8KVTRTADVQ\"",
    "mtime": "2023-10-15T17:12:24.551Z",
    "size": 59,
    "path": "../public/_nuxt/login.1de11275.css"
  },
  "/_nuxt/login.286e002f.js": {
    "type": "application/javascript",
    "etag": "\"1138-v4kli6nCdQNmE7iRGcdHZbGHUow\"",
    "mtime": "2023-10-15T17:12:24.551Z",
    "size": 4408,
    "path": "../public/_nuxt/login.286e002f.js"
  },
  "/_nuxt/nuxt-link.ce404225.js": {
    "type": "application/javascript",
    "etag": "\"e53-26m41qjSI+o72Mxb1SKT5hAjCbM\"",
    "mtime": "2023-10-15T17:12:24.550Z",
    "size": 3667,
    "path": "../public/_nuxt/nuxt-link.ce404225.js"
  },
  "/_nuxt/pagetitle.65f4b3f5.js": {
    "type": "application/javascript",
    "etag": "\"fb-gnw1k85r1SivgLYZYUUiz0k4HoY\"",
    "mtime": "2023-10-15T17:12:24.550Z",
    "size": 251,
    "path": "../public/_nuxt/pagetitle.65f4b3f5.js"
  },
  "/_nuxt/payment-_id_.e6e86084.js": {
    "type": "application/javascript",
    "etag": "\"97-YF7GST8hn9dBDN6AM9rdsNQ9TUo\"",
    "mtime": "2023-10-15T17:12:24.549Z",
    "size": 151,
    "path": "../public/_nuxt/payment-_id_.e6e86084.js"
  },
  "/_nuxt/private.041df752.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-yjZMpbWcFBcUln4G3kdaH5xMF/4\"",
    "mtime": "2023-10-15T17:12:24.549Z",
    "size": 55,
    "path": "../public/_nuxt/private.041df752.css"
  },
  "/_nuxt/private.feca6021.js": {
    "type": "application/javascript",
    "etag": "\"2a58-f5fgVUCnB30pmtmSSQs2bdGpG1E\"",
    "mtime": "2023-10-15T17:12:24.548Z",
    "size": 10840,
    "path": "../public/_nuxt/private.feca6021.js"
  },
  "/_nuxt/right-side-panel.vue.f0e6f628.js": {
    "type": "application/javascript",
    "etag": "\"6ed-41bWz3n/oxSXtDjFEElCtA50AFE\"",
    "mtime": "2023-10-15T17:12:24.548Z",
    "size": 1773,
    "path": "../public/_nuxt/right-side-panel.vue.f0e6f628.js"
  },
  "/_nuxt/useAlert.73f34d77.js": {
    "type": "application/javascript",
    "etag": "\"7b-PHDhLQtYXSy6dMGI0L2MTgTcDfw\"",
    "mtime": "2023-10-15T17:12:24.547Z",
    "size": 123,
    "path": "../public/_nuxt/useAlert.73f34d77.js"
  },
  "/_nuxt/useAuth.85702756.js": {
    "type": "application/javascript",
    "etag": "\"447-kLeKEXaA6z2Mko+a/tZgCprzs+Q\"",
    "mtime": "2023-10-15T17:12:24.547Z",
    "size": 1095,
    "path": "../public/_nuxt/useAuth.85702756.js"
  },
  "/_nuxt/useDocument.ca11e831.js": {
    "type": "application/javascript",
    "etag": "\"4cd-XUMaaFgx/g45CoYwEX/UA5k0bB8\"",
    "mtime": "2023-10-15T17:12:24.546Z",
    "size": 1229,
    "path": "../public/_nuxt/useDocument.ca11e831.js"
  },
  "/_nuxt/useStat.d8fb6343.js": {
    "type": "application/javascript",
    "etag": "\"18e-BbjqsXti2gNN//87+ecHToUDSD8\"",
    "mtime": "2023-10-15T17:12:24.546Z",
    "size": 398,
    "path": "../public/_nuxt/useStat.d8fb6343.js"
  },
  "/_nuxt/useTransaction.18ef96cd.js": {
    "type": "application/javascript",
    "etag": "\"222-cmEejoqvPAUwXmg84CY6kpm1CJ4\"",
    "mtime": "2023-10-15T17:12:24.545Z",
    "size": 546,
    "path": "../public/_nuxt/useTransaction.18ef96cd.js"
  },
  "/_nuxt/useTrip.ad63d827.js": {
    "type": "application/javascript",
    "etag": "\"2d1-B5x8s1OMUeXLzmP5y8pD9Ep7f18\"",
    "mtime": "2023-10-15T17:12:24.544Z",
    "size": 721,
    "path": "../public/_nuxt/useTrip.ad63d827.js"
  },
  "/_nuxt/useUser.b189d420.js": {
    "type": "application/javascript",
    "etag": "\"5dd-YOf4vFrC6aYEXub3qL3P+Z7ES3g\"",
    "mtime": "2023-10-15T17:12:24.544Z",
    "size": 1501,
    "path": "../public/_nuxt/useUser.b189d420.js"
  },
  "/_nuxt/user-infos.vue.b96843f4.js": {
    "type": "application/javascript",
    "etag": "\"c38-5WUJb2Q72819hjlZXw5zWvtKBKM\"",
    "mtime": "2023-10-15T17:12:24.543Z",
    "size": 3128,
    "path": "../public/_nuxt/user-infos.vue.b96843f4.js"
  },
  "/_nuxt/withdrawal-_id_.626ad386.js": {
    "type": "application/javascript",
    "etag": "\"97-xg54gB6xaWJWxeVGXHyisGtQRnw\"",
    "mtime": "2023-10-15T17:12:24.542Z",
    "size": 151,
    "path": "../public/_nuxt/withdrawal-_id_.626ad386.js"
  },
  "/img/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c176-kTqq3wA4rm1IEDm0+EH7OjGJvlg\"",
    "mtime": "2023-10-15T17:12:24.569Z",
    "size": 180598,
    "path": "../public/img/bg.jpg"
  },
  "/img/logo.png": {
    "type": "image/png",
    "etag": "\"3184-nge9ze9G5B8hqC0YDfHjYFoTwwk\"",
    "mtime": "2023-10-15T17:12:24.568Z",
    "size": 12676,
    "path": "../public/img/logo.png"
  },
  "/img/logo1.png": {
    "type": "image/png",
    "etag": "\"1649-EBupSTVY6+/zGp/QxEckt+BtEOQ\"",
    "mtime": "2023-10-15T17:12:24.567Z",
    "size": 5705,
    "path": "../public/img/logo1.png"
  },
  "/img/logo2.png": {
    "type": "image/png",
    "etag": "\"8cdc-zGGj7baMhkL4UeMCkdpBdN3ur58\"",
    "mtime": "2023-10-15T17:12:24.566Z",
    "size": 36060,
    "path": "../public/img/logo2.png"
  },
  "/img/user.jpeg": {
    "type": "image/jpeg",
    "etag": "\"6c0-ltgvljA7vMvxLuqIjom0RQA0ZhU\"",
    "mtime": "2023-10-15T17:12:24.566Z",
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
