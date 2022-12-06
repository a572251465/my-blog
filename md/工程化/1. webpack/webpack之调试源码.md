<h1 align = "center">调试源码</h1>

> 接下来的目的要讲述下 webpack 源码是如何调试的。在整个前端开发领域模块化打包是不可或缺的，当然 webpack 也具有举足轻重的地位，废话不多说，直接上代码

## 1. 前言

- 一般我们执行`webpack`的时候，到底是执行了什么处理呢，让我们来一起看下
  - 在包`node_modules`下有一个 .bin 目录, 目录中存在一个 webpack 文件。其实执行的是这个（如下图）
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/412d890141524be1bedb07fcd00bb731.png)
  - 所以其实从上图我们就可以看出 入口是`webpack/bin/webpack.js`, 但是其实你以为这就完了吗？？？ 其实并不是
    <br />
  - 接下来我们看下`webpack.js`的源码，从源码中寻找答案
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/700bb1a481574053bde2dc7f2d957071.png)
  - 通过上图扒拉源码我们可以看到，其实代码中真正需要执行的是`webpack-cli/bin/cli.js`

## 2. 如何调试源码

### 2.1 配置 vscode 的 launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

### 2.2 通过 debugger 的模式调试

> 值得推荐

```js
const webpack = require("webpack");
const webpackOptions = require("./webpack.config");
const compiler = webpack(webpackOptions);
//4.执行对象的run方法开始执行编译
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      assets: true,
      chunks: true,
      modules: true,
    })
  );
});
```
