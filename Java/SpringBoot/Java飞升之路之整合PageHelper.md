<h1 align = "center">整合PageHelper</h1>

> 我们在正常的查询业务之中,只需要加上一行代码就可以实现分页的数据的封装处理

## 1. 实现原理

> PageHelper 方法使用了静态的 ThreadLocal 参数，分页参数和线程是绑定的。内部流程是 ThreadLocal 中设置了分页参数（pageIndex，pageSize），之后在查询执行的时候，获取当线程中的分页参数，执行查询的时候通过拦截器在 sql 语句中添加分页参数，之后实现分页查询，查询结束后在 finally 语句中清除 ThreadLocal 中的查询参数

## 2. 使用方法

- 调用 PageHelper 方法：PageHelper.startPage(pageNum, pageSize)
- MyBatis 查询方法

> 注意：只要你可以保证在 PageHelper 方法调用后紧跟 MyBatis 查询方法，这就是安全的。因为 PageHelper 在 finally 代码段中自动清除了 ThreadLocal 存储的对象。

## 3. 使用方法

- 添加 PageHelper 启动器依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.12</version>
</dependency>
```

- 实际代码

```shell
@Service
public class EmpServiceImpl implements EmpService {
    @Autowired
    private EmpMapper empMapper;
    @Override
    public PageInfo<Emp> findByPage(Integer pageNum, Integer pageSize) {
        Page<Emp> page = PageHelper.startPage(pageNum, pageSize);
        List<Emp> list =empMapper.findAll();
        // 方式1
        System.out.println("当前页:"+page.getPageNum());
        System.out.println("总页数"+page.getPages());
        System.out.println("页大小:"+page.getPageSize());
        System.out.println("总记录数:"+page.getTotal());
        System.out.println("当前页数据"+page.getResult());
        // 方式2
        PageInfo<Emp> pi =new PageInfo<>(list);
        System.out.println("当前页"+pi.getPageNum());
        System.out.println("总页数"+pi.getPages());
        System.out.println("页大小"+pi.getSize());
        System.out.println("总记录数"+pi.getTotal());
        System.out.println("当前页数据"+pi.getList());
        return pi;
    }
}
```

- PageInfo 对象和 Page 对象的区别

[参考地址](https://blog.csdn.net/weixin_43760541/article/details/107155386)
