<h1 align = "center">Yum</h1>

## 修改 yum 源

```text
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum makecache
yum -y update //升级所有包同时也升级软件和系统内核
```

## 手动安装 nginx

- [步骤一](https://blog.csdn.net/zawxse_/article/details/125925765)
- [步骤二](https://blog.csdn.net/yukuleshui/article/details/113772488)

`ps -ef | grep nginx`

## 安装 mysql

```shell
// 下载mysql 源文件
wget https://repo.mysql.com//mysql80-community-release-el8-1.noarch.rpm

// 使用rpm 安装mysql
rpm -ivh mysql80-community-release-el8-1.noarch.rpm

// 使用yum 安装mysql服务
yum install mysql-server

// 检查是否设置开机启动mysql
systemctl list-unit-files | grep mysqld

// 设置开机启动
systemctl enable mysqld.service

// 启动mysql服务
systemctl start mysqld.service

// 测试
mysql
```
