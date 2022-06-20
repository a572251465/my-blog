## 手写Promise

```js
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
function resolvePromise(promise, x, resolve) {
  if (x && typeof x.then === 'function') {
    queueMicrotask(() => {
      x.then(y => resolvePromise(promise, y, resolve));
    });
  } else {
    resolve(x)
  }
}
class Promise {
  static counter = 1;
  constructor(executor) {
    this.id = Promise.counter++;
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof Promise) {
        return queueMicrotask(() => {
          value.then(resolve)
        });
      }
      if (this.status == PENDING) {
        this.value = value;
        this.status = FULFILLED
        this.onResolvedCallbacks.forEach(cb => cb(this.value))
      }
    }
    executor(resolve);
  }
  then(onFulfilled) {
    let newPromise = new Promise((resolve) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          let x = onFulfilled(this.value);
          resolvePromise(newPromise, x, resolve)
        })
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          queueMicrotask(() => {
            let x = onFulfilled(this.value);
            resolvePromise(newPromise, x, resolve)
          })
        });
      }
    });
    return newPromise;
  }
  static resolve(value) {
    return new Promise((resolve) => {
      resolve(value)
    })
  }
}
module.exports = Promise;
```
