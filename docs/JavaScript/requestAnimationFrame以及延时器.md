## requestAnimationFrame
> 这里会说下`requestAnimationFrame`的由来，以及为什么会出现它。同时也会横向对比下定时器以及延时器

### 早期的动画
> 动画是一个持续的过程。早期的时候动画都是通过定时器来实现的。看如下代码
```js
(function() { 
 function updateAnimations() { 
 doAnimation1(); 
 doAnimation2(); 
 // 其他任务
 } 
 setInterval(updateAnimations, 100); 
})();
```
> - 一般的计算器显示器的屏幕刷新频率是60HZ，这就意味着是每秒要绘制60次。大多数浏览器都会显示绘制频率。
> - 为了实现动画效果过渡平滑最佳的重绘间隔大约17/毫秒。以这个速度重绘可以实现最佳的滑动效果。
> - 但是即使是这样依然无法保证能平滑过度。因为延时器/定时器的执行的时机不定。虽然可以设置执行时间。即使将延时任务添加到队列中也无法保证能立马执行。这取决于上一个任务或是同步任务执行的时间长度
> - 从js层面无法得知浏览器的绘制时机。所以函数`requestAnimationFrame`就出现了

### 函数`requestAnimationFrame`
#### 1. 执行时机
- 在每次浏览器重绘之前执行
#### 2. 使用方法
- 函数`requestAnimationFrame`只允许传递一个参数。而且参数必须是一个函数
- 参数函数会被加入到队列。在每次浏览器绘制之前将队列中的函数进行执行
- 每添加一次再下次绘制执行后，需要再次添加
```js
function updateProgress() { 
 var div = document.getElementById("status"); 
 div.style.width = (parseInt(div.style.width, 10) + 5) + "%"; 
 if (div.style.left != "100%") { 
 requestAnimationFrame(updateProgress); 
 } 
} 
requestAnimationFrame(updateProgress);
```
#### 3. 如何取消
> 在全局中提供了函数`cancelAnimationFrame`. 可以通过函数进行取消。大致的原理跟延时器/ 定时器保持一致
- 在函数`requestAnimationFrame`将函数加入队列后，会返回一个id(`可以将id理解为队列的位置`)。可以通过执行函数`cancelAnimationFrame`来进行取消
```js
let requestID = window.requestAnimationFrame(() => { 
 console.log('Repaint!'); 
}); 
window.cancelAnimationFrame(requestID);
```

### 通过函数`requestAnimationFrame`进行节流处理
```js
let enabled = true; 
function expensiveOperation() { 
 console.log('Invoked at', Date.now()); 
} 
window.addEventListener('scroll', () => { 
 if (enabled) { 
 enabled = false; 
 window.requestAnimationFrame(expensiveOperation); 
 window.setTimeout(() => enabled = true, 50); 
 } 
});
```
