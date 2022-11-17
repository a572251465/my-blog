
## 前言
> 所谓是"基础不牢, 地动山摇"，这一直是小编奉行的原则。所以机会今天就来了。今天的分享：主要是对js中数据类型判断的几种方式进行横向比较，一些围绕他们衍生出来的一些面试题<br/>
> 在这里先推荐一个比较好用的获取类型的插件[ where-type ](https://github.com/a572251465/where-type), https://github.com/a572251465/where-type
## 开始
### 0. 基础知识的补充
#### 1. 研究下typeof
- 一般场合下typeof可以用来基本数据类型，看下面的代码实例：
- 不知道大家是否好奇typeof到底是怎么判断数据类型，为什么只能判断基本数据类型呢
  - 其实js底层存储变量的时候，会在变量的机器码的低位1-3位来存储类型信息
  - 000: 对象
  - 010:  浮点
  - 100: 字符串
  - 110: 布尔值
  - 1: 整数
  - null: 所有的机器码都是0
  - undefined: 用-2^30 整数来表示
#### 2. 探究下instanceof
- instanceof 可以判断某个实例是否属于构造函数的实例
- 判断原则其实就是`右边函数.prototype` 是否出现在左边`对象的原型链`上
- 接下来举例来练习下：
> 前提代码：`const p = new Person`
```js
p instanceof Person // true
Object instanceof Object // true
function Foo() {}
Foo instanceof Foo // false
Foo instanceof Object // true
```
### 1. 关于typeof类型比较
```js
function test() {}
console.log(typeof 11) // number
console.log(typeof true) // boolean
console.log(typeof '111') // string
console.log(typeof Symbol(11)) // symbol
console.log(typeof undefined) // undefined
console.log(typeof null) // object
console.log(typeof []) // object
console.log(typeof {}) // object
console.log(typeof test) // function
console.log(typeof 10n) // bigint
console.log(typeof invalid) // undefined
```
#### 问题
- 其实从上述代码中我们会发现多个问题：
    - 类型null作为基础数据类型，居然判断是否object
    - 但凡是对象类型的，typeof都无法进行判断，运行结果统一都是object，无法区分详细的类型
    - 未定义的变量`invalid`在运行的时候居然没有报错
#### 结论
> 1. 我们在实际的代码过程中，可以用typeof判断基本数据类型，使用null的时候需要格外小心哦。但是针对引用数据类型则是不可以用typeof判断的
> 2. typeof判断过程中是安全的(~~~ 如果这句话无法理解，会在后面的问题中进行解答)
#### 解答
- 为什么typeof判断null是"object"(~~~ 下面的解释摘自于mdn，不过社区里同样有很多解释，不过都大同小异，明白意思即可，历史遗留问题个人觉得没必要深究)
    > 1. 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，`typeof null` 也因此返回 `"object"`。（[参考来源](https://www.2ality.com/2013/10/typeof-null.html)）
    > 2. 曾有一个 ECMAScript 的修复提案（通过选择性加入的方式），但[被拒绝了](http://wiki.ecmascript.org/doku.php?id=harmony:typeof_null)。该提案会导致 `typeof null === 'null'`。
- 未定义的变量`invalid`在运行的时候居然没有报错
    > `typeof`本身具有保护作用。如果运行一段包含未定义变量的代码，通常的结果都是运行报错。但是`typeof`会判断是`undefined`。 其实这样做也避免了一定的运行错误
### 2. instanceof 来实现类型判断
```js
function Person() {}
const p = new Person()
console.log(p instanceof Person) // true
```
> 上述的方式一般都是常规的使用方式。 可以这么做没错。但是一定是安全的吗？？？ 请看下面的例子
```js
function Person() {}
function Person1() {}
const p = new Person()
// 添加这句话
Person.prototype = Person1.prototype
console.log(p instanceof Person) // false
```
> 上面的判断居然是`false`, 说明了如果使用这种方式进行判断, 我们可以轻而易举的就修改了判断结果。(~~~ 当然实际的作业中谁也不会闲的没事干，修改这个东西去。但是类似的知识点我们一定要知道)<br/>
> 其实这个问题映射除了两个面试编程题：instanceOf 实现原理/ instanceOf如何判断基本数据类型。接下来给大家解析下这两道面试编程题
#### 手写instanceOf 实现
```js
function Person() {}
function Person1() {}
const p = new Person()
function instanceOf(instance, Constructor) {
  if (!instance || typeof instance !== 'object') return false
  if (Function.prototype[Symbol.hasInstance]) {
    return Function.prototype[Symbol.hasInstance].call(Constructor, instance)
  }
  let proto = Object.getPrototypeOf(instance)
  if (proto === null) return false
  while (proto !== Constructor.prototype) {
    if (proto === null) return false
    proto = Object.getPrototypeOf(proto)
  }
  return true
}

console.log(instanceOf(p, Person)) // true
console.log(instanceOf(p, Person1)) // false
```
> 其实核心点就是一句话`右侧的构造函数的prototype，出现在实例的原型链上。就表示满足`
#### instanceof 如果判断基本数据类型
```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(11 instanceof PrimitiveNumber) // true
console.log(true instanceof PrimitiveNumber) // false
```
> 判断核心的关键点就在`Symbol.hasInstance`上。
### 3. 通过Constructor来判断类型
```js
function Person() {}
const p = new Person
console.log(Object.getPrototypeOf(p).constructor === Person) // true
```
> 接下来看下被修改的例子
```js
function Person() {}
function Person1() {}
const p = new Person
Person.prototype.constructor = Person1
console.log(Object.getPrototypeOf(p).constructor === Person) // false
```
> 其实原理上跟instanceof 一致。同样是不安全的
### 4. 使用Object.prototype.toString.call
```js
const map = new Map
console.log(Object.prototype.toString.call(1)) // [object Number]
console.log(Object.prototype.toString.call(true)) // [object Boolean]
console.log(Object.prototype.toString.call('111')) // [object String]
console.log(Object.prototype.toString.call(Symbol(1))) // [object Symbol]
console.log(Object.prototype.toString.call(map)) // [object Map]
console.log(Object.prototype.toString.call([])) // [object Array]
console.log(Object.prototype.toString.call(null)) // [object Null]
console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
```
> 通过上述的方式，不论是基本数据类型还是引用数据类型都可以进行判断。是不是有人会疑问难道只有Object的toString才可以吗？？？ 数组以及函数等行吗？？？
```js
const arr = [1, 2, 3]
console.log(Array.prototype.toString.call(arr)) // 1, 2, 3
function test() {
  console.log(1)
}
console.log(Function.prototype.toString.call(test))
/**
function test() {
  console.log(1)
}
 */
```
> 在实际的代码作业中，如果调用一个方法的话，会沿着原型链开始寻找，但是toString除外，每个类型都实现了自己的toString方法，所以效果不尽相同。Object.prototype.toString.call 才可以进行类型判断
### 5. 更多
- isArray
- isNaN
- 其实还有很多类型判断，但是太具有针对性。这里不过多的解释了...
## end
> 类型比较归类结束。实际开发中常用的就是上述几种。当然最多的就是第1/ 2/ 4中。希望小编的分享能帮助到各位

> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等
