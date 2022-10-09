<h1 align = "center">接口代理模式</h1>

## 1. 什么叫接口代理模式

- 让接口 interface 文件 跟 xml 文件形式一种关联关系
- 接口的实现类是 MyBatis 内部替我们实现了
- 我们在 service 中需要调用 mapper 中的接口方法

### 1.1 优点

- 有了接口，模块之间就有规范了
- 参数的处理多样了，接口中的方法参数列表由我们自己决定
- 通过代理模式由 MyBatis 提供接口的实现类对象，我们不用写实现类

## 2. 项目的目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/cfda77e7c66f4586b88b6974ccad2979.png)

- 根据上述截图中，要求 mapper.xml 以及 mapperJava 文件 在编译后会在一个文件夹

## 3. 注意事项

- 接口文件的名称以及 Mapper 映射的文件名称必须保持一致（不包括名称）
- Mapper 映射文件的 namespace 必须是接口的全路径
- sql 语句的 id 必须是对应的方法名称
- Mapper 映射文件应该和编译之后放在同一个目录下

## 4. 原理解析

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4a6854904ce40b78b2d826b599584e1.png)
