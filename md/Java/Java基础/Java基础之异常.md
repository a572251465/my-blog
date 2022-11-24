<div align = "center"><h1>异常</h1></div>

![在这里插入图片描述](https://img-blog.csdnimg.cn/8fb57d4a4484432d80144f82761a9b5f.png#pic_center)

> 上述是异常的大致分类，从基类`Object` 到 检查异常以及运行时异常

## 认识关键字

> 在整个异常体系中，大致需要认识几个关键字`try`, `catch`, `finally`, `throw`, `throws`

- 一个程序中发生了错误，一般我们可以使用`try catch` 进行捕获，捕获后 try 块中发生错误的代码之后的代码无法执行，`try catch` 代码块之后的代码可以正常执行。
- 但是前提是 try 代码块中不能出现`return` 等关键字字眼
- 那什么情况下可以无论什么情况都可以执行呢？？？ 那就是`finally` 代码块中。
- 只有一种行为能阻止`finally`的执行。那就是`System.exit(0)`

## throw 以及 throws 区别

- 位置不同
  - throw：位于方法内部
  - throws：方法的签名处，方法的声明处
- 内容不同
  - throw 异常对象 （检查时异常 或是 运行时异常）
  - throws 异常的类型 （多种类型可以使用逗号进行分割）
- 作用不同
  - throw 异常处理的源头，目的就是为了制造异常
  - throws 在方法的声明处，其目的就是为了告诉方法的调用者，这个方法中可能会出现我声明的这些异常，谁调用谁来处理
