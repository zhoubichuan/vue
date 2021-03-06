---
lang: zh-CN
sidebarDepth: 2
meta:
  - name: description
    content: 个人总结的vuepress学习技术文档-语法
  - name: keywords
    content: vuepress,最新技术文档,vuepress语法,markdown语法
---

# Vue2.0 源码概览

### vue2.0 案例

通过以下案例来了解 Vue 首次加载的全部过程：

```js
new Vue({
  render(h) {
    return h(<App />)
  },
}).$mount("#app")
```

这里就包含两大部分：

- 实例化 Vue,将相关参数以对象的形式传入到 Vue 内部
- 调用 Vue 实例上的\$mount 方法

> 据此可以将 Vue 看成两个阶段：

- new Vue 阶段
  - 1.\_init：将用户传入的参数进行初始化处理
- \$mount 阶段
  - 2.\$mount: 将 template 模板进行编译生成 render 函数
  - 3.mount: 实例化组件 Watch，将 render 转换为 Vnode,将 Vnode 插入到 dom 中

### vue2.0 源码结构

```sh
├── compiler                          # 编译相关
│   ├── codegen                       # ├── 将编译结果生成render
│   ├── directives                    # ├── 编译指令
│   ├── parser                        # ├── 解析template
│   ├── create-compiler.js            # ├── 创建编译函数
│   ├── error-detector.js             # ├──
│   ├── helpers.js                    # ├──
│   ├── index.js                      # ├── 入口文件
│   ├── optimizer.js                  # ├── 优化编译结果
│   └── to-function.js                # └──
├── core                              # 核心代码
│   ├── components                    # ├── 组件相关
│   ├── global-api                    # ├── 全局API
│   ├── instance                      # ├──
│   ├── observer                      # ├── 响应式
│   ├── util                          # ├── 工具方法
│   ├── vdom                          # ├── 虚拟dom
│   ├── config.js                     # ├──
│   └── index.js                      # └── 入口文件
├── platforms                         # 不同平台的支持
│   ├── web                           # ├── web平台
│   └── weex                          # └── weex平台
├── server                            # 服务
│   ├── bundle-renderer               # ├──
│   ├── optimizing-compiler           # ├──
│   ├── template-renderer             # ├──
│   ├── webpack-plugin                # ├──
│   ├── create-basic-renderer.js      # ├──
│   ├── create-renderer.js            # ├── 路由配置文件
│   ├── render-context.js             # ├──
│   ├── render-stream.js              # ├──
│   ├── render.js                     # ├── 渲染相关
│   ├── util.js                       # ├── 工具方法
│   └── write.js                      # └──
├── sfc                               # .vue 文件解析
│   └── parser.js                     # └──
├── shared                            # 共享代码
│   ├── constants.js                  # ├── 路由配置文件
│   └── util.js                       # └── 共享工具方法
```

### vue2.0 源码运行示意图

![](./Vue.png)
![](./Vue2.0.png)

## 1 \_init 阶段

用户在 `new Vue(options)`时会将用户的数据传递到 vue 内部做处理。

Vue 会调用 `_init` 函数进行初始化

```js
function Vue(options) {
  this._init(options)
}
```

这里的 `init` 过程，它会合并配置，初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。

```js
Vue.prototype._init = function(options) {
  const vm = this
  //1.合并配置（如：用户写的生命周期函数）
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
  initLifecycle(vm) //2.初始化生命周期
  initEvents(vm) //3.初始化事件
  initRender(vm) //4.初始化渲染函数
  callHook(vm, "beforeCreate") //5.使用callHook调用生命周期函数
  initInjections(vm) //6.初始化inject
  initState(vm) //7.初始化data、props、methods、computed、watch
  initProvide(vm) //8.初始化provide
  callHook(vm, "created") //9.使用callHook调用生命周期函数
  if (vm.$options.el) {
    vm.$mount(vm.$options.el) //10.挂载到根节点上
  }
}
```

::: tip
这里重点要看的是`initState`，这个方法会处理用户传入的 props、methods、data、computed、watch。
:::

### 1.1 初始化 data 过程

将用户的数据变成响应式数据，为依赖收集和派发更新做准备

```js
function initState(vm) {
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props) //初始化 props
  if (opts.methods) initMethods(vm, opts.methods) //methods
  if (opts.data) {
    initData(vm) //初始化 data
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed) //初始化 computed
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch) //初始化 watch
  }
}
```

::: tip
这里重点要看的是`initData`，Vue 内部数据进入这里会将数据进行响应式处理，以 data 中的数据简单来说，就是将 data 中的对象添加 get 和 set,变成响应式数据，在访问数据时触发 get 时通过 dep 进行依赖收集，在设置数据时通过 set 进行派发更新。
:::

**initData**：将用户的 data 数据变成响应式数据

- 首先使用 observe 对数据进行观测

```js
function initData(vm) {
  var data = vm.$options.data
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {}
  var keys = Object.keys(data)
  observe(data, true)
}
```

- 然后实例化观测数据

```js
function observe(value, asRootData) {
  var ob
  ob = new Observer(value)
  return ob
}
```

- 最后给每个对象添加侦听器（dep）

```js
export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, "__ob__", this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

::: tip
这里会分别对数组类型的数据和对象类型的数据进行不同的处理，简单的来说对象通过数据劫持，数组通过修改原型上的方法，来拦截相关操作
:::

**数组类型**

```js
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
}
```

**对象类型**

```js
export function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

其中最重要的是通过 `Object.defineProperty` 设置 `setter` 与 `getter` 函数，用来实现「**响应式**」以及「**依赖收集**」，后面会详细讲到，这里只要有一个印象即可。

## 2 \$mount 阶段

前面初始化时我们看到

```
new Vue({ template: "<div>{{ hi }}</div>" }).$mount("#app")
```

new Vue 其实走的是初始化的逻辑，当初始化走完了，就是数据都变成响应式数据后，就开始挂载了【**\$mount**】

我们可以看做是编译的起点

```js
Vue.prototype.$mount = function(el, hydrating) {
  el = el && query(el)
  const options = this.$options
  if (!options.render) {
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  return mount.call(this, el, hydrating)
}
```

如果是运行时编译，即不存在 render function 但是存在 template 的情况，需要进行「**编译**」步骤

compile 编译可以分成

- `parse`
- `optimize`
- `generate`

三个阶段，最终需要得到 render function。

```js
export const createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

### 2.1 parse

`parse`阶段在 parseHTML 时会用正则等方式循环解析 template 模板中的指令、class、style 等数据，形成 AST。

```js
export function parse(template, options) {
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start(tag, attrs, unary) {
      const ns =
        (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      if (isIE && ns === "svg") {
        attrs = guardIESVGBug(attrs)
      }

      let element = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }
      processFor(element)
      processIf(element)
      processOnce(element)
      processElement(element, options)
    },
    end() {
      closeElement(element)
    },
  })
  return root
}
```

### 2.2 optimize

`optimize` 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 `update` 更新界面时，会有一个 `patch` 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能。

```js
export function optimize(root, options) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || "")
  isPlatformReservedTag = options.isReservedTag || no
  markStatic(root)
  markStaticRoots(root, false)
}
```

### 2.3 generate

`generate` 是将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

在经历过 `parse`、`optimize` 与 `generate` 这三个阶段以后，组件中就会存在渲染 VNode 所需的 render function 了。

```js
export function generate(ast, options) {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns,
  }
}
```

## 3 mount 阶段

此阶段分为几个小阶段：

- 3.1 new Watch：将每个组件用 Watch 进行实例化，执行过程中，会将 Watch 实例放到一个类似全局变量上。
- 3.2 \_render：执行 render 函数，首先会访问 data 中用户的数据触发 get 方法，配合 Dep 进行依赖的收集，此时之前定义的响应式数据中的 Dep 实例内部的数组中会存储这个 Watch 实例，这样数据和模板就关联起来了，其次生成 Vnode 实例为后续更新 dom 提供参数
- 3.3 \_update：将 vnode 通过 path 派发到 dom 上
  在\$mount 中执行到了最后会以 mount.call 的形式调用之前缓存在 mount 中的方法，进入此代码执行环境

### 3.1 new Watch

首先会通过执行`mountComponent`进入组件挂载逻辑，依次执行以下比较重要的逻辑

- mountComponent
  - callHook(vm, 'beforeMount')：执行生命周期`beforeMount`中的事件
  - new Watcher(vm, updateComponent, noop, null, true /_isRenderWatcher _/)
  - callHook(vm, 'mounted')：执行生命周期`mounted`中的事件

其中 new Watcher 是重点, updateComponent 是一个函数

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

其在实例化过程中：

- 1 this.getter = updateComponent
- 2 this.get(): get 是 Watch 上的一个方法，实例化会自动调用 get
- pushTarget(this)：Dep.target=this(也就是 Watch 实例自己)，方便在实例化组件 Watch 时，其他地方能拿到这个 Watch 实例，全局有且仅有一个
- this.getter.call(vm, vm)：也就是 updateComponent()
- popTarget()：Dep.target=null
- this.cleanupDeps()：清除 Watch 内部数组存储的 Dep 实例

### 3.2 \_render

Watch 实例化过程中 get 中执行 updateComponent，会将 vm.\_render()执行，然后

```js
vnode = render.call(vm._renderProxy, vm.$createElement)
```

其中的 render 就是 jsx 语法的 render 函数，继续下去会通过以下几步：

```js
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
```

创建原生标签 vnode

```js
vnode = createComponent(Ctor, data, context, children, tag)
```

```js
vnode = new VNode(tag, data, children, undefined, undefined, context)
```

### 3.3 \_update

```js
vm.$el = vm.__patch__(prevVnode, vnode)
```

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

```js
const patch = createPatchFunction({ nodeOps, modules })
```

执行 patch 方法

```js
createElm(vnode, insertedVnodeQueue, parentElm, refElm)
```

将 Vnode 插入到页面中

```js
insert(parentElm, vnode.elm, refElm)
```

总结：

页面的初始化阶段几步就是这几步：

首先初始化参数，目的是将普通对象数据转换为响应式数据，这样访问数据会触发 get 方法，修改数据会触发 set 方法，当模板中的数据第一次访问时，在 get 中用变量将这个模板记录下来，下次更新数据触发 set 方法时，可以通知之前记录下来的模板更新数据

然后编译 template，目的是将 template 转换成 render 函数，因为 template 中的语法浏览器是不识别的必须转为通用的语法形式（如：jsx）；然后将其传入 Watch 进行实例化，目的是实例化过程中会执行 render 方法，访问 data 中的数据触发 get 方法完成依赖收集，这样 data 和模板就建立联系了

最后将 render 转换成 Vnode，通过 path 方法插入到 dom 中

<Vssue />
