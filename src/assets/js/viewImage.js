//点击查看大图
;(function(undefined) {
  "use strict"
  var _global;

  // 工具函数
  //获取元素相对窗口的位置
  function getElementViewLeft(element){
    var actualLeft = element.offsetLeft;
    var elementScrollLeft = element.scrollLeft;
    var current = element.offsetParent;
    var current1 = element.parentNode;
    while (current !== null){
    　actualLeft += current.offsetLeft;
    　current = current.offsetParent;
    }
    while (current1 !== null && current1 !== document){
      elementScrollLeft += current1.scrollLeft;
　    current1 = current1.parentNode;
    }
    return actualLeft-elementScrollLeft;
  }
  function getElementViewTop(element){
    var actualTop = element.offsetTop;
    var elementScrollTop = element.scrollTop;
    var current = element.offsetParent;
    var current1 = element.parentNode;
    while (current !== null){
    　actualTop += current.offsetTop;
    　current = current.offsetParent;
    }
    while (current1 !== null && current1 !== document){
      elementScrollTop += current1.scrollTop;
　    current1 = current1.parentNode;
    }
    return actualTop-elementScrollTop;
  }
  // 对象合并
  function extend(o,n,override) {
      for(var key in n){
          if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
              o[key]=n[key];
          }
      }
      return o;
  }
  // 通过class查找dom
  if(!('getElementsByClass' in HTMLElement)){
      HTMLElement.prototype.getElementsByClass = function(n){
          var el = [],
              _el = this.getElementsByTagName('*');
          for (var i=0; i<_el.length; i++ ) {
              if (!!_el[i].className && (typeof _el[i].className == 'string') && _el[i].className.indexOf(n) > -1 ) {
                  el[el.length] = _el[i];
              }
          }
          return el;
      };
      ((typeof HTMLDocument !== 'undefined') ? HTMLDocument : Document).prototype.getElementsByClass = HTMLElement.prototype.getElementsByClass;
  }

  // 插件构造函数 - 返回数组结构
  function feeViewImage(opt){
      this._initial(opt);
  }
  feeViewImage.prototype = {
      constructor: this,
      _initial: function(opt) {
        // 默认参数
        var def = {
            imgMaxHeight: 650,
            imgMaxWidth: 500,
            duration: 1000
        };
        this.mask = null;
        this.imgWrapper = null;
        this.def = extend(def,opt,true); //配置参数
        this.left = 0; 
        this.top = 0; 
        this.width = 0; 
        this.height = 0; 
      },
      start: function(callback){
        var _this = this;
        var mask = document.createElement('div');
        var imgWrapper = document.createElement('div');
        imgWrapper.className = 'fee-wrapper';
        mask.appendChild(imgWrapper);
        mask.className = 'fee-mask';
        document.body.appendChild(mask);
        document.onclick = function(e){
          if(e.target.tagName === 'IMG' && e.target.className === ''){
            var left = getElementViewLeft(e.target);
            var top = getElementViewTop(e.target);
            var src = e.target.getAttribute('src');
            if (!src) {
                return
            }
            var width = e.target.offsetWidth;
            var height = e.target.offsetHeight;
            _this.left = left;
            _this.top = top;
            _this.width = width;
            _this.height = height;
            mask.style.zIndex = '10000';
            mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            _this.css(imgWrapper, {
              'background-image': 'url(' + src + ')',
              'left': left + 'px',
              'top': top + 'px',
              'width': width + 'px',
              'height': height + 'px'
            })
            setTimeout(function(){
              var newHeight = _this.def.imgMaxHeight;
              var newWidth = _this.def.imgMaxWidth;
              var newtop = (document.body.clientHeight - newHeight)/2;
              var newleft = (document.body.clientWidth - newWidth)/2;
              _this.css(imgWrapper, {
                'transition': 'all 0.35s ease-in-out',
                'left': newleft + 'px',
                'top': '0px',
                'width': newWidth + 'px',
                'height': '100%'
              })
            }, 150)
            e.stopPropagation();
          } else if (e.target.className.indexOf('fee-mask') >= 0 || e.target.className.indexOf('fee-wrapper') >= 0) {
            _this.css(imgWrapper, {
              'left': _this.left +'px',
              'top': _this.top + 'px',
              'width': _this.width + 'px',
              'height': _this.height + 'px'
            })
            setTimeout(function(){
              imgWrapper.style.transition = 'none';
              mask.style.backgroundColor = 'transparent';
              setTimeout(function(){
                mask.style.zIndex = '-10';
              }, 150);
            }, 400);
            e.stopPropagation();
          }
        }
        callback && callback();
        return this;
      },
      css: function(element, styleObj){
          for(var prop in styleObj){
              var attr = prop.replace(/[A-Z]/g,function(word){
                  return '-' + word.toLowerCase();
              });
              element.style[attr] = styleObj[prop];
          }
          return this;
      }
  }

  // 最后将插件对象暴露给全局对象
  _global = (function(){ return this || (0, eval)('this'); }());
  if (typeof module !== "undefined" && module.exports) {
      module.exports = feeViewImage;
  } else if (typeof define === "function" && define.amd) {
      define(function(){return feeViewImage;});
  } else {
      !('feeViewImage' in _global) && (_global.feeViewImage = feeViewImage);
  }
}());