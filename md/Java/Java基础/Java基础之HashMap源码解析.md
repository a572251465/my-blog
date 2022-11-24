<div align = "center"><h1>HashMp 源码解析</h1></div>

> 深入的学习源码，有助于我们在平常的作业开发过程中更好的使用集合，同时也是知道什么样的集合以及数据结构，在何种场合下使用最为方便

## 常用重要属性

- `DEFAULT_INITIAL_CAPACITY` 底层数组 默认初始化长度
- `MAXIMUM_CAPACITY` 最大的设置数组的长度
- `DEFAULT_LOAD_FACTOR` 表示默认的负载 或扩容因子。判断增加/ 减少空间的依据
- `Node<K,V>[] table` 表示底层的数据，所有添加的数据 都会存在到该数组中
- `size` 添加有效数据的大小
- `loadFactor` 表示作为实例属性，作用于整个 Class 的扩容因子
- `threshold` 表示扩容的界限值

## 分析构造器

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/ab13af6a3643404aa0dc5da50a7b1a0c.png#pic_center)

- HashMap 的构造函数大致分为三类：
  - 一种是空构造函数，在初始化的时候，赋值默认的扩容因子
  - 带有初始长度的构造函数，同时将设置初始长度以及默认的扩容因子
  - 两个参数的构造函数，都可以自定义初始长度以及扩容因子，但是有临界值判断

## put 源码分析

<hr />

- 大致思路

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/c895c8f0726e45c9b2b284c5fab8eb0e.png)

- 源码解析
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/04ad48f34f614c348a5128c72b59a82e.png#pic_center)

> - 其实大体的思路跟图 1 差不多，底层也是数组 + 链表的形式来进行存储
> - 在整个 HashMap 的底层存储中 `key`尤其重要
>
> 1. 会拿到 key 通过`hash`函数来生成一个 hashCode `(key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);`
> 2. 通过 hashCode 以及一定的运算 计算出要放到数组的下标。 运算是`(n - 1) & hash`
> 3. 接下来就是更加细节的判断
>    3.1 通过计算出来的下标，如果在指定位置是 null 的话，直接将新的节点放入其中. `tab[i] = newNode(hash, key, value, null);`
>    3.2 接下来就是拿到第一个节点后，通过循环判断是否跟当前编辑的数据相同。如果相同就更新，如果不存在相同的话，就直接添加到链表的尾部

## 扩容策略

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/9d6a1d4960524c6dacbb66705a158493.png#pic_center)

- 初期执行的时候，数组长度就是默认 16，而扩容界限值 = 长度 \* 扩容因子
- 在到达扩容界限值得时候，长度 = 长度 _ 2, 扩容界限值 = 扩容界限值 _ 2

## 经典面试题

<hr/>

- 为什么扩容因子/ 负载因子 是 0.75
  - 如果扩容因子是 1 的话，空间利用率得到了很大的满足，但是容易碰撞，容易产生链表，所以查询效率相对较低
  - 如果扩容因子是 0.5 的话，不容易发生碰撞，产生链表的几率比较低，查询效率高，但是空间利用率太低了
  - 所以结合空间以及时间的考虑，在 0.5~1 之间取了一个折中办法

<hr />

- 主数组的长度 为什么一定是 2^n 结果
  - 因为在通过数组长度和 hashCode 计算数组的下标时，满足`hash & (length - 1)` => `hash % length`
  - 上述公式等效的 前提是 length 必须是 2 的整数倍
  - 防止 hash 冲突，位置冲突

## HashSet 底层原理

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac7a30afdf7e4a8aa4bbb78981d69c4c.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/93dae3a087fa4a56b64f089a6e324554.png)
