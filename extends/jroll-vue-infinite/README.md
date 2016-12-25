# JRoll无限加载组件 for Vue

## 使用

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
      bottomed: function () {...},
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

JRoll.VueInfinite(options [, jrollOptions])

- options 是传给无限加载组件的参数，包含4个选项

| 选项 | 默认值 | 说明 |
|:----:|:----:|----|
|page| 0 | 当前页，默认为0，请在数据请求成功后再对该值进行修改|
|tip| '正在加载中...' | 提示信息，|
|bottomed|undefined| 滑动到底部时执行的方法，页面加载完成时会自动执行一次。请自行在此方法里更新数据 |
|updated|undefined| 执行vue的updated，详细请查看vue教程的生命周期钩子[updated](https://www.vuefe.cn/v2/api/#updated) |

- jrollOptions 是创建JRoll实例时传给JRoll的参数，详细请查看JRoll教程的[可选参数](http://www.chjtx.com/JRoll/#options)