'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterYeepayCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterYeepayCtrl', function ($rootScope, $scope, $state, $stateParams, md5, config, toCunGuanUtils, SessionService) {

    if(!SessionService.isLogin()){
      $state.go('root.main');
    }

    // 注册易宝POST
    $scope.signUpYeepay = function(user) {

      if (!user || !user.realName || !user.idCardNo) {
        return;
      }
      toCunGuanUtils.to('register', null, user.realName, user.idCardNo, null, null);
    };
    

  });
