'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # CreditsOverviewCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('CreditsOverviewCtrl', function ($scope, $state, $rootScope, Restangular) {
    $scope.investStat = {
      selection: 0,
      hornor:0,
      assignment:0,
      totalInvestAmount: 0
    }

    $scope.showOther =false;

    /**
    * 所有投资查询
    **/
    Restangular.one('/users/0/investments/typeStat').get({}).then(function(response){
      if(!response || response.ret == -1){
        return;
      }
      // $scope.investStat.holdingAmount = 0;
      for(var i = 0;i<response.length;i++) {
        var stat = response[i];
        
        if(stat.creditRightType == 7){
           $scope.investStat.selection = stat.totalInvestAmount;
        } else if(stat.creditRightType == 8) {
          $scope.investStat.hornor = stat.totalInvestAmount;
        } else if (stat.creditRightType == 6) {
          $scope.investStat.assignment = stat.totalInvestAmount;
        } else if(stat.creditRightType == 3){
          $scope.showOther = true;
        }

      }
      $scope.investStat.totalInvestAmount = $scope.investStat.selection+ $scope.investStat.hornor + $scope.investStat.assignment;

   });
    
});
