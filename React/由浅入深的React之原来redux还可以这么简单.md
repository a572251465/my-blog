## 前言
> - 今天主要是分享下关于`redux`的所学以及所得。一般提起`redux`很多人想到react。甚至有人认为redux以及react关系跟vuex以及vue的关系一样。但是其实`redux`中不牵扯任何框架部分，可以说任何框架都可以使用`redux`来进行数据管理
> - 今天就用普通html5结合手写redux来给大家分析下。最后再分析下源码(~~ 轻轻的说下哦，`redux`源码其实很简单的)

## 实战
### 业务需求
- 我们会有一个html5页面，包含一个数字计数，一个增加按钮以及减少按钮
- 使用`redux`进行数据管理
> html代码
```html
  <body>
    <h1>展示数字</h1>
    <div id="root"></div>
    <hr />
    <button id="addBtn">加法+1</button>
    <button id="minusBtn">减法-1</button>
  </body>
```
> js代码
```js
import { createStore } from './redux'
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, count: state.count + 1 }
    case 'minus':
      return { ...state, count: state.count - 1 }
    default:
      return state
  }
}
const store = createStore(reducer, { count: 0 })

function render() {
  const state = store.getState()
  const root = document.getElementById('root')
  root.textContent = state.count
}

const addBtn = document.getElementById('addBtn')
const minusBtn = document.getElementById('minusBtn')

addBtn.addEventListener('click', () => {
  store.dispatch({ type: 'add' })
})

minusBtn.addEventListener('click', () => {
  store.dispatch({ type: 'minus' })
})

render()
store.subscribe(render)
```
### 核心API
> - 可以大致看下上述的实例，真正渲染到html中的是`render`函数，每次数据发生变化都会调用`render`
> - 问题的关键是：1. 怎么知道数据发生了变化。2. 怎么触发`render`函数
- `getState`  用来获取`redux`中的数据，存储在`redux`中的数据都会被获取到
- `subscribe` 订阅函数的方法，其实就是当数据发生变化的时候想让哪些函数重新执行。例如：上述的实例的`render`函数
- `dispatch` 触发函数，用来修改状态。参数中必须包含字段`type`
### 手写核心源码解析
```js
/**
 * @description 可以生成一个redux store
 */
function createStore(reducer, state) {
  // 表示redux 总状态
  let rootState = null
  // 订阅所有的事件
  const nextListeners = []

  const dispatch = (action) => {
    rootState = reducer(rootState || state, action)

    nextListeners.forEach((listener) => listener())
  }

  const subscribe = (listener) => {
    const index = nextListeners.push(listener)

    return () => {
      nextListeners.splice(index, 1)
    }
  }

  // 返回store
  const getState = () => {
    return rootState
  }
  // 初期执行
  dispatch({ type: '@@init' })

  const store = {
    dispatch,
    subscribe,
    getState
  }
  return store
}

export { createStore }
```
> 上述其实就是源码的简略版。但是核心已经实现，其实还有几个注意点：
> - 为什么说`redux` 是单一状态呢。其实内部就是把状态都定义在了一个变量上
> - 源码的实现其实就是利用了`发布订阅`模式。可以理解为`subscribe`函数是订阅消息，`dispatch`就是触发订阅，触发订阅的同时修改状态
> - 在执行函数`createStore`的时候，默认会触发函数`dispatch`。用来收集默认状态。
> - 我们需要传递一个`reducer`函数，这个函数是用来修改状态的，最后只需要返回修改后的状态就行了。函数内部逻辑任由我们发挥
## 源码分析
>  redux\src\createStore.ts
- 定义的变量
```ts
  // 修改状态的reducer
  let currentReducer = reducer
  // 当前的状态
  let currentState = preloadedState as S
  // 订阅监听的事件
  let currentListeners: (() => void)[] | null = []
  let nextListeners = currentListeners
```
- `getState`函数实现
```ts
  // 表示getState执行函数
  function getState(): S {
    return currentState as S
  }
```
- `subscribe`订阅函数实现
```ts
  // 进行订阅的方法
  function subscribe(listener: () => void) {
    // 必须是一个函数
    if (typeof listener !== 'function') {
      throw new Error(
        `Expected the listener to be a function. Instead, received: '${kindOf(
          listener
        )}'`
      )
    }

    ensureCanMutateNextListeners()
    // 这句话是关键
    nextListeners.push(listener)

    return function unsubscribe() {

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }
```
- `dispatch`实现原理
```ts
  // 执行dispatch 返回的是传递的action
  function dispatch(action: A) {

    try {
      isDispatching = true
      // 执行reducer函数 返回最新状态
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

		// 通知函数执行更新
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }
```
> 上述就是源码的实现逻辑 ，其实`redux`源码很简单。而且实用。
## end
> 如果觉得小编分析的对各位有用处的的话，[GitHub](https://github.com/a572251465)来个star吧。或是关注公众号`前端干货寺院`。 让我们一起成长。
