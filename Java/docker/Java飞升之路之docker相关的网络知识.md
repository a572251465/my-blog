<h1 align = "center">docker 相关的网络问题</h1>

## 1.Docker 网络介绍

​ Docker 是基于 Linux Kernel 的 namespace，CGroups,UnionFileSystem 等技术封装成的一种自定义容器格式，从而提供了一套虚拟运行环境。

> namespace: 用来做隔离的，比如 pid[进程]、net【网络】、mnt【挂载点】
>
> CGroups：Controller Groups 用来做资源限制，比如内存和 CPU 等
>
> Union File Systems：用来做 Image 和 Container 分层

### 1.1 计算机网络模型

Docker 网络官网：https://docs.docker.com/network/。

**OSI**：开放系统互联参考模型(Open System Interconnect)

**TCP/IP**:传输控制协议/网际协议(Transmission Control/Internet Protocol),是指能够在多个不同网络间实现信息传输的协议簇。TCP/IP 协议不仅仅指的是 TCP 和 IP 两个协议，而是指一个由 FTP、SMTP、TCP、UDP、IP 等协议构成的协议簇， 只是因为在 TCP/IP 协议中 TCP 协议和 IP 协议最具代表性，所以被称为 TCP/IP 协议。

分层思想：分层的基本想法是每一层都在它的下层提供的服务基础上提供更高级的增值服务，而最高层提供能运行分布式应用程序的服务

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba5184ea297c4b6a9668d2b1401c741e.png)

客户端发送请求：

![在这里插入图片描述](https://img-blog.csdnimg.cn/43f857d481794c1484a527c8eb944cd2.png)

服务端接受请求：

![在这里插入图片描述](https://img-blog.csdnimg.cn/54a8ba7907d1414f9fd1c0075db31afd.png)

## 2. Linux 中 网卡

### 2.1 查看网卡中的信息

查看网卡的命令:ip a

```shell
[vagrant@localhost ~]$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 52:54:00:4d:77:d3 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global noprefixroute dynamic eth0
       valid_lft 85987sec preferred_lft 85987sec
    inet6 fe80::5054:ff:fe4d:77d3/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:6e:31:45 brd ff:ff:ff:ff:ff:ff
    inet 192.168.56.10/24 brd 192.168.56.255 scope global noprefixroute eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe6e:3145/64 scope link
       valid_lft forever preferred_lft forever
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:bf:79:9f:de brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
```

通过 `ip a` 可以看到当前的 centos 中有的 4 个网卡信息作用分别是

| 名称    | 作用                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------- |
| lo      | 本地网卡【lo 是 loopback 的缩写，也就是环回的意思，linux 系统默认会有一块名为 lo 的环回网络接口】 |
| eth0    | 连接网络的网卡                                                                                    |
| eth1    | 和宿主机通信的网卡                                                                                |
| docker0 | docker 的网卡                                                                                     |

`ip link show`:

```shell
[vagrant@localhost ~]$ ip link show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 52:54:00:4d:77:d3 brd ff:ff:ff:ff:ff:ff
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether 08:00:27:6e:31:45 brd ff:ff:ff:ff:ff:ff
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN mode DEFAULT group default
    link/ether 02:42:bf:79:9f:de brd ff:ff:ff:ff:ff:ff
```

以文件的形式查看网卡：ls /sys/class/net

```shell
[vagrant@localhost ~]$ ls /sys/class/net
docker0  eth0  eth1  lo
```

### 2.2 配置文件中位置

在 Linux 中网卡对应的其实就是文件，所以找到对应的网卡文件即可，存放的路径

```shell
[vagrant@localhost network-scripts]$ cd /etc/sysconfig/network-scripts/
[vagrant@localhost network-scripts]$ ls
ifcfg-eth0   ifdown-eth   ifdown-ppp       ifdown-tunnel  ifup-ippp   ifup-post    ifup-TeamPort      network-functions-ipv6
ifcfg-eth1   ifdown-ippp  ifdown-routes    ifup           ifup-ipv6   ifup-ppp     ifup-tunnel
ifcfg-lo     ifdown-ipv6  ifdown-sit       ifup-aliases   ifup-isdn   ifup-routes  ifup-wireless
ifdown       ifdown-isdn  ifdown-Team      ifup-bnep      ifup-plip   ifup-sit     init.ipv6-global
ifdown-bnep  ifdown-post  ifdown-TeamPort  ifup-eth       ifup-plusb  ifup-Team    network-functions
```

### 2.3 网卡操作

网卡中增加 ip 地址

```shell
[root@localhost ~]# ip addr add 192.168.100.120/24 dev eth0
[root@localhost ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 52:54:00:4d:77:d3 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global noprefixroute dynamic eth0
       valid_lft 84918sec preferred_lft 84918sec
    inet 192.168.100.120/24 scope global eth0  #### 增加了一个IP地址
       valid_lft forever preferred_lft forever
    inet6 fe80::5054:ff:fe4d:77d3/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:6e:31:45 brd ff:ff:ff:ff:ff:ff
    inet 192.168.56.10/24 brd 192.168.56.255 scope global noprefixroute eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe6e:3145/64 scope link
       valid_lft forever preferred_lft forever
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    link/ether 02:42:bf:79:9f:de brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever

```

删除 IP 地址: ip addr delete 192.168.100.120/24 dev eth0

```shell
[root@localhost ~]# ip addr delete 192.168.100.120/24 dev eth0
[root@localhost ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 52:54:00:4d:77:d3 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global noprefixroute dynamic eth0
       valid_lft 84847sec preferred_lft 84847sec
    inet6 fe80::5054:ff:fe4d:77d3/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:6e:31:45 brd ff:ff:ff:ff:ff:ff
    inet 192.168.56.10/24 brd 192.168.56.255 scope global noprefixroute eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:fe6e:3145/64 scope link
       valid_lft forever preferred_lft forever
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default
    lik/ether 02:42:bf:79:9f:de brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
```

### 2.4 网卡信息解析

状态：UP/DOWN/UNKOWN 等

link/ether：MAC 地址

inet：绑定的 IP 地址
