## canvas API 大全
> 本文是对canvas的简单复习，列举出常用的api方法。以学习资料`JavaScript高级程序设计`为原型。从`18`章开始

### 1. 基础知识
- 想要使用画布行为。需要使用标签`canvas`来进行描述
- 可以给画布设置宽度以及高度。如果不进行设置的话本身会有默认的宽度以及高度
- 不是所有的浏览器都支持canvas的，为了保险起见，一般都需要添加一下代码
```js
const app = document.getElementById('app')
if  (app.getContext) {
  const ctx = app.getContext('2d')
  // 其余的功能 ...
}
```
- 同时也可以使用`toDataURL`方法导出`canvas`画像上的图像，代码如下：
```js
let drawing = document.getElementById("drawing"); 
// 确保浏览器支持<canvas> 
if (drawing.getContext) { 
  // 取得图像的数据 URI 
  let imgURI = drawing.toDataURL("image/png"); 
  // 显示图片
  let image = document.createElement("img"); 
  image.src = imgURI; 
  document.body.appendChild(image); 
}
```

### 2. 填充以及描边
> - `fillStyle` 填充：以指定样式自动填充形状
> - `strokeStyle` 描边：为图形边界着色
```js
let drawing = document.getElementById("drawing"); 
// 确保浏览器支持<canvas> 
if (drawing.getContext) { 
 let context = drawing.getContext("2d"); 
 context.strokeStyle = "red"; 
 context.fillStyle = "#0000ff"; 
}
```

### 3. 绘制矩形
> - `fillRect` 绘制矩形：方法用于指定颜色在画布上绘制并填充矩形。填充颜色用`fillStyle`来表示
> - `fillRect` 有4个参数。表示x坐标，y坐标，宽度，高度
```js
let drawing = document.getElementById("drawing"); 
// 确保浏览器支持<canvas> 
if (drawing.getContext) { 
  let context = drawing.getContext("2d"); 
  /* 
  * 引自 MDN 文档
  */ 
  // 绘制红色矩形
  context.fillStyle = "#ff0000"; 
  context.fillRect(10, 10, 50, 50); 
  // 绘制半透明蓝色矩形
  context.fillStyle = "rgba(0,0,255,0.5)"; 
  context.fillRect(30, 30, 50, 50); 
}
```
> - `strokeRect` 方法指定颜色绘制矩形轮廓
```js
let drawing = document.getElementById("drawing"); 
// 确保浏览器支持<canvas> 
if (drawing.getContext) { 
  let context = drawing.getContext("2d"); 
  /* 
  * 引自 MDN 文档
  */ 
  // 绘制红色轮廓的矩形
  context.strokeStyle = "#ff0000"; 
  context.strokeRect(10, 10, 50, 50); 
  // 绘制半透明蓝色轮廓的矩形
  context.strokeStyle = "rgba(0,0,255,0.5)"; 
  context.strokeRect(30, 30, 50, 50); 
}
```
> - `clearRect` 方法可以擦除画布中某个区域

### 4. 绘制路径
- arc(x, y, radius, startAngle, endAngle, counterclockwise)：以坐标(x, y)为圆心，以 radius 为半径绘制一条弧线，起始角度为 startAngle，结束角度为 endAngle（都是弧度）。最后一个参数 counterclockwise 表示是否逆时针计算起始角度和结束角度（默认为顺时针）。
- arcTo(x1, y1, x2, y2, radius)：以给定半径 radius，经由(x1, y1)绘制一条从上一点到(x2, y2)的弧线。
- bezierCurveTo(c1x, c1y, c2x, c2y, x, y)：以(c1x, c1y)和(c2x, c2y)为控制点，绘制一条从上一点到(x, y)的弧线（三次贝塞尔曲线）。
- lineTo(x, y)：绘制一条从上一点到(x, y)的直线
- moveTo(x, y)：不绘制线条，只把绘制光标移动到(x, y)。
- quadraticCurveTo(cx, cy, x, y)：以(cx, cy)为控制点，绘制一条从上一点到(x, y)的弧线（二次贝塞尔曲线）。
- rect(x, y, width, height)：以给定宽度和高度在坐标点(x, y)绘制一个矩形。这个方法
与 strokeRect()和 fillRect()的区别在于，它创建的是一条路径，而不是独立的图形
```js
      const app = document.getElementById('app')
      if (app.getContext) {
        const ctx = app.getContext('2d')

        // 创建路径
        ctx.beginPath()

        // 绘制外圈
        ctx.arc(100, 100, 99, 0, 2 * Math.PI)

        // 绘制内圈
        ctx.moveTo(194, 100)
        ctx.arc(100, 100, 94, 0, 2 * Math.PI)

        // 绘制分钟
        ctx.moveTo(100, 100)
        ctx.lineTo(100, 15)

        // 绘制时钟
        ctx.moveTo(100, 100)
        ctx.lineTo(35, 100)

        ctx.stroke()
      }
```

### 5. 绘制文本
- 即fillText()和 strokeText()。这两个方法都接收 4 个参数：要绘制的字符串、x 坐标、y 坐标和可选的最大像素宽度
- font：以 CSS 语法指定的字体样式、大小、字体族等，比如"10px Arial"
- textAlign：指定文本的对齐方式，可能的值包括"start"、"end"、"left"、"right"和"center"。推荐使用"start"和"end"，不使用"left"和"right"，因为前者无论在从左到右书写的语言还是从右到左书写的语言中含义都更明确
- textBaseLine ：指定文本的基线，可能的值包括 "top" 、 "hanging" 、 "middle" 、
"alphabetic"、"ideographic"和"bottom"。
```js
      const app = document.getElementById('app')
      if (app.getContext) {
        const ctx = app.getContext('2d')
        // 创建路径
        ctx.beginPath()

        // 绘制外圈
        ctx.arc(100, 100, 99, 0, 2 * Math.PI)

        // 绘制内圈
        ctx.moveTo(194, 100)
        ctx.arc(100, 100, 94, 0, 2 * Math.PI)

        // 绘制分钟
        ctx.moveTo(100, 100)
        ctx.lineTo(100, 15)

        // 绘制时钟
        ctx.moveTo(100, 100)
        ctx.lineTo(35, 100)

        // draw font
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('12', 100, 20)

        ctx.stroke()
      }
```

> 未完待续...

> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等
