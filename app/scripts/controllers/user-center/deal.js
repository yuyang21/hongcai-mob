'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:DealCtrl
 * @description
 * # DealCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('DealCtrl', function($rootScope, $scope, $state, Restangular) {
    $rootScope.selectedSide = 'account';
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.deals = [];
    $scope.totalPage = 1;
    //自动加载更多
    //
    //
    //
    //
    // 获取所有交易类型
    Restangular.one('users/0').one('deals/types').get({}).then(function(response){
      $scope.dealMap = response
    })
    $rootScope.showLoadingToast = true;
    $scope.dealList = function(types){
      $rootScope.showLoadingToast = true;
      if ($scope.totalPage < $scope.page){
        return;
      }
      Restangular.one('users/0').one('deals').get({
        page: $scope.page,
        pageSize: $scope.pageSize,
        filterType: types
      }).then(function(response){
        if(response.ret !== -1){
          $scope.dealDate = response;
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.deals.push(response.data[i]);
          };
          $rootScope.showLoadingToast = false;
       } else{
          $scope.msg = '获取信息失败';
          $rootScope.showLoadingToast = true;
        }
      });
     //$scope.DealBusy = false;
    }

    $scope.dealList();



    $scope.loadDealMuch = function(dealNo){
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList(dealNo);
      $scope.DealBusy = false;
    };
    //以上为增加 自动加载代码

    $scope.showSelect = false;
    $scope.selected = '全部';
    $scope.dealType = [
      {
        'type': '全部',
        'no': '0'
      },{
        'type': '充值',
        'no': '1'
      },{
        'type': '出借',
        'no': '3'
      },{
        'type': '回款',
        'no': '4'
      },{
        'type': '提现',  
        'no': '2'
      },{
        'type': '奖励',
        'no': '5'
      },{
        'type': '其他',
        'no': '6'
      }
    ]
    //下拉菜单
    $scope.select =function(){
      $scope.showSelect = !$scope.showSelect;
      if($scope.showSelect){ //出现下拉选择 隐藏footer
        $rootScope.showFooter = false;
      }else {
        $rootScope.showFooter = true;
      }
    }
    //选择资金流水类型
    $scope.selectDealType = function(dealType){
      $scope.selected = dealType.type;
      $scope.dealNo = dealType.no;
      $scope.deals = [];
      $scope.page = 1;
      $scope.totalPage = 1;
      $scope.select();
      $scope.dealList(dealType.no);
    }
    
  });
