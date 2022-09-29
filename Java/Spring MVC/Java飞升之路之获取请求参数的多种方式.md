<h1 align = "center">获取请求参数的多种方式</h1>

> - 紧耦合方式(了解)
>   - DispatcherServlet 中的 service 方法直接将此次请求的 request 对象传递给调用的单元方法即可。同时在单元方法上声明形参 HttpServletRequest 来接收 request 实参即可。
> - 解耦合方式(熟练)
>   - DispatcherServlet 在其 service 方法中将请求数据根据需求从 request 对象中获取出来后，将数据直接传递给对应的单元方法使用。同时在单元方法上直接声明对应的形参接收请求数据即可。在单元方法上声明形参来接收请求数据时，形参名必须和请求数据的键名一致，DispatcherServlet 会将调用单元方法的形参名作为请求数据的键名获取请求数据，然后传递给单元方法

## 1. 传统方式以及新的方式

```shell
@Controller
public class ParamsController {

    /*紧耦合方式参数注入
     * 使用传统的HttpServletRequest对象获取参数  javax.servlet
     * */
    @RequestMapping(value = "getParam1")
    public String getParam1(HttpServletRequest req, HttpServletResponse res) {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        return "my";
    }

    /*解耦合方式参数注入
     * HttpServletRequest对象获取参数 通过SpringMVC框架功能,自动转换参数
     * 处理单元参数列表中参数名必须和请求中的参数名一致
     * 如不一致,可以通过@RequestParam注解进行转换
     * */
    @RequestMapping(value = "getParam2")
    public String getParam2(String username, @RequestParam("pwd") String password) {
        return "my";
    }
}
```

- 通过上述的示例中，传统的获取参数的方式就是通过`HttpServletRequest`来获取字段
- 但是新的方式其实是在框架层面通过反射机制，将传递的参数跟函数参数名称对应起来进行一一传递值。
- 如果出现值不同的情况，可以注解`@RequestParam`来映射

## 2.接受实体类参数

```shell
@Controller
public class ParamsController {
    /**
     * 可以接受一个实体类，但是传递每个字段都必须跟实体类中每个字段名字有所映射
     */
    @RequestMapping(value = "getParam3")
    public String getParams3(User user) {
        return "my";
    }
}
```

- 如果是传递多个参数可以定义 bean 来进行参数接受。
- 从框架底层层面也会做对应的映射
