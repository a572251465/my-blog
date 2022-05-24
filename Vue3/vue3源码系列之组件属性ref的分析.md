## 前言

> - 文本属于个人分析源码笔记，如果哪里不明白的话，请评论留言
> - 其实`ref`的实现原理比较简单，如果是使用在普通上获取的是元素 el，反之如果是组件上，就是组件实例

## demo

> [demo 地址](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/ref)

## 实例

```js
const { render, h, getCurrentInstance } = Vue
const MyComponent = {
  setup() {
    return () => h('p', {}, '123')
  }
}

const VueComponent = {
  setup(props, ctx) {
    const internalInstance = getCurrentInstance()
    const clickHandle = () => {
      alert('111')
      console.log(internalInstance.proxy.$refs)
    }

    return () => h(MyComponent, { ref: 'myRef', onClick: clickHandle })
  }
}

render(h(VueComponent), document.getElementById('app'))
```

- 上述实例中，当打印`internalInstance.proxy.$refs`的时候，对象中包含 key 为`myRef`, value 为子组件实例。那是如果形成的呢

## 源码分析

> 地址：`packages\runtime-core\src\renderer.ts` 函数：`patch`

```ts
if (ref != null && parentComponent) {
  setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
}
```

- 上述实例是针对属性中存在`ref`的，而且当前实例存在的时候，对`ref`进行赋值
- > 地址：`packages\runtime-core\src\rendererTemplateRef.ts` 函数：`setRef`

```ts
// 如果是组件 就是组件实例 反之就是dom
const refValue =
  vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
    ? getExposeProxy(vnode.component!) || vnode.component!.proxy
    : vnode.el
const value = isUnmount ? null : refValue
```

```ts
        } else if (_isString) {
          // 直接赋值  最有价值的一句话
          refs[ref] = value
```

- 整个方法太长了。很多代码对我们来说是无用的，上述的两段话才是关键点。如果想看整个方法的话，可以上文写的地址进行 dubgger 调试

## 结束

> 以上就是简单的组件中使用`ref`的分析。有什么问题欢迎留言
