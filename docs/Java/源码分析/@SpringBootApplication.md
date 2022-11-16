<h1 align = "center">@SpringBootApplication</h1>

## 1. 使用方法

```shell
@SpringBootApplication
public class PlanManageApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlanManageApplication.class, args);
    }
}
```

## 2. 注解分析

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/07f08eaab5094002be4410801460c8cb.png)

- 其实注解`@SpringBootApplication`中 最主要的直接就是以上裱框的内容
- 该注解其实也是修改为一下内容

  ```shell
  @SpringBootConfiguration
  @EnableAutoConfiguration
  @ComponentScan(value = "com.lihh")
  public class Springboot01Application {
      public static void main(String[] args) {
          SpringApplication.run(Springboot01Application.class, args);
      }
  }
  ```

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/b533b7940cbb49e0893aeb50f40b87a1.png)

  - 注解`@AutoConfigurationPackage` 是为了设置自动配置包的

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/48b862cffc3f420c9e43a88c506bf791.png)

  - 此注解就是为了实例化 register 类

- ![在这里插入图片描述](https://img-blog.csdnimg.cn/af80b8d5010a402685653f1de6a28bfa.png)
  - 通过获取字节码 来获取类的所在包路径

## 3. 注意点

- 标注注解`@SpringBootApplication`所在的类很重要。
- Spring 容器会根据所在类的包 以及子包进行扫描
