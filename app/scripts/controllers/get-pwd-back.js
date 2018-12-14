'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GetPwdCtrl', function(checkPwdUtils, $rootScope, $scope, $state, $stateParams, $timeout, Utils, CheckMobUtil, CheckPicUtil, md5 ,Restangular, ipCookie, WEB_DEFAULT_DOMAIN) {
    //图形验证码
    $scope.btnText = '按钮';
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };

    $scope.user = {
      mobileCaptchaBusiness:1
    };

    /**
     * 监测用户手机号
     */
    $scope.$watch('user.mobile', function(newVal) {
        CheckMobUtil.checkMob(newVal);
      })
      /**
       * 监测图形验证码
       */
    $scope.$watch('user.picCaptcha', function(newVal) {
      //校验图形验证码只能输入数字
      var captchaPattern = /^\d{1,4}$/
      if (newVal && !captchaPattern.test(newVal)) {
        $scope.user.picCaptcha = newVal.replace(/\D/g, '').toString().slice(0, 4)
      }
      $rootScope.msg = '';
      CheckPicUtil.checkePic(newVal);
      if ($rootScope.msg) {
        $scope.piccha = false;
      } else {
        $scope.piccha = true;
      }
    })

    /**
     * 获取验证码进行下一步
     */
     $scope.busy = false;
    $scope.newPwd = function(mobile, captcha, picCaptcha) {
      if (!mobile || !captcha || !picCaptcha || $scope.busy) {
        return;
      }
      //判断手机号码
      if (!$rootScope.mobilePattern.test(mobile)) {
        $rootScope.showMsg('手机号码格式不正确');
        return;
      }

      if ($scope.piccha == false || picCaptcha.toString().length !== 4) {
        $rootScope.showMsg('图形验证码有误');
        return;
      }
      $scope.busy = true;

      Restangular.one('users/').one('checkMobileCaptcha').get({
        mobile: mobile,
        captcha: captcha,
        business:1,
        guestId: ipCookie('guestId')
      }).then(function(response) {
        if (response.ret === -1) {
          $timeout(function() {
            $scope.busy = false;
          }, 2000);
          $scope.getCaptchaErr = response.msg;
          $rootScope.showMsg(response.msg);
        } else {
          $timeout(function() {
            $scope.busy = false;
          }, 2000);
          $state.go('root.getPwd2', {
            mobile: mobile,
            captcha: captcha
          });
        }
      });
    };

    $scope.$watch('user.captcha', function(newVal, oldVal) {
      $scope.sendMsg = true;
      if (!newVal || newVal == undefined) {
        $scope.sendMsg = false;

      }
      $scope.getCaptchaErr = null;
    });

    $scope.mobileNum = $stateParams.mobile;
    $scope.captchaNum = $stateParams.captcha;



    /**
     * 下一步修改密码
     */
    $scope.$watch('chg.newPassword1', function(newVal) {
      if (!newVal) {
        return;
      }

      //调用checkPwdUtils，判断密码是否含非法字符
      checkPwdUtils.showPwd1(newVal);
    })

    $scope.$watch('chg.newPassword2', function(newVal) {
      if (newVal === undefined) {
        return;
      }

      checkPwdUtils.eqPwd($scope.chg.newPassword1, $scope.chg.newPassword2);

    })
    $scope.changePassword = function(chg) {
      chg.newPassword1 = chg.newPassword1.replace(/\s/g, "");
      chg.newPassword2 = chg.newPassword2.replace(/\s/g, "");

      $scope.msg = '';
      if($scope.busy) {
        return;
      }
      if (chg.newPassword1 !== chg.newPassword2) {
        $rootScope.showMsg('两次密码输入不一致');
        return;
      }

      var msg = checkPwdUtils.showPwd2(chg.newPassword1);
      if (msg) {
        return;
      }
      $scope.busy = true;

      Restangular.one('users/').post('resetMobilePassword', {
          mobile: $scope.mobileNum,
          captcha: $scope.captchaNum,
          password: md5.createHash(chg.newPassword2),
          device: Utils.deviceCode()
        }).then(function(response) {
          $timeout(function() {
              $scope.busy = false;
          }, 2000);
          if (response.ret === -1) {   
            $scope.changePasswordMsg = response.msg;
          } else {
            $state.go('root.login');
            $rootScope.showSuccessMsg('找回密码成功', 1000);
          }
        });
    }
  });
