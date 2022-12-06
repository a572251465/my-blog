<h1 align = "center">plugin本质</h1>

> 本文主要是讲述下 webpack 中插件的本质，以及插件的实现原理。当我们知道原理后，是可以利用原理做很多事情的

## 1. 前言

- webpack 中 `loader`是负责编译的部分，将 webpack 不认识的部分编译成为认识的部分
- webpack 中 `plugin`是负责功能扩展，插件的功能贯穿着整个 webpack 生命周期
- 其实是可以在任意节点 执行插件的方法的。
- 插件的本质就是：`固定结构类 + 发布订阅`。所有配置的插件都会被订阅，然后 webpack 会在不同的时期进行广播

## 2. 自定义插件

```js
class DonePlugin {
  apply(compiler) {
    // 订阅插件
    compiler.hooks.done.tap("done-plugin", stats => {
      console.log("done-plugin");
    });
  }
}

module.exports = DonePlugin;
```

- 依据上述的插件结构：
- 首先插件一定是一个类. 必须实现`apply`方法。因为 webpack 内部是会调用的
- webpack 在调用`apply`方法的时候，会将参数`compiler`传入。可以通过该参数进行方法订阅
- 订阅到合适的钩子后，webpack 会在合适的时机进行调用

## 3. html-webpack-plugin

![在这里插入图片描述](https://img-blog.csdnimg.cn/87142626eaf3470499a58d44bfead931.png)

## end. 注意

- 其实 webpack 内部使用了包`tapable` 进行发布订阅的
