# 前言

<hr />

举个例子：
`console.log(1 + '1')`

- 在 JavaScript 中，这是完全可以运行的，不过你有没有好奇，为什么 1 和 '1' 分属不同的数据类型，为什么就可以进行运算呢？
- 这其实是因为 JavaScript 自动的将数据类型进行了转换，我们通常称为隐式类型转换。但是我们都知道，+运算符既可以用于数字加法，也能用于字符串拼接，那在这个例子中，是将数字 1 转成字符串 '1'，进行拼接运算？还是将字符串 '1' 转成数字 1，进行加法运算呢？

## 一元操作符 +

<hr />

> 当`+`号运算符作为一元操作符的时候，会调用`toNumber`处理该值。相当于调用了`Number` 函数

```javascript
const obj = {
  valueOf() {
    return "2222";
  },
};

console.log(+2); // 2
console.log(+false); // 0
console.log(+true); // 1
console.log(+null); // 0
console.log(+undefined); // NaN
console.log(+"2"); // 2
console.log(+"2.2"); // 2.2
console.log(+{}); // NaN
console.log(+[]); // 0
console.log(+["1"]); // 1
console.log(+[1, 2, 3]); // NaN
console.log(+function () {}); // NaN
console.log(+obj); // 2222
```

- 分析下上述实例`+[]`
  - 既然是调用`ToNumber`方法。当输入的值是对象的时候，会先调用`ToPrimitive(input, Number)`方法，判断的步骤如下：
  - 如果 obj 是基本数据类型的话，直接返回
  - 否则调用`valueOf` 方法，如果返回一个原始值，则`JavaScript` 将其返回
  - 否则调用`toString`方法，如果返回一个原始值，则`JavaScript` 将其返回
  - 否则，JavaScript 抛出一个类型错误异常
  - 实例案例分析：
    - 当遇到代码`+[]`的时候，首先会调用函数`valueOf`, 会返回一个原数组`[]`
    - 紧接着调用函数`toString`方法，返回的结果是空字符串
    - 空字符通过函数`Number`进行转换，得到的是数字 0

## 二元操作符+

<hr />

> [ES5 规范](http://es5.github.io/#x11.6.1)

> - 到底当执行 + 运算的时候，会执行怎样的步骤呢？让我们根据规范 11.6.1 来捋一捋：
>   - 当计算 value1 + value2 时：
>   - lprim = ToPrimitive(value1)
>   - rprim = ToPrimitive(value2)
>   - 如果 lprim 是字符串或者 rprim 是字符串，那么返回 ToString(lprim) 和 ToString(rprim)的拼接结果
>   - 反之 返回 ToNumber(lprim) 和 ToNumber(rprim)的运算结果

```javascript
console.log(1 + "2"); // 12
console.log(1 + null); // 1
console.log(1 + undefined); // NaN
console.log(1 + true); // 2
console.log(1 + false); // 1
```

- 1. Null 与 数字

```javascript
console.log(null + 1);
```

- 按照规范的步骤进行分析：

  - lprim = ToPrimitive(null) 因为 null 是基本类型，直接返回，所以 lprim = null
  - rprim = ToPrimitive(1) 因为 1 是基本类型，直接返回，所以 rprim = null
  - lprim 和 rprim 都不是字符串
  - 返回 ToNumber(null) 和 ToNumber(1) 的运算结果

- 2. 数组与数组

```javascript
console.log([] + []);
```

- 按照规范的步骤进行分析：

  - lprim = ToPrimitive([])，[]是数组，相当于 ToPrimitive([], Number)，先调用 valueOf 方法，返回对象本身，因为不是原始值，调用 toString 方法，返回空字符串""
  - rprim 类似。
  - lprim 和 rprim 都是字符串，执行拼接操作

- 3. 数组与对象

```javascript
console.log([] + {});
console.log({} + []);
```

- 按照规范的步骤进行分析：

  - lprim = ToPrimitive([])，lprim = ""
  - rprim = ToPrimitive({})，相当于调用 ToPrimitive({}, Number)，先调用 valueOf 方法，返回对象本身，因为不是原始值，调用 toString 方法，返回 "[object Object]"
  - lprim 和 rprim 都是字符串，执行拼接操作

- 3.1 注意

<hr />

> 以上的运算都是在 console.log 中进行，如果你直接在 Chrome 或者 Firebug 开发工具中的命令行直接输入，你也许会惊讶的看到一些结果的不同，比如：
> ![](https://camo.githubusercontent.com/8e967a28b4ae2d67cd7bf57d86463f6c31fb39e1ec20f4e5c6c10d35da9a734c/68747470733a2f2f67772e616c6963646e2e636f6d2f7466732f5442315737704941585937674b306a535a4b7a585861696b7058612d313032322d38322e6a7067)

- 结果又变成了正确的值，这是为什么呢？
- 其实，在不加括号的时候，{} 被当成了一个独立的空代码块，所以 {} + [] 变成了 +[]，结果就变成了 0

## 相等

<hr />

- "==" 用于比较两个值是否相等，当要比较的两个值类型不一样的时候，就会发生类型的转换。
- 关于使用"=="进行比较的时候，具体步骤可以查看[规范 11.9.5：](http://es5.github.io/#x11.9.3)
  - 当执行 x == y 时：
    - 如果 x 与 y 是同一类型:
      - x 是 Undefined，返回 true
      - x 是 Null，返回 true
      - x 是数字：
        - x 是 NaN，返回 false
        - y 是 NaN，返回 false
        - x 与 y 相等，返回 true
        - x 是+0，y 是-0，返回 true
        - x 是-0，y 是+0，返回 true
        - 返回 false
      - x 是字符串，完全相等返回 true,否则返回 false
      - x 是布尔值，x 和 y 都是 true 或者 false，返回 true，否则返回 false
      - x 和 y 指向同一个对象，返回 true，否则返回 false
    - x 是 null 并且 y 是 undefined，返回 true
    - x 是 undefined 并且 y 是 null，返回 true
    - x 是数字，y 是字符串，判断 x == ToNumber(y)
    - x 是字符串，y 是数字，判断 ToNumber(x) == y
    - x 是布尔值，判断 ToNumber(x) == y
    - y 是布尔值，判断 x ==ToNumber(y)
    - x 是字符串或者数字，y 是对象，判断 x == ToPrimitive(y)
    - x 是对象，y 是字符串或者数字，判断 ToPrimitive(x) == y
    - 返回 false

1. null 和 undefined

```javascript
console.log(null == undefined);
```

看规范第 2、3 步：

> - x 是 null 并且 y 是 undefined，返回 true
> - x 是 undefined 并且 y 是 null，返回 true

2. 字符串与数字

```javascript
console.log("1" == 1);
```

结果肯定是 true，问题在于是字符串转化成了数字和数字比较还是数字转换成了字符串和字符串比较呢？
看规范第 4、5 步：

> - x 是数字，y 是字符串，判断 x == ToNumber(y)
> - x 是字符串，y 是数字，判断 ToNumber(x) == y

3. 布尔值和其他类型

```javascript
console.log(true == "2");
```

当要判断的一方出现 false 的时候，往往最容易出错，比如上面这个例子，凭直觉应该是 true，毕竟 Boolean('2') 的结果可是 true，但这道题的结果却是 false。

归根到底，还是要看规范，规范第 6、7 步：

> - x 是布尔值，判断 ToNumber(x) == y
> - y 是布尔值，判断 x ==ToNumber(y)

- 当一方出现布尔值的时候，就会对这一方的值进行 ToNumber 处理，也就是说 true 会被转化成 1，
- true == '2' 就相当于 1 == '2' 就相当于 1 == 2，结果自然是 false。

4. 对象与非对象

```javascript
console.log(42 == ["42"]);
```

看规范第 8、9 步：

> - x 不是字符串或者数字，y 是对象，判断 x == ToPrimitive(y)
> - x 是对象，y 不是字符串或者数字，判断 ToPrimitive(x) == y

- 这个例子为例，会使用 ToPrimitive 处理 ['42']，调用 valueOf，返回对象本身，再调用 toString，返回 '42'
- 42 == ['42'] 相当于 42 == '42' 相当于 42 == 42，结果为 true

## 注意：

- `Number([null]) === "" // true`
- `Number([undefined]) === "" // true`
