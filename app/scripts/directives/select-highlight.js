'use strict';

/**
 * @ngdoc directive
 * @name p2pSiteMobApp.directive:ngFocus
 * @description
 * # ngFocus
 */
angular.module('p2pSiteMobApp')
  .directive('selectHighlight', function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.on('click', function() {
          element.addClass('bg-eee');
        })
        setTimeout(function() {
          element.removeClass('bg-eee');
        }, 100);
      }
    };
  });