<h1 align = "center">this详解</h1>

> this 可以表示是使用对象 或是 调用对象本身。 总之就是 this 其实指向的实例自己

![在这里插入图片描述](https://img-blog.csdnimg.cn/14d07016910243d1bff8971c4a6d1ab1.png)

## 1. 代表属性

- 当成员变量的名称 跟 形参或是局部变量的名称一致的时候，可以使用 this 来表示使用的是成员变量。 当然如果名称不同的话，this 是可以默认不写的

```shell
    public Person(Integer age, String name, String address) {
        this.age = age;
        this.name = name;
        this.address = address;
    }
```

## 2. 代表方法

- 跟代表属性一样，既然可以代表属性，那么一样可以表示实例的方法

```shell
public class Person {
  public void say() {
    this.eat();
  }

  public void eat() {

  }
}
```

## 3. 代表构造函数

```shell
    public Person(String name) {
        this.name = name;
    }

    public Person(Integer age, String name) {
        this(name);
        this.age = age;
    }

    public Person(Integer age, String name, String address) {
        this(age, name);
        this.address = address;
    }
```
