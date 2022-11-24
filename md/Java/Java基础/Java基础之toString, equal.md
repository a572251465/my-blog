<div align = "center"><h1>toString 以及equals方法</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/93a58d5bb6c1490a827844955a0f13ed.png#pic_center)

> - 通过上图可以得知，所有类都默认继承自`Object`基类，下面主要是是讲述下 toString/ equals 方法

## toString

- `toString`函数的含义就是将对象的内容以字符串的形式输出

```Java
        Person p = new Person();
        System.out.println(p); // com.lihh4.Person@1b6d3586
        System.out.println(p.toString()); // com.lihh4.Person@1b6d3586
```

- 如果在打印输出对象的时候，默认就是调用 toString 方法。此时的`toString`方法就是来自基类的`toString`方法
- 其实内部实现就是`getClass().getName() + "@" + Integer.toHexString(hashCode());`
- 但是打印出来的是类名@地址。其实我们可以对 toString 进行重写，然后再次打印

```Java
public class Person {
    String name;
    int age;

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public Person() {}
}
```

## equals

> - 一般我们进行相等判断的方式有多种，其中包括`==` 以及现在我们讲述的 equals
> - 但是如果我们使用`==` 的话，其实比较的是内存地址
> - 所以我们需要退而求其次，选择`equals`. 其实如果在没有重写的情况下，`equals`内部也是使用`==` 所以我们需要重写

```Java
public class Person {
    String name;
    int age;

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public Person() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

```Java
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }
```

- 逐行解释下 上述生成的 equals 含义
  - `this == o` 如果两个对象的引用地址相同的话，那么这两个值一定相同
  - `o == null || getClass() != o.getClass()` 如果传递的对象是 null/ 或 不是一个构造类 表示 false
  - 其余的就是挨个字段进行比较
  - `getClass() != o.getClass()` 此代码类似于`instanceof`
