<h1 align = "center">webpack中import实现</h1>

## 前言

> 在 es6 中如果我们使用 module 模块的话，都需要将 JavaScript 类型修改为`module`, 但是为什么 webpack 就不需要呢。因为在其内部实现了一套`import()`函数执行过程。

## 打包结果分析地址

> - 下载的分析代码 粘贴不完全。如果想看完全的代码分析，[请移步此地址](https://github.com/a572251465/webpack-dynamic-import/tree/main/dist)
> - 主要从注释中标注了 111 > 222 > 333 > 444 > 555 > 666 > 777 的顺序看

## 实际代码分析

### 源代码

```js
// module.js
const module = {
  value: "modelValue",
};

export default module;
```

```js
// index.js 入口文件
import("./module").then(res => {
  console.log(res);
});
```

### 示例分析

- 大家应该都知道 webpack 具有代码拆分规则，除了在配置中进行配置的除外，如果是使用`import()`函数就会把 import 中引入的地址以及子模块都单独拆分到一个文件中
- 那么。上述代码中其实模块`module.js` 会被单独拆分到一个模块中
- 具体的过程 看下面的流程图

![在这里插入图片描述](https://img-blog.csdnimg.cn/90cfef06b915476b9298b265dbe4f942.png#pic_center)

- 大体总结下：
  - 首先会存在变量对象`__webpack_modules__` 存放着主模块对象，key 是模块路径，value 是对应的执行内容
    - 我们的打包入口以及每个 import 导出的模块 都会被收集，因为他们都是一个模块
  - 同时会重写全局变量`webpackChunkwebpack_dynamic_import`的 push 方法。push 方法对应的是函数`webpackJsonpCallback`
  - 加载打包的主函数。函数内容中将`import()` 函数已经转换为`__webpack_require__.e` 函数了
  - 上述 e 函数内容 其实很简单。返回一个 promise。将 promise 的状态进行收集。同时 e 函数还会加载被 import 的模块
  - 其实就是所谓的模块`module_bundle.js`。才此模块中第一行代码就是调用变量`webpackChunkwebpack_dynamic_import`的 push 方法
  - 从而调用方法`webpackJsonpCallback`。将 promise 状态修改为 resolve 状态。
  - 加载被 import 的模块内容，从而进行打印
