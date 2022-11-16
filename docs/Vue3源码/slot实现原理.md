## 前言

> 此文章为个人分析源码的笔记，如果有解释不到位的地方，尽管评论。

## demo 地址

> [Gitee 地址](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/slot)

## 实例

```js
const { render, h } = Vue;

const MyComponent = {
  setup(props, ctx) {
    return () => h("div", {}, ctx.slots.default(), ctx.slots.header());
  },
};

const VueComponent = {
  setup() {
    return () =>
      h(MyComponent, null, {
        default: () => h("p", { color: "red" }, "123"),
        header: () => h("h2", null, "345"),
      });
  },
};

render(h(VueComponent), document.getElementById("app"));
```

## 源码分析

- 通过上述的实例，在生成组件`MyComponent`的时候，会在实例(`instance`)上产生`slot`属性
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/8e82fc9b147b4df8bcf0f14b867a183c.png)
- 有一个观点`组件的孩子一定是slot`。下列图例就是 slot 孩子
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/13186f25f98a4ffa9944570f88105837.png)- 接下来的目的就是将 children 上的属性都赋值给`slots`属性
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/450f8f38cd834497b9f8590d8b632b42.png)

- 最后使用的时候，直接可以通过`ctx.slots`来使用。会将属性`slots`作为参数来传递
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/2cf921dd41824322be80f55e3c83e765.png)
- 上述就是`slot`执行过程，就是将 children 的值都赋值给`slots`属性，使用的时候直接到`slots`属性上获取

## 结束

```html
<!-- MyComponent 子组件内容 -->
<div id="myComponent">
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</div>

<!-- 使用组件 父类内容 -->
<div id="parent">
  <template #header> <span>1111</span> </template>
  <template #default> <span>2222</span> </template>
  <template #footer> <span>333</span> </template>
</div>
```

上述`父组件一定会渲染成为以下结构`：

```js
{
  type: "div",
  props: {},
  children: {
    header: () => h("span", null, "111"),
    default: () => h("span", null, "222")
    footer: () => h("span", null, "333")
  }
}
```

- 其实就是将每个 slot 都渲染为可执行函数。函数返回 slot 中 html 结构
- 然后在渲染子类的时候，将`$slots = this.children`. 其实就是将 children 赋值给$slots.（上面截图有证明）
- 然后子类渲染的过程中，从$slots 上获取函数并且执行

> `slot`的原理很简单，就分析这么多了。下一篇我们来分析`ref`如何赋值的
