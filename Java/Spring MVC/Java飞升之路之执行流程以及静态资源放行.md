<h1 align = "center">Spring MVC 执行流程</h1>

## 1. 执行流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/733ca87b075d47e8af308e6cdd579e74.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/d24981267e954a4586109736f0ced151.png)

- DispatcherServlet：前端控制器

  > 用户请求到达前端控制器，它就相当于 mvc 模式中的 c，dispatcherServlet 是整个流程控制的中心，由 它调用其它组件处理用户的请求，dispatcherServlet 的存在降低了组件之间的耦合性

- HandlerMapping：处理器映射器

  > 请求找到 Handler 即处理器，SpringMVC 提供了不同的映射器实现不同的 映射方式，例如：配置文件方式，实现接口方式，注解方式等。
  > 主要是管理`requestMapping`中 url 以及具体函数

- HandlAdapter：处理器适配器

  > 通过 HandlerAdapter 对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理器进行执行

- View Resolver：视图解析器

  > View Resolver 负责将处理结果生成 View 视图，View Resolver 首先根据逻辑视图名解析成物理视图名 即具体的页面地址，再生成 View 视图对象，最后对 View 进行渲染将处理结果通过页面展示给用户。

- <mvc:annotation-driven>说明

  > 在 SpringMVC 的各个组件中，处理器映射器、处理器适配器、视图解析器称为 SpringMVC 的三大组件。
  > 使 用 <mvc:annotation-driven> 自动加载 RequestMappingHandlerMapping （处理映射器） 和 RequestMappingHandlerAdapter （ 处 理 适 配 器 ） ， 可 用 在 SpringMVC.xml 配 置 文 件 中 使 用 <mvc:annotation-driven>替代注解处理器和适配器的配置。

  ### 1.1 关于三大组件配置

  ```xml
  <!--配置spring包扫描-->
    <context:component-scan base-package="com.msb"></context:component-scan>

    <!--配置处理器映射器-->
    <!-- <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"></bean>-->
    <!--配置处理器适配器-->
    <!-- <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter"></bean>-->
    <!--一个注解替换上面的两个配置-->
    <!--<mvc:annotation-driven>会自动注册RequestMappingHandlerMapping与RequestMappingHandlerAdapter两个Bean-->
    <mvc:annotation-driven/>
    <!--配置视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/view/"  ></property>
        <property name="suffix" value=".jsp"  ></property>
    </bean>
  ```

  - 以上的含义其实就是通过 mvc 空间的一句话可以完成自动配置 处理器映射器/ 处理器适配器/ 视图解析器的配置

## 2. 静态资源放行

- 页面中访问一些静态资源

```html
<html>
  <head>
    <title>Title</title>
    <link rel="stylesheet" type="text/css" href="../../static/css/common.css" />
    <script
      type="application/javascript"
      src="../../static/js/common.js"
    ></script>
  </head>
  <body>
    <h1>this is my.jsp</h1>
    <img src="../../static/images/img.png" alt="" />
  </body>
</html>
```

- 以上静态页面如果想访问到静态资源，需要添加映射。如下

```xml
<!-- 设置静态资源放行   -->
    <mvc:resources mapping="/static/**" location="/static/" />
```
