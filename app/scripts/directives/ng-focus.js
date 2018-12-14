'use strict';

/**
 * @ngdoc directive
 * @name p2pSiteMobApp.directive:ngFocus
 * @description
 * # ngFocus
 */
angular.module('p2pSiteMobApp')
  .directive('ngFocus', function () {
    var FOCUS_CLASS = 'ng-focused';
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$focused = false;
        element.bind('focus', function() {
          element.addClass(FOCUS_CLASS);
          scope.$apply(function() {ctrl.$focused = true;});
        }).bind('blur', function() {
          element.removeClass(FOCUS_CLASS);
          scope.$apply(function() {ctrl.$focused = false;});
        });
      }
    };
  });
