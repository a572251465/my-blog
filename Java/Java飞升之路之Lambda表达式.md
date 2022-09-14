<h1 align="center">Lambda</h1>

> 什么是 Lambda 表达式呢。其实是可以理解为特殊的匿名内部类的

### 代码引入

#### 通过继承实现

```shell
// 实现类
public class Person implements Runnable {
  @Override
  public void run() {
    System.out.println("这是启动一个子线程");
  }
}

// 调用方法
Person p = new Person();
Thread t = new Thread(p);
t.start();
```

#### 通过匿名内部类实现

```shell
// 2. 通过匿名内部类来解决
Thread t1 = new Thread(new Runnable() {
  @Override
  public void run() {
    System.out.println("这是一个匿名内部类的子线程");
  }
});
t1.start();
```

#### 用 Lambda 表达式来实现

```shell
Thread t2 = new Thread(() -> {
  System.out.println("这是一个lambda 表达式的子线程");
});
t2.start();
```

- 通过上述代码可以得出。其实 Lambda 表达式就是为了简化匿名内部类的用法

### 实例

```shell
public class Test1 {
  public static void main(String[] args) {
    List<User> list = new ArrayList<>();
    list.add(new User("lixx", 20));
    list.add(new User("lixx1", 30));
    list.add(new User("lixx2", 10));
    list.add(new User("lixx3", 40));
    list.add(new User("lixx4", 120));
    list.add(new User("lixx5", 110));

    Collections.sort(list, (User a, User b) -> {
      return a.getAge() - b.getAge();
    });

    for (User u: list) {
      System.out.println(u);
    }
  }
}
```

### 注解`@FunctionalInterface` 干什么的

> 先思考一个问题，匿名内部类无非是对接口重写的另一种表现形式。我们可以用 Lambda 表达式来代替。但是接口中如果存在多个重写的方法怎么办呢

- 先思考下上述的问题。其实跟我们要讲解的注解有很大的关系。
- 没错。这个注解就是为了限制接口内部只能有一个被重写的抽象类

### 匿名函数的本质

> 首先看下如下实例中的代码

```shell
public class Test {
  public static void main(String[] args) {
    goShow(new IMyAction() {
      @Override
      public void show() {
        System.out.println("这是一个匿名的内部类");
      }
    });
  }

  public static void goShow(IMyAction my) {
    my.show();
  }
}
```

- 接下来我们看下编译结果：

  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/84e1cc08936c4281ac22c716a85a2ea3.png)
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/58a8d86b46d642d39619eabb5d9606f0.png)
  - ![在这里插入图片描述](https://img-blog.csdnimg.cn/8d37d98d10a04e0fb2dc0dabd4f5026d.png)

- 通过上述三个截图中我们可以看到，其实匿名内部类会被编译成为一个类，这个类实现接口并重写了方法
- 所以匿名内部类并不是 不需要实现类实现接口中的方法，而是编译层面已经帮我们使用了

### Lambda 表达式的本质

- 先看下实例代码

```shell
public class Test1 {
  public static void main(String[] args) {
    goShow(() -> {
      System.out.println("这是一个lambda表达式");
    });
  }

  public static void goShow(IMyAction my) {
    my.show();
  }
}
```

- 看下反编译后的代码

> 执行命令`javap -c -p xxx.class`

```shell
Compiled from "Test1.java"
public class com.lihh.lambda1.Test1 {
  public com.lihh.lambda1.Test1();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: invokedynamic #2,  0              // InvokeDynamic #0:show:()Lcom/lihh/lambda1/IMyAction;
       5: invokestatic  #3                  // Method goShow:(Lcom/lihh/lambda1/IMyAction;)V
       8: return

  public static void goShow(com.lihh.lambda1.IMyAction);
    Code:
       0: aload_0
       1: invokeinterface #4,  1            // InterfaceMethod com/lihh/lambda1/IMyAction.show:()V
       6: return

  private static void lambda$main$0();
    Code:
       0: getstatic     #5                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #6                  // String 这是一个lambda表达式
       5: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

- 通过上述的编译结果可以看到。其实 Lambda 表达式会被编译成为一种静态函数`lambda$main$0`
- 而且函数中的内容就是 Lambda 中的内容。通过下面的断点调试 其实也是可以看到基本的情况的
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/961f97e25b8a427ba87c3f01e73c8624.png)

> 运行地址：java -Djdk.internal.lambda.dumpProxyClasses 包名.类名

![在这里插入图片描述](https://img-blog.csdnimg.cn/c6d892f3c2f14695968a5cff9d206db5.png)

- 通过上述的图片可以看到。其实匿名内部类实现了接口，并且重写了方法。而且重写中的方法还调用了原来类的生成的静态方法(
  其实就是上述的`lambda$main$0`静态方法)

- 总结
  - Lambda 表达式在程序运行的时候会形成一个类
    - 在类中添加一个静态方法，方法中的内容就是表达式中的内容
    - 还会形成一个匿名内部类，实现接口，重写抽象方法
    - 在接口的重写方法中调用生成的静态方法

### 使用前提

- 方法的参数或是局部变量类型必须是接口
- 接口中必须只有一个待实现的抽象方法

### Lambda 以及匿名内部类的对比

- 所需类型不同
  - 匿名内部类：类/ 抽象类/ 接口
  - Lambda 表达式：接口
- 抽象方法的数量不同
  - 匿名内部类：抽象方法数量随意
  - Lambda：有且只能有一个待重写的抽象方法
- 实现原理不同
  - 匿名内部类：是在编译后形式一个 class
  - Lambda：是在运行时动态生成一个 class
