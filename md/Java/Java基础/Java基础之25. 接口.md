<div align = "center"><h1>接口</h1></div>

> 接口中 永远都是`单继承，多实现`。而接口以及类关系就是通过`实现`来完成的

- 接口是接口，类是类 是两个平行而且不相干的东西
- 定义接口的时候 使用关键字`interface` 来进行定义

  ```Java
  public interface IPerson {
  }
  ```

- 接口中没有实体，只有声明,同样接口是没有构造器的

  ```Java
  public interface IPerson {
      public String eat();
      public void say(String name);
  }
  ```

- 在 JDK1.8 之前 接口中只有两部分内容：

  - 常量：固定修饰符是 public static final
  - 抽象方法：public abstract

- 在 JDK1.8 之后 接口中不至能添加静态常量 以及抽象方法

  - 定义被`public defualt` 修饰的非抽象方法
    - 如果此方法被重写后，必须不能写`default`。否则会报错
  - 定义静态方法(静态方法 不能被重写)

- 一旦一个普通类实现接口，必须实现接口中的全部方法
- 但是如果是抽象类实现接口的话，抽象方法会遗留到子类继承来实现

  ```Java
  public class Person implements IPerson {
      @Override
      public String eat() {
          return null;
      }

      @Override
      public void say(String name) {

      }
  }
  ```

  ```Java
  public abstract class Person1 implements IPerson {
  }
  ```
