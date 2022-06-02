## deepClone实现原理

### 代码实例
```js
const getType = (target) => Object.prototype.toString.call(target)

const OBJECT_TYPES = [
  {},
  [],
  new Map(),
  new Set(),
  new Error(),
  new Date(),
  /^$/
].map(getType)
const MAP_TYPE = getType(new Map())
const SET_TYPE = getType(new Set())
const CONSTRUCT_TYPE = [new Error(), new Date()].map(getType)
const SYMBOL_TYPE = getType(Symbol('1'))
const REGEXP_TYPE = getType(/^$/)

function deepClone(target = {}, cache = new Map()) {
  const type = getType(target)
  // 基本数据类型
  if (!OBJECT_TYPES.includes(type)) return target

  // 判断缓存
  if (cache.has(target)) return target

  // 判断constructor
  if (CONSTRUCT_TYPE.includes(type)) return new target.constructor(target)

  const res = new target.constructor()
  cache.set(target, res)

  // 判断symbol类型
  if (type === SYMBOL_TYPE) return Object(Symbol.prototype.valueOf.call(target))

  // 判断是否是正则表达式
  if (type === REGEXP_TYPE) {
    const flags = /\w*$/
    const res = new target.constructor(target.source, flags.exec(target))
    res.lastIndex = target.lastIndex
    return res
  }

  // 判断是否是Set
  if (SET_TYPE === type) {
    target.forEach((value) => {
      res.add(deepClone(value, cache))
    })
    return res
  }

  // 判断是否是Map
  if (MAP_TYPE === type) {
    target.forEach((value, key) => {
      res.set(key, deepClone(value, cache))
    })
    return res
  }

  const keys = Object.keys(target)
  const len = keys.length
  let index = 0
  while (index < len) {
    const key = keys[index]
    res[key] = deepClone(target[key], cache)
    index++
  }
  return target
}
```