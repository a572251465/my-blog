<h1 align = "center">docker 数据卷</h1>

## 1. 数据卷

> 前面我们介绍了镜像和容器，通过镜像我们可以启动多个容器，但是我们发现当我们的容器停止获取删除后，我们在容器中的应用的一些数据也丢失了，这时为了解决容器的数据持久化，我们需要通过容器数据卷来解决这个问题

### 1.1 数据卷是什么

> ​ 前面我们介绍了镜像和容器，通过镜像我们可以启动多个容器，但是我们发现当我们的容器停止获取删除后，我们在容器中的应用的一些数据也丢失了，这时为了解决容器的数据持久化，我们需要通过容器数据卷来解决这个问题

### 1.2 数据卷解决了什么问题

卷就是目录或文件，存在于一个或多个容器中，由 docker 挂载到容器，但不属于联合文件系统，因此能够绕过 Union File System 提供一些用于持续存储或共享数据的特性：
   卷的设计目的就是数据的持久化，完全独立于容器的生存周期，因此 Docker 不会在容器删除时删除其挂载的数据卷

特点：

1. 数据卷可在容器之间共享或重用数据

2. 卷中的更改可以直接生效

3. 数据卷中的更改不会包含在镜像的更新中

4. 数据卷的生命周期一直持续到没有容器使用它为止

> 持久化，容器间继承和共享数据

## 2. 数据卷使用

### 2.1 运行一个 centos 容器

- 运行容器 并构建数据卷

```shell
docker run -it -v /宿主机绝对路径:/容器内目录 镜像名
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c063435755e40fc9fdc643e3a622ea9.png)

- 查看数据卷中内容

![在这里插入图片描述](https://img-blog.csdnimg.cn/e1d223b2bc66461399f41ac49ef0f1bb.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac794dd68dd54e9082fe73eecc817da7.png)

- 数据卷中新建内容

![在这里插入图片描述](https://img-blog.csdnimg.cn/f232c8b9d8bd43f4a0ff37ed233aaf8c.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/121d453fd8634d75b38fb92ed5c107aa.png)

- 停止容器 内容还在

![在这里插入图片描述](https://img-blog.csdnimg.cn/a9fe83206c3641c695f994e3d28e04d6.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff6ccf1c1993488296bbfae82030ca76.png)

- 重新启动容器 内容还在

![在这里插入图片描述](https://img-blog.csdnimg.cn/d3ee8073bff946b69e5b687503a7fe1a.png)

### 2.2 创建并且运行容器的同时 设置权限

```shell
docker run -it -v /宿主机绝对路径:/容器目录:ro 镜像名
```

## 3. 使用`dockerFile`的方式进行创建

​ 1. 宿主机跟目录下创建一个 mydocker，并在该目录下创建一个文件，内容如下

```shell
# volume test

FROM centos

VOLUME ["/root/dataVolumeContainer1","/root/dataVolumeContainer2"]

CMD echo "finished,--------success1"

CMD /bin/bash

```

- `-f` DockerFile 文件的路径

- `-t` 标签

- `.` 当前路径

2. 根据这个 DockerFile 构建我们的镜像文件

```shell
docker build -f dockerFile1 -t bobo/centos .
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3598b0623dab467ca88b452c005f6352.png)

3. 查询容器内容 数据卷目录

![在这里插入图片描述](https://img-blog.csdnimg.cn/e537804bd3e04d858e298065120c933f.png)

4. 查询宿主机的 关于容器的数据卷位置

- 执行命令

```shell
docker inspect [name]
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2bbee0f91aef4cb8917ec43599935db0.png)

5. 新建数据

![在这里插入图片描述](https://img-blog.csdnimg.cn/f4b18a462c85473f8795f2df731e6250.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c931f064b004706be39a75dc4707cb5.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/960d3ad0fc2240b99ba225b95a6e4fb7.png)
