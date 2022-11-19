<h1 align = "center">指纹锁</h1>

## 序言

> 当我们说起 webpack 指纹锁，听起来就不知所措啊，都被这些高大上的词唬住了。其实并不是这样的，他到底是什么呢？？无非就是 hash 值。接下来我们一起来探索下，我会结合代码以及实例来进行讲述

## 实例目录结构

![图片.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d676616c22043228ce985a0287e192c~tplv-k3u1fbpfcp-watermark.image?)

- 我们会在 webpack 中配置两个入口：mian 以及 main1
- 在入口 main 中 通过 import 引入了两个文件 brach.js, brach1.js

## 指纹锁探秘

### 1. 占位符使用

| 占位符名称  | 含义                                                          |
| ----------- | ------------------------------------------------------------- |
| ext         | 资源后缀名                                                    |
| name        | 文件名称                                                      |
| path        | 文件的相对路径                                                |
| folder      | 文件所在的文件夹                                              |
| hash        | 每次 webpack 构建时生成一个唯一的 hash 值                     |
| contenthash | 根据内容生成 hash 值，文件内容相同 hash 值就相同              |
| chunkhash   | 根据 chunk 生成 hash 值，来源于同一个 chunk，则 hash 值就一样 |

### 2. hash 值

- 修改前打包 hash 值：
  ![图片.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04d2cac107ff42fe845a740fc4b79b43~tplv-k3u1fbpfcp-watermark.image?)
- 修改后打包 hash 值：

![图片.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0a9dac22ef24530a664ec0d480d299d~tplv-k3u1fbpfcp-watermark.image?)
-- 其实我就修改了一个 branch.js 的打印值，导致了 hash 值发生了变化

### 3. contenthash 值

- 修改前的 hash 值

![图片.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/693bb8977be5472c9ea036627f17c150~tplv-k3u1fbpfcp-watermark.image?)

- 修改后的 hash 值

![图片.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/576e45977fc44efb81106de7b808b36f~tplv-k3u1fbpfcp-watermark.image?)

- 只是将 branch.js 的进行修改，通过上面的截图我们可以看到，对应文件的 hash 值发生变化，导入这个文件的主入口的 hash 也发生了变化，其余的 hash 值不变的

### 4. chunkhash 值

- 修改前的 hash 值

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7c7660f382943de9a62d9043e2c48cc~tplv-k3u1fbpfcp-watermark.image?)

- 修改后的 hash 值

![图片.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d359ce59a9ef490b87766f6cc3d06eb1~tplv-k3u1fbpfcp-watermark.image?)

- 通过上述代码我们可以到，我只是修改了 mian1.js 内容，这个入口的 hash 值发生了变化

## 指纹用途

> hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存

- 通过上述的描述可以看下，其实 hash 也是为了配合 cdn 以及其余的缓存的。

### 优缺点

- hash 值：如果使用 hash 的话，每次打包所有的文件共享一个 hash 值，一旦一个文件发生了变化，hash 值重置，所有的文件名字都发生了变化，这样其实起不到缓存的作用
- contenthash 值：顾名思义只有文件内容发生了变化才会生成新的 hash 值，但是也是有问题存在的，**_使用 chunkhash 存在一个问题_**，就是当在一个 JS 文件中引入 CSS 文件，编译后它们的 hash 是相同的，而且只要 js 文件发生改变 ，关联的 css 文件 hash 也会改变,这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建
- chunkhash 值：- chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

## 结束语

> 以上是我自己对 hash 指纹锁的理解，如果不对的地方欢迎大家指正啊....

- 上述地址的代码地址：[webpack-hash](https://github.com/a572251465/webpack-leraning/tree/master/webpack-hash)
