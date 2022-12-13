<h1 align = "center">Basic 命令</h1>

# 1. 目录结构

- 执行命令

![在这里插入图片描述](https://img-blog.csdnimg.cn/1943153a1f7545d191c5f5c09097efaa.png)

- 目录结构

![linux 目录结构](https://www.runoob.com/wp-content/uploads/2014/06/d0c50-linux2bfile2bsystem2bhierarchy.jpg)

- 文件夹含义

  - bin
    > bin 是 Binaries (二进制文件) 的缩写, 这个目录存放着最经常使用的命令。
  - boot
    > 这里存放的是启动 Linux 时使用的一些核心文件，包括一些连接文件以及镜像文件。
  - etc
    > etc 是 Etcetera(等等) 的缩写,这个目录用来存放所有的系统管理所需要的配置文件和子目录。
  - home
    > 用户的主目录，在 Linux 中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的，如上图中的 alice、bob 和 eve。
  - lib
    > lib 是 Library(库) 的缩写这个目录里存放着系统最基本的动态连接共享库，其作用类似于 Windows 里的 DLL 文件。几乎所有的应用程序都需要用到这些共享库。
  - mnt
    > 系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在 /mnt/ 上，然后进入该目录就可以查看光驱里的内容了
  - opt
    > opt 是 optional(可选) 的缩写，这是给主机额外安装软件所摆放的目录。比如你安装一个 ORACLE 数据库则就可以放到这个目录下。默认是空的
  - root
    > 该目录为系统管理员，也称作超级权限者的用户主目录。
  - sbin
    > s 就是 Super User 的意思，是 Superuser Binaries (超级用户的二进制文件) 的缩写，这里存放的是系统管理员使用的系统管理程序
  - tmp
    > tmp 是 temporary(临时) 的缩写这个目录是用来存放一些临时文件的。
  - usr
    > usr 是 unix shared resources(共享资源) 的缩写，这是一个非常重要的目录，用户的很多应用程序和文件都放在这个目录下，类似于 windows 下的 program files 目录。
  - usr/bin
    > 系统用户使用的应用程序
  - usr/sbin
    > 超级用户使用的比较高级的管理程序和系统守护程序
  - usr/src
    > 内核源代码默认的放置目录
  - var
    > var 是 variable(变量) 的缩写，这个目录中存放着在不断扩充着的东西，我们习惯将那些经常被修改的目录放在这个目录下。包括各种日志文件


# 2. 文件属性

> - chown (change owner) ： 修改所属用户与组。
> - chmod (change mode) ： 修改用户的权限。

![](https://www.runoob.com/wp-content/uploads/2014/06/1_151733904241.png)

## 2.1 权限属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/881259608d8f4e198d4f8bb4dd8a857b.png)

- 上述实例中第一个字符可以代表该文件是一个目录/ 文件/ 链接

  - `d` 表示一个目录
  - `-` 表示一个文件
  - `l` 表示一个链接

- 接下来的字符中，以三个为一组，且均为 `rwx` 的三个参数的组合。其中， r 代表可读(read)、 w 代表可写(write)、 x 代表可执行(execute)。 要注意的是，这三个权限的位置不会改变，如果没有权限，就会出现减号 - 而已

- ![](https://www.runoob.com/wp-content/uploads/2014/06/file-llls22.jpg)

## 2.2 文件属性

> 每个文件的属性由左边第一部分的 10 个字符来确定（如下图）。

![](https://www.runoob.com/wp-content/uploads/2014/06/363003_1227493859FdXT.png)

## 2.3 Linux 文件属主和属组

- 对于文件来说，它都有一个特定的所有者，也就是对该文件具有所有权的用户。

- 同时，在 Linux 系统中，用户是按组分类的，一个用户属于一个或多个组。

- 文件所有者以外的用户又可以分为文件所属组的同组用户和其他用户
- 对于 root 用户来说，一般情况下，文件的权限对其不起作用

## 2.4 更改文件属组

```bash
chgrp [-R] 属组名 文件名
```

- -R：递归更改文件属组，就是在更改某个目录文件的属组时，如果加上-R 的参数，那么该目录下的所有文件的属组都会更改。

## 2.5 更改文件属主

> 更改文件属主，也可以同时更改文件属组

```bash
chown [–R] 属主名 文件名
chown [-R] 属主名：属组名 文件名
```

- -R：递归更改文件属组，就是在更改某个目录文件的属组时，如果加上-R 的参数，那么该目录下的所有文件的属组都会更改。

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/2c5083d729f54ac38fad6f9239c6fab9.png)

## 2.6 修改权限

- Linux 文件属性有两种设置方法，一种是数字，一种是符号。
- Linux 文件的基本权限就有九个，分别是 owner/group/others(拥有者/组/其他) 三种身份各有自己的 read/write/execute 权限。
- 先复习一下刚刚上面提到的数据：文件的权限字符为： -rwxrwxrwx ， 这九个权限是三个三个一组的！其中，我们可以使用数字来代表各个权限，各权限的分数对照表如下：
  - r:4
  - w:2
  - x:1
- 每种身份(owner/group/others)各自的三个权限(r/w/x)分数是需要累加的，例如当权限为： -rwxrwx--- 分数则是：
  - owner = rwx = 4+2+1 = 7
  - group = rwx = 4+2+1 = 7
  - others= --- = 0+0+0 = 0

### 2.7 修改权限命令

```bash
chmod [-R] xyz 文件或目录
```

- 选项

  - xyz : 就是刚刚提到的数字类型的权限属性，为 rwx 属性数值的相加。
  - -R : 进行递归(recursive)的持续变更，以及连同次目录下的所有文件都会变更

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/727907a937934b208c81e49355502468.png)

### 2.8 使用符号修改权限

> 还有一个改变权限的方法，从之前的介绍中我们可以发现，基本上就九个权限分别是：

- user：用户
- group：组
- others：其他
- 那么我们就可以使用 u, g, o 来代表三种身份的权限。

此外， a 则代表 all，即全部的身份。读写的权限可以写成 r, w, x，也就是可以使用下表的方式来看：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d4baffe6a7a4448798621cd0f506e997.png)

如果我们需要将文件权限设置为 -rwxr-xr-- ，可以使用 chmod u=rwx,g=rx,o=r 文件名 来设定:

```bash
# 修改权限
chmod -R u=rw,g=r,o=r a

# 删除权限(所有权限中 删除可执行权限)
chmod -R a-x a

# 给用户/群组/其他 添加只读权限
chmod ugo+r file1.txt

# 给用户添加只执行的权限
chmod u+x ex1.py
```


# 3. vi基本命令

- `a` 追加的方式进行编辑模式
- `i` 插入的方式进行编辑模式
- `o` 在光标所在的位置之下，新增一行
- `O` 在光标所在位置之上，新增一行
- `dd` 默认删除一行
- `yy` 复制当前行
- `:w` 保存
- `:q` 退出
- `:wq` 保存并退出
- `:q!` 强制退出不保存
- `/keywords` 搜索
  - 向后继续查找使用 `
  - 向前继续查找使用 `N`
- `G` 光标跳转到文件尾部
- 修改错误
  - `:s/old/new` 把光标所在行的 old 替换成为 new
  - `:s/old/new/g` 把所有行的 old 替换为 new


# 4. 基本命令

## 4.1 查询linux版本

```bash
cat /etc/redhat-release
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/ac391a837e014d2aa70bc872db8787db.png)

## 4.2 查询内核

```bash
uname -r
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/3d90378bf2c44b8ea47ef25d292f709c.png)

## 4.3 设置镜像源(以阿里云镜像为例)

- 所有镜像源放置位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/7478661276e544e19e078b5349131edb.png)

```bash
ll /etc/yum.repos.d/
```

- 下载docker 镜像源

```bash
# wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

- 查询当前host上的源文件

```bash
yum repolist
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/9de6ede0dfa14818a693666e788aa454.png)

- 配置Docker Daemon启动文件

> 由于Docker使用过程中会对Centos操作系统中的Iptables防火墙中的FORWARD链默认规划产生影响及需要让Docker Daemon接受用户自定义的daemon.json文件，需要要按使用者要求的方式修改。

```bash
vim /usr/lib/systemd/system/docker.service
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/fcf8f698ec8449719b6ff407c8de8967.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/50edba5777704655b4165c63185a851e.png)

- 重启daemon 文件

```bash
systemctl daemon-reload
```

## 4.4 ls

- 查询目录中的内容 `ls [选项][文件或是目录]`
  - `-a` 显示所有的文件 包括隐藏文件
  - `-l` 表示详细信息
  - `-d` 显示目录本身的属性而非子文件
  - `-h` 人性化显示文件大小

## 4.5 mkdir

- 建立目录 mkdir
  - `-p` 是递归创建

## 4.6 cd

- 跳转到根目录 `cd /`
- root 文件夹根目录 `cd ~`
  - `cp 原路径 目录路径`

## 4.7 rm

- 删除文件或是目录
  - `-r` 删除目录
  - `-f` 强制删除
  - `-rf` 递归删除所有的目录

## 4.8 cp

- 复制命令 `cp [源文件或是目录] [目标文件]`
  - `-r` 复制目录，默认是复制文件
  - `-i` 会在复制文件的时候给提示，如果复制的目标文件存在的话，提示是否覆盖

## 4.9 mv

- 进行文件的移动或是重命名。`mv [源文件或是目录] [目标文件]`
- `mv aaa bbb`

## 4.10 ln

- 链接命令，用来生成软链
- `ln -s [源文件 [目标文件]`

## 4.11 环境变量

- 查询所有的环境变量 `echo $PATH`
- 修改环境变量的地址 `vi etc/profile`

## 4.12 find

- 文件搜索命令
- `find [搜索范围] [搜索条件]`
  - 按名称搜素 `find / -name 11.txt`
  - 通配符
    - `*` 匹配任意字符
    - ？匹配任意一个字符
    - [] 匹配任意一个括号中的字符
  - 不区分大小写 `-i`
  - 根据所有的用户 查找`-user`
  - 按时间进行搜索
    - `find . -mtime +5`
    - `atime` 访问时间
    - `ctime` 修改文件属性时间
    - `mtime` 修改文件内容时间
    - `-5` 5 天内修改
    - `5` 正好是 5 天前修改
    - `+5` 5 天前修改
  - `-size` 按规模大小来查找
- 综合应用：
- `find /xxx -size +10k -a -size -20k`
  - 按大小进行查找，大于 10k && 小于 20k 的
  - `-o` 表示或
  - `-a` 表示 and

## 4.13 grep

- 在文件中匹配内容 `grep bb aa.txt`
  - `-i` 忽略大小写
  - `-v` 排除指定字符串

## 4.14 tar 解压以及压缩

> tar 命令的的相关的参数

- `-c` 创建压缩文件
- `-C` 指定解压文件存放的位置
- `-x` 解压
- `-t` 查看内容
- `-z` 有 gzip 属性
- `-v` 显示所有过程
- `-f` 使用压缩或是解压缩文件的名字，这个参数是最后一个参数，后面只能接文件名

#### 示例

- 文件压缩
  > `tar -cf test.tar.gz test`
- 文件解压
  > `tar -xf test.tar.gz`
- 文件解压到指定目录
  > `tar -xvf test.tar.gz -C test1/`
- tar 以及 gzip 综合示例(先执行 tar，再执行 gzip)
  > `tar -zcvf hello.tar.gz hello`

# 5. 磁盘管理

> Linux 磁盘管理好坏直接关系到整个系统的性能问题。
> Linux 磁盘管理常用三个命令为 df、du 和 fdisk。
>
> - df（英文全称：disk free）：列出文件系统的整体磁盘使用量
> - du（英文全称：disk used）：检查磁盘空间使用量
> - fdisk：用于磁盘分区

## 5.1 df

> df 命令参数功能：检查文件系统的磁盘空间占用情况。可以利用该命令来获取硬盘被占用了多少空间，目前还剩下多少空间等信息。

```bash
df [-ahikHTm] [目录或文件名]
```

- 选项

  - -a ：列出所有的文件系统，包括系统特有的 /proc 等文件系统；
  - -k ：以 KBytes 的容量显示各文件系统；
  - -m ：以 MBytes 的容量显示各文件系统；
  - -h ：以人们较易阅读的 GBytes, MBytes, KBytes 等格式自行显示；
  - -H ：以 M=1000K 取代 M=1024K 的进位方式；
  - -T ：显示文件系统类型, 连同该 partition 的 filesystem 名称 (例如 ext3) 也列出；
    --i ：不用硬盘容量，而以 inode 的数量来显示

- 检查磁盘内存使用情况

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/8fce12ef29b044bca574625c6b442602.png)

- 以适合阅读的方式 显示磁盘使用情况

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/8630329ab477447da1e03d15e4186325.png)

## 5.2 du

> Linux du 命令也是查看使用空间的，但是与 df 命令不同的是 Linux du 命令是对文件和目录磁盘使用的空间的查看，还是和 df 命令有一些区别的

```bash
du [-ahskm] 文件或目录名称
```

- 选项

  - -a ：列出所有的文件与目录容量，因为默认仅统计目录底下的文件量而已。
  - -h ：以人们较易读的容量格式 (G/M) 显示；
  - -s ：列出总量而已，而不列出每个各别的目录占用容量；
  - -S ：不包括子目录下的总计，与 -s 有点差别。
  - -k ：以 KBytes 列出容量显示；
  - -m ：以 MBytes 列出容量显示；

- 检查每个目录下磁盘使用总量

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/c10281dc4c544d38b84f83d8f55f8c1f.png)


# 6. 用户以及用户组

## 6.1 用户操作

### 添加用户

```bash
useradd [选项] [用户名]
```

- 选项
  - -c comment 指定一段注释性描述。
  - -d 目录 指定用户主目录，如果此目录不存在，则同时使用-m 选项，可以创建主目录
  - -g 用户组 指定用户所属的用户组。
  - -G 用户组，用户组 指定用户所属的附加组。
  - -s Shell 文件 指定用户的登录 Shell。
  - -u 用户号 指定用户的用户号，如果同时有-o 选项，则可以重复使用其他用户的标识号。

### 删除用户

```bash
userdel [选项] [用户名]
```

- 选项
  - 常用的选项是 -r，它的作用是把用户的主目录一起删除。
    > 生成用户的时候，会在`/home/xxx` 生成这个文件夹。只有使用选项`-r` 才能将文件夹一起删除

### 修改用户

```bash
usermod  [选项] [用户名]
```

- 选项
  - -c comment 指定一段注释性描述。
  - -d 目录 指定用户主目录，如果此目录不存在，则同时使用-m 选项，可以创建主目录
  - -g 用户组 指定用户所属的用户组。
  - -G 用户组，用户组 指定用户所属的附加组。
  - -s Shell 文件 指定用户的登录 Shell。
  - -u 用户号 指定用户的用户号，如果同时有-o 选项，则可以重复使用其他用户的标识号。

### 用户口令

```bash
passwd [选项] [用户名]
```

- 选项

  - -l 锁定口令，即禁用账号。
  - -u 口令解锁。
  - -d 使账号无口令。
  - -f 强迫用户下次登录时修改口令。

## 6.2 用户组

### 添加用户组

```bash
groupadd [选项] [用户组]
```

- 选项
  - -g GID 指定新用户组的组标识号（GID）。
  - -o 一般与-g 选项同时使用，表示新用户组的 GID 可以与系统已有用户组的 GID 相同。

### 删除用户组

```bash
groupdel [用户组]
```

### 修改用户组

```bash
groupmod [选项] [用户组]
```

- 选项
  - -g GID 指定新用户组的组标识号（GID）。
  - -o 一般与-g 选项同时使用，表示新用户组的 GID 可以与系统已有用户组的 GID 相同。
  - -n 新用户组 将用户组的名字改为新名字

## 6.3 与用户账号有关的系统文件

- `/etc/password`

  - Linux 系统中的每个用户都在/etc/passwd 文件中有一个对应的记录行，它记录了这个用户的一些基本属性
    ```bash
    sam:x:200:50:Sam san:/home/sam:/bin/sh
    ```
  - 用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录 Shell

- `/etc/group`
  - 将用户分组是 Linux 系统中对用户进行管理及控制访问权限的一种手段。
    ```bash
    users::20:root,sam
    ```
  - 组名:口令:组标识号:组内用户列表
