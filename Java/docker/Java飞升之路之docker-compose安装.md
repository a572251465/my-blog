<h1 align = "center">docker-compose 安装</h1>

> 以下内容参照官网也是可以的。跟官网内容保持一致

官网地址：https://docs.docker.com/compose

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

速度比较慢的话使用下面的地址：

```shell
curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

```

修改文件夹权限

```shell
chmod +x /usr/local/bin/docker-compose
```

建立软连接

```shell
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

校验是否安装成功

```shell
docker-compose --version
```
