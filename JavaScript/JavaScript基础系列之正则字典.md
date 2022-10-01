<h1 align = "center">正则字典</h1>

> 核心；正则表达式，要么匹配字符，要么匹配位置

## 1. 模糊匹配

### 1.1 横向匹配

> - 横向匹配 一个正则可匹配的长度是不固定的，可以是多种情况
> - 其实现的方式是使用量词。譬如 {m,n}，表示连续出现最少 m 次，最多 n 次

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc0622e6b07044128b1c7b0d29f1231c.png)

### 1.2 纵向匹配

> - 一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种可能
> - 其实现的方式是使用字符组。譬如 [abc]，表示该字符是可以字符 "a"、"b"、"c" 中的任何一个

![在这里插入图片描述](https://img-blog.csdnimg.cn/163ba8c0022f4ec097107d465cf8b1b2.png)

## 2. 字符组

> 虽叫字符组（字符类），但只是其中一个字符

### 2.1 表示范围

- 比如 [123456abcdefGHIJKLM]，可以写成 [1-6a-fG-M]。用连字符 - 来省略和简写
- 如果多个字符的话，可以用特殊的字符`-` 来进行范围连接。例如`[a-z], [1-9]`
- 既然是有特殊的用途，那么符号`-`就不能作为普通字符串匹配
- 如果想匹配字符串`a-b`， 其实不可以写`[a-b]`. 可以写`[-ab],[ab-],[a\-b]`

### 2.2 排除字符组

- 排除字符组其实很简单。其实就是在字符组内最前面 添加符号`^`. 例如：`[^abc]123` 第一个字母不能是 abc

### 2.3 常见的简写写法

| 字符组 | 含义                   |
| ------ | ---------------------- |
| `\d`   | 表示`[0-9]`            |
| `\D`   | 表示`[^0-9]`           |
| `\w`   | 表示`[0-9a-zA-Z_]`     |
| `\W`   | 表示`[^0-9a-zA-Z_]`    |
| `\s`   | 表示空白符，制表符等   |
| `\S`   | 表示非空白符，制表符等 |

- 表示任意字符`[\s\S] [\d\D] [\w\W]`

## 3. 量词

> 量词也称重复。掌握 {m,n} 的准确含义后，只需要记住一些简写形式

### 3.1 简写形式

| 量词   | 含义                                    |
| ------ | --------------------------------------- |
| `{m,}` | 表示至少出现 m 次                       |
| `{m}`  | 表示只能出现 m 次                       |
| `?`    | 表示`{0,1}`, 可以出现 或是 可以不出现   |
| `+`    | 表示`{1,}`, 表示出现稍稍一次            |
| `*`    | 表示`{0,}` , 表示出现任意次，可以不出现 |

### 3.2 贪婪匹配 以及惰性匹配

> 贪婪匹配：尽量多匹配。 惰性匹配：尽量少匹配

```js
var regex = /\d{2,5}/g;
var string = "123 1234 12345 123456";
console.log(string.match(regex));
// => ["123", "1234", "12345", "12345"]
```

- 上述示例是一个`贪婪匹配`，在能力的满足情况下，要尽量的多匹配

```js
var regex = /\d{2,5}?/g;
var string = "123 1234 12345 123456";
console.log(string.match(regex));
// => ["12", "12", "34", "12", "34", "12", "34", "56"]
```

- 其中 /\d{2,5}?/ 表示，虽然 2 到 5 次都行，当 2 个就够的时候，就不再往下尝试了
- 通过在量词后面加个问号就能实现惰性匹配，因此所有惰性匹配情形如下：
  | 惰性量词 | 贪婪量词 |
  | ------ | ----- |
  | `{m,n}?` | `{m,n}` |
  | `{m,}?` | `{m,}` |
  | `??` | `?` |
  | `+?` | `+` |
  | `*?` | `*` |

## 4 多选分支

> - 一个模式可以实现横向和纵向模糊匹配。而多选分支可以支持多个子模式任选其一
> - 具体形式如下：(p1|p2|p3)，其中 p1、p2 和 p3 是子模式，用 |（管道符）分隔，表示其中任何之一
> - 每个分支最好的办法就是用小括号括起来，避免优先级错误
> - 分支匹配是具有惰性的，如果匹配到了第一个分支。就不会继续匹配了。如下面代码

![在这里插入图片描述](https://img-blog.csdnimg.cn/1b0a98d2065046a08707de22b13e4747.png)

- 比如我用 /good|goodbye/，去匹配 "goodbye" 字符串时，结果是 "good"

```js
var regex = /good|goodbye/g;
var string = "goodbye";
console.log(string.match(regex));
// => ["good"]
```

- 而把正则改成 /goodbye|good/，结果是：

```js
var regex = /goodbye|good/g;
var string = "goodbye";
console.log(string.match(regex));
// => ["goodbye"]
```

## 5. 案例分析

- 匹配 16 进制颜色值

```js
var regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;
var string = "#ffbbad #Fc01DF #FFF #ffE";
console.log(string.match(regex));
// => ["#ffbbad", "#Fc01DF", "#FFF", "#ffE"]
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/4914cf83430b4e1b912da32c8895304d.png)

- 匹配 时分。例如：22:30

```js
var regex = /^([01][0-9]|[2][0-3]):[0-5][0-9]$/;
console.log(regex.test("23:59"));
console.log(regex.test("02:07"));
// => true
// => true
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/870d6f562b814090bfaf491d14728176.png)

- 匹配 yyyy-mm-dd

```js
var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
console.log(regex.test("2017-06-10"));
// => true
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c789e0206f054620b9c9330df89e9796.png)

- window 操作系统文件路径

```js
var regex = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
console.log(regex.test("F:\\study\\javascript\\regex\\regular expression.pdf"));
console.log(regex.test("F:\\study\\javascript\\regex\\"));
console.log(regex.test("F:\\study\\javascript"));
console.log(regex.test("F:\\"));
// => true
// => true
// => true
// => true
```

- 其中，在 JavaScript 中字符串要表示字符 \ 时，也需要转义。

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f7bf53c1d02485a899fadf5b6be72f2.png)

- 匹配 id

```js
let str = '<div id="container" class="main"></div>';
const regx = /id=".*?"/;
const regx1 = /id="[^"]*"/;

console.log(str.match(regx));
console.log(str.match(regx1));
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/672ad2e6ee6246dfb22ddc51cc8363e5.png)

## 6. 匹配位置

### 6.1 关键字符

- `^` 匹配开头，在多行匹配中匹配开头
- `$` 匹配结尾，在多行匹配中匹配结尾

  ```js
  console.log("hello".replace(/^|$/g, "#")); // #hello#
  ```

- `m` 表示开启多行匹配模式
- `\b` 是单词边界，具体就是`\w`以及`\W`之间的位置。也包括 \w 与 ^ 之间的位置，和 \w 与 $ 之间的位置

  ```js
  var result = "[JS] Lesson_01.mp4".replace(/\b/g, "#");
  console.log(result);
  // => "[#JS#] #Lesson_01#.#mp4#"
  ```

- `\B` 其实就是`\b`相反的意思
- `(?=p)` 其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p

  ```js
  var result = "hello".replace(/(?=l)/g, "#");
  console.log(result);
  // => "he#l#lo"
  ```

- `?!p` 其实就是`?=p`的相反的意思

  ```js
  var result = "hello".replace(/(?!l)/g, "#");
  console.log(result);
  // => "#h#ell#o#"
  ```

  ### 6.2 位置特性

  - 对于位置的理解，我们可以理解成空字符 ""

  ```js
  "hello" == "" + "h" + "" + "e" + "" + "l" + "" + "l" + "" + "o" + "";
  ```

#### 6.3 示例

- 千位分隔符

```js
const s2 = "123456789";
console.log(s2.replace(/(?!^)(?=(\d{3})+$)/g, ",")); // 123,456,789
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/a372e60baf71472b849773de49217c3d.png)

- 密码验证

  > 密码长度 6-12 位，由数字、小写字符和大写字母组成，但必须至少包括 2 种字符

  - 首先密码的长度的正则`^[0-9a-zA-Z]{6,12}$`
  - 匹配必须包含数字`(?=.*[0-9])`
  - 匹配必须包含字母`(?=.*[a-z])`

  ```js
  var regex = /(?=.*[0-9])(?=.*[a-z])^[0-9A-Za-z]{6,12}$/;
  ```

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/3918eefc66ea4ac3a5d0a9c9f36c2a2e.png)

## 7. 括号的作用

> 括号的作用是分组 以及数据引用。 看如下实例

### 7.1 示例

#### 7.1.1 无分组示例

- 以日期为例。假设格式是 yyyy-mm-dd 的，我们可以先写一个简单的正则：

```js
var regex = /\d{4}-\d{2}-\d{2}/;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bb7386cf15e544a08115bbd87c5d38c6.png)

#### 7.1.2 有分组示例

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9aa921ab929a4ebea1dbba1ccce4a0c6.png)

- 运行结果

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log(string.match(regex));
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]
```

#### 7.1.3 分组值获取方式

- 另外也可以使用正则实例对象的 exec 方法：

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log(regex.exec(string));
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]
```

- 同时，也可以使用构造函数的全局属性 $1 至 $9 来获取

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
regex.test(string); // 正则操作即可，例如
//regex.exec(string);
//string.match(regex);
console.log(RegExp.$1); // "2017"
console.log(RegExp.$2); // "06"
console.log(RegExp.$3); // "12"
```

### 7.2 替换

- 比如，想把 yyyy-mm-dd 格式，替换成 mm/dd/yyyy 怎么做？

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, "$2/$3/$1");
console.log(result);
// => "06/12/2017"
```

### 7.3 反向引用

> 除了使用相应 API 来引用分组，也可以在正则本身里引用分组。但只能引用之前出现的分组，即反向引用

- 我们来书写正则来匹配下列格式：

  ```js
  2016-06-12
  2016/06/12
  2016.06.12
  ```

  - 刚开始的正则书写

  ```js
  var regex = /\d{4}(-|\/|\.)\d{2}(-|\/|\.)\d{2}/;
  var string1 = "2017-06-12";
  var string2 = "2017/06/12";
  var string3 = "2017.06.12";
  var string4 = "2016-06/12";
  console.log(regex.test(string1)); // true
  console.log(regex.test(string2)); // true
  console.log(regex.test(string3)); // true
  console.log(regex.test(string4)); // true
  ```

- 问题：

  - 其中 / 和 . 需要转义。虽然匹配了要求的情况，但也匹配 "2016-06/12" 这样的数据。

- 新的正则表示方法

  ```js
  var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
  var string1 = "2017-06-12";
  var string2 = "2017/06/12";
  var string3 = "2017.06.12";
  var string4 = "2016-06/12";
  console.log(regex.test(string1)); // true
  console.log(regex.test(string2)); // true
  console.log(regex.test(string3)); // true
  console.log(regex.test(string4)); // false
  ```

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/76f45b38da13491c8bdf9a2adc22bedb.png)

- 注意里面的 \1，表示的引用之前的那个分组 (-|\/|\.)。不管它匹配到什么（比如 -），\1 都匹配那个同
  样的具体某个字符

### 7.4 嵌套括号

- 以左括号（开括号）为准。比如：

```js
var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = "1231231233";
console.log(regex.test(string)); // true
console.log(RegExp.$1); // 123
console.log(RegExp.$2); // 1
console.log(RegExp.$3); // 23
console.log(RegExp.$4); // 3
```

### 7.5 \10 表示什么

> - 另外一个疑问可能是，即 \10 是表示第 10 个分组，还是 \1 和 0 呢？
> - 答案是前者，虽然一个正则里出现 \10 比较罕见。测试如下：

```js
var regex = /(1)(2)(3)(4)(5)(6)(7)(8)(9)(#) \10+/;
var string = "123456789# ######";
console.log(regex.test(string));
// => true
```

- 如果真要匹配 \1 和 0 的话，请使用 (?:\1)0 或者 \1(?:0)。

### 7.6 分组后存在量词怎么办

> - 分组后面有量词的话，分组最终捕获到的数据是最后一次的匹配
> - 以上的结果对反向引用同样是如此

```js
var regex = /(\d)+/;
var string = "12345";
console.log(string.match(regex));
// => ["12345", "5", index: 0, input: "12345"]
```

### 7.7 非捕获括号

> - 如果只想要括号最原始的功能，但不会引用它，即，既不在 API 里引用，也不在正则里反向引用
> - 此时可以使用非捕获括号 (?:p) 和 (?:p1|p2|p3)

```js
var regex = /(?:ab)+/g;
var string = "ababa abbb ababab";
console.log(string.match(regex));
// => ["abab", "ab", "ababab"]
```

### 7.7 练习示例

- 字符串 trim 方法

  - 两种实现方案：
  - 第一种是通过正则表达式来 trim 空格
  - 第二种是通过分组的形式来获取非空格的内容

  ```js
  const str = "  12 34  ";
  const str1 = "  12 34  ";
  const str2 = "   125 34  ";
  console.log(str.replace(/^\s+|\s+$/g, ""));
  console.log(str1.match(/(\S[\s\S]*\S)/));
  console.log(str2.replace(/^\s*(.*?)\s*$/, "$1"));
  ```
