# JRoll无限加载+下拉刷新 for Vue2 （第二版）

## 示例

```html
<jroll-infinite class="jroll-vue-infinite"
  total="10"
  :jroll-options="options"
  @on-scroll-bottom="scrollBottom"
  @on-scroll-start="scrollStart"
  @on-scroll="scroll"
  @on-scroll-end="scrollEnd">
    <div class='item' v-for="i in items">{{i.index}}、{{i.text}}</div>
</jroll-infinite>
```

```js
Vue.component('jroll-infinite', JRoll.VueInfinite2())
```

> 注意：加载顺序必须先引入`jroll.js`再引入`jroll-vue-infinite2.js`

## NPM安装

```bash
npm i -D jroll
npm i -D jroll-vue-infinite2
```

## 选项

| 选项 | 默认值 | 必填 | 说明 |
|:----|:----:|:----:|----|
|total| 99 | 否 | 总页数 |
|:jroll-options| -- | 否 | 提供jroll的选项，参考[http://www.chjtx.com/JRoll/#options](http://www.chjtx.com/JRoll/#options) |
|@on-scroll-bottom| -- | 是 | 滑动到底部时执行，初始化时会执行一次，用于更新数据，`function (page, success, error)` |
|@on-scroll-start| -- | 否 | jroll的`scrollStart`事件，`function (jroll)` |
|@on-scroll| -- | 否 | jroll的`scroll`事件，`function (jroll)` |
|@on-scroll-end| -- | 否 | jroll的`scrollEnd`事件，`function (jroll)` |

## 无限加载

```html
<div id="app">
  <jroll-infinite class="jroll-vue-infinite" total="10" ref="myJRoll"
    :jroll-options="options"
    @on-scroll-bottom="scrollBottom"
    @on-scroll-start="scrollStart">
    <div class='item' v-for="i in items">{{i.index}}、{{i.text}}</div>
  </jroll-infinite>
</div>

<script>
new Vue({
  el: '#app',
  data: {
    page: 0,
    items: [],
    options: {
      scrollBarY: true
    }
  },
  mounted: function () {
    // 可以通过ref属性获取jroll对象
    console.log(this.$refs.myJRoll.jroll)
  },
  methods: {
    scrollBottom: function (page, success, error) {
      var me = this
      ajax({
        url: 'getData.do?page=' + (page + 1),
        success: function (data) {
          me.items = me.items.concat(data)
          success()
        },
        error: function () {
          error()
        }
      })
    },
    scrollStart: function (jroll) {
      // console.log(jroll)
    }
  }
})
</script>
```

## 开启下拉刷新功能

需要先引入`jroll-pulldown.js`，然后添加`:pulldown-options`选项和`@on-pulldown`事件

补充选项

| 选项 | 默认值 | 必填 | 说明 |
|:----|:----:|:----:|----|
|:pulldown-options| -- | 是 | 添加该选项才能开启下拉刷新，可为空对象，参考[https://github.com/chjtx/JRoll/tree/master/extends/jroll-pulldown](https://github.com/chjtx/JRoll/tree/master/extends/jroll-pulldown)，除`refresh`选项外，其余选项都有效 |
|@on-scroll-end| -- | 否 | jroll的`scrollEnd`事件，`function (jroll)` |

```html
<div id="app">
  <jroll-infinite class="jroll-vue-infinite" total="10" :pulldown-options="{}"
    @on-scroll-bottom="scrollBottom"
    @on-pulldown="pulldown">
    <div class='item' v-for="i in items">{{i.index}}、{{i.text}}</div>
  </jroll-infinite>
</div>

<script>
new Vue({
  el: '#app',
  data: {
    page: 0,
    items: []
  },
  methods: {
    pulldown: function (success, error) {
      var me = this
      ajax({
        url: 'getData.do?page=1',
        success: function (data) {
          me.items = data
          success()
        },
        error: function () {
          error()
        }
      })
    },
    scrollBottom: function (page, success, error) {
      var me = this
      ajax({
        url: 'getData.do?page=' + (page + 1),
        success: function (data) {
          me.items = me.items.concat(data)
          success()
        },
        error: function () {
          error()
        }
      })
    },
    scrollStart: function (jroll) {
      // console.log(jroll)
    }
  }
})
</script>
```

## 更新日志

### v2.0.0 (2017-11-29)

- 发布`jroll-vue-infinite2`
