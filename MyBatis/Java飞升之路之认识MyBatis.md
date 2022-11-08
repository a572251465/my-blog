<h1 align = "center">认识MyBatis</h1>

## 1. 原 JDBC 缺陷

- 编码繁琐
- 需要我们自己将结果集映射成为对象
- 性能不好。例如：连接池，缓存等
- SQL 语句 跟 Java 代码 耦合度过高

## 2. 认识 ORM

> ORM，Object-Relationl Mapping，对象关系映射，它的作用是在关系型数据库和对象之间作一个映射，这样我们在具体的操作数据库的时候，只要像平时操作对象一样操作它就可以了，ORM 框架会根据映射完成对数据库的操作，就不需要再去和复杂的 SQL 语句打交道了

![在这里插入图片描述](https://img-blog.csdnimg.cn/78a88eba38ea44688d9ec93b9763f093.png)

### 2.1 持久化

> 持久（Persistence），即把数据（如内存中的对象）保存到可永久保存的存储设备中（如磁盘）。持久化的主要应用是将内存中的数据存储在关系型的数据库中，当然也可以存储在磁盘文件中、XML 数据文件中等等

### 2.2 持久层

> 持久层（Persistence Layer），即专注于实现数据持久化应用领域的某个特定系统的一个逻辑层面，将数据使用者和数据实体相关联。之前使用 JDBC 访问数据库的 DAO 层，后面采用 MyBatis 访问数据库的 mapper 层，就是持久层

## 3. 认识 MyBatis

> MyBatis 是一个半自动 ORM 框架，其本质是对 JDBC 的封装。使用 MyBatis 重点需要程序员编写 SQL 命令，不需要写一行 JDBC 代码

## 4. 基本目录以及配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/be18c8c7601a4576a20ff404f3171b30.png)

- sqlMap 配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://127.0.0.1:3306/local?useSSL=false&amp;useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=Asia/Shanghai"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>
    <!--加载mapper映射文件-->
    <mappers>
        <mapper resource="com/lihh/mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

- XXXMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.lihh.mapper.UserMapper">
    <select id="queryAllUser" resultType="com.lihh.pojo.User">
        select id, name, age from user;
    </select>
</mapper>
```

## 5. log 配置

> 配置 log4j2

```xml
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.19.0</version>
        </dependency>
```

- 配置文件
  > 在文件夹《resources》 下创建文件 log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="DEBUG">
    <Appenders>
        <Console name="Console" target="SYSTEM_ERR">
            <PatternLayout pattern="%d{YYYY-MM-dd HH:mm:ss} [%t] %-5p %c{1}:%L - %msg%n" />
        </Console>

<!--        <RollingFile name="RollingFile" filename="log/test.log"-->
<!--                     filepattern="${logPath}/%d{YYYYMMddHHmmss}-fargo.log">-->
<!--            <PatternLayout pattern="%d{YYYY-MM-dd HH:mm:ss} [%t] %-5p %c{1}:%L - %msg%n" />-->
<!--            <Policies>-->
<!--                <SizeBasedTriggeringPolicy size="10 MB" />-->
<!--            </Policies>-->
<!--            <DefaultRolloverStrategy max="20" />-->
<!--        </RollingFile>-->

    </Appenders>
    <Loggers>
        <Root level="DEBUG">
            <AppenderRef ref="Console" />
        </Root>
    </Loggers>
</Configuration>
```
