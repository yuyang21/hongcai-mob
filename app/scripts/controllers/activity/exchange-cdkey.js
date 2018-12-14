/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 09:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ExchangeCdkeyCtrl', function($rootScope, $scope, $state, $stateParams, $location, $timeout, Restangular, config, SessionService) {
    $scope.showCdkey = false;

    $rootScope.showLoadingToast = false;
    $scope.exchangeCdkey = function(cdkey) {
      if(!cdkey || !cdkey.exchangeCode || cdkey.exchangeCode.length !== 6){
        $rootScope.showMsg('兑换码有误！');
        return;
      }

      $rootScope.showLoadingToast = true;
      Restangular.one('activitys/').one('exchangePrimaryCdkey').put({
        exchangeCode : cdkey.exchangeCode
      }).then(function(response){
        $rootScope.showLoadingToast = false;
        if(response && response.ret !== -1) {
          $scope.showCdkey = true;
          $scope.cdkey = response.cdkey;
          return;
        }else{        
          $rootScope.showMsg(response.msg);
          return;
        }
      })
    }

  })