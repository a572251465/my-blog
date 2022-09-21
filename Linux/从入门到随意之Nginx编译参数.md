<h1 align = "center">编译参数</h1>

## 必备软件

```shell
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
```

## 安装目录以及路径

```text
--prefix=/etc/nginx #安装目录
--sbin-path=/usr/sbin/nginx #可执行文件
--modules-path=/usr/lib64/nginx/modules #安装模块
--conf-path=/etc/nginx/nginx.conf  #配置文件路径
--error-log-path=/var/log/nginx/error.log  #错误日志
--http-log-path=/var/log/nginx/access.log  #访问日志
--pid-path=/var/run/nginx.pid #进程ID
--lock-path=/var/run/nginx.lock #加锁对象
```

## 临时性文件

```text
--http-client-body-temp-path=/var/cache/nginx/client_temp #客户端请求体临时路径
--http-proxy-temp-path=/var/cache/nginx/proxy_temp #代理临时路径
--http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp
--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp
--http-scgi-temp-path=/var/cache/nginx/scgi_temp
```

## 指定用户

```text
--user=nginx   #指定用户
--group=nginx  #指定用户组
```

## 其他参数

```text
--with-compat
--with-file-aio
--with-threads
--with-http_addition_module
--with-http_auth_request_module
--with-http_dav_module
--with-http_flv_module
--with-http_gunzip_module
--with-http_gzip_static_module
--with-http_mp4_module
--with-http_random_index_module
--with-http_realip_module
--with-http_secure_link_module
--with-http_slice_module
--with-http_ssl_module
--with-http_stub_status_module
--with-http_sub_module
--with-http_v2_module
--with-mail
--with-mail_ssl_module
--with-stream
--with-stream_realip_module
--with-stream_ssl_module
--with-stream_ssl_preread_module
--param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic -fPIC'
```
