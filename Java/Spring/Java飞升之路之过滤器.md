<h1 align = "center">过滤器</h1>

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/6702b2465a3b4cb6882cc32cd6886a5a.png)

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/7cdeebb15f7743c781632a5466d19b95.png#pic_center)

> - Filter 也称之为过滤器，它是 Servlet 技术中最实用的技术，Web 开发人员通过 Filter 技术，对 web 服务器管理的所有 web 资源：例如 Jsp, Servlet, 静态图片文件或静态 html 文件等进行拦截，从而实现一些特殊的功能。例如实现 URL 级别的权限访问控制、过滤敏感词汇、压缩响应信息等一些高级功能 处理编码。
> - 它主要用于对用户请求进行预处理，也可以对 HttpServletResponse 进行后处理。使用 Filter 的完整流程：Filter 对用户请求进行预处理，接着将请求交给 Servlet 进行处理并生成响应，最后 Filter 再对服务器响应进行后处理。

## 1. 如何实现过滤(文字版)

- 在 HttpServletRequest 到达 Servlet 之前，拦截客户的 HttpServletRequest 。根据需要检查 HttpServletRequest，也可以修改 HttpServletRequest 头和数据。
- 在 HttpServletResponse 到达客户端之前，拦截 HttpServletResponse 。根据需要检查 HttpServletResponse，也可以修改 HttpServletResponse 头和数据。
- Filter 接口中有一个 doFilter 方法，当开发人员编写好 Filter，并配置对哪个 web 资源进行拦截后，Web 服务器每次在调用 web 资源的 service 方法之前，都会先调用一下 filter 的 doFilter 方法，doFilter 方法中有一个 filterChain 对象,用于继续传递给下一个 filter,在传递之前我们可以定义过滤请求的功能,在传递之后,我们可以定义过滤响应的功能

## 2. 配置方式 1

> 通过 web.xml 进行配置

- 配置 xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>myServlet</servlet-name>
        <servlet-class>com.lihh.controller.MyServlet</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>myServlet</servlet-name>
        <url-pattern>/myServlet.do</url-pattern>
    </servlet-mapping>

    <filter>
        <filter-name>myFilter</filter-name>
        <filter-class>com.lihh.filter.MyFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>myFilter</filter-name>
        <servlet-name>myServlet</servlet-name>
    </filter-mapping>
</web-app>
```

- 定义 Filter 类
  - 主要是实现接口`Filter`
  - 接口中实现方法`init`/ `doFilter`/ `destroy`

```shell
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("myFilter request");

        filterChain.doFilter(servletRequest, servletResponse);
        servletResponse.setCharacterEncoding("utf-8");

        System.out.println("myFiler response");
        servletResponse.getWriter().print("filter response 添加一些数据");
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
```

## 3. 过滤器的生命周期

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe39ac76c6874012a21054e63012bba4.png#pic_center)

### 3.1 构造方法

- 实例化一个 Filter 对象的方法

### 3.2 初始化方法

- `public void init(FilterConfig filterConfig);`
- 和我们编写的 Servlet 程序一样，Filter 的创建和销毁由 WEB 服务器负责。 web 应用程序启动时，web 服务器将创建 Filter 的实例对象，并调用其 init 方法，读取 web.xml 配置，完成对象的初始化功能，从而为后续的用户请求作好拦截的准备工作（filter 对象只会创建一次，init 方法也只会执行一次）。开发人员通过 init 方法的参数，可获得代表当前 filter 配置信息的 FilterConfig 对象。

### 3.3 拦截请求方法

- `public void doFilter`
- 这个方法完成实际的过滤操作。当客户请求访问与过滤器关联的 URL 的时候，Servlet 过滤器将先执行 doFilter 方法。FilterChain 参数用于访问后续过滤器。

### 3.4 销毁过程

- `public void destroy();`
- Filter 对象创建后会驻留在内存，当 web 应用移除或服务器停止时才销毁。在 Web 容器卸载 Filter 对象之前被调用。该方法在 Filter 的生命周期中仅执行一次。在这个方法中，可以释放过滤器使用的资源。

```shell
public class MyFilter implements Filter {
    public MyFilter(){
        System.out.println("MyFilter constructor invoked");
    }
    // 初始化方法
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("MyFilter init invoked");
    }
    // 作出过滤的方法
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("Filter doFilter 对请求作出过滤");
        // 通过一行代码 放行请求
        // 放行请求,交给过滤器链继续进行过滤 最后到达资源
        filterChain.doFilter(servletRequest, servletResponse);
        System.out.println("Filter doFilter 对响应作出过滤");
        servletResponse.getWriter().print("filter 追加一些数据");
    }
    // 销毁方法
    @Override
    public void destroy() {
        System.out.println("MyFilter destory invoked");
    }
}
```

## 4. 过滤器链

> 在一个 web 应用中，可以开发编写多个 Filter，这些 Filter 组合起来称之为一个 Filter 链。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ad78a05b78b49dca3ee3d7befa42fcd.png)

- web 服务器根据 Filter 在 web.xml 文件中的注册顺序，决定先调用哪个 Filter，当第一个 Filter 的 doFilter 方法被调用时，web 服务器会创建一个代表 Filter 链的 FilterChain 对象传递给该方法。在 doFilter 方法中，开发人员如果调用了 FilterChain 对象的 doFilter 方法，则 web 服务器会检查 FilterChain 对象中是否还有 filter，如果有，则调用第 2 个 filter，如果没有，则调用目标资源。
- 使用过滤器链的好处是我们可以将不同的过滤功能分散到多个过滤器中,分工明确,避免一个过滤器做太多的业务处理,降低了代码的耦合度,这体现了单一职责的设计原则,应用了责任链的代码设计模式.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <filter>
        <filter-name>filter1</filter-name>
        <filter-class>com.msb.filter.MyFilter1</filter-class>

    </filter>
    <filter>
        <filter-name>filter2</filter-name>
        <filter-class>com.msb.filter.MyFilter2</filter-class>
    </filter>
    <!--这里的顺序决定了过滤器的顺序-->
    <filter-mapping>
        <filter-name>filter2</filter-name>
        <url-pattern>/myServlet1.do</url-pattern>
    </filter-mapping>
    <filter-mapping>
        <filter-name>filter1</filter-name>
        <url-pattern>/myServlet1.do</url-pattern>
    </filter-mapping>
</web-app>
```

## 5. 初始化参数

> 同 servlet 一样,filter 也可以通过 web.xml 进行初始化配置,在初始化时,将参数封装进入 FilterConfig 并在调用 init 方法时作为实参传入,我们可以在 init 方法中获取参数.FilterConfig 接口为我们提供了如下功能

- `String getFilterName();` 得到 filter 的名称。
- `String getInitParameter(String name);` 返回定名称的初始化参数的值。如果不存在返回 null.
- `Enumeration getInitParameterNames();` 返回过滤器的所有初始化参数的名字的枚举集合。
- `public ServletContext getServletContext();` 返回 Servlet 上下文对象的引用

### 5.1 示例

- 配置 Filter 初始化参数

```xml
<filter>
        <filter-name>filter1</filter-name>
        <filter-class>com.msb.filter.MyFilter1</filter-class>
        <init-param>
            <param-name>realname</param-name>
            <param-value>xiaoming</param-value>
        </init-param>
        <init-param>
            <param-name>gender</param-name>
            <param-value>boy</param-value>
        </init-param>
        <init-param>
            <param-name>age</param-name>
            <param-value>10</param-value>
        </init-param>
        <init-param>
            <param-name>charset</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
```

- 读取初始化参数

```shell
public class MyFilter1 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 获取初始化的一些参数
        String realname = filterConfig.getInitParameter("realname");
        System.out.println("realname:"+realname);
        Enumeration<String> pNames = filterConfig.getInitParameterNames();
        while(pNames.hasMoreElements()){
            String pName = pNames.nextElement();
            System.out.println(pName+":"+filterConfig.getInitParameter(pName));
        }
    }
```

## 6. 注解方式

> @WebFilter 属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/3cb4727a9002426cbca7b40ab24df010.png)

- 使用注解

```xml
@WebFilter(urlPatterns = "/myServlet1.do")
public class Filter0_MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("MyFilter0   在过滤请求 ");
        filterChain.doFilter(servletRequest,servletResponse);
        System.out.println("MyFilter0   在过滤响应");
    }
    @Override
    public void destroy() {
    }
}
```

```xml
@WebFilter(urlPatterns = "/myServlet1.do",initParams = {@WebInitParam(name="realname",value ="zhangsan"),@WebInitParam(name="charset",value ="utf-8")})
public class Filter1_MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 获取初始化的一些参数
        String realname = filterConfig.getInitParameter("realname");
        System.out.println("realname:"+realname);
        Enumeration<String> pNames = filterConfig.getInitParameterNames();
        while(pNames.hasMoreElements()){
            String pName = pNames.nextElement();
            System.out.println(pName+":"+filterConfig.getInitParameter(pName));
        }
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("MyFilter1   在过滤请求 ");
        filterChain.doFilter(servletRequest,servletResponse);
        System.out.println("MyFilter1   在过滤响应");
    }
    @Override
    public void destroy() {
    }
}
```

## 7. `SpringBoot` + `Filter`

- 配置类

```shell
@Component
@WebFilter(urlPatterns = "/*")
public class CorsFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        servletRequest.setCharacterEncoding("UTF-8");
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        httpServletResponse.addHeader("Access-Control-Allow-Origin", "*");
        httpServletResponse.addHeader("Access-Control-Allow-Methods", "*");
        httpServletResponse.addHeader("Access-Control-Allow-Headers", "*");

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
```

- 注解`@Component` 将类实例 注入到 spring 容器中
- 注解`@WebFilter` 设置过滤器拦截
