## setState 的同步异步更新
> React Fiber中 react更新分为并发模式 以及同步模式
> - 并发模式：更新都会被合并，是异步更新
> - 同步模式：合成函数内的更新会被合并，而且是异步更新。原生函数内的是同步更新

> [手写setState原理demo](https://gitee.com/li_haohao_1/react-world/tree/master/set-state-timeout)

- 上述实例中会出现两个Fiber。 rootFiber 以及counterFiber,
- 每个fiber中会出现一个数组`updateQueue`. 将要更新的`update`存放到其中，怎么理解呢？？？
```js
class Counter {
  addCounter() {
    this.setState({number: this.state.number + 1})
    this.setState({number: this.state.number + 1})
  }
}

/**
 * 1. 上述的实例Counter 本身就是一个fiber
 * 2. 在调用this.setState的时候，会创建一个update。 同时会将此update存放到fiber.updateQueue中
 * 3. 其实这个就是所谓的更新合并
 */
```
- 每次更新的时候 都会从rootFiber开始更新。因为Fiber是链表的形式存在。可以一直通过child属性来寻找子Fiber
- 每个Fiber都会有个赛道的概念，如果两次更新是更新的同一个赛道的话，就只会更新一次
```js
// 创建一个任务 从root节点开始更新
function ensureRootIsScheduled(root) {
  // 按理说应该等于最高级别赛道的优先级 12
  let newCallbackPriority = SyncLanePriority
  // 当前根节点上正在执行的更新任务的优先级
  const existingCallbackPriority = root.callbackPriority;
  //如果这个新的更新和当前根节点的已经调度的更新相等，那就直接返回，复用上次的更新，不再创建新的更新任务
  if (existingCallbackPriority === newCallbackPriority) return

  scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
  // 微任务等待执行
  queueMicrotask(flushSyncCallbackQueue)
  root.callbackPriority=newCallbackPriority;
}

function commitRoot(root) {
  // 修改为非并发的
  root.callbackPriority=NoLanePriority;
}

/**
 * 上述方法实例中就算第一个是不同同一个赛道。但是执行后执行了代码root.callbackPriority=newCallbackPriority; 也会变更成同一赛道
 * 在执行commitRoot 方法后 会还原赛道
 */
```
- 如果是同步模式的话 还没等微任务执行，同步就执行完了
```js
  // 如果当前的执行上下文环境是NoContext(非批量)并且mode不是并发的话
  if (executionContext === NoContext && (fiber.mode & ConcurrentMode) === NoMode) {
    flushSyncCallbackQueue()
  }
```
- 可以通过函数 来强制设置为批量的
```js
export function batchedUpdates(fn) {
  let prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  fn()
  executionContext=prevExecutionContext;
}
```
