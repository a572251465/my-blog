<h1 align = "center">Lists常用命令</h1>

> - LLEN
> - LPUSH
> - LPOP
> - LINDEX
> - LINSERT
> - LRANG
> - LREM
> - LSET
> - LTRIM
> - RPUSH
> - RPOP

## 具体使用案例

```bash
# 从左侧添加一个元素
127.0.0.1:6379> lpush lists a
(integer) 1

# 根据位置 查询位置范围内的所有的元素
127.0.0.1:6379> LRANGE lists 0 -1
1) "a"

# 从左侧添加多个元素
127.0.0.1:6379> lpush lists b c d e
(integer) 5
127.0.0.1:6379> LRANGE lists 0 -1
1) "e"
2) "d"
3) "c"
4) "b"
5) "a"

# 从左侧删除一个元素
127.0.0.1:6379> LPOP lists
"e"
127.0.0.1:6379> lpop lists
"d"
127.0.0.1:6379> lrange lists 0 -1
1) "c"
2) "b"
3) "a"

# 获取元素的长度
127.0.0.1:6379> LLEN lists
(integer) 3

# 在指定元素的位置之后 插入一个元素
127.0.0.1:6379> LINSERT lists after b 3
(integer) 4
127.0.0.1:6379> lrange lists 0 -1
1) "c"
2) "b"
3) "3"
4) "a"

# 根据指定的索引 来获取对应的元素
127.0.0.1:6379> LINDEX lists 1
"b"

# 设置指定位置的元素
127.0.0.1:6379> lset lists 2 4
OK
127.0.0.1:6379> LRANGE lists 0 -1
1) "c"
2) "b"
3) "4"
4) "a"

# 从右侧添加一个元素
127.0.0.1:6379> rpush lists f
(integer) 5
127.0.0.1:6379> lrange lists 0 -1
1) "c"
2) "b"
3) "4"
4) "a"
5) "f"
127.0.0.1:6379> rpush lists e
(integer) 6
127.0.0.1:6379> lrange lists 0 -1
1) "c"
2) "b"
3) "4"
4) "a"
5) "f"
6) "e"

# 删除指定位置两边的元素
127.0.0.1:6379> LTRIM lists 1 -2
OK
127.0.0.1:6379> lrange lists 0 -1
1) "b"
2) "4"
3) "a"
4) "f"
127.0.0.1:6379>
```

## 总结

![在这里插入图片描述](https://img-blog.csdnimg.cn/dff02403e7a84a95b950407f9b39f291.png)
