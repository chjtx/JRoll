#JRoll2

##概述

###说明
JRoll，一款能滚起上万条数据，具有滑动加速、回弹、缩放、滚动条、滑动事件等功能，兼容CommonJS/AMD/CMD模块规范，开源，免费的轻量级html5滚动插件。

JRoll 2 是在JRoll第一版基础上重写JRoll滑动算法，基于时间运动，解决帧频降低时滑动缓慢的问题，更改垂直水平方向判断方法，使捕获垂直水平方向更准确灵敏。

JRoll 2 增减了一些api不完全兼容JRoll 1。

###兼容性
本插件专为移动应用度身设计，目前已测试通过的手机系统有：android4.1/4.2/4.3/4.4/5.0/6.0和ios6/7/8/9，欢迎网友对其它机型进行测试反馈。

为使本插件最轻量化，JRoll 2 不兼容PC浏览器，因此强烈建议使用谷歌浏览器模拟器进行开发。

###引入
普通方式引入
```
<script src='jroll.js'></script>
```

CommonJS规范引入
```
var JRoll = require('jroll.js');
```

AMD规范引入（requireJS）
```
require(['jroll'], function(JRoll) {
    ...
});
```

CMD规范引入（seaJS）
```
seajs.use('jroll', function(JRoll) {
    ...
});
```

###简单例子
```
//html代码
<div id="wrapper">
    <ul id="scroller">
        <li>有一美人兮，见之不忘。</li>
        <li>一日不见兮，思之如狂。</li>
        <li>凤飞翱翔兮，四海求凰。</li>
        <li>无奈佳人兮，不在东墙。</li>
        <li>将琴代语兮，聊写衷肠。</li>
        <li>何日见许兮，慰我彷徨。</li>
        <li>愿言配德兮，携手相将。</li>
        <li>不得於飞兮，使我沦亡。</li>
    </ul>
</div>

//css代码
ul {margin: 0; padding: 0;}
li {line-height: 24px; margin-left: 24px;}
#wrapper {width: 200px; height: 100px; border: 1px solid;}

//javascript代码
new JRoll("#wrapper");
```

※ 要使JRoll滚起来需要注意以下几点
- wrapper的高度需要小于scroller高度
- JRoll虽然可以滚起上万条数据，但仅限于普通标签节点和文本节点，如果图片过多或过大，都会占用过多内存而导致卡顿。
- wrapper的padding不为0，scroller的margin不为0，否则都有可能导致计算错误，scroller内容显示不全

##使用

###如何使用
```
var jroll = new JRoll(selector [, options]);
```
selector是容器，可以是id选择器字符串#wrapper，也可以是dom对象document.getElementById('wrapper')，第二个参数是可选对象，该参数内容决定了创建一个怎样的JRoll对象

例：创建一个带垂直滚动条的对象
```
var jroll = new JRoll("#wrapper", {scrollBarY:true});
```
保存了JRoll对象后，可动态对部分可选参数进行修改
例：禁止回弹
```
jroll.options.bounce = false;
```

###可选参数
|可选值	|默认值	|说明 |
|----------|----------|----------|
|id	|[随机生成]	|id，jroll对象的唯一标记，建议手动提供id，方便在全局JRoll.jrollMap访问指定jroll对象，不提供时系统自动创建。|
|scrollX	|false	|使能水平滑动`可动态修改`|
|scrollY	|true	|使能垂直滑动`可动态修改`|
|scrollFree	|false	|使能自由滑动，默认情况下，x方向在滑动时，y方向不能滑动，相反亦然，如果应用于对图片进行放大滑动，可将此参数设为true`可动态修改`|
|minX	|0	|向左滑动的边界值`可动态修改`|
|maxX	|[负scroller的宽]	|向右滑动的边界值`可动态修改`|
|minY	|0	|向下滑动的边界值`可动态修改`|
|maxY	|[负scroller的高]	|向上滑动的边界值`可动态修改`|
|zoom	|false	|使能缩放`可动态修改`|
|zoomMin	|1.0	|最小缩放倍数`可动态修改`|
|zoomMax	|4.0	|最大缩放倍数`可动态修改`|
|bounce	|true	|允许回弹`可动态修改`|
|scrollBarX	|false	|开启水平滚动条|
|scrollBarY	|false	|开启垂直滚动条|
|scrollBarFade	|false	|滚动条使用渐隐模式|
|preventDefault	|true	|禁止touchmove默认事件|
|momentum	|true	|开启滑动加速，惯性过渡`可动态修改`|
|autoStyle	|true	|自动为wrapper和scroller添加样式|
| ~~adjustTop~~	|~~190~~ |从JRoll v2.2.0版本开始，JRoll删除了adjustTop选项，自动调整安卓机输入框位置的功能抽离到jroll-fixedinput.js里。~~安卓手机弹出软键盘时自动调整输入框位置，作者不建议使用该项，如遇软键盘遮挡输入框的情况，建议重新设计表单页面。参考：WebAPP输入框被软键盘遮挡肿么办？~~|
|scroller	|[wrapper的第一个子元素]	|指定scroller，不可动态更改，可以是id选择器字符串#scroller，也可以是dom对象document.getElementById('scroller')|

###属性
- id，JRoll对象的唯一标识符。
```
var jroll = new JRoll("#wrapper");
console.log(jroll.id);
```

- jrollMap，对象，JRoll对象集合，保存了当前页面的所有JRoll对象。
```
console.log(JRoll.jrollMap);
```

###方法
- refresh `支持链式调用`
当scroller或wrapper的高度发生变化时，需要用此方法对JRoll对象进行刷新
```
var jroll = new JRoll("#wrapper");
    //do something，例：动态修改scroller的内容，使scroller的高度发生变化
    jroll.refresh(); 
```

- scrollTo `支持链式调用`
该方法用于移动scroller，共五个参数，第一个参数是x偏移量（必填），第二个是y偏移量（必填），第三个是滑动时间（可选，单位ms)，第四个是是否允许超出边界（可选，true/false），第五个回调方法。如果想获取当前x,y偏移量，可直接输出jroll.x和jroll.y
```
var jroll = new JRoll("#wrapper");
    //200ms内滑动到0px, -100px位置
    jroll.scrollTo(0, -100, 200);
    //允许超出边界
    jroll.scrollTo(100, 100, 0, true);
    //回调
    jroll.scrollTo(0, 100, 400, false, function() {
        //滑动结束后执行
    });
```

- enable `支持链式调用`
使能滑动，使用disable禁止滑动后可用该方法重新开启
```
jroll.enable();
```

- disable `支持链式调用`
使不能滑动
```
jroll.disable(); 
```

- destroy
销毁jroll对象
```
jroll.destroy();
```

- scale `支持链式调用`
缩放，只接受一个整型/浮点型参数
```
//放大1.5倍
jroll.scale(1.5);
```

- call
在滑动时中转移对象，返回转移给的对象。适合于嵌套滑动时内层滑动到末尾开始滑动外层的场景。
```
/* 例：
 * jroll1在外层，包裹jroll2
 * jroll2在滑动到达指定条件时将滚动权交给jroll1
 */
var pos;
var jroll1 = new JRoll("#wrapper", {bounce:true});
var jroll2 = new JRoll("#inner", {bounce:true});
    jroll2.on("scrollStart", function() {
        pos = this.y;
    });
    jroll2.on("scroll", function(e) {
        if ((this.y-pos > 0 && pos === 0) || (this.y-pos < 0 && pos === this.maxScrollY)) {
            jroll2.call(jroll1, e); //返回jroll1
        }
    });
```

###事件
JRoll一共提供8个事件，每个事件都可多次添加行为

- scrollStart
滑动开始时执行
```
jroll.on("scrollStart", function() {
    console.log(this.x); //输出当前x偏移量，this指向jroll对象
});                                  
```

- scroll
滑动过程中执行
```
jroll.on("scroll", function() {
    //该干嘛干嘛去...
});                                  
```

- scrollEnd
滑动结束时执行
```
jroll.on("scrollEnd", function() {
    //该干嘛干嘛去...
});
```                                  
                
- touchEnd
用户释放手指时执行，早于scrollEnd晚于scroll事件
```
jroll.on("touchEnd", function() {
    //该干嘛干嘛去...
});
```                                   
                
- zoomStart
开始缩放时执行
```
jroll.on("zoomStart", function() {
    //该干嘛干嘛去...
});
```                                  
                
- zoom
缩放过程中执行
```
jroll.on("zoom", function() {
    //该干嘛干嘛去...
});
```                                  
                
- zoomEnd
缩放结束后执行
```
jroll.on("zoomEnd", function() {
    //该干嘛干嘛去...
});
```                                 
                
- refresh
使用jroll.refresh()刷新后执行
```
jroll.on("refresh", function() {
    //该干嘛干嘛去...
});
```