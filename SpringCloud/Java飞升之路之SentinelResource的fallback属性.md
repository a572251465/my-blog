<h1 align = "center">SentinelResource的fallback属性</h1>

## 1. fallback 属性

**概念：** fallback 函数名称，可选项，用于在抛出异常的时候提供 fallback 处理逻辑。fallback 函数可以针对所有类型的异常（除了 `exceptionsToIgnore` 里面排除掉的异常类型）进行处理。fallback 函数签名和位置要求：

- 返回值类型必须与原函数返回值类型一致；
- 方法参数列表需要和原函数一致，或者可以额外多一个 `Throwable` 类型的参数用于接收对应的异常。
- fallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 `fallbackClass` 为对应的类的 `Class` 对象，注意对应的函数必需为 static 函数，否则无法解析。

其实通过官网上提供的概念，我们不难看出这个属性类似于 blockHandler，但是各位一定要注意他们有本质的不同。

**注意：** fallback 属性和 blockHandler 属性的本质不同在于他们作用的异常不同：

- blockHandler：针对违反 Sentinel 控制台配置规则时触发 BlockException 异常时对应处理的属性
- fallback：针对 Java 本身出现的异常进行处理的对应属性。

## 2. 案例演示

我们已经完成环境的搭建，那我们就直接在 8084 项目的 DemoController 中编写对应代码

首先我们先来设置异常规则

```java
package com.mashibing.cloudalibabaconsumer8084;

import com.mashibing.cloudalibabacommons.entity.JsonResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@Slf4j
public class DemoController {
    //服务提供者URL
    @Value("${service-url.nacos-user-service}")
    private String SERVICE_URL;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/consumer/fallback/{id}")
    public JsonResult<String> fallback(@PathVariable Long id){
        if(id<=3){
            //通过Ribbon发起远程访问，访问9003/9004
            JsonResult<String> result = restTemplate.getForObject(SERVICE_URL+"/info/"+id,JsonResult.class);
            System.err.println(result.getData());
            return result;
        }else{
            throw new NullPointerException("没有对应的数据记录");
        }
    }
}
```

此时我们任务添加了异常，此时如果我们访问 http://localhost:8084/consumer/fallback/4（id 非法）地址时，就会出现对应的显示效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc84c607f9c546e8ba8b8e6681afeb45.png)

明显此时显示效果非常不好，我们就可以通过@SentinelResource 注解的 fallback 属性来解决这种 java 异常，给出友好提示

```java
@RestController
@Slf4j
public class DemoController {
    //服务提供者URL
    @Value("${service-url.nacos-user-service}")
    private String SERVICE_URL;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/consumer/fallback/{id}")
    //添加SentinelResource注解的fallback属性，同时设置方法来解决Java异常
    @SentinelResource(value = "falllback",fallback = "fallbackHandler")
    public JsonResult<String> fallback(@PathVariable Long id){
        if(id<=3){
            //通过Ribbon发起远程访问，访问9003/9004
            JsonResult<String> result = restTemplate.getForObject(SERVICE_URL+"/info/"+id,JsonResult.class);
            System.err.println(result.getData());
            return result;
        }else{
            throw new NullPointerException("没有对应的数据记录");
        }
    }
    //保证方法签名基本保持一致，但是要添加异常类型参数
    public JsonResult<String> fallbackHandler(Long id,Throwable e){
        JsonResult<String> result = new JsonResult<>(444,"出现未知商品id");
        return result;
    }
}
```

到这里为止，我们就很清楚的知道了 fallback 属性的作用，同时它和 blockHandler 属性类似，也可以设置 fallbackClass 属性，来指定对应类型，来处理对应的 Java 异常，当然要注意和 blockHandlerClass 属性一样，也需要让所有的方法都必需为 static 函数，否则无法解析。

## 3. 同时配置 blockHandler 和 fallback 属性

通过上述的内容，我们很清楚的知道了 fallback 属性的作用，但是大家现在想一个问题，如果我们在使用@SentinelResource 属性的时候，同时设置 blockHandler 属性和 fallback 属性时，并且同时出现了 Sentinel 异常和 Java 异常，这个时候会执行哪个方法那。

我们还是回顾一下 blockHandler 属性的概念：

- `blockHandler` / `blockHandlerClass`: `blockHandler` 对应处理 `BlockException` 的函数名称，可选项。blockHandler 函数访问范围需要是 `public`，返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为 `BlockException`。blockHandler 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 `blockHandlerClass` 为对应的类的 `Class` 对象，注意对应的函数必需为 static 函数，否则无法解析。

## 4. 案例演示

我们现在同时在 DemoController 中设置 fallback 属性和 blockHandler 属性

```java
@RestController
@Slf4j
public class DemoController {
    //服务提供者URL
    @Value("${service-url.nacos-user-service}")
    private String SERVICE_URL;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/consumer/fallback/{id}")
    //同时添加SentinelResource注解的fallback和blockHandler属性
    @SentinelResource(value = "falllback",fallback = "fallbackHandler",blockHandler = "blockHandler")
    public JsonResult<String> fallback(@PathVariable Long id){
        if(id<=3){
            //通过Ribbon发起远程访问，访问9003/9004
            JsonResult<String> result = restTemplate.getForObject(SERVICE_URL+"/info/"+id,JsonResult.class);
            System.err.println(result.getData());
            return result;
        }else{
            throw new NullPointerException("没有对应的数据记录");
        }
    }
    //处理Java异常
    public JsonResult<String> fallbackHandler(Long id,Throwable e){
        JsonResult<String> result = new JsonResult<>(444,"NullPointerException异常");
        return result;
    }

    //处理Sentinel限流
    public JsonResult<String> blockHandler(Long id, BlockException e){
        JsonResult<String> result = new JsonResult<>(445,"BlockException限流");
        return result;
    }
}
```

此时我们来设置 Sentinel 配置，我们通过熔断规则中的异常数来演示（当然也可以用其他的）

规则：在一秒内超过最小访问次数 5 次，并且异常数超过 2 的时候，就会触发熔断规则。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d058bd1720dc47c1b883958d191587e2.png)

此时我们来访问 http://localhost:8084/consumer/fallback/6 看效果：

- 在没有触发熔断之前的异常交给 fallback 来处理

![在这里插入图片描述](https://img-blog.csdnimg.cn/4b97f9a43be14897af15e116e47b9e01.png)

- 但是一旦触发熔断规则就变成了 blockHandler 来处理

![在这里插入图片描述](https://img-blog.csdnimg.cn/370bd4c37cf444d2abbe73c32488a102.png)

## 5. exceptionsToIgnore 属性

- `exceptionsToIgnore`（since 1.6.0）：用于指定哪些异常被排除掉，不会计入异常统计中，也不会进入 fallback 逻辑中，而是会原样抛出。

```java
@RestController
@Slf4j
public class DemoController {
    //服务提供者URL
    @Value("${service-url.nacos-user-service}")
    private String SERVICE_URL;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/consumer/fallback/{id}")
    //同时添加SentinelResource注解的fallback和blockHandler属性
    @SentinelResource(value = "falllback",fallback = "fallbackHandler",blockHandler = "blockHandler",
            exceptionsToIgnore = {NullPointerException.class})//被标注的异常将会被 原样抛出
    public JsonResult<String> fallback(@PathVariable Long id){
        if(id<=3){
            //通过Ribbon发起远程访问，访问9003/9004
            JsonResult<String> result = restTemplate.getForObject(SERVICE_URL+"/info/"+id,JsonResult.class);
            System.err.println(result.getData());
            return result;
        }else{
            throw new NullPointerException("没有对应的数据记录");
        }
    }
    //处理Java异常
    public JsonResult<String> fallbackHandler(Long id,Throwable e){
        JsonResult<String> result = new JsonResult<>(444,"NullPointerException异常");
        return result;
    }

    //处理Sentinel限流
    public JsonResult<String> blockHandler(Long id, BlockException e){
        JsonResult<String> result = new JsonResult<>(445,"BlockException限流");
        return result;
    }
}
```
