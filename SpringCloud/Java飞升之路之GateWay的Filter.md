<h1 align = "center">GateWay的Filter</h1>

> 路由过滤器允许以某种方式修改传入的 HTTP 请求或传出的 HTTP 响应。路由过滤器的范围是特定的路由。Spring Cloud Gateway 包含许多内置的 GatewayFilter 工厂。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b9ef21ecf0d4663ac3008fb8009d5f4.png)

## 1. 内置 Filter

1. GateWay 内置的 Filter 生命周期为两种：pre（业务逻辑之前）、post（业务逻辑之后）

2. GateWay 本身自带的 Filter 分为两种： GateWayFilter（单一）、GlobalFilter（全局）
3. 单一的有 32 种，全局的有 9 种
4. 官方网址：https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters

## 2. 实例

### 2.1 StripPrefix

该 StripPrefix 有一个参数，parts。该 parts 参数指示在将请求发送到下游之前要从请求中剥离的路径中的部分数。

案例：比如我们现在在 9001 微服务上加一个 context-path 配置

```yml
server:
  port: 9001
  servlet:
    context-path: /nacos-provider
.....
```

现在 9001 的访问路径变为 http://localhost:9001/nacos-provider/msb/get

目前的网关 9999 配置信息为

```java
server:
  port: 9999
spring:
  application:
    name: cloud-gateway-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    gateway:
      discovery:
        locator:
          enabled: false # 是否与服务发现进行组合，通过ServiceID转发到具体的服务实例，默认为false，
                        # 设置为true便开启通过服务注册中心来自动根据SeviceID创建路由功能。
      routes:
        - id: nacos-provider # 路由ID，唯一不可重复，最好配合服务名
          uri: lb://nacos-provider # 匹配提供服务的路由地址 lb://代表开启负载均衡
          predicates: # 断言
            - Path=/msb/** # 匹配对应地址
```

为了保证断言能够匹配，此时通过网关的访问地址应该改为：http://localhost:9999/msb/nacos-provider/msb/get，但是出现了 404 因为多了一层路径 http://localhost:9001/msb/nacos-provider/msb/get

![在这里插入图片描述](https://img-blog.csdnimg.cn/6243239a6a944b21a2c9a68d1e44f285.png)

那么如果想要解决，我们应该在转发的时候去地址中最前面的/msb，所以我们就需要使用 FIlter：StripPrefix

yml

```java
server:
  port: 9999
spring:
  application:
    name: cloud-gateway-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    gateway:
      discovery:
        locator:
          enabled: false # 是否与服务发现进行组合，通过ServiceID转发到具体的服务实例，默认为false，
                        # 设置为true便开启通过服务注册中心来自动根据SeviceID创建路由功能。
      routes:
        - id: nacos-provider # 路由ID，唯一不可重复，最好配合服务名
          uri: lb://nacos-provider # 匹配提供服务的路由地址 lb://代表开启负载均衡
          predicates: # 断言
            - Path=/msb/** # 匹配对应地址
          filters:
            - StripPrefix=1 # 去掉地址中的第一部分
          # http://localhost:9999/msb/nacos-provider/msb/get
          # http://localhost:9999/nacos-provider/msb/get
```

最后我们来看效果，成功转发

![在这里插入图片描述](https://img-blog.csdnimg.cn/eca56ceff1794e66b866638586b41cda.png)

## 3. 自定义 Filter

要实现 GateWay 自定义过滤器，那么我们需要实现两个接口

- GlobalFilter
- Ordered

### 演示

首先我们新建一个类 MyFilter

```java
@Component
@Slf4j
public class MyFilter implements Ordered, GlobalFilter {
    /**
     * @param exchange 可以拿到对应的request和response
     * @param chain 过滤器链
     * @return 是否放行
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String username = exchange.getRequest().getQueryParams().getFirst("username");
        log.info("*************MyFilter:"+new Date());
        if(username == null){
            log.info("**********用户名为null，非法用户，请求被拒绝！");
            //如果username为空，返回状态码为406，不可接受的请求
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    /**
     * 加载过滤器的顺序
     * @return 整数数字越小优先级越高
     */
    @Override
    public int getOrder() {
        return 0;
    }
}

```

测试，此时我们的逻辑是在访问同时要传入 username 参数同时不能为空，否则不会放行本次请求。

传入正确参数：

![在这里插入图片描述](https://img-blog.csdnimg.cn/39ec3fb0cc4f452c983013e0c7233e35.png)

未传入正确参数：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e06df9f9c03543f6b723a7604bd49127.png)
