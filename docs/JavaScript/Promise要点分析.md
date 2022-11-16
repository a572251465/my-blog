<div align = "center"><h1>Promise实现</h1></div>

> `Promise`方法是可以非常基础但是又非常重要的 API，今天就一步一步刨析 Promise 来完成

## 什么是 Promise

> - Promise 是异步回调的一种解决方案。在传统的异步实现方案中都是通过回调来解决的。
> - 但是过多的回调难以维护，也会形式一种所称“地狱嵌套” 的状态。
> - Promise 可以使用 then 链来解决这个问题。但是又不是尽善尽美的。过多的 then 链也会给使用者带来困扰
> - 解决下来我们一起探究下 Promise 到底如何实现吧

## 基础辅助函数

```javascript
const PromiseStatus = {
  Pending: "Pending",
  Fulfilled: "Fulfilled",
  Rejected: "Rejected",
};
```

- 上述代码分别表示 Promise 的三种状态
- Promise 中状态不可逆的，只能是从等待 => 成功/ 等待 => 失败。 一旦状态修改后不可再变化

```javascript
const isObject = value =>
  Object.prototype.toString.call(value) === "[object Object]";
const isPromise = obj =>
  (isObject(obj) || typeof obj === "function") &&
  typeof obj.then === "function";
```

- 上述代码为了判断是否是对象 或是 是否是 Promise

```javascript
/**
 * @author lihh
 * @description 深度解析promise 返回值
 * @param p 表示上次的promise 实例
 * @param preValue 上一次的值
 * @param resolve then 返回promise中的 resolve
 * @param reject then返回promise中的 reject
 */
const depthResolvePromise = (p, preValue, resolve, reject) => {
  // 如果是返回value 跟实例是同一个的话 直接报错
  if (p === preValue) {
    throw new TypeError("the same instance cannot be referenced cyclically ");
  }

  // 判断是否是对象 如果不是对象的话 直接执行resolve
  if (isObject(preValue) || typeof preValue === "function") {
    const then = preValue.then;
    // 如果then属性不是函数的话，直接执行resolve
    if (typeof then === "function") {
      // 从这几话中可以得到 .then 作为一个新的Promise的状态，成功与否取决于内部返回Promise的状态
      try {
        then.call(
          preValue,
          y => {
            depthResolvePromise(p, y, resolve, reject);
          },
          r => {
            depthResolvePromise(p, r, resolve, reject);
          }
        );
      } catch (e) {
        reject(e);
      }
    } else {
      resolve(preValue);
    }
  } else {
    resolve(preValue);
  }
};
```

- 上述的代码主要是为了进一步解析 promise，有可能 Promise 实例返回内容还是一个 Promise 实例
- 上述代码中如果是被异常捕获到，直接执行 reject 函数
- 如果`preValue`不是 promise 实例的话，统一直接 resolve 函数。都是成功的状态(无论返回值是 null/ undefined 等都作为成功的状态)
- 一直递归调用函数`depthResolvePromise` 直到解析成为一个非 promise 实例的普通值为止

## Promise 构造函数

```javascript
function Promise(execution) {
  // 成功状态的值
  this.value = "";
  // 失败的值
  this.reason = "";
  // 表示每个promise 实例的状态
  this.state = PromiseStatus.Pending;
  // 为了应对异步情况。 保存onFulfilled/ onRejected 方法
  this.fulfilledCallback = [];
  this.rejectedCallback = [];

  // 构造函数的resolve 方法
  const resolveFn = value => {
    if (value instanceof Promise) {
      return value.then(resolveFn, rejectFn);
    }
    if (this.state !== PromiseStatus.Pending) return;
    this.value = value;
    this.state = PromiseStatus.Fulfilled;

    this.fulfilledCallback.forEach(fn => fn(this.value));
  };

  // 构造函数的reject方法
  const rejectFn = reason => {
    if (this.state !== PromiseStatus.Pending) return;
    this.reason = reason;
    this.state = PromiseStatus.Rejected;

    this.rejectedCallback.forEach(fn => fn(this.reason));
  };

  try {
    execution(resolveFn, rejectFn);
  } catch (e) {
    rejectFn(e);
  }
}
```

- 上述代码是 Promise 构造函数执行的代码
- > 首先一点，Promise 构造函数是一个同步执行的过程，是 then 方法是异步的。所以不要弄混了
- 如果执行构造函数期间发生异常了，捕获到后，直接执行 reject 方法
- 可能用户使用 Promise。调用 resolve 方法的时候，传递的还是一个 promise 实例。这个时候需要特殊的判断，如下记：

  ```javascript
  if (value instanceof Promise) {
    return value.then(resolveFn, rejectFn);
  }
  ```

- 属性`fulfilledCallback` 以及`rejectedCallback` 为了应对异步情况。因为执行 then 的时候，promise 实例状态还没有修改，所以需要优先保存

## Promise.prototype.then

```javascript
/**
 * @author lihh
 * @description Promise then方法 本身是一个微任务
 * @param onFulfilled 成功状态的回调
 * @param onRejected 失败状态的回调
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== "function") onFulfilled = x => x;
  if (typeof onRejected !== "function")
    onRejected = err => {
      throw err;
    };

  // 状态resolve/ rejected 的场合
  if ([PromiseStatus.Fulfilled, PromiseStatus.Rejected].includes(this.state)) {
    // 此处代表返回的一个新的实例
    const p = new Promise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          const r =
            this.state === PromiseStatus.Fulfilled
              ? onFulfilled(this.value)
              : onRejected(this.reason);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    return p;
  }

  // 状态是pending 的场合
  const p = new Promise((resolve, reject) => {
    this.fulfilledCallback.push(value => {
      queueMicrotask(() => {
        try {
          const r = onFulfilled(value);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    this.rejectedCallback.push(reason => {
      queueMicrotask(() => {
        try {
          const r = onRejected(reason);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
  return p;
};
```

- 首先 then 函数的成功回调以及失败的回调，可以不进行传值
- 针对状态是：`fulfilled`, `rejected`, `pending`进行不同的处理
- 但是 then 方法一定会返回一个全新的 promise。因为 promise 状态不可逆的

## Promise.prototype.finally

```javascript
Promise.prototype.finally = function (fn) {
  try {
    fn();
    return this.then(null, null);
  } catch (e) {
    const callback = () => {
      throw e;
    };
    return this.then(callback, callback);
  }
};
```

- finally 实现原理就是不同的场合 调用 then 方法
- 如果 finally 函数调用过程中有异常抛出，后续的会进行异常处理。其余的场合无论 finally 会返回什么样的结构，都不会改变其 promise 状态

## Promise.prototype.catch

```javascript
Promise.prototype.catch = function (fn) {
  // catch 执行的逻辑就是then 只执行error的分支
  return this.then(null, fn);
};
```

> catch 方法其实就是 `then`函数的另一种实现

## Promise.abort

> 自己添加的方法，在原生的 Promise 中并没有，可以中断 promise 的执行

```javascript
/**
 * @author lihh
 * @description promise中断方法
 * @param userPromise 用户自己promise
 */
Promise.abort = function (userPromise) {
  let abort;
  const innerPromise = new Promise((_, reject) => {
    abort = reject;
  });

  const racePromise = Promise.race([userPromise, innerPromise]);
  racePromise.abort = abort;
  return racePromise;
};
```

> 其实就是利用了函数`race`的原理，返回第一个成功/ 失败的状态

## Promise.resolve

```javascript
/**
 * @author lihh
 * @description 直接返回一个具有成功状态的promise
 * @param params 传递参数
 * @returns {Promise}
 */
Promise.resolve = function (params) {
  return new Promise(resolve => {
    resolve(params);
  });
};
```

> 默认就是一个成功的状态 promise

## Promise.reject

```javascript
/**
 * @author lihh
 * @description 直接返回一个具有失败状态的 promise
 * @param params 传递参数
 * @returns {Promise}
 */
Promise.reject = function (params) {
  return new Promise((_, reject) => {
    reject(params);
  });
};
```

> 默认就是一个失败的 promise

## Promise.race

```javascript
/***
 * @author lihh
 * @description 返回一个promise的状态，无论是成功还是失败
 * @param allPromise 表示所有的promise
 */
Promise.race = function (allPromise = []) {
  return new Promise((resolve, reject) => {
    let i = 0;
    for (; i < allPromise.length; i += 1) {
      const item = allPromise[i];

      if (!isPromise(item)) {
        return resolve(item);
      } else {
        item.then(resolve, reject);
        return;
      }
    }
  });
};
```

> - 返回第一个成功或是失败的结果
> - [mdn 解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

## Promise.any

```javascript
/**
 * @author lihh
 * @description 出现第一个成功状态 或是 如果所有的 promise 状态都失败了，则返回失败的状态
 * @param allPromise 表示所有的promise
 */
Promise.any = function (allPromise) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const rejectedCallback = () => {
      count += 1;
      if (count >= allPromise.length) {
        reject("[AggregateError: All promises were rejected]");
      }
    };

    let i = 0;
    for (; i < allPromise.length; i += 1) {
      const item = allPromise[i];
      if (!isPromise(item)) {
        return resolve(item);
      } else {
        item.then(
          res => {
            return resolve(res);
          },
          () => {
            rejectedCallback();
          }
        );
      }
    }
  });
};
```

> - 如果一旦有任意一个 promise 的状态是成功状态，该结果就会被返回
> - 如果所有的 promise 状态都失败了，则返回失败的状态
> - [mdn 解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

## Promise.allSettled

```javascript
/**
 * @author lihh
 * @description 批量执行promise数组 无论是成功还是失败都会返回 最后返回一个promise  返回结构是：{status: 'fulfilled/ rejected', value}
 * @param allPromise 传递参数
 */
Promise.allSettled = function (allPromise = []) {
  return new Promise(resolve => {
    let count = 0;
    const resultArr = [];

    const callback = (index, value, status) => {
      resultArr[index] = { status, value };
      count += 1;

      if (count >= allPromise.length) {
        resolve(resultArr);
      }
    };

    allPromise.forEach((item, index) => {
      if (!isPromise(item)) {
        callback(index, item, "fulfilled");
      } else {
        item.then(
          res => {
            callback(index, res, "fulfilled");
          },
          err => {
            callback(index, err, "rejected");
          }
        );
      }
    });
  });
};
```

> - 执行所有的 promise 无论是成功状态还是失败的状态 都会以指定的格式返回
> - [mdn 解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

## Promise.all

```javascript
/**
 * @author lihh
 * @description 多个promise 同时发出请求，如果全部成功结果 以数组的形式全部返回
 * @param promiseAll promise 数组
 * @returns {Promise} 返回的promise
 */
Promise.all = function (promiseAll = []) {
  return new Promise((resolve, reject) => {
    const resultArr = [];
    let count = 0;
    const callback = (index, res) => {
      count += 1;
      resultArr[index] = res;
      if (count >= promiseAll.length) {
        resolve(resultArr);
      }
    };

    for (let i = 0; i < promiseAll.length; i += 1) {
      const p = promiseAll[i];
      if (!isPromise(p)) {
        callback(i, p);
      } else {
        p.then(res => {
          callback(i, res);
        }, reject);
      }
    }
  });
};
```

> - 如果所有的 promise 都是成功状态，会以数组的形式进行返回
> - 一旦有一个状态是 rejected 状态。立马执行失败的操作
> - [mdn 解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

## 原文代码

> [原代码](https://github.com/a572251465/program-all/tree/main/Promise%E5%AE%9E%E7%8E%B0)
