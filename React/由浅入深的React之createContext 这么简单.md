> 1. 今天看了下react中createContext相关的源码，特意在这里拿出来分享下。同时也会体现出关于本人看源码的技巧
> 2. 本文采用源码分析以及源码断点调试的方式进行列举
## 用法
```js
import React from "react";
const CounterContext = React.createContext()

// 子类组件
function Counter() {
  const {count, setCount} = React.useContext(CounterContext)
  return (<button onClick={() => setCount(count + 1)}>+</button>)
}

// 父类组件
function App() {
  const [count, setCount] = React.useState(0)
  const data = {setCount, count}
  return (
    <CounterContext.Provider value={data}>
      <div>
        {count}
        <hr/>
        <Counter />
      </div>
    </CounterContext.Provider>
  )
}

export default App
```
- 上述的代码其实很简单。就是父类提供相关的方法`setCount`, 但是事件的点击是由子类触发的
- 通过组件`CounterContext.Provider` 给子类。同时子类通过`useContext`拿到后，直接使用
- 代码其实没有什么难度，这里就不过多的做解释了
## 举例说明
> 为了方便理解，这里先用个人认为通俗易懂的方式给大家介绍下，顺着这个介绍再去看源码也许会好很多
```js
// 有个函数 可以返回一个组件，组件中可以挂载属性
function createContext() {
	return {
		Provider: {$$typeof: xxx, ...},
		_currentValue: null
	}
}

function useContext(context) {
	return context._currentValue
}
```
- 第一步：
	>  `const context = createContext()`  // 我们会执行函数返回一个对象。 对象中的属性Provider可以作为一个组件，属性_currentValue可以用来保存值
- 第二步
	> `<context.Provider value = {store}>XXX</context.Provider>` // 一般我们在组件中是这么使用的。我们经过一通运作后会出现这样的代码效果`context._currentValue = store`
- 第三步
	> `const store = useContext(context)` // 子类一般都是这么使用的。
- 第四步：通过上述三部分可以总结出：我们就是定义一个变量，将传递的数据赋值给它，然后从它身上取值就完事了
## 源码分析
### 1. React.createContext
`packages/react/src/ReactContext.js`
```js
// 用来表示生成上下文
export function createContext<T>(defaultValue: T): {
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    // 将来要存放的值
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
    _defaultValue: (null: any),
    _globalName: (null: any),
  };

  // 提供的Provider组件 使用案例
  /**
   *
   * const CounterContext = React.createContext()
   * <CounterContext.Provider value = {xxx}></CounterContext.Provider>
   */
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  // ...
  return context;
}
```
### 2. React.useContext
1. `packages/react/src/ReactHooks.js`
2. `packages/react-reconciler/src/ReactFiberHooks.new.js`
3. `packages/react-reconciler/src/ReactFiberNewContext.new.js`
```js
// 调用1处
export function useContext<T>(Context: ReactContext<T>): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useContext(Context);
}

// 调用2处
useContext<T>(context: ReactContext<T>): T {
  currentHookNameInDev = 'useContext';
  mountHookTypesDev();
  return readContext(context);
},

// 调用3处 删减版
export function readContext<T>(context: ReactContext<T>): T {

  const value = context._currentValue
  return value
}
```
### Provider render赋值过程
![在这里插入图片描述](https://img-blog.csdnimg.cn/79e02a19360144b8b5d9e385360d23c5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5YmN56uv5bmy6LSn5a-66Zmi,size_20,color_FFFFFF,t_70,g_se,x_16)![在这里插入图片描述](https://img-blog.csdnimg.cn/0be35804e2a94032b3c013982a58559e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5YmN56uv5bmy6LSn5a-66Zmi,size_20,color_FFFFFF,t_70,g_se,x_16)
> 由于react源码中流程很长，如果单纯来讲的话太麻烦了。所以直接把断点弄出来了。这个截图很简单，其实就是描述了如何将`value` 赋值给`_currentValue`的
## 分析源码心得
> 仅仅代表个人观点，不喜勿喷
1.  一开始不要想着立马找到想知道的内容，从package.json入口出发
2. 遇到都是英文比较难懂的源码不要心急，不用每个方法都进去看一遍，分析一遍。那样的话只会让自己越来越急躁，把方法代码收缩起来，先通过方法名称大致分析猜想下该方法想干嘛
3. 还是看不懂/ 或是流程太长的话，直接断点源码，同时断点的是结合源码文件一点一点单步走，同时进行注释标注
## end
> 以上就是今天分析React.createContext的所有过程，希望能帮助到大家。如果各位觉得小编还不错。请大家关注，点击，评论一条龙走过
