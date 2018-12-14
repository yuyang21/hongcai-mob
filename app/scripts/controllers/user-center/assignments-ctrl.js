/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:assignmentsCtrl
 * @description
 * # assignmentsCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('assignmentsCtrl', function($timeout, $rootScope, $location, $stateParams, config, Restangular, $scope, $state) {
    $rootScope.showLoadingToast = true;
    $scope.config = config;

    $scope.widthFlag = "";
    $scope.screenWidth = function() {
      $scope.width = document.body.scrollWidth; //用系统返回宽度除以分辨率
      if ($scope.width >= 320 && $scope.width < 375) {
        $scope.widthFlag = 0;
      } else if ($scope.width >= 375 && $scope.width < 414) {
        $scope.widthFlag = 1;
      } else if ($scope.width >= 414) {
        $scope.widthFlag = 2;
      }
      return $scope.widthFlag;
    }
    $scope.screenWidth();

    //暂不可转弹窗
    $scope.modalMsg = false;
    $scope.showRule = function(createTime){
      $scope.createTime = createTime;
      $scope.modalMsg = true;
    }
    $scope.closeRule = function() {
      $scope.modalMsg = false;
    }
    // tab
    $scope.tabs = [{
      title: '可转让',
    }, {
      title: '转让中',
    }, {
      title: '已转让',
    }];

    $scope.page = 1;
    $scope.pageSize = 5;

    // 老用户拦截
    $scope.goTransfer = function(number) {
      $state.go('root.userCenter.assignments-transfer-details',{number:number});
    }

    /**
     * 切换标签
     */
    $scope.searchStatus = parseInt($stateParams.tab || 0);
    $scope.switchTab = function(tabIndex) {
      $scope.loading = true;
      $scope.searchStatus = tabIndex;

      if (tabIndex == 0) {
        $scope.getAssignments(1);
      } else if(tabIndex == 1){
        $scope.getTranferingAssignmentsList(1, '1,2,5');
      }else {
        $scope.getTranferingAssignmentsList(1, '3,4');
      }
      $scope.page = 1;
    };


    $scope.getAssignments = function(status) {
      $rootScope.showLoadingToast = true;
      Restangular.one('users').one('transferables').get({
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize
      }).then(function(response) {
        $scope.transferablesList = $scope.page ==1 ? [] : $scope.transferablesList;
        if (response && response.ret !== -1) {
          if (response.data.length>0) {
            for (var i = 0; i < response.data.length; i++) {
              $scope.transferablesList.push(response.data[i]);
            };
            $scope.transferableCounts = response.totalPage;
    
          // 测试环境放开限制
            var currentDate = new Date().getTime();
            if(status === 1){
              for (var i = $scope.transferablesList.length - 1; i >= 0; i--) {
                $scope.transferablesList[i].canTransfer = config.isTest || (currentDate - $scope.transferablesList[i].createTime > 30*24*3600*1000);
              }
            }
            $scope.loading = false;
          }
          $timeout(function() {
            $rootScope.showLoadingToast = false;
          }, 200);
        } else {
        }
      });
    };
    
    /**
     * 获取转让中债权列表
     */
    $scope.page2 = 1;
    $scope.page3 = 1;
    $scope.getTranferingAssignmentsList = function(page, status) {
      $rootScope.showLoadingToast = true;
      Restangular.one('users', '0').one('assignments').get({
        page: page,
        pageSize: $scope.pageSize,
        status: status
      }).then(function(response) {
        $scope.assignmentsList = page ==1 ? [] : $scope.assignmentsList;
        $scope.page2 = page ==1 ? 1 : $scope.page2;
        $scope.page3 = page ==1 ? 1 : $scope.page3;
        if (response.data.length>0) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.assignmentsList.push(response.data[i]);
          };
          $scope.total = response.total; 
          $scope.index = response.index; 
          $scope.totalPage = response.totalPage; 
 
          $scope.loading = false;

        }
        $timeout(function() {
          $rootScope.showLoadingToast = false;
        }, 200);
      });
    };

    $scope.switchTab($scope.searchStatus);
    
    /**
     * 加载更多
     */
    $scope.loadAssignmentMore = function(status) {
      if (status == '0') {
        $scope.page += 1;
        $scope.getAssignments(1);
      }else if (status == '1') {
        $scope.page2 += 1;
        $scope.getTranferingAssignmentsList($scope.page2, '1,2,5');
      }else if (status == '2') {
        $scope.page3 = $scope.page3 + 1;
        $scope.getTranferingAssignmentsList($scope.page3, '3,4');
      }
      
      
    };



  });
