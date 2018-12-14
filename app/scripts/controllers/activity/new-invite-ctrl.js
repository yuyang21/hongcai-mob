/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-30 19:00:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('newInviteCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config) {


    //立即邀请
    $scope.toInvite = function(){
      if(!$rootScope.isLogged) {
        $state.go('root.login');
      }
      $rootScope.toCopyLink();
    }
    /**
     * 调用微信接口，申请此页的分享接口调用
     * @param
     * @return
     */
    $scope.configJsApi = function(){
      var url = location.href.split('#')[0];
      console.log(url);
      Restangular.one("wechat").one("jsApiConfig").get({
        requestUrl : url
      }).then(function(apiConfig){
        console.log('apiConfig: ' + config.wechatAppid);
        wx.config({
            debug: false,
            appId: apiConfig.appId, // 必填，公众号的唯一标识
            timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
            signature: apiConfig.signature,// 必填，签名，见附录1
            jsApiList:
                [
                'onMenuShareAppMessage',
                'hideMenuItems',
                'onMenuShareTimeline'
                ]
        });
      });
    };
    /**
     * 邀请码
     */
    $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(){
      var shareLink = config.domain + '/activity/novice-activity' ;
      if ($rootScope.channelCode){
        shareLink = shareLink + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }
      if($scope.voucher.inviteCode){
        shareLink = shareLink + (shareLink.indexOf('?') === -1 ? '?' : '&') + 'inviteCode='  + $scope.voucher.inviteCode;
      }

      wx.onMenuShareAppMessage({
        title: '邀请好友，双重奖励等你哟!!',
        desc: '邀请好友,出借利息的30%全部属于你！上不封顶的奖金券也属于你！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8AlesZAUd6woODtlJbnNpuQHbBib1VSOomErWq3iblnczkbqoFwEgrYVFoFn3LI81SiaUDkkwPtmaVMkA/0?wx_fmt=jpeg',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();
          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid,
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });

      wx.onMenuShareTimeline({
        title: '邀请好友，双重奖励等你哟!!',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8AlesZAUd6woODtlJbnNpuQHbBib1VSOomErWq3iblnczkbqoFwEgrYVFoFn3LI81SiaUDkkwPtmaVMkA/0?wx_fmt=jpeg',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();
          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid,
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }

    wx.error(function(res){
        $timeout(function() {
          window.location.href=config.domain + '/activity/invite-activity?' + Math.round(Math.random()* 1000);
        }, 100);
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    $scope.configJsApi();

  })