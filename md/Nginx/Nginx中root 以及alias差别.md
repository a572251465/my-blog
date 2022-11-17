<h1 align = "center">root 以及alias差别</h1>

> - 今天的目的主要是梳理下在 nginx 中 root 以及 alias 在用法上有什么不同。
> - 其实这个问题看起来很简单。但是对于前端同学而言还是很困难的，毕竟有的前端同学都没弄过服务器

## 0. 结论

- `root` 以及 `alias` 都是对 url 发起根目录进行控制。但是颗粒度有所不同
- `root` 是以`root + location` 的结果作为请求根目录
- `alias` 是以`alias`作为根目录

> - 所以按照下面的示例。假如你的博客静态资源在 blog 中，但是你的 root 设置为`/usr/share/nginx/html/blog`. 那么最后的访问位置就是`/usr/share/nginx/html/blog/blog`

## 1. 基本语法

- root

  ```text
  Syntax: root xxxx;
  Default: -
  Context: server->location
  ```

- alias

  ```text
  Syntax: alias xxxx;
  Default: -
  Context: server->location
  ```

## 2. 测试目录结构

![在这里插入图片描述](https://img-blog.csdnimg.cn/3eb4beb1c924478482187bf027aefe02.png)

- 上述目录中存在两个嵌套的 blog

  - 第一个 blog 的 html 内容是 blog.
  - 第二个 blog 的 html 内容是 blog/blog

- 接下来我们单独配置 root/ alias 看看到底走哪个目录下

## 3. 测试结果

### 3.1 root 配置

- root 配置

```bash
    location /blog {
      root /usr/share/nginx/html/blog;
      index index.html index.htm;
    }
```

- 访问结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2dedf308cb1429bbd98e7a84816d73d.png)

### 3.2 alias 配置

- alias 配置

```bash
    location /blog {
        alias /usr/share/nginx/html/blog;
        index index.html index.htm;
    }
```

- 访问结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/1523aa7b30ba4f728c05409702d3c897.png)
