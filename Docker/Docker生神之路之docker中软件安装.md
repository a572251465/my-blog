<h1 align = "center">docker中软件安装注意事项</h1>

## 1. nginx

```bash
docker run --name nginx -p 80:80 -v /opt/nginx/nginx.conf:/etc/nginx/nginx.conf -v /opt/nginx/html:/usr/share/nginx/html -v /opt/nginx/conf.d:/etc/nginx/conf.d -v /var/log/nginx/logs:/var/log/nginx -e TZ=Asia/Shanghai -d nginx
```

- `--name` 指定运行镜像名称
- `-v` 指定路径。将数据挂载到主机上
- `-p` 指定端口。表示物理机以及容器的端口
- `-d` 后台模式运行
- `-e` 指定时区

> 安装过程 参照下记

[参照地址](https://blog.csdn.net/weixin_46244732/article/details/114315708)
