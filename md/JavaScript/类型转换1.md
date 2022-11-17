# 类型转换

## 转换篇

### 1. Boolean(原始类型转布尔)

> 使用函数`Boolean` 进行类型转换

```javascript
console.log(Boolean(false)); // false
console.log(Boolean(0)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(true)); // true
console.log(Boolean(1)); // true
console.log(Boolean(() => {})); // true
console.log(Boolean({})); // true
console.log(Boolean([])); // true
```

| Boolean                          | 结果  |
| -------------------------------- | ----- |
| false                            | false |
| 0                                | false |
| NaN                              | false |
| ''                               | false |
| null                             | false |
| undefined                        | false |
| 以上类型以外(Function/ Array 等) | true  |

### 2. Number(原始类型转数字)

[官方规范](http://es5.github.io/#x9.3)

- 在看实例之前，先看下官方给出的解释
  ![toNumber](https://camo.githubusercontent.com/8c449ea45bde79874a7dfb630a0b6b1c565e693f30c019d3b2ed75ebc3e19d34/68747470733a2f2f67772e616c6963646e2e636f6d2f7466732f544231397932517a4b4c32674b306a535a506858586168765858612d313536322d3136302e6a7067)

> 我们可以使用`Number`函数，将类型转换为数字。如果参数无法转换为数字，则返回 NaN

```javascript
const obj = {
  valueOf: function () {
    return 2;
  },
};

const obj1 = {
  toString: function () {
    return 40;
  },
};

console.log(Number(false)); // 0
console.log(Number(0)); // 0
console.log(Number(NaN)); // NaN
console.log(Number("")); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
console.log(Number(true)); // 1
console.log(Number(1)); // 1
console.log(Number(() => {})); // NaN
console.log(Number({})); // NaN
console.log(Number([])); // 0
console.log(Number(["1"])); // 1
console.log(Number(obj)); // 2
console.log(Number(obj1)); // 40
```

| Number    | 结果 |
| --------- | ---- |
| false     | 0    |
| 0         | 0    |
| NaN       | NaN  |
| ''        | 0    |
| null      | 0    |
| undefined | NaN  |
| []        | 0    |
| {}        | NaN  |
| () => {}  | NaN  |

> - **注意事项**：
>
> 1. `数组` 转换数字的时候，首先调用 toString 函数，再次调用 Number 进行转换

```javascript
const arr = [];
const arr1 = ["2"];
const arr2 = ["1", "2"];

console.log(Number(arr)); // 0  arr 调用toString 是空符串，空符串通过Number转换后结果为0
console.log(Number(arr1)); // 2 arr1 调用toString 是字符串2，字符串2通过Number转换后结果是数字2
console.log(Number(arr2)); // NaN 调用toString 是字符串1,2 字符串1,2通过Number转换后结果是NaN
```

> 2. `对象` 转换数字的时候，会优先调用`valueOf`函数，如果没有的话, 再次调用`toString` 函数

```javascript
const obj = {};
const obj1 = {
  valueOf: function () {
    return "1";
  },
};
const obj2 = {
  toString: function () {
    return "22";
  },
};

const obj3 = {
  valueOf: function () {
    return "33";
  },
  toString: function () {
    return "44";
  },
};

console.log(Number(obj)); // NaN
console.log(Number(obj1)); // 1 直接调用valueOf函数
console.log(Number(obj2)); // 22 调用valueOf函数时没有找到，调用toString方法
console.log(Number(obj3)); // 33 优先调用valueOf函数
```

### 3. String(原始类型转字符)

先看下 es5 代码规范
![toString](https://camo.githubusercontent.com/9eb02e20b0786aba5eab6897f43502bba70aeddccdb2bff6bea24b8ec7824a70/68747470733a2f2f67772e616c6963646e2e636f6d2f7466732f544231654e6e597a486a31674b306a535a467558586372487058612d313830342d3136322e6a7067)

| 参数     | 结果                                    |
| -------- | --------------------------------------- |
| Array    | 调用内部 toString 方法 例如：[1] => “1” |
| 其余的值 | 添加引号字符串直接返回                  |

```javascript
console.log(String(false)); // "false"
console.log(String(true)); // "true"
console.log(String(1)); // "1"
console.log(String("1")); // "1"
console.log(String(null)); // "null"
console.log(String(undefined)); // "undefined"
console.log(Symbol("a")); // "Symbol(a)"
console.log(String(10n)); // "10"
console.log(String({})); // "[object Object]"
console.log(String([1])); // "1"
console.log(String(() => {})); // "() => {}"
```

### 4. 原始类型的值转换对象

> 原始值转换对象非常简单，原始值通过调用 String()/ Number()/ Boolean() 构造函数，转换为它们各自的包装对象

```javascript
const num = 1;
console.log(typeof num); // number
const num1 = new Number(num);
console.log(typeof num1); // object
```

### 5. 对象转字符串和数字

#### 1.

> 1. 对象到字符串和对象到数字的转换都是通过调用待转换对象的一个方法来完成的。而 JavaScript 对象有两个不同的方法来执行转换，一个是 toString，一个是 valueOf。注意这个跟上面所说的 ToString 和 ToNumber 是不同的，这两个方法是真实暴露出来的方法。
> 2. 所有的对象除了 null 和 undefined 之外的任何值都具有 toString 方法，通常情况下，它和使用 String 方法返回的结果一致。toString 方法的作用在于返回一个反映这个对象的字符串，然而这才是情况复杂的开始。

- 然而 JavaScript 下的很多类根据各自的特点，定义了更多版本的 toString 方法。例如:
  - 数组的 toString 方法将每个数组元素转换成一个字符串，并在元素之间添加逗号后合并成结果字符串。
  - 函数的 toString 方法返回源代码字符串。
  - 日期的 toString 方法返回一个可读的日期和时间字符串。
  - RegExp 的 toString 方法返回一个表示正则表达式直接量的字符串。

```javascript
console.log({}.toString()); // [object Object]

console.log([].toString()); // ""
console.log([0].toString()); // 0
console.log([1, 2, 3].toString()); // 1,2,3
console.log(
  function () {
    var a = 1;
  }.toString()
); // function (){var a = 1;}
console.log(/\d+/g.toString()); // /\d+/g
console.log(new Date(2010, 0, 1).toString()); // Fri Jan 01 2010 00:00:00 GMT+0800 (CST)
```

#### 2.

> 了解了 toString 方法和 valueOf 方法，我们分析下从对象到字符串是如何转换的。看规范[ES5 9.8](http://es5.github.io/#x9.8)，其实就是 ToString 方法的对应表，只是这次我们加上 Object 的转换规则：

| 参数   | 结果                                                                        |
| ------ | --------------------------------------------------------------------------- |
| Object | 1. primValue = ToPrimitive(input, String)<br/> 2. 返回 ToString(primValue). |

所谓的 ToPrimitive 方法，其实就是输入一个值，然后返回一个一定是基本类型的值。

我们总结一下，当我们用 String 方法转化一个值的时候，如果是基本类型，就参照 “原始值转字符” 这一节的对应表，如果不是基本类型，我们会将调用一个 ToPrimitive 方法，将其转为基本类型，然后再参照“原始值转字符” 这一节的对应表进行转换。

对象转换数字同样如此

#### ToPrimitive

那接下来就要看看 ToPrimitive 了，在了解了 toString 和 valueOf 方法后，这个也很简单。

```text
ToPrimitive(input[, PreferredType])
```

- 第一个参数是 input，表示要处理的输入值。
- 第二个参数是 PreferredType，非必填，表示希望转换成的类型，有两个值可以选，Number 或者 String。
- 当不传入 PreferredType 时，如果 input 是日期类型，相当于传入 String，否则，都相当于传入 Number。
- 如果传入的 input 是 Undefined、Null、Boolean、Number、String 类型，直接返回该值。
- 如果是 ToPrimitive(obj, Number)，处理步骤如下：
  - 如果 obj 为 基本类型，直接返回
  - 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
  - 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
  - 否则，JavaScript 抛出一个类型错误异常。
- 如果是 ToPrimitive(obj, String)，处理步骤如下：
  - 如果 obj 为 基本类型，直接返回
  - 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
  - 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
  - 否则，JavaScript 抛出一个类型错误异常。

```javascript
console.log(Number({})); // NaN
console.log(Number({ a: 1 })); // NaN

console.log(Number([])); // 0
console.log(Number([0])); // 0
console.log(Number([1, 2, 3])); // NaN
console.log(
  Number(function () {
    var a = 1;
  })
); // NaN
console.log(Number(/\d+/g)); // NaN
console.log(Number(new Date(2010, 0, 1))); // 1262275200000
console.log(Number(new Error("a"))); // NaN
```

- 注意，在这个例子中，[] 和 [0] 都返回了 0，而 [1, 2, 3] 却返回了一个 NaN。我们分析一下原因：
  - `Number([])` 执行这个代码时会触发调用 valueOf 方法，会返回一个[], 结果还不是原始类型。所以调用 toString 方法，返回一个空字符串，接下来按照 toNumber 规范的方法将空字符串转换为 0
  - 我们 `Number([1, 2, 3])` 的时候，先调用 `[1, 2, 3] `的 valueOf 方法，此时返回 [1, 2, 3]，再调用 toString 方法，此时返回 1,2,3，接下来调用 ToNumber，参照对应表，因为无法转换为数字，所以最后的结果为 NaN

### 6. JSON.stringify

> 值得一提的是：JSON.stringify() 方法可以将一个 JavaScript 值转换为一个 JSON 字符串，实现上也是调用了 toString 方法，也算是一种类型转换的方法。下面讲一讲 JSON.stringify 的注意要点：

- 处理基本类型时，与使用 toString 基本相同，结果都是字符串，除了 undefined

```javascript
console.log(JSON.stringify(null)); // null
console.log(JSON.stringify(undefined)); // undefined，注意这个undefined不是字符串的undefined
console.log(JSON.stringify(true)); // true
console.log(JSON.stringify(42)); // 42
console.log(JSON.stringify("42")); // "42"
```

- 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。

```javascript
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]); // "[1,"false",false]"
```

- undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。

```javascript
JSON.stringify({ x: undefined, y: Object, z: Symbol("") });
// "{}"

JSON.stringify([undefined, Object, Symbol("")]);
// "[null,null,null]"
```

- JSON.stringify 有第二个参数 replacer，它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些应该被排除。

```javascript
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}

var foo = {
  foundation: "Mozilla",
  model: "box",
  week: 45,
  transport: "car",
  month: 7,
};
var jsonString = JSON.stringify(foo, replacer);

console.log(jsonString);
// {"week":45,"month":7}

var foo = {
  foundation: "Mozilla",
  model: "box",
  week: 45,
  transport: "car",
  month: 7,
};
console.log(JSON.stringify(foo, ["week", "month"]));
// {"week":45,"month":7}
```

- 如果一个被序列化的对象拥有 toJSON 方法，那么该 toJSON 方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用 toJSON 方法后的返回值会被序列化，例如：

```javascript
var obj = {
  foo: "foo",
  toJSON: function () {
    return "bar";
  },
};
JSON.stringify(obj); // '"bar"'
JSON.stringify({ x: obj }); // '{"x":"bar"}'
```
