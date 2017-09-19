
/*
TendinaTree jQuery plugin v0.8.1

Copyright (c) 2014 Ivan Prignano
Released under the MIT License
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  (function($, window) {
    var TendinaTree;
    TendinaTree = (function() {
      TendinaTree.prototype.defaults = {
        animate: true,
        speed: 500
      };

      function TendinaTree(el, options) {
        this._clickHandler = __bind(this._clickHandler, this);
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(el);
        this._checkOptions();
        this.$el.addClass('tendinaTree');
        this.firstLvlSubmenu = ".tendinaTree > li";
        this.secondLvlSubmenu = ".tendinaTree > li > ul > li";
        this.firstLvlSubmenuLink = "" + this.firstLvlSubmenu + " > p";
        this.secondLvlSubmenuLink = "" + this.secondLvlSubmenu + " > p";
        this._hideSubmenus();
        this._bindEvents();
      }

      TendinaTree.prototype._bindEvents = function() {
        return $(document).on('click.tendinaTree', "" + this.firstLvlSubmenuLink + ", " + this.secondLvlSubmenuLink, this._clickHandler);
      };

      TendinaTree.prototype._unbindEvents = function() {
        return $(document).off('click.tendinaTree');
      };

      TendinaTree.prototype._isFirstLevel = function(clickedEl) {
        if ($(clickedEl).parent().parent().hasClass('tendinaTree')) {
          return true;
        }
      };

      TendinaTree.prototype._clickHandler = function(event) {
        var clickedEl, submenuLevel;
        clickedEl = event.currentTarget;
        submenuLevel = this._isFirstLevel(clickedEl) ? this.firstLvlSubmenu : this.secondLvlSubmenu;
        if (this._hasChildenAndIsHidden(clickedEl)) {
          event.preventDefault();
          return this._openSubmenu(submenuLevel, clickedEl);
        } else if (this._isCurrentlyOpen(clickedEl)) {
          event.preventDefault();
          return this._closeSubmenu(clickedEl);
        }
      };

      TendinaTree.prototype._openSubmenu = function(el, clickedEl) {
        var $clickedNestedMenu, $firstNestedMenu, $lastNestedMenu;
        $firstNestedMenu = $(el).find('> ul');
        $lastNestedMenu = $(el).find('> ul > li > ul');
        $clickedNestedMenu = $(clickedEl).next('ul');
        $(el).removeClass('selected');
        $(clickedEl).parent().addClass('selected');
        this._close($firstNestedMenu);
        this._open($clickedNestedMenu);
        if (el === this.firstLvlSubmenu) {
          $(el).find('> ul > li').removeClass('selected');
          this._close($lastNestedMenu);
        }
        if (this.options.openCallback) {
          return this.options.openCallback($(clickedEl).parent());
        }
      };

      TendinaTree.prototype._closeSubmenu = function(el) {
        var $clickedNestedMenu;
        $clickedNestedMenu = $(el).next('ul');
        $(el).parent().removeClass('selected');
        this._close($clickedNestedMenu);
        if (this.options.closeCallback) {
          return this.options.closeCallback($(el).parent());
        }
      };

      TendinaTree.prototype._open = function($el) {
        if (this.options.animate) {
          return $el.slideDown(this.options.speed);
        } else {
          return $el.show();
        }
      };

      TendinaTree.prototype._close = function($el) {
        if (this.options.animate) {
          return $el.slideUp(this.options.speed);
        } else {
          return $el.hide();
        }
      };

      TendinaTree.prototype._hasChildenAndIsHidden = function(el) {
        return $(el).next('ul').length > 0 && $(el).next('ul').is(':hidden');
      };

      TendinaTree.prototype._isCurrentlyOpen = function(el) {
        return $(el).parent().hasClass('selected');
      };

      TendinaTree.prototype._hideSubmenus = function() {
        $("" + this.firstLvlSubmenu + " > ul, " + this.secondLvlSubmenu + " > ul").hide();
        return $("" + this.firstLvlSubmenu + " > ul").removeClass('selected');
      };

      TendinaTree.prototype._showSubmenus = function() {
        $("" + this.firstLvlSubmenu + " > ul, " + this.secondLvlSubmenu + " > ul").show();
        return $("" + this.firstLvlSubmenu).removeClass('selected');
      };

      TendinaTree.prototype._checkOptions = function() {
        if (this.options.animate !== true || false) {
          console.warn("jQuery.fn.TendinaTree - '" + this.options.animate + "' is not a valid parameter for the 'animate' option. Falling back to default value.");
        }
        if (this.options.speed !== parseInt(this.options.speed)) {
          return console.warn("jQuery.fn.TendinaTree - '" + this.options.speed + "' is not a valid parameter for the 'speed' option. Falling back to default value.");
        }
      };

      TendinaTree.prototype.destroy = function() {
        this.$el.removeData('tendinaTree');
        this._unbindEvents();
        this._showSubmenus();
        this.$el.removeClass('tendinaTree');
        return this.$el.find('.selected').removeClass('selected');
      };

      TendinaTree.prototype.hideAll = function() {
        return this._hideSubmenus();
      };

      TendinaTree.prototype.showAll = function() {
        return this._showSubmenus();
      };

      return TendinaTree;

    })();
    return $.fn.extend({
      tendinaTree: function() {
        var args, option;
        option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data('tendinaTree');
          if (!data) {
            $this.data('tendinaTree', (data = new TendinaTree(this, option)));
          }
          if (typeof option === 'string') {
            return data[option].apply(data, args);
          }
        });
      }
    });
  })(window.jQuery, window);

}).call(this);
