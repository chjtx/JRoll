# JRoll调整输入框位置组件

## 说明

从JRoll v2.2.0版本开始，JRoll删除了adjustTop选项，自动调整安卓机输入框位置的功能抽离到jroll-fixedinput.js里。fixedinput会将focusin事件绑定到wrapper上，可使wrapper里被遮挡的input/textarea在focus时能自动上移到可见位置（屏幕上半部分）。

## 引入

普通方式引入

```html
<script src="jroll.js"></script>
<script src="jroll-fixedinput.js"></script>
```

CommonJS规范引入

```js
var JRoll = require('jroll.js');
require('jroll-fixedinput.js'); //不需要赋给变量，运行就好了

var jroll = new JRoll("#wrapper");
jroll.fixedinput(); //使该JRoll对象里的input/textarea在focus时能自动上移到可见位置
```

AMD规范引入（requireJS）

```js
//配置jroll-fixedinput依赖jroll
require.config({
    baseUrl: './',
    paths: {
        'jroll-fixedinput': 'js/jroll-fixedinput'
    }
    shim: {
        'jroll-fixedinput': {
            deps: ['jroll'] //jroll.js的路径
        }
    }
});

define(['jroll-fixedinput'], function(JRoll) {
    //jroll-fixedinput将会返回JRoll，因此不需要单独引入jroll.js
    var jroll = new JRoll("#wrapper");

    jroll.fixedinput(120); //上移到离wrapper底部120px处

    //jroll.fixedinput(120, true);
    //两个可选参数，当第2个参数为true时，scroller里的input/textarea的tabIndex将会设为-1，
    //第2个参数用于解决当IOS设备input/textarea比较多时用户使用tab键切换输入框导致页面错位的bug
});
```

## 更新日志

v1.1.0 (2017-03-15)

- 修改默认位移位置，只移动位于下半屏的input，如果input位于上半屏将不会自动移动input的位置
- `jroll.fixedinput(100)`所带的参数由原来是距离顶部位置改为距离底部的位置

v1.0.3 (2017-02-16)

- 修复input的type为submit/reset/radio等时页面仍移动的问题

v1.0.2 (2016-11-08)

- 修复在聚焦情况下点击输入框没触发自动调整位置的问题

v1.0.1 (2016-07-29)

- 区分处理Android和IOS

v1.0.0 (2016-07-24)

- 发布v1.0.0
