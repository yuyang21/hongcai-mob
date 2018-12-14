/*
 * @Author: fuqiang1
 * @Date:   2016-08-29 17:43:41
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-10-14 11:43:10
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckPicUtil', function($rootScope, DEFAULT_DOMAIN, $http) {
    return {
      checkePic: function(val) {
        if (val === undefined) {
          return;
        }
        var msg = '';
        if (val.length >= 4) {
          $http({
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            url: DEFAULT_DOMAIN + '/captchas/checkPic',
            data: {'captcha': val}
          }).success(function(data) {
            if (data == true) {} else {
              msg = '图形验证码错误';
              $rootScope.showMsg(msg);
            }
          }).error(function() {
            msg = '图形验证码错误';
            $rootScope.showMsg(msg);
          });
        }
      }
    }
  })
