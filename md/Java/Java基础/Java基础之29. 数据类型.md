<div align = "center"><h1>数据类型</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e4ed5429d124a6fa8c6cf7d7e8503d6.png#pic_center)

> - Java 是一种强类型语言，每个变量都必须声明其数据类型
> - Java 的数据类型大致分为两类：基本数据类型 以及引用数据类型。 可以理解为除了基本数据类型以外的 都是引用数据类型

## 进制转换 补充知识

> 以十进制 13 为例。进行二进制转换

![在这里插入图片描述](https://img-blog.csdnimg.cn/db3c28d182994a4c8dc51049dc3bbe41.png)

- 任何十进制转换 N 进制的话，就一直除 N。 直到结果是 0.将余数从下自上收集起来

> 以二进制 1101 为例。转换为十进制

```js
// 1 * 2^3 + 1 * 2^2 + 0 * 2^1 + 1 * 2^ 0
8 + 4 + 0 + 1
=
13
```

- 结论就是: 长度为 N/ M 为进制 `m * M^(N - 1) ... m * M^0`

## 数值类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/360be176e28f49bebc2bc3cd825e091e.png)

- 可以根据不同的数值长度，给变量定义不同的数据类型
- 定义整型赋值的时候，那个值默认就是 int 类型
- 如果变量声明的时候 long 类型。但是值本身超过了 int 类型的范围，是会报错的。因为值默认是 int 类型，所以要强制声明下 。 例如：`long num = 12345678901`会报错，看如下实例代码

```java
        // 表示进制给十进制进行赋值
        // 表示二进制赋值部分
        int num1 = 0b10;
        // 表示十进制赋值部分
        int num2 = 13;
        // 表示十六进制赋值部分
        int num3 = 0X16;
        // 表示八进制赋值部分
        int num4 = 017;

        System.out.println(num1);
        System.out.println(num2);
        System.out.println(num3);
        System.out.println(num4);

        // 定义byte类型的值 注意不能超过byte类型要求的长度
        byte b = 127;
        System.out.println(b);
        // 定义整型赋值的时候，默认就是十进制
        int i = 1234;
        System.out.println(i);

        // 即使赋值的类型是long类型。但是值超过了int的范围也是报错的。因为value值 默认就是int类型。
        // 除非强制告诉变量 赋值是什么类型的
        long num5 = 12345678910L;
        System.out.println(num5);

        // 在没有超过的情况下 想怎么赋值 就怎么赋值
        long num6 = 6;
        System.out.println(num6);
```

## 浮点数据类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/760d0060d1464d029a43fb18330a6821.png)

> - float 类型是单精度数据类型。有效位数可以是 6~7 位。但是这其实有时候很难满足需求。所以出现了双精度浮点类型
> - double 类型是双精度浮点类型
> - 在实际开发中给变量赋值的浮点类型。默认就是双精度浮点类型

```java
        double d1 = 1.2222;
        float f1 = (float) 2.2222;
```

> - 其实也是可以强制赋值为 float 还是 double 的。在 float 类型后面添加 f/F. 在 double 类型后面添加 d/ D.

```java
        float f2 = 1.2222f;
        double d2 = 3.333d;
```

## 字符类型

> - Java 中使用单引号来表示字符常量，字符型在内存中占两个字节
> - char 类型用来表示 Unicode 编码表中的字符。
> - Unicode 表 是兼容 ASCII 表的

![在这里插入图片描述](https://img-blog.csdnimg.cn/08b3f84be76c4844b8d5adc7205d4099.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/fa333584906343f094750bd6e8df91ec.png)

> - 字符类型的值 是可以参与运算的。并不是直接字符拼接。而是将字符转换为对应的数值，让数值参与运算
> - 字符以及 int 类型的值 是可以相互赋值的。 底层也是转换为 ASCII 码值，再进行赋值的

```java
        char c1 = 'A';
        System.out.println(c1);

        // 字符类型 在参与运行的时候，其实是按照ASCII编码转换为对应的数字，再进行计算的
        System.out.println(c1 + 90);

        // 如果将字符类型的值 赋值给int类型 其实也是通过转换后的数字 赋值给int类型的
        int a = 'B';
        System.out.println(a);

        // 如果将一个数字赋值给了char类型 会将数字转换为char数值 再进行赋值
        char c2 = 20013;
        System.out.println(c2);

        // 在运算之前 先将字符2进行转换为对应的数字
        // 将转换后的数字跟int类型的2 相加
        // 最后因为赋值给char类型 所以将结果再次转换为char类型的值
        char res = 2 + '2';
        System.out.println(res);
```

## 布尔类型

> boolean 类型有两个常量值：true/ false。在内存中占一位(不是比特位，不是字节)

## 基本数据类型转换

- 数据类型范围小的 可以 直接赋值为数据类型范围大的。例如：将 int 类型的值 直接赋值给 double 类型
- 数据类型范围大的 不可以 直接赋值给数据类型范围小的。需要进行强制类型转换，会丢失精度。例如：double 类型的值 不可以直接赋值给 int 类型
- 当多种数据类型参与运算的时候，整数类型/ 浮点类型/ 字符类型 都可以参与运算。但是唯独布尔类型不可以参与运算
- 当多种数据类型 进行运算的时候，类型有级别的概念：byte/short/char < int < long < float < double.
- 当一个表达式中有多种数据类型的时候，要找出当前表达式中级别最高的那个类型，然后其余的类型都转换为当前表达式中级别最高的类型进行计算

```java
        // int 类型 可以直接赋值给 double类型
        double d1 = 10;
        System.out.println(d1);

        // double类型 不能直接赋值给int类型
        int i = (int)10.1;
        System.out.println(i);

        double d2 = 10 + 'a' + 3333l + 22.22f + 22.2;
        System.out.println(d2);
```

- 但是有比较特殊的实例：对于 byte/ short/ char 类型来说，只要在他们表值范围内，赋值的时候不需要强制类型转换
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/d907e6d9aa294f49835cf6e9ceaaad77.png)

```java
// 不需要转换
byte b = 12;

// 需要进行强制类型转换
byte c = 270;
```
