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
    "mtime": "2023-09-18T16:26:20.548Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"f452-ag78OxQFfR142GE/+8fnSKZSKJo\"",
    "mtime": "2023-09-18T16:26:20.547Z",
    "size": 62546,
    "path": "../public/favicon.png"
  },
  "/_nuxt/_id_.539ab894.js": {
    "type": "application/javascript",
    "etag": "\"d69-xekdEviUY2OJj1L4BeKQ/sgR0UA\"",
    "mtime": "2023-09-18T16:26:20.535Z",
    "size": 3433,
    "path": "../public/_nuxt/_id_.539ab894.js"
  },
  "/_nuxt/_id_.644ade71.js": {
    "type": "application/javascript",
    "etag": "\"1549-HbMg2RywIggFPWbfxAoEu6ywXRo\"",
    "mtime": "2023-09-18T16:26:20.535Z",
    "size": 5449,
    "path": "../public/_nuxt/_id_.644ade71.js"
  },
  "/_nuxt/_id_.cdd01851.js": {
    "type": "application/javascript",
    "etag": "\"2f09-56Fb+YBlWPsu8KAviU35BepOWdo\"",
    "mtime": "2023-09-18T16:26:20.534Z",
    "size": 12041,
    "path": "../public/_nuxt/_id_.cdd01851.js"
  },
  "/_nuxt/_id_.e3dfe978.js": {
    "type": "application/javascript",
    "etag": "\"f08-NZS+3pgSCWDsFCe+HZpT1NyXkpM\"",
    "mtime": "2023-09-18T16:26:20.534Z",
    "size": 3848,
    "path": "../public/_nuxt/_id_.e3dfe978.js"
  },
  "/_nuxt/auth.80d2f5e0.js": {
    "type": "application/javascript",
    "etag": "\"db-f/9XjVo36ptUei05J6CZl1InYwM\"",
    "mtime": "2023-09-18T16:26:20.533Z",
    "size": 219,
    "path": "../public/_nuxt/auth.80d2f5e0.js"
  },
  "/_nuxt/composables.f849aa0c.js": {
    "type": "application/javascript",
    "etag": "\"61-FQetxeAa5/K20JfALcL31nKr9RA\"",
    "mtime": "2023-09-18T16:26:20.533Z",
    "size": 97,
    "path": "../public/_nuxt/composables.f849aa0c.js"
  },
  "/_nuxt/default.ea090a96.js": {
    "type": "application/javascript",
    "etag": "\"1a1-Nr6n4npjptkGU4lxcq+LN8bv3+0\"",
    "mtime": "2023-09-18T16:26:20.532Z",
    "size": 417,
    "path": "../public/_nuxt/default.ea090a96.js"
  },
  "/_nuxt/entry.45f2bb2a.js": {
    "type": "application/javascript",
    "etag": "\"22716-rG5Mh5K50DkDOHTZxbd6HIq1Sa0\"",
    "mtime": "2023-09-18T16:26:20.532Z",
    "size": 141078,
    "path": "../public/_nuxt/entry.45f2bb2a.js"
  },
  "/_nuxt/entry.debcb684.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5995-sgEwMmOXlgR06sarPduihg/dZ4s\"",
    "mtime": "2023-09-18T16:26:20.527Z",
    "size": 22933,
    "path": "../public/_nuxt/entry.debcb684.css"
  },
  "/_nuxt/error-404.70fc8b01.js": {
    "type": "application/javascript",
    "etag": "\"8f4-6Q9z1kHL9CA8CNKOsOgGtKpAWlg\"",
    "mtime": "2023-09-18T16:26:20.527Z",
    "size": 2292,
    "path": "../public/_nuxt/error-404.70fc8b01.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-09-18T16:26:20.526Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.4cf0302a.js": {
    "type": "application/javascript",
    "etag": "\"778-mXtIJlhzPbRU6bL7asOxYZBQd8A\"",
    "mtime": "2023-09-18T16:26:20.525Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.4cf0302a.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-09-18T16:26:20.525Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.4fcc788f.js": {
    "type": "application/javascript",
    "etag": "\"4b0-1VmbcDdnpvHz2AygdA0ObxHj6QY\"",
    "mtime": "2023-09-18T16:26:20.524Z",
    "size": 1200,
    "path": "../public/_nuxt/error-component.4fcc788f.js"
  },
  "/_nuxt/guest.5bbf06b8.js": {
    "type": "application/javascript",
    "etag": "\"c8-2clvgfMJz39DrDGPmGg/s98k0h0\"",
    "mtime": "2023-09-18T16:26:20.523Z",
    "size": 200,
    "path": "../public/_nuxt/guest.5bbf06b8.js"
  },
  "/_nuxt/index.03abe41d.js": {
    "type": "application/javascript",
    "etag": "\"97-I08gvF0hAj8UnKQR4ZJRO1m3DXo\"",
    "mtime": "2023-09-18T16:26:20.523Z",
    "size": 151,
    "path": "../public/_nuxt/index.03abe41d.js"
  },
  "/_nuxt/index.09e56b42.js": {
    "type": "application/javascript",
    "etag": "\"1a62-zMpgSZrb/mfppDIxvVQzXQlTzSg\"",
    "mtime": "2023-09-18T16:26:20.522Z",
    "size": 6754,
    "path": "../public/_nuxt/index.09e56b42.js"
  },
  "/_nuxt/index.30876e7f.js": {
    "type": "application/javascript",
    "etag": "\"160e-q9WWfTDysC/nA59Sw8gst57aebY\"",
    "mtime": "2023-09-18T16:26:20.521Z",
    "size": 5646,
    "path": "../public/_nuxt/index.30876e7f.js"
  },
  "/_nuxt/index.34b89cc3.js": {
    "type": "application/javascript",
    "etag": "\"1ad6-amVir1CAMgW50F4EREsgWMwUOXw\"",
    "mtime": "2023-09-18T16:26:20.520Z",
    "size": 6870,
    "path": "../public/_nuxt/index.34b89cc3.js"
  },
  "/_nuxt/index.4f0adf3c.js": {
    "type": "application/javascript",
    "etag": "\"24f1-3KSBY0UzsEnEyuiRx8Qi5IKZftg\"",
    "mtime": "2023-09-18T16:26:20.518Z",
    "size": 9457,
    "path": "../public/_nuxt/index.4f0adf3c.js"
  },
  "/_nuxt/index.6a447481.js": {
    "type": "application/javascript",
    "etag": "\"97-I08gvF0hAj8UnKQR4ZJRO1m3DXo\"",
    "mtime": "2023-09-18T16:26:20.517Z",
    "size": 151,
    "path": "../public/_nuxt/index.6a447481.js"
  },
  "/_nuxt/index.88aa6f30.js": {
    "type": "application/javascript",
    "etag": "\"89d-XKMPg9PxRwGu7CIrRXHH+cBI+3k\"",
    "mtime": "2023-09-18T16:26:20.515Z",
    "size": 2205,
    "path": "../public/_nuxt/index.88aa6f30.js"
  },
  "/_nuxt/index.8cce579b.js": {
    "type": "application/javascript",
    "etag": "\"1cc4-4ITxqEtG7T+9+zg5J/Rbg05H4L0\"",
    "mtime": "2023-09-18T16:26:20.514Z",
    "size": 7364,
    "path": "../public/_nuxt/index.8cce579b.js"
  },
  "/_nuxt/index.9c847936.js": {
    "type": "application/javascript",
    "etag": "\"1953-4CNNuLmJkOT9xzSv8k/+RNSTpQI\"",
    "mtime": "2023-09-18T16:26:20.514Z",
    "size": 6483,
    "path": "../public/_nuxt/index.9c847936.js"
  },
  "/_nuxt/index.b11bd0a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b-ImEvqXh5JZi377yituJag5/8YcQ\"",
    "mtime": "2023-09-18T16:26:20.513Z",
    "size": 43,
    "path": "../public/_nuxt/index.b11bd0a7.css"
  },
  "/_nuxt/index.ca80a2d6.js": {
    "type": "application/javascript",
    "etag": "\"1808-JSA3ulaSLT2llrhecOezjWf6PcM\"",
    "mtime": "2023-09-18T16:26:20.513Z",
    "size": 6152,
    "path": "../public/_nuxt/index.ca80a2d6.js"
  },
  "/_nuxt/index.f51e13b0.js": {
    "type": "application/javascript",
    "etag": "\"2627-yWZbsJp+KfioYJqPUyj1ovS8iwI\"",
    "mtime": "2023-09-18T16:26:20.512Z",
    "size": 9767,
    "path": "../public/_nuxt/index.f51e13b0.js"
  },
  "/_nuxt/item.vue.f9a5bbd7.js": {
    "type": "application/javascript",
    "etag": "\"19cb-QjwAVZQw9xaDZPct6tJW+xniKeU\"",
    "mtime": "2023-09-18T16:26:20.512Z",
    "size": 6603,
    "path": "../public/_nuxt/item.vue.f9a5bbd7.js"
  },
  "/_nuxt/loader.vue.f38170ab.js": {
    "type": "application/javascript",
    "etag": "\"6bd-U4H/EkhnRsHPJba30cyleVctQYs\"",
    "mtime": "2023-09-18T16:26:20.511Z",
    "size": 1725,
    "path": "../public/_nuxt/loader.vue.f38170ab.js"
  },
  "/_nuxt/login.1de11275.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b-rmfx765wPwPHxiJjY8KVTRTADVQ\"",
    "mtime": "2023-09-18T16:26:20.511Z",
    "size": 59,
    "path": "../public/_nuxt/login.1de11275.css"
  },
  "/_nuxt/login.db6a7429.js": {
    "type": "application/javascript",
    "etag": "\"1138-+koQbbYD1xPEGkszrka8/u3tFXc\"",
    "mtime": "2023-09-18T16:26:20.510Z",
    "size": 4408,
    "path": "../public/_nuxt/login.db6a7429.js"
  },
  "/_nuxt/nuxt-link.ea414f75.js": {
    "type": "application/javascript",
    "etag": "\"e53-AqFPOI5JKNaPmo3cr/LUNsmb9OM\"",
    "mtime": "2023-09-18T16:26:20.510Z",
    "size": 3667,
    "path": "../public/_nuxt/nuxt-link.ea414f75.js"
  },
  "/_nuxt/pagetitle.4c0caa6b.js": {
    "type": "application/javascript",
    "etag": "\"fb-7TJutoGcGkOMz3CEUKdpsUnhJ74\"",
    "mtime": "2023-09-18T16:26:20.509Z",
    "size": 251,
    "path": "../public/_nuxt/pagetitle.4c0caa6b.js"
  },
  "/_nuxt/payment-_id_.5443f9d7.js": {
    "type": "application/javascript",
    "etag": "\"97-9aPB5koNcvoQja+kAd/bQEo2i9k\"",
    "mtime": "2023-09-18T16:26:20.508Z",
    "size": 151,
    "path": "../public/_nuxt/payment-_id_.5443f9d7.js"
  },
  "/_nuxt/private.041df752.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-yjZMpbWcFBcUln4G3kdaH5xMF/4\"",
    "mtime": "2023-09-18T16:26:20.508Z",
    "size": 55,
    "path": "../public/_nuxt/private.041df752.css"
  },
  "/_nuxt/private.9eb2a439.js": {
    "type": "application/javascript",
    "etag": "\"2a58-9IdgHaPQ5iL5LARjfJ5C7T91U/A\"",
    "mtime": "2023-09-18T16:26:20.507Z",
    "size": 10840,
    "path": "../public/_nuxt/private.9eb2a439.js"
  },
  "/_nuxt/right-side-panel.vue.77f0533f.js": {
    "type": "application/javascript",
    "etag": "\"6ed-ymjNA8tJsmTwrWGVq40rJY5dpOI\"",
    "mtime": "2023-09-18T16:26:20.506Z",
    "size": 1773,
    "path": "../public/_nuxt/right-side-panel.vue.77f0533f.js"
  },
  "/_nuxt/useAlert.c16846dd.js": {
    "type": "application/javascript",
    "etag": "\"7b-h4HeL7L5WIFqP27EoVR0cuhIZKY\"",
    "mtime": "2023-09-18T16:26:20.505Z",
    "size": 123,
    "path": "../public/_nuxt/useAlert.c16846dd.js"
  },
  "/_nuxt/useAuth.61dd9848.js": {
    "type": "application/javascript",
    "etag": "\"447-Dc5pMQs4tDQQ8xrbW7dvMV7jEzM\"",
    "mtime": "2023-09-18T16:26:20.504Z",
    "size": 1095,
    "path": "../public/_nuxt/useAuth.61dd9848.js"
  },
  "/_nuxt/useDocument.d0970661.js": {
    "type": "application/javascript",
    "etag": "\"4cd-Ut+gFVOkEhac9bMhR+51SUelsbo\"",
    "mtime": "2023-09-18T16:26:20.503Z",
    "size": 1229,
    "path": "../public/_nuxt/useDocument.d0970661.js"
  },
  "/_nuxt/useStat.2f5a85c3.js": {
    "type": "application/javascript",
    "etag": "\"18e-z5Xurt7lfOUZYNOrouYNkRU9nO4\"",
    "mtime": "2023-09-18T16:26:20.502Z",
    "size": 398,
    "path": "../public/_nuxt/useStat.2f5a85c3.js"
  },
  "/_nuxt/useTransaction.5b477cfd.js": {
    "type": "application/javascript",
    "etag": "\"222-2Q7VjKgpcQ3zfsJlvsg1/fXW4jg\"",
    "mtime": "2023-09-18T16:26:20.501Z",
    "size": 546,
    "path": "../public/_nuxt/useTransaction.5b477cfd.js"
  },
  "/_nuxt/useTrip.fa90ce0b.js": {
    "type": "application/javascript",
    "etag": "\"2d1-wvl0IJoghIFE1j+seCFnmTiqgMM\"",
    "mtime": "2023-09-18T16:26:20.501Z",
    "size": 721,
    "path": "../public/_nuxt/useTrip.fa90ce0b.js"
  },
  "/_nuxt/useUser.70a08324.js": {
    "type": "application/javascript",
    "etag": "\"5dd-Rvi/cpw73VOmwh6qvj7XTf4ItHE\"",
    "mtime": "2023-09-18T16:26:20.500Z",
    "size": 1501,
    "path": "../public/_nuxt/useUser.70a08324.js"
  },
  "/_nuxt/user-infos.vue.50794821.js": {
    "type": "application/javascript",
    "etag": "\"c38-VoRNcmSF4479LbAB1srNh7fnxbE\"",
    "mtime": "2023-09-18T16:26:20.499Z",
    "size": 3128,
    "path": "../public/_nuxt/user-infos.vue.50794821.js"
  },
  "/_nuxt/withdrawal-_id_.c3a8a9df.js": {
    "type": "application/javascript",
    "etag": "\"97-cXnhhhLsa42eIphJ8vCKlfxF46g\"",
    "mtime": "2023-09-18T16:26:20.498Z",
    "size": 151,
    "path": "../public/_nuxt/withdrawal-_id_.c3a8a9df.js"
  },
  "/img/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c176-kTqq3wA4rm1IEDm0+EH7OjGJvlg\"",
    "mtime": "2023-09-18T16:26:20.545Z",
    "size": 180598,
    "path": "../public/img/bg.jpg"
  },
  "/img/logo.png": {
    "type": "image/png",
    "etag": "\"3184-nge9ze9G5B8hqC0YDfHjYFoTwwk\"",
    "mtime": "2023-09-18T16:26:20.543Z",
    "size": 12676,
    "path": "../public/img/logo.png"
  },
  "/img/logo1.png": {
    "type": "image/png",
    "etag": "\"1649-EBupSTVY6+/zGp/QxEckt+BtEOQ\"",
    "mtime": "2023-09-18T16:26:20.542Z",
    "size": 5705,
    "path": "../public/img/logo1.png"
  },
  "/img/logo2.png": {
    "type": "image/png",
    "etag": "\"8cdc-zGGj7baMhkL4UeMCkdpBdN3ur58\"",
    "mtime": "2023-09-18T16:26:20.540Z",
    "size": 36060,
    "path": "../public/img/logo2.png"
  },
  "/img/user.jpeg": {
    "type": "image/jpeg",
    "etag": "\"6c0-ltgvljA7vMvxLuqIjom0RQA0ZhU\"",
    "mtime": "2023-09-18T16:26:20.539Z",
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
