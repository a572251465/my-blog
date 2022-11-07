<h1 align = "center">docker介绍以及安装</h1>

## 1.Docker 的介绍与安装

![在这里插入图片描述](https://img-blog.csdnimg.cn/3da739da0eea4717b1a480d8b0095475.png)

## 2.什么是 Docker

​ Docker 是基于**Go**语言实现的云开源项目。
  Docker 的主要目标是 Build，Ship and Run Any App,Anywhere，也就是通过对应用组件的封装、分发、部署、运行等生命周期的管理，使用户的 APP（可以是一个 WEB 应用或数据库应用等等）及其运行环境能够做到一次封装，到处运行。

![在这里插入图片描述](https://img-blog.csdnimg.cn/02eb11a96a1a4644a0da0aa2b12bbbd9.png)

​ Linux 容器技术的出现就解决了这样一个问题，而 Docker 就是在它的基础上发展过来的。将应用运行在 Docker 容器上面，而 Docker 容器在任何操作系统上都是一致的，这就实现了跨平台、跨服务器。只需要一次配置好环境，换到别的机子上就可以一键部署好，大大简化了操作

> 解决了运行环境和配置问题软件容器，方便做持续集成并有助于整体发布的容器虚拟化技术

## 3 Docker 能干什么？

### 3.1 以前的虚拟化技术

虚拟机（virtual machine）就是带环境安装的一种解决方案。

它可以在一种操作系统里面运行另一种操作系统，比如在 Windows 系统里面运行 Linux 系统。应用程序对此毫无感知，因为虚拟机看上去跟真实系统一模一样，而对于底层系统来说，虚拟机就是一个普通文件，不需要了就删掉，对其他部分毫无影响。这类虚拟机完美的运行了另一套系统，能够使应用程序，操作系统和硬件三者之间的逻辑不变。

![在这里插入图片描述](https://img-blog.csdnimg.cn/103a5108c0a54fd2a8bdc4915c603f6e.png)

虚拟机的缺点：

1. 资源占用多
2. 冗余步骤多
3. 启动慢

### 3.2 容器虚拟化技术

由于前面虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）。
  Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。有了容器，就可以将软件运行所需的所有资源打包到一个隔离的容器中。容器与虚拟机不同，不需要捆绑一整套操作系统，只需要软件工作所需的库资源和设置。系统因此而变得高效轻量并保证部署在任何环境中的软件都能始终如一地运行。
![在这里插入图片描述](https://img-blog.csdnimg.cn/b6cb0974d5fa4d84b565b69a4a77fbcc.png)

比较了 Docker 和传统虚拟化方式的不同之处：

1. 传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；
2. 而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。
3. 每个容器之间互相隔离，每个容器有自己的文件系统 ，容器之间进程不会相互影响，能区分计算资源。

### 3.3 实际的运行

Docker 作为开发人员需要掌握，作为`运维人员`必须掌握。
一次构建，随处运行

1. 更快速的应用交付和部署
2. 更便捷的升级和扩缩容
3. 更简单的系统运维
4. 更高效的计算资源利用

## 4.相关资源

官网: http://www.docker.com

仓库: https://hub.docker.com

## 5.docker 安装注意事项

- 直接安装 docker 官网的指示进行安装。[参照](https://docs.docker.com/engine/install/centos/)

### 5.1 安装后注意事项

- 查看 docker 的版本

```shell
sudo docker version
```

- 启动 docker 服务

```shell
sudo systemctl start docker
```

- 停止 docker 服务

```shell
systemctl stop docker
```

- 重启 docker 服务

```shell
systemctl restart docker
```

- 删除 docker

```shell
yum -y remov docker-ce
rm -rf /var/lib/docker
```

### 5.2 如果下载速度过慢

配置阿里云的镜像地址：

```shell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

yum 更新下即可（centos 8 无 fast 命令）：

```shell
yum makecache fast
```

### 5.3 设置开机启动

开机启动 docker

```shell
sudo systemctl enable docker
```
