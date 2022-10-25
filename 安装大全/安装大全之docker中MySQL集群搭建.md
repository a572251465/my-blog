<h1 align = "center">MySQL集群搭建</h1>

> MySQL 集群搭建在实际项目中还是非常必须的，我们通过 PXC【Percona XtraDB Cluster】来实现强一致性数据库集群搭建。

- 拉取镜像

```bash
docker pull percona/percona-xtradb-cluster:5.7.21
```

- 复制 pxc 镜像【重命名】

```bash
docker tag percona/percona-xtradb-cluster:5.7.21 pxc
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/7e74ed2b27fd4ab49053c1f0ea1c6f1e.png)

- 删除原来的镜像

```bash
docker rmi percona/percona-xtradb-cluster:5.7.21
```

- 创建独立的网段 给 MySQL 集群用
  > 其实主要还是为了容器之间通信，同一网段下方便通信，也方便跟宿主机通信

```bash
docker network create --subnet=172.20.0.0/24 pxc-net
docker network inpsect pxc-net # 查看详情
docker network rm pxc-net # 删除网段
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c37f749a52b249d99069bba93b79129a.png)

- 创建数据持久的 volume

```bash
docker volume create --name v1
docker volume create --name v2
docker volume create --name v3
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a1b1a76792594491b32270c04f4aa675.png)

- 开始创建容器

  - 创建第一个节点

    ```bash
    docker run -d -p 3301:3306 -v v1:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e EXTRABACKUP_PASSWROD=123456 --privileged --name=node1 --net=pxc-net --ip 172.22.0.2 pxc
    ```

    - `-d` 守护模式运行，就是创建后直接在后台运行
    - `-p` 指定端口映射
    - `-e` 赋值参数
    - `--privileged` 权限等级
    - `--name` 设置节点名称
    - `--net` 表示使用网络
    - `--ip` 表示指定 ip

  - 创建第二个节点

    > 创建第二个和第三个节点: 注意 -e CLUSTER_JOIN=node1

    ```bash
    docker run -d -p 3302:3306 -v v2:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e EXTRABACKUP_PASSWROD=123456 -e CLUSTER_JOIN=node1 --privileged --name=node2 --net=pxc-net --ip 172.22.0.3 pxc
    ```

    ```bash
    docker run -d -p 3303:3306 -v v3:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e EXTRABACKUP_PASSWROD=123456 -e CLUSTER_JOIN=node1 --privileged --name=node3 --net=pxc-net --ip 172.22.0.4 pxc
    ```

- 测试

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5ac67a43e2542c69457531cf9347c6e.png)

使用本地客户端分别连接三个 MySQL，当一个库创建一个`test-db`数据库后，并创建一个`user`表。其余的两个 MySQL 都存在这个表了。表示集群搭建成功
