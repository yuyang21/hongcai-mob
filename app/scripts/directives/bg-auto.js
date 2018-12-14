/*
* 背景图片随页面内容高度覆盖整个页面
*/

'use strict';
angular.module('p2pSiteMobApp')
  .directive('bgAuto', function($window) {
    return {
      restrict: 'A',
      link : function(scope, element,attrs) {
        var width = $window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = $window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        height = element.context.scrollHeight + 80 > height ? element.context.scrollHeight + 50 : height;
        element.css('height', height+'px');
        // element.css('background-color', '#f5f5f5');
        angular.element(window).resize(function(){
          width = $window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          height = $window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          height = element.context.scrollHeight + 80 > height ? element.context.scrollHeight + 50 : height;
          element.css('height', height+'px');
        });

      }
    }
  })
