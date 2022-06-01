## 普通函数 VS 生成器函数
> 大体说下普通函数以及生成器函数的不同。

### 定义方式
> 普通函数
```js
function run() {}
const run1 = function () {}
```
- 函数有两种不同的定义方式。一种是函数声明的定义方式，一种是函数表达式的方式
- 函数声明的话会有`变量提升`的副作用。但是函数表达式是运行时赋值，没有变量提升

> 生成器函数
```js
function* run() {}
const run = function* () {}
```
- 生成器的定义方式跟普通函数保持一致，唯一的不同是生成器函数在方法签名后添加特殊表示`*`
- 特殊标识`*` 跟function/ 方法签名之间空格没有关系，保持几个空格都行

### 函数执行结果
> 普通函数
```js
function test() {
  return 1
}

console.log(test()) // 1
```
- 普通函数执行后 直接返回函数的结果。如果函数中没有明显的返回结果，就返回undefined

> 生成器函数
```js
function* test1() {
  return 1
}

console.log(test1()) // { '@@iterator': [Function: next] }
```
- 生成器函数第一个执行不会开始执行函数，而是返回生成器的迭代器。
- 从第二次开始才算开始执行函数

### 是否可以暂停
- 普通函数是同步处理，一旦开始执行中间无法暂停，必须执行结束
- 生成器函数一旦遇到了`yield`关键字就会暂停，等待下次调用
```js
function* run(value) {
  const res1 = yield value
  const res2 = yield res1
  const res3 = yield res2
  return res3
}

const it = run(1)
console.log(it.next()) // { value: 1, done: false }
console.log(it.next(3)) //  { value: 3, done: false }
console.log(it.next(4)) // { value: 4, done: false }
console.log(it.next(5)) // { value: 5, done: true }
```

- 每次执行生成器函数的时候，在函数内部遇到`yield`会暂停，同时会将yield后面的值返回给调用者
- 如果下一次调用函数`next`的时候，会从上一次暂停的位置继续执行
- 同时 如果给next函数进行参数传递了。也会赋值给`yield`前面的值
- 第一个调用`next`函数进行参数传递时，参数无效

