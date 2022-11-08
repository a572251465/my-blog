<h1 align = "center">数据卷容器</h1>

> 命名的容器挂载数据卷，其他容器通过挂载这个容器实现数据共享，挂载数据的容器，称之为数据卷容器。

## 1. 配置过程

- 启动一个父类容器

```shell
docker run -it --name dc01 bobo/centos
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e82c8669ef0f491794d0ce33d7ec8d91.png)

- 依据父类容器，配置两个子容器

```shell
docker run -it --name child01 --volumes-from parent01 lihh/centos
docker run -it --name child02 --volumes-from parent01 lihh/centos
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/746b78fafe8646c694fda4abe6c1f85b.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/52c59cb935e34ad596ad00b6dc930821.png)

- 父类容器中修改数据

![在这里插入图片描述](https://img-blog.csdnimg.cn/d5b07165f15549adb700d404381fa6da.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/6b73f846c92d4406a2bcca05741695a9.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/3e357514106d4138b5b1556ac8801596.png)

注意：容器之间配置信息的传递，数据卷的生命周期一直持续到没有容器使用它为止。

## 2. 总结

> 依据父类创建的子类容器，其实就是实现了路径以及其内资源共享。
