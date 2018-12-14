'use strict';
angular.module('p2pSiteMobApp')
  .factory('toCunGuanUtils', function($state, $rootScope, $timeout, $stateParams, config, Utils, Restangular, restmod, WEB_DEFAULT_DOMAIN) {
    
    function redirectToYeepay(business, encrpyMsg) {
        if (encrpyMsg.ret !== -1) {

          if(config.pay_company === 'yeepay'){
            var req = encrpyMsg.req;
            var sign = encrpyMsg.sign;
            var _f = Utils.createForm();
            Utils.createElements(_f, 'req', req);
            Utils.createElements(_f, 'sign', sign);
            _f.action = config.YEEPAY_ADDRESS + business;
            _f.submit();
          } else if (config.pay_company === 'cgt'){
            var serviceName = encrpyMsg.serviceName;
            var platformNo = encrpyMsg.platformNo;
            var userDevice = encrpyMsg.userDevice;
            var reqData = encrpyMsg.reqData;
            var keySerial = encrpyMsg.keySerial;
            var sign = encrpyMsg.sign;
            var _f = Utils.createForm();
            Utils.createElements(_f, 'serviceName', serviceName);
            Utils.createElements(_f, 'platformNo', platformNo);
            Utils.createElements(_f, 'userDevice', userDevice);
            Utils.createElements(_f, 'reqData', reqData);
            Utils.createElements(_f, 'keySerial', keySerial);
            Utils.createElements(_f, 'sign', sign);
            _f.action = config.YEEPAY_ADDRESS;
            _f.submit();
            $timeout(function() {
              $rootScope.showLoadingToast = false;
            }, 2000);
          }
        } else {
          alert(encrpyMsg.msg);
          $rootScope.showLoadingToast = false;
        }
      }

    return {

      to: function(type, number, realName, idNo, rechargeWay, expectPayCompany){
        $rootScope.showLoadingToast = true;
        // 跳转较慢并且认证用户失败的判断。
        if (type === 'recharge') {
          //充值
          Restangular.one('/users/0/').post('recharge', {
            'amount': number,
            'rechargeWay': rechargeWay,
            'expectPayCompany': expectPayCompany,
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response){
            redirectToYeepay('toRecharge', response);
          })

        } else if (type === 'withdraw') { //提现
          Restangular.one('/users/0/').post('withdraw', {
            'amount': number,
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response) {
            redirectToYeepay('toWithdraw', response);
          });

        } else if (type === 'BIND_BANK_CARD') { //绑卡
          Restangular.one('/users/0/').post('bindBankcard', {
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response) {
            redirectToYeepay('toBindBankCard', response);
          });

        } else if (type === 'UNBIND_BANKCARD') { //解绑卡
          restmod.model(WEB_DEFAULT_DOMAIN + '/yeepay').$find('/cgtUnbindBankCard',{
            'from': 2,
            'device': Utils.deviceCode()
          }).$then(function(response) {
             redirectToYeepay('toUnBindBankCard', response);
          })

        } else if (type === 'register') { // 开通易宝
          Restangular.one('/users/0/').post('yeepayRegister', {
            'realName': realName,
            'idCardNo': idNo,
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response) {
            redirectToYeepay('toRegister', response);
          });
        } else if (type === 'transfer') { //投资

          Restangular.one('/orders/' + number + '/users/' + '0' + '/').post('payment', {
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response) {
            redirectToYeepay('toTransfer', response);
          });

        } else if (type === 'autoTransfer') { // 自动投标
          Restangular.one('/users/0/').post('authorizeAutoTransfer', {
            'from': 2,
            'device': Utils.deviceCode()
          }).then(function(response) {
            redirectToYeepay('toAuthorizeAutoTransfer', response);
          });

        } else if (type === 'RESET_MOBILE') { //修改手机号码（已绑定）
          Restangular.one('/users/0/').post('resetMobile', {
            'from': 2,
            'mobile': $stateParams.number
          }).then(function(response){
            redirectToYeepay('toResetMobile',response);
          });
        } else if (type === 'autoRepayment') { //自动还款授权

        } else if (type === 'active') { //银行资金存管系统激活
          Restangular.one('/userAuths/').post('cgtActive', {
            'from': 2
          }).then(function(response){
            redirectToYeepay('toActive',response);
          });
        }
      }
    }
  });
