'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:GradeCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RateCouponCtrl',function ($scope, $state, $rootScope, $location, $stateParams, ipCookie, Restangular) {
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.datas = [];
    $scope.totalPage = 1;
    $scope.useTotalPage = 1;
    $scope.unUseTotalPage = 1;

    $scope.tab = parseInt($stateParams.tab) || 0;
    $scope.subTab = parseInt($stateParams.subTab) || 0;
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '体验金',
    }, {
      title: '加息券',
    }, {
      title: '邀请',
    }];

    $scope.subtabs = [{
      titles: '未使用',
    }, {
      titles: '已使用',
    }];

    //查询加息券
    $scope.couponList = function(subtabIndex){
      var totalPage = 0;
      if(subtabIndex === 0){
        totalPage = $scope.unUseTotalPage;
      }else if(subtabIndex === 1){
        totalPage = $scope.useTotalPage;
      }

      if (totalPage < $scope.page){
        return;
      }

      var status = "1,3";
      if(subtabIndex === 1){
        status = "2";
      }

      Restangular.one('users/0').one('userIncreaseRateCoupons').get({
        page: $scope.page,
        pageSize : $scope.pageSize,
        status : status
      }).then(function(response){
        if(response && response.ret !== -1){
          if(subtabIndex === 0){
            $scope.unUseTotalPage = response.totalPage;
          }else if(subtabIndex === 1){
            $scope.useTotalPage = response.totalPage;
          }
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
        } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    };



    $scope.initData = function(tabIndex, subtabIndex){
      $scope.toggle.activeTab = tabIndex;
      $scope.toggle.activesubTab = subtabIndex;
      if(tabIndex === 1){
        $scope.couponList(subtabIndex);
      }
    };

    $scope.toggle.switchTab = function(tabIndex) {
      $location.search('tab', tabIndex);
    };

    $scope.toggle.switchsubTab = function(subtabIndex) {
      $scope.datas = [];
      $scope.toggle.activesubTab = subtabIndex;
      $location.search('subTab', subtabIndex);
      // $scope.initData(1, subtabIndex);
    };

    $scope.datas = [];
    $scope.initData(+$scope.tab, +$scope.subTab);

    // $scope.toggle.switchTab($scope.tab);

    $scope.loadMuch = function(tabIndex, subtabIndex){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.initData(tabIndex, subtabIndex);
    };

   
    /**
     *跳转到列表页
     */
    $scope.toProjectList = function(investProductType, $index){
      if (investProductType == 5) {
        $state.go('root.project-list', {tab : 0});
      }else if (investProductType == 6) {
        $state.go('root.project-list', {tab : 1});
      }else {
        $state.go('root.project-list');
      }
      ipCookie('rateNum',$scope.datas[$index].number);
      ipCookie('rateType',$scope.datas[$index].type);
    }

  });

