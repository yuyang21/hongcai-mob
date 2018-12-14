'use strict';
angular.module('p2pSiteMobApp')
  .factory('WechatShareUtils', function($rootScope, Restangular, SessionService, config) {
    return {

      /**
     * 调用微信接口，申请此页的分享接口调用
     * @param
     * @return
     */
      configJsApi : function(){
        var url = location.href.split('#')[0];
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
      },

      /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    onMenuShareAppMessage : function(title, subTitle, shareLink, imgUrl){
      wx.onMenuShareAppMessage({
        title: title,
        desc: subTitle,
        link: shareLink,
        imgUrl: imgUrl,
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
        title: title,
        link: shareLink,
        imgUrl: imgUrl,
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
    },

    };
  });
