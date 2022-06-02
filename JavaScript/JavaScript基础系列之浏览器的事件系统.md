## 浏览器的事件系统

### DOM事件流
> 所有的现代浏览器都支持DOM事件流，只有IE8以及更早的版本不支持
- 事件捕获
- 事件过程
- 事件冒泡

### 事件处理程序
- DOM0的事件处理方式
```js
const app = document.getElementById('app')
app.onclick = function() {
  console.log(this) // 事件本身
}

// 如果是卸载的话 就是:
app.onclick = null
```

- DOM2的事件处理方式
> DOM2在事件处理程序更像一种`发布订阅`模式，不同的函数可以订阅一个事件，等用户触发事件后再依次执行
```js
const app = document.getElementById('app')
const handle = function() {}
app.addEventListener('click', handle, false)

// 如何卸载
app.removeEventListener('click', handle, false)
```
- 在`DOM2`中使用API`addEventListener`以及`removeEventListener`来做事件绑定以及移除
- API中可以传递三个参数，第一个参数是：`事件名`，第二个参数是：`执行事件`, 第三个参数是：`执行时机`(如果是true的话，在事件捕获阶段执行。反之就是在事件冒泡阶段执行。默认就是false)

#### IE事件处理程序
> IE8以及更早的版本
- 使用API`attachEvent`以及`detachEvent`来进行事件的绑定
- 因为事件本来只支持冒泡阶段执行，所以添加的事件只能添加到冒泡阶段
- 而且添加的事件名称不能是`click`, 必须是`onclick`
```js
const app = document.getElementById('app')
const handle = function() {}

app.attachEvent('onclick', handle)
// 消除
app.detachEvent('onclick', handle)
```

#### IE事件处理程序以及DOM0等有什么不同
- attachEvent/ addEventListener绑定事件的话，前者函数中的this指向是`window`. 但是后者函数中的this是`目标元素本身`
- attachEvent/ addEventListener绑定事件的话，前者执行顺序跟添加顺序相反，但是后者执行顺序跟添加顺序保持一致
> 事件处理的兼容性
```js
const EventUtil = {
  addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeEvent(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }
}
```

### 事件对象
#### `target`以及`currentTarget`的不同
- 如果事件处理程序直接添加在了意图的目标
```js
let btn = document.getElementById("myBtn"); 
btn.onclick = function(event) { 
 console.log(event.currentTarget === this); // true 
 console.log(event.target === this); // true 
};
```

- 如果这个事件处理程序是添加到按钮的父节点
```js
document.body.onclick = function(event) { 
 console.log(event.currentTarget === document.body); // true 
 console.log(this === document.body); // true 
 console.log(event.target === document.getElementById("myBtn")); // true 
};
```

#### 阻止默认行为
- preventDefault()方法用于阻止特定事件的默认动作 / returnValue 默认为 true，设置为 false 可以取消事件默认行为
- stopPropagation()方法用于立即阻止事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡 / cancelBubble 默认为 false，设置为 true 可以取消冒泡

### 事件类型
> 更详细的内容查阅`JavaScript高级设计`
- 用户界面事件（UIEvent）：涉及与 BOM 交互的通用浏览器事件
- 焦点事件（FocusEvent）：在元素获得和失去焦点时触发
- 鼠标事件（MouseEvent）：使用鼠标在页面上执行某些操作时触发
- 滚轮事件（WheelEvent）：使用鼠标滚轮（或类似设备）时触发
- 输入事件（InputEvent）：向文档中输入文本时触发
- 键盘事件（KeyboardEvent）：使用键盘在页面上执行某些操作时触发
- 合成事件（CompositionEvent）：在使用某种 IME（Input Method Editor，输入法编辑器）输入
字符时触发

### 模拟事件
- 自定义模拟事件
> DOM3 增加了自定义事件的类型。自定义事件不会触发原生 DOM 事件，但可以让开发者定义自己的事件。要创建自定义事件，需要调用 createEvent("CustomEvent")
- type（字符串）：要触发的事件类型，如"myevent"。
- bubbles（布尔值）：表示事件是否冒泡。
- cancelable（布尔值）：表示事件是否可以取消。
- detail（对象）：任意值。作为 event 对象的 detail 属性。
```js
let div = document.getElementById("myDiv"), 
 event; 
div.addEventListener("myevent", (event) => { 
 console.log("DIV: " + event.detail); 
}); 
document.addEventListener("myevent", (event) => { 
 console.log("DOCUMENT: " + event.detail); 
}); 
if (document.implementation.hasFeature("CustomEvents", "3.0")) {
 event = document.createEvent("CustomEvent"); 
 event.initCustomEvent("myevent", true, false, "Hello world!"); 
 div.dispatchEvent(event); 
} 
```
- `event = document.createEvent("CustomEvent")` 创建自定义事件
- `event.initCustomEvent("myevent", true, false, "Hello world!");` 对创建的自定义事件 初始化事件名称等
- `div.dispatchEvent(event)` 触发自定义事件

> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等