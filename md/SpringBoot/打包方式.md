<h1 align = "center">打包方式</h1>

## 1. 前言

> - SpringBoot 项目可以是 jar 类型的 maven 项目，也可以是一个 war 类型的 maven 项目，取决于我们要不要整合 jsp 使用。但是不管是哪种项目类型，已经不是我们传统意义上的项目结构了
> - 在本地使用 SpringBoot 的启动器即可访问我们开发的项目。如果我们将项目功能开发完成后，需要使用 SpringBoot 的打包功能来将项目进行打包。

> - jar 类型项目会打成 jar 包:
> - jar 类型项目使用 SpringBoot 打包插件打包时，会在打成的 jar 中内置一个 tomcat 的 jar。所以我们可以使用 jdk 直接运行该 jar 项目可，jar 项目中有一个功能，将功能代码放到其内置的 tomcat 中运行。我们直接使用浏览器访问即可。

> - war 类型项目会打成 war 包:
> - 在打包时需要将内置的 tomcat 插件排除，配置 servlet 的依赖。将 war 正常的放到 tomcat 服务器中运行即可。

## 2. `jar`打包方式

- 额外配置打包插件

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.4.5</version>
                <configuration>
                    <fork>true</fork>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

- 项目类型修改为`jar`

```xml
    <groupId>org.example</groupId>
    <artifactId>springboot04</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
```

- 执行打包脚本

![在这里插入图片描述](https://img-blog.csdnimg.cn/3c13f0f06c104614b7fac6726dce3425.png)

- 运行结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/02eb8c8132bb4eb4b5595b03c608300d.png)

## 3. `war`打包方式

> 项目打包成 war 之后,要放在一个 Tomcat 上运行

- 排除项目中自带的所有的 Tomcat 插件和 jsp servlet 依赖,因为这里要将项目放到一个 Tomcat 上运行

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.7.4</version>
            <!--排除web启动中自动依赖的tomcat插件-->
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <!--打包的时候可以不用包进去，别的设施会提供。事实上该依赖理论上可以参与编译，测试，运行等周期。
                相当于compile，但是打包阶段做了exclude操作-->
            <scope>provided</scope>
        </dependency>
    </dependencies>
```

- SpringBoot 的启动类继承 SpringBootServletInitializer，并重写 configure

```shell
@SpringBootApplication
public class Springboot05Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Springboot05Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Springboot05Application.class, args);
    }
}
```

- 使用 install 命令打包项目，并将 war 包放到 tomcat 下的 webapps 下，启动 tomcat 即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c22177a69246464da9e6f3b7a62cf2d7.png)

- 运行结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/9ec9301b496d46f08376c15fcd2ea1f7.png)

> 启动地址上下文中前缀其实就是 war 包的名称。如果 war 包名称是`springboot03`的话，那运行的地址就是`http://localhost:8080/springboot03/xxx`
