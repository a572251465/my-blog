<div align = "center"><h1>TreeMap 源码解析</h1></div>

> 深入的学习源码，有助于我们在平常的作业开发过程中更好的使用集合，同时也是知道什么样的集合以及数据结构，在何种场合下使用最为方便

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f8442c00bd940b6b169431478fe14d7.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/8fec8cccbca648688732c94e2246da43.png#pic_center)

> TreeMap 的核心在于平衡二叉树 + 红黑树

## 重要属性

<hr />

- `Comparator` 表示外部比较器，因为平衡二叉树需要比较大小，所以必须具有外部/内部 比较器
- `Entry<K,V> root` 表示二叉树的 root 节点

## 构造器解析

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/2790a10793c74e7ba934011fc7bda4e1.png#pic_center)

## put 函数核心解析

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/ee0a9beed1474bf6b56cc5c84d01dd11.png#pic_center)

- 上述的原理 其实就是平衡二叉树的 实现原理。
