/*
* @Author: yuyang
* @Date:   2016-09-02 16:55:22
* @Last Modified by:   yuyang
* @Last Modified time: 2016-09-07 11:09:49
*/

'use strict';
angular.module('p2pSiteMobApp')
  .directive('autoH', function($window) {
    return {
      restrict: 'A',
      link : function(scope, element,attrs) {
        var width = $window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = $window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        element.css('height', height+'px');
        element.css('background-color', '#f5f5f5');
        angular.element(window).resize(function(){
          width = $window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          height = $window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
          element.css('height', height+'px');
        });
      }
    }
  })
