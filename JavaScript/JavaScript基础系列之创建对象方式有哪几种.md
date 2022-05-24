## 创建对象方式哪几种

> - `const obj = new Object` new Object 的形式来创建
> - `const obj = {}` 通过字面量的形式来创建
> - `const obj = Object.create(null)`
> - **不同：**
>   - 如果使用`{}`只能构造 object 相关数据类型
>   - 使用`new Object`进行传递参数的时候（例如：基本数据类型/ Set/ Map），会构造出对应包装数据类型
>   - 如果使用`Object.create(null)`, 构造出来对象无任何`原型链`

### 第一种方式

> 通过`var a = new Object()` 来创建

![8e56b5f8430ac3cbfd5f87b0f4ad2140.png](images/img.png)

![e6e927fcbc18ddafb5fa8e98db67b53f.png](images/Image%20%5B1%5D.png)

- 使用`new Object`可以自由的传递参数。
- 如果是传递基本数据类型/ Set/ Map 等，会构造对应的包装数据类型

### 第二种方式

- 第二种方式跟第一种方式没有什么不同，只不过更加简单了

![a5035a40d1dc776ac6556b1a6d8b2bd7.png](images/Image%20%5B2%5D.png)

### 第三种方式

> 第三种方式创建出来是一个空白对象，没有任何原型链继承

![4b1ae36b7f27bd3206d93c1c55ed604e.png](images/Image%20%5B3%5D.png)

![71ee0ed2cc5192b04fa9f9fbb0a43374.png](images/Image%20%5B4%5D.png)
