/*! JRoll-Lite v2.4.11 ~ (c) 2017 Author:BarZu Git:https://github.com/chjtx/JRoll/blob/master/README-LITE.md */
/* global define */
(function (window, document, Math) {
  'use strict'

  var JRoll
  var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame
  var jrollMap = {} // 保存所有JRoll对象
  var prefix = 'transform' in document.createElement('div').style ? 't' : 'webkitT'

  // 实用工具
  var utils = {
    // 兼容
    TSF: prefix + 'ransform',
    TSD: prefix + 'ransitionDuration',

    /**
     * 在指定时间内将指定元素从开始位置移到结束位置并执行回调方法
     * el 必须是dom元素，必填
     * x 结束位置，必填
     * y 结束位置，必填
     * duration 过渡时长，单位ms，可选
     * callback 回调方法，可选
     */
    moveTo: function (el, x, y, duration, callback) {
      var startX = 0
      var startY = 0
      var endX
      var endY
      var stepX
      var stepY
      var d
      var result
      result = /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0px\)/.exec(el.style[utils.TSF])
      if (result) {
        startX = Number(result[1])
        startY = Number(result[2])
      }
      d = duration || 17
      stepX = (x - startX) / (d / 17)
      stepY = (y - startY) / (d / 17)
      endX = startX
      endY = startY

      function moving () {
        d = d - 17
        if (d <= 0) {
          endX = x
          endY = y
        } else {
          endX = parseInt(endX + stepX, 10)
          endY = parseInt(endY + stepY, 10)
        }
        el.style[utils.TSF] = 'translate3d(' + endX + 'px, ' + endY + 'px, 0px)'

        if (d > 0 && !(endX === x && endY === y)) {
          rAF(moving)
        } else if (typeof callback === 'function') {
          callback()
        }
      }

      moving()
    },

    /**
     * 一层一层往上查找已实例化的jroll
     * el 目标元素
     */
    findScroller: function (el) {
      var id
      while (el !== document) {
        id = el.getAttribute('jroll-id')
        if (id) {
          return jrollMap[id]
        }
        el = el.parentNode
      }
      return null
    }
  }

  function _touchstart (e) {
    var jroll = utils.findScroller(e.target)

    // 第二个手指按屏中止往后执行
    if (JRoll.jrollActive && e.touches && e.touches.length > 1) {
      return
    }
    if (jroll) {
      if (jroll.moving) {
        e.preventDefault() // 防止按停滑动时误触a链接
        jroll._endAction() // 结束并终止惯性
      }

      JRoll.jrollActive = jroll
      JRoll.jrollActive._start(e)
    }
  }

  function _touchmove (e) {
    if (JRoll.jrollActive) {
      var activeElement = document.activeElement
      if (JRoll.jrollActive.options.preventDefault) {
        e.preventDefault()
      }
      if (JRoll.jrollActive.options.autoBlur && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur()
      }
      JRoll.jrollActive._move(e)
    }
  }

  function _touchend (e) {
    if (JRoll.jrollActive) {
      JRoll.jrollActive._end(e)
    }
  }

  function _resize () {
    setTimeout(function () {
      for (var i in jrollMap) {
        jrollMap[i].refresh().scrollTo(0, jrollMap[i].y, 200)
      }
    }, 600)
  }

  // 检测是否支持passive选项
  var supportsPassiveOption = false
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassiveOption = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}

  function addEvent (type, method) {
    document.addEventListener(type, method, supportsPassiveOption ? { passive: false } : false)
  }

  // 添加监听事件
  addEvent('touchstart', _touchstart)
  addEvent('touchmove', _touchmove)
  addEvent('touchend', _touchend)
  addEvent('touchcancel', _touchend)
  window.addEventListener('resize', _resize)
  window.addEventListener('orientationchange', _resize)

  JRoll = function (el, options) {
    var me = this

    me.wrapper = typeof el === 'string' ? document.querySelector(el) : el
    me.w = me.wrapper
    me.scroller = options && options.scroller ? (typeof options.scroller === 'string' ? document.querySelector(options.scroller) : options.scroller) : me.w.children[0]
    me.s = me.scroller

    // 防止重复多次new JRoll
    if (me.s.jroll) {
      me.s.jroll.refresh()
      return me.s.jroll
    } else {
      me.s.jroll = me
    }

    this._init(el, options)
  }

  JRoll.version = '2.4.11'

  JRoll.utils = utils

  JRoll.jrollMap = jrollMap

  JRoll.prototype = {
    // 初始化
    _init: function (el, options) {
      var me = this

      // 创建ID
      me.id = (options && options.id) || me.s.getAttribute('jroll-id') || 'jroll_' + Math.random().toString().substr(2, 8)

      // 保存jroll对象
      me.s.setAttribute('jroll-id', me.id)
      jrollMap[me.id] = me

      // 默认选项
      me.options = {
        min: null, // 向下滑动的边界值，默认为0
        max: null, // 向上滑动的边界值，默认为scroller的高*-1
        scrollX: false, // 横向滑动
        bounce: true, // 回弹
        scrollBar: false, // 开启y滚动条
        scrollBarFade: false, // 滚动条使用渐隐模式
        preventDefault: true, // 禁止touchmove默认事件
        momentum: true, // 滑动结束平滑过渡
        autoStyle: true, // 自动为wrapper和scroller添加样式
        autoBlur: true  // 在滑动时自动将input/textarea失焦
      }

      // 使用别名减少压缩体积
      me.o = me.options

      for (var i in options) {
        if (i !== 'scroller') {
          me.o[i] = options[i]
        }
      }

      if (me.o.autoStyle) {
        // 将wrapper设为relative
        if (window.getComputedStyle(me.w).position === 'static') {
          me.w.style.position = 'relative'
          me.w.style.top = '0'
          me.w.style.left = '0'
        }
        me.w.style.overflow = 'hidden'
        me.s.style.minHeight = '100%'
      }

      me.s.style.touchAction = 'none'
      me.y = 0
      me.scrollBar = null // y滚动条
      me._s = {
        start: 0,
        last: 0,
        end: 0
      }

      me._event = {
        'scrollStart': [],
        'scroll': [],
        'scrollEnd': [],
        'refresh': [],
        'touchEnd': []
      }

      me.refresh(true)
    },

    // 开启
    enable: function () {
      var me = this
      me.s.setAttribute('jroll-id', me.id)
      return me
    },

    // 关闭
    disable: function () {
      var me = this
      me.s.removeAttribute('jroll-id')
      return me
    },

    // 刷新JRoll的宽高
    refresh: function (notRefreshEvent) {
      var me = this
      var wrapperStyle = window.getComputedStyle(me.w)
      var scrollerStyle = window.getComputedStyle(me.s)
      var padding
      var margin
      var temp
      var size

      // 解决wrapper的padding和scroller的margin造成maxWidth/maxHeight计算错误的问题
      if (me.o.scrollX) {
        padding = parseInt(wrapperStyle['padding-left']) + parseInt(wrapperStyle['padding-right'])
        margin = parseInt(scrollerStyle['margin-left']) + parseInt(scrollerStyle['margin-right'])
        // 最大/最小范围
        me.minScroll = me.o.min === null ? 0 : me.o.min
        me.maxScroll = me.o.max === null ? me.w.clientWidth - me.s.offsetWidth - padding - margin : me.o.max
      } else {
        padding = parseInt(wrapperStyle['padding-top']) + parseInt(wrapperStyle['padding-bottom'])
        margin = parseInt(scrollerStyle['margin-top']) + parseInt(scrollerStyle['margin-bottom'])
        // 最大/最小范围
        me.minScroll = me.o.min === null ? 0 : me.o.min
        me.maxScroll = me.o.max === null ? me.w.clientHeight - me.s.offsetHeight - padding - margin : me.o.max
      }

      if (me.minScroll < 0) {
        me.minScroll = 0
      }

      if (me.maxScroll > 0) {
        me.maxScroll = 0
      }

      me._s.end = me.y

      // 滚动条
      if (me.o.scrollBar) {
        if (!me.scrollBar) {
          temp = me._createScrollBar('jroll-bar', 'jroll-btn')
          me.scrollBar = temp[0]
          me.scrollBtn = temp[1]
        }
        me.scrollBarScale = me.o.scrollX ? me.w.clientWidth / me.s.offsetWidth : me.w.clientHeight / me.s.offsetHeight
        size = Math.round((me.o.scrollX ? me.w.clientWidth : me.scrollBar.clientHeight) * me.scrollBarScale)
        me.scrollBtn.style[me.o.scrollX ? 'width' : 'height'] = (size > 8 ? size : 8) + 'px'
        me._runScrollBar()
      } else if (me.scrollBar) {
        me.w.removeChild(me.scrollBar)
        me.scrollBar = null
      }

      if (!notRefreshEvent) {
        me._execEvent('refresh')
      }

      return me
    },

    _runScrollBar: function () {
      var me = this
      var y = Math.round(-1 * me.y * me.scrollBarScale)

      me._scrollTo.call({
        scroller: me.scrollBtn,
        options: {
          scrollX: me.o.scrollX
        }
      }, y)
    },

    // 创建滚动条
    _createScrollBar: function (a, b) {
      var me = this
      var bar
      var btn

      bar = document.createElement('div')
      btn = document.createElement('div')
      bar.className = a
      btn.className = b

      if (this.options.scrollBar === true) {
        if (me.o.scrollX) {
          bar.style.cssText = 'position:absolute;left:2px;bottom:2px;right:2px;height:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleY(.5);transform: scaleY(.5);'
          btn.style.cssText = 'background:rgba(0,0,0,.4);height:100%;position:absolute;left:0;top:0;bottom:0;border-radius:2px;'
        } else {
          bar.style.cssText = 'position:absolute;top:2px;right:2px;bottom:2px;width:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleX(.5);transform: scaleX(.5);'
          btn.style.cssText = 'background:rgba(0,0,0,.4);position:absolute;top:0;left:0;right:0;border-radius:2px;'
        }
      }

      if (me.o.scrollBarFade) {
        bar.style.opacity = 0
      }

      bar.appendChild(btn)
      me.w.appendChild(bar)

      return [bar, btn]
    },

    // 滚动条渐隐
    _fade: function (bar, time) {
      var me = this
      if (me.fading && time > 0) {
        time = time - 25
        if (time % 100 === 0) bar.style.opacity = time / 1000
      } else {
        return
      }
      rAF(me._fade.bind(me, bar, time))
    },

    on: function (event, callback) {
      var me = this
      switch (event) {
        case 'scrollStart':
          me._event.scrollStart.push(callback)
          break
        case 'scroll':
          me._event.scroll.push(callback)
          break
        case 'scrollEnd':
          me._event.scrollEnd.push(callback)
          break
        case 'refresh':
          me._event.refresh.push(callback)
          break
        case 'touchEnd':
          me._event.touchEnd.push(callback)
          break
      }
      return me
    },

    _execEvent: function (event, e) {
      var me = this
      var i = me._event[event].length - 1
      for (; i >= 0; i--) {
        me._event[event][i].call(me, e)
      }
    },

    // 计算x,y的值
    _compute: function (val, min, max) {
      var me = this
      if (val > min) {
        if (me.o.bounce && (val > (min + 10))) {
          return Math.round(min + ((val - min) / 4))
        } else {
          return min
        }
      }

      if (val < max) {
        if (me.o.bounce && (val < (max - 10))) {
          return Math.round(max + ((val - max) / 4))
        } else {
          return max
        }
      }

      return val
    },

    _scrollTo: function (y) {
      this.scroller.style[utils.TSF] = this.options.scrollX ? 'translate3d(' + y + 'px, 0px, 0px)' : 'translate3d(0px, ' + y + 'px, 0px)'
    },

    /**
     * 供用户调用的scrollTo方法
     * y y坐标
     * timing 滑动时长，使用css3的transition-duration进行过渡
     * allow  是否允许超出边界，默认为undefined即不允许超出边界
     * system 为true时即是本程序自己调用，默认为undefined即非本程序调用
     */
    scrollTo: function (y, timing, allow, callback, system, t) {
      var me = this
      var scrollX = me.o.scrollX
      if (!allow) {
        // y
        if (y >= me.minScroll) {
          me.y = me.minScroll

          // 滑到最大值时手指继续滑，重置开始、结束位置，优化体验
          if (t) {
            me._s.start = scrollX ? t[0].pageX : t[0].pageY
            me._s.end = me.minScroll
          }
        } else if (y <= me.maxScroll) {
          me.y = me.maxScroll
          if (t) {
            me._s.start = scrollX ? t[0].pageX : t[0].pageY
            me._s.end = me.maxScroll
          }
        } else {
          me.y = y
        }
      } else {
        me.y = y
      }
      if (!system) {
        me._s.end = me.y
      }
      if (timing) {
        utils.moveTo(me.s, scrollX ? me.y : 0, scrollX ? 0 : me.y, timing, callback)
      } else {
        me._scrollTo(me.y)
        if (typeof callback === 'function') {
          callback()
        }
      }

      if (me.scrollBtn) me._runScrollBar()

      return me
    },

    _endAction: function () {
      var me = this
      me._s.end = me.y
      me.moving = false

      if (me.o.scrollBarFade && !me.fading) {
        me.fading = true // 标记渐隐滚动条
        if (me.scrollBar) me._fade(me.scrollBar, 2000)
      }
      me._execEvent('scrollEnd')
    },

    _stepBounce: function () {
      var me = this

      me.bouncing = false

      function over () {
        me.scrollTo(me.y, 300)
      }

      if (me.direction === 1) {
        me.scrollTo(me.minScroll + 15, 100, true, over)
        me.y = me.minScroll
      } else {
        me.scrollTo(me.maxScroll - 15, 100, true, over)
        me.y = me.maxScroll
      }
    },

    _y: function (p) {
      var me = this
      var n = me.direction * p
      if (!isNaN(n)) {
        me.y = me.y + n
        // 达到边界终止惯性，执行回弹
        if (me.y >= me.minScroll || me.y <= me.maxScroll) {
          me.moving = false
          if (me.o.bounce) {
            me.bouncing = true // 标记回弹
          }
        }
      }
    },

    _step: function (time) {
      var me = this
      var now = Date.now()
      var t = now - time
      var s = 0

      // 惯性滑动结束，执行回弹
      if (me.bouncing) {
        me._stepBounce()
      }

      // 终止
      if (!me.moving) {
        me._endAction()
        return
      }

      // 防止t为0滑动终止造成卡顿现象
      if (t > 10) {
        me.speed = me.speed - t * (me.speed > 1.2 ? 0.001 : (me.speed > 0.6 ? 0.0008 : 0.0006))
        s = Math.round(me.speed * t)
        if (me.speed <= 0 || s <= 0) {
          me._endAction()
          return
        }
        time = now

        me._y(s)
        me.scrollTo(me.y, 0, false, null, true)
        me._execEvent('scroll')
      }

      rAF(me._step.bind(me, time))
    },

    _doScroll: function (d, e) {
      var me = this
      me.distance = d
      if (me.o.bounce) {
        me.y = me._compute(me.y, me.minScroll, me.maxScroll)
      }
      me.scrollTo(me.y, 0, me.o.bounce, null, true, e.touches)
      me._execEvent('scroll', e)
    },

    _start: function (e) {
      var me = this
      var t = e.touches

      me.distance = 0
      me.lastMoveTime = me.startTime = Date.now()
      me._s.last = me.startPosition = me._s.start = me.o.scrollX ? t[0].pageX : t[0].pageY

      me._execEvent('scrollStart', e)
    },

    _move: function (e) {
      var me = this
      var t = e.touches || [e]
      var now
      var y
      var dy
      var py
      var direction = 1

      y = me.o.scrollX ? t[0].pageX : t[0].pageY
      dy = y - me._s.last

      me._s.last = y

      direction = dy >= 0 ? 1 : -1 // 手指滑动方向，1(向右/下) | -1(向左/上)

      now = Date.now()

      if (now - me.lastMoveTime > 200 || me.direction !== direction) {
        me.startTime = now
        me.startPosition = y
        me.direction = direction
      }

      me.lastMoveTime = now
      py = y - me.startPosition

      // 显示滚动条
      if (me.o.scrollBarFade) {
        me.fading = false // 终止滑动条渐隐
        if (me.scrollBar) me.scrollBar.style.opacity = 1
      }

      me.y = y - me._s.start + me._s.end
      me._doScroll(py, e)
    },

    _end: function (e) {
      var me = this
      var now = Date.now()

      // 滑动结束
      if (e.touches && e.touches.length) {
        return
      }

      me._execEvent('touchEnd')
      JRoll.jrollActive = null
      me.duration = now - me.startTime

      // 超出边界回弹
      if (me.y > me.minScroll || me.y < me.maxScroll) {
        me.scrollTo(me.y, 300)._endAction()

      // 惯性滑动
      } else if (me.o.momentum && me.duration < 200 && me.distance) {
        me.speed = Math.abs(me.distance / me.duration)
        me.speed = me.speed > 2 ? 2 : me.speed
        me.moving = true
        rAF(me._step.bind(me, now))
      } else {
        me._endAction()
      }

      // 隐藏滑动条
      if (me.o.scrollBarFade && !me.fading) {
        me.fading = true
        if (me.scrollBar) me._fade(me.scrollBar, 2000)
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRoll
  }
  if (typeof define === 'function') {
    define(function () {
      return JRoll
    })
  }

  window.JRoll = JRoll
})(window, document, Math)
