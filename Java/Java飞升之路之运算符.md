## 运算符

### 除法/ 余

- 除法 `/`
- 余 `%`

```java
public class TestOpe {
    public static void main(String[] args) {
        System.out.println(12 / 3);
        System.out.println(12 % 5);
        System.out.println(12 / 3.0);
        System.out.println(12 % 5.0);
    }
}
```

### 加法

- 表示正数
- 运算
- 字符串拼接
- 规则：+左右两侧的任意一侧有字符串，那么这个加号就是字符串拼接的结果，结果一定是字符串

```java
System.out.println(5 + '6') // 59
System.out.println("5" + '6') // 56
```

### 自增

```java
public class TestOpe {
    public static void main(String[] args) {
        int a = 5;

        System.out.println(a++ + a ++); // 5 + 6 a => 7
        System.out.println(a++ + ++a); // 8 + 8 a => 9
        System.out.println(++a + a++); // 10 + 10  => 11
        System.out.println(++a + ++a); // 12 + 13 => 13
    }
}
```

- `++a` 先进行自增，将变换后的值拿出来参与运算
- `a++`先将自身的值拿出来参与运算，然后进行自增

### 逻辑运算符

> & | && || ! ^

- `&` 逻辑与。只要有一个操作数是 false，结果就是 false
- `&&` 短路与。只要前面的操作数是 false，后面的操作数不做判断。跟`&` 不同
- `|` 逻辑或。只要有一个操作数是 true，结果就是 true
- `^` 逻辑异或。两个操作数一样是 false，如果两个操作数不同的话就是 true
