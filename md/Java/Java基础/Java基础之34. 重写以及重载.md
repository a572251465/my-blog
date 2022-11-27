<div align = "center"><h1>重载以及重写</h1></div>

## 1. 函数重载

<hr />

### 1.1 定义

> - 在同一个类中，方法名称相同，形参列表不同的，就构成了方法重载
> - 重载只跟：方法名以及形参列表有关，与修饰符以及返回值类型无关
> - 注意：形参列表不同是什么不同？？？
>   - 个数不同
>   - 顺序不同
>   - 类型不同
> - 在函数重载过程中，如果出现了个数相同，顺序相同，类型不同的时候，调用方法会按照`byte/ short/ char => int => long => float => double`. 先执行跟自己数据类型一致的类型，依次向右寻找

```java
    public static void main(String[] args) {
        add(2, 2);
        add(2, 1,2);
        add(2.1, 2.2);
    }

    public static int add(int a, int b) {
        return a + b;
    }

    public static double add(double a, double b) {
        return a + b;
    }

    public static int add(int a, int b, int c) {
        return a + b + c;
    }
```

## 2. 函数重写

- 其实函数的重载以及重写不具有任何比较性的意义。但是这样还是会拿来做硬性比较的
- 重写的条件：方法名称相同，参数列表相同，而且必须是继承关系中

- 这里有特别重要的点：
  - 关于重写，父类的返回类型大于子类
  - 关于重写，父类的权限修饰符小于子类
  - 这一切都是安全的角度来说的。返回值比子类的大，是为了自动类型转换为了兼容。而修饰符比子类小是为了子类能够重写

![在这里插入图片描述](https://img-blog.csdnimg.cn/df38e92629d24442981371560f573493.png)
