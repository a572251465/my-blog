<div align = "center"><h1>泛型</h1></div>

> 泛型泛指一类数据类型，其实是从编译以及语法层面进行类型约束

## 简单定义 以及使用

<hr />

- 如何定义

```Java
public class User<K> {
    K name;
    int age;

    public K getName() {
        return name;
    }

    public void setName(K name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

- 如何使用

```Java
public class Test {
    public static void main(String[] args) {
        // ---------- 没有设置数据类型 默认都是Object类型
        User u = new User();
        u.setName(false);

        // --------- 设置数据类型
        User<String> u1 = new User();
        u1.setName("lxx");
    }
}
```

## 定义泛型方法

<hr />

```Java
public class Girl<T> extends User {
    T school;

    public void setSchool(T school) {
        this.school = school;
    }

    public T getSchool() {
        return school;
    }

    // 次方法为泛型方法
    public <M> void eat(M names) {
        System.out.println(names);
    }
}
```

## 继承以及泛型通配符

<hr />

```Java
        // Object/ Object[] 与String/ String[] 存在继承关系 父类声明 子类实例
        Object o = new Object();
        String s = new String();
        o = s;

        Object[] oArr = new Object[10];
        String[] sArr = new String[10];
        oArr = sArr;

        List<Object> ol = new ArrayList<>();
        List<String> os = new ArrayList<>();
        // 不存在继承关系 泛型只是从语法层面进行约束。但是ArrayList 本质上都是数组
//        ol = os;

        List<?> l = new ArrayList<>();
        l = ol;
        l = os;
```

- 可以使用泛型通配符`List<?> l = new ArrayList<>();`

## 类型受限

<hr />

```Java
        List<Object> l1 = new ArrayList<>();
        List<User> l2 = new ArrayList<>();
        List<Girl> l3 = new ArrayList<>();

        // 表示类型上限 表示其以及子类 都可以赋值
        List<? extends User> l4 = new ArrayList<>();
        l4 = l2;
        l4 = l3;
//        l4 = l1;

        // 表示类型的下限 表示其以及父类，祖父类等 都可以赋值
        List<? super User> l5 = new ArrayList<>();
        l5 = l1;
        l5 = l2;
//        l5 = l3;
```

- `<? extends User>` 表示类型上限 表示其以及子类 都可以赋值
- `<? super User>` 表示类型的下限 表示其以及父类，祖父类等 都可以赋值
