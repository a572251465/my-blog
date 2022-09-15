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
