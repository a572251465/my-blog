<h1 align = "center">整合MyBatis</h1>

## 1. 导入依赖

```xml
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.3</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.21</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.12</version>
            <scope>provided</scope>
        </dependency>
```

- `mybatis`官方提供的加载器
- mysql 驱动
- lombok 非必需品

## 2. 添加配置文件

- jdbc 相关的数据
- mybatis 映射关系

```yml
mybatis:
  mapper-locations: classpath:mybatis/*.xml
  type-aliases-package: com.lihh.bean

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/local?useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: root
```

- 属性`mapper-locations` 表示 Mapper 的映射 xml
- 属性`type-aliases-package` 表示返回的 bean 包

## 3. 代码编写

- 启动类

```shell
@SpringBootApplication
public class Springboot01Application {
    public static void main(String[] args) {
        SpringApplication.run(Springboot01Application.class, args);
    }
}
```

- Mapper 定义

  - 下列代码有必要添加注释`@Mapper`

```shell
@Mapper
public interface UserMapper {
    int getCount();
}
```

- Mapper xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://www.mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lihh.bean.User">

</mapper>
```
