---
title: 单项链表知识梳理
date: 2022-07-25
tags:
  - 算法
categories:
  - 算法
sidebar: 'auto'
---

<div align = "center"><h1>链表</h1></div>

![链表](https://img-blog.csdnimg.cn/4b688755adc9498d9b6bbc7f578f6d6a.png#pic_center)

- 单项链表

  - 是一种`线性`数据结构。以单项链表为主。链表具有以下特征：

- 每个节点中包含两个部分：数据部分以及指针部分

  > - 每个节点的指针部分 都会指向下个节点
  > - 会有一个 head 节点，指向头节点
  > - 如果是增/ 删 链表都是 O(1) 的复杂度
  > - 如果是查询的话 链表是 O(n)的复杂度

- 需要实现的方法：

  > - `append(value): boolean` 给链表维护添加一个元素
  > - `insert(position: number, value): boolean` 给链表指定的位置插入元素
  > - `get(position: number): T` 获取指定位置的元素
  > - `indexOf(value: T): number` 获取某个元素的位置
  > - `update(position: number, value: T): boolean` 更新某个位置元素的内容
  > - `removeAt(position: number): T` 删除指定位置的元素
  > - `remove(value: T): boolean` 删除某个元素
  > - `isEmpty(): boolean` 判断元素是否为空
  > - `size(): number` 获取链表中元素的大小
  > - `toString(splitSign: string): string` 以字符串的形式打印元素的值

- [实现案例](https://github.com/a572251465/w-hooks/blob/main/packages/src/useLinkedList/index.ts)
