<h1 align = "center">Lambda 表达式深入学习</h1>

> 必须掌握的 lambda 表达式

## 1. 初体验

> - lambda 表达式其实是函数式编程的一种实现
> - 函数作为一等公民具有以下的特点：
> - lambda 表达式可以赋值给变量
> - lambda 表达式可以作为参数来使用
> - lambda 表达式可以作为返回值来使用

- 赋值给变量来使用

```shell
IAction action = () -> new User("lxx2", 30);
System.out.println(action.getObject());
```

- 可以作为参数来使用

```shell
    System.out.println(fn1(() -> new User("lxx9", 23), "User"));

    public static User fn1(IAction action, String beanName) {
        Object obj = action.getObject();
        if (obj != null && obj.getClass().getSimpleName().equals(beanName)) {
            return (User) obj;
        }
        return null;
    }
```

- 可以作为返回值来使用

```shell
    System.out.println(fn2().getObject());

    public static IAction fn2() {
        return () -> new User("lxx6", 22);
    }
```

## 2. lambda 表达式语法

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c54fa763d4140d4a3532adf62a40a25.jpeg)

## 3. lambda 表达式各种缩写

> - 默认格式，其实就是不进行省略，每个都写出来
> - 省略大括号的格式
> - 省略小括号的格式
> - 省略参数类型的格式

### 3.1 代码示例

```shell
@FunctionalInterface
public interface IMath {
    public int add(int a, int b);
}
```

```shell
@FunctionalInterface
public interface ISay {
    public void say(String message);
}
```

```shell
public class Test {
    public static void main(String[] args) {
        // 1. 默认格式
        IMath math = (int a, int b) -> {
            return a + b;
        };
        System.out.println(math.add(1, 2));

        // 2. 省略大括号
        ISay say = (String message) -> System.out.println(message);
        say.say("测试/ 省略大括号");

        // 3. 省略小括号
        say = message -> {
            System.out.println("hello" + message);
        };
        say.say("world");

        // 4. 省略参数
        math = (a, b) -> a + b;
        System.out.println(math.add(3, 4));
    }
}
```

## 4. lambda 表达式内置 interface 书写

### 4.1 Runnable 实现

```shell
public class RunnableTest {
    public static void main(String[] args) {
        Thread th = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("通过匿名内部类 实现了Runnable");
            }
        });
        th.start();

        Thread th1 = new Thread(() -> {
            System.out.println("通过lambda表达式 实现了Runnable");
        });
        th1.start();
    }
}
```

### 4.2 Supplier 实现

```shell
public class SupplierTest {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(3, 10, 1, 9, 11, 20);
        int max = getMax(() -> {
            int res = list.get(0);
            for (int item: list) {
                if (item > res) res = item;
            }
            return res;
        });
        System.out.println(max);
    }

    public static int getMax(Supplier<Integer> supplier) {
        return supplier.get();
    }
}
```

- 此接口为提供者，通过一些指定的逻辑而返回一些值

### 4.3 Consumer

```shell
public class ConsumerTest {
    public static void main(String[] args) {
        consumerHand(msg -> {
            System.out.println(msg + " test");
        });

        consumerTest(s -> System.out.println(s.toUpperCase()), s -> System.out.println(s.toLowerCase()), "hello");
    }

    public static void consumerHand(Consumer<String> consumer) {
        consumer.accept("hello");
    }

    public static void consumerTest(Consumer<String> p, Consumer<String> p1, String msg) {
        p.andThen(p1).accept(msg);
    }
}
```

- 此接口为消费者，给与一定的值进行消费
- `andThen` 函数在使用的时候，当传递一个字符串的时候，多个方法并行消费。

### 4.4 Predicate

```shell
public class PredicateTest {
    public static void main(String[] args) {
        andMethod(s -> s.contains("h"), s -> s.contains("e"));
        orMethod(s -> s.contains("m"), s -> s.contains("w"));
        negateMethod(s -> s.contains("m"));
    }

    static void andMethod(Predicate<String> one, Predicate<String> two) {
        boolean isValid = one.and(two).test("hello");
        System.out.println(isValid);
    }

    static void orMethod(Predicate<String> one, Predicate<String> two) {
        boolean isValid = one.or(two).test("hello");
        System.out.println(isValid);
    }

    static void negateMethod(Predicate<String> one) {
        boolean isValid = one.negate().test("hello");
        System.out.println(isValid);
    }
}
```

- `and` 多个条件是否同时满足
- `or` 多个条件是否有一个满足
- `negate` 表示逻辑取反的操作

### 4.5 Comparator

```shell
public class ComparatorTest {
    public static void main(String[] args) {
        String[] arr = {"12", "245", "1", "678", "33"};
        Arrays.sort(arr, (a, b) -> a.length() - b.length());

        System.out.println(Arrays.toString(arr));
    }
}
```

- 一般用来比较器使用，其实内部就是用来做内部比较的

### 4.6 Function

```shell
public class FunctionTest {
    public static void main(String[] args) {
        System.out.println(transform(Integer::parseInt, s -> s + 10, s -> s *= 10));;
    }

    public static int transform(Function<String, Integer> one, Function<Integer, Integer> two, Function<Integer, Integer> three) {
        return one.andThen(two).andThen(three).apply("123");
    }
}
```

- 函数`andThen`多个嵌套的逻辑是串性的，就是上一个函数的返回值就是下一个函数的参数
