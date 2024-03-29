<h1 align = "center">Nacos服务注册中心对比提升</h1>

## 1. 各种服务注册中心对比

| 服务注册与发现框架 | CAP 模型 | 控制台管理 | 社区活跃度       |
| ------------------ | -------- | ---------- | ---------------- |
| Eureka             | AP       | 支持       | 低(2.x 版本闭源) |
| Zookeeper          | CP       | 不支持     | 中               |
| Consul             | CP       | 支持       | 高               |
| Nacos              | AP/CP    | 支持       | 高               |

### 2. CAP 模型

​ 计算机专家 埃里克·布鲁尔（Eric Brewer）于 2000 年在 ACM 分布式计算机原理专题讨论会（简称：PODC）中提出的分布式系统设计要考虑的三个核心要素：

​ 一致性（Consistency）：同一时刻的同一请求的实例返回的结果相同，所有的数据要求具有强一致性(Strong Consistency)

​ 可用性（Availability）：所有实例的读写请求在一定时间内可以得到正确的响应

​ 分区容错性（Partition tolerance）：在网络异常（光缆断裂、设备故障、宕机）的情况下，系统仍能提供正常的服务

​ 以上三个特点就是 CAP 原则（又称 CAP 定理），但是三个特性不可能同时满足，所以分布式系统设计要考虑的是在满足 P（分区容错性）的前提下选择 C（一致性）还是 A（可用性），即：CP 或 AP

### 3. CP 原则：一致性 + 分区容错性原则

​ CP 原则属于强一致性原则，要求所有节点可以查询的数据随时都要保持一直（同步中的数据不可查询），即：若干个节点形成一个逻辑的共享区域，某一个节点更新的数据都会立即同步到其他数据节点之中，当数据同步完成后才能返回成功的结果，但是在实际的运行过程中网络故障在所难免，如果此时若干个服务节点之间无法通讯时就会出现错误，从而牺牲了以可用性原则（A），例如关系型数据库中的事务。

### 4. AP 原则：可用性原则 + 分区容错性原则

​ AP 原则属于弱一致性原则，在集群中只要有存活的节点那么所发送来的所有请求都可以得到正确的响应，在进行数据同步处理操作中即便某些节点没有成功的实现数据同步也返回成功，这样就牺牲一致性原则（C 原则）。

​ 使用场景：对于数据的同步一定会发出指令，但是最终的节点是否真的实现了同步，并不保证，可是却可以及时的得到数据更新成功的响应，可以应用在网络环境不是很好的场景中。

​

## 5. Nacos 支持 CP 和 AP

​ Nacos 无缝支持一些主流的开源生态，同时再阿里进行 Nacos 设计的时候重复的考虑到了市场化的运作（市面上大多都是以单一的实现形式为主，例如：Zookeeper 使用的是 CP、而 Eureka 采用的是 AP），在 Nacos 中提供了两种模式的动态切换。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a80c3d0fccaf4fe79bc11bd5a0c94503.png)

## 6. Nacos 何时选择切换模式

    1. 一般来说，如果不需要储存服务界别的信息且服务实例通过nacos-client注册，并能够保持心跳上报，那么就可以选择AP模式。如Spring Cloud 和 Dubbo，都适用于AP模式，AP模式为了服务的可用性减弱了一致性，因此AP模式下只支持注册临时实例。

2. 如果需要在服务级别编辑或者储存配置信息，那么 CP 是必须的，K8S 服务和 DNS 服务则是用于 CP 模式。CP 模式下则支持注册持久化实例，此时则是以 Raft 协议为集群运行模式，该模式下注册实例之前必须先注册服务，如果服务不存在，则会返回错误。

3. 切换命令（默认是 AP）：

```java
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP'
```

注意：临时和持久化的区别主要在健康检查失败后的表现，持久化实例健康检查失败后会被标记成不健康，而临时实例会直接从列表中被删除。
