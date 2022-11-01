<h1 align = "center">ES安装过程</h1>

## Elasticsearch 环境

- [下载地址](https://www.elastic.co/cn/downloads/elasticsearch)
- 解压后目录结构：
  - Elasticsearch 目录结构
    | 名称 | 含义 |
    | ---- | ---- |
    | bin | 可执行脚本文件，包括启动 elasticsearch 服务、插件管理、函数命令等 |
    | config | 配置文件目录，如 elasticsearch 配置、角色配置、jvm 配置等 |
    | lib | elasticsearch 所依赖的 java 库 |
    | data | 默认的数据存放目录，包含节点、分片、索引、文档的所有数据，**生产环境要求必须修改** |
    | logs | 默认的日志文件存储路径，**生产环境务必修改** |
    | modules | 包含所有的 Elasticsearch 模块，如 Cluster、Discovery、Indices 等 |
    | plugins | 已经安装的插件的目录 |
    | jdk/jdk.app | 7.0 以后才有，自带的 java 环境 |

## Elasticsearch 环境配置（linux 版）

- 根据上述下载地址 下载 ES 安装包
- 将其放到服务器上任意一个目录下（下列截图中是上传一份后，同时又复制了 2 份）
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/3b39792a733a4057ad5d47403d7a2914.png)

- 配置`data` 以及`logs`地址

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/c74d70cea74748b69b0f904865620ccd.png)

- 修改配置文件中地址

  - 修改地址为`/opt/es/es-inner-1/config/elasticsearch.yml`
  - 修改内容为`log`, `data`,`端口`

- 开始启动 es
  `./bin/elasticsearch -d `

## 问题发生情况

- [参考 1](https://blog.csdn.net/tao441033618/article/details/120131890)
- es 是不能用 root 用户进行启动的。 必须新建一个用户，用新建的用户启动（但是一定要赋予文件夹权限`chown -R [user]:[group] 文件夹地址`）
