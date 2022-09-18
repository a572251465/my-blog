## 引用类型细节总结

> 这里不罗列 API，如果需要 API 可以自行查询。只会强调一些不起眼但是很重要的细节问题

### 1. Object

- 生成对象的方式分为几种

```js
const obj = new Object();
const obj1 = {};
const obj2 = Object.create(null);
```

- 对象的 key 可以是数字/ 字符串/ symbol/ 其余的类型(数组/ 函数/ 对象)
  - 如果对象的 key 是`字符串`/ `symbol`的话，不会做任何处理
  - 如果对象的 key 是`数字`的话 会转换为字符串
  - 如果对象的 key 是`函数`/ `数组`/ `对象`的话，都会调用对应的 toString 方法进行转换
  - 但是这里需要注意下，当 key 是数组的时候，数组.toString 的时候，其实就是将每个值用逗号拼接为字符串

```js
const test = function () {};
const arr = new Array(1, 2, 3);
const namekey = Symbol("name");
const obj = { name: "1" };

const person = {
  name: "张三",
  age: 18,
  5: true,
  [test]: test,
  [arr]: arr,
  [namekey]: "张三",
  [obj]: "111",
};

const keys = Object.getOwnPropertySymbols(person);
keys.forEach(value => {
  console.log(typeof value); // symbol
});
console.log(person);
/*
{
  '5': true,
  name: '张三',
  age: 18,
  'function () {}': [Function: test],
  '1,2,3': [ 1, 2, 3 ],
  '[object Object]': '111',
  [Symbol(name)]: '张三'
}
*/
```

### 2. 数组

#### 1. 什么是类数组

- 不是函数
- 且有 length 属性
- 且 length 属性值是不大于`Number.MAX_SAFE_INTEGER`的值
- 满足以上的条件的，可以叫做`类数组`

```js
// 字符串满足上传的情况
console.log(Array.from("test")); // [ 't', 'e', 's', 't' ]
```

#### 2. Array.form

- `Array.form`是对数组的浅赋值

```js
const test = [0, 1, { name: "lihh" }];
const test1 = Array.from(test);

console.log(test === test1, test[2] === test1[2]); // false true
```

- `Array.from`可以转换 Map，Set

```js
const m = new Map().set(1, 2).set(3, 4);
const s = new Set().add(1).add(2).add(3).add(4);
console.log(Array.from(m)); // [ [ 1, 2 ], [ 3, 4 ] ]
console.log(Array.from(s)); // [ 1, 2, 3, 4 ]
```

- `Array.from`可以转换具有`length`属性的对象
  - 利用这个特性如果想生成一个指定长度且都是 1 的数组可以使用`Array.from({length: 10}).fill(1)`

```js
// 转换特殊对象
const obj = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4,
};
console.log(Array.from(obj)); // [ 1, 2, 3, 4 ]
```

### 3. Map

- Map 可以使用任何 JavaScript 数据类型作为键

#### Object 以及 Map 不同：

- 内存占用，给定固定大小内存，Map 大约可以比 Object 多存储 50%键/值对
- 插入性能 两者大致相同
- 查找速度，两者差异极小
- 删除性能，Map 的删除性能比 Object 更快

### 4. WeakMap

> ECMAScript 6 新增的“弱映射”（WeakMap）是一种新的集合类型，为这门语言带来了增强的键/值对存储机制。WeakMap 是 Map 的“兄弟”类型，其 API 也是 Map 的子集。WeakMap 中的“weak”（弱），描述的是 JavaScript 垃圾回收程序对待“弱映射”中键的方式

- 弱映射中键只能是 Object 或是 继承自 Object 的类型
- 因为是弱引用，所以不可迭代

```js
const vm = new WeakMap();

const container = { key: {} };

vm.set(container.key, "value");
function removeReference() {
  container.key = null;
}
```

> 这一次，container 对象维护着一个对弱映射键的引用，因此这个对象键不会成为垃圾回收的目标。不过，如果调用了 removeReference()，就会摧毁键对象的最后一个引用，垃圾回收程序就可以把这个键/值对清理掉

### 5. Set

- `Set`中存放的值可以是任意数据类型
- 操作的 API 跟`Map`很像，想操作 API 自行查询文档
- `Set`中添加的值是唯一的

### 6. WeakSet

> ECMAScript 6 新增的“弱集合”（WeakSet）是一种新的集合类型，为这门语言带来了集合数据结构。WeakSet 是 Set 的“兄弟”类型，其 API 也是 Set 的子集。WeakSet 中的“weak”（弱），描述的是 JavaScript 垃圾回收程序对待“弱集合”中值的方式。

- set 中的值必须是 Object 或是 继承自 Object 的类型
- 其余的跟`WeakMap` 大致保持一致

> 关注我的[GitHub 博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等
