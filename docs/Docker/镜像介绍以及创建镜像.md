<h1 align = "center">镜像介绍以及创建镜像</h1>

首先我们来看看镜像到底是什么？

> 镜像是一种轻量级、可执行的独立软件包，用来打包软件运行环境和基于运行环境开发的软件，它包含运行某个软件所需的所有内容，包括代码、运行时、库、环境变量和配置文件。

## 1. UnionFS

UnionFS（联合文件系统）: Union 文件系统（UnionFS）是一种分层、轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下(unite several directories into a single virtual filesystem)。Union 文件系统是 Docker 镜像的基础。镜像可以通过分层来进行继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c3de660655544939ae396be175f2dfaa.png)

`特性`：一次同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录

## 2. 镜像加载原理

Docker 镜像加载原理：

Docker 的镜像实际上由一层一层的文件系统组成，这种层级的文件系统 UnionFS。
  Bootfs(boot file system)主要包含 Bootloader 和 Kernel, Bootloader 主要是引导加载 Kernel, Linux 刚启动时会加载 Bootfs 文件系统，在 Docker 镜像的最底层是 bootfs。这一层与我们典型的 Linux/Unix 系统是一样的，包含 Boot 加载器和内核。当 boot 加载完成之后整个内核就都在内存中了，此时内存的使用权已由 bootfs 转交给内核，此时系统也会卸载 bootfs。
  Rootfs (root file system) ，在 Bootfs 之上。包含的就是典型 Linux 系统中的 /dev, /proc, /bin, /etc 等标准目录和文件。Rootfs 就是各种不同的操作系统发行版，比如 Ubuntu，Centos 等等。

## 3. 分层镜像

其实我们前面在 pull 文件的时候比如 Tomcat，在 pull 界面我们就可以看到下载的文件是一层层的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/058a4a3474994600975f7c862996b446.png)

### 3.1 分层镜像的特点

其实我们也会考虑 docker 为什么会才用这种分层的结果，它有什么好处呢？最大的一个好处就是共享资源
   比如：有多个镜像都从相同的 base 镜像构建而来，那么宿主机只需在磁盘上保存一份 base 镜像，同时内存中也只需加载一份 base 镜像，就可以为所有容器服务了。而且镜像的每一层都可以被共享。

## 4. 镜像特点

​ 大家需要注意，Docker 镜像都是只读的，当容器启动时，一个新的可写层被加载到镜像的顶部，这一层通常被称为容器层,容器层之下的都叫镜像层。

## 5. 镜像操作

我们现在已经掌握了从 docker hub 上获取相关镜像，然后运行容器，并作出我们自己的处理，但有时候我们需要将我们自己的容器制作为对应的镜像，以便后面继续使用，这时我们就需要用到 docker commit ...命令了，这节我们就通过案例来介绍下 docker commit ...命令的使用

```shell
docker commit -m="要提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:[标签名]
```

## 6. 创建镜像过程

- 查看现有的镜像。这里以 tomcat 为基本进行讲解

![在这里插入图片描述](https://img-blog.csdnimg.cn/f065adfea47b4ea89fd79bd8ad85408d.png)

- 映射端口 启动 tomcat

```shell
docker run -it -p 8888:8080 tomcat
```

> - 上述端口 8888 为 host 端口（宿主端口）
> - 上述端口 8080 为容器端口

参数

| 参数 | 说明                     |
| ---- | ------------------------ |
| -p   | 主机端口:docker 容器端口 |
| -P   | 随机分配端口             |
| -i   | 交互                     |
| -t   | 终端                     |

- 修改容器中配置文件

> 容器中没有索引文件，所以需要修改下。 但是必须运行时修改

![在这里插入图片描述](https://img-blog.csdnimg.cn/de77d8418bfc49ea9875ce9441461da6.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/aaa86fcebea7458fb38579cfcee9f0fb.png)

- 打包新的镜像

```shell
docker commit -a 'lihh' -m 'add index.html' 745 lihh/tomcat:1.0
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3348e66ca7c24534bf392ce288ab7cc7.png)
