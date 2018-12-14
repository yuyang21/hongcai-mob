'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', function(CheckPicUtil, CheckMobUtil, $timeout, $scope, $state, $rootScope, $stateParams, $location, md5, ipCookie, HongcaiLogin, SessionService, WEB_DEFAULT_DOMAIN) {
    $scope.user = {
      mobileCaptchaType:0,
      mobileCaptchaBusiness:3
    };

    $scope.busy = false;
    // $scope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;

    // 默认登陆密码登录
    $scope.isPassward = true;
    $scope.changeLogin = function() {
      $scope.isPassward = !$scope.isPassward;
    }

    // 获取用户的openId
    var openId = $stateParams.openId;
    var redirectUrl = $stateParams.redirectUrl;
    var loginBe;

    if (ipCookie('userName')) {
      $scope.user.mobile = ipCookie('userName');
    }

    //登陆成功
    $scope.loginSuccess = function(response){
      $timeout(function() {
          $scope.busy = false;
        }, 1000);

        SessionService.loginSuccess(response.$response.data);
        if (redirectUrl && redirectUrl.indexOf('/login') !== 0) {
          $location.url(decodeURIComponent(redirectUrl));
          return;
        }
        
        $state.go('root.main');
    }

    /**
     * 密码登录
     */
    $scope.toLogin = function(user) {
      
      user.password = user.password.replace(/\s/g, "");
      if(!user.password || !user.mobile){
        $rootScope.showMsg('账号或密码不能为空');
        return;
      }
      
      if($scope.busy){
        return;
      }
      $scope.busy = true;

      if ($scope.rememberUserName) {
        ipCookie('userName', user.mobile, {
          expires: 60
        });
      }
      
      HongcaiLogin.userLogin.$create({
        account: user.mobile,
        password: md5.createHash(user.password),
        openId: openId,
        guestId: ipCookie('guestId')
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 1000);
        } else {
          $scope.loginSuccess(response);
        }
      });
    };

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

    /**
     * 验证码登录
     */
     $scope.toMobileLogin = function(user) {
      if (!$scope.checkMobile(user.mobile) || !$scope.checkPicCaptchLength(user.picCaptcha) || $scope.busy) {
        return;
      }
      
      $scope.busy = true;

      if ($scope.rememberUserName) {
        ipCookie('userName', user.mobile, {
          expires: 60
        });
      }
      
      HongcaiLogin.mobileLogin.$create({
        mobile: user.mobile,
        captcha: user.captcha,
        openId: openId,
        guestId: ipCookie('guestId')
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 1000);
        } else {
          $scope.loginSuccess(response);
        }
      });
    };

    //监测手机号码
    $scope.$watch('user.mobile', function(val) {
      if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth >= 11 && !$rootScope.mobilePattern.test(val)) {
            $rootScope.showMsg('手机号码格式不正确');
          }
        }
    })

    //监测图形验证码
    $scope.$watch('user.picCaptcha', function(newVal) {
      //校验图形验证码只能输入数字
      var captchaPattern = /^\d{1,4}$/
      if (newVal && !captchaPattern.test(newVal)) {
        $scope.user.picCaptcha = newVal.replace(/\D/g, '').toString().slice(0, 4)
      }
      $scope.piccha = false;
      var msg = CheckPicUtil.checkePic(newVal);
      if(msg){
        $scope.piccha = true;
      }
    })

    //图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
  });
