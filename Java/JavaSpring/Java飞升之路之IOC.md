<h1 align = "center">Spring学习</h1>

![在这里插入图片描述](https://img-blog.csdnimg.cn/f0557bc9c4ee43eb895fca9253bf2cdc.png#pic_center)

## 1. 目的

- IOC 的意思就是控制反转。将类中实例化的工作反转交给容器来做
- 减少了类与类之间的耦合性
- 便于扩展

## 2. 初步示例

### 2.1 实例化 bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <beans>
        <bean id="user" class="com.lihh.spring.bean.User" />
    </beans>
</beans>
```

```shell
public class UserTest {

    @Test
    public void userTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = applicationContext.getBean("user", User.class);
        System.out.println(user);
    }
}
```

- 上述只是在实例化 bean。但是其实实例化其余的类（例如：动作类）都是可以的
- 只是`底层都是用了，工厂模式 + 反射`的这种机制。来实现控制反转，避免过于耦合
