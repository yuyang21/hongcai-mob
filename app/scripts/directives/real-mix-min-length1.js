'use strict';

/**
 * @ngdoc directive
 * @name o2oWechatIou.directive:realMixMinLength
 * @description
 * # realMixMinLength
 */
angular.module('p2pSiteMobApp')
  .directive('realMixMinLength', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, ele, attrs, ctrl) {
        var minLen = + attrs.realMixMinLength;
        //View -> Model的更新
        ctrl.$parsers.unshift(function (str) {
          var len = str.match(/[^ -~]/g) === null ? str.length : str.length + str.match(/[^ -~]/g).length;
          if( len >= minLen ){
            ctrl.$setValidity('minlength', true);
            return str;
          } else{
            ctrl.$setValidity('minlength', false);
            return undefined;
          }
        });
      }
    };
  });
