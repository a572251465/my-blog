## 继承的大分类
> 接下来演示几种JavaScript中继承的实现方式。跟大家认知的`java`中的继承有所不同。也是基于`原型链`的原理。所以基础知识`原型链`一定要牢牢记住
> - 原型链继承
> - 借用构造函数继承
> - 组合继承 (上述两种的结合体)
> - 原型继承
> - 寄生组合式继承

### 原型链继承
> - 父类直接将实例赋值给子类的原型链
> - 子类无法给父类构造函数动态传递参数
> - 子类的构造函数丢失
```js
function Parent() {
  this.name = 'lihh'
}

Parent.prototype.getName = function () {
  return this.name
}

function Son() {
  this.age = 22
}
Son.prototype = new Parent()
Son.prototype.getAge = function () {
  return this.age
}

const s = new Son()
console.log(s.getName())
console.log(s.getAge())
```

### 借用构造函数继承
> - 子类的构造函数中直接通过`call`/ `apply`调用父类的构造方法，这样父类的属性变成子类自身的。
> - 解决了`原型链继承`问题中无法构造函数传递参数的问题
> - 共享方法也必须挂载属性上，每次继承都会创建新的，无法实现共享

```js
function Parent(age) {
  this.name = 'lihh'
  this.age = age
  this.getAddress = function () {
    return this.address
  }
}

function Son() {
  Parent.call(this, 22)
  this.address = '1111'
}

const s = new Son
console.log(s.getAddress())
```

### 组合继承
> - 组合继承就是原型链继承 + 借用构造函数继承
> - 通过`call/ apply`来实现属性继承，通过`prototype`实现`原型方法/属性`继承
> - 缺点：父类的构造方法被调用了两次。 调用call的时候调用了一次 + 给原型赋值的时候调用了一次

```js
function Parent(name) {
  this.name = name
}

Parent.prototype.getName = function () {
  return this.name
}

function Son() {
  Parent.call(this, 'lihh')
  this.age = 20
}

Son.prototype = new Parent()

Son.prototype.getAge = function () {
  return this.age
}

const s = new Son()
console.log(s.getAge())
console.log(s.getName())
```

### 原型继承
> - 跟`Object.create`一样，将传递参数都放置到共享的prototype属性上。
> - 造成了属性共享，实例1修改数据后，实例2也能体现出来

```js
function createObject(o) {
  function F() {}
  F.prototype = o
  return new F()
}

const person = {
  name: 'lihh',
  friends: ['11', '22', '33']
}

const p1 = createObject(person)
const p2 = createObject(person)

p1.friends.push('44')
console.log(p2.friends)
```

### 寄生组合式继承
> - 子类构造函数中使用`call/ apply`来继承父类的属性
> - 通过`Objet.create(Parent.prototype)` 实现父类共同方法继承

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function () {
  return this.name
}

function Son(name, age) {
  Parent.call(this, name)
  this.age = age
}

Son.prototype = Object.create(Parent.prototype)
Son.prototype.Constructor = Son

Son.prototype.getAge = function () {
  return this.age
}
```

