'use strict';
angular.module('p2pSiteMobApp')
  .controller('mothersDayCtrl', function($scope, Utils) {
  	$scope.showDownload = false;
    $scope.deviceCode = Utils.deviceCode();
    // $scope.showRules = true;
  	// 活动规则弹窗
  	$scope.showBox = function() {
      $scope.showRules = !$scope.showRules;
      $scope.showRules ? $('.mothers-day').addClass('position-fix')  : $('.mothers-day').removeClass('position-fix');
    }
  })