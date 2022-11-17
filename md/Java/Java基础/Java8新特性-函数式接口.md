<h1 align="center">函数式接口</h1>

## Supplier

- 源码解析

```shell
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

- 实例

```shell
public class SupplierTest {
  public static void main(String[] args) {
    show(() -> {
      int[] arr = {2, 1, 30, 50, 35};
      Arrays.sort(arr);
      return arr[arr.length - 1];
    });
  }

  public static void show(Supplier<Integer> supplier) {
    int value = supplier.get();
    System.out.println(value);
  }
}
```

- 通过上述的接口定义的内容可以看到。
  - 其实就是提供一个待实现的抽象方法`get`
  - 经过一系列的返回值后，返回一个指定类型的值
  - 此函数不在乎参数。但是会返回指定的类型的值

## Consumer

- 源码解析

```shell
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

- 代码实例

```shell
public class ConsumerTest {
  public static void main(String[] args) {
    show((list) -> {
      Collections.sort(list, Comparator.comparingInt(a -> a));
      System.out.println(list);
    });

    transform((msg) -> {
      System.out.println(msg + "1");
    }, (msg) -> {
      System.out.println(msg + "2");
    });
  }

  public static void show(Consumer<List<Integer>> consumer) {
    List<Integer> list = new ArrayList<>();
    list.add(20);
    list.add(10);
    list.add(30);
    consumer.accept(list);
  }

  public static void transform(Consumer<String> c1, Consumer<String> c2) {
    c1.andThen(c2).accept("123");
  }
}
```

- 通过上述的接口定义的内容可以看到。
  - 其实就是提供一个待实现的抽象方法`accept`. 以及定义一个被`default`修饰的方法
  - 主要的目的是为了 传递一个值进行一系列操作。不在乎返回值
  - 定义的默认方法其实就是为了将多个 Consumer 串行执行

## Function

- 源码解析

```shell
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

- 代码解析

```shell
public class FunctionTest {
  public static void main(String[] args) {
    show((item) -> {
      return item + "";
    });
  }

  public static void show(Function<Integer, String> f) {
    String a = f.apply(10);
    System.out.println(a);
  }
}
```

- 传递两个类型，一个作为传入的值的类型，一个是返回值的类型
- 参数以及返回值都存在

## Predicate

- 源码解析

```shell
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}
```

- 代码实例

```shell
public class PredicateTest {
  public static void main(String[] args) {
    show((value) -> {
      return value == "";
    });
  }

  public static void show(Predicate<String> predicate) {
    boolean flag = predicate.test("1");
    System.out.println(flag);
  }
}
```

- 一个判断类函数式接口。
- 传递一个类型，通过调用内部方法`test` 来返回一个 boolean 类型的值
