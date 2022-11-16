<h1 align = "center">linux目录结构</h1>

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
