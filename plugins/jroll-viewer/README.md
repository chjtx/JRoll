# JRollViewer

## 使用说明

```js
var imgs = [
  'http://图片1',
  'http://图片2',
  'http://图片3'
]
var viewer = new JRollViewer({ images: imgs })

viewer.show(0)
```

1. 传入图片地址数组，创建JRollViewer实例
2. 调用show显示图片查看器，一般在点击缩略图时调用该方法

## 选项

| 键名 | 默认值 | 说明 |
|----------|----------|----------|
| images | *必填，没默认值* | 要查看的图片地址集 |
| zoomMax | 图片原始值 | 图片最大缩放倍数，以window.innerWidth为1 |
| JRoll | window.JRoll | 用于异步引入JRoll，不能确保window.JRoll比window.JRollViewer先加载完成时使用 |

## 方法

### show

```js
viewer.show(0)
```

viewer.show(index)

一个参数，`options.images`的索引值，打开选中的图片

### hide

收起图片查看器

### switch

手动切换图片，可利用该方法做图片自动轮播

```js
viewer.switch(1, 200)
```

viewer.switch(index[, duration])

- index 必填，`options.images`的索引值，要切换到哪张图片
- duration 可选，过渡时间

## Log

### v0.0.2 (2016-11-25)

- 完成