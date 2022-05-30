## new 实现

### 实现方法
```js
/**
 *  const p = new Person('李四', 20)
 */
// 函数的参数Ctor 比喻是构造函数Person
function createObject(Ctor, ...args) {
  // 1. 创建一个对象，将对象的原型链指向Ctor.prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 执行构造函数，将函数的this指向新的对象
  const result = Ctor.apply(obj, args)
  return typeof result === 'object' ? result : obj
}
```