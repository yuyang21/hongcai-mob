'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', function($timeout, $scope, $rootScope, $state, $location, $stateParams, restmod, WEB_DEFAULT_DOMAIN, ScreenWidthUtil, Restangular) {
    // 特权加息
    $scope.privilegeRate = {
      orderNum: "",
      value: 0,
      duration:0
    };
    

    //初始化
    $rootScope.headerTitle = '我的出借';
    if($stateParams.tab === '0'){
      $rootScope.headerTitle = '我的出借—宏财精选';
      $scope.type = 7;
    } else if ($stateParams.tab === '1') {
      $rootScope.headerTitle = '我的出借—宏财尊贵';
      $scope.type = 8;
    } else if ($stateParams.tab === '2') {
      $rootScope.headerTitle = '我的出借—债权转让';
      $scope.type = 6;
    } else if ($stateParams.tab === '3') {
      $rootScope.headerTitle = '我的出借—其他';
      $scope.type = 3;
    }
    $scope.tab = 0;
    $scope.widthFlag = ScreenWidthUtil.screenWidth();
    $rootScope.showLoadingToast = true;

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '持有中',
    }, {
      title: '已结清',
    }];

    $rootScope.selectedSide = 'investments-stat';
    $scope.page = 1;
    $scope.pageSize = 5;
    $scope.credits = [];

    //tab切换
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.loading = true;

      $scope.toggle.activeTab = tabIndex;
      if (tabIndex === 0) {
        $scope.creditStatus = '1';
      } else {
        $scope.creditStatus = '4';
      }
      $scope.credits = [];
      $scope.page = 1;
      $scope.getCredits($scope.creditStatus);
    };
    
    $scope.getProjectPrepaymentTime = function () { // 获取提前还款最后期限
      Restangular.one('/users/0/creditRights/projectPrepaymentTime').get({}).then(function(response) {
        if (response && response.ret !== -1) {
          $scope.prepaymentTime = response.prepaymentTime
        }
      })
    }
    /**
     * 出借统计
     */
     Restangular.one('/users/0/investments/typeStat').get({
      type: $scope.type
     }).then(function(response){
       if(!response || response.ret == -1){
         return;
       }
       $scope.creditStat = response[0];
       $scope.holdingCount = response.length == 0? 0:$scope.creditStat.holdingCount;
       $scope.endProfitCount = response.length == 0? 0:$scope.creditStat.endProfitCount;
    });

     /**
     * 出借列表
     */
    var siteCredits = restmod.model(WEB_DEFAULT_DOMAIN + '/siteCredit');
    $scope.getCredits = function(status) {
      $rootScope.showLoadingToast = true;
      siteCredits.$find('/getHeldInCreditRightList', {
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize,
        type: $scope.type
      }).$then(function(response) {
        $scope.totalPage = Math.ceil(response.data.count / $scope.pageSize);
        $scope.creditsData = response.data.heldIdCreditList;
        $scope.creditsData.length > 0 ? $scope.getProjectPrepaymentTime() : null
        for (var i = 0; i <= $scope.creditsData.length - 1; i++) {
          if ($scope.creditsData[i].increaseRateCoupon && ($scope.creditsData[i].increaseRateCoupon.type === 1 || $scope.creditsData[i].increaseRateCoupon.type === 6 || $scope.creditsData[i].increaseRateCoupon.type === 7)) {
            var oriRate = $scope.creditsData[i].creditRight.riseRate + $scope.creditsData[i].creditRight.baseRate;
            $scope.creditsData[i].rateCouponProfit = $scope.creditsData[i].creditRight.profit * ($scope.creditsData[i].increaseRateCoupon.value + oriRate) / oriRate - $scope.creditsData[i].creditRight.profit;
          }

          if ($scope.privilegeRate.orderNum) {
            if ($scope.privilegeRate.orderNum === $scope.creditsData[i].creditRight.orderNum ) {
                $scope.creditsData[i].privilegeValue = $scope.privilegeRate.value;
                $scope.creditsData[i].privilegePofit = $scope.privilegeRate.value * $scope.creditsData[i].creditRight.amount * $scope.privilegeRate.duration / 36500;
              }
          }

          $scope.credits.push($scope.creditsData[i]);
        };
        
        $scope.loading = false;
        $timeout(function() {
          $rootScope.showLoadingToast = false;
        }, 100);
        
      })

    
    };

    //获取用户正在计息的加息券，通过这个去显示10%
    Restangular.one('/users/0/userIncreasingRateCoupons').get({}).then(function(response) {
      if (response && response.ret !== -1 && response.length > 0) {
        $scope.privilegeRate.orderNum = response[0].orderNum;
        $scope.privilegeRate.value = response[0].value;
        $scope.privilegeRate.duration = response[0].duration;
      }
      $scope.toggle.switchTab(0);
    })

    //跳转详情页
    $scope.goDtail = function(item) {
      if(item == 3) {
        return;
      }
      $state.go('root.userCenter.credit-security-details',{type: 1,number:item});
    }
    /**
     * 加载更多
     */
    $scope.loadCreditMore = function() {
      $scope.page = $scope.page + 1;
      $scope.getCredits($scope.creditStatus);
    };


  });
