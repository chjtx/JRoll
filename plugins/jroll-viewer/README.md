# JRollViewer

一款基于JRoll开发的图集查看器插件

## 引入

支持标签、CommonJS、AMD、CMD方式引入

### 标签

```html
<!-- 先引入JRoll再引入JRollViewer -->
<script src="jroll.js"></script>
<script src="jroll-viewer.js"></script>
```

### AMD

``` js
define(['jroll', 'jroll-viewer'], function (JRoll, JRollViewer) {
  var viewer = new JRollViewer('#viewer'{
    JRoll: JRoll //不能确定引入顺序时可以参数形式将JRoll传给JRollViewer
  })
})
```

## 使用说明

```html
<!-- 基本用法 -->
<div id="viewer">
  <img src="http://www.cdn.cn/1.png" jroll-viewer-image>
  <img src="../images/2.jpg" jroll-viewer-image>
  <img src="../images/3.gif">
</div>

<script>
var viewer = new JRollViewer('#viewer')
</script>
```

1. 在`div#viewer`容器里存放`img`图片，图片必须带`jroll-viewer-image`标记
2. `new JRollViewer('#viewer')`将`div#viewer`创建为JRollViewer实例容器
3. 点击带`jroll-viewer-image`标记的图片即可打开图片查看器

## 选项

```js
new JRollViewer(el [, options])
```

| 键名 | 默认值 | 说明 |
|----------|----------|----------|
| zoomMax | 图片原始值 | 图片最大缩放倍数，以window.innerWidth为1 |
| JRoll | window.JRoll | 用于异步引入JRoll，不能确保window.JRoll比window.JRollViewer先加载完成时使用 |

## 方法

### show

```js
// 打开第一张图片
viewer.show(0)

// or 打开src为`../images/2.jpg`的图片
viewer.show('../images/2.jpg')

// or 打开指定 img dom 的图片
viewer.show(document.getElementById('viewer').children[0])
```

一个参数，打开选中的图片

### hide

收起图片查看器

### switch

手动切换图片，可利用该方法做图片自动轮播

```js
viewer.switch(1, 200)
```

viewer.switch(index[, duration])

- index 必填，索引值，要切换到哪张图片
- duration 可选，过渡时间

## Log

### v0.1.1 (2016-11-29)

- 修改了使用方式
- 允许多实例并存
- 每次打开查看器，重新生成要查看的图片，避免不断创建查看器
- 修复body.scrollTop不为0时错位的问题

### v0.0.2 (2016-11-25)

- 完成