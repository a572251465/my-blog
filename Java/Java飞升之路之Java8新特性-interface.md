<h1 align="center">interface 演进</h1>

## JDK8 之前的 interface

### 代码实例

- 定义接口

```shell
public interface IInterface {
  static final String test = "test";

  void run();
}
```

- 类实现

```shell
public class Person implements IInterface {
  @Override
  public void run() {
    System.out.println("这是实现的方法");
  }
}
```

- JDK8 之前的 interface 中可以实现一下功能：
  - 定义静态属性。可以通过接口直接调用 例如上述的`IInterface.test`
  - 定义抽象方法。但是实现类必须实现该接口的方法

## JDK8 之后的 interface

### 代码实例

- interface 接口

```shell
public interface IAction {
  public static final String type = "add";

  void run();

  static void hand() {
    System.out.println("这是接口中定义的静态方法");
  }

  default void show() {
    System.out.println("这是default 中的 show方法");
  }
}
```

- 实现类

```shell
public class ActonImpl implements IAction {
  @Override
  public void run() {
    System.out.println("重写父类中的抽象方法");
  }

  public void show1() {
    IAction.super.show();
  }

  @Override
  public void show() {
    System.out.println("重写父类中 被default修饰的方法");
  }
}
```

- 通过上述实例可以得到以下结果

  - 接口中还可以定义静态方法
  - 接口中定义被`default`修饰的方法

- 注意点：
  - 静态属性直接通过接口进行调用
  - 静态方法无法进行重写，也是通过接口中调用
  - 被`default`修饰的方法，类可以进行接口方法重写，然后通过实例调用方法
  - 被`default`修饰的方法，可以通过接口直接调用方法
