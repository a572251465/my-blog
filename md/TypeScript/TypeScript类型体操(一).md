> 本文章是前一章 ts 基础的加深版，意在深入练习下 ts，主要是练习标识符`infer` 。
> 先来个大总结： - 关键字`infer` 不仅可以推导返回值/ 参数。其实还可以推导指定位置的值，例如：字符串/ 数组等 - 如果在使用中用到了长度，需要使用元组的特性`length`来解决问题

## 1、CapitalizeString

> 将字符串的首字母进行大写转换，实例如下：

```text
handler => Handler
parent => Parent
233 => 233
```

```ts
type Index<T> = T extends `${infer L}${infer R}` ? `${Uppercase<L>}${R}` : never
// 首字母大写

type a1 = Index<'handler'> // Handler
type a2 = Index<'parent'> // Parent
type a3 = Index<233> // 233

export {}
```

- 上述代码中标识符`infer`用来进行推断的，不仅可以推断返回值/ 参数/ 构造函数等，同样可以推断字符串
- 代码`${infer L}${infer R}` 表示将字符串推断两部分`h` 以及`andler`。也就是`infer L` 推断第一个字母，而`infer R`用来推断其余的字符
- 代码`Uppercase`用来转换大写

## 2、FirstChar

> 获取字符串的第一个字符， 意思其实很简单。这里就不过多举例了，直接上代码

```ts
type FirstChar<T> = T extends `${infer L}${infer R}` ? L : never
// 获取字符串字面量中的第一个字符

type A = FirstChar<'BFE'> // 'B'
type B = FirstChar<'dev'> // 'd'
type C = FirstChar<''> // never

export default {}
```

## 3、LastChar

> 获取最后一个字符串，其实题 2 有点类似，但是相对来说比较复杂，这里会做详细描述

```ts
// 获取字符串字面量中的最后一个字符
type LastChar<T, Prev = never> = T extends `${infer L}${infer R}`
  ? LastChar<R, L>
  : Prev

type A = LastChar<'BFE'> // 'E'
type B = LastChar<'dev'> // 'v'
type C = LastChar<''> // never

export default {}
```

- 这到底可以看出来，有时候我们需要更多的参数来进行辅助，比如实例中的`Prev`等
- 还是使用`infer L` 以及`infert R` 来辅助分解字符串
  - 首先以字符串`BFE`为实例
  - 第一次执行：L 是 B R 是 FE，递归调用 LastChar 的时候传值是：`LastChar<FE, B>`
  - 第二次执行：L 是 F R 是 E，递归调用 LastChar 的时候传值是：`LastChar<F, E>`
  - 依次类推

## 4、StringToTuple

> 字符串转换为元组类型

```ts
// 字符串转换为元组类型
type StringToTuple<T, S extends any[] = []> = T extends `${infer L}${infer R}`
  ? StringToTuple<R, [...S, L]>
  : S

type A = StringToTuple<'BFE.dev'> // ['B', 'F', 'E', '.', 'd', 'e','v']
type B = StringToTuple<''> // []

export default {}
```

- 核心原则就是多定义一个参数`数组`，每次递归的时候用数组来接受参数，最后数组就是返回值

## 5、TupleToString

> 将字符串类型的元素转换为字符串字面量类型

```ts
// 将字符串类型的元素转换为字符串字面量类型

type TupleToString<T, S extends string = ''> = T extends [infer L, ...infer R]
  ? L extends string
    ? TupleToString<R, `${S}${L}`>
    : never
  : S

type A = TupleToString<['a', 'b', 'c']> // 'abc'
type B = TupleToString<[]> // ''
type C = TupleToString<['a']> // 'a'

export default {}
```

- 其实关键字`infer`不仅可以对字符串进行推导，对数组同样可以进行推导。而且数组的推导比字符串更加灵活，下面以数组`const arr = [a, b, c]`进行举例
  - `[infer L, ...infer R]` => L 是 a R 是`[b, c ]`

## 6、RepeatString

> 复制字符 T 为字符串类型，长度为 C

```ts
// 复制字符T为字符串类型，长度为C

type RepeatString<
  T extends string,
  K,
  A extends any[] = [],
  S extends string = ''
> = K extends A['length'] ? S : RepeatString<T, K, [...A, T], `${S}${T}`>

type A = RepeatString<'a', 3> // 'aaa'
type B = RepeatString<'a', 0> // ''

export default {}
```

- 通过上述的实例：如果使用长度的话就要用到元组，因为元组的`length`属性可以判断长度
- 上述的实例比较简单，这里就不会做过多的阐述了

## 7、SplitString

> 将字符串字面量类型按照指定字符，分割为元组。无法分割则返回原字符串字面量

```ts
// 将字符串字面量类型按照指定字符，分割为元组。无法分割则返回原字符串字面量
type SplitString<
  T,
  K extends string = '',
  S extends any[] = [T]
> = T extends `${infer L}${K}${infer R}` ? SplitString<R, K, [...S, L]> : S

type A1 = SplitString<'handle-open-flag', '-'> // ["handle", "open", "flag"]
type A2 = SplitString<'open-flag', '-'> // ["open", "flag"]
type A3 = SplitString<'handle.open.flag', '.'> // ["handle", "open", "flag"]
type A4 = SplitString<'open.flag', '.'> // ["open", "flag"]
type A5 = SplitString<'open.flag', '-'> // ["open.flag"]

export default {}
```

- 上述问题的解决关键在于数组类型的推导
- 代码`${infer L}${K}${infer R}` 最为重要。以字符串`open-flag`为例，如果 K 是`-`的话，那推导出来的就是 L => open. R => flag 等

## 8、LengthOfString

> 计算字符串字面量类型的长度

```ts
// 计算字符串字面量类型的长度
type LengthOfString<T, S extends any[] = []> = T extends `${infer L}${infer R}`
  ? LengthOfString<R, [...S, L]>
  : S['length']

type A = LengthOfString<'BFE.dev'> // 7
type B = LengthOfString<''> // 0

export default {}
```

- 解决问题的关键在于：如果遇到了计算长度的问题，就必须利用元组的特性来解决

## 9、KebabCase

> 驼峰命名转横杠命名

```ts
// 驼峰命名转横杠命名

type KebabCase<T, S extends string = ''> = T extends `${infer L}${infer R}`
  ? Uppercase<L> extends L
    ? KebabCase<R, `${S extends '' ? S : `${S}-`}${Lowercase<L>}`>
    : KebabCase<R, `${S}${L}`>
  : S

type a1 = KebabCase<'HandleOpenFlag'> // handle-open-flag
type a2 = KebabCase<'OpenFlag'> // open-flag

export default {}
```

- 解决这个问题的关键在于：如果识别大写字母，识别后把大写字母 转换为 小写字母+ `-`来解决
- 我们可以通过方法`Uppercase<L> extends L` 来识别大写字母

## 10、CamelCase

> 横杠命名转化为驼峰命名

```ts
// 横杠命名转化为驼峰命名

type FirstUppercase<T> = T extends `${infer L}${infer R}`
  ? `${Uppercase<L>}${R}`
  : T
type CamelCase<
  T extends string = '',
  S extends string = ''
> = T extends `${infer L}-${infer R}`
  ? CamelCase<R, `${FirstUppercase<S>}${FirstUppercase<L>}`>
  : `${S}${FirstUppercase<T>}`
type a1 = CamelCase<'handle-open-flag'> // HandleOpenFlag
type a2 = CamelCase<'open-flag'> // OpenFlag

export default CamelCase
```

- 提取每个符号`-`左右的字符，将提取的字符首字母大写，然后拼接到一起就行了

## 11、ObjectAccessPaths

> 进行对象属性拼接，而且可以进行类型识别

```ts
const i18n = createI18n({
  home: {
    topBar: {
      title: '顶部标题',
      welcome: '欢迎登录'
    },
    bottomBar: {
      notes: 'XXX备案，归XXX所有'
    }
  },
  login: {
    username: '用户名',
    password: '密码'
  }
})

// 上述对象转换出来的类型是：
// home.topBar.title | home.topBar.welcome | home.bottomBar.notes | login.username | login.password

i18n('home.topBar.title') // √
i18n('home.topBar.welcome') // √
i18n('home.bottomBar.notes') // √
i18n('home.bottomBar.notes1') // ×
```

```ts
type trimFirstCode<T> = T extends `.${infer R}` ? R : T

type ObjectAccessPaths<
  T,
  R extends string = '',
  K = keyof T
> = K extends keyof T
  ? K extends string
    ? T[K] extends Record<string, any>
      ? ObjectAccessPaths<T[K], trimFirstCode<`${R}.${K}`>>
      : trimFirstCode<`${R}.${K}`>
    : never
  : never

// 完成 createI18n 函数中的 ObjectAccessPaths<Schema>，限制函数i18n的参数为合法的属性访问字符串
function createI18n<Schema>(
  schema: Schema
): (path: ObjectAccessPaths<Schema>) => string {
  return [{ schema }] as any
}

// i18n函数的参数类型为：home.topBar.title | home.topBar.welcome | home.bottomBar.notes | login.username | login.password
const i18n = createI18n({
  home: {
    topBar: {
      title: '顶部标题',
      welcome: '欢迎登录'
    },
    bottomBar: {
      notes: 'XXX备案，归XXX所有'
    }
  },
  login: {
    username: '用户名',
    password: '密码'
  }
})

i18n('home.topBar.title') // correct
i18n('home.topBar.welcome') // correct
i18n('home.bottomBar.notes') // correct

export default {}
```

- 其实只要理解后问题就很简单，最根本的目的就是如何将每个属性都拼接为字符串
- 上述代码中出现了`K extends keyof T`. 此时的`K`一定是联合类型。我们可以利用联合的分发机制来做这个事情

## 12、ComponentEmitsType

> 组件的 key 值以及函数变化
> 例如：(`'Handle-open': (flag: boolean) => true`) => `onHandleOpen: (flag: boolean) => void`

```ts
import CamelCase from '../10、CamelCase/index'

type Source = {
  'Handle-open': (flag: boolean) => true
  'preview-Item': (data: { item: any; index: number }) => true
  'close-item': (data: { item: any; index: number }) => true
}

type ComponentEmitsType<T> = {
  [P in keyof T as `on${P extends string ? CamelCase<P> : ''}`]?: T[P] extends (
    ...args: infer R
  ) => any
    ? (...args: R) => void
    : T[P]
}

type Result = ComponentEmitsType<Source>

export default {}
```

- 我觉得这个也是特别简单的。如果能理解两个点就够了
  - 通过关键字`in` 进行循环的时候，可以使用`as` 来重新定义对象的 key。如上述代码`[P in keyof T as on${P extends string ? CamelCase<P> : ''}]`
  - 还有就是通过关键字`infer` 来推导参数

### end

> 今天关于`TS进阶体操`就分享这么多，以上方法都是作者本人进行解答，如果读者有什么别的方案，可以通过评论告诉我。
