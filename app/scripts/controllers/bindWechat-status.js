'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BindSuccessCtrl
 * @description
 * # BindSuccessCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('BindSuccessCtrl', function($scope, $stateParams, $rootScope) {
    $rootScope.showFooter = false;
    $scope.status = parseInt($stateParams.status) || 0;
    

});
