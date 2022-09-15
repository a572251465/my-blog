# 原型链

![原型链](https://img-blog.csdnimg.cn/1113671d34be4143874943f49e94233b.png#pic_center)

## 原型到原型链

> 原型以及原型链时 js 基础部分，基础中的基础，重点中的重点

### prototype

- 其实函数在被创建时，会存在两个内容。一个是函数本身，另一个是`函数.prototype`. 可以理解为函数天生就是`双胞胎`
  ![prototye实例图](https://img-blog.csdnimg.cn/7a816f3b38b74cf7a347a2a6c388a824.png#pic_center)
- 每个函数上都会存在一个属性`prototype`，这个属性指向`函数.prototype`
- `函数.prototype`上存在属性`constructor`，该属性指向函数本身
  ![代码实例图](https://img-blog.csdnimg.cn/06f7752febc94f579ef8afa73b14698d.png#pic_center)

```js
function User() {}

console.log(User.prototype.constructor === User); // true
```

### **proto**

- 每个实例都会存在属性**proto**, 实例.**proto** 会指向函数的原型对象
  ![prototye实例图](https://img-blog.csdnimg.cn/107ed94464f54a778783812e740b47dd.png#pic_center)

#### 特例：

- 具体构造 函数.**proto** === Function.prototype。停停停!!! 不是只有实例上才有属性**proto** 吗，为什么函数也可以调用呢？
  - 是因为具体的构造函数也是 Function 的实例

```js
function Person() {}
const person = new Person();

// 实例.__proto__ 指向构造函数.prototype
console.log(person.__proto__ === Person.prototype); // true
console.log(person.__proto__ === Object.getPrototypeOf(person)); // true

// 特例：具体函数.__proto__ 指向了Function.prototype
console.log(Person.__proto__ === Function.prototype); // true

// 特例：函数本身.__proto__ === 指向了Function.prototype
console.log(Function.__proto__ === Function.prototype); // true
```

### constructor

- 原型对象 prototype 存在属性`constructor`, 该属性指向构造函数本身

![constructor指向](https://img-blog.csdnimg.cn/eb8295acf6da4667a19bec328ce3e4b8.png#pic_center)

```js
function Person() {}
const person = new Person();

// 原型对象上存在属性<constructor> 指向
console.log(Person === Person.prototype.constructor);

// 实例的构造函数
console.log(person.constructor);
// person本身没有constructor属性
console.log(Object.prototype.hasOwnProperty.call(person, "constructor")); // false
// 其实是通过原型继承来的
console.log("constructor" in person); // true
```

### 实例以及原型

> 实例是通过属性`__proto__`一直向上寻找属性，先是实例自己属性 => 原型属性 => 父类实例属性 => 父类原型属性... 以此类推

![](https://img-blog.csdnimg.cn/cd54f4eaeaed466b8a692f0d25613a18.png#pic_center)

```js
function User() {
  this.name = "xxx1";
}

const u = new User();
console.log(u.name); // xxx1

function User1() {}

User1.prototype.name = "xxx2";
const u1 = new User1();
console.log(u1.name); // xxx2

function User2() {}
// User2.prototype.name = 'xxx3'
const u2 = new User2();
// 最起码保证u2.__proto__ 没有被重写
u2.__proto__.__proto__ = u;
console.log(u2.name); // xxx1

function User3() {}
const u3 = new User3();
u3.__proto__.__proto__ = u1;
console.log(u3.name); // xxx2
```

### 补充

- 所有`函数.__proto__` 都会指向`Function.prototype`
- 所有`函数.prototype.__proto__`都会指向`Object.prototype`
