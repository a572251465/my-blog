<h1 align = "center">JDK代理模式</h1>

> 1. 这篇文章主要是通过代码的形式来讲述下 【JDK 代理模式】 。
> 2. 是通过代理对象访问目标对象，这样可以在目标对象基础上增强额外的功能，如添加权限，访问控制和审计等功能

## 1. 代码形式实现

> 1. JDK 代理模式 是 一种动态代理。
> 2. 动态代理可以针对于一些不特定的类或者一些不特定的方法进行代理,我们可以在程序运行时动态的变化代理的规则，代理类在程序运行时才创建的代理模式成为动态代理。这种情况下，代理类并不是在 Java 代码中定义好的，而是在程序运行时根据我们的在 Java 代码中的“指示”动态生成的
> 3. Proxy 动态代理 JDK 动态代理 面向接口

```shell
public class TestProxy {
    public static void main(String[] args) {
        Person person = new Person();

        ClassLoader classLoader = person.getClass().getClassLoader();
        Class<?>[] interfaces = person.getClass().getInterfaces();

        Dinner dinner = (Dinner)Proxy.newProxyInstance(classLoader, interfaces, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                Object o = null;

                // 对eat方法做增强
                String name = method.getName();
                if ("eat".equals(name)) {
                    System.out.println("-- eat之前进行操作");
                    o = method.invoke(person, args);
                    System.out.println("-- eat之后进行操作");
                } else {
                    o = method.invoke(person, args);
                }

                return o;
            }
        });

        dinner.eat("泡面");
    }
}

interface Dinner {
    void eat(String foodName);
    void drink();
}

class Person implements Dinner {

    @Override
    public void eat(String foodName) {
        System.out.println("我要吃饭：" + foodName);
    }

    @Override
    public void drink() {
        System.out.println("我要喝水");
    }
}
```

- 上述文件中其实还是通过【Proxy.newProxyInstance】 来实现代理，是基于接口来实现的
- 如果某一个类实现了接口，Proxy 可以代理实现的方法，但是如果类中定义了额外的方法就无法实现代理了
