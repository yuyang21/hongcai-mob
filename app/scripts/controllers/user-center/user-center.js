'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('UserCenterCtrl', function ($scope, $rootScope, $state, SessionService) {


    if(!SessionService.isLogin()){
      $state.go('root.login');
    }

    /**
     * 是否激活银行资金存管系统
     */
    $rootScope.migrateStatus();

  });
