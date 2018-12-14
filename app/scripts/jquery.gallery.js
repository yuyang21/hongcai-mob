(function($, undefined) {

  /*
   * Gallery object.
   */
  $.Gallery = function(options, element) {

    this.$el = $(element);
    this._init(options);

  };

  $.Gallery.defaults = {
    current: 3 // index of current item
  };

  $.Gallery.prototype = {
    _init: function(options) {

      this.options = $.extend(true, {}, $.Gallery.defaults, options);

      this.$container = $('.dg-container');
      this.$wrapper = this.$el.find('.dg-wrapper')
      this.$items = this.$wrapper.children();
      this.itemsCount = this.$items.length;

      this.current = this.options.current;

      this.isAnim = false;

      this._validate();

      this._layout();

      // load the events
      this._loadEvents();

    },
    _validate: function() {

      if (this.options.current < 0 || this.options.current > this.itemsCount - 1) {

        this.current = 3;

      }

    },
    _layout: function() {

      // current, left and right items
      this._setItems();

      // current item is not changed
      // left and right one are rotated and translateXd
      var leftCSS, rightCSS, outleftCSS, outrightCSS, mostoutleftCSS, mostoutrightCSS, currentCSS;
      leftCSS = {
        '-webkit-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-moz-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-o-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-ms-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        'transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        'z-index': 998
      };

      rightCSS = {
        '-webkit-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-moz-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-o-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        '-ms-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        'transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
        'z-index': 998
      };
      outleftCSS = {
        '-webkit-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-moz-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-o-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-ms-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        'transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        'z-index': 997
      };

      outrightCSS = {
        '-webkit-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-moz-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-o-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        '-ms-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        'transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
        'z-index': 997
      };
      mostoutleftCSS = {
        '-webkit-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-moz-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-o-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-ms-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        'transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        'z-index': 996
      };

      mostoutrightCSS = {
        '-webkit-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-moz-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-o-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        '-ms-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        'transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
        'z-index': 996
      };

      currentCSS = {
        '-webkit-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
        '-moz-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
        '-o-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
        '-ms-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
        'transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
        'z-index': 999
      };

      this.$leftItm.css(leftCSS || {});
      this.$rightItm.css(rightCSS || {});
      this.$outleftItm.css(outleftCSS || {});
      this.$outrightItm.css(outrightCSS || {});
      this.$mostoutleftItm.css(mostoutleftCSS || {})
      this.$mostoutrightItm.css(mostoutrightCSS || {})
      this.$currentItm.css(currentCSS || {}).addClass('dg-center');

    },
    _setItems: function() {
      this.$items.removeClass('dg-center');

      this.$currentItm = this.$items.eq(this.current);
      this.$leftItm = this.$items.eq(getNum(this.current - 1));
      this.$rightItm = this.$items.eq(getNum(this.current + 1));
      this.$outleftItm = this.$items.eq(getNum(this.current - 2));
      this.$outrightItm = this.$items.eq(getNum(this.current + 2));
      this.$mostoutleftItm = this.$items.eq(getNum(this.current - 3));
      this.$mostoutrightItm = this.$items.eq(getNum(this.current + 3));

      function getNum(index) {
        if (index > 6) {
          return index - 7
        } else {
          return index
        }

        if (index < 0) {
          return index + 7
        } else {
          return index
        }
      }
    },
    _loadEvents: function() {
      var _self = this;
      var touchXLength = 0;
      var touchXPrev = 0;
      var potentialClicks = {};
      var _now = Date.now;
      var touch = null;
      this.$container.on('touchstart', function(e) {
        touch = e.originalEvent.changedTouches[0];
        e.preventDefault()
        touchXPrev = e.originalEvent.touches[0].pageX
      })
      this.$container.on('touchend', function(e) {
        touchXLength = e.originalEvent.changedTouches[0].pageX - touchXPrev
        if (touchXLength === 0) {
          var clickEvt = new window.CustomEvent('click', {
            'bubbles': true,
            'detail': touch
          });
          e.originalEvent.target.dispatchEvent(clickEvt);
        } else {
          if (touchXLength > 0) {
            _self.options.callback('prev')
            _self._navigate('prev');
            return false;
          } else {
            _self.options.callback('next')
            _self._navigate('next');
            return false;
          }
        }
        console.log(e.originalEvent.changedTouches[0].pageX + " : " + touchXPrev)
      })

      // this.$container.on('touchend', function(e) {
      //   console.log("touchend: "+ e.originalEvent.changedTouches[0].pageX)
      // })

      this.$container.on('webkitTransitionEnd.gallery transitionend.gallery OTransitionEnd.gallery', function(event) {
        _self.$currentItm.addClass('dg-center');
        _self.$items.removeClass('dg-transition');
        _self.isAnim = false;

      });

    },
    _getCoordinates: function(position) {
      switch (position) {
        case 'mostoutleft':
          return {
            '-webkit-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-moz-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-o-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-ms-transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            'transform': 'translateX(-' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            'z-index': 996
          };
          break;
        case 'mostoutright':
          return {
            '-webkit-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-moz-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-o-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            '-ms-transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            'transform': 'translateX(' + this.options.clientW * 0.07 + 'px) scale(0.2)',
            'z-index': 996
          };
          break;
        case 'outleft':
          return {
            '-webkit-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-moz-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-o-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-ms-transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            'transform': 'translateX(-' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            'z-index': 997
          };
          break;
        case 'outright':
          return {
            '-webkit-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-moz-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-o-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            '-ms-transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            'transform': 'translateX(' + this.options.clientW * 0.258 + 'px) translateY(' + this.options.clientH * 0.027 + 'px) scale(0.47)',
            'z-index': 997
          };
          break;
        case 'left':
          return {
            '-webkit-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-moz-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-o-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-ms-transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            'transform': 'translateX(-' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            'z-index': 998
          };
          break;
        case 'right':
          return {
            '-webkit-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-moz-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-o-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            '-ms-transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            'transform': 'translateX(' + this.options.clientW * 0.375 + 'px) translateY(' + this.options.clientH * 0.144 + 'px) scale(0.73)',
            'z-index': 998
          };
          break;
        case 'center':
          return {
            '-webkit-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
            '-moz-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
            '-o-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
            '-ms-transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
            'transform': 'translateY(' + this.options.clientH * 0.2 + 'px)',
            'z-index': 999
          };
          break;
      };

    },
    _navigate: function(dir) {

      if (this.isAnim)
        return false;

      this.isAnim = true;

      switch (dir) {

        case 'next':

          this.current = this.$rightItm.index();

          this.$currentItm.addClass('dg-transition').css(this._getCoordinates('left'));

          this.$rightItm.addClass('dg-transition').css(this._getCoordinates('center'));

          this.$outrightItm.addClass('dg-transition').css(this._getCoordinates('right'));

          this.$mostoutrightItm.addClass('dg-transition').css(this._getCoordinates('outright'));

          this.$leftItm.addClass('dg-transition').css(this._getCoordinates('outleft'));

          this.$outleftItm.addClass('dg-transition').css(this._getCoordinates('mostoutleft'));

          this.$mostoutleftItm.addClass('dg-transition').css(this._getCoordinates('mostoutright'));

          break;

        case 'prev':

          this.current = this.$leftItm.index();

          this.$currentItm.addClass('dg-transition').css(this._getCoordinates('right'));

          this.$rightItm.addClass('dg-transition').css(this._getCoordinates('outright'));

          this.$outrightItm.addClass('dg-transition').css(this._getCoordinates('mostoutright'));

          this.$mostoutrightItm.addClass('dg-transition').css(this._getCoordinates('mostoutleft'));

          this.$leftItm.addClass('dg-transition').css(this._getCoordinates('center'));

          this.$outleftItm.addClass('dg-transition').css(this._getCoordinates('left'));

          this.$mostoutleftItm.addClass('dg-transition').css(this._getCoordinates('outleft'));

          break;

      };

      this._setItems();

    },
    destroy: function() {

      this.$navPrev.off('.gallery');
      this.$navNext.off('.gallery');
      this.$wrapper.off('.gallery');

    }
  };

  var logError = function(message) {
    if (this.console) {
      console.error(message);
    }
  };

  $.fn.gallery = function(options) {

    if (typeof options === 'string') {

      var args = Array.prototype.slice.call(arguments, 1);

      this.each(function() {

        var instance = $.data(this, 'gallery');

        if (!instance) {
          logError("cannot call methods on gallery prior to initialization; " +
            "attempted to call method '" + options + "'");
          return;
        }

        if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
          logError("no such method '" + options + "' for gallery instance");
          return;
        }

        instance[options].apply(instance, args);

      });

    } else {

      this.each(function() {

        var instance = $.data(this, 'gallery');
        if (!instance) {
          $.data(this, 'gallery', new $.Gallery(options, this));
        }
      });

    }

    return this;

  };

})(jQuery);
