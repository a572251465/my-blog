<h1 align = "center">查询参数设定</h1>

## 1. 表现形式

- 在 MyBatis 中可以使用`${}` 形式来表示传递变量
- 在 MyBatis 中可以使用`#{}` 形式来表示传递变量(使用最多)
- 两种形式在于前者在底层是通过拼接字符串来进行 sql 查询。但是后者是将`#{}`变换为`?`. 然后通过符号替换来实现

## 2. 传参方式

- 通过简单数据类型（传递的就是一个简单数据类型的值）
- 通过 Map 的形式 表示传递的多个值
- 通过自定义对象来表示传递的多个值（例如：传递一个 User 对象等）

## 3. 代码形式

- 接口定义

```shell
public interface UserMapper {
    List<User> queryAllUser();

    User queryUserById(String id);

    List<User> queryAssignUser(Map<String, String> map);

    List<User> queryAssignUser1(User user);
}
```

- xml 表示形式

```xml
<mapper namespace="com.lihh.mapper.UserMapper">
    <select id="queryAllUser" resultType="user">
        select id, name, age from user;
    </select>

    <select id="queryUserById" resultType="user" parameterType="string">
        select id, name, age from user where id = #{id};
    </select>

    <select id="queryAssignUser" resultType="user" parameterType="map">
        select id, name, age from user where name = #{name} and age = #{age};
    </select>

    <select id="queryAssignUser1" resultType="user" parameterType="user">
        select id, name, age from user where name = #{name} and age = #{age};
    </select>
</mapper>
```
