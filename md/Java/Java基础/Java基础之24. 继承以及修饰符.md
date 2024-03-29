<div align = "center"><h1>继承以及修饰符</h1></div>

> - 类是对 对象的抽象
> - 继承是对类的抽象

## 1. 继承

> - 继承可以提高代码的复用性
> - 继承可以有助于代码逻辑的扩展

```Java
// ----------------- 表示Person 类 ------------------------------
public class Person {
    String name;
    int age;
    private double height;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }
}

// 表示子类
public class Girl extends Person {
    String address;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
```

- 上述实例其实就是继承的实例。
- 继承中使用关键字`extends` 来实现继承。
- 继承关系中，一个父类可以有多个孩子，但是每个孩子只能直接继承一个父亲
- 继承属性以及方法 具有穿透性。就是孙子可以通过这种特性 来继承爷爷的属性以及方法
- 所有的类都是直接或是间接的继承`Object`

### 1.1 继承范围

| 是否继承\范围 | 属性 | 方法 | 静态属性以及方法 |
| ------------- | ---- | ---- | ---------------- |
| -             | √    | √    | √                |

> 注意点 1：父类 private 修饰的内容，子类其实也继承了。只是因为封装的特性阻碍了直接调用，可以使用 set/get 等间接的方式来调用

![在这里插入图片描述](https://img-blog.csdnimg.cn/cd5a9151aefd407699c0259f5342d336.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/c6d4c7621cd5479fa98f4705f1bea4f7.png)

## 2. 修饰符

> - Java 中存在多种修饰符来代表不同的访问权限

![ ](https://img-blog.csdnimg.cn/22056804b8034ad68595b8858aab4726.png)

> 上述的子类/ 所有类 指的是不同包下

- 我们一般在定义属性以及方法的时候，默认就是`defualt`
- 其中使用修饰符`private`是权限最低的，为此我们可以利用这一特性进行封装。将属性私有化，方法共同化
- 以上四种修饰符都可以修饰 属性 以及方法。但是一般我们使用默认值以及`public` 来修饰类
