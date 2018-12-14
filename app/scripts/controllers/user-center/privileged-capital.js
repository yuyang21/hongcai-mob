'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
.controller('PrivilegedCapitalCtrl', function ($scope, $state, $rootScope, $stateParams, Restangular, SessionService, UserService) {
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.details = [];
    $scope.totalPage = 1;
    $scope.privilegedCapital = {
      amount: 0,
      profit: 0
    }
    
    if(SessionService.isLogin()){
    	Restangular.one('privilegedCapitals').one('/').get()
        .then(function(response){
        	if (response  && response.ret !== -1) {
        		$scope.privilegedCapital = response;
        	}
        });
    }

    $rootScope.showLoadingToast = true;
    $scope.privilegedCapitalDetails = function(){
      $rootScope.showLoadingToast = true;
      if ($scope.totalPage < $scope.page){
        return;
      }
      Restangular.one('privilegedCapitals').one('/details').get({
        page: $scope.page,
        pageSize: $scope.pageSize
      }).then(function(response){
        if(response && response.ret !== -1){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.details.push(response.data[i]);
          };
          $rootScope.showLoadingToast = false;
       } else{
          $scope.msg = '获取信息失败';
          $rootScope.showLoadingToast = true;
        }
      });
    }

    $scope.privilegedCapitalDetails();

    $scope.loadMore = function(){
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.privilegedCapitalDetails();
      $scope.DealBusy = false;
    };
  });
