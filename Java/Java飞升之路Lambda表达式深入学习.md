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
