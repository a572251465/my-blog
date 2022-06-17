## 手写useReducer 实现原理
> 手写`useReducer` 实现过程，包括是fiber转换等

## QA
1. 为什么函数中的hook 必须按一定的顺序，不能嵌套的在if/ fro中
2. 为什么hook必须在函数之内，不能定义在函数之内

## 手写实例demo
> [手写useReducer地址]()

## 手写实现解析
- 在使用`useReducer`的时候，其实初期渲染以及更新使用的不是一个函数
```js
// current => fiber.alternate
// memoizedState 挂在fiber上的hook fiber上的hook以单项链表的形式
  if (current !== null && current.memoizedState !== null) {
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV
  }
```
- 函数中的hook 以单项链表的形式挂载在fiber 上
```js
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null
  }

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook
  } else {
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}
```
- 为什么链表顺序是一定的
> 参照手写实例中的函数`updateWorkInProgressHook`
- useReducer 中的更新内容 会以环形链表的形式存储在queue中
```js
function enqueueRenderPhaseUpdate(queue, update) {
  // pending 永远指向环形链表最后节点
  const pending = queue.pending || null;

  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  queue.pending = update
}
```

## 总结
```js
function Counter() {
  const [state, setState] = React.useState(0)
  const [counter, dispatch] = React.useRducer(reducer, {number: 0})
  
  return (
    <div>
      <button>多次触发setState</button>
      <button>多次触发dispatch</button>
    </div>
  )
}
```
> 结合上述实例进行总结
- Counter本身会变成一个fiber
- 多个hook 会以单项链表的形式挂载到属性`memoizedState`上
- 如果同一个hook中的`dispatch`触发多次，会以环形链表的形式存在到hook的属性`queue`上

> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等
