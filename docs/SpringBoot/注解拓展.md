<h1 align = "center">注解拓展</h1>

## 1. `@SpringBootApplication`

- 此注解表示应用启动注解
- 从标识此注解所在包以及子包中开始扫描相关的配置

```shell
/*
* 默认扫描启动类所在包下的所有层级的子包
* 可以通过scanBasePackages属性指定扫描路径
* SpringBootApplication是一个合成注解,可以拆分为以下三个注解
*   @SpringBootConfiguration
*   @EnableAutoConfiguration
*   @ComponentScan(basePackages = "com.msb")
*
*
* */
@SpringBootApplication
public class Springboot04Application {
    public static void main(String[] args) {
        //返回一个spring容器
        ConfigurableApplicationContext context = SpringApplication.run(Springboot04Application.class, args);
        // 查看所有组件的名
        String[] names = context.getBeanDefinitionNames();
        for (String name : names) {
            System.out.println(name);
        }
    }
}
```

## 2. `@Configuration`

- 标识配置类的注解

```shell
package com.msb.config;
import com.msb.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * @Author: Ma HaiYang
 * @Description: MircoMessage:Mark_7001
 * MyConfig配置类本身也是一个spring容器中的bean
 * proxyBeanMethods=true 属性,给MyConfig对象产生一个代理对象
 * 通过代理对象控制反复调用MyConfig里面的方法返回的是容器中的一个单实例
 * 如果proxyBeanMethods=false 那么我们拿到的MyConfig对象就不是一个代理对象
 * 那么这个时候反复调用MyConfig中的方法返回的就是多实例
 *
 * proxyBeanMethods=false 称之为Lite模式  特点启动快
 * proxyBeanMethods=true  称之为Full模式  特点依赖spring容器控制bean单例
 *
 */
@Configuration(proxyBeanMethods = true)
public class MyConfig {
    /*<bean id = "user1" class ="com.msb.pojo.User">... ...</bean>*/
    @Bean // 向容器中添加一个Bean,以方法名作为Bean的id,返回值类型作为组件的类型
    public User user1(){
        return new User("zhangsan", 10);
    }
    /*<bean id = "user2" class ="com.msb.pojo.User">... ...</bean>*/
    @Bean("user2") // 向容器中添加一个Bean,手动指定Bean的name属性,返回值类型作为组件的类型
    public User getUser(){
        return new User("lisi", 11);
    }
}
```

- MyConfig 配置类本身也是一个 spring 容器中的 bean
- proxyBeanMethods=true 属性,给 MyConfig 对象产生一个代理对象
- 通过代理对象控制反复调用 MyConfig 里面的方法返回的是容器中的一个单实例
- 如果 proxyBeanMethods=false 那么我们拿到的 MyConfig 对象就不是一个代理对象
- 那么这个时候反复调用 MyConfig 中的方法返回的就是多实例

## 3. `@Import`

- @Import({User.class}) 在容器中自动创建 Bean 的注解
- 通过传入字节码,默认调用 bean 的无参构造器,向容器中存放一个 Bean

```shell
package com.msb.config;
import com.msb.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
/*
* @Import({User.class}) 在容器中自动创建Bean的注解
* 通过传入字节码,默认调用bean的无参构造器,向容器中存放一个Bean
* 默认组件的名字就是类的全路径名
* @Import只要放到可以被扫描到的类之上就可以,不必非得是配置类或者Controller
* */
@Import({User.class})
@Configuration(proxyBeanMethods = true)
public class MyConfig {
}
```

```shell
@SpringBootApplication(scanBasePackages = "com.msb")
public class Springboot04Application {
    public static void main(String[] args) {
        //启动SpringBoot, 返回一个spring容器
        ConfigurableApplicationContext context = SpringApplication.run(Springboot04Application.class, args);
        // 根据类型获取Bean
        User bean = context.getBean(User.class);
        System.out.println(bean);
        // 获取属性User类的所有bean的name
        String[] beanNamesForType = context.getBeanNamesForType(User.class);
        for (String s : beanNamesForType) {
            System.out.println(s);
        }
    }
}
```

## 4. `@Conditional` 条件装配

- 满足 Conditional 指定的条件,则进行组件注入
- @Conditional 下还有很多子注解

![在这里插入图片描述](https://img-blog.csdnimg.cn/c249d34b9dd544e69bb079d295d1130f.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/78a376f2d1de4aa7823545a8f603aa3a.png)

## 5. `@ImportResource`

- 原生配置文件引入,允许我们自己定义 xml 配置文件,在文件中配置 bean
- resources 目录下准备一个 xml 配置文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/a68adacb039249a09b3f283c93c15394.png)

- 配置类中加载该配置文件

```shell
package com.msb.config;
import org.springframework.context.annotation.*;
@Configuration
@ImportResource("classpath:beans.xml")
public class MyConfig {
}
```

```xml
@SpringBootApplication
public class Springboot04Application {
    public static void main(String[] args) {
        //启动SpringBoot, 返回一个spring容器
        ConfigurableApplicationContext context = SpringApplication.run(Springboot04Application.class, args);
        System.out.println(context.getBean("userx"));
    }
}
```

## 6. `@ConfigurationProperties`

- 读取 application.properties 配置文件中的内容,读取进入 bean

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/c8a2e16c432744bc843aaa96ccf613ba.png)

### 6.1 配置方法 1

```shell
/*prefix前缀,为配置文件中对应的前缀
* 通过前缀找到对应的配置信息后,在根据属性名去注入匹配的数据*/
@ConfigurationProperties( prefix = "user")
@Component
public class User {
    private String uname;
    private int age;
}
```

### 6.2 配置方法 2

```shell
package com.msb.config;
import com.msb.pojo.User;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
/**
 * @Author: Ma HaiYang
 * @Description: MircoMessage:Mark_7001
 */
@Configuration
/*开启了User的属性自动配置功能并把User自动注册到容器中
* 这个时候,我们的User上就不用加@Component注解了
* 适用于Bean来自于第三方JAR场景
* */
@EnableConfigurationProperties(User.class)
public class MyConfig {
}
```
