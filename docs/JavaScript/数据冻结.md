<div align = "center"><h1>数据密封/ 冻结</h1></div>

> 今天的目的主要是分享下在开发过程中，我们如何做到数据不可修改，有哪几种技术方案呢

### Object.preventExtensions

#### 1. 定义

> - Object.preventExtensions() 方法让一个对象变的不可扩展，永远不能添加新的属性
> - 对象原型上依然可以添加属性
> - 一旦对象设置为不可扩展，就不能设置为可扩展
> - 严格模式下，给一个不可扩展的属性赋值的话，会报错

#### 2. 判断方法

> Object.isExtensible 如果是 true 表示可以扩展/ 反之就是不可以扩展

#### 3. 代码实例

```javascript
const obj = Object.preventExtensions({
  name: "lihh",
  age: 20,
  school: {},
});
console.log(obj); // { name: 'lihh', age: 20, school: {} }

// ---- 删除操作 ----
delete obj.name;

console.log(obj); // {age: 20, school: {}}

// ---- 修改操作 ----
obj.age += 1;

console.log(obj); // {age: 21, school: {}}

// ---- 添加操作 ----
obj.address = "shandong";
console.log(obj); // ❌  {age: 21, school: {}}  添加失败

// --- 添加更深层的属性 -----
obj.school.name = "大学";
console.log(obj); // {age: 21, school: {name: '大学'}}
```

> - 通过上述实例可以得出：
> - 使用 API`Object.preventExtensions` 的时候，对象不可扩展属性(`无法添加新的属性`)
> - 但是如果是对象中嵌套对象的话，里层对象还是可以添加属性的(`对深层对象没有效果`)

### Object.seal

#### 1. 定义

> - `Object.seal` 方法封装一个对象，阻止添加新的属性并将现有属性标记为不可配置，当前属性的值只要原来是可写的就可以改变(`不可添加，不可删除`)
> - 不可配置：不可删除/ 一个属性不能被 重新定义为可访问属性
> - `__proto__` 属性也是不能修改

#### 2. 判断方法

> `Object.isSealed` 判断属性是否密封。如果为 true 表示没有密封。反之就是已经密封

#### 3. 代码实例

```javascript
const info = Object.seal({
  name: "lihh",
  age: 20,
  school: {},
});

// 修改之前
console.log(info); // { name: 'lihh', age: 20, school: {} }

// 属性删除
delete info.name;
console.log(info); // × 删除失败 { name: 'lihh', age: 20, school: {} }

// 属性修改
info.age += 1;
console.log(info); // { name: 'lihh', age: 21, school: {} }

// 属性添加
info.address = "shanxi";
console.log(info); // 添加失败 { name: 'lihh', age: 20, school: {} }

// 深层属性添加
info.school.name = "大学";
console.log(info); // { name: 'lihh', age: 20, school: {name: '大学'} }
```

> - 通过上述实例可以得出：
> - 使用 API`Object.seal` 的时候，对象不可删除/ 不可添加/ 可以修改
> - 但是如果是对象中嵌套对象的话，里层对象还是可以添加/删除 属性的(`对深层对象没有效果`)

### Object.freeze

#### 1. 定义

> - `Object.freeze` 方法可以冻结一个对象，一个被冻结的对象，不能给其添加新属性/ 修改属性/ 删除属性。
> - 不能修改该对象已有属性的可枚举性，可配置性，可写性，以及不能修改已有属性的值
> - 冻结一个对象后该对象的原型也不能被修改。

#### 2. 判断

> `Object.isFrozen` 判断结果如果是 true 表示没有被冻结，反之表示已经被冻结

#### 3. 代码实例

```javascript
const info = Object.freeze({
  name: "lihh",
  age: 20,
  school: {},
});

// 原始属性
console.log(info); // { name: 'lihh', age: 20, school: {} }

// 修改属性
info.age += 1;
console.log(info); // 修改失败 { name: 'lihh', age: 20, school: {} }

// 删除属性
delete info.name;
console.log(info); // 删除失败 { name: 'lihh', age: 20, school: {} }

// 添加属性
info.address = {};
console.log(info); // 添加失败 { name: 'lihh', age: 20, school: {} }

// 更加深层次添加属性
info.school.name = "大学";
console.log(info); // { name: 'lihh', age: 20, school: {name: '大学'} }
```

> - 通过上述实例可以得出：
> - 使用 API`Object.freeze` 的时候，对象不可删除/ 不可添加/ 不可修改/ 不可配置
> - 但是如果是对象中嵌套对象的话，里层对象还是可以添加/删除 属性的(`对深层对象没有效果`)
