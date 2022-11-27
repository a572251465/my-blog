<h1 align = "center">webpack基本配置 以及优化</h1>

> 下列所有的配置项 都是以 webpack5 为准。详细的可以看官网的 API

## 1. 基本配置 1

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const resolvePath = (...urls) => path.resolve(__dirname, ...urls);

module.exports = {
  // 表示模式
  mode: "development",
  // 表示source map
  devtool: false,
  // 入口
  entry: resolvePath("./src/index.js"),
  // 出口
  output: {
    path: resolvePath("dist"),
    filename: "[name].js",
    // 每次打包 都进行清除
    clean: true,
  },

  // 解析模块
  resolve: {
    // 表示配置解析后缀
    extensions: [".js"],
    // 配置解析别名
    alias: {
      "@": resolvePath("./src"),
    },

    // 可以配置 非node_modules 下的目录
    modules: [resolvePath("./modules")],

    // 导入模块的时候 默认是查找package.json 中 【main】字段。但是可以配置，查询解析别的字段
    mainFields: ["main"],
    // 如果模块下没有文件package.json的时候  可以配置查询别的模块
    mainFiles: ["index"],
  },

  // 解析loader
  resolveLoader: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath("./public/index.html"),
    }),
  ],
};
```

### 1.1 `output.clean`

> 可以设置每次打包的时候，重新清空打包目录

### 1.2 `resolve` 以及`resolveLoader`

> 其实两个配置的解析配置相同，只不过作用不同。`resolve` 用来解析自定义模块等 `resolveLoader` 用来解析 loader 比较合适

- `extensions` 配置默认后缀
- `alias` 配置别名
- `modules` 配置定义模块 应该到哪个目录下找。默认是 node_modules
- `mainFields` 导入模块的时候 默认是查找 package.json 中 【main】字段。但是可以配置，查询解析别的字段
- `mainFiles` 如果模块下没有文件 package.json 的时候 可以配置查询别的模块

## 2. 基本配置 2

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const resolvePath = (...urls) => path.resolve(__dirname, ...urls);

module.exports = {
  entry: resolvePath("./src/index.js"),
  output: {
    clean: true,
    path: resolvePath("dist"),
    filename: "[name].js",
  },
  mode: "development",
  devtool: false,
  module: {
    // 因为不可能依赖第三方模块 所以无需解析 因为jQuery 以及lodash 不可能依赖第三方模块
    noParse: content => /jquery|lodash/.test(content),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath("./public/index.html"),
    }),

    // 忽略特定的模块
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/,
      resourceRegExp: /^\.\/locale/,
    }),
  ],
};
```

### 2.1 `noParse`

> 设置不需要解析的模块，因为我们在引入模块的时候，有的模块(jquery)是不可能引入第三方模块的，所以可以设置避免解析

### 2.1 `IgnorePlugin`

> 如果我们在引入模块的时候不需要所有的模块，我们可以忽略一些特定的导入，单独引入。例如：moment

## 3. 基本配置 3

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// 通过此插件 来计算耗时
const smw = new SpeedMeasureWebpackPlugin();

const resolvePath = (...urls) => path.resolve(__dirname, ...urls);

const config = {
  entry: resolvePath("./src/index.js"),
  output: {
    clean: true,
    path: resolvePath("dist"),
    filename: "[name].js",
  },
  mode: "development",
  devtool: false,
  devServer: {
    static: {
      directory: resolvePath("dist"),
    },
    port: 9001,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath("./public/index.html"),
    }),
    // 表示提取共同的css
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = config;
```

### 3.1 `mini-css-extract-plugin`

> 使用插件来提供共同的 css。这样有便于 css 进行缓存，我们可以根据 css 场景进行时效性缓存。同时 css 以及 js 也是可以同时请求的

### 3.2 `webpack-bundle-analyzer`

> 可以通过插件来分析打包结果中体积大小。针对体积大的进行分析

## 4. 基本配置 4

```js
const path = require("path");

const resolvePath = (...urls) => path.resolve(__dirname, ...urls);

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  mode: "development",
  devtool: false,
  output: {
    path: resolvePath("dist"),
    filename: "[name].js",
    library: "tools",
    libraryTarget: "var",
    clean: true,
  },
};
```

### 4.1 `library` 以及`libraryTarget` 配置

> - 其实我们通过 webpack 不仅可以打包。其实还是可以打包库的，但是需要上述的配置
> - 不仅是上述的打包方式，其实还有更多的打包方式。 更多的可以参考下官网 API
