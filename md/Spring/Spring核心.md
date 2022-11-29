<h1 align = "center">Spring核心</h1>

> Spring 本身就是 “框架的框架”。 String 属于底层框架，而我们所说的 SpringBoot, MVC 都是基于 Spring 本身进行插拔的

## 1. 结构体系

![在这里插入图片描述](https://img-blog.csdnimg.cn/2a243eec278d45da849690fb06b61ca5.png)

> 其实我们的 Spring 本身就是 Core Container. 所以 Spring 本身牵扯到了四个核心包

> 但是基于依赖的传递性。其实我们主要导入一个包，其余的包都导入了
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/f615a7ab78c14025b8d4899c5969345c.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/c6398a3c3e3744c8b1010e2346bed457.png)

## 2. 核心优势

- 方便解耦,简化开发（IOC/ DI）
- AOP 切面编程
- 声明式事务
- 整合 JUNIT,方便测试
- 方便整合各种优秀的框架
- 丰富的功能封装
- 规范的源码学习样本
