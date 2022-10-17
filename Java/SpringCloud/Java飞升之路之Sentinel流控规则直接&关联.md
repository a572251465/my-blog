<h1 align = "center">流控规则之直接&关联</h1>

## 1. 名词解释

- 资源名：唯一名称，默认请求路径
- 针对来源：Sentinel 可以针对调用者进行限流，填写微服务名，默认 default（不区分来源）
- 阈值类型/单机阈值：
  - QPS（每秒钟的请求数量）：当调用该 API 的 QPS 达到阈值的时候，进行限流
  - 线程数：当调用该 API 的线程数量达到阈值的时候，进行限流
- 是否集群：当前不需要集群
- 流控模式：
  - 直接：API 达到限流条件时，直接限流
  - 关联：当关联的资源达到阈值时，就限流自己
  - 链路：只记录指定链路上的流量（指定资源从入口资源进来的流量，如果达到阈值，就进行限流）(API 级别的针对来源)
- 流控效果：
  - 快速失败：直接失败，抛异常
  - Wam Up：根据 codeFactor（冷加载因子，默认 3）的值，从阈值/codeFacotor，经过预热时长，才达到设置的 QPS 阈值
  - 排队等待：匀速排队，让请求以匀速的速度通过，阈值类型必须设置为 QPS，否则无效

## 2. 关联 以及 直接

### 2.1 关联

官方解释：当关联的资源达到阈值时，就限流自己。

通俗解释来说，比如那我们的程序，现在有**testA**接口和**testB**接口，当 A 关联的资源 B 达到阈值后，就限流自己，也就是 B 到达阈值，限流 A 本身。就好像我家孩子在外面打架，我来处理一样。换到程序里面来说比如一个电商系统中，支付系统达到阈值，就限流下订单系统。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f564ac4a503b420eac164eee66e9a4a8.png)

### 2.2 直接

上述关联是关联其他的 QPS 到达阈值后，限流自己

但是`直接` 其实就是自己到达阈值的时候，自己限制自己。 其实测试起来更加容易，这里就会测试忽略

## 3. 具体演示

> 当关联资源**/testB**的 qps 阈值超时 1 时，就限流**/testA**的 Rest 访问地址，当关联资源到阈值后限制配置好的资源名

```java
@RestController
public class FlowLimitController {
    @GetMapping("/testA")
    public String testA(){
        return "-----testA";
    }

    @GetMapping("/testB")
    public String testB(){
        return "-----testB";
    }
}
```

​ 给 testA 添加流控规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf8c071498a34555aa3b83ab3d7d6d12.png)

​ 为了演示效果，所以这里我们需要借助一个工具 Postman，来模仿并发密集访问/testB，先来测试访问 testB 接口

![在这里插入图片描述](https://img-blog.csdnimg.cn/a4fa924dc68f4f228b6644614bb7f406.png)

​ 这个时候我们需要多次密集访问 TestB 接口，所以我们需要添加配置，具体操作如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b6e6ef4b352640fca003f91f3e7af0be.png)

把数值修改为：

- Iterations：为 20
- Delay：300

意思就是 20 个线程每间隔 0.3 秒访问一次，然后跑起来

![在这里插入图片描述](https://img-blog.csdnimg.cn/13a441423f4d4bcb986388dd3c278bcb.png)

​ 这个时候我们来看网页中 testA 接口的效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3d26dc22069411cb2c8113267a5fd4d.png)
