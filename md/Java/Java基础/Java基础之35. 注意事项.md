## Java 注意事项

- 文件中类的名称必须跟文件名称保持一致
- 文件中可以存在多个类，但是只能有一个类被 public 修饰。源码文件的名称必须跟被 public 修饰的类名称保持一致
- classpath 的作用：
  - 只要配置到 class path 中的路径，在执行 Java 的字节码文件的时候，就会去找个配置的路径下找对应的字节码文件
- 如何生成详细的类注释文档

  - `javadoc -d myDoc -author -version HelloWorld.java`

  - javadoc Java 注释文档生成工具
  - `-d` 参数
  - `-author -version` 待解析的字段
  - `HelloWorld.java` 待解析的 Java 文件
- `javac` 此命令可以对Java文件进行编译
- `java` 此命令可以对Java文件进行执行
