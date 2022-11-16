<h1 align = "center">String类型中常用命令</h1>

## 1. 默认数据库

> 首先需要理解下 Redis 中默认的数据库。总共 16 个。具体的可以[参照文章](https://zhuanlan.zhihu.com/p/420336920)

```bash
select [number]
```

## 2. string 相关的命令

### set

```bash
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> get age
(nil)
127.0.0.1:6379> get address
(nil)
127.0.0.1:6379> set name lihh
OK
127.0.0.1:6379> get name
"lihh"
127.0.0.1:6379> set name lihh1
OK
127.0.0.1:6379> get name
"lihh1"
127.0.0.1:6379> set name lihh2 nx
(nil)
127.0.0.1:6379> set address 111 nx
OK
127.0.0.1:6379> get address
"111"
127.0.0.1:6379> set test lihh xx
(nil)
127.0.0.1:6379> set name lihh
OK
127.0.0.1:6379> get name
"lihh"
127.0.0.1:6379>
```

> - 如果设置类型是字符串的话，可以通过 set/get 直接设置内容
> - 参数【nx】 只有键 key 不存在的时候才会设置 key 的值。 可以理解为创建过程
> - 参数【xx】 只有键 key 存在的时候才会设置 key 的值。可以理解为更新过程
> - 参数【ex】 设置过期时间，单位是秒
> - 参数【px】 设置过期时间，单位是毫秒
> - [参考地址](http://redis.cn/commands/set.html)

### get

```bash
127.0.0.1:6379> get name
"lihh"
127.0.0.1:6379> get age
(nil)
127.0.0.1:6379> get address
"111"
```

### append

```bash
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> append name lihh
(integer) 4
127.0.0.1:6379> get name
"lihh"
127.0.0.1:6379> append name -test
(integer) 9
127.0.0.1:6379> get name
"lihh-test"
127.0.0.1:6379>
```

> - 如果 key 不存在的话，直接创建一个空白字符串，然后拼接设置字符串。
> - 如果 key 存在的话，直接在原来的字符串后拼接本次设置字符串，返回设置后的字符串

### setrange

```bash
127.0.0.1:6379> get name
"lihh-test"
127.0.0.1:6379> setrange name 3 xxxx
(integer) 9
127.0.0.1:6379> get name
"lihxxxxst"
127.0.0.1:6379> setrange name 3 66666666
(integer) 11
127.0.0.1:6379> get name
"lih66666666"
127.0.0.1:6379> set age 10
OK
127.0.0.1:6379> get age
"10"
127.0.0.1:6379> setrange age 4 300
(integer) 7
127.0.0.1:6379> get age
"10\x00\x00300"
127.0.0.1:6379>
```

> - 设置新值，从指定位置`offset`开始覆盖原来的值
> - 如果新值比（指定位置到结尾的长度）长的话，直接设置
> - 如果设置的坐标 比原来字符串长度 长的话，中间空余的部分用 0 来代替

### getrange

```bash
127.0.0.1:6379> set name lihaohao-test-test1
OK
127.0.0.1:6379> get name
"lihaohao-test-test1"
127.0.0.1:6379> getrange name -1 -3
""
127.0.0.1:6379> getrange name -3 -1
"st1"
127.0.0.1:6379> getrange name 1 5
"ihaoh"
127.0.0.1:6379> getrange name 0 5
"lihaoh"
```

> - 获取字符串中指定 start/ end 部分子字符串
> - 获取的字符串部分 包含 start end
> - 可以从后面开始获取，默认下标为-1

### strlen

```bash
127.0.0.1:6379> strlen name
(integer) 19
127.0.0.1:6379>
```

## 3. 总结

> 字符串相关的操作可以[参照这个](http://redis.cn/commands.html#string)
