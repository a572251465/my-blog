## memoized 函数实现

```javascript
const memoized = (fn) => {
  const cache = {}
  return (args) => cache[args] || (cache[args] = fn(args))
}
```

- 实例

```javascript
const factorial = memoized((n) => {
  if (n === 0) return 1

  return n * factorial(n - 1)
})

console.log(factorial(2))
console.log(factorial(3))
```
