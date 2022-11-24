<div align = "center"><h1>包装类</h1></div>

## 什么是包装类

- 之前定义的变量 我们基本都是在使用基本数据类型
- 那么对于基本数据类型而言的话，它就是一个数字，加点属性/ 加点方法/ 加点构造方法
- 将对应的基本数据类型 做相应的包装，就会产生一个新的类。就是包装类
- int/ byte -》 基本数据类型/ 包装类 -》 引用数据类型

## 基本数据类型 以及包装类的映射

| 基本数据类型 | 对应包装数据类型 | 继承关系              |
| ------------ | ---------------- | --------------------- |
| byte         | Byte             | --> Number --> Object |
| short        | Short            | --> Number --> Object |
| int          | Integer          | --> Number --> Object |
| long         | Long             | --> Number --> Object |
| float        | Float            | --> Number --> Object |
| double       | Double           | --> Number --> Object |
| char         | Character        | --> Object            |
| boolean      | Boolean          | --> Object            |

## 装包 以及拆包

```java
public class Test {
    public static void main(String[] args) {
        Integer i = new Integer(12);
        int i1 = i;
        System.out.println(i1);

        int a = 10;
        Integer b = a;
        System.out.println(b.toString());
    }
}
```

- 以上代码就是经过了装包 以及拆包的过程。可以将基本数据类型的值跟引用数据类型相互赋值
- 例如：`int i1 = i;` 以及`Integer b = a;`. 是程序内部完成了 装包以及拆包的过程
- 执行代码`int i1 = i;` 的时候，将包装类型自动转换为基本数据类型 (程序会自动调用下面的方法：`intValue`方法)

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/004cb336c2c341d1a982cbb46a6d3ace.png)

- 执行代码`Integer b = a;` 的过程会自动装包。其实是调用下列方法`valueOf` 方法完成了装包

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/24ad9c1a4ce749c3b5404c7fba00d365.png)

- 其实通过上述的实例，基本数据类型以及对应的包装类型都可以进行赋值（也就是自由的装包以及拆包）
