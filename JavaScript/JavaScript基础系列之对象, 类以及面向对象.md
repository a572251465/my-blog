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