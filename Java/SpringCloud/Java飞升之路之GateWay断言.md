<h1 align = "center">GateWay断言</h1>

> 每一个 Predicate 的使用，可以理解为：当满足条件后才会进行转发，如果十多个，那就是满足所有条件才会转发

## 1. 断言种类

1. After：匹配在指定日期时间之后发生的请求。
2. Before：匹配在指定日期之前发生的请求。
3. Between：需要指定两个日期参数，设定一个时间区间，匹配此时间区间内的请求。
4. Cookie：需要指定两个参数，分别为 name 和 regexp（正则表达式），也可以理解 Key 和 Value，匹配具有给定名称且其值与正则表达式匹配的 Cookie。
5. Header：需要两个参数 header 和 regexp（正则表达式），也可以理解为 Key 和 Value，匹配请求携带信息。
6. Host：匹配当前请求是否来自于设置的主机。
7. Method：可以设置一个或多个参数，匹配 HTTP 请求，比如 GET、POST
8. Path：匹配指定路径下的请求，可以是多个用逗号分隔
9. Query：需要指定一个或者多个参数，一个必须参数和一个可选的正则表达式，匹配请求中是否包含第一个参数，如果有两个参数，则匹配请求中第一个参数的值是否符合正则表达式。
10. RemoteAddr：匹配指定 IP 或 IP 段，符合条件转发。
11. Weight：需要两个参数 group 和 weight（int），实现了路由权重功能，按照路由权重选择同一个分组中的路由

## 2. 演示部分

### 2.1 After

> 匹配在指定时间之后发生的请求，可以对应提前上线业务

yml 配置

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
            - After=2022-01-07T14:39:10.529+08:00[Asia/Shanghai] # 在这个时间之后的请求都能通过，当前没有为题以后，故意改为1个小时以后
```

写一个测试类，来获取当前时间

```java
public class TestDateTime {
    public static void main(String[] args) {
        ZonedDateTime zbj = ZonedDateTime.now();//默认时区
        System.out.println(zbj);
    }
}
```

测试：

当前时间之后请求没有问题

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc5026b39c6b4760979732422d56b321.png)

设置为 1 个小时会后访问 404(将 yml 中时间调整为当前时间的一个小时以后)

![在这里插入图片描述](https://img-blog.csdnimg.cn/b9629422257f408997472d1e30c1204b.png)

当这个 After 理解了以后，剩下的关于日期时间的设置 Before、Between 道理都是一样的，只不过是限定不同的日期时间区间

### 2.2 Cookie

需要指定两个参数，分别为 name 和 regexp（正则表达式），也可以理解 Key 和 Value，匹配具有给定名称且其值与正则表达式匹配的 Cookie。

简单理解就是路由规则会通过获取 Cookie name 值和正则表达式去匹配，如果匹配上就会执行路由，如果匹配不上则不执行。

我们可以分为两种情况演示，Cookie 匹配，Cookie 不匹配

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
            # - After=2022-01-07T14:39:10.529+08:00[Asia/Shanghai] # 在这个时间之后的请求都能通过
            - Cookie=username,[a-z]+ # 匹配Cookie的key和value（正则表达式）
```

那么我们通过 postman 来进行测试

当 Cookie 匹配时：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e18627953d8b4468a69f671d9bb9df25.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/0acb11f939e24894be7063b78916107a.png)

当 Cookie 不匹配时：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5e7802b6c8cb441ba83c6bbc448b7b58.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/139f1c3462144357b282fa2597014f1d.png)

### 2.3 Header

需要两个参数 header 和 regexp（正则表达式），也可以理解为 Key 和 Value，匹配请求携带信息。

实际上就是请求头携带的信息，官网给出的案例是 X-Request-Id，那我们就用这个做实验

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
            #- After=2022-01-07T14:39:10.529+08:00[Asia/Shanghai] # 在这个时间之后的请求都能通过
            #- Cookie=username,[a-z]+
            - Header=X-Request-Id,\d+ #表示数字
```

测试

![在这里插入图片描述](https://img-blog.csdnimg.cn/e380bc8840e44ff7a0f3475b53aec9cb.png)

### 2.4 Host

匹配当前请求是否来自于设置的主机。

这个比较比较简单，我们直接来试验

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
            #- After=2022-01-07T14:39:10.529+08:00[Asia/Shanghai] # 在这个时间之后的请求都能通过
            #- Cookie=username,[a-z]+
            #- Header=X-Request-Id,\d+ #表示数字
            - Host=**.mashibing.com #匹配当前的主机地址发出的请求
```

postman

![在这里插入图片描述](https://img-blog.csdnimg.cn/ecc13f9efdea48daac7044133d224af3.png)

### 2.5 Query

需要指定一个或者多个参数，一个必须参数和一个可选的正则表达式，匹配请求中是否包含第一个参数，如果有两个参数，则匹配请求中第一个参数的值是否符合正则表达式。

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
            #- After=2022-01-07T14:39:10.529+08:00[Asia/Shanghai] # 在这个时间之后的请求都能通过
            #- Cookie=username,[a-z]+
            #- Header=X-Request-Id,\d+ #表示数字
            #- Host=**.mashibing.com #匹配当前的主机地址发出的请求
            #- Method=GET,POST
            - Query=id,.+ # 匹配请求参数，这里如果需要匹配多个参数，可以写多个Query
```

测试：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1101ae3c32bc43929b6126b16f61a2a8.png)

### 2.6 Weight

需要两个参数 group 和 weight（int），实现了路由权重功能，按照路由权重选择同一个分组中的路由

官网提供的演示 yml

```java
spring:
  cloud:
    gateway:
      routes:
      - id: weight_high
        uri: https://weighthigh.org
        predicates:
        - Weight=group1, 8
      - id: weight_low
        uri: https://weightlow.org
        predicates:
        - Weight=group1, 2
```

该路由会将约 80% 的流量转发到[weighthigh.org](https://weighthigh.org/)，将约 20% 的流量[转发](https://weighlow.org/)到[weightlow.org](https://weighlow.org/)

## 3. 总结：

Predicate 就是为了实现一组匹配规则，让请求过来找到对应的 Route 进行处理。
