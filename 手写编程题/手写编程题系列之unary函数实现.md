## 函数``unary` 实现

```javascript
const unary = (fn) => (fn.length === 1 ? fn : (args) => fn(args))
```

- 实例

```javascript
const arr = [1, 2, 3]

const res = arr.map(parseInt)
console.log(res) // [1, NaN, NaN]

const unary = (fn) => {
  return fn.length === 1 ? fn : (arg) => fn(arg)
}

const res1 = arr.map(unary(parseInt))
console.log(res1) // [1, 2, 3]
```
