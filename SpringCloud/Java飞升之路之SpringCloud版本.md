<h1 align = "center">spring cloud 版本</h1>

> SpringCloud 生态提供了快速构建微服务的技术组件。
> [https://spring.io/projects/spring-cloud-netflix](https://spring.io/projects/spring-cloud-netflix)

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/1462/1637300624000/61c0ac761d8349a997d2f129d7dab0af.png)

## 1. 版本关键字

- SR (发行版)
- RC (后续发行版本)
- M1/M2（PRE） 里程碑
- GA 稳定版
- BUILD-XXX 开发版

## 2. 对应关系

> SpringCloud 和 SpringBoot 的关联关系

大版本对应：

| Spring Cloud               | Spring Boot                                      |
| -------------------------- | ------------------------------------------------ |
| Angel 版本                 | 兼容 Spring Boot 1.2.x                           |
| Brixton 版本               | 兼容 Spring Boot 1.3.x，也兼容 Spring Boot 1.4.x |
| Camden 版本                | 兼容 Spring Boot 1.4.x，也兼容 Spring Boot 1.5.x |
| Dalston 版本、Edgware 版本 | 兼容 Spring Boot 1.5.x，不兼容 Spring Boot 2.0.x |
| Finchley 版本              | 兼容 Spring Boot 2.0.x，不兼容 Spring Boot 1.5.x |
| Greenwich 版本             | 兼容 Spring Boot 2.1.x                           |
| Hoxtonl 版本               | 兼容 Spring Boot 2.2.x                           |

在实际开发过程中，我们需要更详细的版本对应：

| **Spring Boot**              | **Spring Cloud**        |
| ---------------------------- | ----------------------- |
| 1.5.2.RELEASE                | Dalston.RC1             |
| 1.5.9.RELEASE                | Edgware.RELEASE         |
| 2.0.2.RELEASE                | Finchley.BUILD-SNAPSHOT |
| 2.0.3.RELEASE                | Finchley.RELEASE        |
| 2.1.0.RELEASE-2.1.14.RELEASE | Greenwich.SR5           |
| 2.2.0.M4                     | Hoxton.SR4              |

SpringCloud 版本是和 SpringBoot 有关联关系的，官网中可以查看：[https://docs.spring.io/spring-cloud/docs/current/reference/html/](https://docs.spring.io/spring-cloud/docs/current/reference/html/)
