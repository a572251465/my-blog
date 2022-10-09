> vue3 已经出来很久了，相信很多小伙伴也在项目中使用了，但是其内部原理如何？？？又有哪些细节进行处理了，今天我们来一起说道说道
>
> - 会分析下`reactive`响应式模块
> - 在使用缓存策略上有什么技巧
> - 为什么说`reactive` 是懒代理，而不是递归代理

### 1. 先看一段基本使用

> demo 地址：[点击这里](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/reactive)

```js
const { reactive, effect } = Vue
const target = {
  name: 'lixx',
  age: 27
}
const state = reactive(target)
const state1 = reactive(target)
const state2 = reactive(state1)
console.log(state === state1, state1 === state2) // true true

effect(() => {
  document.getElementById(
    'app'
  ).innerHTML = `我的名字是：${state.name}, 我${state.age}岁了`
})

setTimeout(() => {
  state.age = 28
}, 4000)
```

- 模块`reactive`是将对象变换为响应式
- 模块`effect`可以理解为依赖追踪，就是函数内执行依赖发生变化，会自动执行函数，初期的时候会执行一次
- 上述代码中`state === state1, state1 === state2`是为了引出`reactive`的缓存技巧

### 2. 实现一个简单的

> 手写内容包括：代理，缓存，懒代理

```js
// 源码实现部分 -----------------------------------------------------------
// 进行reactive缓存
const reactiveMap = new WeakMap()
const isObject = (target) => target && typeof target === 'object'
const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive'
}

const reactiveImpl = (target) => {
  if (!isObject(target)) {
    console.warn(`${target} need is object`)
    return
  }

  // 如果传递的是源对象，源对象被代理过后，直接返回代理后的对象
  // 这个缓存是 当target是代理前对象时
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy

  // 这个缓存时 当target是代理后对象时
  if (target && target[ReactiveFlags.IS_REACTIVE]) return target

  const proxy = new Proxy(target, {
    get: (target, key, receiver) => {
      if (key === ReactiveFlags.IS_REACTIVE) return true

      const res = Reflect.get(target, key, receiver)
      // 如果是对象，继续代理，然后返回
      return isObject(res) ? reactive(res) : res
    },
    set: (target, key, value, receiver) => {
      Reflect.set(target, key, value, receiver)
    }
  })
  reactiveMap.set(target, proxy)
  return proxy
}

const Vue = { reactive: reactiveImpl }

// 使用部分 -------------------------------------------------------------------
const { reactive } = Vue
const target = {
  name: 'lixx',
  age: 27
}
const state = reactive(target)
const state1 = reactive(target)
const state2 = reactive(state1)
console.log(state === state1, state1 === state2) // true true

document.getElementById(
  'app'
).innerHTML = `我的名字是：${state.name}, 我${state.age}岁了`
```

- 上述是`reactive`的核心部分，但是有几个点需要注意：
  - 如果传递给函数`reactive`的参数是源对象怎么办???
  - 如果传递给函数`reactive`的参数是代理后的对象怎么办???
  - 如果代理的对象是深层嵌套怎么办???
- 根据上述的问题，通过我们手写实现来一一解答：
  - 问题 1：如果传递给函数`reactive`的参数是源对象怎么办???
    - 如果传递的对象是代理前的对象，在源码中会调用`proxy`来进行代理
    - 将代理后的数据存放到`reactiveMap.set(target, proxy)` 中
    - 如果下次重复代理的时候，直接返回。可以通过上述代码`state === state1 // true`来体现出来
  - 问题 2：如果传递给函数`reactive`的参数是代理后的对象怎么办???
    - 这里有个疑问：**如果让我们自己来判断对象是否已经代理过，我们应该怎么判断呢?**
      - **直观的的办法：给`proxy`添加一个变量，判断变量是否存在。这种办法是可行的，但是如果我们不想让用户知道有这个变量怎么办呢，还有别的办法**，那接下来看下`Vue`是如何做的
    - 通过`target && target[ReactiveFlags.IS_REACTIVE]` 来判断是否代理过。执行此代码时，如果`target`是代理后对象，那么一定会触发`proxy.get`函数的，我们就可以通过代码`if (key === ReactiveFlags.IS_REACTIVE) return true`来告诉用户变量被代理过
  - 问题 3：如果代理的对象是深层嵌套怎么办???
    - `Vue`中使用了`懒代理的模式`来解决嵌套的问题。`Vue3`跟`Vue2`的区别之一就是：`Vue2`遇到迭代对象是递归重写的。但是`Vue3`是懒代理的
    - 通过代码`return isObject(res) ? reactive(res) : res` 来实现。

### 3. 源码细节扫描

#### 3.1 `reactive`只能传递对象

> 地址：`packages\reactivity\src\reactive.ts`，函数`createReactiveObject`

```ts
// 传递的属性 必须是对象
if (!isObject(target)) {
  if (__DEV__) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
  }
  return target
}
```

#### 3.2 如果被代理过了直接返回

> 地址：`packages\reactivity\src\reactive.ts`，函数`createReactiveObject`

```ts
// 此时传递对象是代理后对象
// 如果被代理过直接返回 主要是【target[ReactiveFlags.IS_REACTIVE]】起了作用
if (
  target[ReactiveFlags.RAW] &&
  !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
) {
  return target
}

// 重复代理，多次传递同一个对象进行代理
// 判断缓存中是否有值 进行返回
const existingProxy = proxyMap.get(target)
if (existingProxy) {
  return existingProxy
}
```

#### 3.3 如果传递的`target`是数组单独处理

> 地址：`packages\reactivity\src\baseHandlers.ts`，函数`createGetter`

```ts
// 判断是否是数组
const targetIsArray = isArray(target)
if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
  return Reflect.get(arrayInstrumentations, key, receiver)
}
```

#### 3.4 如果不是`只读`，收集依赖

> 地址：`packages\reactivity\src\baseHandlers.ts`，函数`createGetter`

```ts
// 如果不是只读， 触发依赖收集
if (!isReadonly) {
  track(target, TrackOpTypes.GET, key)
}
```

#### 3.5 如果是`浅代理`，代理一层后直接返回

> 地址：`packages\reactivity\src\baseHandlers.ts`，函数`createGetter`

```ts
// 如果是浅代理 直接返回
if (shallow) {
  return res
}
```

#### 3.6 如果是`ref`,直接调用`.value`进行返回

> 地址：`packages\reactivity\src\baseHandlers.ts`，函数`createGetter`

```ts
// 如果代理的ref 直接使用【.value】进行返回
if (isRef(res)) {
  // ref unwrapping - skip unwrap for Array + integer key.
  return targetIsArray && isIntegerKey(key) ? res : res.value
}
```

#### 3.7 如果是深层对象，进行懒代理

> 地址：`packages\reactivity\src\baseHandlers.ts`，函数`createGetter`

```ts
// 如果返回的值对象 进行懒代理 然后返回
if (isObject(res)) {
  return isReadonly ? readonly(res) : reactive(res)
}
```

## 结束

> 上述就是针对`reactive`进行分析，以及手写部分。可以参照地址<https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/reactive>。如果觉得分享有用处的话，欢迎点赞，收藏，关注一条龙服务哦
