/*
 * @Author: Administrator
 * @Date:   2016-08-29 14:03:25
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-10-14 11:42:40
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckMobUtil', function($rootScope, Restangular, $location) {
    return {
      checkMob: function(val) {
        var msg = '';
        var path = $location.path().split('/')[1];
        if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth >= 11 && !$rootScope.mobilePattern.test(val)) {
            msg = '手机号码格式不正确';
            $rootScope.showMsg(msg);
          }
          if (valLgth === 11 && $rootScope.mobilePattern.test(val)) {
            Restangular.one('/users/').post('isUnique', {
              account: val
            }).then(function(response) {
              if (path == 'getPwd1') {
                if (response.ret == -1) {
                  return;
                }
                msg = '该手机号还未注册';
                $rootScope.showMsg(msg);
                return;
              }
              if (path !== 'getPwd1') {
                if (response.ret === -1) {
                  if(path === 'lottey') {
                    msg = '已经注册，去APP';
                    $rootScope.showMsg(msg);
                    return;
                  }
                  msg = '手机号已被占用';
                  $rootScope.showMsg(msg);
                }
              }
            })
          }
        }
      }
    }
  })
