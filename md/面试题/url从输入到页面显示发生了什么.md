## url从输入到页面显示发生了什么

![在这里插入图片描述](https://img-blog.csdnimg.cn/e9ba9f2a040b48b3a87f1d992201982a.jpeg)
- 浏览器进程
  1. 检查url格式
  2. 浏览器进程调用渲染进程，准备渲染
  3. 检查缓存(资源强制缓存/ 协商缓存)
- 网络进程
  1. DNS解析，匹配ip地址 + 端口号
  2. 建立http通道(三次握手 + 四次挥手)
- 渲染进程
  1. 返回请求资源，渲染进程开始渲染
  2. html解析
  3. css解析
  4. 将html Tree以及CssOM进行合成 => render Tree
  6. 进行布局
  7. 进行绘制
- GPU进程
  1. 分层进行GPU性能加速，分层绘制
- 渲染进程
  1. 进行分层合成 (只触发复合层)
    - transform: translate(npx, npx)
    - transform: scale(n)
    - transform: rotate(0deg)
    - opacity: 0...1
  2. 渲染到显示器上
