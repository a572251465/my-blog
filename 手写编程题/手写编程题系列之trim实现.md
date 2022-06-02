## trim实现
> - 通过`parseInt`来进行转换，转换成为数字，遇到非数字的直接返回。如果一开始就是非数字则直接返回NaN
> - 通过api`replace` + 正则 匹配剔除空格. 缺点：数字之间的空格也会有剔除掉
> - 使用正则`/^\s*|\s*$/g` 来剔除以空格开头/ 空格结尾
> - 使用`while`循环来查找索引
> - 使用`search`来查找位置，同时剔除空格

> [最全的trim空格方案](https://www.cnblogs.com/rubylouvre/archive/2009/09/18/1568794.html)

### 实现案例
```js
const str = '  111  '
const str1 = '  3   3  3  '
const str2 = '444  '

// 1. 通过parseInt()转换为数字
console.log(parseInt(str2))
// 2. 通过replace 来剔除空格
console.log(str.replace(/\s*/g, ''))
// 3. 通过正则表达式来剔除前后空格
console.log(str1.replace(/^\s*|\s*$/g, ''))
// 4. 通过寻找空格的位置 来截取字符串
const trimSpace = (str = '') => {
  let endIndex = str.length - 1
  let startIndex = 0
  const arr = Array.from(str)

  while (arr[startIndex] === ' ') ++startIndex
  while (arr[endIndex] === ' ') --endIndex

  return str.substring(startIndex, endIndex + 1)
}
console.log(trimSpace(str1))

// 5. 通过search进行查找位置
String.prototype.trim1 = function () {
  return this.substring(
    // \S 匹配非空格
    Math.max(this.search(/\S/), 0),
    this.search(/\S\s*$/) + 1
  )
}
console.log(str1.trim1())
```