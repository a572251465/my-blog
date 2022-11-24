<div align = "center"><h1>数组</h1></div>

> 最新在学习 Java 数组。同时分析下数组在内存中堆栈 占用情况

![在这里插入图片描述](https://img-blog.csdnimg.cn/778dbea3a91e452a91a9ccadc094a88c.png#pic_center)

- 上述就是以`int[] arr = new int[]{1,2,3};`为了对内存占用情况进行分析
- 数组在声明 或是 初期化的时候已经将内存大小申请好了，而且是不可扩展的
- 数组声明的时候都会存在默认值 但是默认值取决于声明的类型

  | 数组类型     | 初期值 |
  | ------------ | ------ |
  | byte         | 0      |
  | short        | 0      |
  | int          | 0      |
  | long         | 0      |
  | float        | 0.0    |
  | double       | 0.0    |
  | char         | \u000  |
  | boolean      | false  |
  | 引用数据类型 | null   |
