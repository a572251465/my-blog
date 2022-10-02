<h1>修改配置</h1>

> 虽然 SpringBoot 推崇的是零配置，但是如果一些配置不满足我们的需求的时候，我们还是需要进行修改的

## 1. 默认配置路径

![在这里插入图片描述](https://img-blog.csdnimg.cn/4f26cf9d5a73464fa84a5c5ad9924439.png)

- 通过上述的截图中，我们默认打包的配置路径其实是识别`src/main/resources` 文件夹的

## 2. 如何修改配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/c79736a4eb19478fb4dabcc6ccbacc0b.png)

可以通过上述截图的位置来 对配置进行修改

![在这里插入图片描述](https://img-blog.csdnimg.cn/c08c2753107c4741955ad241d436f6c2.png)

- `application.yml`

```yml
server:
  servlet:
    context-path: /springboot01
```

- `application.properties`

```shell
server.port=8090
```

## 3. yml 配置文件格式要求

- 大小写敏感
- 使用缩进代表的层级关系
- 相同的部分只出现一次
- 注意空格

```yml
server:
  servlet:
    context-path: /springboot01
```

- 如果同一个目录下，有 application.yml 也有 application.properties，默认先读取 application.properties。
- 如果同一个配置属性，在多个配置文件都配置了，默认使用第 1 个读取到的，后面读取的不覆盖前面读取到的。

## 4. 文件存放位置以及优先级

- a 当前项目根目录下的一个/config 子目录中(最高)

  - config/application.properties
  - config/application.yml

- b 当前项目根目录中(其次)

  - application.properties
  - application.properties

- c 项目的 resources 即 classpath 根路径下的/config 目录中(一般)

  - resources/config/application.properties
  - resources/config/application.yml

- d 项目的 resources 即 classpath 根路径中(最后)

  - resources/application.properties
  - resources/application.yml
