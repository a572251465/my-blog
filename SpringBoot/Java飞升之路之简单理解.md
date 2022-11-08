<h1 align = "center">简单理解</h1>

## 1. Spring 优缺点分析

### 优点

- Spring 是 Java 企业版（Java Enterprise Edition，JEE，也称 J2EE）的轻量级代替品。无需开发重量级的 Enterprise JavaBean（EJB），Spring 为企业级 Java 开发提供了一种相对简单的方法，通过依赖注入和面向切面编程，用简单 的 Java 对象（Plain Old Java Object，POJO）实现了 EJB 的功能
- Spring 提供了最基本的方法原理
  - 控制反转 IOC
  - 依赖注入 DI
  - 面向切面 AOP

### 缺点：

- 虽然 Spring 的组件代码是轻量级的，但它的配置却是重量级的。
- 虽然 Spring 从开发阶段来说的话，是一个轻量级的应用。但是过多的 xml 配置使其配置方面变成重量级的

## 2. SpringBoot 概念简介

- Spring Boot 是 Spring 公司的一个顶级项目，和 Spring Framework 是一个级别的。
- Spring Boot 实际上是利用 Spring Framework 4 自动配置特性完成。编写项目时不需要编写 xml 文件。发展到现在，Spring Boot 已经具有很很大的生态圈，各种主流技术已经都提供了 Spring Boot 的启动器。

## 3. 什么是启动器

- Spring 框架在项目中作用是 Spring 整合各种其他技术，让其他技术使用更加方便。Spring Boot 的启动器实际上就是一个依赖。这个依赖中包含了整个这个技术的相关 jar 包，还包含了这个技术的自动配置，以前绝大多数 XML 配置都不需要配置了。当然了，启动器中自动配置无法实现所有内容的自动配置，在使用 Spring Boot 时还需要进行少量的配置
- Spring 启动器 其实就是相关技术的依赖总和。目的就是把零散的依赖统一管理

## 4. Spring Boot 优点

- 使用 Spring Boot 可以创建独立的 Spring 应用程序
- 在 Spring Boot 中直接嵌入了 Tomcat、Jetty、Undertow 等 Web 容器，在使用 SpringBoot 做 Web 开发时不需要部署 WAR 文件
- 通过提供自己的启动器(Starter)依赖，简化项目构建配置
- 尽量的自动配置 Spring 和第三方库
- 尽量的自动配置 Spring 和第三方库
