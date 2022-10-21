<h1 align = "center">RMI 介绍</h1>

## 1. 介绍

- ​ RMI(Remote Method Invocation) 远程方法调用。

- RMI 是从 JDK1.2 推出的功能，它可以实现在一个 Java 应用中可以像调用本地方法一样调用另一个服务器中 Java 应用（JVM）中的内容。

- RMI 是 Java 语言的远程调用，无法实现跨语言。

## 2. 执行流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/6afa3907ef7549b4b831534d2fd92d7c.png)

> - Registry(注册表)是放置所有服务器对象的命名空间。 每次服务端创建一个对象时，它都会使用 bind()或 rebind()方法注册该对象。 这些是使用称为绑定名称的唯一名称注册的。
> - 要调用远程对象，客户端需要该对象的引用。即通过服务端绑定的名称从注册表中获取对象(lookup()方法)。

## 3. API 介绍

### 3.1 Remote

> java.rmi.Remote 定义了此接口为远程调用接口。如果接口被外部调用，需要继承此接口。

```
public interface Remote{}
```

### 3.2 RemoteException

> 1. 继承了 Remote 接口的接口中，如果方法是允许被远程调用的，需要抛出此异常。
> 2. java.rmi.RemoteException

### 3.3 UnicastRemoteObject

> 1. 此类实现了 Remote 接口和 Serializable 接口。
> 2. 自定义接口实现类除了实现自定义接口还需要继承此类。

### 3.4 LocateRegistry

> 可以通过 LocateRegistry 在本机上创建 Registry，通过特定的端口就可以访问这个 Registry。

### 3.5 Naming

> Naming 定义了发布内容可访问 RMI 名称。也是通过 Naming 获取到指定的远程方法。

## 4. 代码实现

### 4.1 服务端

- 接口

```shell
package com.lihh.service;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface DemoService extends Remote {
    String demo(String demo) throws RemoteException;
}
```

- 接口实现类

```shell
package com.lihh.service.impl;

import com.lihh.service.DemoService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class DemoServiceImpl extends UnicastRemoteObject implements DemoService {

    public DemoServiceImpl() throws RemoteException {}

    @Override
    public String demo(String demo) throws RemoteException {
        return demo + "123";
    }
}
```

- 表示启动服务

```shell
package com.lihh;

import com.lihh.service.DemoService;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

public class ClientServer {
    public static void main(String[] args) throws MalformedURLException, NotBoundException, RemoteException {
        DemoService demoService = (DemoService) Naming.lookup("rmi://localhost:8989/demoService");
        System.out.println(demoService.demo("测试"));
    }
}
```

### 4.2 client 端

```shell
package com.lihh;

import com.lihh.service.DemoService;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

public class ClientServer {
    public static void main(String[] args) throws MalformedURLException, NotBoundException, RemoteException {
        DemoService demoService = (DemoService) Naming.lookup("rmi://localhost:8989/demoService");
        System.out.println(demoService.demo("测试"));
    }
}
```
