<h1 align = "center">纯ts库配置eslint</h1>

## 前言

> - 其实在真实的项目中无论项目的大小，标准的 eslint 配置都少不了，第一个呢有利于代码规范，第二呢有利于团队将来的代码维护
> - 接下来 我会一步一步的来基于一个纯 ts 库 项目，带着大家来配置 eslint + prettier + husky + commitlint

## step1：eslint 初始化

> 首先进行 eslint 的初始化

- 执行命令`npx eslint --init`
- 选择 eslint 范围

![在这里插入图片描述](https://img-blog.csdnimg.cn/60f3f493b70949d0bdb0099c5a39fbf8.png)

- 选择模块

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf42765e570c4016a2540f0f19d01b45.png)

- 选择语言

![在这里插入图片描述](https://img-blog.csdnimg.cn/31ab4c96eafd4ae5a2b7bea7370ac139.png)

- 是否使用 ts

![在这里插入图片描述](https://img-blog.csdnimg.cn/d25dbaac1c88463182dfeae7a2bb2c9d.png)

- 使用环境

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f403e99b90346d1adee5d7d27dfeae7.png)

- 生成文件格式

![在这里插入图片描述](https://img-blog.csdnimg.cn/80b71fce0c7140ffb22a2f6ca976cb6b.png)

- 使用立马生成（这里我选择自己用 pnpm。如果用 npm 可以选择 yes）

![在这里插入图片描述](https://img-blog.csdnimg.cn/9981da923b3e4474a344679a06c45d8a.png)

## step2：配置 prettier

> - 可能有人分不清什么是 eslint，什么是 prettier 的。其实 prettier 是专注于代码风格的，比如换行，空格，分号等
> - 所以关于代码风格的事情就交给 prettier 来做。但是语法层面不符合规范的还是交给 eslint 的。例如：应该是 const 而不是 var 等

### 插件下载

```shell
pnpm install prettier eslint-plugin-prettier -D
```

- 插件`prettier` 是修改代码风格的
- 插件`eslint-plugin-prettier` 专注于如果风格有问题的话，也可以通过 eslint 报错

## step3: 配置 package.json

```json
{
  "script": {
    "lint": "eslint --fix --ext .ts src --quiet"
  }
}
```

- `--fix` 此命令是用来做修复的
- `--ext` 此命令用来表示文件后缀的
- `--quiet` 用来表示跳过警告的

## step4：配置 husky

> 什么是 husky 呢。其实我们想在提交前统一执行下命令`pnpm lint`. 但是我们总不能每次都自己执行吧，那么我们就可以配置命令来自动执行

### 下载插件

```shell
pnpm install husky -D
```

### 添加 package.json 配置

```json
{
  "script": {
    "prepare": "husky install"
  }
}
```

- 上述命令的目的：在项目第一次执行 install 的时候，会通过此命令生成一个`.husky`文件夹。里面包含一些钩子
- 如果项目是后来配置的话，可以执行命令`npx husky install`生成一个.husky 文件夹

### 利用 git 的钩子

> 其实就是要添加 git hook，在代码提交之前做一些事情。命令如下；

```shell
pnpm husky add .husky/pre-commit "pnpm lint"
```

## step5 配置 commitlint

> - 执行到这一步的话，基本的 eslint, prettier/ husky 都配置完了，但是我们还有注意事情。
> - 你说我们总不能每次提交的时候，随便写注释吧。例如：`git commit -m "sdfdsfsdsdfsdf"`。 这样是不是太乱了
> - 所以我们就用到了 commitlint 插件了

### 插件下载

```shell
pnpm install @commitlint/cli @commitlint/config-conventional -D
```

> 上述插件就是为了提交时候 检查规范用的

### 添加 git 钩子

```shell
pnpm husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

### 配置 commitlint 文件

> 新建一个文件`commitlint.config.js` 将下面的话加入到文件中

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

### 注意规范

![在这里插入图片描述](https://img-blog.csdnimg.cn/a22fdf392eb2405a84a9bfb9ce49b8b9.png)

## step6 配置字体

- 新建文件`.editorconfig`. 将下面的内容复制进去

```text
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
```

- 同时也是需要 VScode 插件`EditorConfig for VS Code`配合的。所以也需要下载此插件

## step7 注意点：

- 需要下载 VS CODE 插件`eslint`
- 也是需要设置如下配置，这样每次保存的时候都会使用 prettier 进行格式化代码
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/abad238d6ead446baecadfb9b7c75036.png)

## step8 示例 demo

[示例 demo](https://github.com/a572251465/simple-ts-library-eslint-demo)
