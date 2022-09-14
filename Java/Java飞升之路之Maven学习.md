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

- 第一种是远程仓库，例如：Apache 提供的中央仓库，还有阿里的镜像仓库，甚至是公司的私服仓库，简而言之，不在本地仓库都是远程仓库

> - 第二种是本地仓库，就是将依赖下载到本地，下次使用的时候优先从本次进行查找

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

## 4. 创建 maven 工程 以及编译结果

### 4.1 创建项目结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/7063a8b9448f4430bbfde18e3f330596.png)

- 以上就是基于 POM 的 maven 项目。 图中标注的部分就是每个项目的凭证，而且是独一无二的
- 如果以后别的项目中依赖了该项目，就是靠这个凭证来识别的

### 4.2 maven 项目编译结果

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/0ecd191620d24844bdb0504d47ce9811.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/1f53562696cb4933a32b6f0934886e3b.png)

> - 每次我们编译结果后，其实编译后的包都可以被别的项目所利用。
> - 靠着各自的凭证会保存到本地仓库中
> - 仓库中的地址是上述截图 2 中的位置
> - 当别的项目依赖该项目的使用，也会同样到本地仓库中寻找

## 5. 添加依赖

![在这里插入图片描述](https://img-blog.csdnimg.cn/e6641992af354fda9396b619e2dc0c6b.png)

- 我们可以在上述截图的位置中添加依赖，是可以添加多个依赖的

## 6. 依赖的传递性

> - 此时我们有两个项目 A, B。 在项目 A 中添加到了 mybatis 依赖
> - 此时 B 项目依赖了 A 项目。依据依赖的传递性，此时 B 项目中同样有了 mybatis 依赖

- 表示 A 项目
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/913f7263b28249ff9f75aac478f81028.png)
- 表示 B 项目
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/efc53903d5884dfc967800f82b0da743.png)

## 7. 排除依赖

> 可以排除多个依赖

![在这里插入图片描述](https://img-blog.csdnimg.cn/3bced404170b415daf6c133f70258993.png)

## 8. 父子类 maven 工程

### 8.1 继承的 pom.xml

- 父类

```xml

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

> - 通过上述的标签`dependencyManagement`可以得知，此 maven 工程只是负责管理版本的逻辑工程，不包含任何依赖

- 子类

```xml

<project>
    <parent>
        <groupId>org.example</groupId>
        <artifactId>maven_project1</artifactId>
        <version>1.0-SNAPSHOT</version>
        <relativePath>../maven_project1/pom.xml</relativePath>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
        </dependency>
    </dependencies>
</project>
```

> - 首先通过标签`parent`来表明 谁是父类工程
> - 遇到依赖的插件的时候，可以不表明版本。根据父类的版本而依赖。例如`mybatis`
> - 但是也可以自己依赖别的版本

### 8.2 import 范围用法

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/f3e6285a64814bd28f957d74d956945a.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/3d7eca5d11d6432f96f9ff8316493f07.png)

> - 使用`import`范围关键字后，子工程依赖的版本必须跟父工程的保持一致
> - 而且`import`的关键字必须在标签`dependencyManagement`内

## 9. 插件相关的处理

### 9.1 复制插件

> 一般我们的配置文件都会放到`resources`目录下，随着我们的 install 一起打包到 target 中，但是如果把配置文件放置到别的位置，就无法进行打包复制了

```xml

<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
    </resources>
</build>
```
