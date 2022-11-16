<h1 align = "center">jdk安装过程</h1>

> 虽然 jdk 的安装过程已经在百度上泛滥了，但是为了内部用，还是从 0 到 1 讲述下如何安装一个 jdk

## step1 下载 jdk

> 虽然 jdk 已经出现了很多很多版本了，但是为了项目中稳定性，我们一般都不在生产环境中使用最新版而是一个稳定版，所以我们就以 1.8 为例

- [下载参考地址](https://github.com/a572251465/my-blog/blob/main/%E5%AE%89%E8%A3%85%E5%A4%A7%E5%85%A8/%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.md)

## step2 上传文件以及解压

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c77cc74f6bd4766802868e23c765deb.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/3b022e6e65b54541ba4da58ad90792c1.png)

- 上述过程主要主要演示了
  - 上传文件
  - 解压文件
  - 修改名称

## step3 配置环境变量

- 编辑环境变量命令

  ```shell
  vi /etc/profile
  ```

- 首先查看下 jdk 下面的路径地址

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/bbc1b56ea13441fc8df21e51d5c78435.png)

- 开始配置环境变量

```
export JAVA_HOME=/software/jdk1.8
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib:$CLASSPATH
export JAVA_PATH=${JAVA_HOME}/bin:${JRE_HOME}/bin
export PATH=$PATH:${JAVA_PATH}
```

- 可以将上述内容直接复制到配置文件中，只需要修改`JAVA_HOME`. 因为每个人的配置路径不同的

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/40f13bd9a32a4d298d63edae867432ce.png)

- 重新加载配置文件

  ```shell
  source /etc/profile
  ```

## step4 验证安装是否成功

```
javac -version
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/85d81bedecfd434f871c94a0a71fce36.png)
