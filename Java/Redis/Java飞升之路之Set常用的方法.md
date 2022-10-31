<h1 align = "center">Set常用的方法</h1>

> - 主要是列举下 Set 中常用的 API。
> - 虽然 Set 在保存数据的时候是无序的，但是其实是可以去重的(避免重复)

## 常用 API

```bash
127.0.0.1:6379> keys *
(empty array)

# 将多个值添加到Set中，保证值不重复
127.0.0.1:6379> sadd k1 a b c a d e
(integer) 5

# 查询Set中 元素的个数
127.0.0.1:6379> scard k1
(integer) 5

# 查询Set中列表内容
127.0.0.1:6379> SMEMBERS k1
1) "b"
2) "d"
3) "c"
4) "a"
5) "e"

# 删除集合中多个元素
127.0.0.1:6379> srem k1 a b
(integer) 2
127.0.0.1:6379> smembers k1
1) "c"
2) "e"
3) "d"
127.0.0.1:6379>
127.0.0.1:6379> FLUSHALL
OK
127.0.0.1:6379>
127.0.0.1:6379> sadd k1 a b c d d e g
(integer) 6
127.0.0.1:6379> SMEMBERS k1
1) "c"
2) "a"
3) "g"
4) "e"
5) "b"
6) "d"

# 查询个数
127.0.0.1:6379> scard k1
(integer) 6

# 删除Set 中的元素
127.0.0.1:6379> srem k1 c
(integer) 1
127.0.0.1:6379> SMEMBERS k1
1) "g"
2) "e"
3) "b"
4) "d"
5) "a"
127.0.0.1:6379> sadd k2 a b c d e
(integer) 5
127.0.0.1:6379> SMEMBERS k1
1) "g"
2) "e"
3) "b"
4) "d"
5) "a"
127.0.0.1:6379> SMEMBERS k2
1) "b"
2) "d"
3) "c"
4) "a"
5) "e"

# 查询两个集合中的差值 以后面的值为参照物
127.0.0.1:6379> SDIFF k1 k2
1) "g"
127.0.0.1:6379> SDIFF k2 k1
1) "c"

# 查询两个集合中的差值 以后面的值为参照物，并把结果放到新集合中
127.0.0.1:6379> SDIFFSTORE dest k1 k2
(integer) 1
127.0.0.1:6379> get dest
(error) WRONGTYPE Operation against a key holding the wrong kind of value
127.0.0.1:6379> SMEMBERS dest
1) "g"

# 查询两个集合中的交集
127.0.0.1:6379> sinter k1 k2
1) "e"
2) "b"
3) "d"
4) "a"
127.0.0.1:6379>
127.0.0.1:6379> sadd k3 1
(integer) 1
127.0.0.1:6379> sadd k3 2 3 4 5 6 6 8 6
(integer) 6
127.0.0.1:6379> SMEMBERS k3
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
7) "8"

# 删除并获取一个集合里面的元素
127.0.0.1:6379> SPOP k3
"4"
127.0.0.1:6379> SPOP k3
"2"
127.0.0.1:6379> SMEMBERS k3
1) "1"
2) "3"
3) "5"
4) "6"
5) "8"
# 从结合中随机获取count个元素 if count < length 随意获取不重复元素
# 从结合中随机获取count个元素 if count > length 获取全部元素
# 从结合中随机获取count个元素 if |-count| > length 获取指定元素个数，中间可能会包含重复元素
127.0.0.1:6379> SRANDMEMBER k3 3
1) "3"
2) "8"
3) "1"
127.0.0.1:6379> SRANDMEMBER k3 3
1) "8"
2) "6"
3) "1"
127.0.0.1:6379> SRANDMEMBER k3 6
1) "1"
2) "3"
3) "5"
4) "6"
5) "8"
127.0.0.1:6379> SRANDMEMBER k3 -2
1) "8"
2) "3"
127.0.0.1:6379> SRANDMEMBER k3 -2
1) "8"
2) "3"
127.0.0.1:6379> SRANDMEMBER k3 -7
1) "3"
2) "8"
3) "3"
4) "3"
5) "6"
6) "1"
7) "3"
```

## 场景

- 如果是年会抽奖的话（多个人参与抽奖，抽中一个剔除一个）
  - 可以使用函数`spop` 来做处理
