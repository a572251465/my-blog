<h1 align = "center">MySQL 安装</h1>

> 以废话的形式 简单描述下 MySQL 安装过程

## 1. 先安装镜像，安装后进行镜像查看

- 命令 1：

```bash
docker pull mysql:5.6
```

- 命令 2：

```bash
docker images
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9b0278776ad045db95b03dd37ad0008d.png)

## 2. 执行命令 通过镜像生成容器

```bash
docker run -p 3316:3306 --name mysql -v /root/mysql/conf:/etc/mysql/conf.d -v /root/mysql/logs:/logs -v /root/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```

- `-p` 指定映射端口 3316 是宿主机 3306 是容器
- `-e` 指定密码
- `-v` 指定数据卷 持久化
- `-d` 以守护模式来运行

![在这里插入图片描述](https://img-blog.csdnimg.cn/187accb5a5d943d4b20ad782cd968650.png)

> 注意：一定要注意端口 3316 是否已经开放。 不然通过外部软件是无法访问数据库的

## 3. 修改访问权限

- 步骤 1：

  获取镜像 id

```bash
docker ps
```

- 步骤 2：

```bash
docker exec -it xxx bash
```

- 步骤 3：

```bash
mysql -uroot -p
```

- 步骤 4：

```bash
use mysql;
```

- 步骤 5:

```bash
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
```

## 4. 外界访问测试

![在这里插入图片描述](https://img-blog.csdnimg.cn/da97296dcda646f6815a9b0ba66a7fca.png)
