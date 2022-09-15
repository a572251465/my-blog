<div align = "center"><h1>模块化的发展史</h1></div>

> 今天主要是讲述下在前端领域中模块化的发展过程。到底经历了哪些发展

![模块化](https://img-blog.csdnimg.cn/f1830f13615d499082b118398673a7f4.webp#pic_center)

## 什么是模块化

> - 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起
> - 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

## 传统方式

<hr/>

### 1. 函数

> - 可以利用函数作用域的特征，将不能的功能封装到不同的方法中，返回需要暴露的值
> - 使用者可以进行方法的调用，返回需要的值

```javascript
function fn() {
  return "xxx";
}

function fn1() {
  return "yyy";
}
```

- 缺陷：
  - 污染全局命名空间, 容易引起命名冲突或数据不安全
  - 模块成员之间看不出直接关系

### 2. 命名空间

> - 可以使用对象来封装命名空间

```javascript
const obj1 = {
  fn: function () {},
};

const obj2 = {
  fn: function () {},
};
```

- 作用：减少了全局变量，解决命名冲突
- 问题：数据不安全(外部可以直接修改模块内部的数据)

## CommonJs

<hr/>

### 1. 概述

> Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理

### 2. 特点

> - 所有代码都运行在模块作用域，不会污染全局作用域。
> - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存
> - 模块加载的顺序，按照其在代码中出现的顺序。

### 3. 基本语法

- 暴露模块：module.exports = value 或 exports.xxx = value
- 引入模块：require(xxx),如果是第三方模块，xxx 为模块名；如果是自定义模块，xxx 为模块文件路径

> 此处我们有个疑问：**CommonJS 暴露的模块到底是什么?** CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

```javascript
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

### 4. 模块的加载机制

> CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

```javascript
// lib.js
var counter = 3;

function incCounter() {
  counter++;
}

module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 counter 和改写这个变量的内部方法 incCounter。

```javascript
// main.js
var counter = require("./lib").counter;
var incCounter = require("./lib").incCounter;

console.log(counter); // 3
incCounter();
console.log(counter); // 3
```

### 5. 通过 babel 解析看结果

![babel解析](https://img-blog.csdnimg.cn/4b438ec6197e4721872ad83091b2184e.png)

- 通过上述实例可以看出，代码`const {counter} = require('./counter')` 其实是解析为`var counter = _require.counter;`
- 会将导出内容赋值给一个全新的变量。那么新的变量跟模块中的变量没有任何关系。可以理解为下层关系：

> - 所以输入的是被输出值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

```javascript
const obj = {
  a: 1,
};
let b = obj.a;
```

## AMD

<hr />

> - AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。
> - CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD 规范则是非同步加载模块，允许指定回调函数。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。此外 AMD 规范比 CommonJS 规范在浏览器端实现要来着早

### 1. 基本用法

1. 定义暴露模块:

```javascript
//定义没有依赖的模块
define(function () {
  return 模块;
});

//定义有依赖的模块
define(["module1", "module2"], function (m1, m2) {
  return 模块;
});
```

2. 引入使用模块:

```javascript
require(["module1", "module2"], function (m1, m2) {
  // 使用m1 / m2
});
```

### 2. 未使用 AMD 规范与使用 require.js

#### 1. 未使用 AMD 规范

```javascript
// dataService.js文件
(function (window) {
  let msg = "www.baidu.com";

  function getMsg() {
    return msg.toUpperCase();
  }

  window.dataService = { getMsg };
})(window);
```

```javascript
// alerter.js文件
(function (window, dataService) {
  let name = "Tom";

  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }

  window.alerter = { showMsg };
})(window, dataService);
```

```javascript
// main.js文件
(function (alerter) {
  alerter.showMsg();
})(alerter);
```

```javascript
// index.html文件
<div>
  <h1>Modular Demo 1: 未使用AMD(require.js)</h1>
</div>
<script type="text/javascript" src="js/modules/dataService.js"></script>
<script type="text/javascript" src="js/modules/alerter.js"></script>
<script type="text/javascript" src="js/main.js"></script>
```

运行结果：
![运行结果](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b0f75e105b894~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- 缺点：
  - 会发送多个请求
  - 引入的 js 文件顺序不能搞错，否则会报错

#### 2. AMD 规范

```javascript
// dataService.js文件
// 定义没有依赖的模块
define(function () {
  let msg = "www.baidu.com";

  function getMsg() {
    return msg.toUpperCase();
  }

  return { getMsg }; // 暴露模块
});
```

```javascript
//alerter.js文件
// 定义有依赖的模块
define(["dataService"], function (dataService) {
  let name = "Tom";

  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }

  // 暴露模块
  return { showMsg };
});
```

```javascript
// main.js文件
(function () {
  require.config({
    baseUrl: "js/", //基本路径 出发点在根目录下
    paths: {
      //映射: 模块标识名: 路径
      alerter: "./modules/alerter", //此处不能写成alerter.js,会报错
      dataService: "./modules/dataService",
    },
  });
  require(["alerter"], function (alerter) {
    alerter.showMsg();
  });
})();
```

```html
// index.html文件
<!DOCTYPE html>
<html>
  <head>
    <title>Modular Demo</title>
  </head>
  <body>
    <!-- 引入require.js并指定js主文件的入口 -->
    <script data-main="js/main" src="js/libs/require.js"></script>
  </body>
</html>
```

- 此外在项目中如何引入第三方库？只需在上面代码的基础稍作修改：

```javascript
// alerter.js文件
define(["dataService", "jquery"], function (dataService, $) {
  let name = "Tom";

  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }

  $("body").css("background", "green");
  // 暴露模块
  return { showMsg };
});
```

```javascript
// main.js文件
(function () {
  require.config({
    baseUrl: "js/", //基本路径 出发点在根目录下
    paths: {
      //自定义模块
      alerter: "./modules/alerter", //此处不能写成alerter.js,会报错
      dataService: "./modules/dataService",
      // 第三方库模块
      jquery: "./libs/jquery-1.10.1", //注意：写成jQuery会报错
    },
  });
  require(["alerter"], function (alerter) {
    alerter.showMsg();
  });
})();
```

> 上例是在 alerter.js 文件中引入 jQuery 第三方库，main.js 文件也要有相应的路径配置。
> 小结：通过两者的比较，可以得出 AMD 模块定义的方法非常清晰，不会污染全局环境，能够清楚地显示依赖关系。AMD 模式可以用于浏览器环境，并且允许非同步加载模块，也可以根据需要动态加载模块

## CMD

<hr />

> - CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。
> - CMD 规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD 规范整合了 CommonJS 和 AMD 规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD 模块定义规范。

### 1. CMD 规范基本语法

- 定义暴露模块：

```javascript
//定义没有依赖的模块
define(function (require, exports, module) {
  exports.xxx = value;
  module.exports = value;
});
```

```javascript
//定义有依赖的模块
define(function (require, exports, module) {
  //引入依赖模块(同步)
  var module2 = require("./module2");
  //引入依赖模块(异步)
  require.async("./module3", function (m3) {});
  //暴露模块
  exports.xxx = value;
});
```

- 引入使用模块：

```javascript
define(function (require) {
  var m1 = require("./module1");
  var m4 = require("./module4");
  m1.show();
  m4.show();
});
```

## UMD

> 号称是统一模块化规范，是 ADM 规范以及 CommonJs 规范的整合

```javascript
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.Modularity = {})));
})(this, function (exports) {
  "use strict";
});
```

<hr />

## ES Module

<hr />

> ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

### 1. ES6 模块化语法

> export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

```javascript
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
  return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from "./math";

function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

### 2. 从 babel 看 es module

![](https://img-blog.csdnimg.cn/38490f2567ee40109821154785219ec7.png)

- 通过上述实例可以看出：
  - 虽然代码中是通过 import 解构导出 `import {a} from './lib'`. 但是从编译之后其实还是都出一个对象
  - 虽然使用的时候使用的是导出的变量，但是编译后是对象的某个变量值。如上图
  - 所以说 es6 模块输出的是值的引用

## ES6 模块与 CommonJS 模块的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

## AMD 以及 CMD 区别

- 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行
- CMD 推崇依赖就近，AMD 推崇依赖前置
- [详细地址](https://www.zhihu.com/question/20351507/answer/14859415)

## 参考资料

[前端模块化详解(完整版)](https://juejin.cn/post/6844903744518389768#heading-49)
