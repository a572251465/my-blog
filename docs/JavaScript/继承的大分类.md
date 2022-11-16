<div align = "center"><h1>继承</h1></div>

> 1. 今天的目的主要是为了探究下 JavaScript 中是如何实现继承的
> 2. 目前使用最广的继承方式是哪种
> 3. 以及 es6 中 class 是如何实现的

## 1. 原型链继承

![原型链继承示意图](https://img-blog.csdnimg.cn/8a118ab9730545e299e8016d9ada1766.png#pic_center)

```javascript
function SuperType() {
  this.parent = true;
  // this.isField = false
}

SuperType.prototype.isParent = function () {
  return this.parent;
};
SuperType.prototype.isField = true;

function SubType() {}

SubType.prototype = new SuperType();

const instance = new SubType();
console.dir(instance.parent); // true
console.log(instance.isField); // 先找实例属性 再找原型属性
console.log(instance.isParent()); // true
```

> - 核心原理：将父类的实例赋值给子类函数的原型。 `SubType.prototype = new SuperType()`

- 缺陷：
  - 原型中所包含的引用值会被所有的实例所共享
  - 子类型在实例化时不能给父类型传递参数
  - 构造函数被覆盖。没有自己的构造函数指向

## 2. 盗用构造函数

> 1. 为了解决原型链包含引用值导致的问题，一种叫做"盗用构造函数"在社区流行起来
> 2. 基本思路：在子类构造函数中 调用父类的构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象。可以使用 apply/ call 来调用

```javascript
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {
  SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // [ 'red', 'blue', 'green', 'black' ]

let instance2 = new SubType();
console.log(instance2.colors); // [ 'red', 'blue', 'green' ]
```

> 1. 上述代码中借用了 盗用构造函数原理解决引用值的问题，核心在于 call this 指向的强大能力
> 2. 相比于原型链继承的话，盗用构造函数的优点就是可以在子类构造函数中给父类构造函数传递参数

- 问题：
  - 盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法。因为函数无法实现重用
  - 此外子类无法访问父类原型上的方法

## 3. 组合继承

![组合继承](https://img-blog.csdnimg.cn/624cfd9f677c427b8e16ed66c6a88f9d.png#pic_center)

> 组合继承：其实就是原型链继承以及借用构造函数继承的结合体

```javascript
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  return this.name;
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

SubType.prototype = new SuperType();
SubType.prototype.sayAge = function () {
  return this.age;
};

const instance1 = new SubType("xxx", 20);
instance1.colors.push("yellow");
console.log(instance1.colors); // [ 'red', 'blue', 'green', 'yellow' ]
console.log(instance1.sayName()); // xxx
console.log(instance1.sayAge()); // 20

const instance2 = new SubType("yyy", 21);
console.log(instance2.colors); // [ 'red', 'blue', 'green' ]
console.log(instance2.sayName()); // yyy
console.log(instance2.sayAge()); // 21
```

> 组合式继承：弥补了原型链以及借用构造函数继承方式的不足。但是本身也有一些缺陷

- 问题：
  - 父类的构造函数被实例化了两次

## 4. 原型式继承

> 1. 核心思想：不自定义类型也可以通过原型实现对象之间的信息共享。有点类似`Object.create`
> 2. 下列是最核心的实现原理：

```javascript
function object(o) {
  function F() {}

  F.prototype = o;
  return new F();
}
```

- 演示代码实例

```javascript
function object(o) {
  function F() {}

  F.prototype = o;
  const instance = new F();
  return instance;
}

let person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};

const p1 = object(person);
p1.friends.push("p1");
p1.name = "p1";

const p2 = object(person);
p2.friends.push("p2");
p2.name = "p2";

console.log(p1.friends); // [ 'Shelby', 'Court', 'Van', 'p1', 'p2' ]
console.log(p2.friends); // [ 'Shelby', 'Court', 'Van', 'p1', 'p2' ]

console.log(p1.name); // p1 name 属性在内部实例上
console.log(p2.name); // p2
```

> 原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合

## 5. 寄生式继承

> 寄生式继承背后的思路类似于寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象

```javascript
function createAnother(original) {
  let clone = object(original); // 通过调用函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式增强这个对象
    console.log("hi");
  };
  return clone; // 返回这个对象
}
```

> 寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。object()函数不是寄生式 继承所必需的，任何返回新对象的函数都可以在这里使用

## 寄生组合式继承（常用）

![寄生组合式继承](https://img-blog.csdnimg.cn/35dad19445a14b158979ec8bd19d07c7.png#pic_center)

> 1. 组合继承存在效率问题，问题在于父类的构造函数被调用了两次。
> 2. 本质上，子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了

```javascript
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function () {
  return this.name;
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

SubType.prototype = Object.create(SuperType.prototype); // 寄生组合式关键
SubType.prototype.sayAge = function () {
  return this.age;
};

const instance1 = new SubType("xxx", 20);
instance1.colors.push("yellow");
console.log(instance1.colors); // [ 'red', 'blue', 'green', 'yellow' ]
console.log(instance1.sayName()); // xxx
console.log(instance1.sayAge()); // 20

const instance2 = new SubType("yyy", 21);
console.log(instance2.colors); // [ 'red', 'blue', 'green' ]
console.log(instance2.sayName()); // yyy
console.log(instance2.sayAge()); // 21
```

> 核心在于：子类继承父类原型时，用`Object.create`来替代 父类实例化。 避免父类的构造函数再次调用

## class 核心原理

```javascript
class SuperType {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class SubType extends SuperType {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  getName() {
    return this.name;
  }
}
```

- babel 解析结果

```javascript
function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
  if (superClass) _setPrototypeOf(subClass, superClass);
}

// 为了给原型上添加属性 /方法
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var SuperType = /*#__PURE__*/function () {
  function SuperType(name) {
    _classCallCheck(this, SuperType);

    this.name = name;
  }

  _createClass(SuperType, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);

  return SuperType;
}();

var SubType = /*#__PURE__*/function (_SuperType) {
  _inherits(SubType, _SuperType);

  var _super = _createSuper(SubType);

  function SubType(name, age) {
    var _this;

    _classCallCheck(this, SubType);

    _this = _super.call(this, name);
    _this.age = age;
    return _this;
  }

  _createClass(SubType, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);

  return SubType;
```

```javascript
function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
```

### QA

1. 为什么子类继承父类后，在构造函数中子类一定要调用 super 方法

   - 通过上述代码`_this = _super.call(this, name);` 来调用父类。将 this 指向修改

2. 函数`_createClass` 是做什么的

   - 为了给原型上添加属性以及方法

3. 父类以及子类是如何 实现原型赋值的呢
   - 调用函数`_inherits(SubType, _SuperType)` 来 实现原型赋值

- 通过上述的步骤 1 以及步骤 3 可以得出，class 的实现其实就是`寄生式组合继承`的实现
