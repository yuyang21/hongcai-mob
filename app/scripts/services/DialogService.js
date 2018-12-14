'use strict';

angular.module('p2pSiteMobApp')
	.factory('DialogService', function($rootScope){
		return {
			alert: function(title, msg, confirmFunc){
				
				$rootScope.alert = {
					title: title,
					msg: msg,
					confirm: confirmFunc
				};
			},

			confirm: function(title, msg, cancelFunc, confirmFunc){
				
				$rootScope.confirm = {
					title: title,
					msg: msg,
					cancel: cancelFunc,
					confirm: confirmFunc
				};
				
			}
		}
	});