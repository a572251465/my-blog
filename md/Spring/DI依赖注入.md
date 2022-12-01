<h1 align= "center">DI依赖注入</h1>

## 1. 含义

> - DI Dependency Injection，即“依赖注入” 就是创建属性时给对象属性赋值
> - 对象功能的实现往往要依赖属性的值,那么给对象属性赋值就可以说成是依赖注入
> - 由于对象属性不仅仅是基本数据类型,还可能是其他类,或者引用类型
> - DI 处理的是对象的属性赋值和互相依赖的关系

## 2. 通过 XML 进行依赖注入

### 2.1 bean 标签中常用的属性

- `id` 对象的 id，在 xml 中不可重复
- `class` 表示类的全路径名称
- `name` 跟 id 的作用类似，一般不用
- `scope` 控制单例以及多例的使用范围
  - `singleton` 作用域(scope 默认值), Spring IOC 容器中只会存在一个共享的 bean 实例
  - `prototype` 作用域部署的 bean，每一次获取都会产生一个新的 bean 实例，相当与一个 new 的操作
  - `request` 表示该针对每一次 HTTP 请求都会产生一个新的 bean，同时该 bean 仅在当前 HTTP request 内有效
  - `session` 作用域表示该针对每一次 HTTP 请求都会产生一个新的 bean，同时该 bean 仅在当前 HTTP session 内有效
  - `global session` 作用域类似于标准的 HTTP Session 作用域，不过它仅仅在基于 portlet 的 web 应用中才有意义
- `lazy-init` 表示懒加载，在调用 getBean 的时候才会执行

### 2.2 DI 示例 1（调用有参构造函数）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <beans>
        <bean id="user" class="com.lihh.spring.bean.User">
            <constructor-arg name="name" value="lxx"/>
            <constructor-arg name="age" value="22"/>
        </bean>
    </beans>
</beans>
```

```shell
public class UserTest1 {

    @Test
    public void userTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext1.xml");
        User user = applicationContext.getBean("user", User.class);
        System.out.println(user);
    }
}
```

- 通过上述示例中，其实在 bean 中添加属性`property`，表示执行的是有参构造方法

### 2.2 DI 示例 2（通过 set 方法进行赋值）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <beans>
        <bean id="user1" class="com.lihh.spring.bean.User">
            <property name="name" value="lxx1"/>
        </bean>
    </beans>
</beans>
```

```shell
public class UserTest1 {

    @Test
    public void userTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext1.xml");
        User user1 = applicationContext.getBean("user1", User.class);
        System.out.println(user1);
    }
}
```

- 上述示例中，其实在 getBean 的时候执行了空构造方法，只不过通过 DI 的方式进行属性值注入

### 2.3 DI 示例 3（通过 set 方法设置别的对象）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="girl" class="com.lihh.spring.bean.Girl" />

    <bean id="user1" class="com.lihh.spring.bean.User1">
        <constructor-arg name="girl" ref="girl"/>
    </bean>
</beans>
```

```shell
public class UserTest2 {

    @Test
    public void test() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext2.xml");
        User1 user1 = applicationContext.getBean("user1", User1.class);

        System.out.println(user1);
    }
}
```

- 通过上述的实例可以得知，如果是示例中引用了示例，必须使用属性`ref`来做处理

### 2.4 DI 示例 4（通过 c 空间来设置值）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:c = "http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="com.lihh.spring.bean.User" c:name="lxx_c" c:age="20"/>
</beans>
```

```shell
public class UserTest3 {
    @Test
    public void test() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext3.xml");
        User user = applicationContext.getBean("user", User.class);
        System.out.println(user);
    }
```

- 通过上述示例可以得知，其实我们添加了代码`xmlns:c = "http://www.springframework.org/schema/c"`.
- 如果是使用 p 命名空间的话，同样是如此添加的，将其中的`c`修改`p`就可以了

### 2.5 DI 示例 5（使用工厂函数来设置值）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="book" class="com.lihh.spring.bean.BookFactory"/>
</beans>
```

```shell
public class BookFactory implements FactoryBean<Book> {
    @Override
    public Book getObject() throws Exception {
        Book book = new Book();
        book.setName("十万个为什么");
        book.setAuthor("lihh");
        return book;
    }

    @Override
    public Class<?> getObjectType() {
        return null;
    }
}
```

```shell
public class BookTest {
    @Test
    public void test() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext4.xml");
        Book book = applicationContext.getBean("book", Book.class);
        System.out.println(book);
    }
}
```

- 从上述示例可以看到，其实工厂函数实现了接口`FactoryBean`.
- 而从重写了方法`getObject` 以及方法`getObjectType`
- 只要是方法`getObject` 来返回自己想要的对象
