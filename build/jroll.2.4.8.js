/*! JRoll v2.4.8 ~ (c) 2015-2017 Author:BarZu Git:https://github.com/chjtx/JRoll Website:http://www.chjtx.com/JRoll/ */
/* global define */
(function (window, document, Math) {
  'use strict'

  var JRoll
  var VERSION = '2.4.8'
  var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    setTimeout(callback, 17)
  }
  var sty = document.createElement('div').style
  var jrollMap = {} // 保存所有JRoll对象
  var ua = navigator.userAgent.toLowerCase()
  var prefix = (function () {
    var vendors = ['OT', 'msT', 'MozT', 'webkitT', 't']
    var transform
    var i = vendors.length

    while (i--) {
      transform = vendors[i] + 'ransform'
      if (transform in sty) return vendors[i]
    }
  })()

  // 实用工具
  var utils = {
    // 兼容
    TSF: prefix + 'ransform',
    TSD: prefix + 'ransitionDuration',
    TFO: prefix + 'ransformOrigin',
    isAndroid: /android/.test(ua),
    isIOS: /iphone|ipad/.test(ua),
    isMobile: /mobile|phone|android|pad/.test(ua),

    // 判断浏览是否支持perspective属性，从而判断是否支持开启3D加速
    translateZ: (function (pre) {
      var f
      if (pre) {
        f = pre + 'Perspective' in sty
      } else {
        f = 'perspective' in sty
      }
      return f ? ' translateZ(0px)' : ''
    })(prefix.substr(0, prefix.length - 1)),

    // 计算相对偏移，a相对于b的偏移
    computeTranslate: function (a, b) {
      var x = 0
      var y = 0
      var s
      while (a) {
        s = window.getComputedStyle(a)[utils.TSF].replace(/matrix\(|\)/g, '').split(', ')
        x += parseInt(s[4]) || 0
        y += parseInt(s[5]) || 0
        a = a.parentElement
        if (a === b) {
          a = null
        }
      }
      return {
        x: x,
        y: y
      }
    },

    // 计算相对位置，a相对于b的位置
    computePosition: function (a, b) {
      var left = 0
      var top = 0
      while (a) {
        left += a.offsetLeft
        top += a.offsetTop
        a = a.offsetParent
        if (a === b) {
          a = null
        }
      }
      return {
        left: left,
        top: top
      }
    },

    /**
     * 在指定时间内将指定元素从开始位置移到结束位置并执行回调方法
     * el 必须是dom元素，必填
     * x,y 结束位置，必填
     * duration 过渡时长，单位ms，可选
     * callback 回调方法，可选
     */
    moveTo: function (el, x, y, duration, callback) {
      var startX = 0
      var startY = 0
      var endX
      var endY
      var zoom = 1
      var stepX
      var stepY
      var d
      var result
      result = /translate\(([-\d.]+)px,\s+([-\d.]+)px\)\s+(?:translateZ\(0px\)\s+)?scale\(([\d.]+)\)/.exec(el.style[utils.TSF])
      if (result) {
        startX = Number(result[1])
        startY = Number(result[2])
        zoom = Number(result[3])
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
        el.style[utils.TSF] = 'translate(' + endX + 'px, ' + endY + 'px)' + utils.translateZ + ' scale(' + zoom + ')'

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
     * force 强制查找，忽略textarea
     */
    findScroller: function (el, force) {
      var id
      // 遇到document或带垂直滚动条的textarea终止查找
      if (force || !(el.tagName === 'TEXTAREA' && el.scrollHeight > el.offsetHeight)) {
        while (el !== document) {
          id = el.getAttribute('jroll-id')
          if (id) {
            return jrollMap[id]
          }
          el = el.parentNode
        }
      }
      return null
    },
    // 一层一层往上查找所有已实例化的jroll
    findAllJRolls: function (el, force) {
      var jrolls = []
      var id
      // 遇到document或带垂直滚动条的textarea终止查找
      if (force || !(el.tagName === 'TEXTAREA' && el.scrollHeight > el.offsetHeight)) {
        while (el !== document) {
          id = el.getAttribute('jroll-id')
          if (id) {
            jrolls.push(jrollMap[id])
          }
          el = el.parentNode
        }
      }
      return jrolls
    }
  }

  function _touchstart (e) {
    var jrolls = utils.findAllJRolls(e.target)
    var l = jrolls.length
    if (l) {
      JRoll.jrollActive = jrolls[0]

      while (l--) {
        if (jrolls[l].moving) {
          e.preventDefault() // 防止按停滑动时误触a链接
          jrolls[l]._endAction() // 结束并终止惯性
        }
      }

      JRoll.jrollActive._start(e)
    } else {
      JRoll.jrollActive = null
    }
  }

  function _touchmove (e) {
    if (JRoll.jrollActive) {
      var activeElement = document.activeElement
      if (JRoll.jrollActive.options.preventDefault) {
        e.preventDefault()
      }
      if (utils.isMobile && JRoll.jrollActive.options.autoBlur && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur()
      }
      JRoll.jrollActive._move(e)
    }
  }

  function _touchend () {
    if (JRoll.jrollActive) {
      JRoll.jrollActive._end()
    }
  }

  function _resize () {
    setTimeout(function () {
      for (var i in jrollMap) {
        jrollMap[i].refresh().scrollTo(jrollMap[i].x, jrollMap[i].y, 200)
      }
    }, 600)
  }

  function _wheel (e) {
    var jroll = utils.findScroller(e.target)
    if (jroll) {
      jroll._wheel(e)
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
  addEvent(utils.isMobile ? 'touchstart' : 'mousedown', _touchstart)
  addEvent(utils.isMobile ? 'touchmove' : 'mousemove', _touchmove)
  addEvent(utils.isMobile ? 'touchend' : 'mouseup', _touchend)
  if (utils.isMobile) {
    addEvent('touchcancel', _touchend)
  } else {
    addEvent(/firefox/.test(ua) ? 'DOMMouseScroll' : 'mousewheel', _wheel)
  }
  window.addEventListener('resize', _resize)
  window.addEventListener('orientationchange', _resize)

  JRoll = function (el, options) {
    var me = this

    me.wrapper = typeof el === 'string' ? document.querySelector(el) : el
    me.scroller = options && options.scroller ? (typeof options.scroller === 'string' ? document.querySelector(options.scroller) : options.scroller) : me.wrapper.children[0]

    // 防止重复多次new JRoll
    if (me.scroller.jroll) {
      me.scroller.jroll.refresh()
      return me.scroller.jroll
    } else {
      me.scroller.jroll = me
    }

    this._init(el, options)
  }

  JRoll.version = VERSION

  JRoll.utils = utils

  JRoll.jrollMap = jrollMap

  JRoll.prototype = {
    // 初始化
    _init: function (el, options) {
      var me = this

      // 计算wrapper相对document的位置
      me.wrapperOffset = utils.computePosition(me.wrapper, document.body)

      // 创建ID
      me.id = (options && options.id) || me.scroller.getAttribute('jroll-id') || 'jroll_' + Math.random().toString().substr(2, 8)

      // 保存jroll对象
      me.scroller.setAttribute('jroll-id', me.id)
      jrollMap[me.id] = me

      // 默认选项
      me.options = {
        scrollX: false,
        scrollY: true,
        scrollFree: false, // 自由滑动
        minX: null, // 向左滑动的边界值，默认为0
        maxX: null, // 向右滑动的边界值，默认为scroller的宽*-1
        minY: null, // 向下滑动的边界值，默认为0
        maxY: null, // 向上滑动的边界值，默认为scroller的高*-1
        zoom: false, // 使能缩放
        zoomMin: 1, // 最小缩放倍数
        zoomMax: 4, // 最大缩放倍数
        zoomDuration: 400, // 缩放结束后回到限定位置的过渡时间
        bounce: true, // 回弹
        scrollBarX: false, // 开启x滚动条
        scrollBarY: false, // 开启y滚动条
        scrollBarFade: false, // 滚动条使用渐隐模式
        preventDefault: true, // 禁止touchmove默认事件
        momentum: true, // 滑动结束平滑过渡
        autoStyle: true, // 自动为wrapper和scroller添加样式
        autoBlur: true,  // 在滑动时自动将input/textarea失焦
        edgeRelease: true // 边缘释放，滑动到上下边界自动结束，解决手指滑出屏幕没触发touchEnd事件的问题
      }

      for (var i in options) {
        if (i !== 'scroller') {
          me.options[i] = options[i]
        }
      }

      if (me.options.autoStyle) {
        // 将wrapper设为relative
        if (window.getComputedStyle(me.wrapper).position === 'static') {
          me.wrapper.style.position = 'relative'
          me.wrapper.style.top = '0'
          me.wrapper.style.left = '0'
        }
        me.wrapper.style.overflow = 'hidden'
        me.scroller.style.minHeight = '100%'
      }

      me.scroller.style.touchAction = 'none'

      me.x = 0
      me.y = 0

      /**
       * 当前状态，可取值：
       * null
       * preScroll(准备滑动)
       * preZoom(准备缩放)
       * scrollX(横向)
       * scrollY(竖向)
       * scrollFree(各个方向)
       */
      me.s = null
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

      me._z = {
        spacing: 0, // 两指间间距
        scale: 1,
        startScale: 1
      }

      me._event = {
        'scrollStart': [],
        'scroll': [],
        'scrollEnd': [],
        'zoomStart': [],
        'zoom': [],
        'zoomEnd': [],
        'refresh': [],
        'touchEnd': []
      }

      me.refresh(true)
    },

    // 开启
    enable: function () {
      var me = this
      me.scroller.setAttribute('jroll-id', me.id)
      return me
    },

    // 关闭
    disable: function () {
      var me = this
      me.scroller.removeAttribute('jroll-id')
      return me
    },

    // 销毁
    destroy: function () {
      var me = this
      delete jrollMap[me.id]
      delete me.scroller.jroll
      if (me.scrollBarX) {
        me.wrapper.removeChild(me.scrollBarX)
      }
      if (me.scrollBarY) {
        me.wrapper.removeChild(me.scrollBarY)
      }
      me.disable()
      me.scroller.style[utils.tSF] = ''
      me.scroller.style[utils.tSD] = ''
      me.prototype = null
      for (var i in me) {
        if (me.hasOwnProperty(i)) {
          delete me[i]
        }
      }
    },

    // 替换对象
    call: function (target, e) {
      var me = this
      me.scrollTo(me.x, me.y)
      JRoll.jrollActive = target
      if (e) target._start(e)
      return target
    },

    // 刷新JRoll的宽高
    refresh: function (notRefreshEvent) {
      var me = this
      var wrapperStyle = window.getComputedStyle(me.wrapper)
      var scrollerStyle = window.getComputedStyle(me.scroller)
      var paddingX
      var paddingY
      var marginX
      var marginY
      var temp
      var size

      me.wrapperWidth = me.wrapper.clientWidth
      me.wrapperHeight = me.wrapper.clientHeight

      me.scrollerWidth = Math.round(me.scroller.offsetWidth * me._z.scale)
      me.scrollerHeight = Math.round(me.scroller.offsetHeight * me._z.scale)

      // 解决wrapper的padding和scroller的margin造成maxWidth/maxHeight计算错误的问题
      paddingX = parseInt(wrapperStyle['padding-left']) + parseInt(wrapperStyle['padding-right'])
      paddingY = parseInt(wrapperStyle['padding-top']) + parseInt(wrapperStyle['padding-bottom'])
      marginX = parseInt(scrollerStyle['margin-left']) + parseInt(scrollerStyle['margin-right'])
      marginY = parseInt(scrollerStyle['margin-top']) + parseInt(scrollerStyle['margin-bottom'])

      // 最大/最小范围
      me.minScrollX = me.options.minX === null ? 0 : me.options.minX
      me.maxScrollX = me.options.maxX === null ? me.wrapperWidth - me.scrollerWidth - paddingX - marginX : me.options.maxX
      me.minScrollY = me.options.minY === null ? 0 : me.options.minY
      me.maxScrollY = me.options.maxY === null ? me.wrapperHeight - me.scrollerHeight - paddingY - marginY : me.options.maxY

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
      if (me.options.scrollBarX) {
        if (!me.scrollBarX) {
          temp = me._createScrollBar('jroll-xbar', 'jroll-xbtn', false)
          me.scrollBarX = temp[0]
          me.scrollBtnX = temp[1]
        }
        me.scrollBarScaleX = me.wrapper.clientWidth / me.scrollerWidth
        size = Math.round(me.scrollBarX.clientWidth * me.scrollBarScaleX)
        me.scrollBtnX.style.width = (size > 8 ? size : 8) + 'px'
        me._runScrollBarX()
      } else if (me.scrollBarX) {
        me.wrapper.removeChild(me.scrollBarX)
        me.scrollBarX = null
      }
      // y滚动条
      if (me.options.scrollBarY) {
        if (!me.scrollBarY) {
          temp = me._createScrollBar('jroll-ybar', 'jroll-ybtn', true)
          me.scrollBarY = temp[0]
          me.scrollBtnY = temp[1]
        }
        me.scrollBarScaleY = me.wrapper.clientHeight / me.scrollerHeight
        size = Math.round(me.scrollBarY.clientHeight * me.scrollBarScaleY)
        me.scrollBtnY.style.height = (size > 8 ? size : 8) + 'px'
        me._runScrollBarY()
      } else if (me.scrollBarY) {
        me.wrapper.removeChild(me.scrollBarY)
        me.scrollBarY = null
      }

      if (!notRefreshEvent) {
        me._execEvent('refresh')
      }

      return me
    },

    scale: function (multiple) {
      var me = this
      var z = parseFloat(multiple)
      if (!isNaN(z)) {
        me.scroller.style[utils.TFO] = '0 0'
        me._z.scale = z
        me.refresh()._scrollTo(me.x, me.y)
        me.scrollTo(me.x, me.y, 400)
      }
      return me
    },

    _wheel: function (e) {
      var me = this
      var y = e.wheelDelta || -(e.detail / 3) * 120 // 兼容火狐
      if (me.options.scrollY || me.options.scrollFree) {
        me.scrollTo(me.x, me._compute(me.y + y, me.minScrollY, me.maxScrollY))
      }
    },

    // 滑动滚动条
    _runScrollBarX: function () {
      var me = this
      var x = Math.round(-1 * me.x * me.scrollBarScaleX)

      me._scrollTo.call({
        scroller: me.scrollBtnX,
        _z: {
          scale: 1
        }
      }, x, 0)
    },
    _runScrollBarY: function () {
      var me = this
      var y = Math.round(-1 * me.y * me.scrollBarScaleY)

      me._scrollTo.call({
        scroller: me.scrollBtnY,
        _z: {
          scale: 1
        }
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

      if (me.options.scrollBarFade) {
        bar.style.opacity = 0
      }

      bar.appendChild(btn)
      me.wrapper.appendChild(bar)

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
        case 'zoomStart':
          me._event.zoomStart.push(callback)
          break
        case 'zoom':
          me._event.zoom.push(callback)
          break
        case 'zoomEnd':
          me._event.zoomEnd.push(callback)
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
        if (me.options.bounce && (val > (min + 10))) {
          return Math.round(min + ((val - min) / 4))
        } else {
          return min
        }
      }

      if (val < max) {
        if (me.options.bounce && (val < (max - 10))) {
          return Math.round(max + ((val - max) / 4))
        } else {
          return max
        }
      }

      return val
    },

    _scrollTo: function (x, y) {
      this.scroller.style[utils.TSF] = 'translate(' + x + 'px, ' + y + 'px)' + utils.translateZ + ' scale(' + this._z.scale + ')'
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
        utils.moveTo(me.scroller, me.x, me.y, timing, callback)
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

      if (me.options.scrollBarFade && !me.fading) {
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
        me.scrollTo(me.x, me.y, 100)
      }

      // y方向
      if (me.s === 'scrollY') {
        if (me.directionY === 1) {
          me.scrollTo(me.x, me.minScrollY + 20, 100, true, over)
          me.y = me.minScrollY
        } else {
          me.scrollTo(me.x, me.maxScrollY - 20, 100, true, over)
          me.y = me.maxScrollY
        }

      // x方向
      } else if (me.s === 'scrollX') {
        if (me.directionX === 1) {
          me.scrollTo(me.minScrollX + 20, me.y, 100, true, over)
          me.x = me.minScrollX
        } else {
          me.scrollTo(me.maxScrollX - 20, me.y, 100, true, over)
          me.x = me.maxScrollX
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
          if (me.options.bounce) {
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
          if (me.options.bounce) {
            me.bouncing = true // 标记回弹
          }
        }
      }
    },

    _xy: function (p) {
      var me = this
      var x = Math.round(me.cosX * p)
      var y = Math.round(me.cosY * p)
      if (!isNaN(x) && !isNaN(y)) {
        me.x = me.x + x
        me.y = me.y + y
        // 达到边界终止惯性，执行回弹
        if ((me.x >= me.minScrollX || me.x <= me.maxScrollX) && (me.y >= me.minScrollY || me.y <= me.maxScrollY)) {
          me.moving = false
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

        // _do是可变方法，可为_x,_y或_xy，在判断方向时判断为何值，避免在次处进行过多的判断操作
        me._do(s)
        me.scrollTo(me.x, me.y, 0, false, null, true)
        me._execEvent('scroll')
      }

      rAF(me._step.bind(me, time))
    },

    _doScroll: function (d, e) {
      var me = this
      var pageY
      me.distance = d
      if (me.options.bounce) {
        me.x = me._compute(me.x, me.minScrollX, me.maxScrollX)
        me.y = me._compute(me.y, me.minScrollY, me.maxScrollY)
      }
      me.scrollTo(me.x, me.y, 0, me.options.bounce, null, true, (e.touches || [e]))
      me._execEvent('scroll', e)

      // 解决垂直滑动超出屏幕边界时捕捉不到touchend事件无法执行结束方法的问题
      if (e && e.touches && me.options.edgeRelease) {
        pageY = e.touches[0].pageY
        if (pageY <= 10 || pageY >= window.innerHeight - 10) {
          me._end()
        }
      }
    },

    _start: function (e) {
      var me = this
      var t = e.touches || [e]

      // 判断滑动
      if ((me.options.scrollX || me.options.scrollY || me.options.scrollFree) && (t.length === 1 || !me.options.zoom)) {
        me.s = 'preScroll'
        me.distance = 0
        me.lastMoveTime = me.startTime = Date.now()
        me._s.lastX = me.startPositionX = me._s.startX = t[0].pageX
        me._s.lastY = me.startPositionY = me._s.startY = t[0].pageY

        me._execEvent('scrollStart', e)
        return
      } else {
        me.s = null
      }

      // 判断缩放
      if (me.options.zoom && t.length > 1) {
        me.s = 'preZoom'
        me.scroller.style[utils.TFO] = '0 0'

        var c1 = Math.abs(t[0].pageX - t[1].pageX)
        var c2 = Math.abs(t[0].pageY - t[1].pageY)

        me._z.spacing = Math.sqrt(c1 * c1 + c2 * c2)
        me._z.startScale = me._z.scale

        me.originX = (t[0].pageX - t[1].pageX) / 2 + t[1].pageX -
          (utils.computePosition(me.scroller, document.body).left +
          utils.computeTranslate(me.scroller, document.body).x)

        me.originY = (t[0].pageY - t[1].pageY) / 2 + t[1].pageY -
          (utils.computePosition(me.scroller, document.body).top +
          utils.computeTranslate(me.scroller, document.body).y)

        me._execEvent('zoomStart', e)
        return
      }
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
      var sqrtXY
      var directionX = 1
      var directionY = 1

      x = t[0].pageX
      y = t[0].pageY
      dx = x - me._s.lastX
      dy = y - me._s.lastY

      me._s.lastX = x
      me._s.lastY = y

      directionX = dx >= 0 ? 1 : -1 // 手指滑动方向，1(向右) | -1(向左)
      directionY = dy >= 0 ? 1 : -1 // 手指滑动方向，1(向下) | -1(向上)

      now = Date.now()

      if (now - me.lastMoveTime > 200 || me.directionX !== directionX || me.directionY !== directionY) {
        me.startTime = now
        me.startPositionX = x
        me.startPositionY = y
        me.directionX = directionX
        me.directionY = directionY
      }

      me.lastMoveTime = now

      px = x - me.startPositionX
      py = y - me.startPositionY

      // 判断滑动方向
      if (me.s === 'preScroll') {
        if (me.options.scrollBarFade) {
          me.fading = false // 终止滑动条渐隐
          if (me.scrollBarX) me.scrollBarX.style.opacity = 1
          if (me.scrollBarY) me.scrollBarY.style.opacity = 1
        }

        // 判断为y方向，y方向滑动较常使用，因此优先判断
        if (!me.options.scrollFree && me.options.scrollY && (!me.options.scrollX || Math.abs(y - me._s.startY) >= Math.abs(x - me._s.startX))) {
          me._do = me._y
          me.s = 'scrollY'
          return
        }

        // 判断为x方向
        if (!me.options.scrollFree && me.options.scrollX && (!me.options.scrollY || Math.abs(y - me._s.startY) < Math.abs(x - me._s.startX))) {
          me._do = me._x
          me.s = 'scrollX'
          return
        }

        // 判断为任意方向，自由滑动
        if (me.options.scrollFree) {
          me._do = me._xy
          me.s = 'scrollFree'
          return
        }
      }

      // y方向滑动
      if (me.s === 'scrollY') {
        me.y = y - me._s.startY + me._s.endY
        me._doScroll(py, e)
        return
      }

      // x方向滑动
      if (me.s === 'scrollX') {
        me.x = x - me._s.startX + me._s.endX
        me._doScroll(px, e)
        return
      }

      // 任意方向滑动
      if (me.s === 'scrollFree') {
        me.x = x - me._s.startX + me._s.endX
        me.y = y - me._s.startY + me._s.endY
        sqrtXY = Math.sqrt(px * px + py * py)
        me.cosX = px / sqrtXY
        me.cosY = py / sqrtXY
        me._doScroll(Math.sqrt(px * px + py * py), e)
        return
      }

      // 缩放
      if (me.s === 'preZoom') {
        var c1 = Math.abs(t[0].pageX - t[1].pageX)
        var c2 = Math.abs(t[0].pageY - t[1].pageY)
        var spacing = Math.sqrt(c1 * c1 + c2 * c2)
        var scale = spacing / me._z.spacing * me._z.startScale
        var lastScale

        if (scale < me.options.zoomMin) {
          scale = me.options.zoomMin
        } else if (scale > me.options.zoomMax) {
          scale = me.options.zoomMax
        }

        lastScale = scale / me._z.startScale

        me.x = Math.round(me.originX - me.originX * lastScale + me._s.endX)
        me.y = Math.round(me.originY - me.originY * lastScale + me._s.endY)
        me._z.scale = scale

        me._scrollTo(me.x, me.y)
        me._execEvent('zoom', e)

        return
      }
    },

    _end: function () {
      var me = this
      var ex1
      var ex2
      var now = Date.now()
      var s1 = me.s === 'scrollY'
      var s2 = me.s === 'scrollX'
      var s3 = me.s === 'scrollFree'

      JRoll.jrollActive = null

      me._execEvent('touchEnd')

      // 滑动结束
      if (s1 || s2 || s3) {
        me.duration = now - me.startTime

        ex1 = me.y > me.minScrollY || me.y < me.maxScrollY
        ex2 = me.x > me.minScrollX || me.x < me.maxScrollX

        // 超出边界回弹
        if ((s1 && ex1) || (s2 && ex2) || (s3 && (ex1 || ex2))) {
          me.scrollTo(me.x, me.y, 300)._endAction()

        // 惯性滑动
        } else if (me.options.momentum && me.duration < 200 && me.distance) {
          me.speed = Math.abs(me.distance / me.duration)
          me.speed = me.speed > 2 ? 2 : me.speed
          me.moving = true
          rAF(me._step.bind(me, now))
        } else {
          me._endAction()
        }
        return
      }

      // 缩放结束
      if (me.s === 'preZoom') {
        if (me._z.scale > me.options.zoomMax) {
          me._z.scale = me.options.zoomMax
        } else if (me._z.scale < me.options.zoomMin) {
          me._z.scale = me.options.zoomMin
        }

        me.refresh()

        me.scrollTo(me.x, me.y, me.options.zoomDuration)

        me._execEvent('zoomEnd')

        return
      }

      // 隐藏滑动条
      if ((me.s === 'preScroll' || me.s === 'preZoom') && me.options.scrollBarFade && !me.fading) {
        me.fading = true
        if (me.scrollBarX) me._fade(me.scrollBarX, 2000)
        if (me.scrollBarY) me._fade(me.scrollBarY, 2000)
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
