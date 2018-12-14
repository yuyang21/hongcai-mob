'use strict';
angular.module('p2pSiteMobApp')
  .controller('HeaderCtrl', function($scope, $location, $state, $rootScope, $stateParams) {

    $rootScope.showMe = false;
    $scope.toggle = function () {
        $rootScope.showMe = !$rootScope.showMe;
    };

  });
