<h1 align = "center">Redis中发布订阅</h1>

![在这里插入图片描述](https://img-blog.csdnimg.cn/5e75ac29153d47a789be859991c1c32b.png)

- 可以启动多个客户端，一个客户端发布消息，其余的客户端订阅消息
- `一定是先订阅，后发布`
- `PSUBSCRIBE` 以正则匹配的模式来订阅频道
- `PUBLISH` 表示发布频道信息
- `SUBSCRIBE` 以固定的指令来订阅消息
- `UNSUBSCRIBE` 以固定的指令来取消订阅

## 实例

- 订阅频道

![在这里插入图片描述](https://img-blog.csdnimg.cn/56edddab85194944882667ab14a875cd.png)

- 发布频道信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/bcee223aece34455aa7d092ee3eb557b.png)
