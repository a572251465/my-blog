<div align = "center"><h1>线程</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/c01638604fd040d28203b888fe45a140.png#pic_center)

## 定义

<hr />

- 程序：为了完成特定的任务，用某种语言编写的一组指令的集合，是一段静态代码
- 进程：是程序的一次执行过程。正在运行的一个程序，进程作为资源分配的单位。在内存中会给每个进程分配不同的内存区域
- 线程：进程可进一步细化为线程，是程序内部的一条执行路径。若一个进程同一时间并行执行多个线程的话，就是支持 多线程

### 第一种方式。继承类 Thread 来实现

- 不是随便一个类都可以作用子线程的。这个类必须继承`Thread`类。而且必须重写 run 方法。可以理解为 run 方法就是子线程执行的入口。
- 而且在调用对象的过程中，不能直接调用`run`函数，必须是手动调用继承得到的`start`函数

```Java
public class Person extends Thread {

    @Override
    public void run() {
        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println("Person--" + (i + 1));
        }
    }
}
```

```Java
public class Test {
    public static void main(String[] args) {
        Person p = new Person();
        // 如果要启动定义线程 需要调用重写方法start
        p.start();

        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println("main---------" + (i + 1));
        }
    }
}
```

### 第二种方式。实现 Runnable 接口来实现

<hr />

> 通过实现接口`Runnable` 来完成

```Java
public class User implements Runnable {

    @Override
    public void run() {
        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println(Thread.currentThread().getName() + "----------" + i);
        }
    }
}
```

```Java
public class TestUser {
    public static void main(String[] args) {
        User u = new User();
        Thread t = new Thread(u);
        t.setName("测试");
        t.start();

        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println(Thread.currentThread().getName() + "----------" + i);
        }
    }
}
```

### 第三种方式。实现 Callable 接口来实现

> - 通过实现接口`Callable` 来实现，同时必须实现接口中的方法
> - 在调用过程中 也必须借助类`FutureTask` 来做中转

```Java
public class Man implements Callable {
    @Override
    public Object call() throws Exception {
        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println(Thread.currentThread().getName() + "----------" + i);
        }
        return null;
    }
}
```

```Java
public class TestMan {
    public static void main(String[] args) {
        Man m = new Man();
        FutureTask ft = new FutureTask(m);
        Thread t = new Thread(ft);
        t.setName("我就是子类");
        t.start();

        int len = 10;
        for (int i = 0; i < len; i++) {
            System.out.println(Thread.currentThread().getName() + "----------" + i);
        }
    }
}
```

## 实现方式的优缺点

- 不同：
  - 方式一：如果继承了 Thread 类，就无法再次继承别的类了。而且无法处理异常，无法处理返回值
  - 方式二：无法处理异常，无法处理返回值
  - 方式三：可以处理异常，可以有返回值，就是创建过程相对麻烦点

## 线程的生命周期

<hr />

![在这里插入图片描述](https://img-blog.csdnimg.cn/6eadcbb28464429a8f8e3ba3621d14f6.png#pic_center)
