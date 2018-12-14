'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:YeepayCallbackCtrl
 * @description
 * # YeepayCallbackCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('YeepayCallbackCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, $location) {
    $scope.page = '0';
    $scope.amount = $stateParams.amount;
    var business = $stateParams.business;

    if (business === 'RECHARGE') {
      $scope.page = 1;
    } else if (business === 'WITHDRAW') {
      $scope.page = 2;
    } else if (business === 'TRANSFER') {
      $scope.page = 3;
      Restangular.one('orders/'+$stateParams.number+'/orderCoupon').get().then(function(response) {
        $scope.coupon = response;
      });

    } else if (business === 'BIND_BANK_CARD') {
      $scope.page = 4;
    } else if (business === 'RESET_MOBILE') {
      $scope.page = 5;
    } else if (business === 'EXPERIENCE') {
      $scope.page = 6;
    } else if (business === 'USER_ACTIVE') {
      $scope.page = 7;
    } else if (business === 'UNBIND_BANKCARD') {
      $scope.page = 8;
    } else if (business === 'UNBIND_BANK_CARD_ING') {
      $scope.page = 9;
    } else if(business === 'AUTHORIZATION_AUTO_TRANSFER'){
      $scope.page = 10;
      $location.path('/user-center/autotender');
      // $state.go('root.userCenter.autotender');
    } 
    // ipCookie('mark', 'callbackSuccess');
  });
