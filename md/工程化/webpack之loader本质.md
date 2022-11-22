<h1 align = "center">loader本质</h1>

## 1. 前言

> 今天来探讨下 loader 本质是什么。 为什么 webpack 中需要 loader， 在今天的文章中会为大家一一揭晓答案

- `loader的本质是什么` 其实一个单纯的函数，而这个函数的作用是非常重要的。webpack 将自己无法识别的内容给函数，函数内部经过转换后在返回给 webpack
- `为什么需要loader` webpack 号称是 js 打包器。顾名思义的话就是只识别 js/ json。 如果遇到了 ts/ css/ scss 等 是无法识别的，所以就需要 loader 来转换

## 2 loader-runner

> 其实我们需要了解下什么是`loader-runner`. 因为我们在编译文件的时候不可能是一个 loader 在工作，有时候需要多个 loader 同时配合工作。而 loader-runner 作用在于可以将多个 loader 串起来，可以通过同步以及异步的形式来执行

![在这里插入图片描述](https://img-blog.csdnimg.cn/f1884bb50bb042919cd5facf198dc625.png)

- 其实我们都知道在配置中 loader 的执行顺序：`从右向左，从下而上`。 但是真正的执行真的是这样的吗？？？
- 其实并不是这样的。上文我们都说了 loader 本身就是一个方法，就是将源码给函数，通过函数返回想要的值。但是 loader 除了是一个函数外，其实还有一个`pitch`方法（这个方法可以有，可以没有）。如上图
- 所以真正的 loader 的执行顺序应该是`从左到右执行pitch` => `从右到左执行loader本身`

<br />

![在这里插入图片描述](https://img-blog.csdnimg.cn/54c1c9084f0347a3b28f0b0cab7d7eac.png)
[源码参照](https://github.com/a572251465/webpack-params-demo/tree/main/loader-1)

> 注意点：但是有一点需要注意，一旦出现了 pitch 有返回值，那么后面的 loader 不会执行了。会执行当前 pitch 所属 loader 的上一个 loader

## 3. loader 详解

[测试实例](https://github.com/a572251465/webpack-params-demo/tree/main/webpack-1)

### 3.1 执行顺序

- 其实 loader 的执行是存在执行顺序的。大体上分为几类：`post`, `inline`, `normal`, `pre`
- loader 本身是不具备任何执行顺序的，其执行顺序主要依赖于配置中的执行顺序。 如下列代码

```js
let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"],
  },
];
```

### 3.2 特殊的标识配置

| 符号 | 变量                 | 含义                                    |
| ---- | -------------------- | --------------------------------------- |
| `-!` | noPreAutoLoaders     | 不要前置和普通 loader                   |
| `!`  | noAutoLoaders        | 不要普通 loader                         |
| `!!` | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader |

### 3.3 loader 的同步以及异步

- loader 的执行大致分为两种情况：同步 以及异步，下面大致列举出示例

- 同步

```js
function loader() {
  return xxx;
}
```

- 异步

```js
function loader() {
  const callback = this.async();
  callback(null, xxx);
}
```

## 4. 手写示例

- babel-loader 简单实现

```js
const babelLoader = function (source) {
  console.log(this);
  const filename = this.resourcePath.split(path.sep).pop();
  const options = this.getOptions();
  const loaderOptions = {
    ...options,
    sourceMaps: true,
    filename,
  };

  let { code, map, ast } = core.transformSync(source, loaderOptions);
  // 其实这么写 也可以是同步的方式
  this.callback(null, code, map, ast);
};
```

## 5. 源码示例

![在这里插入图片描述](https://img-blog.csdnimg.cn/ce1137160ca340bf8c01a5458bb3dd85.png)

- 上述的代码其实就是`babel-loader`中实现部分。 更加可以体现出`loader`本质上其实就是一个函数
