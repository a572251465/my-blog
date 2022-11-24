<div align = "center"><h1>继承以及修饰符</h1></div>

## 继承

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

## 修饰符

> - Java 中存在多种修饰符来代表不同的访问权限

![ ](https://img-blog.csdnimg.cn/22056804b8034ad68595b8858aab4726.png)

- 我们一般在定义属性以及方法的时候，默认就是`defualt`
- 其中使用修饰符`private`是权限最低的，为此我们可以利用这一特性进行封装。将属性私有化，方法共同化
- 以上四种修饰符都可以修饰 属性 以及方法。但是一般我们使用默认值以及`public` 来修饰类
