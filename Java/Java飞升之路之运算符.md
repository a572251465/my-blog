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
