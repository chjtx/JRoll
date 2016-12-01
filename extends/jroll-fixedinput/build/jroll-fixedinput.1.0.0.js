/*! JRoll-FixedInput v1.0.0 ~ (c) 2016 Author:BarZu Git:https://git.oschina.net/chenjianlong/JRoll2/ */
(function(window, document, JRoll) {
  "use strict";

  var utils = JRoll.utils;

  function _focusin(e) {
    var me = this;
    var top = utils.computePosition(e.target, me.wrapper).top;
    
    me.scrollTo(me.x, -1*top + me.options.adjustTop, 200, true);
  }

  function _focusout(e) {
    var me = this;
    me.scrollTo(me.x, me.y, 200);
  }


  JRoll.prototype.fixedinput = function(adjustTop) {
    var me = this;

    //安卓手机输入表单时自动调整输入框位置
    me.options.adjustTop = isNaN(adjustTop) ? 10 : adjustTop;

    if (!me.wrapper.jroll_fixedinput) {
      me.wrapper.jroll_fixedinput = 1; //防止多次绑定事件
      me.wrapper.addEventListener("focusin", _focusin.bind(me), false);
      me.wrapper.addEventListener("focusout", _focusout.bind(me), false);
    }

  };

  //CommonJS/AMD/CMD规范导出JRoll
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRoll;
  }
  if (typeof define === 'function') {
    define(function() {
      return JRoll;
    });
  }
})(window, document, JRoll);