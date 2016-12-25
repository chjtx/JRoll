/*! JRoll-Vue-Infinite v0.0.1 ~ (c) 2015-2016 Author:BarZu Git:https://github.com/chjtx/JRoll/ */
/* global JRoll */
JRoll.VueInfinite = function (options, jrollOptions) {
  options = options || {}
  return {
    template: '<div><div><slot></slot><div class="jroll-infinite-tip" v-html="tip"></div></div></div>',
    data: function () {
      return {
        page: options.page || 0,
        tip: options.tip || '正在加载中...'
      }
    },
    mounted: function () {
      var me = this
      me.jroll = new JRoll(me.$el, jrollOptions || {})
      me.jroll.on('scrollEnd', function () {
        if (this.y < this.maxScrollY + me.jroll.scroller.querySelector('.jroll-infinite-tip').offsetHeight &&
          this.scrollerHeight > this.wrapperHeight &&
          typeof options.bottomed === 'function') {
          options.bottomed.call(me)
        }
      })
      if (typeof options.bottomed === 'function') options.bottomed.call(me)
    },
    updated: function () {
      if (options && typeof options.updated === 'function') options.updated.call(this)
      this.jroll.refresh()
    }
  }
}
