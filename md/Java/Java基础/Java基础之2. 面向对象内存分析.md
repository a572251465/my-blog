<h1 align = "center">面向对象内存分析</h1>

> 针对创建对象的过程 实现手绘的内存分析，加深记忆

## 1. 分析 1

- 源代码

```shell
package plus.lihh.pojo1;

public class Person {
    int id;
    int age;

    public static void main(String[] args) {
        Person person = new Person();
        System.out.println(person.age);
        System.out.println(person.id);
    }
}
```

- 手绘图

![在这里插入图片描述](https://img-blog.csdnimg.cn/c330636584e94b4c9f9a7bd103f11318.png)

- 大致过程

  - 上述的截图中大致分为三块区域`栈`, `堆`, `方法区`
  - 在代码初期执行的时候 已经将类的字节码 class，存放到方法区中了
  - 首先开始执行`main`方法帧，在 main 方法中存在代码`Person p1 = new Person()`. 执行代码中右侧部分，开始执行 new 的部分
  - 然后会根据类字节码信息实例化一个对象`0x99`存放到堆中。同时设置并且初期化成员变量。
  - 等实例化结束后，会将类的实例给成员变量`p1`. 同时`p1` 存放到栈中的
  - 通过上述可以得到，类的实例 => 堆中， 局部变量 => 栈中

## 2. 分析 2

![在这里插入图片描述](https://img-blog.csdnimg.cn/562d9a4ccdb44004843e514210d2a009.png)

- 整个内存分析过程根分析 1 基本保持一致，但是还是略有不同
  - 每个函数都会产生的栈帧 都会放到栈中
  - 如果遇到字符串常量的话，都会放到字符串常量池中，而且是唯一的
