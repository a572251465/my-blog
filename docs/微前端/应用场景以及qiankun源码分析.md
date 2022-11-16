## 微前端的应用场景以及 qiankun 源码分析

### What?什么是微前端?

![在这里插入图片描述](https://img-blog.csdnimg.cn/77d34da1f86847c68553e57cf439b63d.png)

- 微前端就是将不同的功能按照不同的维度拆分成多个子应用。通过主应用来加载这些子应用。 -微前端的核心在于拆, 拆完后在合!

### Why?为什么去使用他?

- 不同团队间开发同一个应用技术栈不同怎么破？
- 希望每个团队都可以独立开发，独立部署怎么破？
- 项目中还需要老的应用代码怎么破？
- 我们是不是可以将一个应用划分成若干个子应用，将子应用打包成一个个的 lib。当路径切换时加载不同的子应用。这样每个子应用都是独立的，技术栈也不用做限制了！从而解决了前端协同开发问题

![在这里插入图片描述](https://img-blog.csdnimg.cn/12e83009620e4c9695d33614c7717821.png)

- 2018 年 Single-SPA 诞生了， single-spa 是一个用于前端微服务化的 JavaScript 前端解决方案 (本身没有处理样式隔离，js 执行隔离) 实现了路由劫持和应用加载
- 2019 年 qiankun 基于 Single-SPA, 提供了更加开箱即用的 API （single-spa + sandbox + import-html-entry） 做到了，技术栈无关、并且接入简单（像 iframe 一样简单）

### 如何通信？？？

- 基于 URL 来进行数据传递，但是传递消息能力弱
- 基于 CustomEvent 实现通信
- 基于 props 主子应用间通信
- 使用全局变量、Redux 进行通信

### qiankun 分析大致原理

- qiankun 基于`single-spa`来进行处理
- 参数 entry 的访问 url 地址中，qiankun 是使用插件`import-html-entry` 来解析成为 template, script 等
- qiankun 单例模式下可以保证每个子应用之间的样式隔离。但是父子之间的样式隔离无法保证。除非使用了影子 DOM
- qiankun 模拟了沙箱环境。在 proxy 支持的情况下使用 proxy。不支持的情况下使用对象模拟
