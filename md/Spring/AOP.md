<h1 align = "center">AOP(面向切面编程)</h1>

> - AOP 切面编程一般可以帮助我们在不修改现有代码的情况下,对程序的功能进行拓展,往往用于实现 日志处理,权限控制,性能检测,事务控制等
> - AOP 实现的原理就是动态代理,在有接口的情况下,使用 JDK 动态代理,在没有接口的情况下使用 cglib 动态代理
> - 看本文章之前可以看下【proxy 代理】 以及【CGLIB 代理】模式

<br />

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2043d240acb4bae9f538bf268211853.png)

## 1. AOP 中的术语

- 连接点 Joint point(可以被增强的方法/ 比如一个类中很多方法都可以被增强):

  - 类里面那些可以被增强的方法,这些方法称之为连接点
  - 表示在程序中明确定义的点，典型的包括方法调用，对类成员的访问以及异常处理程序块的执行等等，它自身还可以嵌套其它 joint point

- 切入点 Pointcut(实际被增强的方法/ 比如一个类 10 个方法，有 2 个方法被增强)
  - 实际被增强的方法,称之为切入点
  - 表示一组 joint point，这些 joint point 或是通过逻辑关系组合起来，或是通过通配、正则表达式等方式集中起来，它定义了相应的 Advice 将要发生的地方
- 通知 Advice:（实际增加的功能。比如：某个方法之前之后要执行部分功能）

  - 实际增强的逻辑部分称为通知 (增加的功能)
  - Advice 定义了在 Pointcut 里面定义的程序点具体要做的操作，它通过 before、after 和 around 来区别是在每个 joint point 之前、之后还是代替执行的代码。
    通知类型: 1 前置通知 2 后置通知 3 环绕通知 4 异常通知 5 最终通知

- 目标对象 Target：被增强功能的对象(被代理的对象)

  - 织入 Advice 的目标对象

- 切面 Aspect： <font color = "red">表现为功能相关的一些 advice 方法放在一起声明成的一个 Java 类</font>

  - Aspect 声明类似于 Java 中的类声明，在 Aspect 中会包含着一些 Pointcut 以及相应的 Advice。

- 织入 Weaving：(创建代理对象并实现功能增强的声明并运行过程)
  - 将 Aspect 和其他对象连接起来, 并创建 Adviced object 的过程

## 2. 注解的方式实现 AOP

> AspectJ 本身并不是 spring 框架中的组成部分, 是一个独立的 AOP 框架,一般把 AspectJ 和 Spring 框架的 AOP 依赖一起使用,所以要导入一个独立的依赖

<br />

- `AOP`中多种通知方式：

> 1. 前置通知: 切点方法执行之前先执行的功能
> 2. 后置通知:方法执行之后要增强的功能(无论切点方法是否出现异常都会执行的方法)
> 3. 返回通知:切点方法正常运行结束后增强的功能,如果方法运行过程中出现异常,则该功能不运行
> 4. 异常通知:切点方法出现异常时运行的增强功能,如果方法运行没有出现异常,则该功能不运行
> 5. 环绕通知:在切点方法之前和之后都进行功能的增强,需要在通知中定义方法执行的位置,并在执行位置之前和之后自定义增强的功能

### 2.1 基础依赖包

- `spring-context` spring 核心包
- `spring-aspects` spring 切面包
- `aspectjweaver` aop 核心包。已经被这个包`spring-aspects`导入了
- `aopalliance` aop 联盟包

### 2.2 AOP 切入表达式

- 切入点表达式: 通过一个表达式来确定 AOP 要增强的是哪个或者那些方法
- 语法结构:execution([权限修饰符][返回值类型][类的全路径名][方法名](参数 列表) )
- 例如：

  - execution(\* com.msb.dao.UserDaoImpl.add(..)) //指定切点为 UserDaoImpl.add 方法
  - execution(_ com.msb.dao.UserDaoImpl._(..)) //指定切点为 UserDaoImpl.所有的方法
  - execution(_ com.msb.dao.UserDaoImpl._(..)) //指定切点为 UserDaoImpl.所有的方法
  - execution(_ com.msb.dao._.add(..)) // 指定切点为 dao 包下所有的类中的 add 的方法
  - execution(_ com.msb.dao._.add\*(..)) // 指定切点为 dao 包下所有的类中的 add 开头的方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/b5efb44926e9444dab20bc198c1c193c.png)

### 2.3 基本的结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a9093628f654312bb3ff9b4735b8199.png)

- service/UserService

```shell
public interface UserService {
    void addUser();
}
```

- service/impl/UserServiceImpl

```shell
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public void addUser() {
        System.out.println("service impl addUser");

        userDao.addUser();
    }
}
```

### 2.4 开启包扫描

- 通过配置的方式

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd
">
    <!--  打开spring 扫描配置  -->
    <context:component-scan base-package="com.lihh" />
    <!--  自动生成proxy对象   -->
    <aop:aspectj-autoproxy />
</beans>
```

### 2.5 aop 核心代码

```shell
@Component
@Aspect
public class UserAspect {
    // 表示定义公共切点
    @Pointcut(value = "execution(* com.lihh.dao.*.add*(..))")
    public void addPointCut() {}

    /*
     * 前置通知: 切点方法执行之前先执行的功能
     * 参数列表可以用JoinPoint接收切点对象
     * 可以获取方法执行的参数
     * */
    @Before(value = "addPointCut()")
    public void methodBefore(JoinPoint joinPoint) {
        System.out.println(Arrays.toString(joinPoint.getArgs()));
        System.out.println("before ...");
    }

    /*
     * 后置通知:方法执行之后要增强的功能
     * 无论切点方法是否出现异常都会执行的方法
     * 参数列表可以用JoinPoint接收切点对象
     * */
    @After(value = "addPointCut()")
    public void methodAfter(JoinPoint joinPoint) {
        System.out.println(Arrays.toString(joinPoint.getArgs()));
        System.out.println("after ...");
    }

    /*
     * 返回通知:切点方法正常运行结束后增强的功能
     * 如果方法运行过程中出现异常,则该功能不运行
     * 参数列表可以用 JoinPoint joinPoint接收切点对象
     * 可以用Object res接收方法返回值,需要用returning指定返回值名称
     * */
    @AfterReturning(value = "addPointCut()", returning = "res")
    public void methodAfterReturning(JoinPoint joinPoint, Object res) {
        if (res != null) System.out.println(res.toString());
        System.out.println("afterReturning ...");
    }

    /*
     * 异常通知:切点方法出现异常时运行的增强功能
     * 如果方法运行没有出现异常,则该功能不运行
     * 参数列表可以用Exception ex接收异常对象 需要通过throwing指定异常名称
     * */
    @AfterThrowing(value = "addPointCut()", throwing = "ex")
    public void methodAfterThrowing(Exception ex) {
        System.out.println("throw ...");
    }

    /*
     * 环绕通知:在切点方法之前和之后都进行功能的增强
     * 需要在通知中定义方法执行的位置,并在执行位置之前和之后自定义增强的功能
     * 方法列表可以通过ProceedingJoinPoint获取执行的切点
     * 通过proceedingJoinPoint.proceed()方法控制切点方法的执行位置
     * proceedingJoinPoint.proceed()方法会将切点方法的返回值获取到,并交给我们,可以做后续处理
     * 我们在环绕通知的最后需要将切点方法的返回值继续向上返回,否则切点方法在执行时接收不到返回值
     * */
    @Around(value = "addPointCut()")
    public Object methodAround(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("aroundA ...");
        Object proceed = proceedingJoinPoint.proceed();
        System.out.println("aroundB ...");
        return proceed;
    }
}
```

通过上述代码可以得知：

- 注解`@Aspect` 表示类是切面代理
- 代码`@Pointcut(value = "execution(* com.lihh.dao.*.add*(..))")` 表示有公共切面的部分
- 代理的部分大致分为 5 情况：
  - `@Before(value = "addPointCut()")` 前置通知，切点方法执行之前先执行的功能
  - `@After(value = "addPointCut()")` 后置通知，方法执行之后要增强的功能
  - `@AfterReturning(value = "addPointCut()", returning = "res")` 回通知:切点方法正常运行结束后增强的功能, 如果方法运行过程中出现异常,则该功能不运行
  - `@AfterThrowing(value = "addPointCut()", throwing = "ex")` 异常通知:切点方法出现异常时运行的增强功能,如果方法运行没有出现异常,则该功能不运行
  - `@Around(value = "addPointCut()")` 环绕通知:在切点方法之前和之后都进行功能的增强,需要在通知中定义方法执行的位置,并在执行位置之前和之后自定义增强的功能

### 2.5 注意点

![在这里插入图片描述](https://img-blog.csdnimg.cn/42186d55946c44d6ac982389f66cd345.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad532be403114db6b31439dbf8656a77.png)

- 有多个增强类对同一个方法进行增强，通过@Order 注解设置增强类优先级
- 数字越小,优先级越高
- 数字越小,其代理位置越靠近注入位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/cf3eab9c40ba4a9d97806da9ab9dd40a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ae67f590fae446008328bb756cc13cd8.png)

## 3. 使用注解配置

```shell
package com.lihh.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@ComponentScan(value = "com.lihh")
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class SpringConfig {
}
```

```shell
public class Test2 {
    @Test
    public void test() {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
        UserController userController = applicationContext.getBean(UserController.class);
        userController.addUser("lxx", 22);
    }
}
```

## 4. 使用 xml 方式配置代理

- 在 spring 配置文件中创建两个类对象

```xml
<bean id="userDao" class="com.com.msb.UserDaoImpl"></bean>
<bean id="daoAspect" class="com.com.aspect.DaoAspect"></bean>
```

- 在 spring 配置文件中配置切入点

```xml
    <aop:config>
        <!--切入点-->
        <aop:pointcut id="pointCutAdd" expression="execution(* com.lihh.dao.UserDao.add*(..))"/>
        <!--配置切面-->
        <aop:aspect ref="daoAspect">
            <!--增强作用在具体的方法上-->
            <aop:before method="methodBefore" pointcut-ref="pointCutAdd"/>
            <aop:after method="methodAfter" pointcut-ref="pointCutAdd"/>
            <aop:around method="methodAround" pointcut-ref="pointCutAdd"/>
            <aop:after-returning method="methodAfterReturning"  pointcut-ref="pointCutAdd" returning="res"/>
            <aop:after-throwing method="methodAfterThrowing"  pointcut-ref="pointCutAdd" throwing="ex"/>
        </aop:aspect>
    </aop:config>
```
