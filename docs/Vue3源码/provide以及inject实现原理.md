> 纯属个人笔记，记录下断点学习 vue3 中 provide 以及 inject，如果对大家有用处，麻烦点赞/ 收藏/ 关注一条龙

> [demo 地址](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/Provide&Inject)

## 简单说下大致原理

- vue2 的 provide 以及 inject 跟 vue3 的还是很大不同的。
- vue2
  - vue2 中在组件实例化过程中，this 上会维护上下级关系，每个 this 上都会有 parent，而`inject`的原理就是一直寻找父类，直到找到或是到顶层
- vue3
  - vue3 中 instance 会存在属性`provides`，而每个组件在实例过程中都会将自身的`provides`属性，赋值给子类 instance 的`provides`属性
  - 所以 vue3 中寻找的话是直接寻找父类，没有的话才会按照原型链进行寻找

## 实例代码

```js
const { reactive, provide, inject, render, h } = Vue

const MyComponent = {
  setup() {
    debugger
    const personInfo = inject('personInfo')
    return () =>
      h(
        'div',
        { color: 'red' },
        `姓名${personInfo.name} -- 年龄${personInfo.age}`
      )
  }
}

const VueComponent = {
  setup() {
    const state = reactive({ name: 'lihh', age: 20 })

    debugger
    provide('personInfo', state)
    return () => h('div', {}, h(MyComponent))
  }
}

render(h(VueComponent), document.getElementById('app'))
```

- 上述实例中存在两个组件，父组件中通过 API`provide`将 reactive 属性传递给子组件
- 子组件通过`inject`来接受，并且进行渲染

## 源码解析

> provide 实例原理

```ts
// provide 入口 provide必须在setup期间进行使用
export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  if (!currentInstance) {
    if (__DEV__) {
      warn(`provide() can only be used inside setup().`)
    }
  } else {
    // 当前实例的privides 第一次一定是空的
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    // 如果是初次渲染 父类的provides跟自己的一定是保持一致的。因为是从父类复制过来的
    if (parentProvides === provides) {
      // 赋值一个新的对象 如果将来要找到话 如果找不到会按照原型链向上找的
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // TS doesn't allow symbol as index type
    // 直接赋值
    provides[key as string] = value
  }
}
```

> inject 实现原理

```ts
// inject 入口以及实现原理
export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false
): T
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true
): T
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  // inject 必须在setup中完成
  const instance = currentInstance || currentRenderingInstance
  if (instance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    // 如果实例的父类为null， 获取自身的provides 反之就是获取父类的provides
    const provides =
      instance.parent == null
        ? instance.vnode.appContext && instance.vnode.appContext.provides
        : instance.parent.provides

    // 如果存在的话 直接获取值
    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string]
    } else if (arguments.length > 1) {
      // 如果是函数的场合
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
```

## 关键点源码断点

- 将父类的`provides` 赋值给自己
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/95174c444e1142f2a2fb3c4fa7463939.png)- 通过`provide`设置值
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/d85f693a8c5b41b9a009cb085f02e6df.png)

- 通过`inject`获取值
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/aca3a2c18397482b8eac8ae3367e27b1.png)
