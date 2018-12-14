/*
* @Author: yuyang
* @Date:   2016-07-28 17:08:11
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-10-09 10:18:26
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('NoviceCtrl', function($scope, Restangular, $rootScope, $stateParams, config, $state, $timeout, $location) {
    //去注册
    $scope.goRegister = function(){
      if($stateParams.inviteCode){
        $state.go('root.register2', {inviteCode: $stateParams.inviteCode});
      }else {
        $state.go('root.register2');
      }
    }
    /**
     * 获取新手标项目
     */
    Restangular.one('projects').one('newbieBiaoProject').get().then(function(response) {
      if(!response || response.ret === -1){
          return;
      }
      $scope.newbieBiaoProject = response;
      // 可出借金额
      $scope.newbieBiaoProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;

    });

    $rootScope.showFooter = false;
    $scope.test = config.test;

    if($rootScope.channelCode){
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid,
        act: $rootScope.act,
        channelCode: $rootScope.channelCode
      });
    }
   

    /**
     * 调用微信接口，申请此页的分享接口调用
     * @param
     * @return
     */
    $scope.configJsApi = function(){
      var url = location.href.split('#')[0];

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
        title: '688元现金奖励+3%加息券！！',
        desc: '现在宏财网注册，即可获得以上奖励！现金奖励，出借即可提现！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Ak5t5pVMCyJsOvnmGG6obPj8qU2yXy8WA78oSwHPNRfIic4uW9X7Rbs652IQzBX65ycTU6JbYXQWWg/0?wx_fmt=jpeg',
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
        title: '688元现金奖励+3%加息券！！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Ak5t5pVMCyJsOvnmGG6obPj8qU2yXy8WA78oSwHPNRfIic4uW9X7Rbs652IQzBX65ycTU6JbYXQWWg/0?wx_fmt=jpeg',
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
