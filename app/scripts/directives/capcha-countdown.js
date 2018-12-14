/*
 * @Author: fuqiang1
 * @Date:   2016-08-31 09:56:54
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-09-01 17:34:50
 */

'use strict';
angular.module('p2pSiteMobApp')
  .directive('capchaCountdown', function($http, Restangular, ipCookie, Utils, $location) { //定义指令时的名称用驼峰命名，使用时用中划线方式
    return {
      restrict: 'EA',
      scope: false,
      link: function(scope, elem, attrs) {

        function capchaCountdown() {
          if (!scope.user.mobile || !scope.mobilePattern.test(scope.user.mobile) || !scope.user.picCaptcha) {
            return;
          }
          Restangular.one('/users/').post('mobileCaptcha', {  
            mobile: scope.user.mobile,
            picCaptcha: scope.user.picCaptcha,
            type: scope.user.mobileCaptchaType,
            business: scope.user.mobileCaptchaBusiness,
            device: Utils.deviceCode(),
            guestId: ipCookie('guestId')
          }).then(function(response) {
            if (response.ret === -1) {
              scope.showMsg(response.msg);
            } else {
              countDown();
            }
          });
          var second = 60;

          function countDown() {
            // 如果秒数还是大于0，则表示倒计时还没结束
            if (second >= 0) {
              // 倒计时不结束按钮不可点
              attrs.$$element[0].disabled = true;
              elem[0].innerHTML = null;
              elem[0].innerHTML = second + "s";
              elem[0].className = '';
              // 时间减一
              second -= 1;
              // 一秒后重复执行
              setTimeout(function() {
                countDown(elem[0]);
              }, 1000);
              // 否则，按钮重置为初始状态,可点击
            } else {
              elem[0].className = '';
              elem[0].innerHTML = "重新发送";
              second = 60;
              attrs.$$element[0].disabled = false;
            }

          }
        }
        elem.on('click', capchaCountdown);
      }
    }
  })
