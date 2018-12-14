/*
* @Author: yuyang
* @Date:   2016-09-02 16:55:22
* @Last Modified by:   yuyang
* @Last Modified time: 2016-09-07 11:09:49
*/

'use strict';
angular.module('p2pSiteMobApp')
  .directive('autoHeight', function() {
    return {
      restrict: 'A',
      link : function(scope, element,attrs) {
        $('document').ready(function(){
          //初始化宽度、高度
          element.css('min-height', angular.element(window).height() - '50'+"px");
          //当文档窗口发生改变时 触发
          angular.element(window).resize(function(){
            element.css('min-height', angular.element(window).height() - '50'+"px");
          });
        });
      }
    }
  })
