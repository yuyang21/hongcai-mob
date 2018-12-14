/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-30 19:00:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('RewardCtrl', function(ipCookie, $scope, $timeout, $state, $rootScope, $stateParams, $location, Restangular, SessionService, UserService, Utils, InviteShareUtils, WechatShareUtils, $window) {
    $scope.deviceCode = Utils.deviceCode();
    $scope.details = [];
    $scope.page = 1;

    $scope.activityStatus  = 'OFF';
    Restangular.one('activitys/22').one('status').get() .then(function(response){
      if (response && response == 1) {
        $scope.activityStatus  = 'ON';
      } 
    }); 

    if(SessionService.isLogin()){
        
        Restangular.one('activitys').one('invitePrivilegedUsers').get() .then(function(response){
          if (response  && response.ret !== -1) {
            $scope.inviteCount = response;
          }
        });
        Restangular.one('activitys').one('invitePrivilegedRewardStat').get()
        .then(function(response){
        	if (response  && response.ret !== -1) {
        		$scope.privilegedCapital = response;
        	}
        });
        $scope.getInvitePrivilegedRewards = function(page) {
          Restangular.one('activitys').one('invitePrivilegedRewards').get({
            page: page,
            pageSize: 10
          }).then(function(response){
            if (response  && response.ret !== -1) {
              var details = response.data;
              $scope.totalPage = response.totalPage;
              for(var i = 0; i< details.length; i++) {
                $scope.details.push(details[i]);
              }
            }
          });
        }
        $scope.getInvitePrivilegedRewards($scope.page);
        
      }
      /**
      *  奖励列表
      **/
        
        $scope.loadMore = function() {
          $scope.page = $scope.page + 1;
          $scope.getInvitePrivilegedRewards($scope.page);
        }
        
      $scope.intervalDays = function(firstInvestTime){
      	var currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        var firstInvestDate = new Date(firstInvestTime);
        firstInvestDate.setHours(0);
        firstInvestDate.setMinutes(0);
        firstInvestDate.setSeconds(0);
        firstInvestDate.setMilliseconds(0);

        var oneDay = 24 * 60 * 60 * 1000;
      	var intervalDays = 60 - parseInt((currentDate.getTime() - firstInvestDate.getTime())/oneDay);

      	return intervalDays > 0 ? intervalDays : 0;
      }
      
      //下载app
      $scope.downloadApp = function() {
        $window.location.href = ' http://a.app.qq.com/o/simple.jsp?pkgname=com.hoolai.hongcai';
     }

      if(SessionService.isLogin() && Utils.isWeixin()){

        //邀请码
        $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;
        WechatShareUtils.configJsApi();
        
        wx.error(function(res){
          $timeout(function() {
            window.location.href=config.domain + '/activity/invite?' + Math.round(Math.random()* 1000);
          }, 100);
        });

        wx.ready(function(){
          $scope.shareItem = InviteShareUtils.share($scope.voucher.inviteCode);
          $scope.linkUrl = location.href.split('#')[0];
          WechatShareUtils.onMenuShareAppMessage($scope.shareItem.title, $scope.shareItem.subTitle, $scope.linkUrl, $scope.shareItem.imageUrl);
        });
      }

  })
  