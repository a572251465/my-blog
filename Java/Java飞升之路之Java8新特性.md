<h1 align="center">Java8新特性</h1>

## 1. Lambda 表达式

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
