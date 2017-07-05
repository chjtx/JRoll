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

  JRoll = function (el, options) {
    var me = this

    me.w = me.wrapper = typeof el === 'string' ? document.querySelector(el) : el
    me.s = me.scroller = options && options.scroller ? (typeof options.scroller === 'string' ? document.querySelector(options.scroller) : options.scroller) : me.w.children[0]

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
        scrollX: false,
        minX: null, // 向左滑动的边界值，默认为0
        maxX: null, // 向右滑动的边界值，默认为scroller的宽*-1
        minY: null, // 向下滑动的边界值，默认为0
        maxY: null, // 向上滑动的边界值，默认为scroller的高*-1
        bounce: true, // 回弹
        scrollBarX: false, // 开启x滚动条
        scrollBarY: false, // 开启y滚动条
        scrollBarFade: false, // 滚动条使用渐隐模式
        preventDefault: true, // 禁止touchmove默认事件
        momentum: true, // 滑动结束平滑过渡
        autoStyle: true, // 自动为wrapper和scroller添加样式
        autoBlur: true  // 在滑动时自动将input/textarea失焦
      }
      // 使用别名减少文件体积
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

      me.x = 0
      me.y = 0

      me.scrollBarX = null // x滚动条
      me.scrollBarY = null // y滚动条

      me._s = {
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        endX: 0,
        endY: 0
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
      var paddingX
      var paddingY
      var marginX
      var marginY
      var temp
      var size

      me.wrapperWidth = me.w.clientWidth
      me.wrapperHeight = me.w.clientHeight

      me.scrollerWidth = me.s.offsetWidth
      me.scrollerHeight = me.s.offsetHeight

      // 解决wrapper的padding和scroller的margin造成maxWidth/maxHeight计算错误的问题
      paddingX = parseInt(wrapperStyle['padding-left']) + parseInt(wrapperStyle['padding-right'])
      paddingY = parseInt(wrapperStyle['padding-top']) + parseInt(wrapperStyle['padding-bottom'])
      marginX = parseInt(scrollerStyle['margin-left']) + parseInt(scrollerStyle['margin-right'])
      marginY = parseInt(scrollerStyle['margin-top']) + parseInt(scrollerStyle['margin-bottom'])

      // 最大/最小范围
      me.minScrollX = me.o.minX === null ? 0 : me.o.minX
      me.maxScrollX = me.o.maxX === null ? me.wrapperWidth - me.scrollerWidth - paddingX - marginX : me.o.maxX
      me.minScrollY = me.o.minY === null ? 0 : me.o.minY
      me.maxScrollY = me.o.maxY === null ? me.wrapperHeight - me.scrollerHeight - paddingY - marginY : me.o.maxY

      if (me.minScrollX < 0) {
        me.minScrollX = 0
      }
      if (me.minScrollY < 0) {
        me.minScrollY = 0
      }
      if (me.maxScrollX > 0) {
        me.maxScrollX = 0
      }
      if (me.maxScrollY > 0) {
        me.maxScrollY = 0
      }

      me._s.endX = me.x
      me._s.endY = me.y

      // x滚动条
      if (me.o.scrollBarX) {
        if (!me.scrollBarX) {
          temp = me._createScrollBar('jroll-xbar', 'jroll-xbtn', false)
          me.scrollBarX = temp[0]
          me.scrollBtnX = temp[1]
        }
        me.scrollBarScaleX = me.w.clientWidth / me.s.offsetWidth
        size = Math.round(me.scrollBarX.clientWidth * me.scrollBarScaleX)
        me.scrollBtnX.style.width = (size > 8 ? size : 8) + 'px'
        me._runScrollBarX()
      } else if (me.scrollBarX) {
        me.w.removeChild(me.scrollBarX)
        me.scrollBarX = null
      }
      // y滚动条
      if (me.o.scrollBarY) {
        if (!me.scrollBarY) {
          temp = me._createScrollBar('jroll-ybar', 'jroll-ybtn', true)
          me.scrollBarY = temp[0]
          me.scrollBtnY = temp[1]
        }
        me.scrollBarScaleY = me.w.clientHeight / me.s.offsetHeight
        size = Math.round(me.scrollBarY.clientHeight * me.scrollBarScaleY)
        me.scrollBtnY.style.height = (size > 8 ? size : 8) + 'px'
        me._runScrollBarY()
      } else if (me.scrollBarY) {
        me.w.removeChild(me.scrollBarY)
        me.scrollBarY = null
      }

      if (!notRefreshEvent) {
        me._execEvent('refresh')
      }

      return me
    },

    // 滑动滚动条
    _runScrollBarX: function () {
      var me = this
      var x = Math.round(-1 * me.x * me.scrollBarScaleX)

      me._scrollTo.call({
        scroller: me.scrollBtnX
      }, x, 0)
    },
    _runScrollBarY: function () {
      var me = this
      var y = Math.round(-1 * me.y * me.scrollBarScaleY)

      me._scrollTo.call({
        scroller: me.scrollBtnY
      }, 0, y)
    },

    // 创建滚动条
    _createScrollBar: function (a, b, isY) {
      var me = this
      var bar
      var btn

      bar = document.createElement('div')
      btn = document.createElement('div')
      bar.className = a
      btn.className = b

      if (this.options.scrollBarX === true || this.options.scrollBarY === true) {
        if (isY) {
          bar.style.cssText = 'position:absolute;top:2px;right:2px;bottom:2px;width:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleX(.5);transform: scaleX(.5);'
          btn.style.cssText = 'background:rgba(0,0,0,.4);position:absolute;top:0;left:0;right:0;border-radius:2px;'
        } else {
          bar.style.cssText = 'position:absolute;left:2px;bottom:2px;right:2px;height:6px;overflow:hidden;border-radius:2px;-webkit-transform: scaleY(.5);transform: scaleY(.5);'
          btn.style.cssText = 'background:rgba(0,0,0,.4);height:100%;position:absolute;left:0;top:0;bottom:0;border-radius:2px;'
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

    _scrollTo: function (x, y) {
      this.scroller.style[utils.TSF] = 'translate3d(' + x + 'px, ' + y + 'px, 0px)'
    },

    /**
     * 供用户调用的scrollTo方法
     * x x坐标
     * y y坐标
     * timing 滑动时长，使用css3的transition-duration进行过渡
     * allow  是否允许超出边界，默认为undefined即不允许超出边界
     * system 为true时即是本程序自己调用，默认为undefined即非本程序调用
     */
    scrollTo: function (x, y, timing, allow, callback, system, t) {
      var me = this
      if (!allow) {
        // x
        if (x >= me.minScrollX) {
          me.x = me.minScrollX

          // 滑到最大值时手指继续滑，重置开始、结束位置，优化体验
          if (t) {
            me._s.startX = t[0].pageX
            me._s.endX = me.minScrollX
          }
        } else if (x <= me.maxScrollX) {
          me.x = me.maxScrollX
          if (t) {
            me._s.startX = t[0].pageX
            me._s.endX = me.maxScrollX
          }
        } else {
          me.x = x
        }

        // y
        if (y >= me.minScrollY) {
          me.y = me.minScrollY
          if (t) {
            me._s.startY = t[0].pageY
            me._s.endY = me.minScrollY
          }
        } else if (y <= me.maxScrollY) {
          me.y = me.maxScrollY
          if (t) {
            me._s.startY = t[0].pageY
            me._s.endY = me.maxScrollY
          }
        } else {
          me.y = y
        }
      } else {
        me.x = x
        me.y = y
      }
      if (!system) {
        me._s.endX = me.x
        me._s.endY = me.y
      }
      if (timing) {
        utils.moveTo(me.s, me.x, me.y, timing, callback)
      } else {
        me._scrollTo(me.x, me.y)
        if (typeof callback === 'function') {
          callback()
        }
      }

      if (me.scrollBtnX) me._runScrollBarX()
      if (me.scrollBtnY) me._runScrollBarY()

      return me
    },

    _endAction: function () {
      var me = this
      me._s.endX = me.x
      me._s.endY = me.y
      me.moving = false

      if (me.o.scrollBarFade && !me.fading) {
        me.fading = true // 标记渐隐滚动条
        if (me.scrollBarX) me._fade(me.scrollBarX, 2000)
        if (me.scrollBarY) me._fade(me.scrollBarY, 2000)
      }
      me._execEvent('scrollEnd')
    },

    _stepBounce: function () {
      var me = this

      me.bouncing = false

      function over () {
        me.scrollTo(me.x, me.y, 300)
      }

      // x方向
      if (me.o.scrollX) {
        if (me.directionX === 1) {
          me.scrollTo(me.minScrollX + 15, me.y, 100, true, over)
          me.x = me.minScrollX
        } else {
          me.scrollTo(me.maxScrollX - 15, me.y, 100, true, over)
          me.x = me.maxScrollX
        }

      // y方向
      } else {
        if (me.directionY === 1) {
          me.scrollTo(me.x, me.minScrollY + 15, 100, true, over)
          me.y = me.minScrollY
        } else {
          me.scrollTo(me.x, me.maxScrollY - 15, 100, true, over)
          me.y = me.maxScrollY
        }
      }
    },

    _x: function (p) {
      var me = this
      var n = me.directionX * p
      if (!isNaN(n)) {
        me.x = me.x + n
        // 达到边界终止惯性，执行回弹
        if (me.x >= me.minScrollX || me.x <= me.maxScrollX) {
          me.moving = false
          if (me.o.bounce) {
            me.bouncing = true // 标记回弹
          }
        }
      }
    },

    _y: function (p) {
      var me = this
      var n = me.directionY * p
      if (!isNaN(n)) {
        me.y = me.y + n
        // 达到边界终止惯性，执行回弹
        if (me.y >= me.minScrollY || me.y <= me.maxScrollY) {
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

        // _do是可变方法，可为_x,_y，在判断方向时判断为何值，避免在次处进行过多的判断操作
        me._do(s)
        me.scrollTo(me.x, me.y, 0, false, null, true)
        me._execEvent('scroll')
      }

      rAF(me._step.bind(me, time))
    },

    _doScroll: function (d, e) {
      var me = this
      me.distance = d
      if (me.o.bounce) {
        me.x = me._compute(me.x, me.minScrollX, me.maxScrollX)
        me.y = me._compute(me.y, me.minScrollY, me.maxScrollY)
      }
      me.scrollTo(me.x, me.y, 0, me.o.bounce, null, true, (e.touches || [e]))
      me._execEvent('scroll', e)
    },

    _start: function (e) {
      var me = this
      var t = e.touches || [e]

      me.distance = 0
      me.lastMoveTime = me.startTime = Date.now()
      if (me.o.scrollX) {
        me._do = me._x
        me._s.lastX = me.startPositionX = me._s.startX = t[0].pageX
      } else {
        me._do = me._y
        me._s.lastY = me.startPositionY = me._s.startY = t[0].pageY
      }

      me._execEvent('scrollStart', e)
    },

    _move: function (e) {
      var me = this
      var t = e.touches || [e]
      var now
      var x
      var y
      var dx
      var dy
      var px
      var py
      var directionX = 1
      var directionY = 1

      now = Date.now()

      if (me.o.scrollBarFade) {
        me.fading = false // 终止滑动条渐隐
        if (me.scrollBarX) me.scrollBarX.style.opacity = 1
        if (me.scrollBarY) me.scrollBarY.style.opacity = 1
      }

      // x方向滑动
      if (me.o.scrollX) {
        x = t[0].pageX
        dx = x - me._s.lastX
        me._s.lastX = x
        directionX = dx >= 0 ? 1 : -1 // 手指滑动方向，1(向右) | -1(向左)
        if (now - me.lastMoveTime > 200 || me.directionX !== directionX) {
          me.startTime = now
          me.startPositionX = x
          me.directionX = directionX
        }
        px = x - me.startPositionX
        me.x = x - me._s.startX + me._s.endX
        me._doScroll(px, e)

      // y方向滑动
      } else {
        y = t[0].pageY
        dy = y - me._s.lastY
        me._s.lastY = y
        directionY = dy >= 0 ? 1 : -1 // 手指滑动方向，1(向下) | -1(向上)
        if (now - me.lastMoveTime > 200 || me.directionY !== directionY) {
          me.startTime = now
          me.startPositionY = y
          me.directionY = directionY
        }
        py = y - me.startPositionY
        me.y = y - me._s.startY + me._s.endY
        me._doScroll(py, e)
      }

      me.lastMoveTime = now
    },

    _end: function (e) {
      var me = this
      var ex1
      var ex2
      var now = Date.now()

      if (e.touches && e.touches.length) {
        return
      }

      me._execEvent('touchEnd')
      JRoll.jrollActive = null
      me.duration = now - me.startTime

      ex1 = me.y > me.minScrollY || me.y < me.maxScrollY
      ex2 = me.x > me.minScrollX || me.x < me.maxScrollX

      // 超出边界回弹
      if (ex1 || ex2) {
        me.scrollTo(me.x, me.y, 300)._endAction()

      // 惯性滑动
      } else if (me.o.momentum && me.duration < 200 && me.distance) {
        me.speed = Math.abs(me.distance / me.duration)
        me.speed = me.speed > 2 ? 2 : me.speed
        me.moving = true
        rAF(me._step.bind(me, now))
      } else {
        me._endAction()
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
