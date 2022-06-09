## 合成事件
> 今天主要是分享下React 合成事件。 到底什么是合成事件，以及react16以及react17的合成事件有什么大的改动

### 原理
- 其实react事件合成的原理就是利用事件冒泡的顶级代理来实现的。
- 在包括react16之前事件被代理到了document上
- 在包括react17之后事件被代理到了root节点上

### react16/ 17执行结果
> [运行demo地址](https://gitee.com/li_haohao_1/react-world/tree/master/%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6)

- react16 运行结果
![](./images/3.png)
- react17运行结果
![](./images/4.png)
- 通过上述发现react16跟原生的事件的冒泡过程差异还是很大的
- 所以在react17进行了修改

## 模拟react16/ 17执行结果
> [运行demo地址](https://gitee.com/li_haohao_1/react-world/tree/master/%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6-html%E5%AE%9E%E7%8E%B0%E7%89%88)
- 运行出来的结果跟源码是保持一致的。这里就不贴图了，如果想看可以到demo中看下
- react16
  - 就是将事件绑定在了document上，在document模拟执行了捕获/ 冒泡
  - 而事件其实实在冒泡到document上执行的。所以才会出现上述诡异的打印结果
- react17
  - 将事件绑定在了root节点上。而且是事件冒泡以及捕获各绑定了一次
  - 所以捕获的时候先执行react事件，冒泡的时候也会执行react冒泡事件
  - react17的变化也会带来一种问题：就是跟IE执行过程不符合了。因为IE只有冒泡过程，没有捕获过程


> 关注我的[GitHub博客](https://github.com/a572251465/my-blog),会不断更新基础知识/ 源码分析/ 工程化等
