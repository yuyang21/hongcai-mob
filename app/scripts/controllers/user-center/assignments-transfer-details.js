'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentsTransferCtrl
 * @description
 * # AssignmentsTransferCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AssignmentsTransferCtrl',['Restangular', '$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'DateUtils', 'config', function(Restangular, $scope, $rootScope, $state, $stateParams, $timeout, DateUtils, config) {
    var num = $stateParams.number;
    $scope.showAutoTenderTip = false;
    /*
    *获取债券认购规则
    */
    Restangular.one('assignments/assignmentRule').get().then(function(response){
      $scope.discountFeeRate = response.discountFeeRate;
      $scope.borderDay = response.borderDay;
      $scope.minFee = response.minFee;
      $scope.lessThanOrEqualBorderDayFee = response.lessThanOrEqualBorderDayFee;
      $scope.greaterThanBorderDayFee = response.greaterThanBorderDayFee;
      $scope.recycleReward = response.recycleReward;
      $scope.maxReceivedPaymentsRate = response.maxReceivedPaymentsRate;
    });
    /*
    *获取债券详情
    */
    Restangular.one('creditRights/'+ num + '/creditDetail').get().then(function(response){
      if(response && response.ret !==-1) {
        $scope.creditRight = response.creditRight;
        //现金券判断
        $scope.cashCoupon = $scope.recycleReward && response.increaseRateCoupon && response.increaseRateCoupon.type ===2 ? response.increaseRateCoupon.value : 0;
        //原有债权金额
        $scope.creditRightAmount = response.creditRight.transferableAmount;
        $scope.assignmentsNumber = response.creditRight.number;
        $scope.annualEarnings = response.project.annualEarnings;
        //步进值
        $scope.increaseAmount = response.project.increaseAmount;
        //原标利率
        $scope.creditBaseRate = response.creditRight.baseRate;
        $scope.transferPercent = $scope.annualEarnings;
        //creatTime(ms)
        $scope.creatTime = response.creditRight.createTime;
        //当前时间
        $scope.currentDate = new Date().getTime();
        //上一次回款时间
        var lastRepaymentTime = response.projectBill ? response.projectBill.lastRepaymentTime : 0;

        //剩余期限
        $scope.remainDay = DateUtils.intervalDay(response.project.repaymentDate, $scope.currentDate);

        //利率最大值
        $scope.profitMax = 36500 * (1 - $scope.maxReceivedPaymentsRate) / $scope.remainDay + $scope.annualEarnings;

        //应收利息天数
        $scope.profitDate = DateUtils.intervalDay($scope.currentDate, lastRepaymentTime) * ($scope.currentDate > lastRepaymentTime ? 1 : -1);
      }
    });
    $scope.checkAmount = function(amount) {

      if(amount == 0 ){
        $scope.isShow = true;
      }else if(amount < $scope.increaseAmount ){
        $scope.transferErrMsg = '转让金额必须大于等于' + $scope.increaseAmount;
      }else if(amount % $scope.increaseAmount !==0 ){
        $scope.transferErrMsg = '转让金额必须为'+ $scope.increaseAmount +'的整数倍';
      }else if(amount > $scope.creditRightAmount){
        $scope.transferErrMsg = '转让金额必须小于债权金额';
      }
    }
    var pattern=/^[0-9]*(\.[0-9]{1,2})?$/;
    $scope.checkAnuual = function(annual) {
      if(!pattern.test(annual)){
        $scope.earningErrMsg = '转让利率保留两位小数';
      }
      if(annual < $scope.annualEarnings ){
        $scope.earningErrMsg = '最小转让利率为' + $scope.annualEarnings + '%';
      }else if(annual > $scope.profitMax ){
        $scope.earningErrMsg = '最大转让利率为'+ $scope.profitMax.toFixed(2) +'%';
      }
    }

    //监测转让金额
    $scope.$watch('transferAmount', function(newVal, oldVal){
      $scope.earningErrMsg = undefined;
      $scope.transferErrMsg = undefined;

      if(newVal){
        $scope.checkAmount(newVal);
      }
      //手续费计算   // 原规则：该笔债权持有时间 < 30天，手续费 = 转让本金 * 1%，持有时间 ≥ 30天，手续费 = 转让本金 * 0.5%，单笔转让的手续费最低为3元。
      // if ($scope.currentDate - $scope.creatTime <= $scope.borderDay*24*60*60*1000) {
      //   $scope.counterFee = $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate > $scope.minFee ? $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate : $scope.minFee;
      // }else {
      //   $scope.counterFee = $scope.transferAmount * $scope.greaterThanBorderDayFee /100 * $scope.discountFeeRate > $scope.minFee ? $scope.transferAmount * $scope.greaterThanBorderDayFee /100 * $scope.discountFeeRate : $scope.minFee;
      // }

      // 现规则：手续费 = 转让本金 * 1%，单笔转让的手续费最低为3元。
      $scope.counterFee = $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate > $scope.minFee ? $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate : $scope.minFee;
      //待收未收利息
      $scope.profit = $scope.annualEarnings * newVal * $scope.profitDate /36500;

    });

    //监测转让利率

    $scope.$watch('transferPercent', function(newVal, oldVal){

      $scope.earningErrMsg = undefined;
      $scope.transferErrMsg = undefined;

      if(newVal){
        $scope.checkAnuual(newVal);
      }
    });

    /*
    *自动投标详情
    */
    $scope.autoTender = Restangular.one('/users/' + '0' + '/autoTender' ).get().$object;

    


    /*
    * 确认转让
    */
    $scope.toList = function() {
      $state.go('root.userCenter.assignments');
    }
    $scope.goOnTransfer = function(transferAmount, transferPercent) {
      $scope.showAutoTenderTip = false;
      $scope.transfer(transferAmount, transferPercent);
    }
    $scope.transfer = function(transferAmount, transferPercent) {
      Restangular.one('/creditRights/' + $scope.assignmentsNumber).post('assign',{
        creditRightId: $scope.creditRight.id,
        amount: transferAmount,
        annualEarnings: transferPercent
      }).then(function(response){
        if(response && response.ret !== -1){
          // $rootScope.showMsg('转让成功！');
          $rootScope.showLoadingToast = false;
          $rootScope.successMsg = '转让成功！';
          $rootScope.showSuccessToast = true;
          $timeout(function() {
            $rootScope.showSuccessToast = false;
            $rootScope.successMsg = '';
            $scope.toList();
          }, 1000);

        } else {
          $rootScope.showLoadingToast = false;
          $rootScope.showMsg(response.msg);
        }
      });
    }
    $scope.assignmentsTransfer = function(transferAmount, transferPercent) {
      
      if (transferAmount ==undefined || transferPercent == undefined || $scope.transferAmount <=0 ) {
        return;
      }
      if(transferAmount && transferPercent) {
        $scope.checkAmount(transferAmount);
        $scope.checkAnuual(transferPercent);
        if(transferAmount < $scope.increaseAmount || transferAmount % $scope.increaseAmount !==0  || transferAmount > $scope.creditRightAmount || transferPercent < $scope.annualEarnings || transferPercent > $scope.profitMax) {
          return;
        }
      }
      if($scope.autoTender.status === 0 || $scope.autoTender.status === 1) {
        $scope.showAutoTenderTip = true;
        return;
      }
      $rootScope.showLoadingToast = true;
      $scope.transfer(transferAmount, transferPercent);
    }
    
    //转让协议
    $scope.isShowAgreement = false;
    $scope.showAgreement = function() {
      $scope.isShowAgreement = !$scope.isShowAgreement;
    }


    /*
    *关闭自动投标
    */
    $scope.offAutoTenders = function() {
      $scope.showAutoTenderTip = false;
      Restangular.one('/users/' + '0' + '/disabledAutoTender').put({
        status: 3
      }).then(function(response){
        if(response && response.ret !== -1){
          $rootScope.successMsg = '已禁用！';
          $rootScope.showSuccessToast = true;
          $timeout(function() {
            $rootScope.showSuccessToast = false;
            $rootScope.successMsg = '';
          }, 1000);
          $scope.autoTender = Restangular.one('/users/' + '0' + '/autoTender' ).get().$object;
        }
      })

    };

    $scope.toAssignmentQr = function () {
      window.location.href = config.vue_domain + '/assignment-question'
    }

  }]);
