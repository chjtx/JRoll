/*! JRoll-Vue-Infinite v2.0.2 ~ (c) 2017-2018 Author:BarZu Git:https://github.com/chjtx/JRoll/ */
/* global JRoll */
JRoll.VueInfinite2 = function () {
  return {
    props: {
      total: [String, Number],
      jrollOptions: Object,
      pulldownOptions: Object
    },
    data: function () {
      return {
        page: 0,
        totals: parseInt(this.total, 10) || 99,
        jroll: null,
        tip: '',
        loadingTip: '正在加载数据',
        completeTip: '已全部加载完成',
        errorTip: '加载失败，上拉重试'
      }
    },
    // template: '<div><div><slot></slot><div class="jroll-infinite-tip" v-html="tip"></div></div></div>',
    // merge https://github.com/chjtx/JRoll/issues/75 解决vue-cli 3.0 使用 vue.runtime.esm.js 解释不了template的问题
    render: function (h) {
      return h('div', [h('div', [this.$slots.default, h('div', {
        'class': 'jroll-infinite-tip',
        innerHTML: this.tip
      })])])
    },
    mounted: function () {
      var me = this
      me.jroll = new JRoll(me.$el, me.jrollOptions)

      // 下拉刷新
      if (me.pulldownOptions) {
        me.pulldownOptions.refresh = function (complete) {
          me.$emit('on-pulldown', function () {
            me.page = 1
            if (me.page < me.totals) {
              me.tip = me.loadingTip
            } else {
              me.tip = me.completeTip
            }
            complete()
          }, function () {
            me.tip = me.errorTip
            complete()
          })
        }

        me.jroll.pulldown(me.pulldownOptions)
      }

      me.jroll.on('scrollStart', function () {
        me.$emit('on-scroll-start', this)
      })

      me.jroll.on('scroll', function () {
        me.$emit('on-scroll', this)
      })

      me.jroll.on('scrollEnd', function () {
        me.$emit('on-scroll-end', this)
        if (this.y <= this.maxScrollY + me.jroll.scroller.querySelector('.jroll-infinite-tip').offsetHeight && me.page < me.totals) {
          me.$emit('on-scroll-bottom', me.page, function () {
            me.page += 1
            if (me.page < me.totals) {
              me.tip = me.loadingTip
            } else {
              me.tip = me.completeTip
            }
          }, function () {
            me.tip = me.errorTip
          })
        }
      })

      me.tip = me.loadingTip
      // 首次执行数据加载
      me.$emit('on-scroll-bottom', 0, function () {
        me.page += 1
        if (me.page < me.totals) {
          me.tip = me.loadingTip
        } else {
          me.tip = me.completeTip
        }
      }, function () {
        me.tip = me.errorTip
      })
    },
    updated: function () {
      var me = this
      me.$nextTick(function () {
        if (me.jroll) {
          me.jroll.refresh()
        }
      })
    },
    watch: {
      total: function (val) {
        this.totals = val
      }
    }
  }
}
