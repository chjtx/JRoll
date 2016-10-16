# JRoll下拉组件

## 说明

JRoll的下拉组件jroll-pulldown.js，依赖JRoll2，必须要先加载jroll.js。为了不占用太多的全局变量，该组件以JRoll原型链的一个方法形式存在，只要运行过jroll-pulldown.js即可给JRoll的实例调用。

## 引入

普通方式引入

```html
<script src="jroll.js"></script>
<script src="jroll-pulldown.js"></script>
```

CommonJS规范引入

```js
var JRoll = require('jroll.js');
require('jroll-pulldown.js'); //不需要赋给变量，运行就好了

var jroll = new JRoll("#wrapper");
jroll.pulldown(); //使能下拉刷新，具体配置详见下文
```

AMD规范引入（requireJS）

```js
//配置jroll-pulldown依赖jroll
require.config({
    baseUrl: './',
    paths: {
        'jroll-pulldown': 'js/jroll-pulldown'
    }
    shim: {
        'jroll-pulldown': {
            deps: ['jroll'] //jroll.js的路径
        }
    }
});

define(['jroll-pulldown'], function(JRoll) {
    //jroll-pulldown将会返回JRoll，因此不需要单独引入jroll.js
    var jroll = new JRoll("#wrapper");
    jroll.pulldown(); //使能下拉刷新，具体配置详见下文
});
```

## 使用

创建JRoll实例，调用pulldown方法使能下拉刷新

```js
var jroll = new JRoll("#wrapper");
jroll.pulldown({
    refresh: function(complete) {
        //完成加载数据的操作后回调执行complete方法
        complete();
    }
});
```

## 选项

| 选项 | 默认值 | 必填 | 说明 |
|----------|----------|----------|----------|
| iconArrow | [自带箭头图片] | N | 下拉过程中的箭头图标 |
| iconLoading | [自带刷新图片] | N | 刷新过程中的图标 |
| iconFinish | [自带完成图片] | N | 刷新完成后显示的图标 |
| textPull | 下拉刷新 | N | |
| textRelease | 释放刷新 | N | |
| textLoading | 正在加载 | N | |
| textFinish | 刷新完成 | N | |
| spinning | true | N | 控制刷新时是否旋转icon |
| refresh | null | Y | 刷新过程中执行的方法，必填，且最后必须执行传给refresh的方法来复位刷新 |

