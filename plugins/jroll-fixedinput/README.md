# JRoll调整输入框位置组件

## 说明
从JRoll v2.2.0版本开始，JRoll删除了adjustTop选项，自动调整安卓机输入框位置的功能抽离到jroll-fixedinput.js里。fixedinput会将focusin事件绑定到wrapper上，可使wrapper里的input/textarea在focus时能自动上移到离wrapper默认10px处，可通过传入参数修改默认距离`jroll.fixedinput(20)`。

## 引入
普通方式引入
```
<script src="jroll.js"></script>
<script src="jroll-fixedinput.js"></script>
```

CommonJS规范引入
```
var JRoll = require('jroll.js');
require('jroll-fixedinput.js'); //不需要赋给变量，运行就好了

var jroll = new JRoll("#wrapper");
jroll.fixedinput(); //使该JRoll对象里的input/textarea在focus时能自动上移到可见位置
```

AMD规范引入（requireJS）
```
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

    jroll.fixedinput(20); //上移到离wrapper顶部20px处

    //jroll.fixedinput(20, true);
    //两个可选参数，当第2个参数为true时，scroller里的input/textarea的tabIndex将会设为-1，
    //第2个参数用于解决当input/textarea比较多时用户使用tab键切换输入框导致页面错位的bug
});
```
