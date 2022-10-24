<h1 align = "center">Network Namespace</h1>

> ​ Network Namespace 是实现网络虚拟化的重要功能，它能创建多个隔离的网络空间，它们有独自的网络栈信息。不管是虚拟机还是容器，运行的时候仿佛自己就在独立的网络中。

## 1. namespace 实战

### 1.1 常用 namespace 命令

- 查询列表

```bash
ip netns list
```

- 添加 namespace

```bash
ip netns add ns1
```

- 删除 namespace

```bash
ip netns delete ns1
```

### 1.2 查询 namespace 网卡情况

- 网卡详细信息

```bash
ip netns exec ns1 ip a
ip netns exec ns1 ip link show
```

> 运行查询网络 ns1,并执行命令 ip a

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2666f1e3d4e4bdabc26f6c4b3d31d40.png)

- 启动网络状态

```bash
ip netns exec ns1 ifup lo
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/bc1f3bd0dae74966b64141921fae7f9a.png)

- 关闭网络状态

```bash
ip netns exec ns1 ifdown lo
```

- 通过`link` 设置网络状态

```bash
ip netns exec ns1 ip link set lo up
ip netns exec ns1 ip link set lo down
```
