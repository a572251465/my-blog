<h1 align = "center">webpack 模式多种设置方式</h1>

> 1. 从`webpack4` 开始之后出现了模式方式，设置模式后可以省略很多配置工作。比如：生产模式默认就会对 js/ css 等进行压缩。
> 2. 如果不设置模式的话，模式就是生产模式

## 基础代码

```js
const path = require("path");
const resolvePath = (...args) => path.resolve(__dirname, ...args);

module.exports = {
  entry: resolvePath("./src/index.js"),
  output: {
    path: resolvePath("dist"),
    filename: "main.js",
  },
};
```

## 1. 方式 1

> 可以通过配置文件来设置, 如下代码

```js
module.exports = {
  ...
  mode: "development", // development/production
  ...
}
```

## 2. 方式 2

> 我们可以通过命令行中添加模式参数

```bash
webpack --mode development --config webpack.config.js
```

## 3. 方式 3

> 可以通过插件`cross-env` 来设置模式

- 下载插件

```bash
pnpm install cross-env -D
```

- 命令行

```bash
cross-env NODE_ENV=development webpack --config webpack.config.js
```
