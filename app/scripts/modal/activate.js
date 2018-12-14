/*
 * @Author: Administrator
 * @Date:   2016-08-22 18:44:36
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-09-19 19:42:24
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ActivateCtrl', function($scope, $rootScope, $state, toCunGuanUtils, Restangular, UserService, $location) {
    $scope.showActivateTip = true;
    $scope.cancel = function() {
      $scope.showActivateTip = false;
    };

    UserService.loadUserAuth($scope);
    /**
     * 立即迁移
     */

    $scope.toOpen = function(){
    	$scope.cancel();
    	if(!$rootScope.isLogged){
        $state.go('root.login', {
          redirectUrl: $location.path()
        });
        	return;
      	}

      	if($scope.userAuth.authStatus === 2 && !$scope.userAuth.active){
          toCunGuanUtils.to('active', null, null, null, null, null);
      	} else if($scope.userAuth.authStatus == 0){
      		$rootScope.toRealNameAuth();
      	}

    }

  });
