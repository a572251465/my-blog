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

## 2. namespace 之间的通信

- 创建两个 namespace

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b8effa5bcf64913a3742da2bbda0d71.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/a66d97c96c334f4c9471e97cd6775c30.png)

### 2.1 两个 namespace 之间进行通信

> 要实现两个 network namespace 的通信，我们需要实现到的技术是：
> veth pair：Virtual Ethernet Pair，是一个成对的端口，可以实现上述功能

![在这里插入图片描述](https://img-blog.csdnimg.cn/64b52b0716e5400a98d404132946de38.png)

```shell
ip link add veth-ns1 type veth peer name veth-ns2
```

然后在宿主机中就会多出一对网卡信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/6ccc3d1e76ae4f689aa5be6565dd2d58.png)

然后将创建好的 veth-ns1 交给 namespace1，把 veth-ns2 交给 namespace2

```shell
ip link set veth-ns1 netns ns1
ip link set veth-ns2 netns ns2
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/dd154296935b46be89d0b5bd19239397.png)

再查看 ns1 和 ns2 中的 link 情况

```shell
[root@localhost ~]# ip netns exec ns1 ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
6: veth-ns1@if5: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 7e:bb:ee:13:a2:9a brd ff:ff:ff:ff:ff:ff link-netnsid 1
[root@localhost ~]# ip netns exec ns2 ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
5: veth-ns2@if6: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 7e:f8:18:5a:ef:1f brd ff:ff:ff:ff:ff:ff link-netnsid 0
```

此时 veth-ns1 和 veth-ns2 还没有 ip 地址，显然通信还缺少点条件

```shell
ip netns exec ns1 ip addr add 192.168.0.11/24 dev veth-ns1
ip netns exec ns2 ip addr add 192.168.0.12/24 dev veth-ns2
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/56237a2946ba4360a6808b1a2e02dd6b.png)

再次查看，发现 state 是 DOWN.所以我们需要启用对应的网卡

```shell
[root@localhost ~]# ip netns exec ns1 ip link set veth-ns1 up
[root@localhost ~]# ip netns exec ns2 ip link set veth-ns2 up
```

然后查看状态

![在这里插入图片描述](https://img-blog.csdnimg.cn/3def7b03f8d24ddd9e849ffe6ec796fc.png)

然后就可以相互之间 ping 通了

```shell
ip netns exec ns1 ping 192.168.0.12 ip netns exec ns2 ping 192.168.0.11
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/f59b1479a49449fda1e1c3566b7a9140.png)

## 3. 容器内的 namespace

​ 按照上面的描述，实际上每个 container，都会有自己的 network namespace，并且是独立的，我们可以进入到容器中进行验证

创建两个 Tomcat 容器

> docker run -d --name tomcat01 -p 8081:8080 tomcat
>
> docker run -d --name tomcat02 -p 8082:8080 tomcat

进入到两个容器中，查看 ip

> docker exec -it tomcat01 ip a
>
> docker exec -it tomcat02 ip a

相互 ping 是可以 ping 通的

![在这里插入图片描述](https://img-blog.csdnimg.cn/6674884157954c46bfff7ed735183a8b.png)

> 问题：此时 tomcat01 和 tomcat02 属于两个 network namespace，是如何能够 ping 通的？ 有些小伙伴可能会想，不就跟上面的 namespace 实战一样吗？注意这里并没有 veth-pair 技术

## 4. 深入分析 container 网络-Bridge

### 4.1 Docker 默认 Bridge

首先我们通过`ip a`可以查看当前宿主机的网络情况

```shell
[root@localhost tomcat]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 52:54:00:4d:77:d3 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global noprefixroute dynamic eth0
       valid_lft 66199sec preferred_lft 66199sec
    inet6 fe80::5054:ff:fe4d:77d3/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:6e:31:45 brd ff:ff:ff:ff:ff:ff
    inet 192.168.56.10/24 brd 192.168.56.255 scope global noprefixroute eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe6e:3145/64 scope link
       valid_lft forever preferred_lft forever
4: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:52:d4:0a:9f brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:52ff:fed4:a9f/64 scope link
       valid_lft forever preferred_lft forever
24: veth78a90d0@if23: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether 7e:6b:8c:bf:7e:30 brd ff:ff:ff:ff:ff:ff link-netnsid 2
    inet6 fe80::7c6b:8cff:febf:7e30/64 scope link
       valid_lft forever preferred_lft forever
26: vetha2bfbf4@if25: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether ce:2f:ed:e5:61:32 brd ff:ff:ff:ff:ff:ff link-netnsid 3
    inet6 fe80::cc2f:edff:fee5:6132/64 scope link
       valid_lft forever preferred_lft forever
```

然后查看 tomcat01 中的网络： docker exec -it tomcat01 ip a 可以发现

```shell
[root@localhost tomcat]# docker exec -it tomcat01 ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
23: eth0@if24: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

我们发现在宿主机中是可以 ping 通 Tomcat01 的网络的。

```shell
[root@localhost tomcat]# ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2) 56(84) bytes of data.
64 bytes from 172.17.0.2: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes from 172.17.0.2: icmp_seq=2 ttl=64 time=0.038 ms
^C
--- 172.17.0.2 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 999ms
rtt min/avg/max/mdev = 0.038/0.038/0.038/0.000 ms
```

既然可以 ping 通，而且 centos 和 tomcat01 又属于两个不同的 NetWork NameSpace，他们是怎么连接的？看图

![在这里插入图片描述](https://img-blog.csdnimg.cn/1dfcc6e7301b400d9bb88ec10b0bba6a.png)

其实在 tomcat01 中有一个 eth0 和 centos 的 docker0 中有一个 veth 是成对的，类似于之前实战中的 veth-ns1 和 veth-ns2,要确认也很简单
