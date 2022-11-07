<h1 align = "center">docker file</h1>

DockerFile 是用来构建 Docker 镜像的`构建文件`，是由一系列`命令`和`参数`构成的`脚本`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/47402821a0bf42608bd603feebe30830.png)

```shell
FROM scratch
ADD centos-7-x86_64-docker.tar.xz /

LABEL \
    org.label-schema.schema-version="1.0" \
    org.label-schema.name="CentOS Base Image" \
    org.label-schema.vendor="CentOS" \
    org.label-schema.license="GPLv2" \
    org.label-schema.build-date="20201113" \
    org.opencontainers.image.title="CentOS Base Image" \
    org.opencontainers.image.vendor="CentOS" \
    org.opencontainers.image.licenses="GPL-2.0-only" \
    org.opencontainers.image.created="2020-11-13 00:00:00+00:00"

CMD ["/bin/bash"]
```

## 1. DockerFile 介绍

### 1.1 构建过程

> ​Dockerfile 中的指令需要满足如下的规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/e0196a253a1c4d08a8e5d4c259fe9970.png)

### 1.2 执行流程

docker 执行一个 Dockerfile 脚本的流程大致如下：

1. docker 从基础镜像运行一个容器
2. 执行一条指令并对容器作出修改
3. 执行类似 docker commit 的操作提交一个新的镜像层
4. docker 再基于刚提交的镜像运行一个新的容器
5. 执行 dockerfile 中的下一条指令直到所有指令都执行完成

从应用软件的角度来看，Dockerfile、Docker 镜像与 Docker 容器分别代表软件的三个不同阶段，

- Dockerfile 是软件的原材料
- Docker 镜像是软件的交付品
- Docker 容器则可以认为是软件的运行态。

Dockerfile 面向开发，Docker 镜像成为交付标准，Docker 容器则涉及部署与运维，三者缺一不可，合力充当 Docker 体系的基石。

![在这里插入图片描述](https://img-blog.csdnimg.cn/672da8c83fdc4af8b450143834a6dc59.png)

1. Dockerfile，需要定义一个 Dockerfile，Dockerfile 定义了进程需要的一切东西。Dockerfile 涉及的内容包括执行代码或者是文件、环境变量、依赖包、运行时环境、动态链接库、操作系统的发行版、服务进程和内核进程(当应用进程需要和系统服务和内核进程打交道，这时需要考虑如何设计 namespace 的权限控制)等等;
2. Docker 镜像，在用 Dockerfile 定义一个文件之后，docker build 时会产生一个 Docker 镜像，当运行 Docker 镜像时，会真正开始提供服务;
3. Docker 容器，容器是直接提供服务的。

| 指令       | 说明                                                                                                                                              |
| ---------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| FROM       | 基础镜像，当前新镜像是基于哪个镜像的,有继承的意味                                                                                                 |
| MAINTAINER | 镜像维护者的姓名和邮箱地址                                                                                                                        |
| RUN        | 容器构建时需要运行的命令                                                                                                                          |
| EXPOSE     | 当前容器对外暴露的端口                                                                                                                            |
| WORKDIR    | 指定在创建容器后，终端默认登录的进来工作目录，一个落脚点                                                                                          |
| ENV        | 用来在构建镜像过程中设置环境变量                                                                                                                  |
| ADD        | 将宿主机目录下的文件拷贝进镜像且 ADD 命令会自动处理 URL 和解压 tar 压缩包                                                                         |
| COPY       | 类似 ADD，拷贝文件和目录到镜像中。将从构建上下文目录中<源路径>的文件/目录复制到新的一层的镜像内的<目标路径>位置 COPY src dest COPY ["src","dest"] |
| VOLUME     | 容器数据卷，用于数据保存和持久化工作                                                                                                              |
| CMD        | 指定一个容器启动时要运行的命令 Dockerfile 中可以有多个 CMD 指令，但只有最后一个生效，CMD 会被 docker run 之后的参数替换                           |
| ENTRYPOINT | 指定一个容器启动时要运行的命令 ENTRYPOINT 的目的和 CMD 一样，都是在指定容器启动程序及参数                                                         |
| ONBUILD    | 当构建一个被继承的 Dockerfile 时运行命令,父镜像在被子继承后父镜像的 onbuild 被触发                                                                |

```shell
RUN set -eux; \
	nativeLines="$(catalina.sh configtest 2>&1)"; \
	nativeLines="$(echo "$nativeLines" | grep 'Apache Tomcat Native')"; \
	nativeLines="$(echo "$nativeLines" | sort -u)"; \
	if ! echo "$nativeLines" | grep -E 'INFO: Loaded( APR based)? Apache Tomcat Native library' >&2; then \
		echo >&2 "$nativeLines"; \
		exit 1; \
	fi

EXPOSE 8080
CMD ["catalina.sh", "run"]

docker run -it -p 7777:8080 tomcat  ls -l

RUN set -eux; \
	nativeLines="$(catalina.sh configtest 2>&1)"; \
	nativeLines="$(echo "$nativeLines" | grep 'Apache Tomcat Native')"; \
	nativeLines="$(echo "$nativeLines" | sort -u)"; \
	if ! echo "$nativeLines" | grep -E 'INFO: Loaded( APR based)? Apache Tomcat Native library' >&2; then \
		echo >&2 "$nativeLines"; \
		exit 1; \
	fi

EXPOSE 8080
CMD ["catalina.sh", "run"]
CMD ls -l
```

DockerFile 命令

| BUILD         | BOTH    | RUN        |
| ------------- | ------- | ---------- |
| FROM          | WORKDIR | CMD        |
| MAINTAINER    | USER    | ENV        |
| COPY          |         | EXPOSE     |
| ADD           |         | VOLUME     |
| RUN           |         | ENTRYPOINT |
| ONBUILD       |         |            |
| .dockerignore |         |            |

## 2. 案例

> &emsp;&emsp;我们从官方 pull 下来的`centos`镜像是 mini 版的，所以不带有`vim`这些基础命令，那我们就来自定义一个镜像，功能比官方下载的强大点，同时运用下各个指令。

- 编写`dockerFile`文件

```shell
FROM centos
MAINTAINER bobo<dengpbs@163.com>

ENV MYPATH /usr/local
WORKDIR $MYPATH

RUN yum -y install vim

EXPOSE 80

CMD echo $MYPATH
CMD echo "success--------------ok"
CMD /bin/bash
```

- 通过命令`docker build` 进行构建

&emsp;&emsp;然后将脚本构建成对应的镜像文件。

```bash
docker build -f dockerfile名称 -t 新建的镜像名:TAG .
```

- 通过命令`docker run`运行 之前构建的镜像

```bash
docker run -it 新镜像名称:TAG
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191227011815639.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9kcGItYm9ib2thb3lhLXNtLmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70)

运行容器后，落脚点是 `/usr/local` 因为我们配置了`WORKDIR`

### 2.1 镜像历史

&emsp;&emsp;查看一个镜像文件的变更历史可以使用如下命令:

```bash
docker history 镜像名
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191227012021461.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9kcGItYm9ib2thb3lhLXNtLmJsb2cuY3Nkbi5uZXQ=,size_16,color_FFFFFF,t_70)

在本例中我们用到了 `FROM` `MAINTAINER` `RUN` `EXPOSE` `ENV` `WORKDIR` 命令
