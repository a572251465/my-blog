<h1 align = "center">Nacos配置中心</h1>

> - Nacos 不仅是注册中心同时也是配置中心。今天主要讲解下如何配置的
> - 可以将配置中心理解为`动态yml`

## 1. 配置项目

### 1.1 配置 xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.12.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>AlibabaCloudConfig01</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>AlibabaCloudConfig01</name>
    <description>AlibabaCloudConfig01</description>
    <properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>Hoxton.SR12</spring-cloud.version>
        <spring-cloud-alibaba.version>2.2.9.RELEASE</spring-cloud-alibaba.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!--	nacos 服务注册发现	-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
            <version>2.2.9.RELEASE</version>
            <exclusions>
                <!--将ribbon排除-->
                <exclusion>
                    <groupId>org.springframework.cloud</groupId>
                    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!-- 添加loadbalanncer依赖, 添加spring-cloud的依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
            <version>2.2.9.RELEASE</version>
        </dependency>
        <dependency>
            <groupId> com.alibaba.cloud </groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
            <version>2.2.9.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 包`spring-cloud-starter-loadbalancer` 是表示负载均衡的包，此处不进行安装也是可以的
- 包`spring-cloud-starter-alibaba-nacos-config` 表示配置文件的包

### 1.2 配置 yml 文件

> 在配置文件中配置文件`bootstrap.yml` 的优先级比 `application.yml` 更高

- bootstrap.yml

```xml
server:
  port: 9000

# 服务名称
spring:
  application:
    name: nacos-config-client

  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848 # 注册地址
      config:
        file-extension: yaml
        server-addr: 127.0.0.1:8848 # 配置地址
```

> 主要是配置注册地址 以及配置地址

- application.yml

```xml
spring:
  profiles:
    active: dev # 表示开发环境
```

- 启动类

```shell
package com.example.alibabacloudconfig01;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AlibabaCloudConfig01Application {

    public static void main(String[] args) {
        SpringApplication.run(AlibabaCloudConfig01Application.class, args);
    }

}
```

- 使用配置文件的地方

```shell
package com.example.alibabacloudconfig01.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class DemoController {

    @Value("${server.port}")
    private String serverPort;

    @Value("${config.info}")
    private String configInfo;

    @GetMapping(value = "/visit")
    public String visit() {
        return "hello server: " + serverPort + "-" + configInfo;
    }
}
```

- `@RefreshScope` 注解表示动态刷新 yml。 能够实时获取配置中心的数据

## 2. 配置中心详解

​ 在 Nacos Spring Cloud 中，`dataId` 的完整格式如下（详情可以参考官网 https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html）：

```java
${prefix}-${spring.profiles.active}.${file-extension}
```

    1. `prefix` 默认为 `spring.application.name` 的值，也可以通过配置项 `spring.cloud.nacos.config.prefix`来配置。
    2. `spring.profiles.active` 即为当前环境对应的 profile，注意：**当 `spring.profiles.active` 为空时，对应的连接符 `-` 也将不存在，dataId 的拼接格式变成 `${prefix}.${file-extension}`**（不能删除）
    3. `file-exetension` 为配置内容的数据格式，可以通过配置项 `spring.cloud.nacos.config.file-extension` 来配置。目前只支持 `properties` 和 `yaml` 类型。
    4. 通过 Spring Cloud 原生注解 `@RefreshScope` 实现配置自动更新：
    5. 所以根据官方给出的规则我们最终需要在Nacos配置中心添加的配置文件的名字规则和名字为：

```java
# ${spring.application.name}-${spring.profiles.active}.${file-extension}
# nacos-config-client-dev.yaml
# 微服务名称-当前环境-文件格式
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c38c08f076994b14a5103dcbf7674471.png)

## 3. 参考地址

[实例代码地址](https://github.com/a572251465/Java-study-next/tree/main/AlibabaCloudConfig01)
