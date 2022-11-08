<h1 align = "center">jdbc 模板</h1>

> - JdbcTemplate 是 spring 框架中提供的一个对象，是对原始繁琐的 Jdbc API 对象的简单封装。spring 框架为我们提供了很多的操作模板类
> - 操作关系型数据的 JdbcTemplate 和，操作 nosql 数据库的 RedisTemplate，操作消息队列的 JmsTemplate 等等

## 1. 目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/8c9e4b5a75bc4bc2b6583e0ed81bc3df.png)

## 2. 配置启动 xml

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:content = "http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
">
    <!--  spring扫描   -->
    <content:component-scan base-package="com.lihh" />
    <!--  读取jdbc配置   -->
    <content:property-placeholder location="classpath:JDBC.properties" />

    <!--  配置德鲁依连接池   -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="${jdbc_username}"/>
        <property name="password" value="${jdbc_password}"/>
        <property name="url" value="${jdbc_url}"/>
        <property name="driverClassName" value="${jdbc_driver}"/>
    </bean>

    <!--配置JDBCTemplate对象,并向里面注入DataSource-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <!--通过set方法注入连接池-->
        <property name="dataSource" ref="dataSource"/>
    </bean>
</beans>
```

## 3. 代码参照实例

[spring-jdbc-template](https://github.com/a572251465/Java-learn/tree/main/spring-jdbc-template01)
