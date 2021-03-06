## V8垃圾回收机制

### 1. 垃圾回收机制的分类：
- 手动回收 (C语言)
- 自动回收 (Java语言，JavaScript语言)
> JavaScript中原始数据类型存放到栈中，但是引用数据类型存放到堆中。既然存放的位置不一样，那么垃圾回收机制的策略是不同的

### 3. 垃圾分配
- 栈
  1. 栈中分配的空间是通过移动上下文指针来销毁占用的空间
- 堆
  1. "代际假说"：
    - 第一个是大部分对象在内存中存在的时间很短，简单来说，就是很多对象一经分配内存，很快变为不可访问对象
    - 第二个是不死的对象，会活的更久
  2. 主要是通过主垃圾回收器（老生代）以及副垃圾回收器（新生代）。
  3. 副垃圾回收器采用算法将空间分为对象区域和空闲区域:
    - 垃圾回收的过程中，在对象区域标记活动对象以及非活动对象，之后，将活动对象复制到空闲区域，然后角色反转，完全清理掉对象区域的内存，其实这样就可以无限的循环下去了
    - JavaScript引擎采用了对象晋升策略，如果在新生代中经过两次反转回收还存在的对象， 会被移动到老生区内
  4. 老生区采用的是大家耳熟能详的“标记清理”：
     1. 标记过程：标记阶段从根元素开始，递归遍历这组根元素，如果能访问到的元素就是活动对象，访问不到的就是垃圾数据
     2. 清除垃圾：就是将标记的垃圾数据直接清除
     3. 内存整理：清除后出现不连续的内存空间，让所有存活的内存往一端移动
- 垃圾回收执行过程
  - 第一步标记活动对象以及非活动对象。所谓的活动对象就是还在使用的对象，非活动对象就是垃圾回收器回收的对象
  - 第二步回收非活动对象占用的内存
  - 第三步内存整理

### 4. 避免内存溢出
1. 意外的全局变量
2. 被遗忘的定时器
3. 过程中用不到的变量/ 函数
4. 过度的使用闭包
5. 被遗忘的事件监听
6. 脱离DOM的引用
