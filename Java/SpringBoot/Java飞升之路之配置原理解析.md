<h1 align = "center">配置原理分析</h1>

## 1. xml 分析

```xml
    <!--继承父项目方式-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.5</version>
    </parent>

<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.7.4</version>
        </dependency>
</dependencies>
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ddeeff4fc6564e9c8a87305174287548.png)

- 标识`spring-boot-starter-parent` 依赖于`spring-boot-dependencies`
- 如果依赖中没有写版本，会寻找上述截图中的版本控制，可以称之为版本管理中心
- 启动器`spring-boot-starter-web` 集合了 web 项目需要的依赖

## 2. 自动配置分析

- `@SpringBootApplication` SpringBoot 启动配置项

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/5d33a18cb73a472baf625169230cdf04.png)

  - `@SpringBootConfiguration`

    - ![在这里插入图片描述](https://img-blog.csdnimg.cn/9f48e86b45e848bd9747852d71c88e5b.png)

    - 注解`SpringBootConfiguration` 被注解`@Configuration` 所修饰。说明是一个配置类注解

  - `@EnableAutoConfiguration` 此注解表示启用自动配置

    - ![在这里插入图片描述](https://img-blog.csdnimg.cn/17e751e7877d4b098eab1c6c7f6d261e.png)

    - `@AutoConfigurationPackage`

      - ![在这里插入图片描述](https://img-blog.csdnimg.cn/798148fdbf43491ab1513f14a7b84d1e.png)

      - ![在这里插入图片描述](https://img-blog.csdnimg.cn/14943b77ca5d4681bc93cbd61aa51e05.png)

      - 通过上述截图中可以看出，自动扫描的位置从注解`@SpringBootApplication` 所在包以及子包开始

    - `@Import(AutoConfigurationImportSelector.class)`

      - ![在这里插入图片描述](https://img-blog.csdnimg.cn/fc13f2030a2f4e09b7cb1bc93b88dd8d.png)

      - 难道 SpringBoot 就不需要编写依赖了吗？？？不是。而且已经配置依赖了，需要通过代码进行加载
