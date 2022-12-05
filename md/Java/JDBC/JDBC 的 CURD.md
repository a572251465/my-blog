<h1 align = "center">常见的CURD</h1>

> 本文主要是展示了针对 JDBC 的一些常用的 CURD

## 1. PreparedStatement 以及 Statement

```shell
package com.lihh;

import com.lihh.entity.Dept;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TestSelect001 {

    private static final String url="jdbc:mysql://127.0.0.1:3306/mydb?useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true";
    private static final String user="root";
    private static final String password="root";

    public static void main(String[] args) throws Exception {
        List<Dept> list = testPrepare();
        System.out.println(list);
    }

    public static List<Dept> testSelect() throws Exception {
        // 1. 加载驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
        // 2. 获取链接
        Connection connection = DriverManager.getConnection(url, user, password);
        List<Dept> result = new ArrayList<>();
        Statement statement = connection.createStatement();

        ResultSet resultSet = statement.executeQuery("select * from dept;");
        while (resultSet.next()) {
            Integer deptNo = resultSet.getInt("deptno");
            String dname = resultSet.getString("dname");
            String loc = resultSet.getString("loc");

            result.add(new Dept(deptNo, dname, loc));
        }

        return result;
    }

    public static List<Dept> testPrepare() throws Exception{
        List<Dept> result = new ArrayList<>();

        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection connection = DriverManager.getConnection(url, user, password);
        PreparedStatement preparedStatement = connection.prepareStatement("select * from dept;");
        ResultSet resultSet = preparedStatement.executeQuery();

        while (resultSet.next()) {
            Integer deptNo = resultSet.getInt("deptno");
            String dname = resultSet.getString("dname");
            String loc = resultSet.getString("loc");

            result.add(new Dept(deptNo, dname, loc));
        }
        return result;
    }
}
```

- 使用`Class.forName` 来加载驱动
- 获取链接`Connection connection = DriverManager.getConnection(url, user, password);`
- API【`PreparedStatement`】 以及【`Statement`】有所不同。
  - `Statement` 其实就是普通的 sql 拼接查询
  - `PreparedStatement` 可以将待替换的变量设置为`?`, 变量后续注入。这样可以避免 sql 注入
- 可以使用代码`ResultSet resultSet = statement.executeQuery` 来获取结果集
  - API【`getInt`】 可以获取整数类型的字段
  - API【`getString`】 可以获取字符串类型的字段
  - API【`getDouble`】 可以获取浮点类型的字段
  - ...

## 2. update 更新操作

```shell
    public static void updateData() throws Exception {
        Connection connection = DriverManager.getConnection(
                url,
                user,
                password
        );

        PreparedStatement preparedStatement = connection.prepareStatement("update dept set loc = '北京1' where deptno = ?");
        preparedStatement.setInt(1, 50);

        int rows = preparedStatement.executeUpdate();
        System.out.println("更新影响的数据有：" + rows);
    }
```

- 可以使用 API 【setInt】 来设置参数。
  - 第一个参数是位置
  - 第二个参数为具体的内容

## 3. delete 删除操作

```shell
    public static void deleteData() throws Exception {
        // 获取链接
        Connection connection = DriverManager.getConnection(url, user, password);

        // 生成preparedStatement
        PreparedStatement preparedStatement = connection.prepareStatement("delete from dept where deptno = ?");
        // 设置条件
        preparedStatement.setInt(1, 60);

        // 开始执行删除
        int rows = preparedStatement.executeUpdate();
        System.out.println("删除影响的数据有：" + rows);
    }
```

## 4. 批处理

### 4.1 什么是批处理?

当我们有多条 sql 语句需要发送到数据库执行的时候，有两种发送方式，一种是执行一条发送一条 sql 语句给数据库,另一个种是发送一个 sql 集合给数据库，也就是发送一个批 sql 到数据库。普通的执行过程是：每处理一条数据，就访问一次数据库；而批处理是：累积到一定数量，再一次性提交到数据库，减少了与数据库的交互次数，所以效率会大大提高,很显然两者的数据库执行效率是不同的，我们发送批处理 sql 的时候数据库执行效率要高

### 4.2 statement 语句对象实现批处理有如下问题

缺点：采用硬编码效率低，安全性较差。
原理：硬编码，每次执行时相似 SQL 都会进行编译

### 4.3 PreparedStatement+批处理

优点：语句只编译一次，减少编译次数。提高了安全性（阻止了 SQL 注入）

原理：相似 SQL 只编译一次，减少编译次数

注意: 需要设置批处理开启
<br />
`rewriteBatchedStatements=true` 开启批处理
`cachePrepStmts=true` 开启缓存
`useServerPrepStmts=true` 开启预编译

```shell
package com.lihh;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class TestBatch {
    private static final String url="jdbc:mysql://127.0.0.1:3306/mydb?useSSL=false&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useServerPrepStmts=true&cachePrepStmts=true&&rewriteBatchedStatements=true";
    private static final String user="root";
    private static final String password="root";
    private static final String driver = "com.mysql.cj.jdbc.Driver";

    static {
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) throws Exception {
        batch();
    }

    public static void batch() throws Exception{
        Connection connection = DriverManager.getConnection(url, user, password);

        PreparedStatement preparedStatement = connection.prepareStatement("insert into dept values(null, ?, ?)");

        for (int i = 1; i <= 10663; i += 1) {
            preparedStatement.setString(1, "name");
            preparedStatement.setString(2, "loc");
            preparedStatement.addBatch();

            if (i % 1000 == 0) {
                preparedStatement.executeBatch();
                preparedStatement.clearBatch();
            }
        }

        preparedStatement.executeBatch();
        preparedStatement.clearBatch();
        System.out.println("批处理执行成功");

        preparedStatement.close();
        connection.close();
    }
}
```
