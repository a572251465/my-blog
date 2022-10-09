<h1 align = "center">computed原理刨析</h1>

> 这里大致说下`computed`实现的原理。 但是在简单说下之前会大致说下用法

## 1. 用法

```js
const data = { name: "lihh", age: 20 };
const state = reactive(data);

const newAge = computed(() => state.age * 20);

effect(() => {
  document.getElementById(
    "app"
  ).innerHTML = `我叫${state.name}, 我今年${newAge.value}岁了`;
});

setTimeout(() => {
  state.age++;
}, 4000);
```

- 通过上述示例中，API`computed`主要是用作计算属性。可以理解为属性的二次计算。例如上述示例其实是对年龄 \* 20 的计算
- 上述示例中，计算属性`newAge` 收集外层函数的 effect。 响应式属性`state.age` 收集计算属性 effect。

## 2. 简单解析

> - 从面试角度来说的话，computed 其实有两个特点：
>   - 基于 effect 来实现的
>   - 惰性的，具有缓存的效果

### 2.1 示例分析

- 接下来让我们一起分析下示例。
  1. 如果上述示例中`data.age`发生了变化，会导致计算属性`newAge`也发生变化
  2. 如果`newAge`发生变化后，会导致 effect 重新执行
- `effect` 目的其实就是为了激活当前的 effect `activeEffect`. 收集依赖

> 本来想进行画图讲解。但是画图实在太抽象了，所以只能按照源码进行标注以及讲解

### 2.2 `computed`本质是什么

```js
const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
```

[源码地址 115 行](https://github.com/a572251465/code-resolve/blob/master/vue3-resolve/packages/reactivity/src/computed.ts)

- 其实 computed 本质就是一个 class。而我们的所有的值都是在`get value() {}`上。所以使用的使用是`newAge.value`. 如下记：

```js
class ComputedRefImpl {
  get value() {
    return "xxx";
  }
}
```

### 2.3 为什么说`computed`是基于 effect 实现的

```js
// 本身computed 也是一个effect
this.effect = new ReactiveEffect(getter, () => {
  // 当依赖的属性发生变化的时候 调用此方法
  if (!this._dirty) {
    this._dirty = true;
    // 触发依赖
    triggerRefValue(this);
  }
});
```

[源码地址 50 行](https://github.com/a572251465/code-resolve/blob/master/vue3-resolve/packages/reactivity/src/computed.ts)

- 通过上述源码得知：
  - 其实所谓的 effect 就是类`ReactiveEffect` 实例化 出来的
  - 只不过把 computed 的参数(函数) 作为了第一个参数。同时定义了自定义调度的函数(第二个参数)

### 2.4 为什么说`computed`是基于缓存的 并且是惰性的

```js
  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    // 收集依赖
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()!
    }
    return self._value
  }
```

- 通过代码`self._value = self.effect.run()!` 可以得知。其实计算属性并不是立马执行。而是在获取值(xx.value)的时候才会执行方法
- 而且内部有个变量`_dirty` 用来判断是否获取过值。刚开始值是 true，默认会获取一次，但是之后是 false 了。也就是说在原值不修改的情况下，会使用缓存中的值
- 所以其实内部变量`_dirty` 起到了关键性的作用。是缓存判断的关键

#### 2.4.1 那什么时候缓存失效呢？？？

- 其实刚才也说了 computed 也是基于 effect 实现的。所以也是会被属性所收集的
- 当被收集的属性内容发生变化的时候，会触发类`ReactiveEffect` 中第二个参数。从而使缓存失效
