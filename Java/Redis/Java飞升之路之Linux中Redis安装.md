<h1 align = "center">Linux中Redis安装</h1>

> 主要是记录下 linux 环境中 Redis 的安装过程。会以十分干净的 linux 环境为基础进行安装

- 可以先查看下 linux 中是否安装`cc`，如果没有安装的话，可以直接下载

  ```bash
  yum install -y gcc
  ```

  ```bash
  yum install -y wget
  ```

## step1 上传 Redis

### 复制地址

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/ea878e1454294704a6ecedbbc82a6977.png)

### 执行下载命令

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/e09b32bee8fe46bb92e81624f7e47a61.png)
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/7f51f5a421564a65a2d30039877a49e4.png)

### 解压 修改名称

```bash
[root@VM-8-3-centos tmp]#
[root@VM-8-3-centos tmp]# tar xf redis-6.0.6.tar.gz
[root@VM-8-3-centos tmp]# mv redis-6.0.6 redis
[root@VM-8-3-centos tmp]# rm -rf redis-6
```

## step2 未卜先知

> - 在初次安装的时候，发生了错误。可以找[文章](https://blog.csdn.net/weixin_42272246/article/details/124318060)解决。如果不信的话，可以跳过此步
> - 如果执行第三步的时候 发生错误。再次执行此步骤（请看具体的错误）

## step3 编译 以及安装注册

![在这里插入图片描述](https://img-blog.csdnimg.cn/4cf647a359a6414393987e794e1bb633.png)

> 为了更好的安装，可以先查看 README.md 文件
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/e6be2768e0dc43e69dcc5d5c9c645008.png)

```bash
# 命令1
make

# 开始执行注册
make PREFIX=/opt/redis install
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/745cabea36eb4bba8152c166c64681f0.png)

## step4 配置环境变量 以及执行 install_server

### 配置环境变量

```bash
# 编辑文件
vi /etc/profile

# 添加内容
export REDIS_HOME=/opt/redis
export PATH=$PATH:$REDIS/bin

# 重新加载配置文件
source /etc/profile
```

> 如果遇到了执行 install_server 报错的话，参照[文章](https://blog.csdn.net/weixin_45949073/article/details/109213758)

![在这里插入图片描述](https://img-blog.csdnimg.cn/a62b3b82ce3048f6894805ddbc02f2d5.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f7f437eb1eef49719596fe8102dc9833.png)

## step5 启动成功的标识

![在这里插入图片描述](https://img-blog.csdnimg.cn/a675852ebcf44b179204bde3a1aa27fe.png)

## step6 启动 Redis 的命令

> - service redis_6379 start
> - service redis_6379 stop
> - service redis_6379 status

执行命令的脚本在`/etc/init.d`目录中

## 总结

![在这里插入图片描述](https://img-blog.csdnimg.cn/d8385cc78a8d4b86bd336402caa9b127.png)
