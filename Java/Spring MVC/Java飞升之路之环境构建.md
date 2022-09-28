<h1 align = "center">环境构建</h1>

## 1. Spring MVC

![在这里插入图片描述](https://img-blog.csdnimg.cn/722c52b9be384299b1eb83b694ae9e3f.png)

- SpringMVC 是 spring 为展现层提供的基于 MVC 设计理念的优秀 WEB 框架,是目前最主流的 MVC 框架之一
- SpringMVC 通过一套注解,可以让普通的 JAVA 类成为 contrllor 控制器,无需继承 Servlet,实现了控制层和 Servlet 之间的解耦
- SpringMVC 支持 Rest 风格的 URL 写法
- SpringMVC 采用了松耦合,可热插的主键结构,比其他的框架更具扩展性和灵活性

## 2. 大体项目结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/bbc5258a22e345cead2dfb3fd5a96047.png)

- `web.xml` 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--配置DispatcherServlet -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>

        <!--配置初始化参数,读取springMVC的核心配置文件的位置和名称-->
        <!--
        当然,不使用initparam,springMVC会到一个默认路径下读取默认名称的.xml配置文件
        默认路径为/WEB-INF/
        默认配置文件名为:<servlet-name>-servlet.xml
        我们暂时不推荐这种方式
        -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:applicationContext.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <!--配置dispatcherServlet的映射路径为 / 包含全部的servlet,  JSP除外-->
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

- `applicationContext.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <!-- 扫描spring包配置   -->
    <context:component-scan base-package="com.lihh"/>
    <!--  配置视图解析器  -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/view/"  ></property>
        <property name="suffix" value=".jsp"  ></property>
    </bean>
</beans>
```
