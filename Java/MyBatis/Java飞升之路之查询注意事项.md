<h1 align = "center">查询注意事项</h1>

## 1. 模糊查询

> 在进行模糊查询时，在映射文件中可以使用 concat()函数来连接参数和通配符。另外注意对于特殊字符，比如<，不能直接书写，应该使用字符实体替换。

```xml
<select id="aa" resultType="user">
        select * from user where name like concat('%', #{name},'%')
</select>
```

## 2. 主键回填

> MySQL 支持主键自增。有时候完成添加后需要立刻获取刚刚自增的主键，由下一个操作来使用。比如结算构造车后，主订单的主键确定后，需要作为后续订单明细项的外键存在。如何拿到主键呢，MyBatis 提供了支持，可以非常简单的获取

```xml
<insert id="addDept" parameterType="dept" useGeneratedKeys="true" keyProperty="deptno">
        insert into dept values(null,#{dname},#{loc})
</insert>
```

- `useGeneratedKeys` 该属性表示是否启用主键回填的功能
- `keyProperty` 表示会回填到哪个对象属性中

## 3. if 标签

> if 标签属于动态 sql 部分。只有满足条件的时候才会拼接 sql。

```xml
    <select id="bb">
        select * from user
        <where>
            <if test="name != null and name != ''">
                and name = #{name}
            </if>
            <if test="age != null">
                and age = #{age}
            </if>
        </where>
    </select>
```

- 通过上述代码示例可以得到
  - 使用`if/ test` 来判断元素内容是否有值
  - 如果使用了`where` 可以不添加 where， mybatis 会给 sql 中添加
  - 同时会剔除第一个语句中的`and`关键字
  - 上述代码`<if test="age != null">`中，可以看到其实在定义变量的时候，最好不要用原始数据类型

## 4. choose 标签

> `choose`标签的用法跟`if`标签的用法优点类似，但是不尽相同

```xml
<select id="findEmpByCondition2" resultType="emp">
    select * from emp
    <where>
        <choose>
            <when test="empno != null">
                and empno= #{empno}
            </when>
            <when test="ename != null and ename != ''">
                and ename= #{ename}
            </when>
            <when test="job != null and job != ''">
                and job= #{job}
            </when>
            <when test="mgr != null ">
                and mgr= #{mgr}
            </when>
            <when test="hiredate != null ">
                and hiredate= #{hiredate}
            </when>
            <when test="sal != null">
                and sal= #{sal}
            </when>
            <when test="comm != null ">
                and comm =#{comm}
            </when>
            <when test="deptno != null ">
                and deptno= #{deptno}
            </when>
        </choose>
    </where>
</select>
```

- 在使用`if` 标签的时候，如果多个条件满足会拼接多个条件的 sql
- 但是如果是`choose`的话，第一个条件满足后，后面的判断不会再次执行了

## 5. set

```xml
<update id="updateEmpByCondtion" >
    update emp
    <set>
        <if test="ename != null and ename != '' ">
            , ename =#{ename}
        </if>
        <if test="job != null and ename != '' ">
            , job =#{job}
        </if>
        <if test="mgr != null ">
            , mgr =#{mgr}
        </if>
        <if test="hiredate != null ">
            , hiredate =#{hiredate}
        </if>
        <if test="sal != null ">
            , sal =#{sal}
        </if>
        <if test="comm != null ">
            , comm =#{comm}
        </if>
        <if test="deptno != null ">
            , deptno =#{deptno}
        </if>
    </set>
    where empno =#{empno}
</update>
```

- `Set`标签的作用跟`where`优点类似。
- 避免了写 Set 关键字
- 删除第一个条件前面的逗号

## 6. Trim 标签

```xml
<update id="updateEmpByCondition2" >
    update emp
    <!--prefix 要增加什么前缀
    prefixOverrides 要去除什么前缀
    suffix 要增加什么后缀
    suffixOverrides 要去除什么后缀
    set 是trim的一种特殊情况
    -->
    <trim prefix="set"  suffixOverrides="," >
        <if test="ename != null and ename != ''">
            ename= #{ename},
        </if>
        <if test="job != null and job != ''">
            job= #{job},
        </if>
        <if test="mgr != null ">
            mgr= #{mgr},
        </if>
        <if test="hiredate != null ">
            hiredate= #{hiredate},
        </if>
        <if test="sal != null">
            sal= #{sal},
        </if>
        <if test="comm != null ">
            comm =#{comm},
        </if>
        <if test="deptno != null ">
            deptno= #{deptno},
        </if>
    </trim>
    where  empno = #{empno}
</update>
```

- 可以将`where` 以及`Set`理解为`Trim` 具体实现。标签`Trim`有以下属性`prefixOverrides`, `prefix `, `suffix `, `suffixOverrides`
- `prefix` 表示要添加的前缀
- `prefixOverrides ` 表示要去除的前缀
- `suffix` 表示要添加的后缀
- `suffixOverrides` 表示要去除的后缀

## 7. sql 片段

> 如果在 mybatis 中出现了大量的相同的 sql。我们可以定义共同的 sql 片段。

```xml
<sql id="empColumn">empno,ename,job,mgr,hiredate,sal,comm,deptno</sql>
<sql id="baseSelect">select <include refid="empColumn"></include> from emp</sql>

<!--List<Emp> findByCondition(Emp emp);-->
<select id="findByCondition" resultType="emp">
    <include refid="baseSelect"></include>
    <trim prefix="where" prefixOverrides="and">
        <if test="empno != null">
            and empno =#{empno}
        </if>
        <if test="ename != null and ename != ''">
            <bind name="likePattern" value="'%'+ename+'%'"/>
            and ename like #{likePattern}
        </if>
        <if test="job != null and job != ''">
            and job =#{job}
        </if>
        <if test="mgr != null">
            and mgr =#{mgr}
        </if>
        <if test="hiredate != null">
            and hiredate =#{hiredate}
        </if>
        <if test="sal != null">
            and sal =#{sal}
        </if>
        <if test="comm != null">
            and comm =#{comm}
        </if>
        <if test="deptno != null">
            and deptno =#{deptno}
        </if>
    </trim>

</select>
```

## 8. Foreach 标签

```xml
<!--List<Emp> findByEmpnos1(int[] empnos);
 collection=""  遍历的集合或者是数组
                 参数是数组,collection中名字指定为array
                 参数是List集合,collection中名字指定为list
 separator=""   多个元素取出的时候 用什么文字分隔
 open=""        以什么开头
 close=""       以什么结尾
 item=""        中间变量名
 for(Person per:PersonList)

 -->
 <select id="findByEmpnos1" resultType="emp">
     select * from emp  where empno in
     <foreach collection="array" separator="," open="(" close=")" item="deptno">
         #{deptno}
     </foreach>
 </select>


<!-- List<Emp> findByEmpnos2(List<Integer> empnos);-->
 <select id="findByEmpnos2" resultType="emp">
     select * from emp  where empno in
     <foreach collection="list" separator="," open="(" close=")" item="deptno">
         #{deptno}
     </foreach>
 </select>
```

- 使用关键字`foreach` 来表示循环的过程，分别有以下属性
  - `collection` 遍历的集合或者是数组
  - `separator` 多个元素取出的时候 用什么文字分隔
  - `open` 以什么开头
  - `close` 以什么结尾
  - `item` 中间变量名
