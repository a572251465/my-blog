## 对象 类以及面向对象

### 对象
#### 数据属性
> 数据属性分为不同的值，每个值的意义不同。接下来给用代码来进行演示举例下
- `value` 表示返回的实际的值
- `configurable` 表示否可以修改其特性，是否可以使用delete删除并且重新定义
- `writable` 表示属性的值是否可以被修改
- `enumerable` 表示是否可以通过`for-in`循环来遍历
```js
const person = {}
Object.defineProperty(person, 'name', {
  // 表示包含属性实际的值
  value: '张三',
  // 表示属性的值是否可以被修改
  writable: true,
  // 表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性
  configurable: true,
  // 表示属性是否可以通过 for-in 循环返回
  enumerable: true
})
```

#### 访问器属性
- `get` 获取属性值的时候会调用这个方法
- `set` 设置属性值的时候 会调用这个方法
```js
const student = {}
Object.defineProperty(student, 'name', {
  get() {
    return '李四'
  },
  set(value) {
    student.name = value
  },
  configurable: true,
  enumerable: true
})
```

### 构造函数
> 下列是构造函数的`new`的实现
```js
function createObject(Ctor, ...args) {
  // 1. 创建一个对象，将对象的原型链指向Ctor.prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 执行构造函数，将函数的this指向新的对象
  const result = Ctor.apply(obj, args)
  return typeof result === 'object' ? result : obj
}
```
- 构造函数跟普通函数除了调用方式没有什么不同
- 构造函数虽然有用但不是没有问题，构造函数的主要问题在于，**其定义的方法会在每个实例上都创建一遍**。

### 原型模式
> 每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。
```js
    function Person() {} 
    Person.prototype.name = "Nicholas"; 
    Person.prototype.age = 29; 
    Person.prototype.job = "Software Engineer"; 
    Person.prototype.sayName = function() { 
    console.log(this.name); 
    }; 
    let person1 = new Person(); 
    person1.sayName(); // "Nicholas" 
    let person2 = new Person(); 
    person2.sayName(); // "Nicholas" 
    console.log(person1.sayName == person2.sayName); // true
```
- 上述为了解决构造函数模式的问题，我们把函数/属性都定义在了`prototype`上。虽然解决了函数的问题，但是带来了新的问题，`对象本身的私有属性也变成了共同属性了`

> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等