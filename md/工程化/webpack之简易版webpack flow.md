<h1 align = "center">简易版 webpack flow</h1>

## 序言

> 今天早上小编写了一个简易版的 webpack-flow，突发奇想想记录下来 && 也是想分享给大家，所以接下来让我们看看 webpack-flow 流程以及代码实现部分，伙计们，小板凳准备好了吗？？？？？？？

## 1. webpack 执行流程

![webpackflow2020.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/560b190f33e94b86803392f0fbf8768b~tplv-k3u1fbpfcp-watermark.image?)

1. 上述的 webpack 执行流程大致就分为这几步，而我们的实现流程也是按照大致的方向来的，我们会从入口到方法一个一个讲起

## 2. 执行入口以及使用函数

- webpack 函数：我们会导出函数，这个函数用来收集参数以及实例化编译器的，同样也是执行入口
- Compiler 类：用来开始执行编译的，会暴露一个方法 run，调用 run 方法正式启动编译流程
- resolveLoader 函数：依次执行 loader 来解析代码的，这里我们模拟了 babel-loader 来解析 es6 的语法
- compose 函数：实现 loader 自下而上执行

## 3. 具体的代码实现

### 3.1 首先我们从入口出发，来看看入口到底做了什么？？？？？？

```js
// webpack 编译入口
function webpack(options) {
  // 1 -- 参数合并，将webpack调用传递的options 跟 shell中options进行合并
  const argv = process.argv.slice(2);
  const shellOptions = argv.reduce((shellOptions, curr) => {
    const { key, value } = curr.split("=");
    shellOptions[key.slice(2)] = value;
    return shellOptions;
  }, {});
  const mergeOptions = { ...options, ...shellOptions };

  // 2 -- 开始编译 得到compiler对象
  const compiler = new Compiler(mergeOptions);
  // 2 -- 加载所有配置的插件
  if (mergeOptions.plugins && Array.isArray(mergeOptions.plugins)) {
    mergeOptions.plugins.forEach(plugin => plugin.apply(compiler));
  }
  return compiler;
}
```

- 通过上述代码我们可以看到，webpack 入口函数无非是以下两种功能？？
- 将 webpack.config 参数以及 shell 命令中的参数进行合并
- 实例化编译类 Compiler,得到实例
- 加载 plugins 插件，这是预期说加载还不如说订阅，看下面的自定义 plugin 代码

```js
class DonPlugin {
  apply(compiler) {
    // 函数tap 其实就是通过tapable库进行发布订阅
    compiler.hooks.done.tap("done", () => {
      console.log("执行结束了..............");
    });
  }
}

module.exports = DonPlugin;
```

### 3.2 Compiler 实现

```js
class Compiler {
  constructor(options) {
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
    this.options = options;
  }

  // 开始编译的入口
  run() {
    const chunks = {};

    // 2 -- 开始确定编译的入口
    const { context = process.cwd(), entry } = this.options;
    if (typeof entry === "string") {
      this.options.entry = { main: entry };
    }

    // -- 此处开始调用钩子
    this.hooks.run.call("run");
    // 3 -- 开始遍历loader 开始解析文件
    resolveLoader(chunks, this);

    this.hooks.done.call("done");
    // 5 -- 写入文件
    const { path: dirPath, filename } = this.options.output;
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    Object.keys(chunks).forEach(fileName => {
      const newPath = path.join(dirPath, `${fileName}.js`);
      chunks[fileName].forEach(content => {
        fs.writeFileSync(newPath, content, { encoding: "utf-8" });
      });
    });
  }
}
```

- 首先看代码构造函数的部分，其实就是通过 tapable 来实例化了两个发布订阅钩子，run 以及 done，而上面执行 plugin 的过程无非是先订阅，触发的事件会在下面讲述。
- 开始确定编译入口，其实是通过编译入口依次进行依赖解析的
- 此时我们会看到代码`this.hooks.run.call('run')` 这个就是触发的时机，其实我们这个插件就是为了在运行的时候调用
- 编译类中会沿着入口通过 loader 挨个解析文件，就是这句代码`resolveLoader('done')`，这个代码我们会在下一步进行讲解
- 此时运行到了代码`this.hooks.done.call('done')`. 到这一步说明通过 loader 解析结束了，马上开始要写入文件了。所以我们调用了 done 钩子。
  > 此时我们联想到了上图截图中的一句话，"Webpack 会在特定的时间广播出特定的事件，插件在监听到感兴趣的事件后执行特定的逻辑"，这里所谓的特定时间就是不同阶段来触发订阅，而执行特定的事件就是插件中订阅的钩子函数

### 3.3 resolveLoader 的实现

```js
function resolveLoader(chunks, compiler) {
  // 入口文件 以及loader的module
  const { entry, module = {} } = compiler.options;
  // 解析规则
  const { rules } = module;
  // 是否配置loader
  if (rules && Array.isArray(rules)) {
    Object.keys(entry).forEach(keyName => {
      const modules = [];
      // 文件路径
      const filePath = entry[keyName];
      // 读取文件内容
      const fileContent = fs.readFileSync(filePath, "utf-8");
      rules.forEach(rule => {
        // 如果满足loader.test 匹配规则，调用对应的loader来解析
        if (rule.test.test(filePath)) {
          const methods = rule.use.map(methodPath => require(methodPath));
          modules.push(compose(methods)(fileContent));
        }
      });

      // 4 -- 完成编译 通过loader编译结束后 添加到对应的chunks
      chunks[keyName] = modules;
    });
  }
}
```

- 上述的代码不做特殊的描述了，其实就是通过 loadr 解析文件，获得文件源码

### 3.4 compose 函数实现

```js
function compose(resolveLoaders) {
  if (resolveLoaders.length === 0) return x => x;
  if (resolveLoaders.length === 1) return x => resolveLoaders[0](x);
  return resolveLoaders.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
```

> 上述代码不做过多的阐述，其实就是我们常写的 compose 的实现，这里参照了 redux 的源码实现

## 4. 结语

> 以上就是 webpack-flow 简单实现，如果不到之处欢迎指正

## 5. 源码地址 以及扩展

- 上述代码的地址是[GitBub](https://github.com/a572251465/webpack-leraning/tree/master/webpack-flow)
