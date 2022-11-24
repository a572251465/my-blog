<div align = "center"><h1>JDK,JRE 以及JVM 关系</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/7f71372eab76432089f53c3c691d8fc5.png#pic_center)

> - 开发者可以安装 JDK. 因为 JDK 中包含编译环境/ 运行环境。
> - JDK 中 内置了 jre 原型环境。jre 中包含了 jvm 虚拟机

> - 如果只是程序的使用者的话，可以安装 JRE 运行环境。因为只需要解析.class 文件就足够了

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c73a01c6f04472fb0485634ca1267bc.png)

> - JVM 不能单独执行.class 文件。因为在执行的时候可能需要一些类库
> - 解释 class 的时候 JVM 需要调用解释所需要的 lib 类库。如上图。
> - 在 JDK 下面的 jre 目录中存在 lib/ bin 文件夹。这里 bin 可以理解为 JVM。而 lib 就是 JVM 需要的类库。所以可以理解为 jvm + lib === jre
