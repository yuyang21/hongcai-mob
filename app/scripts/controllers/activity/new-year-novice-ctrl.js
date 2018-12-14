/*
* @Author: yuyang
* @Date:   2016-07-28 17:08:11
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-10-09 10:18:26
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('NewYearNoviceCtrl', function($scope, Restangular, $rootScope, $stateParams, config, $state, $timeout, $location) {
    $rootScope.showFooter = false;
    $scope.test = config.test;

    if($rootScope.channelCode){
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid,
        act: $rootScope.act,
        channelCode: $rootScope.channelCode
      });
    }
    // 点击立即领取
   
    $scope.toReceive = function() {
      if(!$rootScope.isLogged) {
        $state.go('root.register');
      }else {
        $state.go('root.project-list');
      }
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
        // console.log('apiConfig: ' + apiConfig);
        wx.config({
            debug: false,
            appId: config.wechatAppid, // 必填，公众号的唯一标识
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
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(){
      var shareLink = config.domain + '/activity/novice-activity';
      if ($rootScope.channelCode){
        shareLink = shareLink + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }

      wx.onMenuShareAppMessage({
        title: '8888体验金 + 300元现金！',
        desc: '宏运当头，8888体验金注册即送！财源滚滚，300元现金出借立领！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8AlesZAUd6woODtlJbnNpuQHYibUasRbts0teKicv4JpcggcOVxvMvI32ASyw42VoPv04aZvYQdgicmKw/0?wx_fmt=jpeg',
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
        title: '8888体验金 + 300元现金！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8AlesZAUd6woODtlJbnNpuQHYibUasRbts0teKicv4JpcggcOVxvMvI32ASyw42VoPv04aZvYQdgicmKw/0?wx_fmt=jpeg',
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
          window.location.href=config.domain + '/activity/novice-activity?' + Math.round(Math.random()* 1000);
        }, 100);
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    $scope.configJsApi();
  });
