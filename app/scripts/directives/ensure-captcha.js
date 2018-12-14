'use strict';
angular.module('p2pSiteMobApp').directive('ensureCaptcha', function($http, DEFAULT_DOMAIN) {
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			
			scope.$watch(attrs.ngModel, function() {
				var captcha = angular.element('#' + attrs.ensureCaptcha).val();

				if (!captcha){
					return;
				}

				$http({
					method: 'POST',
					url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + captcha
				}).success(function(data) {
					if(data == true) {
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
