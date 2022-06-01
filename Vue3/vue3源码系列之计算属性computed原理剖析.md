## 前言
> - `vue3`诸多API中`computed`的作用毋庸置疑，也算是我们开发中使用比较多的API了。今天就让我们来探究下`computed`底层到底做了什么。如果想要学好`computed`个人觉得还是需要将`effect`有个深入的理解。这样学的东西才能融会贯通。
> - 为什么一定强调学习`effect`呢？因为无论是`watch`，`computed`都是以`effect`为基础，所以说基石很重要，如果大家看源码实在很吃力的话，个人觉得看懂我写的就够了。因为我就是按照源码一比一写出来的
> - 讲述方式：
> 	- 基本使用
> 	- 手写源码
> 	- 源码对照
## 基本使用
>  为了防止一部分人对`computed`不是很熟悉，这里也会简单说下使用方式。其实这个使用方式也是结合之后的手写源码来说的。
```js
      const data = { name: 'lihh', age: 20 }
      const state = reactive(data)

      const newAge = computed(() => state.age)

      effect(() => {
        document.getElementById('app').innerHTML = `我叫${state.name}, 我今年${newAge.value}岁了`
      })

      setTimeout(() => {
        state.age++
      }, 4000)
```
- `computed`依赖`reactive`的值进行计算，而`effect`依赖`computed`的值进行计算
![在这里插入图片描述](https://img-blog.csdnimg.cn/c6839b35dfbb4890930cb0e4d5485e1f.png)- 上述这个实例就是两个`effect`相互嵌套的问题，其中包含着诸多响应式属性以及两个`effect`。这里给逐一分析下：
	- API`effect`本身就是一个`effect`
	- `computed`是一个`effect`
	- 变量`newAge`是通过`reactive`的`age`来计算出来的
	- 变量`age`收集`computedEffect`。而`computed`本身收集`渲染effect`。所以可谓是`牵一发动全身`啊

## 手写源码
> API`computed`是使用比较多的api了。在面试过程中问到的比较多，有个最经典的问题`computed 跟 watch有什么不同`。也请大家带着这个疑问来看这段代码
- `computed`本身的实现
```ts
      const computed = (getterOrOptions) => {
        let getter
        let setter

        if (isFunction(getterOrOptions)) {
          getter = getterOrOptions
          // 此处标识computed是只读的
          setter = Function.prototype
        } else {
          getter = getterOrOptions.get
          setter = getterOrOptions.set
        }

        const res = new ComputedRefImpl(getter, setter)

        return res
      }
```
> - `computed`本身有两种使用方式：
> 	- `const xxx = computed(() => state.age)` 
> 	- `const xxx1 = computed({get: () => {}, set: () => {}})`
> - 这里需要统一做下区分，同时调用实现类`ComputedRefImpl`
> - 这个方法比较简单，接下来我们重点分析下类`ComputedRefImpl`
- 类`ComputedRefImpl`实现
```js
      class ComputedRefImpl {
        constructor(getter, setter) {
          this.getter = getter
          this.setter = setter

          this._value = undefined
          this.deps = new Set()
          this._dirty = true
          this.__v_isRef = true

          this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
              this._dirty = true

              // 触发依赖
              triggerEffect(this.deps)
            }
          })
        }

        get value() {
          // 进行依赖收集
          trackEffect(this.deps)
          if (this._dirty) {
            this._value = this.effect.run()
            this._dirty = false
          }
          return this._value
        }

        set value(newValue) {
          this.setter(newValue)
        }
      }
```
> - 上述就是关键类`ComputedRefImpl`实现方式了。这里会逐一进行讲解：
> 	- `this._value` 保存获取的值
> 	- `this.deps` 保存依赖的`effect`。这里的effect就是`渲染effect`
> 	- `this._dirty` 用来进行缓存的
> - 整个执行流程：
> 	- 这里不得不提到一点，`compuetd`本身是惰性的，不像`watch`以及`effect`一样。默认就会执行一次。只有调用的时候才会执行
> 	- 还有通过上述代码我们会发现，在构造函数中我们使用了`ReactiveEffect`来创建一个`effect`。这个类我们赋值了一个`getter`函数以及scheduler函数
> 	- 分析下执行流程：
> 		- 步骤1：执行代码`我今年${newAge.value}岁了`的时候，因为牵扯到了`newAge.value`。会执行到类`ComputedRefImpl`的`get value`函数中去
> 		- 步骤2：此时激活的effect是`渲染effect`，从而对其进行收集，体现这种话`trackEffect(this.deps)`
> 		- 步骤3：判断变量`this._dirty`。开始执行if内的代码，获取到最新的值，同时将`this._dirty`设置为false。如果在值未修改的情况下再次获取值的时候，直接使用上次返回的值
> 		- 步骤4：如果值发生了变化会执行`scheduler`函数，重新将变量`_dirty`设置为true。如果下次再次获取值重新执行`步骤3`

## 源码对照
- computed入口
> 地址:`packages\reactivity\src\computed.ts`，函数`computed`
```ts
export function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions
): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  // 预制的getter setter
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  // 判断是否是函数
  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  return cRef as any
}
```
- 类`ComputedRefImpl`实现
> 地址：`packages\reactivity\src\computed.ts`。类：`ComputedRefImpl`
> 这里代码就不粘贴了。太长了没意义。而且写法跟我手写几乎保持一致。所以看我的就够了
## 结束
> 如果我的分析对大家有帮助的话，希望大家点赞~~收藏~关注一条龙服务啊
> 源码地址：https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/computed
