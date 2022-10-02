<h1 align = "项目构建"></h1>

## 1. 配置方式 1

> 通过指定`parent` 来继承项目。同时添加一个启动器

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

- 设置启动类

```shell
/**
 * 启动类可以自动扫描，当前类所在包以及子包中所有的注解
 * 启动类的存放位置是跟controller包 同一级目录下
 */
@SpringBootApplication
public class Springboot01Application {
    public static void main(String[] args) {
        SpringApplication.run(Springboot01Application.class, args);
    }
}
```

- 通过上述的代码可以得知，其实启动类的定位位置很重要

## 2. 配置方式 2

> 在公司中可能会出现必须继承某个项目，如果 Spring Boot 用了继承就不能继承别的项目了。所以 Spring Boot 还提供了依赖的方式。

```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.4.5</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.4.5</version>
        </dependency>
    </dependencies>
```
