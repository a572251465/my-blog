<div align = "center"><h1>String 类型</h1></div>

## String 本质是什么？？？

- String 类型 在`java.lang` 导出的。在`java.lang`语言包中的变量以及方法 无需显式导入
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/bebb6cbd8bf64c1f83ba0a6560027a33.png)
- 字符串就是由多个字符拼接而成的。所以可以理解为字符串
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/e284ad4a78c6418ea92c1da58b3cdd33.png)
- 以及任何字符串 都是 String 类型的实例
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/d07cbf324ab44aa2b040fa89d8087f07.png)
- 字符串是不可变的，他们的值被创建后是无法再次修改的。就是因为字符串对象不可变的，所以在常量池中是可以共享的
- 字符串本质上就是一个字符数组，就是由多个字符组成的
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/b1805b85723c4ede89dd6a5c678512f4.png)
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/1640606314ca43f6a7e828de0515599d.png)

## 刨析`equals`方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/b450d5e10f9d478d8dda5b70f957c14e.png#pic_center)

## 刨析`comparTo`方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/46d489cfba7c4efe905c24568a7e338f.png#pic_center)

## String 类型声明的 内存分析

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b397c2ea4f148c6ac98a23c603baa62.png#pic_center)

## StringBuilder

> 字符串分为可变以及非可变的。例如:`String s = ''; `就是非可变的

### 空构造函数过程

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/f48c64deb1454475b05a90f2f0327b4d.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/d661d66b9466417baf4f589039ec5d02.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/b687359bdee2417d96f8d778c2445dcd.png)

- 通过上述实例 可以看到。其实`StringBuilder` 的本质就是`new char`的过程

### 传递 int 参数的 构造函数

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/e728e1b7de334d5a98e0c16104f84847.png)
- 跟上述图例 2 中内容保持一致

### 传递 string 参数的 构造函数

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/a53ae51e129c4c368396d5720dea41e6.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/81a4c3b7e0124c17ab0edd7621cfd1ba.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/45e27bcda24c4fe1a6ad31ab27c142df.png)
