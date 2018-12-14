/*
* @Author: Administrator
* @Date:   2016-08-03 17:08:13
* @Last Modified by:   Administrator
* @Last Modified time: 2016-08-09 10:21:51
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ProjectOrdersCtrl', function($scope, Restangular, $stateParams) {


    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.totalPage = 0;

    $scope.orderList = [];

     /**
     * 项目订单列表
     */
    $scope.projectOrders = function(projectId, projectType) {
      Restangular.one('/projects/' + $stateParams.number + '/orders').get({
        page: $scope.page, 
        pageSize: $scope.pageSize
      }).then(function(response) {
        if (response.ret !== -1) {
          $scope.totalPage = response.totalPage;
          if(response.data.length >= 1){
            for (var i = response.data.length - 1; i >= 0; i--) {
              $scope.orderList.push(response.data[i]);
            }
          }
        }
      });
    }
    $scope.projectOrders();

    /**
     * 加载更多
     */
    $scope.loadMore = function() {
      if($scope.page >= $scope.totalPage){
        return;
      }

      $scope.page += 1;
      $scope.projectOrders();

    };
  })
