<div align = "center"><h1>抽象类</h1></div>

> 接下来逐一分解下 抽象类的用途以及注意事项

- 使用关键字`abstract` 来表示抽象类

  ```java
  public abstract class Person {
  }
  ```

- 如果一个方法是抽象方法，那么这个类一定必须是抽象类。不然回报错
- 抽象方法是没有实体的，只有一个方法签名

  ```java
  public abstract class Person {
      public abstract void eat();
  }
  ```

- 抽象类中可以包含 n 个抽象方法 以及 n 个非抽象的方法
- 上述的变量 n 可以是 0 以及任意数字

  ```java
  public abstract class Person {
      public abstract void eat();

      String say() {
          return "say";
      }
  }
  ```

- 抽象类是可以被继承的，如果子类继承抽象类。必须实现抽象类中所有的抽象方法
- 抽象类是具有构造函数的
- 抽象类是不能被实例化的。 所以抽象类只能被用来继承使用
- 抽象类 从继承角度而言 跟 final 互斥。所以抽象类跟 final 不能同时作用在同一个类中。因为抽象类可以被继承，但是 final 阻止继承

```java
public class Test {
    public static void main(String[] args) {
        // 'Person' is abstract; cannot be instantiated
//        Person p = new Person();
    }
}
```
