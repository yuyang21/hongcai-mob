'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('MessageDetailCtrl', function ($scope, $state, WEB_DEFAULT_DOMAIN, restmod, $stateParams) {

    /**
     *  查询公告信息
     */
    var siteTextModel = restmod.model(WEB_DEFAULT_DOMAIN + '/siteText');
    siteTextModel.$find('getTextDetail', {
      textId: $stateParams.id
    }).$then(function(response){ 
      if(response && response.ret !== -1) {
        $scope.noticeDetail = response.data.text;
      }
    })

  });
