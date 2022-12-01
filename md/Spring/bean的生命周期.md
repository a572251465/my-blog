<h1 align = "center">bean的生命周期</h1>

## 1. 简述

> bean 从创建到销毁经历了各个阶段以及各个阶段调用的方法

- 通过构造函数创建 bean 实例
- 为 bean 属性赋值
- 初始化 bean
- bean 的获取
- 容器关闭 销毁 bean

## 2. 简单示例

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="person" class="com.lihh.spring.bean.Person" init-method="initPerson" destroy-method="destroyPerson">
        <property name="name" value="lxx1"/>
    </bean>
</beans>
```

```shell
public class TestPerson {
    @Test
    public void test() {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext5.xml");
        Person person = applicationContext.getBean("person", Person.class);
        System.out.println("4. 容器中获取示例");
        applicationContext.close();
    }
}
```

## 3. 影响全局示例的钩子

- 通过构造器创建 bean 实例 执行构造器
- 为 bean 属性赋值 执行 set 方法
- **<font color = "red">把 bean 实例传递给 bean 的后置处理器的方法</font>**
- 初始化 bean 调用 bean 的初始化方法,需要配置指定调用的方法
- **<font color = "red">把 bean 实例传递给 bean 的后置处理器的方法</font>**
- bean 的获取 容器对象 getBean 方法
- 容器关闭销毁 bean 调用销毁方法,需要配置指定调用的方法

> 针对 Bean 添加两个后置 以及前置的处理器

```shell
/**
 * @Author: Ma HaiYang
 * @Description: MircoMessage:Mark_7001
 */
public class MyBeanProcesser implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        //Object bean      实例化的bean
        //String beanName  bean的id
        System.out.println("bean:初始化方法之前");
        return bean;// 这里必须return bean
    }
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("bean:初始化方法之后");
        return bean;// 这里必须returnbean
    }
}
```

```xml
<bean id="myBeanProcesser" class="com.msb.beanProcesser.MyBeanProcesser"></bean>
```

- BeanPostProcessor 接口作用
  - 如果我们想在 Spring 容器中完成 bean 实例化、配置以及其他初始化方法前后要添加一些自己逻辑处理。我们需要定义一个或多个 BeanPostProcessor 接口实现类，然后注册到 Spring IoC 容器中接口中的两个方法都要将传入的 bean 返回，而不能返回 null，如果返回的是 null 那么我们通过 getBean 方法将得不到目标。
  - ApplicationContext 会自动检测在配置文件中实现了 BeanPostProcessor 接口的所有 bean，并把它们注册为后置处理器，然后在容器创建 bean 的适当时候调用它，因此部署一个后置处理器同部署其他的 bean 并没有什么区别。而使用 BeanFactory 实现的时候，bean 后置处理器必须通过代码显式地去注册，在 IoC 容器继承体系中的 ConfigurableBeanFactory 接口中定义了注册方法

### 3.1 结论

> Bean 的前置以及后置处理器，不仅仅是实现【BeanPostProcessor】接口。同样是需要在配置文件中进行定义。spring 容器在启动的时候会检查是否实现了接口【BeanPostProcessor】。 来给 bean 注册前置，后置方法
