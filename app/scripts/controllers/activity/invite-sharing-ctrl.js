/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 16:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteSharingCtrl', function($scope, $timeout, $rootScope, $stateParams, ipCookie, Utils, Restangular, CheckMobUtil, CheckPicUtil, SessionService, WEB_DEFAULT_DOMAIN, InviteShareUtils, WechatShareUtils) {
  	
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
    $scope.isActivityEnd = false;
    $scope.isSuccess ? $('#activity').addClass('position-fix')  : $('#activity').removeClass('position-fix'); 
    $scope.isSuccess ? $('.exchange-flowers').addClass('position-fix')  : $('.exchange-flowers').removeClass('position-fix'); 
    $scope.successMask = function() {
    	$scope.isSuccess = !$scope.isSuccess;
    	$scope.isSuccess ? $('#activity').addClass('position-fix')  : $('#activity').removeClass('position-fix'); 
      $scope.isSuccess ? $('.exchange-flowers').addClass('position-fix')  : $('.exchange-flowers').removeClass('position-fix'); 
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
          $timeout(function(){
            $rootScope.showLoadingToast = false;
            // 检测活动是否已结束
            Restangular.one('users').one('0/isInvitedFriends').get({}).then(function(response){
              if(response && response.ret !== -1) {
                $scope.isInvitedFriends = response.flag;
                SessionService.loginSuccess(response);
                $scope.successMask();
              }else if(response.code && response.code === -1041){        
                $scope.isActivityEnd = true; // 活动已结束
                return;
              }
            })
          },100);

        }
      })
    }

    // 监测手机号码
    $scope.$watch('user.mobile', function(newVal) {
      CheckMobUtil.checkMob(newVal);
    })

     // 监测图形验证码
    $scope.$watch('user.picCaptcha', function(newVal) {
      //校验图形验证码只能输入数字
      var captchaPattern = /^\d{1,4}$/
      if (newVal && !captchaPattern.test(newVal)) {
        $scope.user.picCaptcha = newVal.replace(/\D/g, '').toString().slice(0, 4)
      }
      // $scope.piccha = false;
      // var msg = CheckPicUtil.checkePic(newVal);
      // alert(msg)
      // if(msg){
      //   $scope.piccha = true;
      // }
    })

    // 用户获取短信验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user){
        return;
      }
    };

    // 邀请好友列表
    Restangular.one('activitys').one('invitePrivilegedFriends').get({
      inviteCode : $stateParams.inviteCode
    }).then(function(response){
      if(response && response.ret !== -1) {
        $scope.inviteList = response;
        for(var i=0;i<$scope.inviteList.length;i++){
           $scope.inviteList[i].encourage = encourageMixed();
        }
      }else if(response.code = -1041){        
        $scope.isActivityEnd = true; // 活动已结束
        return;
      }
    })

    // 激励语随机显示
    var arr = ['从此跟着土豪迈向人生巅峰！','哇~好大的礼包呀，发财啦哈哈哈~~','上宏财，财运来！欧了！','谢谢老板，大礼包收到啦！','自从领了礼包，腰不酸了腿也不疼了~','礼包收到，确实是真爱！','发礼包这事儿，我就服你。。。','天哪~真的有10%加息券耶！'];
    function encourageMixed() {
      return arr[Math.floor(Math.random()*arr.length)];
    }

    if(Utils.isWeixin()){
      //邀请码
      wx.error(function(res){
        $timeout(function() {
          window.location.href=config.domain + '/activity/invite?' + Math.round(Math.random()* 1000);
        }, 100);
      });

      wx.ready(function(){
        $scope.shareItem = InviteShareUtils.share($stateParams.inviteCode);
        $scope.linkUrl = location.href.split('#')[0];
        WechatShareUtils.onMenuShareAppMessage($scope.shareItem.title, $scope.shareItem.subTitle, $scope.linkUrl, $scope.shareItem.imageUrl);
      });

      WechatShareUtils.configJsApi();
    }

  })