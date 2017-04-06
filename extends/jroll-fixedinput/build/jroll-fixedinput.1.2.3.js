/*! JRoll-FixedInput v1.2.3 ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/extends/jroll-fixedinput */
/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var utils = JRoll.utils

  function _focusin (e) {
    var tagName = e.target.tagName
    var type = e.target.type
    if (e.target === document.activeElement &&
      (tagName === 'INPUT' || tagName === 'TEXTAREA') &&
      (type === 'text' || type === 'password' || type === 'textarea' || type === 'email' || type === 'number' || type === 'search' || type === 'tel' || type === 'url') &&
      window.innerHeight > 460) {
      var me = this
      var t = utils.computePosition(e.target, document.body).top
      var top = utils.computePosition(e.target, me.wrapper).top

      // 调整位置
      if (t + me.y > window.innerHeight / 2 - 50 && utils.isAndroid) {
        me.scrollTo(me.x, -1 * top + window.innerHeight / 2 - me.options.adjustTop, 200, true)
      }
    }
  }

  function _focusout () {
    var me = this
    setTimeout(function () {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        me.scrollTo(me.x, me.y, 200, false, function () {
          // 判断绘制的方形顶点是否为正常值，如果不是，表明已被手机自动移动过，需要使用scrollIntoView拉正
          if (me.y !== me.scroller.getClientRects()[0].top - utils.computePosition(me.scroller, document.body).top) {
            me.scroller.scrollIntoView()
          }
        })
      }
    }, 100)
  }

  JRoll.prototype.fixedinput = function (adjustTop) {
    var me = this

    // 安卓手机输入表单时自动调整输入框位置
    me.options.adjustTop = adjustTop || 100

    if (!me.wrapper.jroll_fixedinput) {
      me.wrapper.jroll_fixedinput = 1 // 防止多次绑定事件
      me.wrapper.addEventListener('click', _focusin.bind(me), false)
      me.wrapper.addEventListener('focusout', _focusout.bind(me), false)
    }
  }

  JRoll.prototype.fixedinput.version = '1.2.3'

  // CommonJS/AMD/CMD规范导出JRoll
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRoll
  }
  if (typeof define === 'function') {
    define(function () {
      return JRoll
    })
  }
})(window, document, JRoll)
