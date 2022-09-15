## 作用域

### 1. 什么是执行上下文

<hr />

- `执行上下文`在 JavaScript 中是一个非常重要的概念
- 变量以及函数的上下文决定了他们可以访问哪些数据
- 每个上下文都会关联一个`变量对象`，上下文中变量以及函数都会定义在变量对象中
- 每次函数执行的时候，都会形成一个执行上下文。多个函数依次执行会形成一个执行上下文栈。函数执行结束后会从栈中弹出，同样`变量对象`也会被销毁
  ![执行上下文栈](https://img-blog.csdnimg.cn/6cbe967f49cc4c579167e57742dd48d4.png#pic_center)

### 2. 什么是作用域

<hr />

- 上下文中的代码在执行过程中，会创建变量对象的一个作用域链。
- 多个作用域链决定了各级上下文中的代码的访问变量和函数的顺序
  ![作用域链](https://img-blog.csdnimg.cn/0fe4f892e4a341f18163800c1509b782.png#pic_center)

```js
function a() {
  const test = "a";

  function b() {
    console.log(test);
    const test1 = "c";
    console.dir(b);

    function c() {
      console.log(test, test1);
      console.dir(c);
    }

    c();
  }

  b();
}

a();
```

![实现效果](https://img-blog.csdnimg.cn/f21a502fad5a452897ddc21df3cd9dd5.png#pic_center)

### 3. 作用域的确定在哪个阶段呢

```js
const name = "李四";

function run() {
  const name = "张三";
  return function exec() {
    console.log(name); // 张三
    console.dir(exec);
  };
}

const fn = run();
fn();
```

![](https://img-blog.csdnimg.cn/28b6a0bd2a084ce7971ad73b71487a81.png#pic_center)

> - 上述结果是`张三`并非`李四`。其实也是说明了变量的查询范围跟定义的位置有关，跟执行的位置无关。为什么会会先这种结果呢？？？
> - 因为在函数创建的时候，函数的作用域链已经确定好了，当函数无论在什么位置执行。当前作用域查询不到变量时，会沿着作用域链向上查找。直到找到位置/ 找到顶级作用域也找不到
