## 前言

> - 本文章属个人源码分析笔记，描述不周之处，多多海涵。废不多说，马上开始吧
> - 这里简单描述下实现原理：
>   - 代码`<MyComponent @clicked = () => alert('111')></MyComponent>`中
>   - 会解析出参数`props: {onClicked: () => alert('111')}`
>   - 当调用 emit 的时候，会从实例中获取`props`参数。寻找`onClicked`参数，然后执行
>   - 一句话：执行的方法会挂载到实例的 props 上，在 props 上寻找对应的值，然后执行

## demo 地址

> [demo 地址](https://gitee.com/li_haohao_1/vue-world/tree/master/vue3/props&emit)

## demo 内容

```js
const { render, h, ref, watch, Fragment } = Vue;
const MyComponent = {
  props: {
    name: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
  },

  setup(props, ctx) {
    const clickHandle = () => {
      debugger;
      ctx.emit("clicked");
    };
    const changeHandle = event => {
      ctx.emit("update:modelValue", event.target.value);
    };
    return () =>
      h(Fragment, [
        h(
          "button",
          { onClick: () => clickHandle(), style: { color: "red" } },
          "添加"
        ),
        h("input", { type: "text", onChange: e => changeHandle(e) }),
      ]);
  },
};
const VueComponent = {
  setup() {
    const name = ref("lihh");
    const name1 = ref("");
    watch(name1, value => {
      console.log(value);
    });

    const modelChange = value => {
      name1.value = value;
    };

    return () =>
      h(
        "div",
        {},
        h(MyComponent, {
          modelValue: name1,
          "onUpdate:modelValue": modelChange,
          name: name.value,
          onClicked: () => alert("111"),
        })
      );
  },
};

render(h(VueComponent), document.getElementById("app"));
```

## emit 函数解析

> 地址：`packages\runtime-core\src\componentEmits.ts`, 函数：`emit`
> 先粘贴一段关于 emit 触发的时候，实例的 props 上被设置的属性
> ![在这里插入图片描述](https://img-blog.csdnimg.cn/7b8adf25a1544533b008b0220dd46838.png)

```ts
/**
 *  @description emit实现入口
 */
export function emit(
  // 组件实例
  instance: ComponentInternalInstance,
  // 触发事件
  event: string,
  // 剩余参数
  ...rawArgs: any[]
) {
  if (instance.isUnmounted) return;
  // 获取实例上的props
  const props = instance.vnode.props || EMPTY_OBJ;

  let args = rawArgs;
  // 开始是update: 是v-model的绑定事件
  const isModelListener = event.startsWith("update:");

  // for v-model update:xxx events, apply modifiers on args
  // 通过slice 截取正常事件名称
  const modelArg = isModelListener && event.slice(7);
  // 属性存在 && 属性在props中
  if (modelArg && modelArg in props) {
    const modifiersKey = `${
      modelArg === "modelValue" ? "model" : modelArg
    }Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map(a => a.trim());
    } else if (number) {
      args = rawArgs.map(toNumber);
    }
  }

  if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    devtoolsComponentEmit(instance, event, args);
  }

  let handlerName;
  // 通过emit触发的事件
  let handler =
    props[(handlerName = toHandlerKey(event))] ||
    // also try camelCase event handler (#2249)
    props[(handlerName = toHandlerKey(camelize(event)))];
  // for v-model update:xxx events, also trigger kebab-case equivalent
  // for props passed via kebab-case
  if (!handler && isModelListener) {
    handler = props[(handlerName = toHandlerKey(hyphenate(event)))];
  }

  // 进行事件执行
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args
    );
  }

  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {} as Record<any, boolean>;
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args
    );
  }

  if (__COMPAT__) {
    compatModelEmit(instance, event, args);
    return compatInstanceEmit(instance, event, args);
  }
}
```

- 函数`emit`是通过 bind 产生的，在生成`instance`的时候就已经产生了`emit`函数。第一个参数就是强制绑定为实例
- 获取实例上`props`的参数
- 会从 props 中获取待执行的参数
- 处理关于添加修饰符`once`的事件
