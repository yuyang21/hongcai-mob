'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BankcardCtrl
 * @description
 * # BankcardCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('BankcardCtrl', function($scope, $rootScope, $state, restmod, WEB_DEFAULT_DOMAIN, Restangular, UserService, toCunGuanUtils, $timeout) {


    UserService.loadAccount($scope);

    $scope.bankcard = Restangular.one('users/0').one('bankcard').get().$object;
    
    $scope.unbindBankCardApply = Restangular.one('users/0').one('unbindBankCardApply').get().$object;

    $scope.busy = false;
    $scope.unBindBankcard = function() {
      $scope.showMask = false;
      $scope.showBankCard = false;
      $scope.busy = true;
      $timeout(function() {
        $scope.busy = false;
      }, 1000);
      toCunGuanUtils.to('UNBIND_BANKCARD', null, null, null, null, null);
      

      // $scope.busy = true;
      // restmod.model(WEB_DEFAULT_DOMAIN + '/yeepay').$find('/unbindBankCard').$then(function(response) {
      //   $scope.showMask = false;
      //   $scope.showBankCard = false;
      //   if (!response || response.ret == -1) {
      //     return;
      //   }
      //   if ($rootScope.payCompany === 'cgt') {
      //     $state.go('root.yeepay-callback', {
      //       business: 'UNBIND_BANK_CARD'
      //     });
      //   }
      //   if ($rootScope.payCompany === 'yeepay') {
      //     $state.go('root.yeepay-callback', {
      //       business: 'UNBIND_BANK_CARD_ING'
      //     });
      // //   }

      //   $scope.busy = false;
      // });
    }
    
    $scope.showMask = false;
    $scope.showBankCard = false;
    $scope.toRemoveCard = function() {
      var act = function() {
        $scope.showBankCard = true;
        $scope.showMask = true;
      }
      $rootScope.migrateStatus(act);
    }
    $scope.cancle = function() {
      $scope.showBankCard = false;
      $scope.showMask = false;
    }
      /*根据屏幕高度设置内容高度*/
    angular.element('document').ready(function() {
      //初始化宽度、高度
      angular.element(".bankcard-body").css("min-height", angular.element(window).height() + "px");
      //当文档窗口发生改变时 触发
      angular.element(window).resize(function() {
        angular.element(".bankcard-body").css("min-height", angular.element(window).height() + "px");
      });
    });
  });
