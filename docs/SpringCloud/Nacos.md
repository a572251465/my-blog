<h1 align = "center">Nacos</h1>

## 1. Nacos 介绍

​ Nacos（Naming Configuration Service） 是一个易于使用的动态服务发现、配置和服务管理平台，用于构建云原生应用程序

​ **服务发现是微服务架构中的关键组件之一**。Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

​ Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

## 2. 什么是 Nacos

1. Nacos = **注册中心+配置中心组合**

2. Nacos 支持几乎所有主流类型的“服务”的发现、配置和管理，常见的服务如下：

   Kubernetes Service

   gRPC & Dubbo RPC Service

   Spring Cloud RESTful Service

## 3. 为何使用 Nacos？

​ 为何使用注册中心呢？我们以入住酒店的前台为例子，稍微加以解释。先设想一个没有服务前台的酒店，客人入住需要自己寻找合适居住的房间，客人不知道每个房间的情况，无法确定那个房间是打扫干净可以入住，客人只能逐个房间寻找，如果遇到已经居住房客的房间一定很尴尬，显然这是不正常的情况。正常的情况是酒店会安排服务台，酒店打扫干净可以入住的房间会登记注册到服务台，这样客人来住店，只需要在前台就可以查找到可以入住的房间，这样就无需等待快速的入住。显然，服务器提供发注册和发现机制可以让房客快速找到合适的房间，快速解决入住问题。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2eb9b38b79934ae5b8724d5c956418a3.png)

​ 采用微服务以后，软件微服务组件各自独立，但最终还要组合为一个整体作为一个软件系统服务于最终客户，这时软件组件之间也需要彼此通讯，彼此调用方法。微服务架构内部发起通讯调用方法的一方成为“**服务消费者**”，提供远程方法调用的服务器称为“**服务提供者**”，往往为了提高系统性能，会提供多个服务器作为**服务提供者**，此时**服务消费者**找到**服务提供者**的过程，就类似于用户在找房间的过程。为了帮助**服务消费者**快速的发现**服务提供者**，在微服务框架中都会引入**注册中心。注册中心**类似于酒店的前台，提供在软件服务的注册和发现功能，**服务提供者**会先在注册中心进行**注册**，声明可以对外提供服务，而**服务消费者**只需要在注册中心就可以快速**发现**找到可以使用的服务，快速使用服务。注册中心实现了服务提供和服务消费的快速撮合功能。

![在这里插入图片描述](https://img-blog.csdnimg.cn/66360510cfae4ca58889bcd9a9178680.png)

## 4. Nacos 下载和安装

官网网址：https://nacos.io/zh-cn/index.html

![在这里插入图片描述](https://img-blog.csdnimg.cn/518cfc78212c4027b214ed1e780847a2.png)

官网文档网址：https://nacos.io/zh-cn/docs/quick-start.html

注意：使用官网推荐的稳定版本：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0bb33112e2db4b2db17891e31a9c5696.png)

下载地址：https://github.com/alibaba/nacos/releases

![在这里插入图片描述](https://img-blog.csdnimg.cn/d0367b78797c4a55b6c6f4201e14c16c.png)

## 5. 安装目录

1. 解压以后找到 bin 目录

![在这里插入图片描述](https://img-blog.csdnimg.cn/1288d92dc3d542839ae1d15e6b88c183.png)

2. 执行指令：

   ### Linux/Unix/Mac

   启动命令(standalone 代表着单机模式运行，非集群模式):

   ```
   sh startup.sh -m standalone
   ```

   ### Windows

   启动命令(standalone 代表着单机模式运行，非集群模式):

   ```
   startup.cmd -m standalone
   ```

3. 结果：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/b1d9946b8ff04d6098ab4a23d9ef479e.png)

4. 得到结果以后为了验证是否成功开启 Nacos，我们需要访问：`http://localhost:8848/nacos`

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/518cfc78212c4027b214ed1e780847a2.png)

5. 出现此界面表示已经成功启动 Nacos，默认的账号密码是：nacos/nacos

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/f5173ff1235a4ef68528fec3b642997b.png)

6. 到这里就是成功开启了 Nacos 服务了。
