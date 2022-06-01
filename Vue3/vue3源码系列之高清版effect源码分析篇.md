## 前言
> - 本文是继上次[vue3源码系列之高清版reactive源码分析篇](https://blog.csdn.net/weixin_42373116/article/details/124622852)之后，有一力作了。
> - 本文我们重点讲解几个知识点：
> 	- effect实现
> 	- 依赖收集
> 	- 依赖触发
> 	- 简单复习响应式
> - 讲解方式：
> 	- 基础使用
> 	- 手写实现
> 	- 对照源码

## 基础使用
```js
      const { reactive, effect } = Vue

      const data = { name: 'lixx', age: 20 }
      const state = reactive(data)

      effect(() => {
        document.getElementById('app').innerHTML = `我叫${state.name}, 我今天${state.age}岁了`
      })

      setTimeout(() => {
        state.age++
      }, 5000)
```
- 上述实例中`reactive`将数据转换成了响应式，`effect`的存在是为了实现依赖追踪
- `effect`在初期默认会执行一次，页面上显示的结果是`我叫lixx, 我今天20岁了`
- 间隔5s后，依赖更新，导致`effect`重新执行. 此时页面上显示`我叫lixx, 我今天21岁了`
- 上述实例就是简单使用，也没有什么难度，这里就不过度的赘述了。但是通过上述的实例，我们引出了
	- 如何收集依赖？？？
	- 如何触发依赖？？？
	- 如何重新执行effect的呢？？？
	- 搞懂上述三个问题，Vue的·`依赖收集`基本就ok了，接下来我们一一实现
## 手写实现
#### effect实现
```js
      // 表示当前激活的effect
      let activeEffect = null

      /**
       * @desc 实现effect
       */
      const effectImpl = (fn) => {
        const _effect = new ReactiveEffect(fn)

        // effect 函数初期执行一次
        _effect.run()
        return _effect
      }

      class ReactiveEffect {
        constructor(fn) {
          this.fn = fn
          this.active = true
          this.parent = null
          this.deps = []
        }

        run() {
          if (!this.active) return this.fn()

          try {
            // 将激活的effect 给父类
            this.parent = activeEffect
            activeEffect = this

            // 每次收集依赖之前 清空依赖
            cleanEffect(this)
            return this.fn()
          } finally {
            activeEffect = this.parent
            this.active = false
          }
        }
      }
```
- 上述就是`effect`基本实现。这里我们会挨个解释下。
- `effect`是整个`Vue`的依赖收集基础。比如：`watch`, `computed`都是以`effect`为基础的
- 其实通过上述代码可以看出。`effect`的参数是一个函数`fn`。而我们使用`ReactiveEffect`类进行包裹
- `ReactiveEffect`内部相对来说比较简单，其实就是两个意思：
	- 将当前effect设置为激活的effect`activeEffect = this`
	- 调用effect函数`fn`。通过调用函数`fn` 就执行了`document.getElementById('app').innerHTML = "我叫${state.name}, 我今天${state.age}岁了"`了。开始执行`proxy.get`了
- 此时共同变量`activeEffect `就是此时运行的`ReactiveEffect`实例
#### 依赖收集入口
```js
      /**
       * @desc 实现reactive函数
       */
      const reactiveImpl = (target) => {
        if (!isObject(target)) {
          console.warn(`${target} need is object`)
          return target
        }

        const existProxy = proxyMap.get(target)
        if (existProxy) return existProxy

        if (target[ReactiveFlags.IS_REACTIVE]) return target

        const proxy = new Proxy(target, {
          get: (target, key, receiver) => {
            const res = Reflect.get(target, key, receiver)

            // 依赖收集
            track(target, TrackOpTypes.GET, key)

            return isObject(res) ? reactive(res) : res
          },
          set: (target, key, newValue, receiver) => {
            const res = Reflect.set(target, key, newValue, receiver)

            // 触发依赖
            trigger(target, TrackOpTypes.set, key, newValue)

            return res
          }
        })
        proxyMap.set(target, proxy)
        return proxy
      }
```
- 理解上述代码可以将问题先简单化（假如只有一个函数以及一个属性）：
	- 当属性获取值的时候，会触发`proxy.get`函数，此时我们将被调用函数赋值给一个公共的变量
	- 当属性设置值的时候，会触发`proxy.set`函数，此时我们调用共同变量(上一步被赋值过了)
	- 上述就是简单原理实现。而Vue的`依赖收集`无非是这个基础上进行扩展而已
- 言归正传，通过上述的`proxy`实现。当属性获取值的时候，会触发`proxy.get`方法。从而触发依赖收集`track(target, TrackOpTypes.GET, key)`
- 通过代码`state.age++` 触发了`proxy.set`。从而执行了`trigger(target, TrackOpTypes.set, key, newValue)`
#### 依赖收集
```js
      /**
       * @desc 实现依赖收集
       */
      const track = (target, type, key) => {
        if (!activeEffect) return

        let depsMap = targetMap.get(target)
        if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()))
        }

        let dep = depsMap.get(key)
        if (!dep) {
          depsMap.set(key, (dep = new Set()))
        }

        const shouldTrack = !dep.has(activeEffect)
        if (shouldTrack) {
          // 双向记忆方便清除
          dep.add(activeEffect)
          activeEffect.deps.push(dep)
        }
      }
```
- 依赖收集方式很简单。这里阐述下依赖结构。
	- target => 元对象 key => 触发属性 activeEffect => 当前激活的effect
	- WeakMap => Map => Set => activeEffect
	- {target: [key] => {new Set([effect1, effect2])}}
	- 在外层的WeakMap中以元对象为key。值就是Map
	- 内层的Map就是以依赖的属性为key，值就是Set
	- 里层的Set中存放了多个effect。因为可能多个effect依赖相同的属性
#### 触发依赖
```js
      /**
       * @desc 实现依赖触发
       */
      const trigger = (target, type, key, value) => {
        const depsMap = targetMap.get(target)
        if (!depsMap) return

        const deps = depsMap.get(key)
        if (!deps) return

        const effects = new Set(deps)
        for (const effect of effects) {
          effect.run()
        }
      }
```
- 依赖触发就是将存储的effect找到。调用其中的`run`函数。就重新执行了
### 源码对照
#### effect实现
> 地址：`packages\reactivity\src\effect.ts` 函数：`effect`
```ts
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {

  // 用类ReactiveEffect 实现effect
  const _effect = new ReactiveEffect(fn)

  if (!options || !options.lazy) {
    // 立刻执行 收集依赖
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
```

#### 类`ReactiveEffect`实现
> 地址：`packages\reactivity\src\effect.ts` 函数：`ReactiveEffect`
```ts
/**
 * @description 使用类构造一个effect
 */
export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined
  
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    recordEffectScope(this, scope)
  }

  // 执行run函数
  run() {
    // 如果effect不是active状态 只执行函数 没有设置激活的effect
    if (!this.active) {
      return this.fn()
    }
    // 激活的effect给parent  第一个肯定是undefined
    let parent: ReactiveEffect | undefined = activeEffect
    try {
      // 上一次effect 赋值给parent
      this.parent = activeEffect
      // this表示当前激活的effect
      activeEffect = this
      // 执行函数
      return this.fn()
    } finally {
      // 将父类 赋值给effect
      activeEffect = this.parent
      this.parent = undefined
    }
  }
}
```
#### 依赖收集
> 地址：`packages\reactivity\src\effect.ts` 函数：`track`
```ts
/**
 * 依赖收集函数
 */
export function track(target: object, type: TrackOpTypes, key: unknown) {
  // 如果当前effect 不激活 不进行处理
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep()))
    }

    const eventInfo = __DEV__
      ? { effect: activeEffect, target, type, key }
      : undefined

    trackEffects(dep, eventInfo)
  }
}
```
#### 触发依赖
> 地址：`packages\reactivity\src\effect.ts` 函数：`trigger`
- 触发依赖的细节比较多。将源码赋值过来意义不大。这里就不复制了

## 结束
> - 源码中所有的逻辑都不在一个文件中，所以看起来相对费劲点。但是小编写的demo是按照源码来的，可以称之为缩小版。连起名字都是模仿源码的。如果能理解小编手写的源码。再对照着给出的源码位置大体看下。基本就没有问题了。如果有什么问题？？？ 欢迎留言啊
> - 如果觉得整个分析对各位有帮助的话，欢迎点赞 + 收藏 + 关注一条龙哦
## 手写源码以及demo地址
> - [手写源码以及demo地址](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/effect)
> - https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/effect
