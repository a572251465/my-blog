<h1 align = "center">热点规则</h1>

## 1. 概念

何为热点？热点即经常访问的数据。很多时候我们希望统计某个热点数据中访问频次最高的 Top K 数据，并对其访问进行限制。比如：

- 商品 ID 为参数，统计一段时间内最常购买的商品 ID 并进行限制
- 用户 ID 为参数，针对一段时间内频繁访问的用户 ID 进行限制

热点参数限流会统计传入参数中的热点参数，并根据配置的限流阈值与模式，对包含热点参数的资源调用进行限流。热点参数限流可以看做是一种特殊的流量控制，仅对包含热点参数的资源调用生效

官网：https://sentinelguard.io/zh-cn/docs/parameter-flow-control.html

![在这里插入图片描述](https://img-blog.csdnimg.cn/d9cd169c4cc146dc81bd644df6c546c7.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/1a3a39bceb374dcdbd304ea16ed7b324.png)

这里还有相对应的高级选项，我们这里先了解基本规则。

## 2. 使用@SentinelResource 注解

其实这个热点限流其实就是更加细粒度的流控规则，那么如果想使用它就必须要配合对应 SentinelResource 注解。

Sentinel 提供了 @SentinelResource 注解用于定义资源，它有很多的参数，我们这里主要关注两个参数：

1. value：代表资源名称，必需项，因为需要通过 resource name 找到对应的规则，这个是必须配置的
2. blockHandler：blockHandler 对应处理 BlockException 的方法名称，可选项，访问范围需要是 public，返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为 BlockException。

## 3. 案例讲解

![在这里插入图片描述](https://img-blog.csdnimg.cn/fbce6c7b393e491f8690dd1087a69804.png)

### @SentinelResource(value="xxx")

那现在我们要完成以上图中的效果，这个时候我们首先要编写代码，在 FlowLimitController 中编写代码

```java
@GetMapping("/testHotKey")
@SentinelResource("testHotKey")
public String testHotKey(@RequestParam(value = "hot1",required = false) String hot1,
                         @RequestParam(value = "hot2",required = false)String hot2,
                         @RequestParam(value = "hot13",required = false) String hot3){
    return "----testHotKey";
}
```

然后再来配置热点规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/90d96473dd5048c4bb67752410991d50.png)

这里要说明一下，参数索引 0 实际上代表的就是我们设置的 hot1 参数

![在这里插入图片描述](https://img-blog.csdnimg.cn/90d96473dd5048c4bb67752410991d50.png)

测试，此时如果我们传入参数 hot1，并且超过阈值，就会出现限流，但是此时的限流效果为报错，显示不友好

![在这里插入图片描述](https://img-blog.csdnimg.cn/6ad7cbfab9be47bca23a905bf5290b9b.png)

## 4.SentinelResource(value="xxx",blockHandler="xxx")

刚才的演示中，我们明显发现这种限流方法的提示效果非常不友好，所以如果我们需要能够得到友好的提示，我们就需要使用@SentinelResource 注解提供的另外一个参数 blockHandler，这个参数是可以指定当出现异常时的处理方法，具体操作如下：

```java
@GetMapping("/testHotKey")
@SentinelResource(value = "testHotKey",blockHandler = "handler_HotKey")
public String testHotKey(@RequestParam(value = "hot1",required = false) String hot1,
                         @RequestParam(value = "hot2",required = false)String hot2,
                         @RequestParam(value = "hot13",required = false) String hot3){
    return "----testHotKey";
}

//处理异常方法，方法签名要和对应的接口方法保持一致
public String handler_HotKey(String hot1, String hot2,String hot3,BlockException exception){
    return "系统繁忙稍后重试。。";
}
```

然后热点规则不变，我们最终的到的限流效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0584ce157cd447f5a9b700f3c4897eb2.png)

## 5. 参数例外项

​ 其实参数例外项就是可以达到更加细粒度的控制，比如我们当前的例子中，目前 hot1 参数在访问时超过阈值就会被限流，但是我们可以通过参数例外项设置 hot1 具体等于特殊的某个值的时候，触发不同的限流效果。假如 hot1 的值等于 5 时，它的阈值可以达到 200。

​ **注意：**参数例外项中的参数类型仅支持一下 7 种数据类型

![在这里插入图片描述](https://img-blog.csdnimg.cn/b180d2f382954499a989d0a4b324c51d.png)

## 6. 案例演示

当前我们需要让 hot1 的值为 5 的时候阈值可以达到 200，首先 Sentinel 页面中修改对应热点规则（在这之前，先演示传递一个参数，否则配置失败）

![在这里插入图片描述](https://img-blog.csdnimg.cn/2b46302a869542ebaf5a57ad654a174f.png)

此时的规则为：如果当前 hot1 值为除 5 以外的其他值，都会走普通的阈值规则，但是如果一旦 hot1 的值为 5 的时候，将会走参数例外项，此时的阈值为 200，我们通过浏览器测试，当 hot1 的值等于 5 是只要阈值不超过 200 就不会出现限流。

![在这里插入图片描述](https://img-blog.csdnimg.cn/48e40d028a2f479f9b64d48ad7f61f63.png)

​ 注意：题我们到现在代码中使用了@SentinelResource 注解，此注解处理的是**Sentinel 控制台配置的异常**，通过 blockHandler 属性设置对应方法来处理和程序本身异常无关。

​ 所以以下程序中如果 hot1 的值等于 6 还是会出现 RuntimeException。

```
@SentinelResource(value = "testHotKey",blockHandler = "handler_HotKey")
public String testHotKey(@RequestParam(value = "hot1",required = false) String hot1,
                         @RequestParam(value = "hot2",required = false) String hot2,
                         @RequestParam(value = "hot3",required = false) String hot3){
    if("6".equals(hot1)){
        throw new RuntimeException("运行时异常");
    }
    return "-----testHotKey";
}
```
