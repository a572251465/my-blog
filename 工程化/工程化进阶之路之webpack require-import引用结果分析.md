<h1 align = "center">webpack require-import引用结果分析</h1>

> 这篇文章就是为了根据 webpack 打包结果分析下，如果导出是 es module，导入是 commonjs 的会怎么办

## 1. 实例

- 入口文件

```js
const info = require("./main");

console.log(info.shell);
console.log(info.default);
```

- 引用文件

```js
const test = "test";
const shell = true;

export default test;
export { shell };
```

## 2. 解析代码分析

```js
// 此对象表示模块的方法 每个导出的文件都是一个模块
var __webpack_modules__ = {
  "./src/main.js": (
    __unused_webpack_module,
    __webpack_exports__,
    __webpack_require__
  ) => {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      // 此方法很重要 每次获取shell/ default的属性的时候 都能获取到最新的数据
      default: () => __WEBPACK_DEFAULT_EXPORT__,
      shell: () => shell,
    });
    const test = "test";
    const shell = true;
    const __WEBPACK_DEFAULT_EXPORT__ = test;
  },
};

// 表示模块缓存
var __webpack_module_cache__ = {};

// 模拟require方法 进行导入
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  // 如果有缓存 直接返回
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  });

  // 执行模块中的方法
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

// 给exports 上定义属性
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

// 属性判断
__webpack_require__.o = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

// 表示定义es module 模块
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
// 表示模块入口
const info = __webpack_require__("./src/main.js");
console.log(info.shell);
console.log(info.default);
```

> 上述就是 webpack 打包结果，分离了每个方法以及对方法进行注释标注

- 变量`__webpack_modules__` 就是为了存放每个模块的，每个导出的的文件都可以理解为一个模块
- 方法`__webpack_require__` 用来模拟 require 导入的逻辑
- 方法`__webpack_require__.d` 给变量上面定义属性
- 方法`__webpack_require__.r` 用来添加 es module 标识的方法，标识是一个 es 模块
- 所有的导出变量都会挂载到`module.exports`上。再由这个值进行返回
- 但是定义 es module 导出的变量的时候，给变量上定义取值的 get。这样每次获取值的时候，都会执行 get 上的函数，获取到最新的值（**其实这个问题就是之前的面试题：commonJs 导出跟 esModule 有什么区别**）

## 3. 分析源码实例

[源码实例](https://github.com/a572251465/webpack-params-demo/blob/main/demo-8/resolve/main.js)
