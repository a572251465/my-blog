<div><h1 align="center">反射</h1></div>

## 1. 引入反射

> 业务场景：现在有一个支付的接口需要实现，支付宝可以实现/ 微信可以实现/ XXX 银行可以实现。 我们需要在前端通过选择支付方式来进行支付。 接下来看下多态以及反射是如何实现的

### 代码引入

- 接口定义

```shell
public interface IPay {
  void payOnline();
}
```

- 微信实现接口

```shell
public class WeChatPay implements IPay {
  @Override
  public void payOnline() {
    System.out.println("这是微信支付");
  }
}
```

- 支付宝实现接口

```shell
public class AliPay implements IPay {
  @Override
  public void payOnline() {
    System.out.println("这是支付宝支付");
  }
}
```

- 通过多态来实现功能

```shell
public class Test {
  public static void main(String[] args) {
    // 表示从前端接受的支付方式
    String flag = "";
    if (Math.random() > 0.5) {
      flag = "支付宝";
    } else {
      flag = "微信";
    }

    if ("支付宝".equals(flag)) commonPay(new AliPay());
    if ("微信".equals(flag)) commonPay(new WeChatPay());
  }

  public static void commonPay(IPay pay) {
    pay.payOnline();
  }
}
```

> 1. 以上就是通过多态来实现，通过不同的判断调用不同的支付方式
> 2. 但是还是不够灵活。因为虽然目前实现了两个支付，但是后续可能会更多支付。那么这里就需要不断的写判断了
> 3. 那么下来 看下反射机制 是如何实现这个功能的

- 通过反射来实现通过

```shell
public class Test1 {
  public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
    String path = Math.random() > 0.5 ? "com.lihh.reflect1.AliPay" : "com.lihh.reflect1.WeChatPay";

    Class c = Class.forName(path);
    Object o = c.newInstance();

    Method m = c.getMethod("payOnline");
    m.invoke(o);
  }
}
```

> 1. 上述是反射的实现逻辑，从抽象层面（其实就是将类同样抽象化了）开始来对方法进行调用
> 2. 实际上不太需要关心，添加新的判断类同时进行方法调用

## 2. 从概念上理解反射

![在这里插入图片描述](https://img-blog.csdnimg.cn/d6d9e0e79cf24d8bbebeb5e56021c6f1.png#pic_center)

### 定义

> - 类是对`对象`的高度抽象化。反射 Class 是对`类`的高度抽象化
> - JAVA 反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法
> - 对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为 java 语言的反射机制

### 原理过程

> - 在编译后产生字节码文件的时候，类加载器子系统通过二进制字节流，负责从文件系统加载 class 文件
> - 在执行程序（java.exe）时候，将字节码文件读入 JVM 中--->这个过程叫做类的加载
> - 然后在内存中对应创建一个 java.lang.Class 对象-->这个对象会被放入字节码信息中
> - 这个 Class 对象,就对应加载那个字节码信息,这个对象将被作为程序访问方法区中的这个类的各种数据的外部接口
>   - 我们可以通过这个对象看到类的结构，这个对象就好像是一面镜子，透过镜子看到类的各种信息，我们形象的称之为反射
> - 说明：在运行期间，如果我们要产生某个类的对象，Java 虚拟机(JVM)会检查该类型的 Class 对象是否已被加载。 如果没有被加载，JVM 会根据类的名称找到.class 文件并加载它。一旦某个类型的 Class 对象已被加载到内存，就可以用它来产生该类型的所有对象

## 3. 获取字节码的多种方式

```shell
public class Test {
  public static void main(String[] args) throws Exception {
    // 获取字节码 信息的4种方式
    // 1. 通过实例的getClass 函数
    Person p = new Person();
    Class c1 = p.getClass();
    System.out.println(c1);

    // 2. 通过内置属性
    Class c2 = Person.class;
    System.out.println(c2);

    // 3. 通过静态方法forName 进行调用
    Class c3 = Class.forName("com.lihh.reflect.Person");
    System.out.println(c3);

    // 4. 利用类的加载器
    ClassLoader loader = Test.class.getClassLoader();
    Class c4 = loader.loadClass("com.lihh.reflect.Person");
    System.out.println(c4);
  }
}
```

> - 第一种方式通过类实例本身的`getClass` 方法来实现
> - 第二种方式通过类构造函数种属性`class` 来实现
> - 第三种方式通过 Class 的静态方法`forName`来实现
> - 第四种方式通过系统加载器来来实现

## 4. 可以作为 Class 类的类型种类

```shell
public class Test2 {
  public static void main(String[] args) {
    // 1. class 的 Class
    Class c1 = AliPay.class;

    // 2. 接口 的 Class
    Class c2 = IPay.class;

    // 3. 数组 的 Class
    int[] arr1 = {1, 2, 3};
    int[] arr2 = {4, 5, 6};
    Class c4 = arr1.getClass();
    Class c5 = arr2.getClass();
    System.out.println(c5 == c4); // true

    // 4. 基础数据类型 的 Class
    Class c6 = int.class;

    // 5. void 的 Class
    Class c7 = void.class;

    // 6. 注解 的 Class
    Class c8 = Override.class;

    System.out.println(c1);
    System.out.println(c2);
    System.out.println(c4);
    System.out.println(c5);
    System.out.println(c6);
    System.out.println(c7);
    System.out.println(c8);
  }
}
```

- 以上的几种类型 都可以获取对用的`Class`
  - class 类
  - 接口
  - 数组
  - 基本数据类型
  - void
  - 注解
- 同一维度，同一元素类型，得到字节码是同一个

## 5. 反射中常用的操作方法

### 构造方法

```shell
public class Test1 {
  public static void main(String[] args) throws NoSuchMethodException {
    // ----- 1. 获取类构造器 以及创建对象

    Class cls = Person.class;

    // 获取可以所有的被 public 修饰的构造函数
    Constructor[] c1 = cls.getConstructors();
    for (Constructor c: c1) {
      System.out.println(c);
    }

    System.out.println("--------------");

    // 获取所有的构造函数
    Constructor[] c2 = cls.getDeclaredConstructors();
    for (Constructor c: c2) {
      System.out.println(c);
    }

    System.out.println("--------------");

    // 获取空构造函数
    Constructor c3 = cls.getConstructor();
    System.out.println(c3);

    System.out.println("--------------");

    // 获取指定参数的构造器
    Constructor c4 = cls.getDeclaredConstructor(String.class, String.class);
    System.out.println(c4);
  }
}
```

- 获取被`public`修饰的 构造函数
- 获取所有的构造函数
- 获取指定空构造函数
- 获取指定参数的构造函数

### 获取实例化对象

```shell
public class Test2 {
  public static void main(String[] args) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
    Class cls = Person.class;

    Constructor c1 = cls.getConstructor();
    Constructor c2 = cls.getDeclaredConstructor(int.class, boolean.class);

    // 实例化 空构造函数
    Object o = c1.newInstance();
    System.out.println(o);

    // 实例化 有参构造函数
    Object o1 = c2.newInstance(20, false);
    System.out.println(o1);
  }
}
```

- 获取字节码 => 获取对应构造函数 => 获取对应实例
- 上述实例中列举了通过空构造函数获取对象/ 通过有参构造函数获取对象

### 获取属性以及对属性赋值

```shell
public class Test3 {
  public static void main(String[] args) throws NoSuchFieldException, NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
    Class cls = Person.class;

    // 获取所有的被public 修饰的属性
    Field[] fls = cls.getFields();
    for (Field f: fls) {
      System.out.println(f);
    }

    System.out.println("--------------------");

    // 获取所有的属性
    Field[] fls1 = cls.getDeclaredFields();
    for (Field f: fls1) {
      System.out.println(f);
    }

    System.out.println("--------------------");

    // 获取指定的属性
    Field emil = cls.getField("emil");
    System.out.println(emil);

    System.out.println("--------------------");

    // 获取指定属性的数据类型
    Class e1 = emil.getType();
    System.out.println(e1.getName());

    System.out.println("--------------------");

    // 获取指定属性的修饰符
    int modifiers = emil.getModifiers();
    System.out.println(Modifier.toString(modifiers));

    System.out.println("--------------------");

    // 给指定属性 设置值
    Constructor con1 = cls.getConstructor();
    Object s = con1.newInstance();
    emil.set(s, "test email");
    System.out.println(s);
  }
}
```

- 获取被 public 修饰的属性
- 获取所有的属性
- 获取指定属性
- 获取指定属性的类型
- 获取指定属性的修饰符
- 给指定属性设置值

### 方法以及方法周边 调用

```shell
public class Test4 {
  public static void main(String[] args) throws NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
    Class cls = Person.class;

    // 获取所有被public 修饰的方法
    Method[] ms = cls.getMethods();
    for (Method m : ms) {
      System.out.println(m);
    }

    System.out.println("-------------------");

    // 获取所有的方法
    Method[] ms1 = cls.getDeclaredMethods();
    for (Method m : ms1) {
      System.out.println(m);
    }

    System.out.println("-------------------");

    // 获取指定的方法
    Method m1 = cls.getMethod("say");
    System.out.println(m1);

    System.out.println("-------------------");

    // 获取指定名称 指定参数的方法
    Method m2 = cls.getMethod("look", String.class, String.class);
    System.out.println(m2);

    // 获取名称/ 修饰符/ 返回值/ 参数列表/ 获取注解
    System.out.println(m2.getName());
    System.out.println(Modifier.toString(m2.getModifiers()));
    System.out.println(m2.getReturnType());
    Class[] t1 = m2.getParameterTypes();
    for (Class t : t1) {
      System.out.println(t);
    }

    Method m3 = cls.getDeclaredMethod("eat");
    Annotation[] an = m3.getAnnotations();
    for (Annotation a : an) {
      System.out.println(a);
    }

    System.out.println("-------------------");

    // 调用函数
    Method m4 = cls.getMethod("look", String.class, String.class);
    Object o = cls.newInstance();
    m4.invoke(o, "测试参数1", "测试参数2");
  }
}
```

- 获取被 public 修饰的方法
- 获取所有的方法
- 获取方法名称
- 根据名称获取指定方法
- 获取指定方法的修饰符
- 获取指定方法的返回值
- 获取指定方法的参数列表
- 获取指定方法的注解
- 调用指定方法

### 类相关的方法

```shell
public class Test5 {
  public static void main(String[] args) {
    Class cls = Person.class;

    // 获取实现的接口
    Class[] ints = cls.getInterfaces();
    for (Class i: ints) {
      System.out.println(i);
    }

    System.out.println("---------------------------");

    // 获取父类的字节码信息
    Class p = cls.getSuperclass();
    System.out.println(p);

    System.out.println("---------------------------");

    // 获取运行时所在包
    Package ap = cls.getPackage();
    System.out.println(ap);
    System.out.println(ap.getName());

    System.out.println("---------------------------");

    // 获取运行时注解
    Annotation[] an = cls.getAnnotations();
    for (Annotation a: an) {
      System.out.println(a);
    }
  }
}
```

- 获取实现的接口列表
- 获取父类的字节码信息
- 获取运行时所在的包
- 获取运行时的注解
