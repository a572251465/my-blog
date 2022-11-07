<h1 align = "center">requestMapping注解</h1>

## 1. 请求方式

> 注解可以添加请求方式，可以是独立的，也可以是多个组成的数组

```shell
@Controller
public class TestController {
    @RequestMapping(value = "getName", method = RequestMethod.GET)
    public String getName() {
        return "my";
    }
}
```

```shell
@Controller
public class TestController {
    @RequestMapping(value = "getAge", method = {RequestMethod.GET, RequestMethod.POST})
    public String getAge() {
        return "my";
    }
}
```

## 2. 限制参数

```shell
@Controller
public class Test1Controller {
    @RequestMapping(value = "getName", params = {"password", "username!=root"})
    public String getName() {
        return "my";
    }
}
```

- 注解可以限制 参数的名称以及参数的值
- param:表示请求中必须包含名为 param 的参数
- !param:表示请求中不能包含名为 param 的参数
- param = value 表示请求中包含名为 param 的参数,但是值必须是 value
- param != value 表示请求中包含名为 param 的参数,但是值不能是 value
- 例如上述示例：参数中必须包含`password`, 以及参数 username 不能是 root

## 3. 注解`@PathVariable`

```shell
@Controller
public class Test2Controller {
    @RequestMapping(value = "getUser/{name}/{age}", method = RequestMethod.GET)
    public String getUser(@PathVariable("name") String name, @PathVariable("age") int age) {
        return "my";
    }
}
```

- 此注解更多满足 RestFul 风格请求地址。例如请求地址是`/getUser/lxx/20`. 需要识别路径以及变量
- 在映射路径的时候 需要写`"getUser/{name}/{age}"`. 括号中的名称代表的是变量
- 但是如果想获取变量，必须通过注解映射到参数中。如上述代码所示

## 4. RestFul 风格

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6942a5048634b7787462c0cff303b9c.png)

> Http 协议中,四个表示操作方式的动词"GET POST PUT DELETE",他们对应四种基本操作,GET 用来获取资源,POST 用来新建资源,PUT 用来更新资源,DELETE 用来删除资源

> 简单的说,就是我们在访问资源时,可以通过这四个状态来表示对于资源的不同操作,这四个状态表现为我们请求的四种方式

![在这里插入图片描述](https://img-blog.csdnimg.cn/4b1ed66f7fbf4ef6b6f53f795433bd3e.png)

```shell
@RestController
public class RestHandController {
    @RequestMapping(value = "editUser/{name}", method = RequestMethod.POST)
    public String addUser(@PathVariable("name") String name) {
        return "my";
    }

    @RequestMapping(value = "editUser/{name}", method = RequestMethod.DELETE)
    public String delUser(@PathVariable("name") String name) {
        return "my";
    }

    @RequestMapping(value = "editUser/{name}", method = RequestMethod.PUT)
    public String updateUser(@PathVariable("name") String name) {
        return "my";
    }

    @RequestMapping(value = "editUser/{name}", method = RequestMethod.GET)
    public String getUser(@PathVariable("name") String name) {
        return "my";
    }
}
```
