<div align = "center"><h1>集合</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/c89e050560c4463585271e4d6d385364.png)

## 什么是 ArrayList

- ArrayList 本质

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/0457c8a44a164791997777918ecbb62d.png)

- new 的过程

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/d4068db9d12b49c39c9dbe53140ad84d.png)

- add 的逻辑
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/69c76dedcca2486386175545c2f67547.png)
- 扩容 核心原理
  - 如果是空数组的话，直接选择默认大小`10`
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/59f0e7b18b8e492890abea8be3e47c5a.png)
  - 只要当需要的长度 > 数组的长度 才允许扩容
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/20b3fa276dd947a38bb45b2893991fe3.png)
  - 扩容核心：原数组长度 扩大到 3/ 2 倍
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/972d8268dd7f4b0c99375b391da61a38.png)

## ArrayList 跟 Vector 不同点：

- 本质上 底层都是操作数组
- 初期化的时候不同：

  - `ArrayList` 是在第一次 add 执行的时候，才确定数组的长度。
  - 但是`Vector` 是在初期化的时候 已经确定了数组的长度(浪费空间)
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/021a3d77c589405bb1a13c70be05c3b7.png)

- 扩容方式不同：

  - `ArrayList` 的扩容大小是原来的 1.5 倍
  - 但是`Vector` 扩容大小受到构造函数的第二个参数影响，如果第二个参数是默认值，那么直接就是扩容 2 倍
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/5cfa8f1c50734bda8a9d7c5b8d94740d.png)

- 线程是否安全不同：
  - `Vector` 是线程安全的。所以效率低
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/3a3789b0d405471d965447d260fc77b1.png)
  - `ArrayList` 是线程不安全的， 所以效率相对高点

## LinkedList

- 什么是 LinkedList

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/a9c3016c140944dc84077983af75b7e3.png)

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/aa60a1755b6b462897b416f7d70d9eb6.png)
  - `LinkedList` 本质就是一个双向链表，具有两个指针，一个指向头，一个指向尾

<br />

- 什么是 offer

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/44389f91e15945bfa30474b219631c72.png)
  - 添加节点的本质 就是维护`next` 以及`prev` 两个指针

<br />

- 什么是 poll
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/179eb4a2f68c4471ab100e5ae1fd23f3.png)

## Iterable 以及 iterator，Iterator 区别：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e934717ae9bb40fc8e5c32f6c0759419.png#pic_center)

- `Iterable` 是最终实现的接口
- `iterator` 表示迭代器函数
- `Iterator` 表示迭代器返回值

> 下面解析`iterator` 原理

![在这里插入图片描述](https://img-blog.csdnimg.cn/00eff06bcc214d58a85a332cf9e23fd1.png)

## hashSet

![在这里插入图片描述](https://img-blog.csdnimg.cn/2c83ae051fd64ce891051a807657664c.png#pic_center)
