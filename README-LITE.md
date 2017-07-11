# 醉萝卜（精简版） JRoll Lite

## 说明

`JRoll Lite`是`JRoll`的精简版，删减了JRoll几乎一半的功能，文件体积也减少了三分一，去除了自由滑动和缩放，减少了很多判断逻辑，滑动更流畅，保留的选项、方法、事件与JRoll完整版保持一致

`JRoll Lite`也是使用JRoll全局变量，与完整版会有冲突，如果不需要用到完整版功能，推荐使用`JRoll Lite`，如果项目发展到需要用`JRoll`完整版上的功能时再将文件替换即可

## 注意

- 不支持PC
- 不支持`jroll-fixedinput`扩展和`jroll-viewer`插件

## 下载

### NPM

```bash
npm install --save jroll-lite
```

### CDN

```html
<script src="https://unpkg.com/jroll-lite/jroll-lite.js"></scritp>
<script src="https://unpkg.com/jroll-lite/jroll-lite.min.js"></scritp>
```

### 官网

[http://www.chjtx.com/JRoll/#download](http://www.chjtx.com/JRoll/#download)

## 保留的选项

| 可选值 | 默认值| 说明 |
|----------|----------|----------|
| id | *[随机生成]* | id，jroll对象的唯一标记，建议手动提供id，方便在全局JRoll.jrollMap访问指定jroll对象，不提供时系统自动创建。 |
| scrollX | false | 使用水平滑动，`JRoll Lite`没有`scrollY`选项，默认为垂直滑动，垂直和水平滑动只能选其一 |
| minX | 0 | 向左滑动的边界值 |
| maxX | *[负scroller的宽]* | 向右滑动的边界值 |
| minY | 0 | 向下滑动的边界值 |
| maxY | *[负scroller的高]* | 向上滑动的边界值 |
| bounce | true | 允许回弹 |
| scrollBarX | false | 开启水平滚动条 |
| scrollBarY | false | 开启垂直滚动条 |
| scrollBarFade | false | 滚动条使用渐隐模式 |
| preventDefault | true | 禁止touchmove默认事件 |
| momentum | true | 开启滑动加速，惯性过渡 |
| autoStyle | true | 自动为wrapper和scroller添加样式 |
| autoBlur | true | 在滑动时自动将input/textarea失焦收起软键盘。设为false将会在IOS上出现光标不跟随输入框移动的现象 |

## 保留的方法

- refresh
- scrollTo
- enable
- disable

## 保留的事件

- scrollStart
- scroll
- scrollEnd
- refresh
- touchEnd

## 还支持的官插件

- jroll-infinite
- jroll-pulldown
- jroll-vue-infinite

## 删减的内容

- 删除了`scrollY`选项，`scrollX`为false即为垂直方向滑动
- 删除了自由滑动、缩放功能
- 删除了`destroy`、`scale`、`call`方法
- 删除了`zoomStart`、`zoom`、`zoomEnd`事件
- 删除了 utils 的`isAndroid`、`isIOS`、`isMobile`、`computeTranslate`、`computePosition`、`findAllJRolls`等属性和方法
- 删除了对PC的支持
- 删除了监听窗口变化
- 删除了滑动textarea的优化
- 删除了滑到浏览器边缘释放滑动的优化

## 日志

### v2.4.1 (2017-07-05)

- 开发完成，发布
