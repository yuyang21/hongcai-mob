/*
* @Author: yuyang
* @Date:   2018-05-07 14:06:10
* @Last Modified by:   yuyang
* @Last Modified time: 2018-05-07 14:06:10
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ChannelCtrl', function($scope, $timeout, $rootScope, $stateParams, ipCookie, Utils, Restangular, CheckMobUtil, CheckPicUtil, SessionService, WEB_DEFAULT_DOMAIN, InviteShareUtils, WechatShareUtils) {
  	
    $scope.user = {
      mobileCaptchaType:1,
      mobileCaptchaBusiness:0
    };
    // 图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
    // $scope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    $scope.isSuccess = false;
    $scope.isSuccess ? $('#activity').addClass('position-fix')  : $('#activity').removeClass('position-fix'); 
    $scope.successMask = function() {
    	$scope.isSuccess = !$scope.isSuccess;
    	$scope.isSuccess ? $('#activity').addClass('position-fix')  : $('#activity').removeClass('position-fix'); 
    }

    $scope.checkPicCaptchLength = function(picCaptcha){
      if(picCaptcha.toString().length !== 4){
        $rootScope.showMsg('图形验证码错误');
        return false;
      }
      return true;
    }

    $scope.checkMobile = function(mobile){
      if(!$rootScope.mobilePattern.test(mobile)){
        $rootScope.showMsg("手机号码格式不正确");
        return false;
      }
      return true;
    }

    $scope.busy = false;
    $scope.signUp = function(user) {
      if (!$scope.checkMobile(user.mobile) || !$scope.checkPicCaptchLength(user.picCaptcha) || $scope.busy) {
        return;
      }

      var act;
      if(ipCookie('act') && !isNaN(ipCookie('act'))){
        act = ipCookie('act');
      }
      $scope.busy = true;
      $rootScope.showLoadingToast = true;
      Restangular.one('users/').post('register', { 
        password: '',
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: $stateParams.inviteCode,
        channelCode: ipCookie('utm_from'),
        act: act,
        channelParams: ipCookie('channelParams'),
        device: Utils.deviceCode(),
        guestId: ipCookie('guestId')
      }).then(function(response) {
        if (response.ret === -1) {
          $rootScope.showLoadingToast = false;
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 2000);
        } else {
          SessionService.loginSuccess(response);
          $scope.successMask();
          $rootScope.showLoadingToast = false;
        }
      })
    }

    // 监测手机号码
    $scope.$watch('user.mobile', function(newVal) {
      if (newVal > 11) {
        $scope.user.mobile = newVal.replace(/\D/g, '').toString().slice(0, 11)
      }
      CheckMobUtil.checkMob(newVal);
    })

     // 监测图形验证码
    $scope.$watch('user.picCaptcha', function(newVal) {
      //校验图形验证码只能输入数字
      var captchaPattern = /^\d{1,4}$/
      if (newVal && !captchaPattern.test(newVal)) {
        $scope.user.picCaptcha = newVal.replace(/\D/g, '').toString().slice(0, 4)
      }
    })

    // 监测短信验证码
    $scope.$watch('user.captcha', function(newVal) {
      var captchaPattern = /^\d{1,6}$/
      if (newVal && !captchaPattern.test(newVal)) {
        $scope.user.captcha = newVal.replace(/\D/g, '').toString().slice(0, 6)
      }
    })

    // 用户获取短信验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user){
        return;
      }
    };

  })