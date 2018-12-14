/*
* @Author: yuyang1
* @Date:   2016-07-25 17:24:33
*/

'use strict';
angular.module('p2pSiteMobApp')
.controller('CashCouponCtrl', function ($scope, $rootScope, $state, Restangular, ipCookie, UserService) {
	/**
	 * 默认头像
	 */
	$scope.userHeadImgUrl = '/images/user-center/avatar.png';

	UserService.loadUserAuth($scope);

	$scope.couponStatis = Restangular.one('users').one('0/increaseRateCoupon').get().$object;
	/*如何获取*/
	$scope.toGet = function() {
		$state.go('root.activity.newInvite-landing');
	}
	/*使用规则*/
	$scope.showRules = false;
	$scope.showRule = function(){
		$scope.showRules = true;
		$('#body-box').addClass('body-box');
	}
	$scope.closeRule = function() {
		$scope.showRules = false;
		$('#body-box').removeClass('body-box');
	}

	/*投资统计*/
	Restangular.one('cashCoupons').one('stat').get().then(function(response) {
		$scope.cash = response;
	});

	/*现金券查询*/
	$scope.status = 1;
	$scope.page = 1;
    $scope.pageSize = 10;
    $scope.cashCoupons = [];
	/*解决闪烁问题*/
	$scope.loading = true;

	// 获取现金券列表
	$scope.getCashCoupons = function (status) {
		var totalPage = 0;
		if(status === 1){
			totalPage = $scope.unUseTotalPage;
		}else if(status === 2){
			totalPage = $scope.useTotalPage;
		}

		if (totalPage < $scope.page){
			return;
		}

		$scope.loading = true;
		
		$scope.status = status;
		var queryStatus = status === 1 ? '1' : '2,4';
		Restangular.one('cashCoupons').get({
			status : queryStatus,
			page: $scope.page,
			pageSize: $scope.pageSize
		}).then(function(response){
			$scope.loading = false;
			$scope.cashCouponsData = response.data;
			if(status === 1){
				$scope.unUseTotalPage = response.totalPage;
			}else if(status === 2){
				$scope.useTotalPage = response.totalPage;
			}
			$scope.totalPage = response.totalPage;
			for (var i = 0; i < response.data.length; i++) {
				$scope.cashCoupons.push(response.data[i]);
			}
		});
	}
	/*选择提现状态*/
	$scope.selectStat = function(status){
		$scope.cashCoupons = [];
		$scope.page = 1;
		$scope.status = status;
		$scope.getCashCoupons(status);
	}
	$scope.selectStat(1);

  	$scope.toProjectList = function(investProductType, $index){
  		if (investProductType == 5) {
  			$state.go('root.project-list', {tab : 0});
  		}else if (investProductType == 6) {
  			$state.go('root.project-list', {tab : 1});
  		}else {
  			$state.go('root.project-list');
  		}
	    ipCookie('cashNum', $scope.cashCoupons[$index].number);
	    ipCookie('cashType', $scope.cashCoupons[$index].type);
  	}
  	// 查看更多
  	$scope.loadMuch = function(status){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.getCashCoupons(status);
    };

});

