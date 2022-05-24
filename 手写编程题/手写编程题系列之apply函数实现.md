## apply实现

### 实现方案
```js

Function.prototype.apply = function () {
  // 1. 获取所有的参数
  const params = Array.from(arguments)
  // 2. 将要被修改的this指向
  const _this = params[0] || (typeof window === 'undefined' ? {} : window)
  // 3. 第二位参数
  const args = params[1]
  // 4. 函数的唯一的key
  const keyName = Symbol('apply')
  // 5. 被调用的函数
  const context = this
  // 6. 函数执行/ 传参/ 删除全局的key
  _this[keyName] = context
  _this[keyName](...args)
  delete _this[keyName]
}
```

- 函数`apply`可以修改调用函数this的指向
- 第二个参数传参，必须是数组的形式