<h1 align = "center">常用注解</h1>

## 1. @RequestMapping

### 1.1 作用：

- 用于建立请求 URL 和处理请求方法之间的对应关系

### 1.2 出现位置：

- 类上： 请求 URL 的第一级访问目录。此处不写的话，就相当于应用的根目录。写的话需要以/开头
- 方法上： 请求 URL 的第二级访问目录

### 1.3 属性

- value：用于指定请求的 URL。它和 path 属性的作用是一样的。
- method：用于指定请求的方式。
- params(了解)：用于指定限制请求参数的条件。它支持简单的表达式。要求请求参数的 key 和 value 必须和 配置的一模一样。
- headers(了解)：用于指定限制请求消息头的条件。

## 2. @RequestParam

### 2.1 作用

- 把请求中指定名称的参数给控制器中的形参赋值。

### 2.2 属性：

- value：请求参数中的名称。
- required：请求参数中是否必须提供此参数。默认值：true。表示必须提供，如果不提供将报错。

```js
@RequestMapping("/getRequestParam")
public String getRequestParam(@RequestParam("name")String uname, @RequestParam(value="age",required=false)Integer age){
    System.out.println(username+","+age);
    return "success";
}
```

## 3. @PathVariable

### 3.1 Restful 的简介 ：

- REST（英文：Representational State Transfer，简称 REST）restful 是一种软件架构风格、设计风格，而不是标准，只是提供了一组设计原则和约束条件。它主要用于客户端和服务器交互类的软件。基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存等机制。

### 3.2 restful 的优点

- 它结构清晰、符合标准、易于理解、扩展方便，所以正得到越来越多网站的采用。

### 3.3 作用：

- 用于绑定 url 中的占位符。例如：请求 url 中 /delete/{id}，这个{id}就是 url 占位符。 url 支持占位符是 spring3.0 之后加入的。是 springmvc 支持 rest 风格 URL 的一个重要标志。

### 3.4 属性：

- value：用于指定 url 中占位符名称。
- required：是否必须提供占位符。

```js
@Controller
public class PathController {
    @RequestMapping("/testPathVariable/{id}/{username}")
    public String testPathVariable(@PathVariable("id") Integer id, @PathVariable("username") String username){
        System.out.println("id:"+id);
        System.out.println("username:"+username);
        System.out.println("testPathVariable1");
        return "success";
    }
}
```

## 4. @RequestHeader

### 4.1 作用：

- 用于获取请求消息头。

### 4.2 属性：

- value：提供消息头名称
- required：是否必须有此消息头

```js
@RequestMapping("/getRequestHeader")
public String getRequestHeader(@RequestHeader(value="Accept", required=false)String requestHeader){
    System.out.println(requestHeader);
    return "success";
}
```

## 5. @CookieValue

### 5.1 作用：

- 用于把指定 cookie 名称的值传入控制器方法参数。

### 5.2 属性：

- value：指定 cookie 的名称。
- required：是否必须有此 cookie

```js
@RequestMapping("/getCookie")
public String getCookie(@CookieValue(value="JSESSIONID",required=false) String cookieValue){
    System.out.println(cookieValue);
    return "success";
}
```
