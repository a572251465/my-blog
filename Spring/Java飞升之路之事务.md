<h1 align = "center">事务</h1>

## 1. 概念

- 事务（Transaction）指的是一个操作序列，该操作序列中的多个操作要么都做，要么都不做，是一个不可分割的工作单位，是数据库环境中的逻辑工作单位，由 DBMS 中的事务管理子系统负责事务的处理
- 目前常用的存储引擎有 InnoDB（MySQL5.5 以后默认的存储引擎）和 MyISAM（MySQL5.5 之前默认的存储引擎），其中 InnoDB 支持事务处理机制，而 MyISAM 不支持。

## 2. 特性

- 原子性
  > - 原子是自然界最小的颗粒，具有不可再分的特性。事务中的所有操作可以看做一个原子，事务是应用中不可再分的最小的逻辑执行体
  > - 使用事务对数据进行修改的操作序列，要么全部执行，要么全不执行。通常，某个事务中的操作都具有共同的目标，并且是相互依赖的。如果数据库系统只执行这些操作中的一部分，则可能会破坏事务的总体目标，而原子性消除了系统只处理部分操作的可能性
- 一致性
  > 一致性是指事务执行的结果必须使数据库从一个一致性状态，变到另一个一致性状态。当数据库中只包含事务成功提交的结果时，数据库处于一致性状态。一致性是通过原子性来保证的
- 隔离线
  > 隔离性是指各个事务的执行互不干扰，任意一个事务的内部操作对其他并发的事务，都是隔离的。也就是说：并发执行的事务之间既不能看到对方的中间状态，也不能相互影响
- 持久性
  > 持久性指事务一旦提交，对数据所做的任何改变，都要记录到永久存储器中，通常是保存进物理数据库，即使数据库出现故障，提交的数据也应该能够恢复。但如果是由于外部原因导致的数据库故障，如硬盘被损坏，那么之前提交的数据则有可能会丢失

## 3. 事务的并发问题

- 脏读

  > 当一个事务正在访问数据并且对数据进行了修改，而这种修改还没有提交到数据库中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据是还没有提交的数据，那么另外一个事务读到的这个数据是“脏数据”，依据“脏数据”所做的操作可能是不正确的。

- 不可重复读

  > 指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读

- 幻读

  > 幻读与不可重复读类似。它发生在一个事务（T1）读取了几行数据，接着另一个并发事务（T2）插入了一些数据时。在随后的查询中，第一个事务（T1）就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读

- 不可重复度和幻读区别

  > 不可重复读的重点是修改，幻读的重点在于新增或者删除

## 4. 事务

> - 事务的管理应该放在我们的 service 层进行处理
> - Spring 声明式事务的实现方式,底层就是 AOP,AOP 的底层就是动态代理

### 4.1 本质

- 事务管理器接口: PlatformTransactionManager 针对不同的框架,提供了不同的实现类

![在这里插入图片描述](https://img-blog.csdnimg.cn/046b7cc7493243dfab40cf3454da7cfb.png)

### 4.2 基本项目搭建

> 列举重要的文件配置

- `applicationContext.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd
">
    <!--  扫描spring 包  -->
    <context:component-scan base-package="com.lihh"/>
    <!-- 读取jdbc驱动   -->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!--  配置德鲁依连接池  -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="username" value="${jdbc_username}"/>
        <property name="password" value="${jdbc_password}"/>
        <property name="url" value="${jdbc_url}"/>
        <property name="driverClassName" value="${jdbc_driver}"/>
    </bean>

    <!--配置JDBCTemplate对象,并向里面注入DataSource-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <!--通过set方法注入连接池-->
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 配置一个事务管理器  -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource"  ref="dataSource"></property>
    </bean>
    <!--  开启事务注解  -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```

- `配置注解位置`

```shell
@Service
public class MoneyServiceImpl implements MoneyService {

    @Autowired
    private MoneyDao moneyDao;

    @Override
    @Transactional
    public int updateMoney() {
        int rows = 0;

        rows += moneyDao.updateMoney("lxx", 100);
        rows += moneyDao.updateMoney("lll", -100);
        return rows;
    }
}
```

### 4.3 注解的含义

> - @Transactional 注解的一些参数和参数的含义
> - @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.READ_UNCOMMITTED,readOnly = true,rollbackFor = ClassCastException.class,noRollbackFor = NullPointerException.class,timeout = 10)

#### 4.3.1 事务的传播行为

- PROPAGATION_REQUIRED

> 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是最常见的选择(默认)。

- PROPAGATION_SUPPORTS

> 支持当前事务，如果当前没有事务，就以非事务方式执行。

- PROPAGATION_MANDATORY

> 使用当前的事务，如果当前没有事务，就抛出异常。

- PROPAGATION_REQUIRES_NEW

> 新建事务，如果当前存在事务，把当前事务挂起。

- PROPAGATION_NOT_SUPPORTED

> 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。

- PROPAGATION_NEVER

> 以非事务方式执行，如果当前存在事务，则抛出异常。

- PROPAGATION_NESTED

> 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与 PROPAGATION_REQUIRED 类似的操作。

#### 4.3.2 isolation 事务的隔离级别

- DEFAULT （默认）

  > 这是一个 PlatfromTransactionManager 默认的隔离级别，使用数据库默认的事务隔离级别。另外四个与 JDBC 的隔离级别相对应。

- READ_UNCOMMITTED （读未提交）

  > 这是事务最低的隔离级别，它允许另外一个事务可以看到这个事务未提交的数据。这种隔离级别会产生脏读，不可重复读和幻像读。

- READ_COMMITTED （读已提交）

> 保证一个事务修改的数据提交后才能被另外一个事务读取，另外一个事务不能读取该事务未提交的数据。这种事务隔离级别可以避免脏读出现，但是可能会出现不可重复读和幻像读。

- REPEATABLE_READ （可重复读）

  > 这种事务隔离级别可以防止脏读、不可重复读，但是可能出现幻像读。它除了保证一个事务不能读取另一个事务未提交的数据外，还保证了不可重复读。

- SERIALIZABLE（串行化）

  > 这是花费最高代价但是最可靠的事务隔离级别，事务被处理为顺序执行。除了防止脏读、不可重复读外，还避免了幻像读。

#### 4.3.3 timeout 超时时间

> 事务一定要在多长时间之内提交,如果不提交就会回滚

#### 4.3.4 readOnly 只读事务

> 事务是否只能读取数据库的数据,如果为 true,则不允许进行增删改

#### 4.3.5 rollbackFor 指定发生回滚的异常

> 当方法发生哪些异常时才会回滚

#### 4.3.6 noRollbackFor 指定不发生回滚的异常

> 当方法发生哪些异常时,不会回滚
