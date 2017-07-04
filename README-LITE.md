# 醉萝卜（精简版） JRoll Lite

## 说明

`JRoll Lite`是`JRoll`的精简版，删减了JRoll几乎一半的功能，文件体积也减少了将近一半，只保留垂直/水平滑动，减少了很多判断逻辑，比JRoll滑动更流畅，保留的选项、方法、事件与JRoll基本保持一致

## 下载

## 选项

| 可选值 | 默认值| 说明 |
|----------|----------|----------|
| id | *[随机生成]* | id，jroll对象的唯一标记，建议手动提供id，方便在全局JRoll.jrollMap访问指定jroll对象，不提供时系统自动创建。 |
| scrollX | false | 使用水平滑动，`JRoll Lite`没有`scrollY`选项，默认为垂直滑动，垂直和水平滑动只能选其一 |
| min | 0 | 向左/下滑动的边界值，向左还是向下取决于`scrollX`选项 |
| max | *[负scroller的宽/高]* | 向右/上滑动的边界值，向右还是向上取决于`scrollX`选项 |
| bounce | true | 允许回弹 |
| scrollBar | false | 开启滚动条 |
| scrollBarFade | false | 滚动条使用渐隐模式 |
| preventDefault | true | 禁止touchmove默认事件 |
| momentum | true | 开启滑动加速，惯性过渡 |
| autoStyle | true | 自动为wrapper和scroller添加样式 |
| autoBlur | true | 在滑动时自动将input/textarea失焦收起软键盘。设为false将会在IOS上出现光标不跟随输入框移动的现象 |

## 方法

### refresh

与原方法用法一致

### scrollTo

减少了一个参数，原来的`x`和`y`合并成一个参数，该参数取决于`scrollX`选项，如果`scrollX`为false，则该参数用于移动y方向，如果`scrollX`为true，那么该参数用于移动x方向

```js
jroll.scrollTo(y [, duration , bool, callback])
```

### enable

与原方法用法一致

### disable

与原方法用法一致

## 事件

### scrollStart

与原事件用法一致

### scroll

与原事件用法一致

### scrollEnd

与原事件用法一致

### refresh

与原事件用法一致

### touchEnd

与原事件用法一致

## 注意

### 带滚动条动态修改`scrollX`选项需要两次refresh()

```js
jroll.options.scrollX = true
jroll.options.scrollBar = false
jroll.refresh().scrollTo(0) // 第一次刷新删除旧滚动条，顺带重置一下位置
jroll.options.scrollBar = true
jroll.refresh() // 第二次刷新创建新滚动条
```

## 还支持的官插件

## 删减内容