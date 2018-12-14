'use strict';
angular.module('p2pSiteMobApp')
  .controller('assignmentListDetailsCtrl', function($state, $scope, $stateParams, $rootScope, $timeout, Restangular) {
    var number = $stateParams.number;  
    $scope.msg = '';
    $rootScope.msg = '';
    /**
     * 债权转让信息详情
     */
    Restangular.one('assignments').one(number).get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.assignment = response; 
        // $scope.assignmentNumber = response.projectNumber; 
      }
    });
    /**
     * 转让记录
     */
    Restangular.one('assignments/'+number+'/orders').get({

    }).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.assignmenrOrders = response.data;
      }
    });

    /**
     * 加载更多
     */
    $scope.initLimit = 6;
    $scope.loadMore = function() {
      $scope.initLimit = $scope.initLimit + 3 < $scope.assignmenrOrders.length ? $scope.initLimit + 3 : $scope.assignmenrOrders.length;
    };

    /**
     * 撤销债权转让
     */
    $scope.cancelCreditAssignment = function() {

      Restangular.one('users/0/assignments/'+number+'/revokeValidate').get({}).then(function(response){
        if (response && !response.msg) {
          $scope.data = response;
        }else {
          $scope.msg = response.msg;
        }
      });
    };
    
    //确认撤销
    $scope.toList = function() {
      $state.go('root.userCenter.assignments',{tab: 1});
    }
    $scope.deleteCreditAssignment = function(){
      Restangular.one('users/0/assignments/'+number).remove({}).then(function(response){
        if (response.status ===3 || response.status ===6) {
          $rootScope.successMsg = '撤销成功！';
          $rootScope.showSuccessToast = true;
          $timeout(function() {
            $rootScope.showSuccessToast = false;
            $rootScope.successMsg = '';
            $scope.toList();
          }, 2000);
        } 
      });
    };
    
  });
