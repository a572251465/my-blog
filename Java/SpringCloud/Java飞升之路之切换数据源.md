<h1 align = "center">切换数据源</h1>

> - 为了保证数据的一致性，将 nacos 中数据托管到第三方数据库(mysql)是非常有必要的，接下来我们看下如何切换数据源
> - [代码示例的源码地址](https://github.com/a572251465/Java-study-next/tree/main/AlibabaCloudChangeData01)

​ Nacos 默认自带嵌入式数据库 derby，所以我们每次创建一个 Nacos 实例就会有一个 derby，当有多个 Nacos 节点的时候，就会出现一致性问题，所以 Nacos 支持了外部数据库统一数据管理 MySql。

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf9f4c96041343949f3c9295d80cf55e.png)

## 1. Nacos 默认 derby 切换 MySql

具体配置方式可以参考官网：https://nacos.io/zh-cn/docs/deployment.html

1. 我们需要找到 Nacos 安装目录下的 conf 目录中的 Sql 脚本，然后在数据库中进行执行

   注意：需要我们先创建好数据库并且使用：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/2bc154562d9440b7ab20e2180b9dd5d7.png)

   ```java
   CREATE DATABASE nacos_config;
   USE nacos_config;
   ```

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/6b4ee6cbf42549d482dccdcd3402263b.png)

2. 修改 conf/application.properties 文件，增加支持 mysql 数据源配置（目前只支持 mysql），添加 mysql 数据源的 url、用户名和密码。

```java
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=UTC
db.user=root
db.password=root
```

​ 这里表示更改 Nacos 数据库为本机 MySql 数据库

**注意：**这里需要注意几个点，一个是 url 地址需要改，另外数据库的用户和密码也需要更改，同时还有一个是官网上在**db.url.0=jdbc:mysql**这个属性上少了一个属性为**serverTimezone=UTC**需要我们手动添加

## 2. 测试

重启 Nacos 服务，此时之前所创建的 Namespace+Group+DataID 将全部消失，因为这些数据是保存在之前 Nacos 内嵌的 derby 数据库中，现在使用的是本地的 MySql 数据库，此时我们可以添加配置测试，在查看数据库 nacos_config 中的 config_info 表，此时就会有新添加的配置内容
