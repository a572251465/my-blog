## 扁平数组 转换 Tree

```js
let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 }
]
```

> 代码转换原理

```js
const transform = (arr = []) => {
  const map = {}
  arr.forEach((item) => {
    const { pid } = item
    ;(map[pid] || (map[pid] = [])).push(item)
  })

  for (const item of arr) {
    let { id } = item
    id = `${id}`
    if (map[id]) {
      item.children = map[id]
    }
  }
  return arr[0]
}
```

- 先收集父类，通过父类知道各自下有哪些子类
- 通过循环遍历数组，每个元素做为父类找寻自己的子类。并且添加到`children`中
