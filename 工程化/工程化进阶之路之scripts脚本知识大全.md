<h1 align = "center">scripts 脚本知识大全</h1>

## 1. post/ pre 钩子

- 使用 npm 钩子，比如 pre，post 钩子。对应的是`npm run prebuild` 以及`npm run postbuild`钩子
- 其实每个自定义脚本中都存在与之匹配的前钩子以及后钩子。例如自定义脚本`xxx`，分别有`prexxx` 以及`postxxx`
- 其实他们的执行顺序是`prebuild` -> `build` -> `postbuild`

### 实例

```json
"build": "node npm-hooks/build.js",
"prebuild": "node npm-hooks/prebuild.js",
"postbuild": "node npm-hooks/postbuild.js"
```

- [执行实例](https://github.com/a572251465/scripts-demo)

## 2. 运行脚本命令

> 实际的项目中运行代码`console.log(process.env)`

- 主盘符相关的命令

```text
  ALLUSERSPROFILE: 'C:\\ProgramData',
  APPDATA: 'C:\\Users\\Lenovo\\AppData\\Roaming',
  COMMONPROGRAMFILES: 'C:\\Program Files\\Common Files',
  'CommonProgramFiles(x86)': 'C:\\Program Files (x86)\\Common Files',
  CommonProgramW6432: 'C:\\Program Files\\Common Files',
  COMPUTERNAME: 'DESKTOP-RI7J3IM',
  COMSPEC: 'C:\\Windows\\system32\\cmd.exe',
  DriverData: 'C:\\Windows\\System32\\Drivers\\DriverData',
  EXEPATH: 'C:\\software\\Git\\bin',
  FPS_BROWSER_APP_PROFILE_STRING: 'Internet Explorer',
  FPS_BROWSER_USER_PROFILE_STRING: 'Default',
  HOME: 'C:\\Users\\Lenovo',
  HOMEDRIVE: 'C:',
  HOMEPATH: '\\Users\\Lenovo',
```

- 打印所有的环境变量相关的内容
- 打印 npm 配置文件相关的

```text
  NODE: 'C:\\software\\nodejs\\node.exe',
  npm_config_argv: '{"remain":[],"cooked":["run","print"],"original":["print"]}',
  npm_config_bin_links: 'true',
  npm_config_home: 'https://npm.taobao.org',
  npm_config_ignore_optional: '',
  npm_config_ignore_scripts: '',
  npm_config_init_license: 'MIT',
  npm_config_init_version: '1.0.0',
  npm_config_registry: 'https://registry.yarnpkg.com',
  npm_config_save_prefix: '^',
  npm_config_strict_ssl: 'true',
  npm_config_user_agent: 'yarn/1.22.19 npm/? node/v16.17.0 win32 x64',
  npm_config_version_commit_hooks: 'true',
  npm_config_version_git_message: 'v%s',
  npm_config_version_git_sign: '',
  npm_config_version_git_tag: 'true',
  npm_config_version_tag_prefix: 'v',
  npm_execpath: 'C:\\software\\nvm\\v16.17.0\\node_modules\\yarn\\bin\\yarn.js',
  npm_lifecycle_event: 'print',
  npm_lifecycle_script: 'node params/run.js',
  npm_node_execpath: 'C:\\software\\nodejs\\node.exe',
```

- 将文件`package.json`文件作为参数打印

```text
  npm_package_description: '',
  npm_package_devDependencies__types_node: '^18.7.19',
  npm_package_license: 'ISC',
  npm_package_main: 'index.js',
  npm_package_name: 'scripts-demo',
  npm_package_scripts_build: 'node npm-hooks/build.js',
  npm_package_scripts_postbuild: 'node npm-hooks/postbuild.js',
  npm_package_scripts_prebuild: 'node npm-hooks/prebuild.js',
  npm_package_scripts_print: 'node params/run.js',
  npm_package_version: '1.0.0',
```

- [运行实例](https://github.com/a572251465/scripts-demo/tree/main/params)

## 3. 执行顺序

- 如果想要脚本串行执行，使用符号`&&` 来连接
- 如果想要脚本并行执行，使用符号`&` 来连接
