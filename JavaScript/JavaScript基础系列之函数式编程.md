## 函数式编程

### 基础概念

> - 函数的原则：第一条原则是要小，第二条原则是要更小
> - 函数式编程：是一种规范，我们能够以此创建仅依赖输入就可以完成自身逻辑的函数(`保证了当函数被多次调用时仍然返回相同的结果，函数不会改变任何外部环境的变量`)
> - 引用透明性(纯函数)：所有的函数对于相同的输入都将返回相同的值

### 命令式以及声明式

#### 命令式实例

```javascript
var array = [1, 2, 3]
for (let i = 0; i < array.length; i += 1) {
  console.log(array[i])
}
```

- 通过上述的代码可以看到，执行代码的每一步都需要我们作为命令发送给程序，由程序执行
- 程序根据我们的命令，执行出最后的结果
- `命令式`编程方式核心就是告诉程序如何做。大白话`就是我发命令 你来做`

#### 声明式实例

```javascript
var array = [1, 2, 3]
array.forEach((item) => {
  console.log(item)
})
```
