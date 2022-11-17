## 箭头函数 vs 普通函数

> - 普通函数的`this`是，谁调用 this 就是谁/ 箭头函数没有自己的`this`
> - 箭头函数中没有自己的`prototype`, 所以无法 new，但是普通函数可以的
> - 箭头函数中没有自己的`argments`, 所以不能收集参数，不过 es6 中可以使用扩展运算符。 普通函数中具有 argments
> - 箭头函数无法`new`, 但是普通户函数可以
> - 箭头函数无法变量提升。但是普通函数会进行变量提升

### 关于 this 问题

```js
const obj = {
  name: 'xxx',
  getName() {
    console.log(this.name)
  }
}
obj.getName() // xxx
const obj1 = {
  name: 'yyy',
  getName: () => {
    console.log(this.name)
  }
}
obj1.getName() // undefined
```

### 关于`prototype` 以及`argments`问题

```js
var a = function () {}
console.dir(a)
var b = () => {}
console.dir(b)
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/60025d150fb74cdcae00826f18e52aac.png)
