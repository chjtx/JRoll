/*! JRollViewer v0.0.1 ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/ */
/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var w = window.innerWidth
  var h = window.innerHeight
  var ratio = w / h

  function createDiv (className) {
    var div = document.createElement('div')
    div.className = className
    return div
  }

  var JRollViewer = function (options) {
    var me = this
    me.options = {
      images: [],
      JRoll: JRoll
    }

    for (var i in options) {
      me.options[i] = options[i]
    }

    me.currentIndex = 0
    me.jrollImages = []
    me._init()
  }

  JRollViewer.version = '0.0.1'

  JRollViewer.prototype = {
    _createStyle: function () {
      // 创建JRollViewer的jroll-style样式
      var jstyle = document.getElementById('jroll_style')
      var style = '\n/* jroll-infinite */\n.jroll-infinite-hide>*{display:none}.jroll-infinite-hideimg img{display:none}\n'
      if (jstyle) {
        if (!/jroll-infinite/.test(jstyle.innerHTML)) {
          jstyle.innerHTML += style
        }
      } else {
        jstyle = document.createElement('style')
        jstyle.id = 'jroll_style'
        jstyle.innerHTML = style
        document.head.appendChild(jstyle)
      }
    },
    _init: function () {
      var me = this

      me._createStyle()
      me.viewer = createDiv('jroll-viewer')
      var scroller = createDiv('jroll-viewer-scroller')
      var pointer = createDiv('jroll-viewer-pointer')
      var imgs = me.options.images

      scroller.style.width = w * imgs.length + 'px'

      // 创建图片
      var imgHtml = ''
      var pointerHtml = ''
      for (var i = 0, l = imgs.length; i < l; i++) {
        imgHtml += '<div class="jroll-viewer-page" style="width:' + w + 'px;left:' + (i * w) + 'px">' +
            '<div class="jroll-viewer-item">' +
              '<img src="' + imgs[i] + '" class="jroll-viewer-img">' +
            '</div>' +
          '</div>'
        pointerHtml += '<span></span>'
      }

      scroller.innerHTML = imgHtml
      pointer.innerHTML = pointerHtml

      me.viewer.appendChild(scroller)
      me.viewer.appendChild(pointer)

      me.pointers = pointer.querySelectorAll('span')

      // 使用visibility:hidden不用display:none为了让JRoll创建实例时能正确计算高宽位置
      me.viewer.style.visibility = 'hidden'
      document.body.appendChild(me.viewer)

      // 点击退出
      me.viewer.onclick = function () {
        me.hide()
      }

      // 查看器最外围JRoll实例
      me.jroll = new me.options.JRoll(me.viewer, { scrollY: false, scrollX: true, bounce: false, momentum: false })
      .on('touchEnd', function () {
        var _this = this
        var apart = me.currentIndex * w + _this.x
        if (_this.x !== _this.minScrollX && _this.x !== _this.maxScrollX && Math.abs(_this.x % w) !== 0) {
          var f
          if (Math.abs(apart) < w / 10) {
            f = 0
          } else if (apart > 0) {
            f = -1
          } else {
            f = 1
          }

          me.switch(me.currentIndex + f, 200)
        }
      })
      .on('scroll', function (e) {
        var _this = this
        var jroll = me.jrollImages[me.currentIndex]

        // 外围JRoll实例从右向左滑动将滑动权交回当前图片的条件
        var condition1 = _this.directionX === -1 && _this.x < -me.currentIndex * w && jroll.x > jroll.maxScrollX
        // 外围JRoll实例从左向右滑动将滑动权交回当前图片的条件
        var condition2 = _this.directionX === 1 && _this.x > -me.currentIndex * w && jroll.x < jroll.minScrollX

        if (condition1 || condition2) {
          _this.scrollTo(-me.currentIndex * w, 0)
          _this.call(jroll, e)
        }
      })

      // 图片
      var items = scroller.querySelectorAll('.jroll-viewer-item')
      var jrollImg
      for (i = 0, l = items.length; i < l; i++) {
        // 每个图片JRoll实例
        jrollImg = new me.options.JRoll(items[i], { zoom: true, scrollFree: true, bounce: false, autoStyle: false, zoomDuration: 0 })

        // 每个图片滑动事件
        jrollImg.on('scroll', function (e) {
          var _this = this
          if (e) {
            // 从右向左交权条件
            var condition1 = _this.x === _this.maxScrollX &&
              me.currentIndex !== me.jrollImages.length - 1 &&
              _this.jroll_viewer_start - e.touches[0].pageX > 50

            // 从左向右交权条件
            var condition2 = _this.x === _this.minScrollX &&
              me.currentIndex !== 0 &&
              e.touches[0].pageX - _this.jroll_viewer_start > 50

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
          me.switch(me.currentIndex)
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
        me.jrollImages.push(jrollImg)
      }

      me.viewer.style.display = 'none'
      me.viewer.style.visibility = 'visible'

      window.addEventListener('resize', me._compute.bind(me))
      window.addEventListener('orientationchange', me._compute.bind(me))
    },

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
      this.jroll.refresh()
    },

    // 重置宽度
    _compute: function () {
      w = window.innerWidth
      h = window.innerHeight
      ratio = w / h

      var me = this
      me.jroll.scroller.style.width = w * me.options.images.length + 'px'
      me.jrollImages.forEach(function (j, i) {
        me._imgOnload(j.scroller)
        j.wrapper.parentElement.style.width = w + 'px'
        j.wrapper.parentElement.style.left = w * i + 'px'
      })

      me.switch(me.currentIndex, 0, true)
    },

    _reset: function (i) {
      var me = this
      var scroller = me.jrollImages[i].scroller
      me.pointers[i].classList.remove('active')
      if (scroller.jroll_viewer_ratio > ratio) {
        scroller.style.top = (h - scroller.height) / 2 + 'px'
      } else {
        scroller.style.left = (w - scroller.width) / 2 + 'px'
      }
      me.jrollImages[i]._z.scale = 1
      me.jrollImages[i].scrollTo(0, 0).refresh()
    },

    // 切换图片
    switch: function (index, duration, rotateScreen) {
      var me = this

      me.currentIndex = index
      me.jroll.scrollTo(-(w * index), 0, (duration || 0), false, function () {
        for (var i = 0, l = me.pointers.length; i < l; i++) {
          if (i === index) {
            me.pointers[i].classList.add('active')
            if (rotateScreen) {
              me._reset(i)
            }
          } else {
            // 重置非当前图片
            me._reset(i)
          }
        }
      })
    },

    // 显示查看器
    show: function (i) {
      var me = this
      me.viewer.style.display = 'block'
      me.switch(parseInt(i) || 0)
      me.jroll.refresh()
      me.viewer.classList.add('show')
    },

    // 隐藏查看器
    hide: function () {
      var me = this
      me.viewer.classList.remove('show')
      setTimeout(function () {
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
