# JRoll无限加载+下拉刷新 for Vue2

## 选项

JRoll.VueInfinite(options [, jrollOptions])

- options 是传给无限加载组件的参数，包含5个选项

| 选项 | 默认值 | 说明 |
|:----:|:----:|----|
|page| 0 | 当前页，默认为0，请在数据请求成功后再对该值进行修改|
|tip| '正在加载中...' | 提示信息，|
|bottomed|undefined| 滑动到底部时执行的方法，页面加载完成时会自动执行一次。请自行在此方法里更新数据 |
|updated|undefined| 执行vue的updated，详细请查看vue教程的生命周期钩子[updated](https://www.vuefe.cn/v2/api/#updated) |
|pulldown|{}| 开启下拉刷新功能，如果使用该选项，必须先引入`jroll-pulldown.js`。默认为空对象，可填入`jroll-pulldown`的选项参数，参考[jroll-pulldown选项参数](https://github.com/chjtx/JRoll/tree/master/extends/jroll-pulldown)，在这里，refresh是无效参数，代由bottomed处理。除refresh外，jroll-pulldown的其余选项参数均有效 |

- jrollOptions 是创建JRoll实例时传给JRoll的参数，详细请查看JRoll教程的[可选参数](http://www.chjtx.com/JRoll/#options)

## 无限加载

jroll-vue-infinite.js必须在vue和jroll之后引入
```html
<script src="vue.js"></script>
<script src="jroll.js"></script>
<script src="jroll-vue-infinite.js"></script>

<div id="app">
    <jroll-infinite>
        <div v-for="i in items">{{i}}</div>
    </jroll-infinite>
</div>

<script>
var vm = new Vue({
  el: '#app',
  components: {
    'jroll-infinite': JRoll.VueInfinite({
      tip: '正在加载...',
      bottomed: function () {
        var me = this
        if (me.page < 3) {
          ajax({
            url: 'getData.do?page=' + (me.page + 1),
            success: function (data) {
              me.page++ // 请求成功将page加1，失败则不要改变page
              vm.$data.items = vm.$data.items.concat(data)
              if (me.page === 3) {
                me.tip = '已全部加载完成'
              }
            }
          })
        }
      },
      updated: function () {...}
    }, {
      scrollBarY: true
    })
  },
  data: {
    items: [1,2,3]
  }
})
</script>
```

## 开启下拉刷新功能

需要先引入`jroll-pulldown.js`，然后添加`pulldown: {}`选项，bottomed选项需要对complete进行判断处理

```js
var options = {
  pulldown: {},
  bottomed: function (complete) {
    var me = this
    if (me.page < 3) {
      ajax({
        url: 'getData.do?page=' + (me.page + 1),
        success: function (data) {
          // 请求成功将page加1，失败则不要改变page
          me.page++

          // 加入下拉刷新功能后需要判断complete是否为function类型，是，表示刷新，复位第1页；否，表示上拉加载下一页，拼接下一页数据
          if (typeof complete === 'function') {
            vm.$data.items = data
            complete()
          } else {
            vm.$data.items = vm.$data.items.concat(data)
          }

          // jroll-vue-infinite的提示选项只有一个，需要开发者自行判断
          if (me.page === 3) {
            me.tip = '已全部加载完成'
          } else {
            me.tip = '正在加载中...'
          }
        }
      })
    }
  }
}

var vm = new Vue({
  el: '#app',
  components: {
    'jroll-infinite': JRoll.VueInfinite(options)
  },
  data: {
    items: [1,2,3]
  }
})
```



## 更新日志

### v0.0.2 (2017-02-05)

- 添加下拉刷新功能

### v0.0.1 (2016-12-25)

- 完成发布