<h1 align="center">Maven学习</h1>

## 1. 什么是 Maven

> - Apache 基于 ANT 进行了升级，研发出了全新的自动化的构建工具 Maven
> - Maven 是 Apache 的一款开源的项目管理工具
> - Maven 使用项目对象模型的概念，可以通过一小段描述信息来管理项目的构建

## 2. Maven 目录整合

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/60c3ce6464b64c34ba557c880dbefeaf.png)

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/f9cb22d0e0f44af698d475bfb6c695c9.png)

## 3. 仓库分类/ 仓库配置

### 3.1 仓库分类

> - 仓库大致分为两大类：
>   - 第一种是远程仓库，例如：Apache 提供的中央仓库，还有阿里的镜像仓库，甚至是公司的私服仓库，简而言之，不在本地仓库都是远程仓库
>   - 第二种是本地仓库，就是将依赖下载到本地，下次使用的时候优先从本次进行查找

### 3.2 仓库配置

```xml
    <mirrors>
        <mirror>
            <id>uinnova-snapshots</id>
            <name>internal nexus repository</name>
            <url>https://mvn-dev.uino.cn/repository/public/</url>
            <mirrorOf>*</mirrorOf>
        </mirror>

        <mirror>
            <id>aliyun-central</id>
            <mirrorOf>!central</mirrorOf>
            <name>aliyun central</name>
            <url>https://maven.aliyun.com/repository/central</url>
        </mirror>
    </mirrors>
```

- 一般我们只需要关注字段`mirrorOf` 以及`url`. 但是为了保险起见最好名称都不要自己动
- 一般的话 字段`mirrorOf`的名称不能一样。不然如果第一个镜像查找失败了，是不会到第二个寻找的
- 关于提供的中央仓库 是不需要直接写入到 xml 中的
- 其实是可以配置多个镜像的，在下载 jar 包的时候会依次从镜像中进行寻找

### 3.3 本地仓库配置

```xml
<localRepository>E:\java_maven\repo</localRepository>
```

- 在文件中通过上述的代码进行本地仓库地址配置。
- 我们使用 jar 包的时候，无法使用远程上的文件，其实是先下载到本地，从本地直接获取
- 如果下次另一个项目使用的话也是从本地优先查找

### 3.4 仓库配置优先级

![在这里插入图片描述](https://img-blog.csdnimg.cn/f35559e3f3c7415a9d2a9dcc66ac86d8.png)
