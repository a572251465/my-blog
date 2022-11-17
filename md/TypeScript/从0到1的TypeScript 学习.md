## 前言

> 对于前端人来说`TypeScript`应该不陌生，它的重要性不言而喻。其实本人也系统学习过`TypeScript`几次了，但是从来没有认真的记录过学习过程，正好因为疫情封闭在家，学习过程中正好记录下，从 0 到 1，从简单到高级，咱们一步一步来

### 划重点

#### 1. 关于`any`

- 任何类型(除了`never`外)跟`any`交集都是 any 本身

```ts
type A = 1 & any // any
type B = true & any // any
type C = '1' & any // any
```

- 判断一个类型是`any`类型

```ts
type isAny<T> = 0 extends 1 & T ? true : false
```

#### 2. 关于`unknown`

- 任何类型跟`unknown`交集都是其本身
- 任何类型跟`unknown`并集都是`unknown`
  **- 类型`unknown`不能赋值给任意类型(`自身`以及`any`除外)**
- `unknown`的`keyof` 是`never` => `keyof unknown // never`

```ts
type a = 1 & unknown // 1
type b = false & unknown // false
type c = any & unknown // any
type d = never & unknown // never

type e = string | unknown
type f = boolean | unknown
```

- 如果判断一个类型是`unknown`类型

```ts
type isUnknown<T> = keyof T extends never ? true : false
```

#### 3. 关于类型:元组=>联合

- 实现元组类型转换联合类型相对来说比较简单，使用内置操作。而且是数组/元组独有的，看下面实例：

```ts
type TupleToUnion<T extends any[]> = T[number]
type A = TupleToUnion<[string, number, boolean]> // string | number | boolean
type B = TupleToUnion<number[]> // number
type C = TupleToUnion<(number | string)[]> // number | string
```

#### 4. 关于`never`

- `never`是任意类型的子类
- **任何类型都不能赋值给`never`，`never`自身除外**

```ts
type a = number extends never ? 1 : 2 // 2
type b = never extends number ? 1 : 2 // 1
type c = [any] extends [never] ? 1 : 2 // 2
type d = never extends any ? 1 : 2 // 1
```

- 判断类型是否是一个`never`类型

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

## 基本类型

### string 类型

```ts
let str: string // √
str = '2'
let str1 = '1' // √

str1 = 1 // ×
```

> 上述是关于字符串类型的书写，可以通过一个规律表现出：冒号后面的就是类型描述，通过上述代码我们也可以发现一些规律
>
> - 我们可以通过`:string` 来描述 string 类型
> - 如果存在一些默认值，我们可以通过推导得到类型.例如：`let str1 = '1'`。
> - 如果一个变量一旦标记为一种类型，就不可以将另一种类型的值赋过去
> - 上述的解释，合适不复杂的所有类型，下面就不做过多的阐述了

#### string 类型特殊讲解

```ts
let a: string = '1' // √
let b: String = '1' // √

let b: String = new String('2') // √
let c: string = new String('2') // ×
```

- 上述的实例讲述了在声明`string`类型以及`String`类型有什么不同
  - 首先`string`用来声明基本数据类型，`String`是包装对象数据类型
  - 因为字符串`1` 本身也是包装类型`String`的实例，所以`let b: String = '1'`是对的，但是反过来不行

### boolean 类型

```ts
let flag: boolean
flag = true

let flag1 = false
```

### number 类型

```ts
let num: number
num = 1

let num1 = 2
```

### 联合数据类型

> 一般我们进行标记的时候，一个变量会被标记一种类型，但是如果真的在业务中出现了一个变量需要多种数据类型怎么办呢？？？ 这个时候我们就可以使用联合数据类型

```ts
let a: number | string
a = '1'
a = 1

let b: number | string | boolean
```

- 我们可以用符号`|`来描述多种数据类型，表示既可以赋值为`A`类型也是可以赋值为`B`类型

#### 字面量类型

> 使用联合类型的时候，还可以定义字面量类型

```ts
let IType = 'up' | 'down' | 'left' | 'right'

const a: IType = 'up' // √
const b: IType = 'up1' // ×
```

### 数组类型

> 我们同样可以给数组进行类型标记

```ts
let arr: number[] = [1, 2, 3] // √
let arr1: Array<number> = [1, 2, 3] // √

let arr2: number[] = [1, 2, '3'] // ×
```

- 我们可以给数组标记类型，在真实的业务中一组数组都是具有一种类型，就好比上述实例
- 但是标记数组类型有两种方式，就是上述两种
- 数组中的值类型只能是标记的类型，如果出现不同的类型就会出错，例如上述最后一个实例
- 如果业务中出现了数组需要存在多种数据类型怎么办呢？？？那肯定是用联合类型. `const arr3: (string | number)[] = []`

### 元组类型

> 标记数组类型，无非固定指定位置是什么类型，但是我们的元组可以。可以将元组理解为数组的另一种表现形式

```ts
let arr: [string, number] = ['1', 1] // √
arr.push(2)
console.log(arr[2]) // ×

let arr1: [string, number] = [1, 1] // ×
console.log(arr1[2]) // √
```

- 元组的声明可以规定指定位置指定类型
- 只能通过下标来获取值
- 元素不能扩展，就算扩展后也不能获取超出初始下标长度的值
- 而且赋值的类型位置必须一一对应起来
- 元组在一般的业务中用途较少，但是在复杂类型中能获取到比较好的效果，在后续的实例中会慢慢讲述

### null 以及 undefined 类型

```ts
let a: null = null
let b: undefined = undefined
```

- 使用相对简单，不做过多的说明

### any 类型

> - 在`TypeScript`中如果没有声明类型的话，默认就是`any`类型
> - 如果是标注了`any`类型，就是默认跳过类型提示。原则上不允许标注`any`类型。但是一些特殊场合下也可以使用
> - 也可以在配置文件中配置允许使用`any`
> - **`any`类型可以赋值给任意类型，除了`never`类型除外**

```ts
let a: any = 1

let b: string = a
let c: boolean = a

// 特殊场合使用`any`类型
interface IFn {
  (value: string, ...args: any[]): void
}
```

### unknown 类型

> 其实`unknown`跟`any`不同，如果使用`any`会跳过类型检查，表示任意类型都可以。但是`unknown`表示不知道什么类型

```ts
type test = unknown extends any ? 1 : 2 // 1
type test1 = unknown extends boolean ? 1 : 2 // 2
type test2 = unknown extends Function ? 1 : 2 // 2
// ...
```

- **类型为`unknown` 只能赋值给类型为`any`的值。反之都报错**
- 任意类型的值都可以赋值给`unknown`类型

### never 类型

> - 我将`never`类型理解为不可到达类型，理解为不存在类型
> - **类型`never` 是任意类型的子类**

```ts
function test(): never {
  while (true) {}
}

let test1: never = test()
```

### 枚举类型

> 一般我们在使用某个对象的 XXX 类型的时候，可以使用枚举类型

```ts
enum A {
  add, // add => 0
  minus, // minus => 1
  mult, // mult => 2
  divis // divis => 3
}

const enum A {
  add, // add => 0
  minus, // minus => 1
  mult, // mult => 2
  divis // divis => 3
}

enum B {
  add, // add => 0
  minus = 'minus', // minus => minus
  mult, // ERROR 报错
  divis
}

enum C {
  add, // add => 0
  minus = 'minus', // minus => minus
  mult = 1, // mult => 1
  divis // divis => 2
}
```

- 上述列举了不同情况下的枚举使用情况
  - 声明枚举类型的时候，ts 会默认添加值，默认是从`0`开始
  - 如果中途一旦出现赋值了非数字的值，后续的必须都进行赋值，例如实例 3
  - 如果中途又赋值了数字值，之后的 ts 可以自己推导
  - **普通枚举以及常量枚举有什么不同呢？？？ 普通枚举编译后会成为对象，但是常量枚举在编译后会成为替换的值**

### 断言

> 在这里先进行阐述下，断言一般分为两种`as` 以及`!`。 强行断言以及非空断言。那我们一般在什么场合下使用他们呢

#### as 断言

```ts
// 案例1：
let n: string | number

// 如果此时我们调用`变量n`上的方法，只能调用string以及number上共同方法，那就想调用string上的方法呢？？？
;(n as string).startsWith('http')

// 实例2
let arr = Array.from({ length: 3 }).map(() => {
  return { name: 'test', age: 22 } as { name: string; age: number }
})

// 实例3
const app: HtmlElement | null = document.getElementById('app')

// 使用1
app?.style.background = 'red'(
  // 使用2
  app as HtmlElement
).style.background = 'red'
```

#### 非空断言

> 还可以使用`!`非空断言，其实就是告诉代码该值一定有值。

```ts
const app: HTMLElement | null = document.getElementById('app')
app!.style.background = 'red'
```

### 交集 以及并集

> - 提到交集以及并集会想到两个关键字`&` 以及`|` . 一般我们从字面量来看，符号`&`一定是并集，因为在 js 中是且的意思。而`|`是交集的意思，但是我们在 ts 中正好相反
> - `&` 是交集的意思。是两种都具备的意思. 例如：`高帅的人` & `富的人` = `高富帅`
> - `|` 是并集的意思，既包含 A 又包含 B 的意思

```ts
type A = {
  name: string
}
type B = {
  age: number
}
type C = A & B
const c: C = { name: 'test', age: 10 }

type PersonA = { name: string; age: number }
type PersonB = { name: string; work: boolean }

type PersonC = PersonA | PersonB
```

### 函数的类型声明

> - 在 js 中函数的定义方式分为两种：一种函数声明式定义`function test() {}`, 另一种是函数赋值式定义`const fn = () => {}`

#### 函数类型声明方式

```ts
// 实例1
function test(a: string, b: string): string {
  return a + b
}
// 同样可以 =>
function test(a: string, b: string) {
  return a + b
}
// 后者属于 类型推导

// 实例2
interface IFn {
  (a: string, b: string): string
}
const test1: IFn = (a, b) => a + b

// 实例3
const test1: (a: string, b: string) => string = (a: string, b: string) => a + b
```

- 实例 3 中分为两部分内容，一种类型描述，另一种是函数赋值
  - `(a: string, b:string) => string` 表示函数声明
  - `(a: string, b: string) => a + b` 表示函数赋值
  - 后者必须满足前者的类型要求，也需要重复声明

#### 函数扩展运算符

```ts
function test2(a: string, ...args: string[]) {}
```

#### 函数的可选参数

```ts
function test3(a: string, b?: string) {}
```

- 虽然不赋值也是默认 undefined，但是类型声明中可选类型跟 undefined 是两回事
- 可选类型表示可传可不传，但是如果传递一定是 string 类型

#### 函数重载

```ts
function test(a: string, b: string): string {
  return a + b
}

const test1: (a: string, b: string) => string = (a: string, b: string) => a + b

function test2(a: string, ...args: string[]) {}

function test3(a: string, b?: string) {}

function sum(a: string, b: string): string
function sum(a: number, b: number): number
function sum(a: string | number, b: string | number): string | number {
  if (typeof a === 'string') {
    return a + b
  } else {
    return a + Number(b)
  }
}

sum(1, 1)
export {}
```

- 函数重载：实现参数不同的话，实现的逻辑不同

### class 类

#### 构造函数描述

> 可以对`class`类进行数据类型描述，可以描述属性，方法，以及构造函数

```ts
// 修改前1
class Person {
  constructor(name: string, age: string) {
    this.name = name // error Property 'age' does not exist on type 'Person'
    this.age = age // error
  }
}

// 修改后1
class Person {
  constructor(public name: string, public age: string) {
    this.name = name // success
    this.age = age // success
  }
}

// 修改后2
class Person2 {
  name: string
  age: string
  constructor(name: string, age: string) {
    this.name = name
    this.age = age
  }
}
```

- 在构造函数声明属性的时候，如果给 this 上进行赋值，需要提前声明，可以使用`public` 来声明，简单快捷。同时也可以定义数据类型

#### super 实现继承

```ts
class Man {
  constructor(public name: string) {
    this.name = name
  }
}
class Person3 extends Man {
  constructor(name: string, public age: string) {
    super(name)
    this.age = age
  }
}
```

- 如果实现继承的话，在 constructor 中必须调用`super`

#### 属性修饰符

- `readonly` 设置属性只读，不可修改
- `private` 设置私有属性，只能自己访问，不能其他类访问。例如：子类不能访问
- `public` 设置共同属性，就是默认属性公开可以访问
- `protected` 受保护的属性，只允许自己以及子类进行访问

```
class Man {
  public name: string
  readonly age: number
  protected school: string = '学校'
  constructor(name: string, public test: string) {
    this.name = name
    this.age = 10
  }
}

class Man1 {
  private constructor(public name: string) {
    this.name = name
  }
}

const man1 = new Man1('tset') // error
```

- 修饰符`private`可以标识`constructor`. 但是这样的话就无法进行`new`了

#### 类的原型方法/ 静态方法/ 属性等

```ts
class Cat {
  constructor(public name: string) {
    // 实例属性
    this.name = name
  }

  // 原型函数
  eat(kind: string): string {
    return kind
  }

  // 静态函数
  static say(): string {
    return 'say'
  }

  // 实例属性
  get age(): number {
    return 10
  }
}
```

#### 抽象类

- 抽象方法中必须定义在抽象类中
- 如果函数继承抽象类，必须实现抽象方法

```ts
abstract class Woman {
  abstract eat(kind: string): string

  say(content: string): string {
    return content
  }
}

class Person3 extends Woman {
  // 子类实现父类的方法
  eat(kind: string): string {
    return kind
  }
}
```

### interface 接口 以及 type

> 一般进行类型描述的时候，使用 interface 以及 type 居多，这里先对两者进行比较，再一一列举 interface 的用处
>
> - type 可以使用联合类型，但是 interface 不可以使用
> - type 可以使用关键字`in`，但是 interface 不可以
> - type 不可以进行继承实现，但是 interface 可以通过继承以及是实现

#### interface 实现基本的描述

```ts
interface IPerson {
  name: string
  age: number
}
const person: IPerson = {
  name: '',
  age: 10
}
```

#### 接口的可选/ 可获取/ 可索引/ 继承

```ts
// 可选属性
interface ITest {
  name: string
  age?: number
}

// 可获取
interface IPerson1 {
  [keyName: string]: any
}

// 可索引
interface IPerson2 {
  [keyName: number]: any
}

// 继承
interface A {
  name: string
}

interface B extends A {
  age: number
}
let b: B = {
  age: 10,
  name: ''
}
```

#### 接口描述类

> 以插件`mysql-qs-parse`为例，进行类的描述

```ts
declare class SqlParse {
  public db: Connection | null
  constructor(host: string, user: string, password: string, database: string)
  constructor(
    host: IConnectConfigOptions,
    user?: string,
    password?: string,
    database?: string
  )

  open(): Promise<Connection>
  release(): void
  query(sql: string): Promise<any>
  size(tableName: string, where?: IRecords): Promise<number>
  findOne(
    fields: IFieldOptions[],
    tableName: string,
    where: IRecords
  ): Promise<IRecords>
  find(
    fields: IFieldOptions[],
    tableName: string,
    where?: IRecords
  ): Promise<IRecords[]>
  find(fields: IFindOptions): Promise<IRecords[]>
  insert(fields: IRecords, tableName: string): Promise<number>
  update(fields: IRecords, tableName: string, where: IRecords): Promise<number>
  on(keyName: string, fn: IFn): void
  once(keyName: string, fn: IFn): void
  emit(keyName: string, ...args: any[]): void
  off(keyName: string, fn: IFn & { l?: IFn }): void
}

interface MysqlParse {
  new (host: string, user: string, password: string, database: string): SqlParse
  new (
    host: IConnectConfigOptions,
    user?: string,
    password?: string,
    database?: string
  ): SqlParse
}
```

- 我们可以用接口描述类的构造函数
- `class`类本身可以描述实例本身

### 泛型

> 泛型可以描述一类类型

- 泛型可以广义上定义某种属性

```ts
const mapArray = <T>(value: T, times: number) => {
  const arr = []

  for (let i = 0; i < arr.length; i += 1) {
    arr.push(value)
  }
  return arr
}
const res = mapArray<string>('111', 3)
const res1 = mapArray<number>(111, 3)
const res2 = mapArray(true, 3)
```

- 泛型可以对类型进行约束, 下面的实例中显示 T 必须满足对象中包含属性`length`

```ts
const getLen = <T extends {length: number}>(obj: T): number {
  return obj.length
}

const getValue = <T extends object, K extends keyof T>(obj: T, key: K) => {
  return obj[key]
}
```

- 泛型的不同位置，意义不同

```ts
// 实例1
interface IMapArray {
  <T>(value: T, times: number): T[]
}

// 实例2
interface IMapArray<T> {
  (value: T, times: number): T[]
}
```

> - `实例1` 是在使用的时候调用泛型
> - `实例2` 是在定义接口的时候使用泛型

### keyof

> `keyof` 获取类型的 key 值，不同的类型情况不同

```ts
interface IPerson {
  name: string
  age: number
}
type A = keyof IPerson // name | age

type B = keyof string // string属性 例如：toString等

type C = keyof any // number | string | symobl

type D = keyof never // number | string | symobl

type E = keyof unknown // never

export {}
```

### 内置类型

> 很多数据类型判断都是基于类型分发。

```ts
interface Bird {
  name: '鸟'
}
interface Sky {
  name: '蓝色'
}
interface Fish {
  name: '鱼'
}
interface Water {
  color: '透明'
}
type MyType<T extends Bird | Fish> = T extends Bird ? Sky : Water
type MyType1<T extends Bird | Fish> = [T] extends Bird ? Sky : Water

type IEnv = MyType<Bird> // Sky

// -- 内容分发 分别拿联合类型中每个值 都进行判断
type IEnv1 = MyType<Bird | Fish> // Sky | Wather
type IEnv2 = MyType1<Bird | Fish> // Wather
```

- 内容分发的必要条件：
  - 泛型中使用联合类型
  - 必须是裸体 例如：`MyType1`

#### Exclude

> 排除

```ts
// 此时T 触发了内容分发。T中的类型逐一跟K进行extends判断
type Exclude<T, K> = T extends K ? never : T

type F = Exclude<string | number | boolean, boolean>
```

#### Extract

> 抽离

```ts
type Extract<T, K> = T extends K ? T : never

type F1 = Extract<string | number | boolean, boolean | string>
```

#### NonNullable

> 非空判断

```ts
type NonNullable<T> = T extends null | undefined ? never : T

type F2 = NonNullable<string>
```

#### Partial

> 转换为非必输

```ts
interface F3 {
  name: string
  age: number
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}
type F4 = Partial<F3>
```

- 但是这个 Partial 有个问题就是只能设置表面一层，不能进行深度的转换，接下来会介绍一个`DeepPartial`

#### DeepPartial

> 深度转换为非必输入

```ts
interface F5 {
  name: string
  age: number
  school: {
    name: string
    address: string
  }
}
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
type F6 = DeepPartial<F5>
```

#### Readonly

> 设置只读属性

```ts
interface F7 {
  name: string
  age: number
}
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
type F8 = Readonly<F7>
```

#### Required

> 设置为必须属性

```ts
interface F9 {
  name?: string
  age?: number
}
type Required<T> = {
  [P in keyof T]-?: T[P]
}
type F10 = Required<F9>
```

#### Pick

> 挑选，摘取，千挑万选

```ts
interface F13 {
  name: string
  age: number
  address: string
}
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
type F14 = Pick<F13, 'name'>
```

#### Omit

> 进行忽略，对指定的数据类型进行忽略

```ts
interface F11 {
  name: string
  age: number
  address: string
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type F12 = Omit<F11, 'name'>
```

#### PartPartial

> 实现部分可选，部分不可选

```ts
// 部分可选 部分不可选
interface F15 {
  name: string
  age: number
  address: string
}

type PartPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type F16 = PartPartial<F15, 'name'>
```

#### Merge

> 将两个对象类型进行合并，如果 key 相同，value 不同的话取后者

```ts
// merge 实现
const fn = <T extends object, K extends object>(
  a: T,
  b: K
): Omit<T, Extract<keyof T, keyof K>> & K => {
  return { ...a, ...b }
}
const res = fn({ a: 1, b: 2 }, { a: '1', c: 2 })
```

### 兼容性

> ts 在类型处理过程中，有一定的兼容性处理，在思考过程中一切都是基于“`安全`”的考虑

#### 联合类型兼容性

```ts
type P1 = string | number
type P2 = string
let a!: P1
let b!: P2
b = a // error
a = b // success
```

- 上述的实例中赋值`b = a`会出错，但是`a = b`不会出现
  - 因为`a`是一个联合类型，`a`有可能是 number/ string。但是`b`只能接受 string 类型。所以是不安全的
  - 但是`a = b`就不会
- 总结：赋值过程中，`少的可以给多的赋值`，但是`多的不能给少的`赋值

#### interface 接口兼容性

```ts
// interface兼容性
interface P3 {
  name: string
  age: number
}
interface P4 {
  name: string
}
let c!: P3
let d!: P4
c = d // error
d = c // success
```

- 上述是 interface 兼容性的时候，`c = d`赋值会报错。但是`d = c`没有错。说明：被赋值的类型范围比赋值的类型范围大。是安全的。
  - 原因是类型`P4`只有数据类型`name`. 但是`P3` 具有属性`name, age`. 就是可以给“我”多赋值，但是不能少赋值

#### 函数的兼容性

##### 参数兼容性

```ts
type IFn1 = (a: string, b: string) => string
type IFn2 = (a: string) => string

let t1!: IFn1
let t2!: IFn2
t1 = t2 // success
t2 = t1 // error
```

> 个人觉得从安全以及运行的角度来分析比较容易记忆

- 上述实例中`t2 = t1`赋值时出错的， 假如在未赋值之前调用函数`t2` 其实需要传递一个参数就够了。
- 如果赋值后`t2 = t1`. 案例说应该传递 2 个参数。但是还是原来的调用方法，只能传递一个参数。是不安全的，所以会报错

##### 返回值兼容性

```ts
type IFn5 = (name: string) => string
type IFn6 = (name: string) => string | number

let t5!: IFn5
let t6!: IFn6

t5 = t6 // error
t6 = t5 // success
```

- 上述实例中赋值`t5 = t6`是错误的。原理上跟`联合类型的兼容性`原理一致。
- 通过`函数参数/ 返回值`得到 => `传父逆，返协子` => 参数传递更少的，返回值返回更大的

### infer

> `infer`就是进行类型推导，推导指定位置的类型

#### ReturnType

```ts
const fns = (a: string, b: number) => {
  return {
    a,
    b,
    name: '1'
  }
}

type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never

type m1 = ReturnType<typeof fns>
```

#### Parameters

```ts
const fns = (a: string, b: number) => {
  return {
    a,
    b,
    name: '1'
  }
}

type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
type m2 = Parameters<typeof fns>
```

### 命名空间

- 类和命名空间 可以进行合并

```ts
// 同名的命名空间 以及类可以进行属性合并
class Person {}
namespace Person {
  export var action: string
}
const p = new Person()
Person.action
```

- 命名空间 可以跟函数一起合并

```ts
function User() {}
namespace User {
  export const name = '1'
}
User.name
```

- 命名空间 可以和枚举类型进行合并

```ts
enum IAction {
  add = 'add'
}
namespace IAction {
  export const del = 'del'
}
IAction.del
```

### declare 全局定义

> global.d.ts

```ts
declare interface Window {
  store: string
}

declare module 'jquery' {
  function $(): {
    css(keyName: string): string
    width(): number
  }

  export default $
}

declare function $(): {
  css(keyName: string): string
  width(): number
}

declare namespace $ {
  export namespace fn {
    function extend() {}
  }
}
```

- 可以通过`declare Window` 来给`Window`添加属性
- 可以声明一个模块`jquery`等
  > 下列是通过 declare 实现类的描述

```ts
// 利用class 来描述类的实例
class SqlParse {
  public db: Connection | null
  constructor(host: string, user: string, password: string, database: string)
  constructor(
    host: IConnectConfigOptions,
    user?: string,
    password?: string,
    database?: string
  )

  open(): Promise<Connection>
  release(): void
  query(sql: string): Promise<any>
  size(tableName: string, where?: IRecords): Promise<number>
  findOne(
    fields: IFieldOptions[],
    tableName: string,
    where: IRecords
  ): Promise<IRecords>
  find(
    fields: IFieldOptions[],
    tableName: string,
    where?: IRecords
  ): Promise<IRecords[]>
  find(fields: IFindOptions): Promise<IRecords[]>
  insert(fields: IRecords, tableName: string): Promise<number>
  update(fields: IRecords, tableName: string, where: IRecords): Promise<number>
  on(keyName: string, fn: IFn): void
  once(keyName: string, fn: IFn): void
  emit(keyName: string, ...args: any[]): void
  off(keyName: string, fn: IFn & { l?: IFn }): void
}

// 用来描述构造函数 以及constructor重载
interface MysqlParse {
  new (host: string, user: string, password: string, database: string): SqlParse
  new (
    host: IConnectConfigOptions,
    user?: string,
    password?: string,
    database?: string
  ): SqlParse
}

declare const SqlParser: MysqlParse
```

> 本次分享就是这么多了，之后会不同完善文章，让文章变得更加充实
