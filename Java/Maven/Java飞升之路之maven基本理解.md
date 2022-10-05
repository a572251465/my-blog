<h1 align = "center">Maven 基本理解</h1>

## 1. 基本概念

- 目前无论使用 IDEA 还是 Eclipse 等其他 IDE，使用里面 ANT 工具。ANT 工具帮助我们进行编译，打包运行等工作。
- 目前无论使用 IDEA 还是 Eclipse 等其他 IDE，使用里面 ANT 工具。ANT 工具帮助我们进行编译，打包运行等工作。
- Maven 是 Apache 的一款开源的项目管理工具。

- Maven 使用项目对象模型(POM-Project Object Model,项目对象模型)的概念,可以通过一小段描述信息来管理项目的构建，报告和文档的软件项目管理工具。在 Maven 中每个项目都相当于是一个对象，对象（项目）和对象（项目）之间是有关系的。关系包含了：依赖、继承、聚合，实现 Maven 项目可以更加方便的实现导 jar 包、拆分项目等效果。

## 2. IDEA 中配置地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/26b1c9d1a6334e5d9651de24857bb5e2.png)

## 3. 目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/685a518ec614445b9289d0b7c214ba1a.png)

- `bin` 执行脚本目录。存放的一些命令
- `boot` maven 启动 jar 包
- `conf` 配置文件目录
- `lib` 其余 jar 包的存放位置

## 4. 环境变量设定

![在这里插入图片描述](https://img-blog.csdnimg.cn/a51d6fca3ad44b5f98be2a8a54ab82a9.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/32be0b8b2cc04e4d9dd9b5d04a28e2ca.png)

## 5. 远程仓库

[访问地址](https://mvnrepository.com/)

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ff882eca74a4f7e86bcb95202b916f4.png)

- 上述是包依赖 标识（唯一的）

## 6. 本地仓库

- 在`settings.xml`中配置镜像仓库以及 本地仓库

- 本地仓库

```xml
  <localRepository>E:\cache\java_maven\apache-maven-3.8.6-repo</localRepository>
```

- 镜像仓库

```xml
<mirror>
        <!-- 指定镜像ID（可自己改名） -->
        <id>nexus-aliyun</id>
        <!-- 匹配中央仓库（阿里云的仓库名称，不可以自己起名，必须这么写）-->
        <mirrorOf>central</mirrorOf>
        <!-- 指定镜像名称（可自己改名）  -->
        <name>Nexus aliyun</name>
        <!-- 指定镜像路径（镜像地址） -->
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

## 7. 仓库优先级问题

![在这里插入图片描述](https://img-blog.csdnimg.cn/4b01ab954b9e4394adaff1b8b0e183a3.png)

## 8. JDK 配置

```xml
<profile>
                <!-- settings.xml中的id不能随便起的 -->
                <!-- 告诉maven我们用jdk1.8 -->
                <id>jdk-1.8</id>
                <!-- 开启JDK的使用 -->
                <activation>
                                <activeByDefault>true</activeByDefault>
                                <jdk>1.8</jdk>
                </activation>
                <properties>
                        <!-- 配置编译器信息 -->
                        <maven.compiler.source>1.8</maven.compiler.source>
                        <maven.compiler.target>1.8</maven.compiler.target>
                        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
                </properties>
    </profile>
```
