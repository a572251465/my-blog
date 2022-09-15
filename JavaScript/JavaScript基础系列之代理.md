<div align = "center"><h1>代理</h1></div>

## 什么是代理

> 一个对象提供一个代用品，以便控制对它的访问

## Object.defineProperty

> - 使用上述该语法可以实现对象的代理。`Object.defineProperty(obj, key, descriptor)`.但是与其说是代理，不如说是重写。
> - 因为使用该 API 进行代理后，会修改原对象的属性。如果使用了 getter/setter 的话 给原对象设置 get/ set 方法。所以可以说是重写/ 不是代理

> - 使用该 API 可以配置一些属性。例如是否可配置/ 是否枚举等。同时可以对属性进行代理 getter/ setter. 当对属性进行获取/ 设置的时候，可以进行监听触发。
> - 但是对对象重写/ 数组重写的时候 略有不同

```js
const obj = { name: "", arr: [] };

function cloneObj(obj, key) {
  let val = obj[key];
  // 对象
  Object.defineProperty(obj, key, {
    get() {
      console.log("进行name属性值获取");
      return val;
    },
    set(v) {
      console.log(`修改了属性name，结果变成了${v}`);
      val = v;
    },
  });
}

function cloneArray(obj, key) {
  let val = obj[key];

  Object.defineProperty(obj[key], "0", {
    get() {
      return val;
    },
    set(v) {
      document.getElementById("content").innerHTML = v;
      console.log(v);
    },
  });
}

cloneObj(obj, "name");
cloneArray(obj, "arr");

obj.name;
console.log(obj);
obj.name = "test";

document.getElementById("btn").addEventListener("click", () => {
  obj.arr.push(0);
});
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/c708d62267bd4bb7951fe231b2c8df92.png)

- 对象代理属性后，会出现上述截图中的两个方法
- 进行代理后，获取属性值的时候，会触发`get`方法。进行设置值的时候会触发`set`方法。 其实对对象的代理还是相对完美的。只不过是需要通过遍历一个一个进行代理。如下：

```js
const obj = { name: "xxx", age: 20 };
for (const key in obj) {
  Object.defineProperty(obj, key, {
    get() {},
    set(v) {},
  });
}
```

- 如果是代理数组的话，Object.defineProperty 就不是那么友好了
- 对于数组的 api 例如：push.以及修改 length 长度。是无法监听到的
- 只能通过`arr[0] = 1` 这种方式 才会触发监听。而且数组长度很大的话。如果代理下标，很浪费性能。所以框架`vue2` 中对数组的监听。是通过函数劫持来完成的

### 兼容性

![在这里插入图片描述](https://img-blog.csdnimg.cn/1caf9b5814234993a5814b6c8c1f1a79.png)

## Proxy

- 是 es6 中新语法。可以监听多个动作变化，除了 set/ get/ has/ del 等 多达 13 中变化
- 是对 对象进行代理。会返回一个代理后的对象。原对象保持不变
- 在代理数组的时候，可以监听到 push/ length 的函数/ 属性的调用
- 唯一的缺陷就是兼容性 不如 Object.defineProperty API

```js
const obj = {
  name: "xxx",
  arr: [],
};

const proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(`触发了属性${key}`);
    const res = Reflect.get(target, key, receiver);

    if (res && typeof res !== "object") return res;

    return new Proxy(res, {
      get(target, key, receiver) {
        console.log(`触发了属性${key}`, "child");
        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        console.log(`触发了属性${key}, 设置内容是${value}`, "child");
        Reflect.set(target, key, value, receiver);
      },
    });
  },
  set(target, key, value, receiver) {
    console.log(`触发了属性${key}, 设置内容是${value}`);
    Reflect.set(target, key, value, receiver);
  },
});

console.log(proxyObj.name);
proxyObj.name = "lihh1";
proxyObj.arr.length = 0;
```
