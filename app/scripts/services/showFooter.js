/*
* @Author: yuyang
* @Date:   2016-09-02 16:19:01
* @Last Modified by:   yuyang
* @Last Modified time: 2016-09-02 16:25:54
*/

'use strict';
angular.module('p2pSiteMobApp')
  .factory('judgeFooter', function($rootScope, $location) {
    return {
      showFooter: function(){
        var path = $location.path().split('/')[1];
        // 不需要显示footer的path
        var notShowFooterRoute = [
          'share-home',
          'share-detail',
          'experience-landing',
          'experience-activity',
          'rate-activity',
          'exchange-code',
          'share-scene-example',
          'activity-scene',
          'share-scene',
          'share-spring',
          'rate-coupon',
          'project',
          'project-info',
          'project-detail',
          'activity'
        ];
        $rootScope.showFooter = false;
        if (notShowFooterRoute.indexOf(path) === -1) {
          $rootScope.showFooter = true;
        }
      }
    }
  })
