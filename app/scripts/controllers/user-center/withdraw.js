'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('WithdrawCtrl', function($scope, $rootScope, $state, Restangular, fundsProjects, toCunGuanUtils, Utils) {
    $rootScope.selectedSide = 'account';
    $scope.footer = function(){
      if (Utils.deviceCode() == 5 || Utils.deviceCode() == 6) {
        $rootScope.showFooter = !$rootScope.showFooter;
      }
    }
    Restangular.one('users/0').one('availableCash').get().then(function(response) {
      if (response.ret !== -1) {
        // 获取用户充值信息
        $scope.simpleWithdraw = response;
        $scope.availableCash = $scope.simpleWithdraw.account.balance;
        $scope.availableCashRealNo = ($scope.availableCash - response.withdrawFee) > 0 ? $scope.availableCash - response.withdrawFee : 0;
        if(response.realTimeAmount < 3){
          $scope.placeholderTip = '请输入金额';
        }else{
          $scope.placeholderTip = '金额≤' + (response.realTimeAmount - response.withdrawFee) + '元，预计24:00前可到账';
        }
      } else {
        // 获取信息失败。
      }
    });

    Restangular.one('users/0').one('bankcard').get().then(function(response) {
      if (response.ret !== -1) {
        // 获取用户的银行卡信息
        $scope.bankcard = response;
      } 
    });



    // 跳转到零存宝详情页
    $scope.toInvestCurrentDeposit = function() {
      fundsProjects.one('recommendations', {
        productType: 1
      }).get().then(function(response) {
        if (response.ret !== -1) {
          $state.go('root.current-deposit-detail', {
            number: response.number
          });
        } else {

        }
      });
    }



    /**
     * 提现
     */
    $scope.toWithdraw = function(simpleWithdraw) {
      // $scope.msg = '3';
      var Withdraw = function() {
        var amount = simpleWithdraw.amountDraw;
        if (!amount || amount < 0.01) {
          return;
        }
        if ($scope.simpleWithdraw.amountDraw > $scope.availableCashRealNo) {
          return;
        }
        toCunGuanUtils.to('withdraw', amount, null, null, null, null);
      }
      $rootScope.migrateStatus(Withdraw);
    }

    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      var bindCard = function() {
        if ($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING') {
          return;
        }
        toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
      }
      $rootScope.migrateStatus(bindCard);
    }


    $scope.checkMaxAmount = function(simpleWithdraw) {
      if (simpleWithdraw.amount > simpleWithdraw.availableCash) {
        return true;
      } else {
        return false;
      }
    };
  });
