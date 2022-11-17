<h1 align = "center">Nginx</h1>

[详细案例参考](http://www.zhufengpeixun.com/strong/html/125.10.nginx.html#t539.%20%E6%A0%B8%E5%BF%83%E6%A8%A1%E5%9D%97)

## 1. Nginx 优势

![在这里插入图片描述](https://img-blog.csdnimg.cn/b89c120934904145a74ee4d0997e1814.png)

## 2. Nginx 架构

![在这里插入图片描述](https://img-blog.csdnimg.cn/e5ba3e094b7949b49684aa6a0c0b0bc7.png)

## 3. Nginx 日志切割

`/etc/logrotate.d/nginx`
[参考地址](https://blog.csdn.net/u010201665/article/details/113948287)

## 4. 安装注意事项

### 4.1 默认安装下目录地址

| 路径                           | 用途                     |
| ------------------------------ | ------------------------ |
| /etc/nginx/nginx.conf          | 核心配置文件             |
| /etc/nginx/conf.d/default.conf | 默认 http 服务器配置文件 |
| /etc/nginx/modules             | 最基本的共享库和内核模块 |
| /var/cache/nginx               | nginx 的缓存目录         |
| /var/log/nginx                 | nginx 的日志目录         |
| /usr/sbin/nginx                | 可执行命令               |
| /usr/sbin/nginx-debug          | 调试执行可执行命令       |

## 5. nginx 配置解析

```bash

#user  nobody;
worker_processes  1;

error_log  logs/error.log warn;

pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

> nginx 大致分为三大块配置区域，分别是 http/ server/ location。 但是配置规则都是相同。这里会描述下每个字段的含义

- `user` 表示启动子程序的用户，一般都是在安装的时候使用参数`--user` 来指定的
- `worker_processes` 表示 worker 进程数，最好的方式就是跟 CPU 核数相同（或是 核数 - 1）
- `error_log logs/error.log warn;` 表示如果出现 warn 级别以上的错误，应该打印到哪个文件中
- `events{ worker_connections: 1024; }` 表示最大连接数，也就是最大并发数
- `http` 服务模块
  - `include mime.types;` 一些包含的数据类型，一般都是文件后缀做区分
  - `default_type application/octet-stream;` 表示默认类型
  - `log_format` 表示 log 格式
  - `access_log logs/access.log main;` 表示正常的信息的 log，使用 main 格式
  - `sendfile on;` 表示是否启动零拷贝
  - `keepalive_timeout 65;` 表示 keep alive 链接延迟时间
  - `gzip on;` 针对静态资源 是否启动 gzip 压缩
  - `server` 服务
    - `listen 80;` 表示监听端口 默认监听是 80 端口
    - `server_name localhost;` 服务名称。一个端口可以对应多个 server_name。
    - `charset` 表示字符集
    - `access_log` 表示正常的打印 log 地址
    - `location` 表示匹配地址
      - `root` 表示根目录
      - `index index.html index.htm;` 表示索引页面
    - `error_page 404 /404.html;` 表示 404 找不到页面执行的路径

## 6. server 匹配

- 匹配规则

  > 精确匹配 > `*`在前 > `*`在后 > 按文件中的顺序匹配正则式域名 > default server

- HTTP 请求处理
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/79accc06f0684633b2a8220bcafe4666.png)

## 6. 核心模块

### 6.1 监听 nginx 客户端状态

- --with-http_stub_status_module 监控 nginx 客户端的状态

- 语法

```text
Syntax: stub_status on/off;
Default: -
Context: server->location
```

### 6.2 随机主页

- --with-http_random_index_module 在根目录里随机选择一个主页显示
- 语法

```text
Syntax: random_index on/off;
Default: off
Context: location
```

### 6.3 内容替换

- --with-http_sub_module 内容替换
- 语法

```text
Syntax: sub_filter string replacement;
Default: --
Context: http,service,location
```

### 6.4 请求限制

- --with-limit_conn_module 连接频率限制
- --with-limit_req_module 请求频率限制
- 一次 TCP 请求至少产生一个 HTTP 请求
- SYN > SYN,ACK->ACK->REQUEST->RESPONSE->FIN->ACK->FIN->ACK

#### 6.4.1 ab 命令

- Apache 的 ab 命令模拟多线程并发请求，测试服务器负载压力，也可以测试 nginx、lighthttp、IIS 等其它 Web 服务器的压力
  - -n 总共的请求数
  - -c 并发的请求数

```shell
yum -y install httpd-tools
ab -n 40 -c 20 http://127.0.0.1/
```

#### 6.4.2 连接限制

- ngx_http_limit_conn_module 模块会在 NGX_HTTP_PREACCESS_PHASE 阶段生效
- 针对全部的 worker 生效，依赖 realip 模块获得到的真实 IP

- 语法
  > limit_conn_zone 定义共享内存(大小)，以及 key 关键字

```text
# 可以以IP为key zone为空间的名称 size为申请空间的大小
Syntax: limit_conn_zone key zone=name:size;
Default: --
Context: http(定义在server以外)
```

- limit_conn

```text
# zone名称 number限制的数量
Syntax: limit_conn  zone number;
Default: --
Context: http,server,location
```

```text
Syntax: limit_conn_log_level  info|notice|warn|error;
Default: limit_conn_log_level error;
Context: http,server,location
```

```text
Syntax: limit_conn_status  code;
Default: limit_conn_status 503;
Context: http,server,location
```

- 案例

```text
limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
server {
  location /{
      limit_conn_status 500;
      limit_conn_status warn;
      limit_rate 50; //每秒最多返回50字节
      limit_conn conn_zone 1; //并发连接数最多是1
  }
}
```

### 6.5 DNS

#### sendfile

- 不经过用户内核发送文件

- 语法

```text
语法	sendfile on / off
默认	sendfile off;
上下文	http,server,location,if in location
```

#### tcp_nopush

- 在 sendfile 开启的情况下，合并多个数据包，提高网络包的传输效率
- 语法

```text
语法	tcp_nopush on / off
默认	tcp_nopush off;
上下文	http,server,location
```

#### tcp_nodelay

- 在 keepalive 连接下，提高网络包的传输实时性
- 语法

```text
语法	tcp_nodelay on / off
默认	tcp_nodelay on;
上下文	http,server,location
```

#### gzip

- gzip
- 压缩文件可以节约带宽和提高网络传输效率

```text
语法	gzip on / off
默认	gzip off;
上下文	http,server,location
```

<hr />

- gzip_comp_level
- 压缩比率越高，文件被压缩的体积越小

```text
语法	gzip_comp_level level
默认	gzip_comp_level 1;
上下文	http,server,location
```

<hr />

- gzip_http_version
- 压缩版本

```text
语法	gzip_http_version 1.0/1.1
默认	gzip_http_version 1.1;
上下文	http,server,location
```

<hr />

- http_gzip-static_module
- 先找磁盘上找同名的.gz 这个文件是否存在,节约 CPU 的压缩时间和性能损耗

```text
语法	gzip_static on/off
默认	gzip_static off;
上下文	http,server,location
```

## 7. 跨域

> 跨域只会出现在浏览器以及服务器之间。是浏览器一种信息保密机制。只要是协议/ 域名/ 端口 任何一方出现不同都会出现跨域

- 语法

```text
语法	add_header name value
默认	add_header --;
上下文	http,server,location
```

- nginx 配置

```text
location ~ .*\.json$ {
     add_header Access-Control-Allow-Origin http://127.0.0.1:8080;
     add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
     root /data/json;
}
```

## 8. 防盗链

- 防止网站资源被盗用
- 保证信息安全
- 防止流量过量
- 使用`http_refer`防盗链

- 语法

```text
语法	valid_referers none、block、server_names、IP
默认	-
上下文	server,location
```

- 实际代码

```text
location ~ .*\.(jpg|png|gif)$ {
    expires 1h;
    gzip off;
    gzip_http_version 1.1;
    gzip_comp_level 3;
    gzip_types image/jpeg image/png image/gif;
    # none没有refer blocked非正式HTTP请求 特定IP
        valid_referers none blocked 115.29.148.6;
        if ($invalid_referer) { # 验证通过为0，不通过为1
            return 403;
        }
    root /data/images;
}
```

## 9. 正向代理

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c64b0649a0446dfb182d28f452ba781.png)

```text
resolver 8.8.8.8; #谷歌的域名解析地址
location / {
    # $http_host 要访问的主机名 $request_uri请求路径
    proxy_pass http://$http_host$request_uri;
}
```
