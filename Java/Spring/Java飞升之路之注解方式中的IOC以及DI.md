<h1 align = "center">注解方式中的IOC以及DI</h1>

## 1. 注解的方式创建对象 IOC

- `@Component` 放在类上,用于标记,告诉 spring 当前类需要由容器实例化 bean 并放入容器中。该注解有三个子注解
  - `@Controller` 用于实例化 controller 层 bean
  - `@Service` 用于实例化 Service 层 bean
  - `@Repository` 用于实例化持久层 bean
- 其实以上三种子集混用也是可以的。但是还是可以建议按照业务来划分

### 1.1 代码示例（通过 Component 来完成）

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <!--添加注解扫描,扫描指定的包,将包中的所有有注解的类实例化
    base-package 后面放要扫描的包
    如果有多个包需要扫描,可以使用逗号隔开  com.msb.bean,com.msb.service
    或者可以写上一层包路径  com.msb
    可以通过注解指定bean的id@Component("user1")
    如果不指定,则id默认是 类名首字母小写
    -->
    <context:component-scan base-package="com.lihh.spring"/>
</beans>
```

```shell
@Component(value = "user1")
public class User {
    private String name;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```shell
public class UserTest {
    @Test
    public void test() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = applicationContext.getBean("user1", User.class);
        System.out.println(user);
    }
}
```

- 通过上述的示例得知，我们可以通过注解`@Component`，来告诉 Spring 将此类添加到容器中，并通过参数来设置实例在容器中的 id
- 需要在`*.xml`中配置扫描。添加注解扫描，扫描指定的包，将包中的所有有注解的类实例化
- base-package 后面放要扫描的包如果有多个包需要扫描,可以使逗号隔开 com.lhh.bean,com.lihh.service 或者可以写上一层包路径 com.lihh 可以通过注解指定 bean 的 id@Component("user1")如果不指定,则 id 默认是 类名首字母小写

### 1.2 代码示例（指定扫描的包）

-

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <!--
    use-default-filters="false"
    默认值为true 代表使用默认的扫描过滤器
    默认的扫描过滤器会识别并包含 @Component @Controller @Service @Repository 四个注解
    不使用默认的filter,使用我们自己的filter
    -->
    <context:component-scan base-package="com.lihh.spring" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
</beans>
```

-

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <!--
    use-default-filters="false"
    默认值为true 代表使用默认的扫描过滤器
    默认的扫描过滤器会识别并包含 @Component @Controller @Service @Repository 四个注解
    不使用默认的filter,使用我们自己的filter
    -->
    <context:component-scan base-package="com.lihh.spring" use-default-filters="true">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
</beans>
```

- 通过上述实例可以得知，其实我们可以通过参数`xxx-filter` 来将某些包进行扫描排除等

## 2. 注解的方式来进行 DI

- `@Autowired` 根据属性数据类型自动装配
- `@Qualifier` 根据属性名称注入依赖
- `@Resources` 可以根据类型,也可以根据名称注入
- `@Value` 注入普通数据类型(8+String)

### 2.1 使用`@Autowired` 完成实例

- 持久层

```shell
@Repository
public class UserDaoImpl implements UserDao {
    @Override
    public void add() {
        System.out.println("这是持久层的dao");
    }
}
```

```shell
public interface UserDao {
    void add();
}
```

- service 层

```shell
@Service
public class Run {
    /*
     *@Autowired
     * 根据类型到容器中去寻找对应的对象,找到后给当前属性赋值
     * 不需要依赖 set方法
     * 属性类型可以是接口,会自动匹配对应的实现类对象
     * @Autowired配合 @Qualifier,可以通过名称指定注入的对象
     *
     * @Resource 如果不配置name 那么就是根据类型注入
     * @Resource(name="userDaoImplB") 配置name,就是根据名称注入
     *
     *
     * @Resource  是JDK中javax包的注解
     * @Autowired 和 @Qualifier 是spring中的注解
     *
     * @Value 可以个普通属性赋值
     * @Value 可以使用${}这种表达式获取系统的变量值
     *        或者是.properties属性配置文件中的值
     *
     * */
    @Autowired
    private UserDao userDao;

    public void add() {
        userDao.add();
        System.out.println("这是service层的");
    }
}
```

- 配置

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <context:component-scan base-package="com.lihh.spring" use-default-filters="true">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
</beans>
```

- `@Autowired` 根据类型到容器中去寻找对应的对象,找到后给当前属性赋值,不需要依赖 set 方法,属性类型可以是接口,会自动匹配对应的实现类对象
- @Autowired 配合 @Qualifier,可以通过名称指定注入的对象
- @Resource 如果不配置 name 那么就是根据类型注入
- @Resource(name="userDaoImplB") 配置 name,就是根据名称注入
- @Resource 是 JDK 中 javax 包的注解
- @Autowired 和 @Qualifier 是 spring 中的注解
- @Value 可以个普通属性赋值
- @Value 可以使用${}这种表达式获取系统的变量值或者是.properties 属性配置文件中的值

## 3. 创建配置类,替代 XML 配置文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/0de6090961d44e0cb61b5aa0bf273661.png)

```shell
 @Test
    public void testGetBean2(){
        ApplicationContext context=new AnnotationConfigApplicationContext(SpringConfig.class);
        UserServiceImpl userService = context.getBean("userServiceImpl", UserServiceImpl.class);
        userService.add();
    }
```
