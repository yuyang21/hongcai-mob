'use strict';
angular.module('p2pSiteMobApp')
  .controller('RootCtrl', function($scope, $state) {

    $scope.go = function(state){
      $state.go(state);
    }

  });
