'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectDetailCtrl
 * @description
 * # ProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectDetailCtrl', function(ipCookie, $scope, $timeout, $state, $rootScope, $stateParams, $location,$interval, Restangular, projectStatusMap, ProjectUtils, Utils, toCunGuanUtils, SessionService, UserService) {
    $rootScope.showFooter = false;
    $rootScope.showLoadingToast = true;
    var deviceCode = Utils.deviceCode();
    $rootScope.migrateStatus();
    // 项目详情页面
    var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    } 
    $scope.profit = 0;
    $scope.msg = '';
    $scope.increaseRateProfit = 0;
    $scope.projectStatusMap = projectStatusMap;
    $scope.unSelectCouponMsg = '';
    $scope.initLimit = 4;
    $scope.resetInitLimit = function(){
        $scope.initLimit = 4;
    }

    if(SessionService.isLogin()){
      UserService.loadAccount($scope);
      UserService.loadUserAuth($scope);
      $rootScope.tofinishedOrder();  
    }

    /**
     * 项目信息
     */
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {

      $rootScope.showLoadingToast = true;
      $rootScope.headerTitle = response.name.length > 10 ? response.name.substr(0,10) + '...' : response.name;
      Utils.setTitle($rootScope.headerTitle);

      var project = response;
      $scope.project = project;
      project.percent = (project.total - project.amount) / project.total * 100;

      ProjectUtils.projectTimedown(project, project.createTime);

      // /**
      //  * 新手标判断
      //  */
      // if($scope.project.category.code === '0112'){
      //     Restangular.one('projects').one('investNewbieBiaoProjectVerify').get({
      //       number: $stateParams.number
      //     }).then(function(response) {
      //       if(response.ret === -1){
      //         return;
      //       }
      //       if(!response.isOk){
      //         $scope.msg = '仅限首次出借后一周内参与';
      //         $rootScope.showMsg($scope.msg);
      //       }
      //   });

      // }

      /**
       * 可用券
       */
      $scope.increaseRateCoupons = null;
      $scope.selectIncreaseRateCoupon = null;
      if(SessionService.isLogin()){
        
        Restangular.one('projects').one('investIncreaseRateCoupon').get({
          projectId : $scope.project.id,
          amount : project.amount
        }).then(function(response) {
          if (response  && response.ret !== -1) {
            $scope.increaseRateCoupons = response;
            if(response.length === 0) {
              $scope.selectIncreaseRateCoupon = null;
              $scope.unSelectCouponMsg = '暂无可用奖励';
            }
            for (var i = 0; i < $scope.increaseRateCoupons.length; i++) {
              if ($scope.rateType === '' && $scope.cashType === '') {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[0];
              }
              if ($scope.rateNum == $scope.increaseRateCoupons[i].number || $scope.cashNum == $scope.increaseRateCoupons[i].number) {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[i];
              }
            }
          }else {
            $scope.selectIncreaseRateCoupon = [];
          }
        }); 
      }



      $timeout(function(){
          $rootScope.showLoadingToast = false;
      },100);

    });

    // $scope.$watch('account', function(){
    //   if($scope.account && $scope.project){
    //     var minBalanceAccount = $scope.account.balance - $scope.account.balance % 100;
    //     var minInvestAccount = $scope.project.amount;
    //   }
    // });

    

    /**
     * 下单并支付
     */
    $scope.clicked = true;
    $scope.toInvest = function(project) {
      $scope.clicked = false;
      var toInvest = function(){
        if($scope.msg || project.investAmount < project.minInvest || !project.investAmount){
          return;
        }
        $rootScope.showMsg($scope.msg);
        var couponNumber = $scope.selectIncreaseRateCoupon != null ? $scope.selectIncreaseRateCoupon.number : '';
        $rootScope.showLoadingToast = true;
        Restangular.one('projects').one(number+'/users/' + '0').post('investment', {
          investAmount: project.investAmount,
          couponNumber: couponNumber,
          device: Utils.deviceCode()
        }).then(function(order){
          $rootScope.showLoadingToast = false;
          $scope.clicked = true;
          // 重复下单后，response.number为undefined
          if (order && order.ret !== -1) {
            toCunGuanUtils.to('transfer', order.number, null, null, null, null);
          } else {
            $rootScope.tofinishedOrder();
            $scope.msg = order.msg;
            $rootScope.showMsg($scope.msg);
          }
        });
      }
      $rootScope.migrateStatus(toInvest);
    };


    $scope.$watch('project.investAmount', function(newVal, oldVal){
      if(!$rootScope.isLogged || oldVal ==undefined){
        return;
      }

      if(newVal !== oldVal){
        $scope.msg = undefined;
      }

      if(newVal){
        if(newVal > $scope.project.amount){
          $scope.msg = '出借金额必须小于' + $scope.project.amount;
        }else if(newVal > $scope.account.balance){
          $scope.msg = '账户余额不足，请先充值';
        } else if(newVal < $scope.project.minInvest ){
          $scope.msg = '出借金额必须大于' + $scope.project.minInvest;
        } else if(newVal % $scope.project.increaseAmount !==0 ){
          $scope.msg = '出借金额必须为' + $scope.project.increaseAmount + '的整数倍';
        }
      }

      $scope.profit = $scope.calcProfit($scope.project.annualEarnings) || 0;
      if($scope.selectIncreaseRateCoupon && $scope.project){
        if($scope.selectIncreaseRateCoupon.type ===1){
          $scope.increaseRateProfit = $scope.selectIncreaseRateCoupon != null ? $scope.calcProfit($scope.selectIncreaseRateCoupon.value) : 0;
        } else{
          $scope.showCashMsg(newVal);
          $scope.cashProfit = $scope.project.investAmount >= $scope.selectIncreaseRateCoupon.minInvestAmount ? $scope.selectIncreaseRateCoupon.value : 0;
        }
      }

      $rootScope.showMsg($scope.msg);
    });

    // 判断现金券出借金额显示错误提示
    $scope.showCashMsg = function(investAmount){
      if(investAmount && investAmount < $scope.selectIncreaseRateCoupon.minInvestAmount){
        $scope.msg = '出借金额不满足返现条件';
        $rootScope.showMsg($scope.msg);
      }
      return;
    }

    
    // 记录券的来源
    $scope.cashNum = ipCookie('cashNum') || '';
    $scope.cashType = ipCookie('cashType') || '';
    $scope.rateNum = ipCookie('rateNum') || '';
    $scope.rateType = ipCookie('rateType') || '';

    //选择券
    $scope.showSelectIncreaseRateCoupon = false;
    $scope.selectCoupon = function(coupon){
      $scope.unSelectCouponMsg = '';
      $scope.selectIncreaseRateCoupon = coupon;
      $scope.showSelectIncreaseRateCoupon = false;
      $scope.increaseRateProfit = $scope.calcProfit(coupon.value) || 0;
      $scope.cashProfit = $scope.project.investAmount >= $scope.selectIncreaseRateCoupon.minInvestAmount ? $scope.selectIncreaseRateCoupon.value : 0;
      $scope.resetInitLimit();
      //选择现金券时判断出借金额是否满足条件
      if(coupon.type ===2){
        $scope.msg = '';
        if($scope.msg){
          $scope.showCashMsg($scope.project.investAmount);
        }else{
          $scope.showCashMsg($scope.project.investAmount);
        }
      }else{
        $scope.msg = '';
      }
    }
    //不使用券
    $scope.unUseIncreaseRateCoupon = function(){
      $scope.selectIncreaseRateCoupon = null;
      $scope.showSelectIncreaseRateCoupon = false;
      $scope.increaseRateProfit = 0;
      $scope.resetInitLimit();
      $scope.unSelectCouponMsg = '暂不使用';
      if($scope.msg){
        $scope.msg = '';
      }
    }

    /**
     * 跳转到出借记录页
     */
    $scope.toOrderList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.orders', {
          number: $stateParams.number
       });
      }
    }

    //计算预计收益
    $scope.calcProfit = function(annualEarnings){
      var profit = 0;
      if ($scope.project.repaymentType === 2) {
        return (Restangular.one('projects').one($stateParams.number + '/averageCapitalInterest/').get({
          number: $stateParams.number,
          investAmount: $scope.project.amount,
          annualEarnings: annualEarnings
        }).$object)
      } else {
        profit = $scope.project.investAmount * $scope.project.projectDays * annualEarnings / 36500 ;
        return profit;
      }
    }

    /**
     * 修改出借金额
     */
    $scope.modInvestAmout = function(offset,$event){
      if($scope.project && $scope.project.status != 7){
        return;
      }

      $event.stopPropagation();
      $scope.project.investAmount = $scope.project.investAmount ? $scope.project.investAmount + offset : offset;
      $scope.project.investAmount = $scope.project.investAmount < 100 ? 100 : $scope.project.investAmount;
    }
    //查看更多
    $scope.viewMoreCoupon = function(){
      $scope.initLimit = $scope.initLimit + 3 < $scope.increaseRateCoupons.length ? $scope.initLimit + 3 : $scope.increaseRateCoupons.length;
    }
    /**
     * 虚拟键盘弹出遮住输入框问题
     */

    angular.element('.invest-input').bind({
      focus: function(){
        angular.element('.new-project-detail').css('margin-bottom','30px');
        if(deviceCode ===  5 || deviceCode ===6) {
          angular.element('.toast1').css('top','58%');
        }
      },
      blur: function(){
        angular.element('.new-project-detail').css('margin-bottom','0');
        angular.element('.toast1').css('top','38%');
      }
    })
    $scope.blurNumber = function(){
      $("#invest-input").blur();
    }
    //点击蒙层关闭弹窗
    $scope.hideCoupons = function($event) {
      var _con = angular.element('#coupons');   // 设置目标区域
      if(!_con .is($event.target) && _con .has($event.target).length === 0){ 
        $scope.showSelectIncreaseRateCoupon = false;
      }
    }
  });
