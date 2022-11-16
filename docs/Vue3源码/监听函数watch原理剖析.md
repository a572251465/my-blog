## 前言
> - 继上次分析完`computed`之后，本来主要是用来分析`watch`的底层是如何实现的。大家都知道`watch`API也是开发中用的很多的api，此api用法超级简单但是细节部分很多。关于watch中的诸多细节会在这里给大家一一举例讲述。
> - 分析流程
> 	- 简单使用
> 	- 手写简单源码
> 	- 源码对照 (包括细节描述)
> - 什么是细节描述呢？？？
> 	- 什么时候直接传值
> 	- 什么时候需要用到函数
> 	- 监听`ref`, `reactive`分别执行什么场景
> 	- `deep`的场合该如何处理
## 简单使用
> 这里我们先使用监听`reactive`对象为例进行讲解。至于监听`ref`以及其他原理大致相同。讲述源码的时候会一一讲述的
```js
      const { reactive, effect } = Vue1
      const state = reactive({ name: 'lihh', age: 20 })

      watch(state, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })

      setTimeout(() => {
        state.age++
      }, 3000)

      effect(() => {
        document.getElementById('app').innerHTML = `我叫${state.name}, 今年${state.age}岁, ${
          status.value ? '我是学生' : '我不是学生'
        }`
      })
```
- 上述实例中，监听对象`state`的变化，当`对象.age`发生变化重新渲染

## 手写简单源码
> 这里也会按照源码大致结构进行重写，一定是手写最核心的。看手写之前先自己理解下`watch`应该是怎么样的
> 	- 执行`watch`监听的时候，先获取监听的值作为变更前的值
> 	- 属性修改，依赖触发。再次获取监听的值，此值为变更后的值。
> 	- 最后，将两个值都传递给callbak就完事了。所以... `watch`也是特别简单，还是那句老话“如果理解了effect, 看`watch`的源码就跟自己写的一样”
```js
      const watch = (source, cb, options = {}) => {
        return doWatch(source, cb, options)
      }

```
> - 上述为`watch`入口，分别传递监听代码，回调函数，以及传递参数。参数中包括`deep`，`immediate`等参数。
> - 为什么调用函数`doWatch`呢。其实是按照源码标准来的
```js
      const doWatch = (source, cb, { deep, immediate } = options) => {
        let getter

        if (isReactive(source)) {
          getter = () => source
          deep = true
        }

        // 如果是对象 递归遍历
        if (cb && deep) {
          const baseGetter = getter
          getter = () => traverse(baseGetter())
        }

        let effect
        let oldValue
        const job = () => {
          if (!effect.active) return

          if (cb) {
            const newValue = effect.run()
            cb(oldValue, newValue)
          }
        }

        effect = new ReactiveEffect(getter, job)
        if (immediate) {
          job()
        } else {
          oldValue = effect.run()
        }
      }
```
- 这里只对`reactive`做了解析，但是如果传递是`ref`以及`函数`。大致的原理是一样的。稍后我们会在讲解源码的时候逐一举例
- 通过上述判断`if (isReactive(source)) {` 可以看出，如果监听的是`reactive`本身的话，其实自动会变成一个`deep`操作。从而进行深度监听
- 上述实例中有一个函数`traverse`. 这个函数是干什么的呢？？？ 	
	- 目的就是遍历对象，让每个属性都收集当前的effect。
	- 如果不理解这句话，可以想想`依赖收集`核心是什么？ 不就是每个属性都收集依赖的effect，当属性发生了变化调用effect中的函数
- 从上述代码`effect = new ReactiveEffect(getter, job)`中可以看到，其实`watch`本身也是基于`effect`的。所以小编时时刻刻都在说`effect`很重要。因为它是`基石`

## 源码对照 (包括细节描述)
> 接下来我们进行源码对照学习，但是核心的源码部分还是我手写那部分
### watch入口
> 位置：`packages\runtime-core\src\apiWatch.ts` 函数：`watch`
```ts
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  return doWatch(source as any, cb, options)
}
```

### doWatch核心
> 位置：`packages\runtime-core\src\apiWatch.ts` 函数：`doWatch`
```ts
// watch执行核心
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): WatchStopHandle {
  let getter: () => any

  // 如果watch中第一个值ref 可以直接使用
  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)

    // 如果是reactive可以直接使用 可以监听 默认就是deep监听 但是不建议
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
    // 如果是数组判断
  } else if (isArray(source)) {
    isMultiSource = true
    forceTrigger = source.some(isReactive)
    getter = () =>
      source.map(s => {
        if (isRef(s)) {
          return s.value
        } else if (isReactive(s)) {
          return traverse(s)
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
        } else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
    } else {
      // no cb -> simple effect
      getter = () => {
        if (instance && instance.isUnmounted) {
          return
        }
        if (cleanup) {
          cleanup()
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          ErrorCodes.WATCH_CALLBACK,
          [onCleanup]
        )
      }
    }
  } else {
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE

  // watch 的 scheduler  属性变化 回调该方法
  const job: SchedulerJob = () => {
    // 判断effect是否激活
    if (!effect.active) {
      return
    }
    // 回调函数
    if (cb) {
      // watch(source, cb)  获取新值
      const newValue = effect.run()
      // 调用callback 方法
      callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
        newValue,
        oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
      ])
      oldValue = newValue
    } else {
      effect.run()
    }
  }

  let scheduler: EffectScheduler = () => queuePreFlushCb(job)

  // 执行ReactiveEffect类  getter就是执行函数
  const effect = new ReactiveEffect(getter, scheduler)

  // initial run
  if (cb) {
    // 表示是否立即执行
    if (immediate) {

      // 如果立即执行  调用函数job
      job()
    } else {
      // 获取变更前的值
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}
```
- 上述就是源码中`doWatch`核心，这就是源码删减核心版的。这里会针对上述代码前几个判断做特别细节说明
### 细节描述
#### ref
```ts
  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)
  }
```
> 源码中有这样的判断。监听的值可以直接是ref变量。给大家举例下：
```ts
import {watch, ref} from 'vue'
const status = ref<boolean>(false)

// 可以将ref变量直接放到这个位置，源码中会转换函数
watch(status, (newValue, oldValue) => {})
```
#### reactive
```ts
} else if (isReactive(source)) {
    getter = () => source
    deep = true
    // 如果是数组判断
  }
```
- 通过上述的实例可以看到，如果监听对象是`reactive`的话，是进行深度监听的。
- 但是其实并不建议这么做。如果您真的是想监听全部，这样写也是可以的。接下来给大家举个这种场景的例子：
```ts
import {reactive, watch} from 'vue'
const state = reactive({name: 'lixx', age: 20})

watch(state, (newValue, oldValue) => {})

// 更好的方案
watch(() => state.age, (newValue, oldValue) => {})
 ```
 #### Array
 ```ts
   } else if (isArray(source)) {
    isMultiSource = true
    forceTrigger = source.some(isReactive)
    getter = () =>
      source.map(s => {
        if (isRef(s)) {
          return s.value
        } else if (isReactive(s)) {
          return traverse(s)
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
        } else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  }
 ```
 - 上述的数组比较简单，就是将各种情况放置到数组中就行了
 - 下列举例说明下：
```ts
import {reactive, ref, watch} from 'vue'
const state = reactive({name: 'lixx', age: 30})
const status = ref<boolean>(false)
const props = defineProps({
	keyWord: {type: String, default: ''}
})

watch([state, status, () => props.keyWord], (newValue, oldValue) => {])
```
#### Function
```ts
else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
    }
```
- 上述代码是对函数的判断。函数就很简单了。上述的例子中也有提到就不过多赘述了。
## 结束
> - `watch`到此分享完毕。给我的感觉无论是`compued`还是`watch`都很简单。如果大家觉得看源码吃力的话，不妨先看懂我的实例。再看源码就轻松了。
> - 如果大家觉得我的分享对大家有帮助的话，可以点赞/ 收藏/ 关注一条龙服务哦
