---
title: 栈知识梳理
date: 2022-07-26
tags:
  - 算法
categories:
  - 算法
sidebar: 'auto'
---

<div align = "center"><h1>栈</h1></div>

![栈](https://img-blog.csdnimg.cn/c70cd9b4e3b64e27812311d8d3765249.png#pic_center)

- 栈：

  - 是一种受限的线性数据结构。
  - 只能是`先进后出`以及`后进先出`

- 需要实现的方法：

  > - `push(value: T): boolean` 从栈顶添加一个元素
  > - `pop(): boolean | T` 从栈顶删除一个元素，并返回
  > - `peek(): boolean | T` 从栈顶返回一个元素，但是不修改栈
  > - `toString(splitSign: string): string` 以字符串的形式返回栈中的内容

- [实现案例](https://github.com/a572251465/w-hooks/blob/main/packages/src/useStack/index.ts)
