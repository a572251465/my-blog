<h1 align = "center">Realm实例</h1>

认证流程：

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/2746/1648209494089/6ad6905521b24fe282aaec2ba443f335.png)

授权流程：

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/2746/1648209494089/b1684ded9803482f9e42254eb4ae4a0b.png)

## 1. SimpleAccountRealm

```shell
public class SimpleAccountRealmDemo1 {

    @Test
    public void accountRealm() {

        // 1. 准备AccountRealm 用来内存存储信息
        SimpleAccountRealm simpleAccountRealm = new SimpleAccountRealm();
        simpleAccountRealm.addAccount("admin", "admin", "超级管理员", "商家");

        // 2. 准备SecurityManager
        DefaultSecurityManager securityManager = new DefaultSecurityManager();


        // 3. SecurityManager和Realm建立连接
        securityManager.setRealm(simpleAccountRealm);

        // 4. subject和SecurityManager建立联系
        SecurityUtils.setSecurityManager(securityManager);

        // 5. 声明subject
        Subject subject = SecurityUtils.getSubject();

        // 6. 发起认证
        // 如果是随意输入账号 以及密码都是会报错的
        subject.login(new UsernamePasswordToken("admin", "admin"));

        // ??? 判断是否认证通过
        System.out.println(subject.isAuthenticated());

        // 退出登录
//        subject.logout();
//        System.out.println(subject.isAuthenticated());

        // 通过API【hasRole】 可以判断是否存在某种角色  不会报错
        System.out.println("是否存在超级管理员角色：" + subject.hasRole("超级管理员"));

        // check role  无返回值 如果没有角色 直接报错
        subject.checkRole("商家");
    }
}
```

- 通过上述的截图以及代码可以看到，其实我们是维护`subject`, `SecurityManager`, `Realm` 之间的关系
- 有多种方式可以判断是否认证 或是 是否有角色的
- 不过`SimpleAccountRealm` 只是限于认证 以及角色。无法对权限进行把握

## 2. IniRealm

- Java 代码

```shell
public class IniRealmDemo {

    @Test
    public void iniRealmDemo() {

        // 1. 构建IniRealm 基于文件来构建数据
        IniRealm iniRealm = new IniRealm("classpath:users.ini");

        // 2. 构建manager 管理realm
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        securityManager.setRealm(iniRealm);


        // 3. 基于SecurityUtils绑定SecurityManager并声明subject
        SecurityUtils.setSecurityManager(securityManager);
        Subject subject = SecurityUtils.getSubject();

        // 4. 认证操作
        subject.login(new UsernamePasswordToken("admin", "admin"));

        // 进行权限校验
        System.out.println(subject.isPermitted("user:delete"));
        System.out.println(subject.isPermitted("user:select"));

        // 使用check API 如果权限不存在 会直接报错
//        subject.checkPermission("user:select");
    }
}
```

- 文件

```text
[users]
username=password,role1,role2
admin=admin,超级管理员,商家
[roles]
role1=perm1,perm2
超级管理员=user:add,user:update,us
```

- realm 的话 是基于文件进行存储的。是可以控制权限的

## 3. JdbcRealm

> - 实现权限校验时，库表设计方案
> - 用户认证、授权时推荐的表结构设计，经典五张表！

![image.png](https://fynotefile.oss-cn-zhangjiakou.aliyuncs.com/fynote/fyfile/2746/1648209494089/ecbee684162f47439b6b29b117f237e2.png)

- 业务实现代码

```shell
public class JdbcRealmDemo {

    @Test
    public void jdbcRealmDemo() {
        // 1. 准备jdbcRealm
        JdbcRealm jdbcRealm = new JdbcRealm();

        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        druidDataSource.setUrl("jdbc:mysql://localhost:3306/shiro?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC");
        druidDataSource.setUsername("root");
        druidDataSource.setPassword("root");
        jdbcRealm.setDataSource(druidDataSource);

        jdbcRealm.setPermissionsLookupEnabled(true);


        // 2. 构建SecurityManager绑定Realm
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        securityManager.setRealm(jdbcRealm);

        // 3. 基于SecurityUtils绑定SecurityManager并声明subject
        SecurityUtils.setSecurityManager(securityManager);
        Subject subject = SecurityUtils.getSubject();

        // 4. 认证操作
        subject.login(new UsernamePasswordToken("admin", "admin"));

        // 角色操作
        System.out.println(subject.hasRole("超级管理员"));

        // 权限操作
        System.out.println(subject.isPermitted("user:add"));
    }
}
```

- 其实`jdbc`版的实现跟 Ini 没啥太大区别。无非是用数据库进行存储

## 4. CustomRealm + 加密

> 如果想要实现`CustomRealm`， 需要重写两个方法 doGetAuthenticationInfo 认证方法 doGetAuthorizationInfo 授权方法

- 自定义代码

```shell
public class CustomRealm  extends AuthorizingRealm {

    {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashAlgorithmName("MD5");
        hashedCredentialsMatcher.setHashIterations(1024);
        this.setCredentialsMatcher(hashedCredentialsMatcher);
    }

    /**
     * 授权方法 对用户进行授权
     * @param principalCollection 授权用户收到信息
     * @return null
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 获取已经认证用户信息
        User user = (User) principalCollection.getPrimaryPrincipal();

        // 获取角色
        Set<String> roleSet = this.findRolesByUser();
        // 获取权限
        Set<String> permSet = this.findPermsByRoleSet();

        //声明AuthorizationInfo对象作为返回值，传入角色信息和权限信息
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.setRoles(roleSet);
        info.setStringPermissions(permSet);
        return info;
    }

    private Set<String> findPermsByRoleSet() {
        Set<String> set = new HashSet<>();
        set.add("user:add");
        set.add("user:update");
        return set;
    }

    private Set<String> findRolesByUser() {
        Set<String> set = new HashSet<>();
        set.add("超级管理员");
        set.add("运营");
        return set;
    }

    /**
     * 认证方法，只需要完成用户名校验即可，密码校验由Shiro内部完成
     * @param authenticationToken 传递的token
     * @return null
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 获取传递username
        String username = (String) authenticationToken.getPrincipal();

        // 判断username是否为空
        if (StringUtils.isEmpty(username)) return null;


        // 查询用户信息
        User user = this.findUserByUsername(username);
        if (user == null) return null;

        // 声明AuthenticationInfo对象，并填充用户信息
        SimpleAuthenticationInfo customRealm = new SimpleAuthenticationInfo(user, user.getPassword(), "CustomRealm!!");
        // 设置用户的信息的时候 添加盐值
        customRealm.setCredentialsSalt(ByteSource.Util.bytes(user.getSalt()));
        return customRealm;
    }

    private User findUserByUsername(String username) {
        if ("admin".equals(username)) {
            return new User(1, "admin", "1ebc4dcaf1e21b814ece65f27531f1a9", "weruiothergjkdfnbgjkdfngjkdf");
        }
        return null;
    }
}
```

- 使用 CustomRealm 方法

```shell
public class CustomRealmDemo {

    @Test
    public void customRealmDemo() {
        // 设置自定义的Realm
        CustomRealm customRealm = new CustomRealm();

        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        securityManager.setRealm(customRealm);


        SecurityUtils.setSecurityManager(securityManager);
        Subject subject = SecurityUtils.getSubject();

        subject.login(new UsernamePasswordToken("admin", "admin"));

        System.out.println("是否认证:" + subject.isAuthenticated());

        System.out.println("是否包含指定角色(超级管理员)：" + subject.hasRole("超级管理员"));

        System.out.println("是否包含指定权限(user:add):" + subject.isPermitted("user:add"));
    }
}
```
