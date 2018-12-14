'use strict';
angular.module('p2pSiteMobApp').directive('checkMobileCaptcha', function($http, DEFAULT_DOMAIN) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function() {
        $http({
          method: 'POST',
          url: DEFAULT_DOMAIN + '/siteUser/checkMobileCaptcha?mobile=' + angular.element('#mobile').val() + '&' + 'captcha=' + angular.element('#' + attrs.checkMobileCaptcha).val()
          // url: DEFAULT_DOMAIN + '/siteUser/checkMobileCaptcha?mobile=' + angular.element('#' + attrs.checkMobileCaptcha).val() + '&' + 'captcha=' +
        }).success(function(data) {
          if(data.ret === 1) {
            ctrl.$setValidity('check', true);
          } else {
            ctrl.$setValidity('check', false);
          }
        }).error(function() {
          ctrl.$setValidity('check', false);
        });
      });
    }
  };
});