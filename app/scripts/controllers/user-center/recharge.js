'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function($timeout, $scope, $rootScope, $stateParams, $state, restmod, Restangular, WEB_DEFAULT_DOMAIN, toCunGuanUtils, Utils) {
    $rootScope.selectedSide = 'account';
    $scope.rechargeAmount = $stateParams.amount;
    $scope.showLimit = false;
    var scrollTop = 0;
    $scope.footer = function(){
      if (Utils.deviceCode() == 5 || Utils.deviceCode() == 6) {
        $rootScope.showFooter = !$rootScope.showFooter;
      }
    }
    // 支持银行弹窗
    $scope.showbankLimit = function() {
      $scope.showLimit = !$scope.showLimit;
      $scope.showLimit ? unlockScreen() : lockScreen();
    }

    function lockScreen() {
      $rootScope.showFooter = true;
      $('.recharge').removeClass('position-fix'); 
      // 滚回到老地方！
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    function unlockScreen() {
      // 在弹出层显示之前，记录当前的滚动位置
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      // 使body脱离文档流
      $('.recharge').addClass('position-fix'); 
      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -scrollTop + 'px';
      $rootScope.showFooter = false;
    }
   

    //银行卡维护
    $scope.maintainCard = function() {
      $rootScope.showChange = !$rootScope.showChange;
      $rootScope.showChange ? unlockScreen() : lockScreen();
    }

    // 解绑银行卡
    var unBindBankcardModel = restmod.model(WEB_DEFAULT_DOMAIN + '/yeepay');
    $scope.unBindBankcard = function() {
      unBindBankcardModel.$find('/unbindBankCard').$then(function(response) {
        $scope.showChange = false;
        if (!response || response.ret == -1) {
          return;
        }
        toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
      });
    }

    // 获取用户的银行卡剩余额度
    $scope.getUserBankCard = function(expectPayCompany){
      var siteBankLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getUserRechargeRemainLimit?&payCompany=" + expectPayCompany);
      siteBankLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
          $scope.bankRemain = response.data.bankRemain;
          $scope.bankStatus = response.data.bankStatus; //0 正常 1维护
        }
      });
    }

    $scope.bankCardList = [];
    // 查询支付公司下所有银行限额信息
    $scope.getBankRechargeLimit = function(expectPayCompany){
      var siteBankRechargeLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getBankRechargeLimit?&payCompany=" + expectPayCompany);
      siteBankRechargeLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
            $scope.bankCardList = response.data.bankLimit;
            for(var i=0; i< $scope.bankCardList.length; i++){
              $scope.bankCardList[i].src = $scope.bankCard_src[$scope.bankCardList[i].bankCode];
              $scope.bankCardList[i].singleLimit = $scope.bankCardList[i].singleLimit <0 ? '不限' : $scope.bankCardList[i].singleLimit%10000 ==0 ? $scope.bankCardList[i].singleLimit/10000 +'w' : $scope.bankCardList[i].singleLimit;
              $scope.bankCardList[i].dayLimit = $scope.bankCardList[i].dayLimit <0 ? '不限' : $scope.bankCardList[i].dayLimit%10000 ==0 ? $scope.bankCardList[i].dayLimit/10000 +'w' : $scope.bankCardList[i].dayLimit;
              $scope.bankCardList[i].monthLimit = $scope.bankCardList[i].monthLimit <0 ? '不限' : $scope.bankCardList[i].monthLimit%10000 ==0 ? $scope.bankCardList[i].monthLimit/10000 +'w' : $scope.bankCardList[i].monthLimit;
            }

        }
      });
    }

    $scope.bankCard_src = {
      'ICBK': '/images/user-center/ICBK.png',
      'BKCH': '/images/user-center/BKCH.png',
      'PCBC': '/images/user-center/PCBC.png',
      'ABOC': '/images/user-center/ABOC.png',
      'COMM': '/images/user-center/COMM.png',
      'CMBC': '/images/user-center/CMBC.png',
      'CIBK': '/images/user-center/CIBK.png',
      'SZDB': '/images/user-center/SZDB.png',
      'MSBC': '/images/user-center/MSBC.png',
      'EVER': '/images/user-center/EVER.png',
      'HXBK': '/images/user-center/HXBK.png',
      'GDBK': '/images/user-center/GDBK.png',
      'PSBC': '/images/user-center/PSBC.png',
      'FJIB': '/images/user-center/FJIB.png',
      'SPDB': '/images/user-center/SPDB.png',
      'BJCN': '/images/user-center/BJCN.png'
    }

    $scope.busy = false;
    $scope.recharge = function(amount) {
      var recharge = function() {
        var curHours = new Date().getHours(); //当前小时值
        var curMinutes = new Date().getMinutes(); //当前分钟值
        if ($scope.bankStatus && $scope.bankStatus == 1) {  //银行卡维护
          $scope.maintainCard();
          return;
        }
        //24点前后6分钟限制
        if((curHours === 23 && curMinutes >= 54) || (curHours === 0 && curMinutes <= 6)) {
          $scope.rechargeTimeLimit = true;
          return;
        }
        if (!amount || amount < 3 || amount > $scope.bankRemain || $scope.busy) {
          return;
        }
        
        $scope.busy = true;
        $timeout(function() {
          $scope.busy = false;
        }, 1000);

        toCunGuanUtils.to('recharge', amount, null, null, $scope.rechargeWay, $scope.expectPayCompany);
      }
      $rootScope.migrateStatus(recharge);
    }
    Restangular.one('users/0').one('availableCash').get().then(function(response) {
      if (response.ret !== -1) {
        // 获取用户充值信息
        $scope.simpleWithdraw = response;
      } else {
        // 获取信息失败。
      }
    });

    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      var bindBankcard = function() {
        if ($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING') {
          return;
        }
        toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
      }
      $rootScope.migrateStatus(bindBankcard);
      
    };

    //记录选择支付方式 'FUIOU':富友，'ALLINPAY'：通联，'UMPAY':通联优势， 'UCFPAY': 先锋支付
    //payment 1: 富友，2: 通联优势，3: 先锋支付
    $scope.selectPay = function(payment) {
      $scope.bankCardList = {};
      $scope.payment = payment;
      // $scope.bankRemainHolder = $scope.payment == 1? '该卡可充值' + $scope.bankRemain + '元' : '';
      if(payment ===1){
        $scope.rechargeWay = 'SWIFT';
        $scope.expectPayCompany = 'FUIOU';
      }else if (payment === 3) {
        $scope.rechargeWay = 'SWIFT';
        $scope.expectPayCompany = 'UCFPAY';
      }else if (payment === 4) {
        $scope.rechargeWay = 'SWIFT';
        $scope.expectPayCompany = 'YEEPAY';
      }
      $scope.getUserBankCard($scope.expectPayCompany);
      $scope.getBankRechargeLimit($scope.expectPayCompany);
      
    }
    $scope.selectPay(3);


  });
