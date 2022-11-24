<div align = "center"><h1>对象以及类</h1></div>

> 1. Java 中 万事万物皆对象。一切都是可以按照对象来形式。
> 2. 类是对 对象具体事务的一种抽象。可以理解为类是对象更高级的抽象。然后也可以按照这个类生成具有相同特征的很多对象

```Java
public class Person {
    String name;
    int age;
    double height;
    double weight;

    public void eat() {
        System.out.println("我在吃饭");
    }

    public void sleep(String address) {
        System.out.println("我在" + address + "睡觉");
    }

    public String introduce() {
        return "我的名字是：" + this.name + ", 我的年龄是：" + this.age;
    }
}
```

## 1. 类实例化过程

> `Person p = new Person()`

![在这里插入图片描述](https://img-blog.csdnimg.cn/71708f7818344cd58c41a5a1447c380d.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb6e0a4eeb2e47059420b78a63612c30.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/10a0b067bf0d423c88ed06b3faea0dd6.png#pic_center)

- 第一次加载 class 的时候，会优先执行 loadClass 来加载类
- 给类中成员属性 分配初始化默认值
- 给实例化对象 在堆中分配内存空间
- 将分配的内存地址 复制给变量

## 2. 局部变量以及成员变量区别：

- 不同点：

  - 成员变量：xxx
  - 局部变量：yyy

- 位置不同：

  - 类中，以及方法以外定义的
  - 方法中的变量， 代码块中变量

- 作用范围
  - 当前类的方法中
  - 当前方法或是当前代码块
- 默认值
  - 根据不同的类型，有不同的初始值
  - 无初始值
- 初始化
  - 不需要初始化
  - **使用前一定要进行初始化**
- 内存位置
  - 保存在堆中
  - 保存在栈中

## 3. 构造方法 以及普通方法的不同

> 构造器的作用：不是为了创建对象，因为在调用构造器之前，这个对象已经创建好了。并且属性有默认的初始化的值。 调用构造器的目的是为了给属性赋值

- 在使用上没有什么不同。其实会发现当我们进行 new 的过程中，就是在调用构造函数`Person p = new Person()`
- 只不过如果我们不写构造方法的话，系统会默认设置一个空的构造方法
- 但是在使用的过程中，**还是需要注意下几点不同**：
  - 构造方法的名称必须跟类名称保持一致
  - 构造方法没有返回值
  - 构造方法中不能出现`return`的字眼
  - 构造方法的出现不是为了创建对象，而是为了对成员变量进行初始化

### 构造函数注意点：

- 一般保证空构造函数的存在，空构造器一般不会对属性进行赋值
- 如果想对属性进行赋值，可以通过构造器进行重载

## 4. 静态以及非静态

![在这里插入图片描述](https://img-blog.csdnimg.cn/91b911c8510847c9abb991261a61616e.png#pic_center)

```Java
public class Test {
    int a;
    static int b;
    public static void main(String[] args) {
        Test t1 = new Test();
        t1.a = 10;
        t1.b = 20;

        Test t2 = new Test();
        t2.a = 30;
        t2.b = 40;

        System.out.println(t1.a);
        System.out.println(t1.b);

        System.out.println(t2.a);
        System.out.println(t2.b);
    }
}
```

- 在加载 class 字节码文件的时候，同样会生成一个对应的静态域，静态域中存放着属性以及方法
- 静态域中的属性以及方法 对于多个实例来说是共享的
- 静态域的生成优先于 class 对象
- 所以造就了 静态方法中 不能调用非静态的属性以及方法
