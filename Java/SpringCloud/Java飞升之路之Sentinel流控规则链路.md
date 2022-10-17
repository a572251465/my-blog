<h1 align = "流控规则之链路"></h1>

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
  - Wam Up：根据 coldFactor（冷加载因子，默认 3）的值，从阈值/codeFacotor，经过预热时长，才达到设置的 QPS 阈值
  - 排队等待：匀速排队，让请求以匀速的速度通过，阈值类型必须设置为 QPS，否则无效

## 2. 链路

​ 链路流控模式指的是，当从某个接口过来的资源达到限流条件时，开启限流，它的功能有点类似于针对来源配置项，区别在于：针对来源是针对上级微服务，而链路流控是针对上级接口，也就是说它的粒度更细。

​ 比如在一个微服务中，两个接口都调用了同一个 Service 中的方法，并且该方法用 SentinelResource（用于定义资源）注解标注了，然后对该注解标注的资源（方法）进行配置，则可以选择链路模式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/0c918074df3949ffb905d490147c6b81.png)

## 具体演示

首先我们编写一个 Service

```java
//service.TestService
@Service
public class TestService {
    // 定义限流资源
    @SentinelResource("common")
    public String common(){
        return "common";
    }
}
```

然后更改接口调用这个 Service 方法

```java
@RestController
public class FlowLimitController {
    @Autowired
    TestService testService;

    @GetMapping("/testA")
    public String testA(){
        return testService.common();
    }

    @GetMapping("/testB")
    public String testB(){
        return testService.common();
    }
}
```

接下来配置流控规则：

这里要注意不要对/testA 或者/testB 进行限流规则的配置，要给用 SentinelResource 注解标注的资源进行配置限流规则，这里的意思为当我们用入口资源访问被 SentinelResource 注解标注的资源方法时，当超过阈值就会被限流，但是此时实际效果是没有效果。

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc2103a304dc421aa5b64725d746134a.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/22a49b5c19fd48dca47d619196224a81.png)

没有效果的原因是因为我们还需要添加配置，让 Sentinel 源码中 CommonFilter 中的 WEB_CONTEXT_UNIFY 参数为 false，将其配置为 false 即可根据不同的 URL 进行链路限流，如果不配置将不会生效。

```java
spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
        # 配置Sentinel dashboard地址
        dashboard: localhost:8080
        # 默认8719端口，键入被占用会自动从8719+1，直到找到未被占用的端口
        port: 8719
      # 配置为false
      web-context-unify: false
```

最后这个时候我们再来频繁的访问 testB 接口，就会出现异常的情况，这也是流量效果快速失败在链路上的体现，是直接抛出异常。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9e552ce3a275477bab135352c175a6b5.png)
