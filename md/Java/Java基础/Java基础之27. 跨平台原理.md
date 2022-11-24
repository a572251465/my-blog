<div align = "center"><h1>Java跨平台</h1></div>

## Java 的跨平台原理

> 同时也是会拿 c 语言的编译以及运行的过程做下比较

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f5845fcb4eb4f3c9baaa2e1f0b32ae9.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/842e222e89a44234ab8ffdc8610f6a46.png#pic_center)

- 上述就是 Java 以及 C 语言中 编译以及跨平台的实现
- 但是从严格意义来说的话，C 语言不算跨平台。怎么理解呢？？
  - Java 的字节码文件跟平台无关的。可以拿着编译后的字节码到各个平台运行的
  - 但是 c 语言中是不同平台有着不同的编译器。编译后的文件只能到对应的平台去执行
