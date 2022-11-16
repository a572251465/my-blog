<h1 align =  "center">拦截器</h1>

> 拦截器的编写过程

## 1. 新建拦截器类

```shell
@Component
public class DemoInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("执行拦截器 -- pre");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("执行拦截器 -- post");
    }
}
```

- 新建一个类 来实现接口`HandlerInterceptor` . 同时进行`pre` 以及`post`相关拦截
- 因为需要实例，所以需要被注解`@Component` 所修饰

## 2. 配置拦截器

```shell
@Configuration
public class MyConfig implements WebMvcConfigurer {
    @Autowired
    private DemoInterceptor demoInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(demoInterceptor).addPathPatterns("/**").excludePathPatterns("/login");
    }
}
```

- 只有被注解`@Configuration` 标识后，才会被 Spring 容器所扫描
- 实现接口`WebMvcConfigurer`
- `registry.addInterceptor(demoInterceptor)` 注册拦截器
