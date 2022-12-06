<h1 align = "center">import() 动态导入结果分析</h1>

> 本次的文章实例主要是是分析下 在 webpack 中使用 import() 导入方式的话，会有怎么样的结果

## 1. 代码示例

- 入口文件

```js
import("./main").then(res => {
  console.log(res.default, res.yy);
});
```

- 引用文件

```js
const test = "test";
const yy = false;

export default test;
export { yy };
```

## 2. 解析结果

```js
// 表示存放模块的变量
var __webpack_modules__ = {};
// 存放模块的返回值的缓存
var __webpack_module_cache__ = {};

// 模拟require方法
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

__webpack_require__.m = __webpack_modules__;

// 定义变量
__webpack_require__.d = (exports, definition) => {
  for (var key in definition) {
    if (
      __webpack_require__.o(definition, key) &&
      !__webpack_require__.o(exports, key)
    ) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  }
};

__webpack_require__.f = {};
__webpack_require__.e = chunkId => {
  return Promise.all(
    Object.keys(__webpack_require__.f).reduce((promises, key) => {
      __webpack_require__.f[key](chunkId, promises);
      return promises;
    }, [])
  );
};

// 拼接路径地址
__webpack_require__.u = chunkId => {
  return "" + chunkId + ".main.js";
};

// 表示全局的this
__webpack_require__.g = (function () {
  if (typeof globalThis === "object") return globalThis;
  try {
    return this || new Function("return this")();
  } catch (e) {
    if (typeof window === "object") return window;
  }
})();

// 属性key 判断
__webpack_require__.o = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

var inProgress = {};
var dataWebpackPrefix = "demo-10:";
// script src 加载
__webpack_require__.l = (url, done, key, chunkId) => {
  // 表示加载结束
  if (inProgress[url]) {
    inProgress[url].push(done);
    return;
  }
  var script, needAttach;
  if (key !== undefined) {
    var scripts = document.getElementsByTagName("script");

    // 本身html中 存在script的时候
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (
        s.getAttribute("src") == url ||
        s.getAttribute("data-webpack") == dataWebpackPrefix + key
      ) {
        script = s;
        break;
      }
    }
  }

  // 表示无 script的时候
  if (!script) {
    needAttach = true;
    script = document.createElement("script");
    script.charset = "utf-8";
    script.timeout = 120;
    if (__webpack_require__.nc) {
      script.setAttribute("nonce", __webpack_require__.nc);
    }
    script.setAttribute("data-webpack", dataWebpackPrefix + key);
    script.src = url;
  }

  inProgress[url] = [done];

  // 表示加载完成的处理
  var onScriptComplete = (prev, event) => {
    script.onerror = script.onload = null;
    clearTimeout(timeout);
    var doneFns = inProgress[url];
    delete inProgress[url];
    script.parentNode && script.parentNode.removeChild(script);
    doneFns && doneFns.forEach(fn => fn(event));
    if (prev) return prev(event);
  };
  var timeout = setTimeout(
    onScriptComplete.bind(null, undefined, {
      type: "timeout",
      target: script,
    }),
    120000
  );
  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);

  // 给页面中添加元素
  needAttach && document.head.appendChild(script);
};

// 给变量添加标识 表示是es module 模块
__webpack_require__.r = exports => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    });
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  });
};

var scriptUrl;
if (__webpack_require__.g.importScripts)
  scriptUrl = __webpack_require__.g.location + "";
var document = __webpack_require__.g.document;
if (!scriptUrl && document) {
  if (document.currentScript) scriptUrl = document.currentScript.src;
  if (!scriptUrl) {
    var scripts = document.getElementsByTagName("script");
    if (scripts.length) scriptUrl = scripts[scripts.length - 1].src;
  }
}
if (!scriptUrl)
  throw new Error("Automatic publicPath is not supported in this browser");
scriptUrl = scriptUrl
  .replace(/#.*$/, "")
  .replace(/\?.*$/, "")
  .replace(/\/[^\/]+$/, "/");
__webpack_require__.p = scriptUrl;

(() => {
  // 此对象表示已经被注册的模块
  var installedChunks = {
    main: 0,
  };

  __webpack_require__.f.j = (chunkId, promises) => {
    // 刚开始可能是undefined，如果是加载中的数据就是数组
    var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
      ? installedChunks[chunkId]
      : undefined;
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        if (true) {
          // 表示加载中模块 给数组中存放resolve, reject
          var promise = new Promise(
            (resolve, reject) =>
              (installedChunkData = installedChunks[chunkId] =
                [resolve, reject])
          );
          // 此时promises中数组的元素是 [resolve, reject, promise]
          promises.push((installedChunkData[2] = promise));

          // 表示请求url
          var url = __webpack_require__.p + __webpack_require__.u(chunkId);

          var error = new Error();
          var loadingEnded = event => {
            if (__webpack_require__.o(installedChunks, chunkId)) {
              installedChunkData = installedChunks[chunkId];
              if (installedChunkData !== 0)
                installedChunks[chunkId] = undefined;

              // 此时内容是一个数组 [resolve, reject, promise]
              if (installedChunkData) {
                var errorType =
                  event && (event.type === "load" ? "missing" : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message =
                  "Loading chunk " +
                  chunkId +
                  " failed.\n(" +
                  errorType +
                  ": " +
                  realSrc +
                  ")";
                error.name = "ChunkLoadError";
                error.type = errorType;
                error.request = realSrc;
                installedChunkData[1](error);
              }
            }
          };
          __webpack_require__.l(
            url, // 请求url
            loadingEnded, // 完成的方法
            "chunk-" + chunkId,
            chunkId // 模块
          );
        } else installedChunks[chunkId] = 0;
      }
    }
  };

  // 表示 push 重写方法
  var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    // 得到了分割代码中的变量以及逻辑
    var [chunkIds, moreModules, runtime] = data;

    var moduleId,
      chunkId,
      i = 0;
    if (chunkIds.some(id => installedChunks[id] !== 0)) {
      for (moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
          // 设置请求回来的模块
          __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
      }
      if (runtime) var result = runtime(__webpack_require__);
    }
    if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        __webpack_require__.o(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        installedChunks[chunkId][0]();
      }

      // 到此时表示动作已经完成了
      installedChunks[chunkId] = 0;
    }
  };
  var chunkLoadingGlobal = (self["webpackChunkdemo_10"] =
    self["webpackChunkdemo_10"] || []);
  chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
  chunkLoadingGlobal.push = webpackJsonpCallback.bind(
    null,
    chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
  );
})();
var __webpack_exports__ = {};
__webpack_require__
  .e("src_main_js")
  .then(__webpack_require__.bind(__webpack_require__, "./src/main.js"))
  .then(res => {
    console.log(res.default, res.yy);
  });
```

- 下列是分割代码块的内容：

```js
"use strict";
(self["webpackChunkdemo_10"] = self["webpackChunkdemo_10"] || []).push([
  ["src_main_js"],
  {
    "./src/main.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
        yy: () => yy,
      });
      const test = "test";
      const yy = false;
      const __WEBPACK_DEFAULT_EXPORT__ = test;
    },
  },
]);
```

- 在使用 import() 导入文件的时候，天生具备代码块分割的功能。 会将引入的代码独立打包一个文件
- 其实 webpack 核心逻辑逻辑在于，使用`script src`的功能加载异步代码块，将其存放到 module 中
- 然后直接`__webpack_require__` 方法来解析内容，只不过使用了很多小的细节而已
  - 缓存模块结果
  - 重写 push 方法
  - 主文件以及分割出的文件 共同使用一个全局变量

## 3. 源码地址

[源码实例](https://github.com/a572251465/webpack-params-demo/blob/main/demo-10/resolve/main.js)
