官网地址：[http://www.chjtx.com/JRoll/](http://www.chjtx.com/JRoll/)

# 醉萝卜 JRoll

> My English is very poor, but this does not affect my heart to communicate with the world, thanks for Google translation

看视频了解更多：<a href="https://v.youku.com/v_show/id_XMzk1MDY5MjIxMg==.html" target="_blank">JRoll大烩[捂脸]</a><br/>
视频相关PPT下载：<a href="http://www.chjtx.com/JRoll/JRoll视频.pptx" download="JRoll视频.pptx">JRoll视频.pptx</a>

## 先睹为快 Preview

手机扫二维查看示例

Use the phone to scan the QR code to see the example

<img width="160" height="160" src="http://www.chjtx.com/JRoll/demos/images/qrcode.png">

[http://www.chjtx.com/JRoll/demos/](http://www.chjtx.com/JRoll/demos/)

**注意：** JRoll是独立插件，不需要依赖任何第三方库，Demo代码上引入了FastClick库是为了演示JRoll能和FastClick配合使用，因为IScroll5开启click:true后在IOS上与FastClick一起使用会导致单击事件需要双击才能触发的问题，与之对比JRoll不会有这个问题。

**Notice:** JRoll does not need to rely on any third party libraries.

## 运行示例 Run Demos

```shell
#克隆仓库 Clone repository
git clone https://github.com/chjtx/JRoll.git

#进入项目 Go into project
cd JRoll

#安装express Install express
npm install -g express

#如果用苹果电脑，需要加sudo
#If on mac, use sudo
sudo npm install -g express

#运行 Run
node server.js
```

然后在浏览器打开 `localhost:3020/demos/`

And then open the `localhost:3020/demos/` in the browser



## 概述 Overview

### 说明 Description

JRoll，一款能滚起上万条数据，具有滑动加速、回弹、缩放、滚动条、滑动事件等功能，兼容CommonJS/AMD/CMD模块规范，开源，免费的轻量级html5滚动插件。

JRoll第二版是在JRoll第一版基础上重写JRoll滑动算法，基于时间运动，解决帧频降低时滑动缓慢的问题，更改垂直水平方向判断方法，使捕获垂直水平方向更准确灵敏。

JRoll第二版增减了一些api不完全兼容JRoll第一版。

JRoll is a lightweight, lightweight HTML5 scroll plugin compatible with the CommonJS / AMD / CMD module specification, open source, free slideshow, scroll acceleration, resizing, scrolling, and slide events.

JRoll second edition is based on the first version of JRoll, sliding algorithm rewrite, based on time movement, to solve the problem of slow sliding frame rate, change the vertical and horizontal direction to determine the direction of the vertical and horizontal capture more accurate and sensitive.

JRoll Second Edition adds some APIs that are not fully compatible with JRoll first edition.

### 兼容性 compatibility

- [x] IOS 6+
- [x] Android 4.0+
- [x] Chrmoe
- [x] Firefox
- [x] IE 9+

> 注意：JRoll专为移动应用度身设计，对PC浏览器的兼容只为方便开发调试，没作过多处理，因此强烈建议使用谷歌浏览器模拟器进行开发，在移动端使用。

> Note: In order to make this plugin lightweight, JRoll PC browser compatible only to facilitate the development of debugging, not to do too much processing, it is strongly recommended to use the Google browser simulator for development, please use in the mobile side.

> 在UC浏览器上表现较差，作者已将UC浏览器定义为资讯类应用，非专业浏览器，不会专门去兼容它。

> Will not specifically go too compatible with the old browser

### 引入 Import

npm
```bash
npm install jroll --save
```

普通方式引入
```html
<script src='jroll'></script>
```

CommonJS规范引入
```js
var JRoll = require('jroll');
```

AMD规范引入（requireJS）
```js
require(['jroll'], function(JRoll) {
    ...
});
```

CMD规范引入（seaJS）
```js
seajs.use('jroll', function(JRoll) {
    ...
});
```

### 简单例子 Simple example
```html
<!-- html代码 -->
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

<!-- css代码 -->
<style>
ul {margin: 0; padding: 0;}
li {line-height: 24px; margin-left: 24px;}
#wrapper {width: 200px; height: 100px; border: 1px solid;}
</style>

<!-- javascript代码 -->
<script>
new JRoll("#wrapper");
</script>
```


## 使用 Use

### 如何使用 How to use

```js
var jroll = new JRoll(selector [, options]);
```
selector是容器，可以是id选择器字符串#wrapper，也可以是dom对象document.getElementById('wrapper')，第二个参数是可选对象，该参数内容决定了创建一个怎样的JRoll对象

The `selector` is a container, either an id selector string `#wrapper` or a dom object `document.getElementById ( 'wrapper')`. The second argument is an optional object that determines how a JRoll instance is created.

例：创建一个带垂直滚动条的对象

Example: Create an instance with a vertical scroll bar

```js
var jroll = new JRoll("#wrapper", {scrollBarY:true});
```

保存了JRoll对象后，可动态对部分可选参数进行修改

Save the JRoll instance, you can dynamically modify some of the optional parameters

例：禁止回弹

Example: No rebound

```js
jroll.options.bounce = false;
```

### 可选参数 Options

:white_check_mark: 表示可动态修改

:white_check_mark: Means that can be dynamically modified

|可选值 Key |默认值 Default Value|说明 Description |
|----------|----------|----------|
|id	|*[随机生成]*<br/>*[Randomly generated]*	|id，jroll对象的唯一标记，建议手动提供id，方便在全局JRoll.jrollMap访问指定jroll对象，不提供时系统自动创建。<br/>Id, the unique identifier of the JRoll instance, it is recommended to manually provide id, convenient access to the specified  JRoll instance in global JRoll.jrollMap, if haven't the system will automatically created.|
|scrollX	|false	|使能水平滑动 :white_check_mark:<br/>Enable horizontal sliding |
|scrollY	|true	|使能垂直滑动 :white_check_mark:<br/>Enable vertical sliding|
|scrollFree	|false	|使能自由滑动，默认情况下，x方向在滑动时，y方向不能滑动，相反亦然，如果应用于对图片进行放大滑动，可将此参数设为true :white_check_mark:<br/>By default, the y direction does not slide when the x direction is sliding, and vice versa. If you apply zooming to a picture, you can set this parameter to true|
|minX	|0	|向左滑动的边界值 :white_check_mark:<br/>The boundary value to the right|
|maxX	|*[负scroller的宽]*<br/>*[-scroller's width]*|向右滑动的边界值 :white_check_mark:<br/>The boundary value to the left|
|minY	|0	|向下滑动的边界值 :white_check_mark:<br/>The boundary value to the up|
|maxY	|*[负scroller的高]*<br/>*[-scroller's height]*|向上滑动的边界值 :white_check_mark:<br/>The boundary value to the down|
|zoom	|false	|使能缩放 :white_check_mark:<br/>Enable scaling|
|zoomMin	|1.0	|最小缩放倍数 :white_check_mark:<br/>Minimum zoom factor|
|zoomMax	|4.0	|最大缩放倍数 :white_check_mark:<br/>Maximum zoom factor|
|bounce	|true	|允许回弹 :white_check_mark:<br/>Allow the rebound|
|scrollBarX	|false	|开启水平滚动条，滚动页面超过两横屏时才会出现滚动条<br/>Open the horizontal scroll bar|
|scrollBarY	|false	|开启垂直滚动条，滚动页面超过两竖屏时才会出现滚动条<br/>Open the vertical scroll bar|
|scrollBarFade	|false	|滚动条使用渐隐模式<br/>The scroll bar uses fade mode|
|preventDefault	|true	|禁止touchmove默认事件<br/>Disables the touchmove default event|
|momentum	|true	|开启滑动加速，惯性过渡 :white_check_mark:<br/>Open sliding acceleration, inertial transition|
|autoStyle	|true	|自动为wrapper和scroller添加样式<br/>Automatically adds styles to the wrapper and scroller|
|autoBlur   |true   |v2.4.3新增，在滑动时自动将input/textarea失焦收起软键盘。设为false将会在IOS上出现光标不跟随输入框移动的现象|
| ~~adjustTop~~	|~~190~~ |从JRoll v2.2.0版本开始，JRoll删除了adjustTop选项，自动调整安卓机输入框位置的功能抽离到jroll-fixedinput.js里。~~安卓手机弹出软键盘时自动调整输入框位置，作者不建议使用该项，如遇软键盘遮挡输入框的情况，建议重新设计表单页面。参考：WebAPP输入框被软键盘遮挡肿么办？~~|
|scroller	|*[wrapper的第一个子元素]*<br/>*[Wrapper's first child element]*|指定scroller，不可动态更改，可以是id选择器字符串`#scroller`，也可以是dom对象`document.getElementById('scroller')`<br/>Specified scroller, can not be dynamically changed, can be id selector string `#scroller`, or can be dom `document.getElementById ( 'scroller')`|
|edgeRelease |true | v2.4.7新增，边缘释放，滑动到上下边界自动结束，解决手指滑出屏幕没触发touchEnd事件的问题。如果手指滑动屏幕的速度过快该选项并不一定起作用 |

### 属性 Attributes

- id，JRoll对象的唯一标识符。
- id -> the unique identifier for the JRoll instances.

```js
var jroll = new JRoll("#wrapper");
console.log(jroll.id);
```

- jrollMap，对象，JRoll对象集合，保存了当前页面的所有JRoll对象。
- jrollMap -> object, JRoll instances collection, the current page to save all the JRoll instances.

```js
console.log(JRoll.jrollMap);
```

### 方法 Method

:link: 表示支持链式调用

:link: Means that chained calls are supported

- [refresh](#refresh--link)
- [scrollTo](#scrollto--link)
- [enable](#enable--link)
- [disable](#disable--link)
- [destroy](#destroy)
- [scale](#scale--link)
- [call](#call)

#### refresh  :link:

当scroller或wrapper的高度发生变化时，需要用此方法对JRoll对象进行刷新

When the height of the scroller or wrapper changes, you need to use this method to refresh the JRoll instance

```js
var jroll = new JRoll("#wrapper");
    //do something，例：动态修改scroller的内容，使scroller的高度发生变化
    jroll.refresh();
```

#### scrollTo  :link:

该方法用于移动scroller，共五个参数，第一个参数是x偏移量（必填），第二个是y偏移量（必填），第三个是滑动时间（可选，单位ms)，第四个是是否允许超出边界（可选，true/false），第五个回调方法。如果想获取当前x,y偏移量，可直接输出jroll.x和jroll.y

The method is used to move the scroller. The first parameter is the x offset (required), the second is the y offset (required), and the third is the sliding time (optional, unit Ms), the fourth is whether to allow out of bounds (optional, true / false), and the fifth callback method. If you want to get the current x, y offset, you can directly output jroll.x and jroll.y

```js
jroll.scrollTo(x, y [, duration , bool, callback])
```
```js
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

### scrollToElement  :link:

```js
jroll.scrollToElement(selector[, duration , bool, callback])
```

滑动到指定元素，第一个参数为字符串或dom元素（必填且必须是scroller的子元素），第二个参数为时间（可选），第三个是是否允许超出边界（可选，true/false），第四个回调方法（可选）

```js
var jroll = new JRoll("#wrapper")
jroll.scrollToElement("#el", 300, false, function () { ... })
```

#### enable  :link:

使能滑动，使用disable禁止滑动后可用该方法重新开启

Enable the slide, use disable to disable the method can be re-opened after sliding

```js
jroll.enable();
```

#### disable  :link:

使不能滑动

So that it can not slide

```js
jroll.disable();
```

#### destroy

销毁jroll对象

Destroy the jroll instance

```js
jroll.destroy();
```

#### scale  :link:

缩放，只接受一个整型/浮点型参数

Scaling, only accept an integer / floating-point parameters

```js
//放大1.5倍
jroll.scale(1.5);
```

#### call

在滑动时中转移对象，返回转移给的对象。适合于嵌套滑动时内层滑动到末尾开始滑动外层的场景。

When the instance is moved in the slide, the instance to which it is transferred is returned. Suitable for nested sliding when the inner layer slides to the end to start sliding the outer layer of the scene.

```js
/* 例：
 * jroll1在外层，包裹jroll2
 * jroll2在滑动到达指定条件时将滚动权交给jroll1
 */
 /* Example:
 * Jroll1 in the outer layer, wrapped jroll2
 * Jroll2 scrolls to jroll1 when the specified condition is reached
 */
var pos;
var jroll1 = new JRoll("#wrapper", {bounce:true});
var jroll2 = new JRoll("#inner", {bounce:true});
    jroll2.on("scrollStart", function() {
        pos = this.y;
    });
    jroll2.on("scroll", function(e) {
        if ((this.y-pos > 0 && pos === 0) || (this.y-pos < 0 && pos === this.maxScrollY)) {
            //返回jroll1
            //Transfer to jroll1
            jroll2.call(jroll1, e);
        }
    });
```

### 事件 Events

JRoll一共提供8个事件，每个事件都可多次添加行为。事件里的this指向jroll对象。

JRoll provides a total of eight events, each of which can add behavior multiple times. The "this" in the event points to the jroll instance.

- [scrollStart](#scrollstart)
- [scroll](#scroll)
- [scrollEnd](#scrollend)
- [touchEnd](#touchend)
- [zoomStart](#zoomstart)
- [zoom](#zoom)
- [zoomEnd](#zoomend)
- [refresh](#refresh)

#### scrollStart

滑动开始时执行

Slide starts when executed

```js
jroll.on("scrollStart", function() {
    //输出当前x偏移量，this指向jroll对象
    //Outputs the current x offset, this points to the jroll instance
    console.log(this.x);
});
```

#### scroll

滑动过程中执行

The sliding process is performed

```js
jroll.on("scroll", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### scrollEnd

滑动结束时执行

When the end of the sliding implementation

```js
jroll.on("scrollEnd", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### touchEnd

用户释放手指时执行，早于scrollEnd晚于scroll事件

Executed when the user releases a finger, before the scroll end is later than the scroll event

```js
jroll.on("touchEnd", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### zoomStart

开始缩放时执行

Executes when scaling begins

```js
jroll.on("zoomStart", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### zoom

缩放过程中执行

Scaling is performed during zooming

```js
jroll.on("zoom", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### zoomEnd

缩放结束后执行

Scaling is performed

```js
jroll.on("zoomEnd", function() {
    //该干嘛干嘛去...
    //todo something
});
```

#### refresh

使用`jroll.refresh()`刷新后执行

Use `jroll.refresh()` to refresh the implementation

```js
jroll.on("refresh", function() {
    //该干嘛干嘛去...
    //todo something
});
```

## 进阶 Advanced

### 使用 scroller div 的 jroll 属性获取JRoll对象 Use the attribute jroll to get the JRoll instance

每个scroller都有索引指向其本身的jroll的

```html
<div id="w">
  <div id="s"></div>
</div>
<script>
var jroll = new JRoll('#w')
document.getElementById('s').jroll === jroll // true
</script>
```

### 使用this.s判断当前滑动状态 Use `this.s` to determine the current sliding state

```js
var jroll = new JRoll("#wrapper");
jroll.on("scroll", function() {
    if (this.s === "scrollY") {
        //干点你想干的事情
        //todo something
    } else {
        //或者干点别的事情
        //todo order something
    }
})
```

`jroll.s`中的s表示status，6种可能取值

1. `null` 初始状态，未进行任何滑动操作
2. `preScroll` 准备开始滑动
3. `preZoom` 准备开始缩放
4. `scrollX` 正在进行横向滑动
5. `scrollY` 正在进行竖向滑动
6. `scrollFree` 正在进行横竖方向滑动

The `jroll.s` represents status, and six possible values

1. `null` The initial state, without any sliding operation
2. `preScroll` Ready to start sliding
3. `preZoom` Ready to start zooming
4. `scrollX` Sliding is in progress
5. `scrollY` Vertical sliding is in progress
6. `scrollFree` Slide in the vertical and horizontal direction

> 注意：JRoll v2.3.0以下版本的min压缩文件的jroll.s值用1、2、3、4、5表示preScroll、preZoom、scrollX、scrollY、scrollFree。在JRoll v2.3.0版本开始与未压缩版保持一致，当初真不应该为了节省那丁点字节取用数字压缩的。

> Note: JRoll v2.3.0 the following min compressed file jroll.s values 1,2,3,4,5 said preScroll, preZoom, scrollX, scrollY, scrollFree. In the beginning of JRoll v2.3.0 and uncompressed version of the original line should not be saved in order to save the number of bytes to use digital compression.

### 判断是否滑动到底部 Determine whether to slide to the bottom

```js
var jroll = JRoll("#wrapper");
jroll.on("scrollEnd", function() {
    if (this.y === this.maxScrollY) {
        console.log("已滑动到底部");
    }
});
```

有关jroll对象更多的属性请自行在浏览器控制台输出jroll对象查看。

For more information about the properties of the jroll instance, look for the jroll instance in your browser's console output.

### 自定义滚动条样式 Customize the scrollbar style

只要scrollBarX/scrollBarY的值为字符串，即为开启自定义滚动条，需要自己写样式。

As long as the scrollBar / scrollBar Y value for the string, that is, open the custom scroll bar, you need to write their own style.

滚动条对样式定位有些特殊要求，自定义滚动条大小、颜色时需要先将默认样式拷贝下来，再对 .jroll-ybar/.jroll-xbar 和 .jroll-ybtn/.jroll-xbtn 进行修改。

The scroll bar has some special requirements for style positioning. To customize the scroll bar size and color, you need to copy the default style first, then modify the .jroll-ybar / .jroll-xbar and .jroll-ybtn / .jroll-xbtn.

```js
var jroll = new JRoll("#wrapper", {
        scrollBarY: "custom",
        scrollBarFade: true
    });
```

### 解决某些安卓机无法滑动非播放状态的\<video\> Resolve some Android machines can not slide non-play state of the \<video\>

如果您的页面需要播放视频，在某些安卓机下无法滑动\<video\>，可用以下方法解决。

If your page needs to play video, you can not swipe \<video\> under certain Android devices, you can use the following methods to solve.

非播放状态的\<video\>其表现像controls一样无法捕获touchstart等事件，因此无法使用JRoll滑动，可使用透明div解决。


Non-play state of its performance as controls like controls can not capture touchstart and other events, it can not use JRoll sliding, transparent div can be resolved.

```html
<div id="parent">
    <video id="video" controls="controls">
        <source src="./video.ogg" type="video/ogg">
    </video>
    <div class="fixed-video-scroll"></div>
</div>
<script>
var video = document.getElementById("video");
document.addEventListener("click", function(e) {
    if (e.target.className === "fixed-video-scroll") {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
})
</script>
```

1. 使#parent为相对定位，video的宽度为100%，高度可自动也可自己计算
2. div.fixed-video-scroll绝对定位，覆盖video，高度为video的高度减去44px，确保不会遮挡controls
3. 添加事件，点击div.fixed-video-scroll时执行播放或暂停操作

>

1. Make #parent relative positioning, video width of 100%, height can also be calculated automatically
2. `div.fixed-video-scroll` absolute positioning, covering video, the height of the height of video minus 44px, to ensure that will not obscure controls
3. To add an event, click on `div.fixed-video-scroll` to play or pause


### 关于被软键盘遮挡input输入框的问题 On the soft keyboard to block input box problem

评论框贴在底部随着软键盘升起而升起的功能似乎很受客户青睐，这一需求使用H5技术实现很是力不从心，fixed定位失效，第三方输入法不改变window高度致使input被遮挡，IOS自动移动input到错误位置等等问题成了最大的阻力。

Comments box attached to the bottom of the soft keyboard with the rise of the function seems to be very popular with customers, the demand for using H5 technology is very powerless, fixed positioning failure, third-party input method does not change the window height resulting in input is blocked, IOS automatically move input to the wrong location, and so the problem has become the greatest resistance.

现时比较可行的解决方案有：

At present, the more feasible solutions are:

1. 点击评论时弹出浮动窗，使输入框位于上半屏。
2. 切换到新页面进行输入操作。

>

1. Click on the comment pop-up floating window, so that the input box in the upper half screen.
2. Switch to a new page for input.

这两种设计方案都巧妙地避开了输入框被软键盘遮挡的情况，可参考这篇文章[WebAPP输入框被软键盘遮挡肿么办？](https://my.oschina.net/cjlice/blog/625526)

These two designs are clever to avoid the input box is the case of the soft keyboard block, you can refer to this article [WebAPP输入框被软键盘遮挡肿么办？](https://my.oschina.net/cjlice/blog/625526)

JRoll使用translate3d滑动页面，可监听input聚焦事件，使用scrollTo方法将输入框移动到可见位置，在Android机上可解决被遮挡的问题，详见[jroll-fixedinput组件](https://github.com/chjtx/JRoll/tree/master/extends/jroll-fixedinput)

JRoll uses the translate3d to scroll through the page, listen for input focus events, use the scrollTo method to move the input box to the visible position, and solve the occluded problem on Android. look [jroll-fixedinput组件](https://github.com/chjtx/JRoll/tree/master/extends/jroll-fixedinput)

IOS设备会自动调整输入框位置，尽管有时这个位置并不是我们想要的。很遗憾的是还没找到H5禁止IOS自动移动input位置的方法。

The IOS device automatically adjusts the position of the input box, although sometimes this position is not what we want. Unfortunately I have not found H5 IOS automatic movement of the importation of prohibited positions.


## 特别鸣谢 Special thanks

JRoll的灵感源于[iScroll](https://github.com/cubiq/iscroll)

JRoll is inspired by[iScroll](https://github.com/cubiq/iscroll)
