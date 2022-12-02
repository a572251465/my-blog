<h1 align = "center">CGLIB 代理模式</h1>

> 这篇文章主要的目的是描述下【CGLIB 代理模式】，如果看到的这篇文章可以看看上一篇文章【proxy 代理模式】

<br />

> - 跟 proxy 代理模式不同的是，CGLIB 代理模式是基于父类，所以此模式的弥补了 proxy 代理模式不足

![在这里插入图片描述](https://img-blog.csdnimg.cn/04dbd465287a4dadb22600aa60207e4d.png)

```shell
/**
 * @Author: Ma HaiYang
 * @Description: MircoMessage:Mark_7001
 */
public class Test1 {
    @Test
    public void testCglib(){
        Person person =new Person();
        // 获取一个Person的代理对象
        // 1 获得一个Enhancer对象
        Enhancer enhancer=new Enhancer();
        // 2 设置父类字节码
        enhancer.setSuperclass(person.getClass());
        // 3 获取MethodIntercepter对象 用于定义增强规则
        MethodInterceptor methodInterceptor=new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                /*Object o,  生成之后的代理对象 personProxy
                Method method,  父类中原本要执行的方法  Person>>> eat()
                Object[] objects, 方法在调用时传入的实参数组
                MethodProxy methodProxy  子类中重写父类的方法 personProxy >>> eat()
                */
                Object res =null;
                if(method.getName().equals("eat")){
                    // 如果是eat方法 则增强并运行
                    System.out.println("饭前洗手");
                    res=methodProxy.invokeSuper(o,objects);
                    System.out.println("饭后刷碗");
                }else{
                    // 如果是其他方法 不增强运行
                    res=methodProxy.invokeSuper(o,objects); // 子类对象方法在执行,默认会调用父类对应被重写的方法
                }
                return res;
            }
        };
        // 4 设置methodInterceptor
        enhancer.setCallback(methodInterceptor);
        // 5 获得代理对象
        Person personProxy = (Person)enhancer.create();
        // 6 使用代理对象完成功能
        personProxy.eat("包子");
    }
}
class Person  {
    public Person( ) {
    }
    public void eat(String foodName) {
        System.out.println("张三正在吃"+foodName);
    }
}
```
