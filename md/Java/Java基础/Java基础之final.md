<div align = "center"><h1>final修饰符</h1></div>

> final 修饰符。可以修改类/ 方法/ 属性。 接下来一一进行分解下，如何进行修饰的

## 修饰属性

- final 修饰基本数据类型的话，不能再次修改值

  ```java
          final int age = 20;
          // 如果用final 修饰基本数据类型的话 就不能再次进行赋值了 可以理解为字符串常量
          // age = 10;
  ```

- final 修饰引用数据类型的话，不能再次修改地址。但是引用类型内部的属性还是可以修改的

  ```java
          final Person p = new Person();
          // 如果是引用数据类型的话 也是不能再次修改地址的
          //        p = new Person();
          // 但是还可以修改引用类型中的属性
          p.name = "20";
          p.age = 10;
  ```

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/ed853436c1f24a0aa47437e0a8cc325e.png)

- 如果 final 修饰了引用类型。将修饰的对象通过形参赋值给别的函数，是可以再次修改地址的.如上图

  ```java
      void fn1() {
          final Person p = new Person();
          fn2(p);
      }

      // void fn2(final Person p)  这样就不可以修改了
      void fn2(Person p) {
          p = new Person();
      }
  ```

## 修饰方法

- 修饰的方法，不能被重写

```java
// Person.java
public class Person {
    String name;
    int age;

    public final void eat() {}
}

// Person1.java
public class Person1 extends Person {
    @Override
    public void eat() { // 此处报错

    }
}
```

## 修饰类

- 被 final 修饰的类 不能被继承
- final 修饰的类可以实例化
- 看来如果使用 final 修饰类的时候 就是为了避免继承用的
- 如果不想实例化的话，可以用修饰符 `private` 来修饰构造函数
