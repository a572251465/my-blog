## iterator 实现

### 实现方案
```js
Object.prototype[Symbol.iterator] = function () {
  // 被执行的对象
  const _this = this
  // 对象的长度
  const len = Object.keys(_this).length
  // 对象的key
  const keys = Object.keys(_this)
  let i = 0

  return {
    next() {
      return {
        value: _this[keys[i]],
        done: i++ >= len
      }
    }
  }
}

const user = {
  name: 'lihh',
  age: 20,
  address: 'XXX'
}

const it = user[Symbol.iterator]()
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
```