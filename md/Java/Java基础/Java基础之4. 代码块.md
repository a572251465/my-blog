<h1 align = "center">代码块</h1>

> 今天会大致讲述下 Java 中代码块。其实也是为了让大家知道晦涩的代码块有哪些

## 1. 案例

### 1.1 上代码

```shell
public class TestBlock {

    static {
        System.out.println("1. --------- 静态块");
    }

    {
        System.out.println("2. --------- 构造块");
    }

    public TestBlock() {
        System.out.println("3. --------- 构造函数");
    }

    public void say() {
        {
            System.out.println("4. --------- 普通块");
        }

        System.out.println("5. --------- 普通函数");

        {
            System.out.println("6. --------- 普通块");
        }
    }

    public static void main(String[] args) {
        TestBlock testBlock = new TestBlock();
        testBlock.say();
    }
}
```

### 1.2 代码分析

![在这里插入图片描述](https://img-blog.csdnimg.cn/f35e0f61612b4f6993bb96ea6d4b4309.png)

- 代码块大致分为三类：`构造块`, `静态块`, `普通块`
- 其中`静态块` 跟字节码一起被加载，所以会优先被加载，其特性跟静态方法以及静态属性一致的
- 构造块 执行优先级 比 构造函数高
