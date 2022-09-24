<h1 align = "center">方法引用学习</h1>

## 本质

> 引用的目的其实就是为了避免重复，更加简化 Lambda 表达式的写法

![在这里插入图片描述](https://img-blog.csdnimg.cn/4318b7bb79ab4facb0beb498d1849d21.jpeg)

## 初体验

```shell
public class Test {
    public static void main(String[] args) {
        say(System.out::println);
    }

    public static void say(ISay say) {
        say.println("test");
    }
}
```

## 表现格式

![在这里插入图片描述](https://img-blog.csdnimg.cn/7833b00abf9c493d9f92d02e8ba467e2.jpeg)

## 各种格式体验

### 静态方法示例

- 格式

> `类名: :静态方法名称`

- 接口

```shell
public interface IAction {
    void console(String message);
}
```

- 实现部分

```shell
public class Test {
    public static void main(String[] args) {
        // 这种通过函数引用的方式
        console(Tools::console);

        // 1. 这种通过lambda 表达式来形容
        console(message -> {
            System.out.println(message);
        });
    }

    public static void console(IAction action) {
        action.console("hello");
    }
}

class Tools {
    static void console(String name) {
        System.out.println(name);
    }
}
```

### 构造方法引用

- 格式

> `类名::new`

- 接口

```shell
public interface IAction {
    Person get(String name);
}
```

- 对象

```shell
public class Person {

    public String name;

    public Person() {}

    public Person(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

- 运用

```shell
public class Test {
    public static void main(String[] args) {
        // 通过lambda表达式函数 来实现
        System.out.println(get(name -> {
            return new Person(name);
        }));;

        // 通过函数引用来实现
        System.out.println(get(Person::new));;
    }

    public static Person get(IAction action) {
        return action.get("test");
    }
}
```

### 普通方法引用

- 格式

> `对象::方法名称`

- 接口

```shell
public interface IAction {
    void print(String message);
}
```

- 测试方法

```shell
public class Test {
    public static void main(String[] args) {
        // 使用lambda表达式的方式进行调用
        print(message -> {
            System.out.println(message);
        });

        // 使用函数引用的方式
        Tools tools = new Tools();
        print(tools::say);
    }

    public static void print(IAction action) {
        action.print("test");
    }
}

class Tools {
    public void say(String message) {
        System.out.println(message);
    }
}
```

### 数组的方法引用

- 格式

> `int[]::new`

- 接口

```shell
public interface IAction {
    int[] genArr(int length);
}
```

- 示例代码

```shell
public class Test {
    public static void main(String[] args) {
        // 使用lambda表达式的方式
        int[] a = gen(length -> {
            return new int[length];
        });

        // 使用函数引用的方式进行执行
        int[] b = gen(int[]::new);
        System.out.println(a.length);
        System.out.println(b.length);
    }

    public static int[] gen(IAction action) {
        return action.genArr(10);
    }
}
```

## Stream 留

![在这里插入图片描述](https://img-blog.csdnimg.cn/58afe7e27c3447638dfd98bed2c03506.jpeg)

### 简单示例

#### filter 使用案例

```shell
public class FilterTest {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("lxx", "ly", "zss", "zyy", "zw");

        List<String> res = list.stream().
                filter(s -> s.startsWith("z")).
                filter(s -> s.length() == 3).
                collect(Collectors.toList());

        for (String item: res) {
            System.out.println(item);
        }
    }
}
```

#### map 使用案例

```shell
public class MapTest {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("1", "2", "3", "4");

        List<Integer> res = list.stream().map(Integer::parseInt).collect(Collectors.toList());
        for (Integer item: res) {
            System.out.println(item);
        }
    }
}
```

#### peek 使用案例

```shell
public class PeekTest {
    public static void main(String[] args) {
        List<Person> list = new ArrayList<>();
        list.add(new Person("lixx", 22));
        list.add(new Person("lll", 21));

        List<Person> res = list.stream().peek(s -> {
            s.setAge(s.getAge() + 5);
        }).collect(Collectors.toList());

        for (Person p: res) {
            System.out.println(p);
        }
    }
}
```
