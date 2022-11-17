<h1 align = "center">BitMap方法以及场景</h1>

> 本文主要讲述了关于二进制相关的操作。以及一些二进制的使用场景

## 1. 方法使用

### 1.1 setbit

```bash
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> get key1
(nil)
127.0.0.1:6379> setbit k1 1 1
(integer) 0
127.0.0.1:6379> get k1
"@"
127.0.0.1:6379> STRLEN k1
(integer) 1
127.0.0.1:6379>
```

> - 设置二进制的值。 将从位置定位设置
> - 上述设置的二进制值得位置是针对比特位的。例如 0000 0000 0000 0000。
> - 因为 8 个比特位表示一个字节。所以上述的【0000 0000 0000 0000】 中其实长度是 2 ![在这里插入图片描述](https://img-blog.csdnimg.cn/22d3adb487fc40a2a3542884f504767b.png)

### 1.2 bitcount

```bash
127.0.0.1:6379> bitcount k1 0 -1
(integer) 2
127.0.0.1:6379> BITCOUNT k1 0 7
(integer) 2
127.0.0.1:6379> BITCOUNT k1 0 0
(integer) 1
127.0.0.1:6379> BITCOUNT k1 0 1
(integer) 2
127.0.0.1:6379>
```

> - 从指定范围内统计出 1 出现的个数
> - 开始位置以及结束位置 都是字节的位置。例如：【0000 0000 0000 0000】 表示 2 个字节。 所以最大下标就是 1

### 1.3 bitpos

```bash
127.0.0.1:6379> get k1
"@\x80"
127.0.0.1:6379> bitpos k1 1 0
(integer) 1
127.0.0.1:6379> bitpos k1 1 1
(integer) 8
127.0.0.1:6379> bitpos k1 1 1 1
(integer) 8
127.0.0.1:6379> bitpos k1 1 1 2
(integer) 8
127.0.0.1:6379> bitpos k1 1 2 2
(integer) -1
127.0.0.1:6379>
```

> - 返回字符串中第一个被设置为 0 或是 1 的值
> - 开始位置以及结束位置 都是字节的位置。例如：【0000 0000 0000 0000】 表示 2 个字节。 所以最大下标就是 1
> - 如果在指定位置找不到的话，直接返回-1

### 1.4 bitop

```bash
127.0.0.1:6379> setbit k1 1 1
(integer) 0
127.0.0.1:6379> setbit k1 3 1
(integer) 0
127.0.0.1:6379> get k1
"P"
127.0.0.1:6379> setbit k2 2 1
(integer) 0
127.0.0.1:6379> get k2
" "
127.0.0.1:6379> bitop and dest k1 k2
(integer) 1
127.0.0.1:6379> get dest
"\x00"
127.0.0.1:6379> bitop or dest1 k1 k2
(integer) 1
127.0.0.1:6379> get dest1
"p"
127.0.0.1:6379>
```

> - 对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上
> - BITOP 命令支持 AND 、 OR 、 NOT 、 XOR 这四种操作中的任意一种参数
> - 总结：其实将多个二进制值 通过 & | 等符号进行操作
> - [参考地址](http://redis.cn/commands/bitop.html)

## 2. 关联场景

- 问题 1：
  > 有用户系统，统计用户登录天数，且窗口随机

```bash
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> setbit lihh 1 1
(integer) 0
127.0.0.1:6379> setbit lihh 2 1
(integer) 0
127.0.0.1:6379> setbit lihh 3 1
(integer) 0
127.0.0.1:6379> setbit lihh 360 1
(integer) 0
127.0.0.1:6379> STRLEN lihh
(integer) 46
127.0.0.1:6379> BITCOUNT lihh 0 1
(integer) 3
127.0.0.1:6379>
```

- 利用二进制知识
- 以单独的用户名称为 Redis 的 key。 同时利用 API`bitcount`
  - 第一天登录 `setbit lihh 1 1`
  - 第二天登录 `setbit lihh 2 1`
  - 以此类推，哪天登录了 从开始位置设置哪天
- 最后使用 API【bitcount】 来统计 1 出现的个数

<hr />

- 问题 2：

  > 送礼物大库备货多少礼物。 假设京东有 2E 用户

```bash
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> SETBIT 1001 1 1
(integer) 0
127.0.0.1:6379> SETBIT 1001 2 1
(integer) 0
127.0.0.1:6379> SETBIT 1001 3 0
(integer) 0
127.0.0.1:6379> SETBIT 1002 1 1
(integer) 0
127.0.0.1:6379> SETBIT 1002 2 0
(integer) 0
127.0.0.1:6379> SETBIT 1002 3 1
(integer) 0
127.0.0.1:6379> keys *
1) "1001"
2) "1002"
127.0.0.1:6379> setbit 1003 1 1
(integer) 0
127.0.0.1:6379> setbit 1003 2 1
(integer) 0
127.0.0.1:6379> setbit 1003 3 0
(integer) 0
127.0.0.1:6379> BITOP or dest 1001 1002
(integer) 1
127.0.0.1:6379> STRLEN dest
(integer) 1
127.0.0.1:6379> BITCOUNT dest 0 -1
(integer) 3
127.0.0.1:6379> bitop or dest1 1002 1003
(integer) 1
127.0.0.1:6379> BITCOUNT dest1 0 -1
(integer) 3
127.0.0.1:6379>
```

- 用户的编号其实就是位置(用户的编号其实就是比特位的所在位置)
  > 李 1 王 2 张 3
- 日期其实就是 Redis 的 key
- 通过 or 的关系 计算每个用户活跃度
- 通过 API【bitcount】 来计算 1 出现的次数
