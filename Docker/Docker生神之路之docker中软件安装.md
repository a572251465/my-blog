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

- 建立备用目录 以及防止文件

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
