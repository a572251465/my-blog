<h1 align = "center">Redis中关于数字命令</h1>

```bash
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> set age 20
OK
127.0.0.1:6379> get age
"20"
127.0.0.1:6379> type age
string
127.0.0.1:6379> incr age
(integer) 21
127.0.0.1:6379> OBJECT encoding age
"int"
127.0.0.1:6379> APPEND age 10
(integer) 4
127.0.0.1:6379> get age
"2110"
127.0.0.1:6379> OBJECT encoding age
"raw"
127.0.0.1:6379> DECRBY age 10
(integer) 2100
127.0.0.1:6379> OBJECT encoding age
"int"
```

> - 通过上述实例中可以得到，其实我们可以使用 type 来获取数据类型
> - 因为 API【set】属于 string 的。所以类型都是 string。 ![在这里插入图片描述](https://img-blog.csdnimg.cn/f9555fa16f55490194441dadf14973f6.png)
> - 其实我们内部还有别的 API 用来表示编码的【OBJECT encoding】。 通过上述实例可以看到 可以通过不同的 API 来转换 encoding。
> - 其实目的还是为了避免内部判断。例如：如果 value 值本身是一个字符串【aaa】，如果进行运算的时候是无法相加/ 相减的。此时会报错，但是如果 encoding 是一个 int。表示下次一个可以进行运算
