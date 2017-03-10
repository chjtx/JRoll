/*! JRollViewer v0.2.2 ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/plugins/jroll-viewer */
/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var w = window.innerWidth
  var h = window.innerHeight
  var ratio = w / h
  var currentIndex = 0
  var jrolls = []
  var pointers
  var length = 0

  function createDiv (className) {
    var div = document.createElement('div')
    div.className = className
    return div
  }

  var JRollViewer = function (el, options) {
    var me = this

    w = window.innerWidth
    h = window.innerHeight
    ratio = w / h

    me.el = typeof el === 'string' ? document.querySelector(el) : el

    me.el.addEventListener('click', function (e) {
      me._click(e)
    }, false)

    me.options = {
      JRoll: JRoll
    }

    for (var i in options) {
      me.options[i] = options[i]
    }

    me._init()
  }

  JRollViewer.version = '0.2.2'

  JRollViewer.prototype = {
    // 创建JRollViewer的jroll-style样式
    _createStyle: function () {
      var jstyle = document.getElementById('jroll_style')
      var style = '\n/* jroll-viewer */\n.jroll-viewer{display:none;height:100%;width:100%;overflow:hidden;background:#000;position:absolute;top:0;left:0;z-index:9999}.jroll-viewer.duration{-webkit-transition-duration:200ms;transition-duration:200ms}.jroll-viewer.small{-webkit-transform:scale(0.01,0.01);transform:scale(0.01,0.01);display:block}.jroll-viewer.normal{-webkit-transform:scale(1,1) !important;transform:scale(1,1) !important}.jroll-viewer-scroller{height:100%}.jroll-viewer-page{height:100%;position:absolute}.jroll-viewer-item{width:100%;height:100%;position:relative;overflow:hidden}.jroll-viewer-img{position:absolute;width:100%;height:auto}.jroll-viewer-pointer{color:#fff;font-size:12px;position:absolute;left:0;bottom:40px;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.jroll-viewer-pointer span{display:block;width:4px;height:4px;border-radius:10px;background:#666;float:left;margin:0 5px}.jroll-viewer-pointer span.active{background:#fff}\n'
      if (jstyle) {
        if (!/jroll-viewer/.test(jstyle.innerHTML)) {
          jstyle.innerHTML += style
        }
      } else {
        jstyle = document.createElement('style')
        jstyle.id = 'jroll_style'
        jstyle.innerHTML = style
        document.head.appendChild(jstyle)
      }
    },

    // 创建图片
    _createImg: function (img, imgs) {
      var me = this
      // 创建图片
      var imgHtml = ''
      var pointerHtml = ''
      var index

      length = imgs.length

      if (typeof img === 'number') {
        index = img
      } else {
        index = null
      }

      for (var i = 0; i < length; i++) {
        imgHtml += '<div class="jroll-viewer-page" style="width:' + w + 'px;left:' + (i * w) + 'px">' +
            '<div class="jroll-viewer-item">' +
              '<img src="' + (me.options.data ? imgs[i].dataset[me.options.data] : imgs[i].src) + '" class="jroll-viewer-img">' +
            '</div>' +
          '</div>'

        // <=5张图片用圆点，>5张用数字
        if (length <= 5) {
          pointerHtml += '<span></span>'
        }

        // 计算相应图片位置
        if (index === null) {
          if (typeof img === 'object' && img === imgs[i] ||
            typeof img === 'string' && img === imgs[i].getAttribute('src')) {
            index = i
          }
        }
      }

      me.scroller.innerHTML = imgHtml
      me.pointer.innerHTML = pointerHtml

      // 小圆点
      pointers = me.pointer.querySelectorAll('span')

      // 图片
      var items = me.scroller.querySelectorAll('.jroll-viewer-item')
      var jr
      for (i = 0; i < length; i++) {
        // 每个图片JRoll实例
        jr = new me.options.JRoll(items[i], {
          id: imgs[i].getAttribute('jroll-viewer-id'),
          zoom: true,
          scrollFree: true,
          bounce: false,
          autoStyle: false,
          zoomDuration: 0
        })

        imgs[i].setAttribute('jroll-viewer-id', jr.id)

        // 每个图片滑动事件
        jr.on('scroll', function (e) {
          var _this = this
          if (e) {
            var condition = _this.scroller.offsetHeight <= _this.wrapper.clientHeight || Math.abs(_this.jroll_viewer_start - e.touches[0].pageX) > 50

            // 从右向左交权条件
            var condition1 = _this.x === _this.maxScrollX && condition

            // 从左向右交权条件
            var condition2 = _this.x === _this.minScrollX && condition

            // 将滑动权交给外围JRoll实例
            if ((condition1 || condition2) && e) {
              _this.call(me.jroll, e)
            }
          }
        })
        .on('scrollStart', function (e) {
          this.jroll_viewer_start = e.touches[0].pageX
        })
        .on('zoomStart', function () {
          me.switch(currentIndex)
        })
        .on('zoomEnd', function () {
          var _this = this
          var temp
          if (_this.scroller.jroll_viewer_ratio > ratio) {
            temp = (h - _this.scroller.height * _this._z.scale) / 2
            _this.scroller.style.top = temp < 0 ? 0 : temp + 'px'
          } else {
            temp = (w - _this.scroller.width * _this._z.scale) / 2
            _this.scroller.style.left = temp < 0 ? 0 : temp + 'px'
          }
        })

        // 图片加载完成
        .scroller.onload = function () {
          me._imgOnload(this)
        }

        jrolls.push(jr)
      }

      return index
    },

    // 点击小图
    _click: function (e) {
      var target = e.target
      var me = this
      if (target.tagName === 'IMG' && target.hasAttribute('jroll-viewer-image')) {
        me.show(target)
      }
    },

    // 初始化图片查看框
    _init: function () {
      var me = this

      me.viewer = document.getElementById('jroll_viewer')

      if (me.viewer) {
        me.scroller = me.viewer.querySelector('.jroll-viewer-scroller')
        me.pointer = me.viewer.querySelector('.jroll-viewer-pointer')
        me.jroll = me.scroller.jroll
        return
      }

      me._createStyle()
      me.viewer = createDiv('jroll-viewer')
      me.scroller = createDiv('jroll-viewer-scroller')
      me.pointer = createDiv('jroll-viewer-pointer')

      me.viewer.id = 'jroll_viewer'
      me.viewer.appendChild(me.scroller)
      me.viewer.appendChild(me.pointer)

      document.body.appendChild(me.viewer)

      // 点击退出
      me.viewer.onclick = function () {
        me.hide()
      }

      // 查看器最外围JRoll实例
      me.jroll = new me.options.JRoll(me.viewer, { scrollY: false, scrollX: true, momentum: false, edgeRelease: false })
      .on('scrollStart', function () {
        this.viewerStartTime = new Date().getTime()
      })
      .on('touchEnd', function () {
        var _this = this
        var apart = currentIndex * w + _this.x
        if (_this.x !== _this.minScrollX && _this.x !== _this.maxScrollX && Math.abs(_this.x % w) !== 0) {
          var f
          if (Math.abs(apart) < (new Date().getTime() - _this.viewerStartTime < 300 ? 10 : 100)) {
            f = 0
          } else if (apart > 0) {
            f = -1
          } else {
            f = 1
          }

          me.switch(currentIndex + f, 200)
        }
      })
      .on('scroll', function (e) {
        var _this = this
        var jroll = jrolls[currentIndex]

        // 外围JRoll实例从右向左滑动将滑动权交回当前图片的条件
        var condition1 = _this.directionX === -1 && _this.x < -currentIndex * w && jroll.x > jroll.maxScrollX
        // 外围JRoll实例从左向右滑动将滑动权交回当前图片的条件
        var condition2 = _this.directionX === 1 && _this.x > -currentIndex * w && jroll.x < jroll.minScrollX

        if (condition1 || condition2) {
          _this.scrollTo(-currentIndex * w, 0)
          _this.call(jroll, e)
        }
      })

      window.addEventListener('resize', me._rotate.bind(me))
      window.addEventListener('orientationchange', me._rotate.bind(me))
    },

    // 图片加载完毕
    _imgOnload: function (img) {
      var me = this
      var r = img.width / img.height
      img.jroll_viewer_ratio = r

      // 宽比高长，横向图片
      if (r > ratio) {
        img.style.width = '100%'
        img.style.height = 'auto'
        img.style.left = '0'
        img.style.top = (h - w / r) / 2 + 'px'
        img.jroll.options.zoomMax = me.options.zoomMax || (img.naturalWidth / w) || 3

      // 宽比高短，竖向图片
      } else {
        img.style.width = 'auto'
        img.style.height = '100%'
        img.style.left = (w - h * r) / 2 + 'px'
        img.style.top = '0'
        img.jroll.options.zoomMax = me.options.zoomMax || (img.naturalHeight / h) || 3
      }
      img.jroll.maxScrollX = img.jroll.maxScrollY = img.jroll.minScrollX = img.jroll.minScrollY = 0
    },

    // 屏幕旋转，重置窗口宽高、图片属性
    _rotate: function () {
      w = window.innerWidth
      h = window.innerHeight
      ratio = w / h

      var me = this
      me.jroll.scroller.style.width = w * length + 'px'
      jrolls.forEach(function (j, i) {
        me._imgOnload(j.scroller)
        j.wrapper.parentElement.style.width = w + 'px'
        j.wrapper.parentElement.style.left = w * i + 'px'
      })

      me.switch(currentIndex, 0, true)
    },

    // 重置图片、小圆点
    _reset: function (i) {
      var scroller = jrolls[i].scroller
      var r = scroller.jroll_viewer_ratio
      if (pointers && pointers.length) {
        pointers[i].classList.remove('active')
      }
      if (r > ratio) {
        scroller.style.top = (h - w / r) / 2 + 'px'
      } else {
        scroller.style.left = (w - h * r) / 2 + 'px'
      }
      jrolls[i]._z.scale = 1
      jrolls[i].scrollTo(0, 0).refresh()
    },

    // 更新小圆点
    _dot: function (i) {
      if (pointers && pointers.length) {
        pointers[i].classList.add('active')
      } else {
        this.pointer.innerHTML = (i + 1) + ' / ' + length
      }
    },

    // 切换图片
    switch: function (index, duration, rotateScreen) {
      var me = this
      var oldIndex = currentIndex
      index = parseInt(index)

      if (index >= 0 && index < length) {
        currentIndex = index
      }

      // 当前图片复位
      if (currentIndex === oldIndex) {
        me.jroll.scrollTo(-(w * index), 0, (duration || 0))
        me._dot(currentIndex)

      // 切到新图片
      } else {
        me.jroll.scrollTo(-(w * index), 0, (duration || 0), false, function () {
          for (var i = 0, l = length; i < l; i++) {
            if (i === index) {
              me._dot(i)
              jrolls[i].refresh()
              if (rotateScreen) {
                me._reset(i)
              }
            } else {
              // 重置非当前图片
              me._reset(i)
            }

            // 仅保持前端图片及前后共三张display:block其它为none
            if (i === index || i === index - 1 || i === index + 1) {
              jrolls[i].wrapper.style.display = 'block'
            } else {
              jrolls[i].wrapper.style.display = 'none'
            }
          }
          // 执行切换图片后的回调
          // 有过渡时间才执行
          if (typeof me.options.afterSwitch === 'function' && duration) {
            me.options.afterSwitch(index)
          }
        })
      }
    },

    // 显示查看器
    show: function (param) {
      var me = this
      var index
      var imgs = me.el.querySelectorAll('img[jroll-viewer-image]')

      // 重置外围scroller
      jrolls = []
      // 使用visibility:hidden不用display:none为了让JRoll创建实例时能正确计算高宽位置
      me.viewer.style.visibility = 'hidden'
      me.viewer.style.display = 'block'
      me.viewer.style.top = document.body.scrollTop + 'px'
      me.scroller.style.width = w * imgs.length + 'px'
      me.jroll.refresh()

      // 创建图片
      index = me._createImg(param, imgs)

      // 切换到对应图片
      me.switch(index)

      me.viewer.classList.add('small')

      setTimeout(function () {
        me.viewer.style.visibility = 'visible'
        me.viewer.classList.add('duration')
        me.viewer.classList.add('normal')
      }, 0)
    },

    // 隐藏查看器
    hide: function () {
      var me = this
      me.viewer.classList.remove('normal')
      setTimeout(function () {
        me.viewer.classList.remove('small')
        me.viewer.classList.remove('duration')
        me.viewer.style.display = 'none'
      }, 250)
    }
  }

  // CommonJS/AMD/CMD规范导出JRoll_Viewer
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRollViewer
  }
  if (typeof define === 'function') {
    define(function () {
      return JRollViewer
    })
  }
  window.JRollViewer = JRollViewer
})(window, document, JRoll)
