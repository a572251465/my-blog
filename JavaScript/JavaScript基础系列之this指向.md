## this指向问题
> 在整个JavaScript中，this指向问题也是很基础而且主要的，今天主要是总结下this指向问题有哪些？？？

### this是什么？？？
1. 其实`this`就代表的自身。也可以理解为this就是自身的环境。比如我们常说的`window`
2. 总结：关于this大体的记忆的方式就是：**谁调用就是this就是谁，如果没有显示的调用方式，默认就是window的**

### 1. 代表全局
```js
function test() {
  console.log(this)
}
test()
```
- 以上的this代表什么。
- 其实上述的代码默认可以理解为`window.test()`。 因为函数是定义在全局下的，所以默认就是`this`
- 在我们真实的业务场景中，如果没有显示的调用，那么默认就是window本身(浏览器环境)，如果是Node环境的话就表示global本身

### 2. 对象调用
```js
// 实例1
const person = {
  name: 'lixx',
  getName: function () {
    return this.name
  }
}
console.log(person.getName()) // lixx

// 实例2
var name = 'yyy'
const run = person.getName
console.log(run()) // yyy
```
- 上述的实例1中 当对象调用函数的时候，函数中的this就是对象本身
- 上述的实例2中，将运行的函数赋值给别的变量，然后单独执行。此时执行方式`run()` 可以看作`window.run()` 所以函数中的this就是window
- 总体就是一个句话"谁调用函数，this就是谁"

### 3. 实例化对象
```js
function Person() {
  this.name = 'lixx'
  this.age = 20
}

Person.prototype.getName = function () {
  return this.name
}

const p = new Person()
console.log(p.getName()) // lixx

function Person1() {
  this.name = 'xxx'
  return {
    name: 'yyy'
  }
}

const p1 = new Person1
console.log(p1.name) // yyy
```
- 当this在构造函数中，表示当前的构造函数的实例。如果构造函数中返回是一个对象，此时的this表示是返回的对象

### 4. 在事件中
```html
  <body>
    <button id="btn">点击按钮 确定this</button>
    <script>
      const btn = document.getElementById('btn')
      btn.addEventListener('click', function () {
        console.dir(this) // 如果是通过按钮事件调用 表示dom事件本身
      })
    </script>
  </body>
```
- 如果在绑定的Dom事件中来触发点击事情，此时this表示Dom元素本身
