## 手写 数组API `every` 实现

```javascript
function every(arr, callback, _this) {
  if (!Array.isArray(arr) || typeof callback !== "function") return false

  // 这个变量记录每次的判断结果
  let prevResult = true
  _this = _this || this

  for (let i = 0; i < arr.length; i++)
    prevResult = prevResult && callback.call(_this, arr[i])

  return prevResult;
}
```

- 上述代码中 一旦变量`prevResult` 出现了false，之后都是false
- 优化的话，如果一旦发现变量是false了，直接返回结果
