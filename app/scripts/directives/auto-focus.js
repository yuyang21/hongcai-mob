'use strict';

/**
 * @ngdoc directive
 * @name o2oWechatIou.directive:ngFocus
 * @description
 * # ngFocus
 */
angular.module('p2pSiteMobApp')
  .directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
        $element[0].focus();
    }
  };
  }]);
