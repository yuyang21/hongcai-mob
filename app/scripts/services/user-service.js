'use strict';

/**
 * 用户服务类
 */
angular.module('p2pSiteMobApp')
  .service('UserService', function (Restangular, SessionService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {

    	loadUserAuth: function($scope){
        if(!SessionService.isLogin()){
          return;
        }

    		$scope.userAuth = SessionService.getUserAuth();
	        if(!$scope.userAuth){
	          Restangular.one('users').one('0/userAuth').get().then(function(userAuth){
	            $scope.userAuth = userAuth;
	            SessionService.setUserAuthIfAuthed($scope.userAuth);
	          });
	        }
    	},

      loadAccount: function($scope){
        if(!SessionService.isLogin()){
          return;
        }

        var sessionAccount = sessionStorage.getItem('account' + SessionService.getUser().id);
        $scope.account = sessionAccount ? angular.fromJson(sessionAccount) : undefined;
        
        Restangular.one('users').one('0/account').get().then(function(response){
          if(!response || response.ret == -1) { return;}
          $scope.account = response;
          sessionStorage.setItem('account' + SessionService.getUser().id, angular.toJson($scope.account));
        });
      },

      loadVoucher: function($scope){
        if(!SessionService.isLogin()){
          return;
        }

        $scope.voucher = localStorage.getItem('voucher' + SessionService.getUser().id) ? angular.fromJson(localStorage.getItem('voucher' + SessionService.getUser().id)) : undefined;
        if($scope.voucher){return;}

        Restangular.one('users/0').one('voucher').get().then(function(response){
          if(!response || response.ret == -1) { return;}
          $scope.voucher = response;
          localStorage.setItem('voucher' + SessionService.getUser().id, angular.toJson($scope.voucher));
        });
      },	
      loadCouponAmount: function($scope,type) {
        if(!SessionService.isLogin()){
          return;
        }
        $scope.cashCouponStatis = angular.fromJson(localStorage.getItem('cashCouponStatis'))? angular.fromJson(localStorage.getItem('cashCouponStatis')) : undefined;
        $scope.couponStatis = angular.fromJson(localStorage.getItem('couponStatis'))? angular.fromJson(localStorage.getItem('couponStatis')) : undefined;
        Restangular.one('users').one('0/'+ type).get({}).then(function(response){
          if(type === 'increaseRateCoupon') {
            $scope.couponStatis = response;
            localStorage.setItem('couponStatis', angular.toJson($scope.couponStatis));
          }else {
            $scope.cashCouponStatis = response;
            localStorage.setItem('cashCouponStatis', angular.toJson($scope.cashCouponStatis));
          }
          
        });

      }

    }


  });
