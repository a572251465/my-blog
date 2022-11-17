<h1 align = "center">Nacos配置集群</h1>

## 1. 更改 Nacos 启动命令配置原理

我们现在知道，想要启动 Naocs 只需要启动 startup.sh 命令即可，但是如果启动 3 个 Nacos 那？所以如果我们需要启动多个 Nacos，其实 Nacos 本身默认启动就是集群模式。

注意点：如果是 linux 虚拟机，需要分配至少 4g 以上内存

## 2. 具体配置

### Linux 服务器上 MySql 数据库配置

1. 在 Linux 系统上执行 SQL 脚本，具体位置在 nacos 目录下的 conf 中，这里的操作和之前是一样的，我们可以直接打开这个文件然后拷贝到数据库中执行，当然也是要创建数据库使用数据库然后在复制脚本内容，执行即可

   ```java
   create database nacos_config;
   use nacos_config;
   ```

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/b0398625df854a4fa2bc3677572debfe.png)

2. 修改 application.properties 配置文件，但是修改之前我们最好做一个备份。

```java
cp application.properties application.properties.init
```

3. 这里的修改和我们之间的在 win 上的修改是完全一样的，所以我们只要打开这个文件，加上对应的内容即可

```java
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&serverTimezone=UTC
db.user=root
db.password=123456
```

4. 还要注意一点，这个文件中的两个服务的端口号也要对应修改（多个客户端的配置文件中端口都需要修改的）

```java
#*************** Spring Boot Related Configurations ***************#
### Default web context path:
server.servlet.contextPath=/nacos
### Default web server port:
server.port=8888/8868
```

### Linux 服务器上 Nacos 的集群配置 cluter.conf

1. 这里开始正式配置集群，首先我们要更改 cluter.conf 这个配置文件，当然我们也需要备份，但是这里它的原始名称为：cluster.conf.example，我们需要把它保留同时复制出一个 cluster.conf 来进行更改

```java
cp cluster.conf.example cluster.conf
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d823c53ec3c742c8bfd231e49ee72220.png)

2. 具体配置内容，这里我们在配置集群的时候不能直接写 127.0.0.1 这样，这样分不清楚，所以我们需要知道具体的 IP 地址，我们可以通过：

```java
ip a #查看具体ip
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e1d40196face421e95185394706e4761.png)

具体需修改内容，这里注意，我们在修改端口的时候一定要有一定的偏移量，因为 Nacos2.0 本身新增了占用端口，所以我们在设置端口号的时候注意要避开，不要占用端口，以下是官网截图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9613f91ee3fe405a826dfa583671c042.png)

```java
# 格式： ip地址:端口号
192.168.189.129:8848
192.168.189.129:8868
192.168.189.129:8888
```

### 启动三个阶段的 Nacos 测试

当上方配置完成之后，我们此时就可以启动三个节点的 Nacos 进行测试，启动方式和 Win 上区别不大：

1. 但是要注意一点，因为我们要开放端口测试，所以我们在启动 nacos 之前，要进行关闭防火墙操作：

```java
// 关闭防火墙服务-但是开启还会自动启动
systemctl stop firewalld
// 彻底关闭-开机不会启动防火墙
systemctl disable firewalld
```

2. 启动三个 nacos 节点，分别进入到三个 Nacos 节点的 bin 目录中进行启动：

![在这里插入图片描述](https://img-blog.csdnimg.cn/db6f496992064feda2988ae27faff2c8.png)

```java
sh startup.sh //启动命令
```

3. 启动完成以后，我们可以分别看一下启动日志，防止启动出现问题，启动路径：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0759ab9fbf84439cbeb981c88c787476.png)

4. 这里我们可以通过 cat 命令或者 tail -f 命令

```java
cat /home/msb/opt/nacos3/logs/start.out
tail -f /home/msb/opt/nacos3/logs/start.out
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a639adde9f344ff5abcf6abf9cf17d14.png)

5. 通过浏览器分别访问三个阶段的 Nacos，测试是否成功启动

在看到所有服务都启动成功之后，我们通过浏览器访问对应地址，就可以进入到对应节点的 Nacos 控制台上，然后我们可以查看集群管理，节点列表

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e4e2421e61f40558a05376ea9738c92.png)

### Nginx 配置

1. 我们需要找到 Nginx 的配置文件，然后做备份

```java
cd /usr/local/nginx
cp nginx.conf nginx.conf.bk
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5986d9bb247411c9e40f4f4696410d9.png)

2. 修改 nginx.conf

```java
worker_processes  1;

events {
    worker_connections  1024;
}

stream {
      upstream nacos {
        server 192.168.189.129:8848;
        server 192.168.189.129:8868;
        server 192.168.189.129:8888;
      }


     server {
        listen  81;
        proxy_pass nacos;
     }
}
```

## 测试启动

1. 首先进入到 Nginx 目录下，启动 Nginx，同时要带着我们设置过得配置文件启动

```java
cd /usr/local/nginx/sbin
./nginx
```

2. 通过访问 Nginx 来测试是否能够访问到 Nacos，在 win 系统浏览器网址上输入：

```java
http://192.168.189.129:81/nacos/
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4903f34fba3c444291aee57563577da1.png)

3. 使用账号密码 nacos，nacos 成功登录就表示此时已经完成全部配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/ffb2714c2e1b40269d289ed8462fe5f3.png)

### 添加配置

1. 在 Nacos 平台上添加配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/7ecee8708ccb4b7a9d5ed671556aef5b.png)

2. 在数据库中检查是否有这一条配置，如果有表示成功添加

![在这里插入图片描述](https://img-blog.csdnimg.cn/e74ff876aaf642709031ceb0faf9a7e5.png)

### 配置微服务为 Linux 版 Nacos 集群并注册进 Nacos

1. 我们以 9002 为例，此时我们要修改 application.yaml 文件，把之前的 Nacos 端口换成 Nacos 集群

```java
server:
  port: 9002
spring:
  application:
    name: nacos-provider
  cloud:
    nacos:
      discovery:
        # server-addr: localhost:8848
        # 换成nginx的81端口，做集群
        server-addr: http://192.168.189.129:81


management:
  endpoint:
    web:
      exponsure:
        include: '*'

```

2. 配置完成启动服务，我们就可以在 Naocs 平台上看见对应的微服务了，此时表示服务注册成功

![在这里插入图片描述](https://img-blog.csdnimg.cn/899df4174a724b43bdb6607e0feefb85.png)

## 3. 总结

![在这里插入图片描述](https://img-blog.csdnimg.cn/cadbf1815e574b30bdafd346ac431b23.png)
