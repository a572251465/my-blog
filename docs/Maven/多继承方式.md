<h1 align = "center">多继承方式</h1>

## 1. 实际的业务出发

![在这里插入图片描述](https://img-blog.csdnimg.cn/b6f1900bbe7c4b9cb30cb2f28bce1c07.png)

1. 上述截图中是一个真实的微服务项目，采用了 spring cloud + nacos 等相关技术
2. 现在需要对依赖进行统一管理，因为牵扯到都需要`spring-cloud` 以及`spring-cloud-alibaba`。所以采用了聚合父类工程管理依赖
3. 通过继承关系 来让子项目的版本得到控制

> 但是此时引出了一个问题：一般的 springboot 单体项目都是引用了父工程`spring-boot-starter-parent`. 此时我们想让子工程引用聚合父工程，又想引用 springboot 工程，那我们应该怎么办呢？？？ 这个时候就出现了工程的多继承方式

## 2. 上代码

### 2.1 之前的代码

```xml
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.4.12</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
```

- 以及无论是`parent` 还是 `dependencyManagement` 都是一种工程的继承。目的就是为了进行版本管理，由父工程统一提供版本

### 2.2 之后的代码

```xml
	<parent>
		<artifactId>shopping-mall</artifactId>
		<groupId>com.lihh.shopping</groupId>
		<version>0.0.1-SNAPSHOT</version>
	</parent>

  <!-- 其实这个内容可以放到父工程中的 -->
  <dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-dependencies</artifactId>
				<version>${spring-boot-dependencies.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
```

## 3. 结论

> 所以在聚合项目中 为了更好的控制版本，所以需要对依赖继承进行划分。这样有利于更好的控制版本
