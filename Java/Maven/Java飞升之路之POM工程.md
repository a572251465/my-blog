<h1 align = "center">POM工程</h1>

## 1. 工程类型

- POM 工程

  > POM 工程是逻辑工程。用在父级工程或聚合工程中。用来做 jar 包的版本控制。

- JAR 工程

  > 将会打包成 jar，用作 jar 包使用。即常见的本地工程 ---> Java Project。

- WAR 工程

  > 将会打包成 war，发布在服务器上的工程。

## 2. Maven 工程关系

### 2.1 依赖关系

> 即 A 工程开发或运行过程中需要 B 工程提供支持，则代表 A 工程依赖 B 工程

![在这里插入图片描述](https://img-blog.csdnimg.cn/11a9e22213f9427fad04d810bf75574b.png)

- 通俗理解：就是导 jar 包。
- B 工程可以是自己的项目打包后的 jar 包，也可以是中央仓库的 jar 包。

#### 2.1.1 如何注入依赖

- 在 pom.xml 文件 根元素 project 下的 dependencies 标签中，配置依赖信息，内可以包含多个 dependence 元素，以声明多个依赖。
- 每个依赖 dependence 标签都应该包含以下元素：groupId, artifactId, version : 依赖的基本坐标
- 对于任何一个依赖来说，基本坐标是最重要的， Maven 根据坐标才能找到需要的依赖。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a8c750f25e2a4bf58121e9afd938c5d8.png)

#### 2.1.2 依赖的传递性

- 传递性依赖是 Maven2.0 的新特性。假设你的项目依赖于一个库，而这个库又依赖于其他库。你不必自己去找出所有这些依赖，你只需要加上你直接依赖的库，Maven 会隐式的把这些库间接依赖的库也加入到你的项目中。
- 这个特性是靠解析从远程仓库中获取的依赖库的项目文件实现的。一般的，这些项目的所有依赖都会加入到项目中，或者从父项目继承，或者通过传递性依赖。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f3417e0475af4bb98846623032d9b163.png)

#### 2.1.3 两个原则

- 最短路径优先原则

  - “最短路径优先”意味着项目依赖关系树中路径最短的版本会被使用。

- 最先声明原则

  - 依赖路径长度是一样的的时候，第一原则不能解决所有问题，比如这样的依赖关系：A–>B–>Y(1.0)，A–>C–>Y(2.0)，Y(1.0)和 Y(2.0)的依赖路径长度是一样的，都为 2。那么到底谁会被解析使用呢？在 maven2.0.8 及之前的版本中，这是不确定的，但是 maven2.0.9 开始，为了尽可能避免构建的不确定性，maven 定义了依赖调解的第二原则：第一声明者优先。在依赖路径长度相等的前提下，在 POM 中依赖声明的顺序决定了谁会被解析使用。顺序最靠前的那个依赖优胜。

#### 2.1.4 排除依赖

![在这里插入图片描述](https://img-blog.csdnimg.cn/48f8e967b2a54e87b4d7ea3eb77d7f95.png)

#### 2.1.5 依赖范围

> 依赖范围就决定了你依赖的坐标 在什么情况下有效，什么情况下无效

- compile

  - 这是默认范围。如果没有指定，就会使用该依赖范围。表示该依赖在编译和运行时都生效。

- provided

  - 测试以及编译有效，运行无效。典型的例子是 servlet-api，编译和测试项目的时候需要该依赖，但在运行项目的时候，由于容器已经提供，就不需要 Maven 重复地引入一遍(如：servlet-api)

- runtime

  - runtime 范围表明编译时不需要生效，而只在运行时生效。典型的例子是 JDBC 驱动实现，项目主代码的编译只需要 JDK 提供的 JDBC 接口，只有在执行测试或者运行项目的时候才需要实现上述接口的具体 JDBC 驱动。

- system

  - 系统范围与 provided 类似，不过你必须显式指定一个本地系统路径的 JAR，此类依赖应该一直有效，Maven 也不会去仓库中寻找它。但是，使用 system 范围依赖时必须通过 systemPath 元素显式地指定依赖文件的路径。

- test

  - test 范围表明使用此依赖范围的依赖，只在编译测试代码和运行测试的时候需要，应用的正常运行不需要此类依赖。典型的例子就是 JUnit，它只有在编译测试代码及运行测试的时候才需要。Junit 的 jar 包就在测试阶段用就行了，你导出项目的时候没有必要把 junit 的东西到处去了就，所在在 junit 坐标下加入 scope-test

- Import
  - import 范围只适用于 pom 文件中的<dependencyManagement>部分。表明指定的 POM 必须使用<dependencyManagement>部分的依赖。
    注意：import 只能用在 dependencyManagement 的 scope 里。
  - 父工程
    - ![在这里插入图片描述](https://img-blog.csdnimg.cn/c9e5294590ba42c49255ab0183e4f953.png)
  - 子工程
    - ![在这里插入图片描述](https://img-blog.csdnimg.cn/127678ffea184a6c91d944f7a4b1ae2e.png)
  - 如果父工程中加入 score-import 相当于强制的指定了版本号：
    - ![在这里插入图片描述](https://img-blog.csdnimg.cn/1c0accf8ea4541f69a4b01d91b5c3ac5.png)

### 2.2 继承关系

- 如果 A 工程继承 B 工程，则代表 A 工程默认依赖 B 工程依赖的所有资源，且可以应用 B 工程中定义的所有资源信息。

- 被继承的工程（B 工程）只能是 POM 工程。

> 注意：在父项目中放在<dependencyManagement>中的内容时不被子项目继承，不可以直接使用放在<dependencyManagement>中的内容主要目的是进行版本管理。里面的内容在子项目中依赖时坐标只需要填写<group id>和<artifact id>即可。（注意：如果子项目不希望使用父项目的版本，可以明确配置 version）。

### 2.3 聚合关系

- 当我们开发的工程拥有 2 个以上模块的时候，每个模块都是一个独立的功能集合。比如某大学系统中拥有搜索平台，学习平台，考试平台等。开发的时候每个平台都可以独立编译，测试，运行。这个时候我们就需要一个聚合工程。
- 在创建聚合工程的过程中，总的工程必须是一个 POM 工程（Maven Project）（聚合项目必须是一个 pom 类型的项目，jar 项目 war 项目是没有办法做聚合工程的），各子模块可以是任意类型模块（Maven Module）。

## 3. 资源拷贝插件

- Maven 在打包时默认只将 src/main/resources 里的配置文件拷贝到项目中并做打包处理，而非 resource 目录下的配置文件在打包时不会添加到项目中。

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
                                        <include>**/*.properties</include>
                                </includes>
                        </resource>
                </resources>
        </build>
```

## 4. 常见的命令

- install

  - 本地安装， 包含编译，打包，安装到本地仓库
  - 编译 - javac
  - 打包 - jar， 将 java 代码打包为 jar 文件
  - 安装到本地仓库 - 将打包的 jar 文件，保存到本地仓库目录中。

- clean

  - 清除已编译信息。
  - 删除工程中的 target 目录。

- compile

  - 只编译。 javac 命令

- package

  - 打包。 包含编译，打包两个功能。

- install 和 package 的区别：

  - package 命令完成了项目编译、单元测试、打包功能，但没有把打好的可执行 jar 包（war 包或其它形式的包）布署到本地 maven 仓库和远程 maven 私服仓库
  - install 命令完成了项目编译、单元测试、打包功能，同时把打好的可执行 jar 包（war 包或其它形式的包）布署到本地 maven 仓库，但没有布署到远程 maven 私服仓库
