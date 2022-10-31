<h1 align = "center">Hash 常用方法</h1>

> 本来主要是列举下 Hash 相关的使用方法

## 使用命令

```bash
# 表示匹配所有的属性key
127.0.0.1:6379> keys *
(empty array)

# 设置多个map 的key以及value
127.0.0.1:6379> HSET k1 name lihh age 20
(integer) 2

# 根据key 获取map中指定的value
127.0.0.1:6379> hget k1 name
"lihh"
127.0.0.1:6379> hget k1 age
"20"

# 获取指定key 中所有的值
127.0.0.1:6379> hgetall k1
1) "name"
2) "lihh"
3) "age"
4) "20"

# 获取所有的键值
127.0.0.1:6379> hkeys k1
1) "name"
2) "age"

# 获取所有的value值
127.0.0.1:6379> HVALS k1
1) "lihh"
2) "20"

# 获取指定key 的长度
127.0.0.1:6379> HLEN k1
(integer) 2

# 获取多个key值得 value内容
127.0.0.1:6379> hmget k1 name age
1) "lihh"
2) "20"

# 重新设置指定key 的 value值
127.0.0.1:6379> hmset k1 name lihh1 age 99
OK

# 获取所有的属性 以及值
127.0.0.1:6379> HGETALL k1
1) "name"
2) "lihh1"
3) "age"
4) "99"

# 获取所有的value值
127.0.0.1:6379> hvals k1
1) "lihh1"
2) "99"

# 判断指定属性是否存在
127.0.0.1:6379> HEXISTS k1 name
(integer) 1
127.0.0.1:6379> HEXISTS k1 address
(integer) 0
127.0.0.1:6379> hset k1 address xxxx
(integer) 1
127.0.0.1:6379> HEXISTS k1 address
(integer) 1

# 删除指定属性
127.0.0.1:6379> HDEL k1 address
(integer) 1
127.0.0.1:6379> HEXISTS k1 address
(integer) 0
```
