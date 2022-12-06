<h1 align = "center">babel ast</h1>

> 所有的 AST 转换都要遵守 EsTree 规范

## 前言

- 市面上很多解析语法树的插件。例如：`esprima`, `acorn`, `babel`等。
- 其实 babel 基于`acorn`进行扩展，而且增加了很多 API。从开发的角度而言的话，比较推荐使用`babel`
- [astexplorer](https://astexplorer.net/)

## 1. babel 工作步骤：

- Parse(解析) 将源代码转换成抽象语法树，树上有很多的 estree 节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![](https://img.zhufengpeixun.com/ast-compiler-flow.jpg)

## 2. 常用插件

- [@babel/parser](https://www.npmjs.com/package/@babel/parser) 可以将源码转换为 AST 语法树
- [@babel/traverse](https://www.npmjs.com/package/@babel/traverse) 对 AST 树进行遍历， 并且负责替换，移除和添加节点
- [@babel/generator](https://www.npmjs.com/package/@babel/generator) 将 AST 转换为源码
- [@babel/types](https://www.npmjs.com/package/@babel/types) 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用

## 3. path 上的方法以及属性

    ```js
    traverse.default(ast, {
      ArrowFunctionExpression(path) {
        // ...
      },
    });
    ```

- node 当前 AST 节点
- parent 父 AST 节点
- parentPath 父 AST 节点的路径
- scope 作用域
- get(key) 获取某个属性的 path
- set(key, node) 设置某个属性
- is 类型(opts) 判断当前节点是否是某个类型
  - 例如`isArrowFunctionExpression` 判断是否是箭头函数
- find(callback) 从当前节点一直向上找到根节点(包括自己)
- findParent(callback)从当前节点一直向上找到根节点(不包括自己)
- insertBefore(nodes) 在之前插入节点
- insertAfter(nodes) 在之后插入节点
- replaceWith(replacement) 用某个节点替换当前节点
- replaceWithMultiple(nodes) 用多个节点替换当前节点
- replaceWithSourceString(replacement) 把源代码转成 AST 节点再替换当前节点
- remove() 删除当前节点
- traverse(visitor, state) 遍历当前节点的子节点,第 1 个参数是节点，第 2 个参数是用来传递数据的状态
- skip() 跳过当前节点子节点的遍历
- stop() 结束所有的遍历

> 上述方法在进行 ast 查询以及修改的时候 特别有用处

## 4. scope 作用域上属性

- scope.bindings 当前作用域内声明所有变量
- scope.path 生成作用域的节点对应的路径
- scope.references 所有的变量引用的路径
- getAllBindings() 获取从当前作用域一直到根作用域的集合
- getBinding(name) 从当前作用域到根使用域查找变量
- getOwnBinding(name) 在当前作用域查找变量
- parentHasBinding(name, noGlobals) 从当前父作用域到根使用域查找变量
- removeBinding(name) 删除变量
- hasBinding(name, noGlobals) 判断是否包含变量
- moveBindingTo(name, scope) 把当前作用域的变量移动到其它作用域中
- generateUid(name) 生成作用域中的唯一变量名,如果变量名被占用就在前面加下划线

## 5. 真实案例

- 修改代码

```js
function test() {
  const a = 10;
  const test1 = () => {
    console.log(this);
    console.log(a);
  };
  test1();
}
```

- 修改后的代码

```js
function test() {
  const a = 10;
  var _this = this;
  const test1 = function () {
    console.log(_this);
    console.log(a);
  };
  test1();
}
```

```js
const parser = require("@babel/parser");
const types = require("@babel/types");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

const str = `
function test() {
  const a = 10;
  const test1 = () => {
    console.log(this)
    console.log(a)
  }
  test1()
}
`;

const ast = parser.parse(str);

/**
 * @author lihh
 * @description 通过path 来寻找path经过的过程是否有this定义
 * @param path 节点path
 * @returns {*[]}
 */
const getThisPaths = path => {
  const thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    },
  });

  return thisPaths;
};

const transform = path => {
  const thisPaths = getThisPaths(path);
  if (thisPaths.length === 0) return;

  const thisEnv = path.findParent(
    parent =>
      (parent.isFunction() && !parent.isArrowFunctionExpression()) ||
      parent.isProgram()
  );
  let thisBindings = "_this";
  if (!thisEnv.scope.hasBinding(thisBindings)) {
    thisEnv.scope.push({
      id: types.identifier(thisBindings),
      init: types.thisExpression(),
    });
  }

  thisPaths.forEach(thisPath => {
    thisPath.replaceWith(types.identifier(thisBindings));
  });
};

traverse.default(ast, {
  ArrowFunctionExpression(path) {
    const { node } = path;
    transform(path);
    node.type = "FunctionExpression";
  },
});

const res = generator.default(ast);
console.log(res.code);
```

## end. types API

> [更多可以参照](https://babeljs.io/docs/en/babel-types#thisexpression)

### thisExpression

- `types.thisExpression()` 表示 this 表达式

  ```js
  const thisBindings = "_this";
  thisEnv.scope.push({
    id: types.identifier(thisBindings),
    init: types.thisExpression(),
  });

  // =

  var _this = this;
  ```

### identifier

- `types.identifier` 表示设置一个修饰符
- 例如上述的例子 想设置一个变量
