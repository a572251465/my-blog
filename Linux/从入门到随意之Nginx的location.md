<h1 align = "center">location</h1>

## 1. 正则表达式规则

![在这里插入图片描述](https://img-blog.csdnimg.cn/0bb99ed1e641419191c0720aff14fa75.png)

## 2. 语法规则

- location 仅匹配 URI，忽略参数
- 前缀字符串
  - 常规
  - = 精确匹配
  - ^~ 匹配上后则不再进行正则表达式的匹配
- 正则表达式
  - ~ 大小写敏感的正则表达式匹配
  - ~\*忽略大小写的正则表达式匹配
    内部调转
- 用于内部跳转的命名 location @

```text
Syntax location [=|~|~*|^~] uri {...}
       location @name{...}
default -
Context server,location
```

## 3. 匹配规则

- 等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项。
- ^~类型表达式。一旦匹配成功，则不再查找其他匹配项。
- 正则表达式类型（~ ~\*）的优先级次之。如果有多个 location 的正则能匹配的话，则使用正则表达式最长的那个
- 常规字符串匹配类型按前缀匹配

![在这里插入图片描述](https://img-blog.csdnimg.cn/939ce7faa8cd4cf8b7785f5d6f678405.png)

## 4. 案例

```text
location ~ /T1/$ {
    return 200 '匹配到第一个正则表达式';
}
location ~* /T1/(\w+)$ {
    return 200 '匹配到最长的正则表达式';
}
location ^~ /T1/ {
    return 200 '停止后续的正则表达式匹配';
}
location  /T1/T2 {
    return 200 '最长的前缀表达式匹配';
}
location  /T1 {
    return 200 '前缀表达式匹配';
}
location = /T1 {
    return 200 '精确匹配';
}
```

```text
/T1     //精确匹配
/T1/    //停止后续的正则表达式匹配
/T1/T2  //匹配到最长的正则表达式
(先匹配最长字符串进行保存，然后匹配所有的正则，如果正则匹配上返回正则，反之匹配最长字符串)
/T1/T2/ //最长的前缀表达式匹配
/t1/T2  //匹配到最长的正则表达式
```
