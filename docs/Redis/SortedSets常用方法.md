<h1 align = "center">SortedSets 常用方法</h1>

> - ZDD
> - ZCARD
> - ZCOUNT
> - ZINCRBY
> - ZINTERSTORE
> - ZLEXCOUNT
> - ZPOPMAX
> - ZPOPMIN
> - ZRANGE
> - ZRANGEBYLEX
> - ZREVRANGEBYLEX
> - ZRANGEBYSCORE
> - ZRANK
> - ZREM
> - ZREMRANGEBYLEX
> - ZREMRANGEBYRANK
> - ZREMRANGEBYSCORE
> - ZREVRANGE
> - ZREVRANGEBYSCORE
> - ZREVRANK
> - ZSCORE
> - ZUNIONSTORE
> - ZSCAN

## ZADD

![在这里插入图片描述](https://img-blog.csdnimg.cn/cffdd0bda55040d3bb6b0ea16c9548a2.png)

- 通过命令`zadd` 对有序集合进行添加数据
- 所谓的`分数`/ `值` 必须是成对出现的。因为如果是排序的话，依靠的是分数进行排序
- 如果是遇到了相同的值 但是分数不一致的话，就会进行更新
- 更加详细的参数 请参照官网

## ZCARD ZCOUNT

![在这里插入图片描述](https://img-blog.csdnimg.cn/743de93c449d4db6953a920667b8bb8c.png)

- `ZCARD` 表示集合中的成员个数
- `ZCOUNT` 根据指定的分数范围，查询范围内的成员个数

## ZRANGE

![在这里插入图片描述](https://img-blog.csdnimg.cn/13f9330339e44a91bff7a3aa008dff85.png)

- 通过命令`zrange k1 0 -1` 可以查询成员变量的列表，但是只包含值
- 通过命令`zrange k1 0 -1 withscores` 可以查询成员变量的列表。包含值以及分数

## ZINCRBY

![在这里插入图片描述](https://img-blog.csdnimg.cn/4644660c1ab4441b8d1cde7caadcd62e.png)

- 给某个值得分数添加指定的增量。
  - 例如：值 a 的分数为 2. 可以单独执行命令后 给 a 单独添加分数

## ZINTERSTORE

![在这里插入图片描述](https://img-blog.csdnimg.cn/78f8223a5fd749fc97543125ab4c9ec4.png)

- 获取每个元素的交集，并存放到一个指定元素内
- 获取到的结果是每个元素分数相加的结果。结果中依旧保持排序

## ZLEXCOUNT

![在这里插入图片描述](https://img-blog.csdnimg.cn/db257a624ed84faab358ca8774891c52.png)

- 可以查看指定 value 之间的成员个数。
  - 指令`ZCOUNT` 是查询指定分数之间的成员个数，所以其实两者是不同的
- 可以用特殊符号`-`, `+` 来表示最大值 以及最小值
- 先是最大值，其次是最小值

## ZPOPMAX ZPOPMIN

![在这里插入图片描述](https://img-blog.csdnimg.cn/c849cdeb93b3440dafacbbe3b7e52741.png)

- `ZPOPMAX` 删除并返回指定个数个 分数最高的值
- `ZPOPMIN` 删除并返回指定个数个 分数最小的值

## ZREVRANGEBYSCORE

![在这里插入图片描述](https://img-blog.csdnimg.cn/898b6dad30c1472f9bec6d9426af2e41.png)

- 返回有序集合中指定分数区间内的成员，分数由高到低排序

[更多参照官网](http://redis.cn/commands.html#sorted_set) `...`
