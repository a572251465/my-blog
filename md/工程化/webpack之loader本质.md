<h1 align = "center">loader本质</h1>

## 1. 前言

> 今天来探讨下 loader 本质是什么。 为什么 webpack 中需要 loader， 在今天的文章中会为大家一一揭晓答案

- `loader的本质是什么` 其实一个单纯的函数，而这个函数的作用是非常重要的。webpack 将自己无法识别的内容给函数，函数内部经过转换后在返回给 webpack
- `为什么需要loader` webpack 号称是 js 打包器。顾名思义的话就是只识别 js/ json。 如果遇到了 ts/ css/ scss 等 是无法识别的，所以就需要 loader 来转换

## 2. loader 详解

[测试实例](https://github.com/a572251465/webpack-params-demo/tree/main/webpack-1)

### 2.1 分类

- 我们可以自定义 loader，在本地编译的时候使用。也可以使用第三方 loader，通过 npm 下载来使用

### 2.2 执行顺序

- 在配置文件中配置 loader 的时候，执行顺序是`从下到上`, `从右到左`的一个过程

### 2.3 执行流程

- 最下面/ 最右边的 loader 接受到源代码后，经过自己的处理后，会将处理过的内容传递给下一个 loader
- 下一个 loader 接受数据后开始处理。依次类推，最后一个 loader 将数据内容返回给 webpack

## 3. 具体实例

![在这里插入图片描述](https://img-blog.csdnimg.cn/ce1137160ca340bf8c01a5458bb3dd85.png)

- 上述的代码其实就是`babel-loader`中实现部分。 更加可以体现出`loader`本质上其实就是一个函数
