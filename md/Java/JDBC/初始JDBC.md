<h1 align = "center">初始JDBC</h1>

![在这里插入图片描述](https://img-blog.csdnimg.cn/d8c6a7e2db6e4ee186b5d548ae26b82a.png)

## 1. 简述发展史

- 早起 java 侧以及数据库管理厂商 执行关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/84205a5fa4e14d7b9a32707a0942fc41.png)

- 后期 java 侧 以及数据库 管理厂商

![在这里插入图片描述](https://img-blog.csdnimg.cn/b16d42c6417144e199c443ecc4e884ea.png)

> 1. 其实上述的逻辑很简单，在 Java 侧定义了一系列的关于 DB sql 相关的接口
> 2. 每个数据库管理厂商 都必须实现 Java 的接口。
> 3. 而每个实现接口的方式就是 驱动。
> 4. 所以每个数据源都会有一个驱动，用来做 Java 以及数据库之间的传输媒介

![在这里插入图片描述](https://img-blog.csdnimg.cn/68186668bd994bcab84cf1bf0b05fb18.png)

## 2. JDBC 规范

- DriverManager 类 作用：管理各种不同的 JDBC 驱动
- Connection 接口
- Statement 接口和 PreparedStatement 接口
- ResultSet 接口

![在这里插入图片描述](https://img-blog.csdnimg.cn/651276867b8841f1b4455ad4ce9e03dc.png)

## 3. JDBC 连接过程

- 加载驱动 Driver
- 注册驱动 DriverManager
- 获取连接
- 获取对应的 Statement
- 执行 sql 返回结果
- 释放资源

<br />

- url 组成注意事项:

  - 协议 jdbc:mysql
  - IP 127.0.0.1/localhost
  - 端口号 3306
  - 数据库名字 mydb
  - 参数

  ```bash
  jdbc:mysql://127.0.0.1:3306/mydb?useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
  ```

- 实例代码

```shell
package com.lihh;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.Statement;

public class Test001 {
    public static void main(String[] args) throws Exception {

        // 1. 加载驱动 Driver
        Driver driver = new com.mysql.cj.jdbc.Driver();

        // 2. 注册驱动 DriverManager
        DriverManager.registerDriver(driver);

        // 3. 获取连接
        /*
         *
         * user:用户名
         * password:密码
         * url:统一资源定位符 定位我们要连接的数据库的
         *   1协议         jdbc:mysql
         *   2IP          127.0.0.1/localhost
         *   3端口号       3306
         *   4数据库名字   mydb
         *   5参数
         *   协议://ip:端口/资源路径?参数名=参数值&参数名=参数值&....
         *   jdbc:mysql://127.0.0.1:3306/mydb
         * */
        String url="jdbc:mysql://127.0.0.1:3306/mydb?useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai";
        String user="root";
        String password="root";
        Connection connection = DriverManager.getConnection(url, user, password);

        // 4. 获取对应的Statement
        Statement statement = connection.createStatement();

        // 5. 执行sql 结果
        String sql = "insert into dept values(50,'教学部','北京');";
        int rows = statement.executeUpdate(sql);
        System.out.println("影响的数据有：" + rows + "条");

        // 6. 释放资源
        statement.close();
        connection.close();
    }
}
```
