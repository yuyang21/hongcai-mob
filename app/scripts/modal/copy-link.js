/*
* @Author: fuqiang1
* @Date:   2016-09-27 17:16:52
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-28 18:56:28
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CopyLinkCtrl', function($scope, $state, $location, $uibModalInstance, Restangular) {

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 实名认证，即开通易宝
     */
    $scope.btnInner = '复制链接';
    $scope.copyLink = function(){
      $scope.btnInner = '复制成功';
    }
    /**
     * 邀请码
     */

    $scope.voucher = Restangular.one('users/0').one('voucher').get({}).$object;

  });
