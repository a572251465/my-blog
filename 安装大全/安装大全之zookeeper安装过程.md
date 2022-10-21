<h1 align = "center">zookeeper 安装过程</h1>

## step1 上传解压

- 将压缩包上传到服务器指定文件夹，然后解压，效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d58a98e4e6084ee3b434f728944ddff0.png)

## step2 创建文件夹

- 在解压后的文件夹中添加`data`文件夹

![在这里插入图片描述](https://img-blog.csdnimg.cn/ceceb760d0494d7d9fb627cebb293ab5.png)

## step3 修改配置文件

- 修改配置文件，将目录修改新建`data`所在的目录

![在这里插入图片描述](https://img-blog.csdnimg.cn/4fc2ab0c932a4c97996d9a301c4ec082.png)

## step4 启动服务

- 启动`zookeeper` 服务
- `zkServer.sh start`

![在这里插入图片描述](https://img-blog.csdnimg.cn/26106ceaece44897b561730b89ff45bc.png)

## step5 查看服务状态

- 查看`zookeeper`启动状态
- `zkServer.sh status`

![在这里插入图片描述](https://img-blog.csdnimg.cn/dca03cec603e4489904c7a0dec50cecd.png)

## step6 常用命令

- `ls`

  ​ ls [-s][-r] /path

  ​ -s 详细信息，替代老版的 ls2

  ​ -R 当前目录和子目录中内容都罗列出来

  ​ 例如：ls -R / 显示根目录下所有内容

- `create`

  ​ create /path [data]

  ​ [data] 包含内容

  ​ 创建指定路径信息

  ​ 例如：create /demo 创建/demo

- `get`

  ​ get [-s] /path

  ​ [-s] 详细信息

  ​ 查看指定路径下内容。

  ​ 例如： get -s /demo

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/895f87326913459ead76d8a4d32a9680.png)

- `set`

  ​ set /path data

  ​ 设置节点内容

- `delete`

  ​ delete /path

  ​ 删除节点
