'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', function(CheckPicUtil, checkPwdUtils, $http, $timeout, $rootScope, $scope, $state, $stateParams,  $location, CheckMobUtil, md5, ipCookie, Utils, WEB_DEFAULT_DOMAIN, SessionService, Restangular) {
    // 注册链接上是否有邀请码
    $scope.btn = 'haha';
    $scope.user = {
      mobileCaptchaType:1,
      mobileCaptchaBusiness:0
    };
    console.log($rootScope.mobilePattern)
    if ($stateParams.inviteCode) {
      $scope.user.inviteCode = $stateParams.inviteCode;
    }
    $scope.showRegistrationAgreement = false;
    $scope.toggle = function() {
      $scope.showRegistrationAgreement = !$scope.showRegistrationAgreement;
    };

    var redirectUrl = $stateParams.redirectUrl;
    $scope.checkPassword = function(password){
      var msg = checkPwdUtils.showPwd2(password);
      if (msg) {
        return false;
      }
      return true;
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
      user.password = user.password.replace(/\s/g, ""); //去除所有空格
      if (!$scope.checkMobile(user.mobile) || !$scope.checkPassword(user.password) || !$scope.checkPicCaptchLength(user.picCaptcha) || $scope.busy) {
        return;
      }

      var act;
      if(ipCookie('act') && !isNaN(ipCookie('act'))){
        act = ipCookie('act');
      }
       $scope.busy = true;
      Restangular.one('users/').post('register', {  
        // name: user.name,
        picCaptcha: user.picCaptcha,
        password: md5.createHash(user.password),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        channelCode: ipCookie('utm_from'),
        act: act,
        channelParams: ipCookie('channelParams'),
        device: Utils.deviceCode(),
        guestId: ipCookie('guestId')
      }).then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 2000);
        } else {
          $rootScope.showSuccessMsg('注册成功！',800);
          SessionService.loginSuccess(response);
          if (redirectUrl && redirectUrl.indexOf('/register2') !== 0) {
            $location.url(decodeURIComponent(redirectUrl));
            $rootScope.showSuccessMsg
            return;
          }
          $state.go('root.register-success', {
            userId: 0
          });
        }
      })

    };

    //监测手机号码
    $scope.$watch('user.mobile', function(newVal) {
      CheckMobUtil.checkMob(newVal);
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

    //监测密码
    $scope.$watch('user.password', function(newVal) {
      if (!newVal) {
        return;
      }
      //调用checkPwdUtils，判断密码是否含非法字符
      checkPwdUtils.showPwd1(newVal);

    })

    //监测邀请码
    $scope.$watch('user.inviteCode', function(newVal) {
      if (newVal === undefined) {
        return;
      }

      var valLgth4 = newVal.toString().length;
      if (valLgth4 >= 11) {
        $http({
          method: 'POST',
          url: WEB_DEFAULT_DOMAIN + '/activity/checkInviteCode?inviteCode=' + newVal
        }).success(function(response) {
          if (response.data.isValid === 1) {
            $rootScope.msg = '';
          } else if (response.data.isValid === 0) {
            $rootScope.showMsg('邀请码不存在');
          }
        }).error(function() {
          $rootScope.showMsg('邀请码不存在');
        });
      }
    })

    // 用户获取短信验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user){
        return;
      }

    };

    //邀请码
    $scope.investCode = false;
    if($stateParams.inviteCode){
      $scope.investCode = true;
    }

    //图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };

    //解决input checkbox checked不起作用问题
    $scope.checked = function() {
      if ($('#isremind').is(':checked')) {
        $("#isremind").removeAttr("checked");
      } else {
        $("#isremind").prop("checked", true);
      }
    }

  });
