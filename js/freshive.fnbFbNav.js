// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

    "use strict"; // jshint ;_;

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.


  // window and document are passed through as local variables rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'FNBFbMenu',
      defaults = {
        //dataUrl: "../nav/sample.json"
        dataUrl: "http://fnbsocialmedia.co.za/hubbeta/api/fbmenu?callback=?"
      };

  // The actual plugin constructor
  function FNBFbMenu( element, options ) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  FNBFbMenu.prototype.init = function () {
    // Get data then build menu
    $.when( this.getData() ).then($.proxy(function(data){

      var menu = this.buildMenu($(document.createElement("ul")).addClass("topmenu"), data);

      $(this.element).append(menu).attr("id", "fnb-fb-nav");

    }, this));

  };

  FNBFbMenu.prototype.getData = function () {
    // Responsible for getting the menu data
    return $.getJSON(this.options.dataUrl);
  };

  FNBFbMenu.prototype.buildMenu = function ($parent, data) {
    var self = this;

    $.each(data, function () {
        if (this.Label) {
            // create LI element and append it to the $parent element.
            var $li = $(document.createElement("li"));

            $li.append($("<a href='" + this.Url + "'>" + this.Label + "</a>"));

            if(this.Thumb) {
              var thumb = document.createElement("img");
              thumb.setAttribute("src", this.Thumb);
              $li.find("a")
                .prepend(thumb);
            }

            $li.appendTo($parent);

            if (this.Children && this.Children.length > 0) {
              var $ul = $(document.createElement("ul")).addClass("submenu");
              $ul.appendTo(
                $li.find("a")
                .append($(document.createElement("span")).addClass("arrow-down"))
                .end()
                );
              self.buildMenu($ul, this.Children);
            }
        }
    });

    return $parent;
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new FNBFbMenu( this, options ));
      }
    });
  };

  // Load the plugin
  $(window).on('load', function () {
    $('[data-fnbFbNav="true"]').each(function () {
      var $nav = $(this),
        data = $nav.data();
      // Instantiate a new menu
      $nav.FNBFbMenu(data);
    });
  });

}(jQuery, window));
