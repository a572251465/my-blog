<h1 align = "center">伪import</h1>

> 随着 es6 中 module 的出现，基于动态导入以及 es 模块越来越受欢迎。接下来手动实现下 import 语法

## 代码实现

```js
function dynamicImport(url) {
  // 会返回一个promise
  return new Promise((resolve, reject) => {
    // 创建一个script标签
    const script = document.createElement("script");

    // 临时的全局名称
    const tempGlobalName = `__tempModuleLoading__${
      (Math.random() * 10000000) | 0
    }`;
    // 定义临时的全局名称
    const tempGlobalFn = `__tempReqFn__${(Math.random() * 10000000) | 0}`;
    // 给window上添加属性
    window[tempGlobalFn] = null;

    // 将类型修改为module
    script.type = "module";
    // 总共执行三步：1. 使用import语法导入模块 2. 将导入的内容挂在到全局上 3. 执行成功后调用回调方法
    script.textContent = `import * as m from "${url}"; window.${tempGlobalName} = m; window.${tempGlobalFn}();`;

    // 成功的回调
    window[tempGlobalFn] = function () {
      resolve(window[tempGlobalName]);
      delete window[tempGlobalName];
      delete window[tempGlobalFn];
      script.remove();
    };

    function errorFn() {
      reject(new Error("Failed to load module script with URL " + url));
      delete window[tempGlobalName];
      script.remove();
    }

    try {
      document.documentElement.appendChild(script);
    } catch (e) {
      errorFn();
    }
  });
}
```

## 运行逻辑分析

> 代码中的逻辑通过上面的注释其实已经很清楚了，来看下实际代码的运行结果

- 实际代码

```js
export const a = "11";

const b = "22";
export default b;
```

- 运行结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/10abf96bf955457e983bac429c3d97b2.png)

- 通过上述的截图结果，可以将 Module 理解为一个对象
- 如果是通过`export {}` 的方式导出的话，会在对象中直接添加一个属性
- 如果是通过`export default`的方式导出的话，默认的 key 就是`default`
- 那如何识别是一个 es module 模块呢 `Symbol(Symbol.toStringTag): "Module"`
- 所以一般的打包工具在打包 module 模块的时候，需要指明导出方式。（例如：rollup 配置中 `exports: "default"`）

## 参照 demo

[实际案例](https://github.com/a572251465/dynamicImport-rc)
