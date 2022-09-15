# requestIdleCallback

## 1. 浏览器一帧绘制内容

<hr />

![一帧执行过程](https://img-blog.csdnimg.cn/62733efb57b34a17a01c062a8046fe50.jpeg#pic_center)

> - 上述截图是浏览器一帧时间的执行内容
> - 我们按电脑的执行频率是 60hz 来算的话，是花费 16.7(`1000/60`)ms 浏览器会绘制一次
> - 每一帧执行的内容不一定都会把时间消耗结束。所以在上述截图尾部出现了空闲时间
> - 我们的目的就是如何可以利用空闲时间呢

### 1.1 场景

> - 我们有这么一个需求：需要在页面初期的时候在页面上渲染 1w+ 元素
> - 但是实际的效果是，会绘制的很慢，导致页面会很卡
> - 此时点击页面上输入框以及按钮都没有反应。
> - 都知道浏览器的绘制时不可中断的，那我们如何进行优化呢。可以在 1w+ 元素渲染过程中，不影响输入框/ 按钮进行交互

> - 答案就是`今日的主题：requestIdleCallback`

## 2. 什么是`requestIdleCallback`呢

### 2.1 定义

<hr />

`先看下mdn解释`

- window.requestIdleCallback()方法插入一个函数
- 这个函数将在浏览器空闲时期被调用。
- 这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。
- 函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序

### 2.2 执行时机

> - 浏览器绘制之后
> - 一帧的空闲时期(在一帧的尾部)

### 2.3 如何使用

```js
<body>
    <script>
        function sleep(duration) {
           let start =Date.now();
           while(start+duration>Date.now()){}
        }
        const works = [
            () => {
                console.log("第1个任务开始");
                sleep(0);//sleep(20);
                console.log("第1个任务结束");
            },
            () => {
                console.log("第2个任务开始");
                sleep(0);//sleep(20);
                console.log("第2个任务结束");
            },
            () => {
                console.log("第3个任务开始");
                sleep(0);//sleep(20);
                console.log("第3个任务结束");
            },
        ];

        requestIdleCallback(workLoop, { timeout: 1000 });
        function workLoop(deadline) {
            console.log('本帧剩余时间', parseInt(deadline.timeRemaining()));
            while ((deadline.timeRemaining() > 1 || deadline.didTimeout) && works.length > 0) {
                performUnitOfWork();
            }

            if (works.length > 0) {
                console.log(`只剩下${parseInt(deadline.timeRemaining())}ms,时间片到了等待下次空闲时间的调度`);
                requestIdleCallback(workLoop);
            }
        }
        function performUnitOfWork() {
            works.shift()();
        }
    </script>
</body>
```

### 2.4 兼容性

<hr />

![兼容性](https://img-blog.csdnimg.cn/efee4cbe42a54d46b749cb6c7128c376.png)

### 2.5 Polyfill

<hr />

[重写的 requestIdleCallback](https://github.com/a572251465/w-hooks/blob/main/packages/src/utils/requestIdleCallback.ts)
