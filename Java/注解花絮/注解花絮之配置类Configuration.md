<h1 align = "center">Configuration</h1>

> - Java 中万事万物皆对象。 简而言之就是什么东西都可以用
> - Spring 中有两类配置文件。一类是 xml 配置文件，另一个类是 class 配置文件。
> - 今天的目的就是讲解下注解`@Configuration`

## 1. 定义

- `@Configuration`用来定义配置类的，可以代替 xml 配置文件。
- 被注解的类内部包含有一个或多个被@Bean 注解的方法，这些方法将会被 `AnnotationConfigApplicationContext` 或 `AnnotationConfigWebApplicationContext` 类进行扫描，并用于构建 bean 定义，初始化 Spring 容器

## 2. `@Configuration`加载测试

- 使用`@Configuration`

```shell
@Configuration
public class TestConfiguration {
    public TestConfiguration() {
        System.out.println("测试配置文件");
    }
}
```

- xml 配置方式

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="testConfiguration" class="com.lihh.TestConfiguration01" />
</beans>
```

- 测试

```shell
public class Test_01 {

    @Test
    public void test01() {

        // 使用注解来加载配置文件
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(TestConfiguration.class);
    }

    @Test
    public void test02() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("application.xml");
    }
}
```

## 3. `@Configuration`以及`@Bean`联合使用

- 配置类
  - 可以直接使用`@Bean`注解，但是 id 就是首字母小写

```shell
@Configuration
public class TestConfiguration02 {

    @Bean(value = "testBean", initMethod = "start", destroyMethod = "clean")
    public TestBean testBean() {
        return new TestBean();
    }
}
```

- 测试类

```shell
public class Test_02 {
    @Test
    public void run() {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(TestConfiguration02.class);
        TestBean testBean = (TestBean) applicationContext.getBean("testBean");
        testBean.say();
    }
}
```

> - 如果是`@Configuration` 以及`@Bean` 配置使用的话
> - 可以将`@Configuration`理解为`beans`. 将`@Bean`理解为 bean

## 4. `@Configuration` 以及`@Component`配合使用

- 使用`@Component`

```shell
@Component
public class TestComponent {
    public void say() {
        System.out.println("testComponent say");
    }

    public void hello() {
        System.out.println("testComponent hello");
    }
}
```

- 配置类

```shell
@Configuration
@ComponentScan(basePackages = "com.lihh")
public class TestConfiguration03 {

}
```

- 测试类

```shell
public class Test_03 {
    @Test
    public void run() {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(TestConfiguration03.class);
        TestComponent testComponent = (TestComponent) applicationContext.getBean("testComponent");
        testComponent.say();
        testComponent.hello();
    }
}
```

## 5. 总结 1

- 注解`@Configuration` 用来表示配置类。在项目启动的时候会被扫描
- 注解`@Bean` 以及注解`@Component` 都用来表示容器实例化的。
  - 注解`@Bean` 用来表述配置类中的方法的。会随着一起扫描到容器中进行初期化
  - 注解`@Component` 用来描述类的。将类实例化到 Spring 容器中，只不过需要通过 xml 或是 `@ComponentScan` 来指定扫描地址。才能扫描成功
- @Configuation 等价于`<Beans></Beans>`
- @Bean 等价于`<Bean></Bean>`
- @ComponentScan 等价于`<context:component-scan base-package="com.ahies.ija.management"/>`

## 6. 多个配置文件搭配

### 6.1 `@ImportResource` 注解使用

- 配置类

```shell
@Configuration
@ImportResource(value = "classpath:application-context.xml")
public class WebConfig {
}
```

- 配置文档

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="testBean01" class="com.lihh.TestBean01" />
</beans>
```

> - 可以通过注解`@ImportResource` 来加载编译后的 xml 文件

### 6.2 `@import`注解使用

- `@Configuration`以及`@Bean`使用

```shell
@Configuration
public class TestConfiguration04 {
    @Bean(value = "testBean02")
    public TestBean02 get() {
        return new TestBean02();
    }
}
```

- 测试

```shell
public class Test_05 {

    @Test
    public void run() {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(WebConfig01.class);
        TestBean02 testBean02 = (TestBean02) applicationContext.getBean("testBean02");
        testBean02.say();
    }
}
```

> 以上的代码示例来自[java-learn-configuration](https://github.com/a572251465/Java-learn/tree/main/Configuration01)
