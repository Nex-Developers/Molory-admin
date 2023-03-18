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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=2592000, immutable"}}}},"public":{"BASE_URL":"http://143.47.181.28/backend-dev/api"}};
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
    "mtime": "2023-03-18T19:54:05.822Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"f452-ag78OxQFfR142GE/+8fnSKZSKJo\"",
    "mtime": "2023-03-18T19:54:05.821Z",
    "size": 62546,
    "path": "../public/favicon.png"
  },
  "/_nuxt/_id_.62f9e951.js": {
    "type": "application/javascript",
    "etag": "\"151c-r16bDHyA8McOybUQA9I2QavQ2u8\"",
    "mtime": "2023-03-18T19:54:05.813Z",
    "size": 5404,
    "path": "../public/_nuxt/_id_.62f9e951.js"
  },
  "/_nuxt/_id_.93bf02c3.js": {
    "type": "application/javascript",
    "etag": "\"1f5b-jTE4oYF38kTa98TrRRm1V0rEeWk\"",
    "mtime": "2023-03-18T19:54:05.813Z",
    "size": 8027,
    "path": "../public/_nuxt/_id_.93bf02c3.js"
  },
  "/_nuxt/_id_.c9558da2.js": {
    "type": "application/javascript",
    "etag": "\"2d5f-HBxBSv5BZZCvp2nIMtDO+tPfgLw\"",
    "mtime": "2023-03-18T19:54:05.812Z",
    "size": 11615,
    "path": "../public/_nuxt/_id_.c9558da2.js"
  },
  "/_nuxt/auth.504e2c78.js": {
    "type": "application/javascript",
    "etag": "\"db-0XojOzvHSA/cL0woh91jaBjy+iI\"",
    "mtime": "2023-03-18T19:54:05.812Z",
    "size": 219,
    "path": "../public/_nuxt/auth.504e2c78.js"
  },
  "/_nuxt/composables.29ea3361.js": {
    "type": "application/javascript",
    "etag": "\"61-67Lc2Evxt2c8xppOJpU3As/D2LE\"",
    "mtime": "2023-03-18T19:54:05.811Z",
    "size": 97,
    "path": "../public/_nuxt/composables.29ea3361.js"
  },
  "/_nuxt/default.247c3108.js": {
    "type": "application/javascript",
    "etag": "\"1a1-8sErufEzK4sd4CztoWFOKzs8Y9I\"",
    "mtime": "2023-03-18T19:54:05.811Z",
    "size": 417,
    "path": "../public/_nuxt/default.247c3108.js"
  },
  "/_nuxt/entry.29b7e700.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5764-iFG3sWb3SJViuyUEVLyK2MmHsBs\"",
    "mtime": "2023-03-18T19:54:05.810Z",
    "size": 22372,
    "path": "../public/_nuxt/entry.29b7e700.css"
  },
  "/_nuxt/entry.3decec21.js": {
    "type": "application/javascript",
    "etag": "\"21dd9-EGMO7WJR5FoRclcL8XYGgdNQah4\"",
    "mtime": "2023-03-18T19:54:05.810Z",
    "size": 138713,
    "path": "../public/_nuxt/entry.3decec21.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-03-18T19:54:05.809Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.a3bdb0eb.js": {
    "type": "application/javascript",
    "etag": "\"8f4-XJ4Mx0wpUX4z0dgpZX4vAElmxCE\"",
    "mtime": "2023-03-18T19:54:05.809Z",
    "size": 2292,
    "path": "../public/_nuxt/error-404.a3bdb0eb.js"
  },
  "/_nuxt/error-500.8cdcf669.js": {
    "type": "application/javascript",
    "etag": "\"778-lG6WM7U3G2Zb0yoSynWVUl1fB/E\"",
    "mtime": "2023-03-18T19:54:05.808Z",
    "size": 1912,
    "path": "../public/_nuxt/error-500.8cdcf669.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-03-18T19:54:05.808Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.9f9c8da2.js": {
    "type": "application/javascript",
    "etag": "\"4b0-diLZuv5Vgqi5SQueCrEyGzzjPNE\"",
    "mtime": "2023-03-18T19:54:05.807Z",
    "size": 1200,
    "path": "../public/_nuxt/error-component.9f9c8da2.js"
  },
  "/_nuxt/guest.ffabcaac.js": {
    "type": "application/javascript",
    "etag": "\"c8-pUeH94F6ZOWyCUbLNjQYnabk8yY\"",
    "mtime": "2023-03-18T19:54:05.807Z",
    "size": 200,
    "path": "../public/_nuxt/guest.ffabcaac.js"
  },
  "/_nuxt/index.2d101562.js": {
    "type": "application/javascript",
    "etag": "\"13cd-XA71SSiU2lOKHwEQqD+OgVdQ3Vk\"",
    "mtime": "2023-03-18T19:54:05.806Z",
    "size": 5069,
    "path": "../public/_nuxt/index.2d101562.js"
  },
  "/_nuxt/index.4727dc03.js": {
    "type": "application/javascript",
    "etag": "\"1af4-HJGbDNtdv/fzrU8AXQJoDyYJ044\"",
    "mtime": "2023-03-18T19:54:05.806Z",
    "size": 6900,
    "path": "../public/_nuxt/index.4727dc03.js"
  },
  "/_nuxt/index.65a0154d.js": {
    "type": "application/javascript",
    "etag": "\"97-FTv2Q4SdKaSKBYP/kKLBriNva9c\"",
    "mtime": "2023-03-18T19:54:05.805Z",
    "size": 151,
    "path": "../public/_nuxt/index.65a0154d.js"
  },
  "/_nuxt/index.7e572375.js": {
    "type": "application/javascript",
    "etag": "\"19d2-Brcm7cS3kRrtvdeLNSXSnXGVL4s\"",
    "mtime": "2023-03-18T19:54:05.805Z",
    "size": 6610,
    "path": "../public/_nuxt/index.7e572375.js"
  },
  "/_nuxt/index.827c9b3c.js": {
    "type": "application/javascript",
    "etag": "\"2527-rMCWu5IzjVbwIsQeuzGDGX195i0\"",
    "mtime": "2023-03-18T19:54:05.804Z",
    "size": 9511,
    "path": "../public/_nuxt/index.827c9b3c.js"
  },
  "/_nuxt/index.8ea9f4e7.js": {
    "type": "application/javascript",
    "etag": "\"3148e-vlY4poUyVrOUmYoGYxC1JY028OU\"",
    "mtime": "2023-03-18T19:54:05.804Z",
    "size": 201870,
    "path": "../public/_nuxt/index.8ea9f4e7.js"
  },
  "/_nuxt/index.93b22ee3.js": {
    "type": "application/javascript",
    "etag": "\"1893-EcchLbc2va1FH2tkoau3SNoiqRU\"",
    "mtime": "2023-03-18T19:54:05.803Z",
    "size": 6291,
    "path": "../public/_nuxt/index.93b22ee3.js"
  },
  "/_nuxt/index.b11bd0a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b-ImEvqXh5JZi377yituJag5/8YcQ\"",
    "mtime": "2023-03-18T19:54:05.802Z",
    "size": 43,
    "path": "../public/_nuxt/index.b11bd0a7.css"
  },
  "/_nuxt/index.e420c74c.js": {
    "type": "application/javascript",
    "etag": "\"17ec-HPoAP4pUF+HRyzn4iXmaND3Wb1o\"",
    "mtime": "2023-03-18T19:54:05.802Z",
    "size": 6124,
    "path": "../public/_nuxt/index.e420c74c.js"
  },
  "/_nuxt/index.f42db404.js": {
    "type": "application/javascript",
    "etag": "\"423-LwVC6Jcs4wThvLDHagrMJMkehpY\"",
    "mtime": "2023-03-18T19:54:05.801Z",
    "size": 1059,
    "path": "../public/_nuxt/index.f42db404.js"
  },
  "/_nuxt/index.f56e47a4.js": {
    "type": "application/javascript",
    "etag": "\"97-FTv2Q4SdKaSKBYP/kKLBriNva9c\"",
    "mtime": "2023-03-18T19:54:05.801Z",
    "size": 151,
    "path": "../public/_nuxt/index.f56e47a4.js"
  },
  "/_nuxt/infos-panel.vue.0a57cda5.js": {
    "type": "application/javascript",
    "etag": "\"1344-tJTSFZaOaKF/n4/Ch8z+rpumFjs\"",
    "mtime": "2023-03-18T19:54:05.801Z",
    "size": 4932,
    "path": "../public/_nuxt/infos-panel.vue.0a57cda5.js"
  },
  "/_nuxt/loader.vue.9b88081e.js": {
    "type": "application/javascript",
    "etag": "\"6bd-A3SAsVjsqswF4xWy1i3BIeliVpo\"",
    "mtime": "2023-03-18T19:54:05.800Z",
    "size": 1725,
    "path": "../public/_nuxt/loader.vue.9b88081e.js"
  },
  "/_nuxt/login.1de11275.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b-rmfx765wPwPHxiJjY8KVTRTADVQ\"",
    "mtime": "2023-03-18T19:54:05.800Z",
    "size": 59,
    "path": "../public/_nuxt/login.1de11275.css"
  },
  "/_nuxt/login.cd912947.js": {
    "type": "application/javascript",
    "etag": "\"1138-BYJnJV9CmIirSLQTV7xX1uKkkbA\"",
    "mtime": "2023-03-18T19:54:05.799Z",
    "size": 4408,
    "path": "../public/_nuxt/login.cd912947.js"
  },
  "/_nuxt/nuxt-link.7e54d427.js": {
    "type": "application/javascript",
    "etag": "\"e49-wnkL0X5wnIzgsgOXgsfY8mYdYwI\"",
    "mtime": "2023-03-18T19:54:05.799Z",
    "size": 3657,
    "path": "../public/_nuxt/nuxt-link.7e54d427.js"
  },
  "/_nuxt/pagetitle.7e123cb8.js": {
    "type": "application/javascript",
    "etag": "\"fb-w3kipqFRW77Rhr43HCpIBpT5Rnc\"",
    "mtime": "2023-03-18T19:54:05.798Z",
    "size": 251,
    "path": "../public/_nuxt/pagetitle.7e123cb8.js"
  },
  "/_nuxt/payment-_id_.8d7fd888.js": {
    "type": "application/javascript",
    "etag": "\"97-xko267JXGlZIirB2jRp5V90GjFI\"",
    "mtime": "2023-03-18T19:54:05.798Z",
    "size": 151,
    "path": "../public/_nuxt/payment-_id_.8d7fd888.js"
  },
  "/_nuxt/private.8e9696f9.js": {
    "type": "application/javascript",
    "etag": "\"2918-Q3iYp2tVV83CiIumJupXE7f0/MI\"",
    "mtime": "2023-03-18T19:54:05.797Z",
    "size": 10520,
    "path": "../public/_nuxt/private.8e9696f9.js"
  },
  "/_nuxt/private.be5365d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-N7+ztnaL6y0MQmfop/RwdRPrSDY\"",
    "mtime": "2023-03-18T19:54:05.797Z",
    "size": 55,
    "path": "../public/_nuxt/private.be5365d3.css"
  },
  "/_nuxt/right-side-panel.vue.72161668.js": {
    "type": "application/javascript",
    "etag": "\"6ed-FvFVO3E5F/GNsEzvuVGGMM71ZUg\"",
    "mtime": "2023-03-18T19:54:05.796Z",
    "size": 1773,
    "path": "../public/_nuxt/right-side-panel.vue.72161668.js"
  },
  "/_nuxt/table.9ee70cef.js": {
    "type": "application/javascript",
    "etag": "\"4e4-BqUM48GUibFNTWLBoaMOyTfi9M4\"",
    "mtime": "2023-03-18T19:54:05.796Z",
    "size": 1252,
    "path": "../public/_nuxt/table.9ee70cef.js"
  },
  "/_nuxt/useAlert.0eb29998.js": {
    "type": "application/javascript",
    "etag": "\"93-FynF9Qx0yPHD3J8yh3NP9eqR+FI\"",
    "mtime": "2023-03-18T19:54:05.795Z",
    "size": 147,
    "path": "../public/_nuxt/useAlert.0eb29998.js"
  },
  "/_nuxt/useAuth.7de355ae.js": {
    "type": "application/javascript",
    "etag": "\"447-jQxyXDtcU+w8V8SSVbAI48o5wtE\"",
    "mtime": "2023-03-18T19:54:05.795Z",
    "size": 1095,
    "path": "../public/_nuxt/useAuth.7de355ae.js"
  },
  "/_nuxt/useDocument.f0448675.js": {
    "type": "application/javascript",
    "etag": "\"460-m5plxU2fGVW8NYn5ApgC8CGV86I\"",
    "mtime": "2023-03-18T19:54:05.794Z",
    "size": 1120,
    "path": "../public/_nuxt/useDocument.f0448675.js"
  },
  "/_nuxt/useTrip.4ffa13d6.js": {
    "type": "application/javascript",
    "etag": "\"2c3-j+aGg10A5SjroulG4+xJVZMwMpo\"",
    "mtime": "2023-03-18T19:54:05.794Z",
    "size": 707,
    "path": "../public/_nuxt/useTrip.4ffa13d6.js"
  },
  "/_nuxt/useUser.3c61f1a5.js": {
    "type": "application/javascript",
    "etag": "\"5a1-bu1J6IvKyTFoHlMyyU3rfuDxFAc\"",
    "mtime": "2023-03-18T19:54:05.793Z",
    "size": 1441,
    "path": "../public/_nuxt/useUser.3c61f1a5.js"
  },
  "/_nuxt/withdrawal-_id_.75972588.js": {
    "type": "application/javascript",
    "etag": "\"97-ledThoFVvAmDBCwx/1h73PWrbAc\"",
    "mtime": "2023-03-18T19:54:05.793Z",
    "size": 151,
    "path": "../public/_nuxt/withdrawal-_id_.75972588.js"
  },
  "/img/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c176-kTqq3wA4rm1IEDm0+EH7OjGJvlg\"",
    "mtime": "2023-03-18T19:54:05.820Z",
    "size": 180598,
    "path": "../public/img/bg.jpg"
  },
  "/img/logo.png": {
    "type": "image/png",
    "etag": "\"3184-nge9ze9G5B8hqC0YDfHjYFoTwwk\"",
    "mtime": "2023-03-18T19:54:05.818Z",
    "size": 12676,
    "path": "../public/img/logo.png"
  },
  "/img/logo1.png": {
    "type": "image/png",
    "etag": "\"1649-EBupSTVY6+/zGp/QxEckt+BtEOQ\"",
    "mtime": "2023-03-18T19:54:05.817Z",
    "size": 5705,
    "path": "../public/img/logo1.png"
  },
  "/img/logo2.png": {
    "type": "image/png",
    "etag": "\"8cdc-zGGj7baMhkL4UeMCkdpBdN3ur58\"",
    "mtime": "2023-03-18T19:54:05.816Z",
    "size": 36060,
    "path": "../public/img/logo2.png"
  },
  "/img/user.jpeg": {
    "type": "image/jpeg",
    "etag": "\"6c0-ltgvljA7vMvxLuqIjom0RQA0ZhU\"",
    "mtime": "2023-03-18T19:54:05.815Z",
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
