<h1 align = "center">webpack require之间引用结果分析</h1>

> 通过 webpack 工具打包后，分析 require 之间模块的依赖以及引用关系

## 1. 案例代码

- 入口文件 index.js

```js
const { test } = require("./main");

module.exports = {
  title: "title",
  test,
};
```

- 引用文件 main.js

```js
const test = "test";

module.exports = {
  test,
};
```

## 2. 打包后代码

```js
// 表示头部自执行函数
(() => {
  // 此对象中包裹着每个文件的代码块
  var __webpack_modules__ = {
    "./src/index.js": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      const { test } = __webpack_require__("./src/main.js");
      module.exports = {
        title: "title",
        test,
      };
    },
    "./src/main.js": module => {
      const test = "test";
      module.exports = {
        test,
      };
    },
  };

  // 用于缓存的对象
  var __webpack_module_cache__ = {};

  // 此方法模拟require 方法
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

  // 表示入口文件
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
```

- `__webpack_modules__` 对象表示把所有的模块都整合在一起， 可以通过路径引用来调用
- `__webpack_require__` 模拟`require`的加载过程
- `require` 直接将`值` 进行导出
