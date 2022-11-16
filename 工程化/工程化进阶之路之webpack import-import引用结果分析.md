<h1 align = "center">webpack import-import引用结果分析</h1>

> 这篇文章就是为了根据 webpack 打包结果分析下，如果导出是 es module，导入是 es module 的会怎么办

## 1. 实例

- 入口文件

```js
import info, { xx } from "./main";

console.log(info, xx);
```

- 引用文件

```js
const test = "test";
const xx = false;

export default test;
export { xx };
```

## 2. 解析代码分析

```js
// 表示导入的模块
var __webpack_modules__ = {
  "./src/main.js": (
    __unused_webpack_module,
    __webpack_exports__,
    __webpack_require__
  ) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      default: () => __WEBPACK_DEFAULT_EXPORT__,
      xx: () => xx,
    });
    const test = "test";
    const xx = false;
    const __WEBPACK_DEFAULT_EXPORT__ = test;
  },
};

// 用来缓存数据的变量
var __webpack_module_cache__ = {};

// 模拟require方法 读取方法
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

// 定义变量方法
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

// 判断属性的方法
__webpack_require__.o = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

// 定义标识  表示是一个es module
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

var __webpack_exports__ = {};

// 入口文件

// 表示导入就是一个es module
__webpack_require__.r(__webpack_exports__);

// 解析入口文件
var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/main.js");

console.log(
  _main__WEBPACK_IMPORTED_MODULE_0__["default"],
  _main__WEBPACK_IMPORTED_MODULE_0__.xx
);
```

> 上述就是 webpack 打包结果，分离了每个方法以及对方法进行注释标注

- 其实分析结果可以[参考](https://github.com/a572251465/my-blog/blob/main/%E5%B7%A5%E7%A8%8B%E5%8C%96/%E5%B7%A5%E7%A8%8B%E5%8C%96%E8%BF%9B%E9%98%B6%E4%B9%8B%E8%B7%AF%E4%B9%8Bwebpack%20require-import%E5%BC%95%E7%94%A8%E7%BB%93%E6%9E%9C%E5%88%86%E6%9E%90.md)
- 两者并没有什么不同。无非是一个导入是 commonjs, 另一个导入是 es module

## 3. 分析源码实例

[源码实例](https://github.com/a572251465/webpack-params-demo/blob/main/demo-9/resolve/main.js)
