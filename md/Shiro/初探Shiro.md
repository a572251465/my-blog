<h1 align = "center">初探Shiro</h1>

## 1. 现存的问题

- 认证（登录）：认证操作流程都差不多，但是每次都需要手动的基于业务代码去实现，很麻烦！
- 授权：如果权限控制粒度比较粗，可以自身去实现，但是如果控制粒度比较细，操作麻烦！

> 分布式会话管理：单体项目时，需要依赖 Web 容器的 Session 实现会话，搭建了集群或者是分布式项目，手动去基于 Redis 或者其他拥有公共存储能力的中间件实现分布式会话管理。

## 2. Shiro 框架介绍

- Shiro 是基于 Java 语言编写的，Shiro 最核心的功能就是认证和授权。
- Shiro 官方：http://shiro.apache.org

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/2746/1648209494089/55e32ad05f22413cbb9ac5cec10b8cd9.png)

- Shiro 框架 核心就在于认证以及授权
- 可以有特定的 API 可以对认证以及授权 进行验证
- 可以脱离于容器的 session。 独立进行 session 缓存
- Shiro 同样提供了很多关于 db/ 文件/ 内存的信息认证
