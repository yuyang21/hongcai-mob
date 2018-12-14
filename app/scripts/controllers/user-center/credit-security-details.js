/*
 * @Author: fuqiang1
 * @Date:   2016-08-09 11:23:50
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-11 16:06:42
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CreditSecurityCtrl', function($scope, $rootScope, $state, $timeout, $stateParams, Restangular, WEB_DEFAULT_DOMAIN) {
    $scope.number = $stateParams.number;
    $rootScope.showLoadingToast = true;
    // 特权加息
    $scope.privilegeRate = {
      orderNum: "",
      value:0,
      type: 5,
      duration:1,
      profit:0
    }

    /**
     * 
     */
    Restangular.one('creditRights').one($scope.number + '/creditRightBills').get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.credits = response.data;
        $timeout(function(){
          $rootScope.showLoadingToast = false;
        },200)
      }
      
    });

    /**
     * 债权详情、项目信息、加息券信息
     */
    Restangular.one('creditRights').one($scope.number + '/creditDetail').get({}).then(function(response) {
      $scope.creditRight = response.creditRight;
      $scope.project = response.project;
      $scope.increaseRateCoupon = response.increaseRateCoupon;
      $scope.projectBill = response.projectBill;
      
      //获取用户正在计息的加息券，通过这个去显示10%
      Restangular.one('/users/0/userIncreasingRateCoupons').get({}).then(function(response) {
        if (response && response.ret !== -1 && response.length > 0) {
          $scope.privilegeRate = response[0];
          // 判断是非有特权加息
          if ($scope.privilegeRate.orderNum && $scope.privilegeRate.orderNum === $scope.creditRight.orderNum) {
            $scope.isPrivilegeRate = true;
          }
        }
      });
    });

    //查看项目详情
    $scope.goDetail = function() {
      if($scope.creditRight.type == 3) {
        return;
      }
      $state.go('root.project-detail', {
        number: $scope.project.number
      });
    }

  });
