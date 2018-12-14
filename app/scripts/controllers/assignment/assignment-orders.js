/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:assignmentOrdersCtrl
 * @description
 * # assignmentOrdersCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('assignmentOrdersCtrl', function($state, DateUtils, $stateParams, Restangular, $scope, $rootScope) {
    var number = $stateParams.number; 

    /**
     * 转让记录
     */
    Restangular.one('assignments/'+number+'/orders').get({

    }).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.assignmentOrders = response.data;
      }
    });

    /**
     * 加载更多
     */
    $scope.initLimit = 8;
    $scope.loadMore = function() {
      $scope.initLimit = $scope.initLimit + 3 < $scope.assignmentOrders.length ? $scope.initLimit + 3 : $scope.assignmentOrders.length;
    };

  });
