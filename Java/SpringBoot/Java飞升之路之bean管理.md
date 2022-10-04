<h1 align = "center">bean 管理</h1>

> - Spring Boot 由于没有 XML 文件，所以所有的 Bean 管理都放入在一个配置类中实现。
> - Spring Boot 由于没有 XML 文件，所以所有的 Bean 管理都放入在一个配置类中实现。
> - 以下注解`@Configuration` 其实是配置类注解。其实是在 spring 扫描过程中告诉容器，此类是一个配置类文件

```shell
@Configuration
public class TestConfig {
}
```

## 1. 新建配置类

- 配置类要有@Configuration,方法要有@Bean

```shell
@Configuration
public class MyConfig {

    @Bean(value = "user")
    public User getUser() {
        return new User("lxx", 20);
    }
}
```

- 使用方式（测试类）

```shell
@SpringBootTest
class Sprinboot06ApplicationTests {

    @Autowired
    private User user;
    @Autowired
    private MyConfig myConfig;

    @Test
    void contextLoads() {
        System.out.println(user);
        System.out.println(myConfig.getUser());
    }

}
```

- 通过上述示例，类似注解`@Autowired` 其实都是为了解耦。
- 通过配置类简单的注解代码，代替了配置文件
