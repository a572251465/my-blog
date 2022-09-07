---
title: 双向链表知识梳理
date: 2022-07-25
tags:
  - 算法
categories:
  - 算法
sidebar: 'auto'
---

<div align = "center"><h1>双向链表</h1></div>

![双向链表](https://img-blog.csdnimg.cn/6146e3e0ad994e6d9fd5cac6c71010f4.png#pic_center)

- 双向链表

  - 是 单项链表的一种延申。同样也是一种线性结构。只不过双向链表记录了前后节点

- 每个双向链表的节点结构分为三部分：prev 指针 数据部分 next 指针

  > - 每个节点的 prev 指针指向上一个节点，next 指针指向下一个指针
  > - 有一个指针 head 永远指向头节点，指针 tail 永远指向尾节点
  > - 同样双向链表的删除/ 添加的时间复杂度是 O(1) 查询时间复杂度是 O(n)

- 需要实现方法：

  > - `append(value): boolean` 给链表维护添加一个元素
  > - `insert(position: number, value): boolean` 给链表指定的位置插入元素
  > - `get(position: number): T` 获取指定位置的元素
  > - `indexOf(value: T): number` 获取某个元素的位置
  > - `update(position: number, value: T): boolean` 更新某个位置元素的内容
  > - `removeAt(position: number): T` 删除指定位置的元素
  > - `remove(value: T): boolean` 删除某个元素
  > - `isEmpty(): boolean` 判断元素是否为空
  > - `size(): number` 获取链表中元素的大小
  > - `backwardString(splitSign: string): string` 以字符串的形式打印元素的值(从前往后打印)
  > - `forwardString(splitSign: string): string` 以字符串的形式打印元素的值(从后往前打印)

- [实现案例](https://github.com/a572251465/w-hooks/blob/main/packages/src/useDoublyLinkedList/index.ts)
