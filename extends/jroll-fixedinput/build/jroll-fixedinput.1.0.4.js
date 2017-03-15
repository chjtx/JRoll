/*! JRoll-FixedInput v1.0.4 ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/extends/jroll-fixedinput */
/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var utils = JRoll.utils

  function _focusin (e) {
    var tagName = e.target.tagName
    var type = e.target.type
    if (e.target === document.activeElement &&
      (tagName === 'INPUT' || tagName === 'TEXTAREA') &&
      (type === 'text' || type === 'password' || type === 'textarea' || type === 'email' || type === 'number' || type === 'search' || type === 'tel' || type === 'url')) {
      var me = this
      var t = utils.computePosition(e.target, document.body).top
      var top = utils.computePosition(e.target, me.wrapper).top

      // 手动调整位置
      if (typeof me.options.adjustTop === 'number') {
        me.scrollTo(me.x, -1 * top + me.options.adjustTop, 200, true)
        return
      }

      // 自动调整位置
      if (t + me.y > window.innerHeight / 2 - 50) {
        me.scrollTo(me.x, -1 * top + window.innerHeight / 2 - 100, 200, true)
      }
    }
  }

  function _focusout () {
    var me = this
    me.scrollTo(me.x, me.y, 200)
  }

  JRoll.prototype.fixedinput = function (adjustTop, invalid) {
    var me = this

    // 安卓手机输入表单时自动调整输入框位置
    me.options.adjustTop = adjustTop

    // Android
    if (!me.wrapper.jroll_fixedinput && utils.isAndroid) {
      me.wrapper.jroll_fixedinput = 1 // 防止多次绑定事件
      me.wrapper.addEventListener('click', _focusin.bind(me), false)
      me.wrapper.addEventListener('focusout', _focusout.bind(me), false)
    }

    // IOS
    if (utils.isIOS && invalid) {
      setTabIndexInvalid()
      me.on('refresh', setTabIndexInvalid)
    }

    // 将tabIndex设为-1防止IOS使用tab跳到下一个输入框导致页面自动移动引起的bug
    function setTabIndexInvalid () {
      var inputs = me.scroller.querySelectorAll('input, textarea')
      var i = inputs.length
      while (i--) {
        inputs[i].tabIndex = -1
      }
    }
  }

  JRoll.prototype.fixedinput.version = '1.0.4'

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
