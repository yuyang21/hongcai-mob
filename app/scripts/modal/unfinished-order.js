/*
* @Author: wangyadan
* @Date:   2016-07-11 12:13:11
* @Last Modified by:   Administrator
* @Last Modified time: 2016-08-04 10:32:27
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('UnfinishedOrderCtrl', function($scope, $state, $rootScope, $uibModalInstance, order, Restangular, toCunGuanUtils) {
    $scope.order = order;
    $scope.projectDays = Math.ceil((order.repaymentDate-order.createTime)/1000/3600/24);
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
    $scope.cancelUnpay = function(){
      $scope.cancel();
      Restangular.one('orders').one("/"+order.number).remove().$object;
    }
    $scope.goonPay = function(){
      toCunGuanUtils.to('transfer', $scope.order.number, null, null, null, null);
      $scope.cancel();
    }
  });

