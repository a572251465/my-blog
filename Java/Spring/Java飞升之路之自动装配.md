<h1>自动装配</h1>

> 可以通过自动转配,完成属性的自动注入,就是自动装配,可以简化 DI 的配置

## 示例代码

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="girl" class="com.lihh.spring.bean.Girl">
        <property name="sex" value="true"/>
    </bean>

    <bean id="user" class="com.lihh.spring.bean.User1" autowire="byName" />
</beans>
```

```shell
public class AutoTest {
    @Test
    public void test() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext6.xml");
        User1 user1 = applicationContext.getBean("user", User1.class);
        System.out.println(user1);
    }
}
```

- 通过上述实例得知，我们可以通过属性`autowire`来进行自动装配
  - `byName` 根据目标 id 以及属性值注入，要保证当前对象的属性值以及目标对象的 id 保持一致
  - `byType` 根据类型进行注入，要保证相同的类型的目标对象在容器中只有一个实例
