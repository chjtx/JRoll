/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    setTimeout(callback, 17)
  }
  var TSF = JRoll.utils.TSF
  var moveTo = JRoll.utils.moveTo
  var IMG_LOADING = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEU0lEQVRoQ+1aXVITQRDuXs3yKJ7AWEU2vhmqTF6NJxBOIJzAcALwBOIJhBMAJyC+Zq0yPmaWKsMJwEcG3LZ6zaR2k/nbdQUs3dfM9PQ3/fU3PT1BKPm1Wt2tAPFjmWlEdIkAY0K8BIAxpul4cvb5pIwN01isYqQKCN06BHAMAMdCjA6r+MFzKgHgiXWBYFscIUDcl1J+mE7HHCXvrzKAukHkgAzKRMQLQLPZWQ3DsC/EiENe+OqMxNww0fDq+nrTJxpOAK1WtxMgHgFAMyXaTpL44DZAMK0I4FWSxGMbn6wA2HkEOEXEVWWkLAiU8unNw4fNIAjYRgeJ+oD40ofks9zY1kVezTcC0DlfBcREjJbWYEo2Go0NRBwgwHMXmB9p+urs7PNQN04LwOa8MkIAmz45oQOQd2SWQ3sA8MQExEYn7e6shOEX5rzRIMA7IUa8qPbLJ7YLgDIQtboHiPjGEo3plZTri4m9BCCKekcIsGEyZMoBU2L7AvCRZT74hBht5tcqAFhbe9F/EASnOueJ6DsB9F2qsEgPnWrZOB9FvQ0EYNXTfovULQBoR71vJur47rwrIX1+b6+9GEAQvDeMnU7E6OmSCtkOJHJw3sepsmNsOZHfzHkELLt/PhEjY0KXdcx3PEvtShjyIaZTp3kUMgA23tk02NeZquMcrMhk/BcAk4QRfZokcb+qA3XMa0e9qS4KRHQoknhLAbjIlwtq4dtMXJ8zJT+GDzeRxI/RJp1XUj72qQjr2GmTjWfNTpPCkNVx6UuJ1tEoWfeAPsrjKOqNtTVTmu5gu9XdB8S3i/DuQjpNUYii3h4C7C79TvSBAQx15a2pWPuTdDHZtrHECOAu5XMRiDFPiT79B3AblPo3I3AfDrGcjOpL7FkO/N0yatJYIhqLJF6/DY671jBJPfBBdt9LiVlZfaEDyVKfFXPtqEeGWkPbyHLtWJ2/m0pqvuKKJF5V9wGuq18vlRP3gEbtVvcUEJdK+mI5bblI36UaWZsMs75U/kqpvTgAQOESXSc9XLaiVvcLInY04+bX3DkAY8X3q39/IJJ427Vgnb/b/NFe6rMWeqMxRcRHd53Qjpb9+ZWUHXXRKvSFXL1+vgGVaWzxRrDNMs0tV1/W2tjKJNVwP1BRKZvULNG+cxgsArzX3c95fQI4EWJUaHtqm7s2KrGhlGg/SeIdH86rM8YFIop6uwhgbBgDQIE6am1be31oyofZ5CkB7NgeHxYPSRMIW8JmO2/py9oeOPzeg4mGhHggpTzRdTAWT3kjCENvytVUdj0x+YGYhWT27jtOU8peU25urr+uhOFSHeMLwuU8r+H1yIcALjr5pENhjAeI85Row6V6TgC8alYRNhrHvo9zvmhsOSGl3PdpqnkBUA5xe4MQ9xzJ7et/Ns6lTi5jpQCoaIRhOACiQV1AfgdEaQBqR9RTaQCwVQe1qoKoDCAfWvVXBPWQTYh80XC+/y7SowqIn38e2kAN1dhNAAAAAElFTkSuQmCC'
  var IMG_ARROW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACWUlEQVRoQ+2ZQU7DMBBFZwIKW7hBF0nKjiA13VJuACegnAB6AsoJ6A0oJwBOQNkmSMCyThbcALZEIoOMCKqAJrY7EalItx7b/813bI+LsOQ/XHL90ADMOthq+etrtv1c6GqWDabJ3YjLeVYHHKfTW7GsmyJxBHAqRDhcZoBrIcK9pQUAottpHPVqCdB2OsdgWWeF4uoM8PERr672ybLW50EQ0VUcRw+1dIBLlM44rLuQzsRcsawAntcdItFO4TaK+CJEuF9LgLYbTACxEEAKn4qQLXFsA0lhnhvcI6Jflt3XNN14enp4KYtTaWcFaHtdUpn0Lct2k+RuohJbFtMAzGZIHmRFZ0Aem6bpqJZLqMzuKtpZl1AVAsvGZAPYbPmtzLbPkGjuNSIXkwEMuK4TbACe191DgMuyjMl2zpqAE2CIACf/AoCzJvgTB2oJ4LpB3wLoKy0hxAlXXczmgIrwKmIagDyrchsFgC3FLD8KEV4pxhaGsTmgehPN1XDVBA1AnlFdB7iKGm0HHCf4UTKuIPiAqPfeSXT8RvDjeSVJoludb0MLwHUD30K815lANzYj2ta56GkBSDEfBxbiua4wlfiM6DCOo7FKbB6jDVAVhIl4qcUIgBvCVPxCALJz2w1GgHikY/n32EVrA2MHvk5gNxgj4oEJBBFdiDhSugDOG39hADmwZwDBIX7hJTSbFR0ILvGsAKpOcIpnByiD4BZfCcA8iCrEVwYg/2qybXuCn/UBAcj7f+mrtclOxrIL/TZxDiHb0jTtcb2Ffp+rMgCTbJr0aQBMssbZ5x0jdQNAR+TKsgAAAABJRU5ErkJggg=='
  var IMG_FINISH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADMklEQVRoQ+1ZS3LTQBDtFrFZEk6AqYoUdmiBvMU+AeEEOCcAn4BwgoQTJJyAcAJ7bacqYodHXjg3SJaRCjU1LqkYy9LMaCT5UxUv7emZ97pbr9/ICHv+wT3HD08ENlXBTsc9bLda52EUDRcL/z49dy8q8KbjduJW6yciuhDHw9n85mJvCNi25yLACBEPE9CLGZu83gsCtu0NLMRLsU1jotMgmF7tPAHb9s4txC8ieCL6wYLpQPxuJ58Bx/YuEXEFaB54TmSnCCRKw/vdXck8wG/GJivf7VwLFYEHgLvHMHRF6dy5FspRmiVGInoggF4QTP2iebP1FioCzwFnFSePxFYJHB2961mIfEClGv8fI9H3WTBdUaGdIpCn8SlAkjy0WRJbqYAUPNGDFUXun4W/0PFZGycgA6/b91tTIRV4AvjF2OREJ/MbnwMq8Cq936qMaoCHv3Hcn89vxmWyL7USjtM9IaL3QTAdlt1UXK8DHjQlU1tGxUOJyA+jqF80ymXkZENKiJNaBVXy1lQoL2MmJDTBG7dO7kOs0GffiqKPOvrMjdnzdvsWADqyDJqojnSQOU7XR4C3RYcS0T0B9GXmisc6tnebtcTZPblRC6OoY9KahXMguTz7iPjClETeZSR3r8zlXNXr2jKa9O5YRQIQTxmbXJdWHG6TS3gdFbFcK6ElfRm7m1SPt866s8ygMNV8bRld9rHTPUOAr6oMpJ792PZGgNhTrS+626ritFtIXOjY3hUiflJuTjTWBF/KaSrP1bnUq5RJ55B0DQF8Y2xyViZGtVZpp5eX7XZ7LJNX1SH897pkUzoHioDoKJOKhM79VrVHqYc4u5iTsBD5dDX53M3YRDqVTTblMcoWMtH5LJimsl+aAA84tr0LQPxcImONZd+IwHJG6Mqr5rudEslYW1qqhdLoEsrUaPaNK8ADE8vMX/m9Kspgk72fnmlUgTRYIa+NZ79SBVIS/PXgM8sabVJ5xLMqVUCoxMpfQXzqsmCqdKVVHt5aWkgEICpTE56niGwtFUg3d5zuNQJ8eAzDl1WvirrVqZXAUpkODgbi/7i6QEzX1UrAFESVuCcCVbJXR+w/WhqbQHiqjtIAAAAASUVORK5CYII='
  var IMG_STYLE = 'width:24px;height:24px;display:block;'

  JRoll.prototype.pulldown = function (params) {
    var me = this
    var keys = Object.keys(params || {})

    var boxDiv
    var iconSpan
    var textSpan
    var loading
    var rotating
    var angle = 0

    // 默认选项
    var options = {
      iconArrow: "<img style='" + IMG_STYLE + "' src='" + IMG_ARROW + "'>",
      iconLoading: "<img style='" + IMG_STYLE + "' src='" + IMG_LOADING + "'>",
      iconFinish: "<img style='" + IMG_STYLE + "' src='" + IMG_FINISH + "'>",
      textPull: '下拉刷新',
      textRelease: '释放刷新',
      textLoading: '正在加载',
      textFinish: '刷新完成',
      spinning: true, // 应网友要求添加一个选项控制loading时是否旋转icon
      refresh: null // 刷新自定义执行的函数
    }

    for (var k in keys) {
      options[keys[k]] = params[keys[k]]
    }

    // 先行加载图片，触发浏览器缓存起来避免刷新时再加载显得不流畅
    document.createElement('div').innerHTML = options.iconArrow + options.iconLoading + options.iconFinish

    // 创建下拉的div
    boxDiv = document.createElement('div')
    boxDiv.className = 'jroll-plugin-pulldown'
    boxDiv.style.cssText = 'position:absolute;top:-44px;width:100%;height:44px;line-height:44px;font-size:16px;text-align:center;'

    iconSpan = document.createElement('span')
    iconSpan.className = 'jroll-plugin-pulldown-icon'
    iconSpan.style.cssText = 'display:inline-block;width:24px;height:24px;position:absolute;top:10px;left:25%;'
    iconSpan.innerHTML = options.iconArrow
    boxDiv.appendChild(iconSpan)

    textSpan = document.createElement('span')
    textSpan.className = 'jroll-plugin-pulldown-text'
    textSpan.innerHTML = options.textPull
    boxDiv.appendChild(textSpan)

    me.wrapper.appendChild(boxDiv)

    // 监听滑动事件
    me.on('scroll', function () {
      boxDiv.style[TSF] = me.scroller.style[TSF]

      // 达到一定位置显示释放刷新
      if (!loading) {
        if (me.y > 44) {
          iconSpan.style[TSF] = 'rotateZ(180deg)'
          textSpan.innerHTML = options.textRelease
        } else {
          iconSpan.style[TSF] = 'rotateZ(0deg)'
          textSpan.innerHTML = options.textPull
        }
      }
    })
    me.on('touchEnd', function () {
      if (me.y >= 44) {
        // 超过44px禁止回弹
        me.y = 0
        me.options.momentum = false

        // 刷新
        iconSpan.style[TSF] = 'rotateZ(0deg)'
        iconSpan.innerHTML = options.iconLoading
        textSpan.innerHTML = options.textLoading
        setTimeout(function () {
          me.scrollTo(0, 44, 200, true, doRefresh).minScrollY = 44
          moveTo(boxDiv, 0, 44, 200)

          me.options.momentum = true
        }, 10)
      } else if (!loading) {
        moveTo(boxDiv, 0, 0, 200)
      }
    })

    // 执行刷新
    function doRefresh () {
      if (!loading) {
        loading = true
        rotating = true
        angle = 0
        if (options.spinning) {
          makeRotate()
        }
        setTimeout(function () {
          if (typeof options.refresh === 'function') {
            options.refresh(function () {
              // 完成刷新
              rotating = false
              iconSpan.innerHTML = options.iconFinish
              textSpan.innerHTML = options.textFinish

              // 收起刷新栏
              setTimeout(function () {
                moveTo(boxDiv, 0, 0, 200)

                me.scrollTo(0, 0, 200, true, function () {
                  loading = false
                  iconSpan.innerHTML = options.iconArrow
                  textSpan.innerHTML = options.textPull
                }).minScrollY = 0
              }, 500)
            })
          }
        }, 200)
      }
    }

    // 使iconSpan旋转下来
    function makeRotate () {
      angle = angle + 6 >= 360 ? 0 : angle + 6
      iconSpan.style[TSF] = 'rotateZ(' + angle + 'deg)'

      if (rotating) {
        rAF(makeRotate)
      } else {
        iconSpan.style[TSF] = 'rotateZ(0deg)'
      }
    }

    return me
  }

  JRoll.prototype.pulldown.version = '{{version}}'

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
