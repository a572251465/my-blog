<h1 align = "center">常用命令</h1>

## 1. 信息查看命令

| 命令                  | 说明                                          |
| --------------------- | --------------------------------------------- |
| docker version        | 查看 docker 的版本信息                        |
| docker info           | 查看 docker 详细的信息                        |
| docker --help         | docker 的帮助命令，可以查看到相关的其他命令   |
| docker command --help | docker 的帮助命令，查询具体某一个命令使用方法 |

- `docker version`
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/32b17bc5912d44bdb606ea7e45b8e5f5.png)
- `docker info`
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/3251e586fcb8474c93198479dffdfdcd.png)
- `docker --help`
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/78229f1019964c5889fc2fc6e03a043a.png)
- `docker images --help`
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/6e395277036a4548a19135f2f9a00f09.png)

## 2. 镜像命令

| 镜像命令               | 说明                     |
| ---------------------- | ------------------------ |
| docker images          | 列出本地主机上的镜像     |
| docker search 镜像名称 | 从 docker hub 上搜索镜像 |
| docker pull 镜像名称   | 从 docker hub 上下载镜像 |
| docker rmi 镜像名称    | 删除本地镜像             |

### 2.1 `docker images`

![在这里插入图片描述](https://img-blog.csdnimg.cn/f77602e87d474e6aa31119a39edbc66c.png)

镜像表格信息说明

| 选项       | 说明             |
| ---------- | ---------------- |
| REPOSITORY | 表示镜像的仓库源 |
| TAG        | 镜像的标签       |
| IMAGE ID   | 镜像 ID          |
| CREATED    | 镜像创建时间     |
| SIZE       | 镜像大小         |

| 参数       | 说明               |
| ---------- | ------------------ |
| -a         | 列出本地所有的镜像 |
| -q         | 只显示镜像 ID      |
| --digests  | 显示镜像的摘要信息 |
| --no-trunc | 显示完整的镜像信息 |

```shell
[root@bobo01 ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
hello-world   latest    d1165f221234   2 weeks ago   13.3kB
[root@bobo01 ~]#
[root@bobo01 ~]# docker images -a
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
hello-world   latest    d1165f221234   2 weeks ago   13.3kB
[root@bobo01 ~]# docker images -q
d1165f221234
[root@bobo01 ~]# docker images -qa
d1165f221234
[root@bobo01 ~]# docker images --digests
REPOSITORY    TAG       DIGEST                                                                    IMAGE ID       CREATED       SIZE
hello-world   latest    sha256:308866a43596e83578c7dfa15e27a73011bdd402185a84c5cd7f32a88b501a24   d1165f221234   2 weeks ago   13.3kB
[root@bobo01 ~]# docker images --no-trunc
REPOSITORY    TAG       IMAGE ID                                                                  CREATED       SIZE
hello-world   latest    sha256:d1165f2212346b2bab48cb01c1e39ee8ad1be46b87873d9ca7a4e434980a7726   2 weeks ago   13.3kB

```

### 2.2 `docker search`

​ docker hub 是 Docker 的在线仓库，我们可以通过 docker search 在上面搜索我们需要的镜像

| 参数名称   | 描述                                     |
| ---------- | ---------------------------------------- |
| --no-trunc | 显示完整的描述信息                       |
| --limit    | 分页显示                                 |
| -f         | 过滤条件 docker search -f STARS=5 tomcat |

### 2.3 `docker rmi`

| 删除方式 | 命令                                |
| -------- | ----------------------------------- |
| 删除单个 | docker rmi -f 镜像 ID               |
| 删除多个 | docker rmi -f 镜像 1:TAG 镜像 2:TAG |
| 删除全部 | docker rmi -f $(docker images -qa)  |
