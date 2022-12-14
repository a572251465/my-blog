<h1 align = "center">docker中软件安装注意事项</h1>

## 1. 单机 nginx

```bash
docker run --name nginx -p 80:80 -v /opt/nginx/nginx.conf:/etc/nginx/nginx.conf -v /opt/nginx/html:/usr/share/nginx/html -v /opt/nginx/conf.d:/etc/nginx/conf.d -v /var/log/nginx/logs:/var/log/nginx -e TZ=Asia/Shanghai -d nginx
```

- `--name` 指定运行镜像名称
- `-v` 指定路径。将数据挂载到主机上
- `-p` 指定端口。表示物理机以及容器的端口
- `-d` 后台模式运行
- `-e` 指定时区

> 安装过程 参照下记

[参照地址](https://blog.csdn.net/weixin_46244732/article/details/114315708)

## 2. 单机 MySQL

```bash
docker run -p 3306:3306 --privileged=true --name mysql -v /var/log/mysql:/var/log/mysql -v /opt/mysql/data:/var/lib/mysql -v /opt/mysql/conf/:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```

- `-p` 指定端口
- `-privileged` 表示内部拥有 root 权限
- `--name` 表示容器名称
- `-v` 表示参数
- `-d` 表示后台运行

## 3. 单机 Redis

- 创建备用目录 以及下载文件

```bash
mkdir -p /opt/redis/data
mkdir -p /opt/redis/conf

cd /opt/redis/conf
wget http://download.redis.io/redis-stable/redis.conf
```

- 运行 Redis 容器

```bash
docker run -d -p 6379:6379 --name mall-redis -v /opt/redis/data/:/data -v /opt/redis/conf/:/etc/redis redis redis-server /etc/redis/redis.conf
```

## 4. 单机 nacos

- 建立备用目录 以及放置文件
  > 需要从官网中下载源码，将其中 conf 文件进行放置

```bash
mkdir -p /opt/nacos/conf
```

- 运行容器

```bash
docker run -d --env MODE=standalone  --name nacos -v /opt/nacos/conf/:/home/nacos/conf -p 8848:8848 nacos/nacos-server:2.0.3

docker update --restart=always nacos
```

- `-p` 指定端口
- `--env` 表示单机模式下运行
- `--name` 表示容器名称
- `-v` 表示参数
- `-d` 表示后台运行

## 5. 单机部署 Java

- 准备 DockerFile 文件

  ```bash
  FROM openjdk:8
  MAINTAINER lihh
  LABEL name="springboot-mybatis" version="1.0" author="bobo"
  COPY springboot-mybatis-demo-0.0.1-SNAPSHOT.jar springboot-mybatis.jar
  CMD ["java","-jar","springboot-mybatis.jar"]
  ```

- 构建镜像

  ```bash
  docker build -t sbm-image .
  ```

- 运行镜像

  ```bash
  docker run -d --name sb01 -p 8081:8080  sbm-image
  ```

- 查看启动日志

  ```bash
  docker logs sb01
  ```

## 6. 配置MySQL主从

![在这里插入图片描述](https://img-blog.csdnimg.cn/b0f757eac03a4d54890f7c402a6bd6be.png)

- 1. 首先使用相同的命令 来配置两台MySQL服务

- 1.1 配置master 服务

```shell
docker run -p 3306:3306 --name mysql_master -v /opt/mysql_master/log:/var/log/mysql -v /opt/mysql_master/data:/var/lib/mysql -v /opt/mysql_master/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root_master -d mysql:5.7
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/22ad5cbc699146b9b3593ff8a84cf6aa.png)


- 1.2 配置slave服务

```shell
docker run -p 3307:3306 --name mysql_slave -v /opt/mysql_slave/log:/var/log/mysql -v /opt/mysql_slave/data:/var/lib/mysql -v /opt/mysql_slave/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root_slave -d --link mysql_master:mysql_master mysql:5.7
```

- 1.2.1 关于上述的`--link` 可以参照[文章](https://www.jb51.net/article/264021.htm)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2c925c42ef3f441bb651505aabde22f7.png)

- 2. 配置主数据库

> 在右侧此目录下 进行db配置【/opt/mysql_master/conf/my.cnf】

```shell
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
# skip-name-resolve 一定要添加 不然很慢
skip-name-resolve

# id 必须是局域网内唯一
server_id=1
log-bin=mysql-bin
# master 可读写
read-only=0
# 需要同步的数据库
binlog-do-db=kubemsb_test

# 表示忽略复制的库
replicate-ignore-db=mysql
replicate-ignore-db=sys
replicate-ignore-db=information_schema
replicate-ignore-db=performance_schema
```

- 3. 配置从数据库

```shell
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve

server_id=2
log-bin=mysql-bin
read-only=1
binlog-do-db=kubemsb_test

replicate-ignore-db=mysql
replicate-ignore-db=sys
replicate-ignore-db=information_schema
replicate-ignore-db=performance_schema
```

- 4. 添加用户设置权限

-  4.1 主数据库配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5f17f589fe949a9b302c976d0953a42.png)

```bash
grant replication slave on *.* to 'backup'@'%' identified by '123456';
```
授权用户

- 4.2 从服务器配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/228ab9d6a8564ea691b70f8968efa270.png)

```bash
# 修改同步方式
change master to master_host='mysql_master', master_user='backup', master_password='123456', master_log_file='mysql-bin.000001', master_log_pos=154, master_port=3306;

# 验证同步状态
show slave status\G
```