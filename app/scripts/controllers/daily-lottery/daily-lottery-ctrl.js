'use strict';

angular.module('p2pSiteMobApp')
  .controller('DailyLotteryCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, $location, Restangular, config, DialogService) {
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;

    

    $scope.getUserCheckinRecords = function(){
      Restangular.one('dailyPrizes').get().then(function(response){
        $scope.thisWeekCheckinRecords = response;
      });
    }

    if ($scope.channelCode){
      Restangular.one('users').post('channel', {
        openId: '',
        act: $scope.act,
        channelCode: $scope.channelCode
      });
    }
    $scope.getUserCheckinRecords();
    $scope.showMask = false;
    $scope.showFirstDrawLottery = false;
    $scope.showSharedDrawLottery = false;
    $scope.showTakePrize = false;
    $scope.show2Gagain = false;
    $scope.showGameOver = false;
    $scope.showShareWordsFlag = false;
    $scope.showShareSuccess = false;
    $scope.showOff = function(){
      $scope.showMask = false;
      $scope.showFirstDrawLottery = false;
      $scope.showSharedDrawLottery = false;
      $scope.showTakePrize = false;
      $scope.show2Gagain = false;
      $scope.showGameOver = false;
      $scope.showShareWordsFlag = false;
      $scope.showShareSuccess = false;
    }

    $scope.userLotteryRecord = null;
    $scope.drawPrizeAndCheckin = function(){
      if(!$rootScope.isLogged){
        $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
        return;
      }

      Restangular.one('dailyPrizes').one('userUnTakeLotteryRecord').get().then(function(response){
        $scope.userLotteryRecord = response;
        if($scope.userLotteryRecord == null){
          Restangular.one('dailyPrizes').post('checkinAndDrawLottery', {
          }).then(function(response){
            if(response.ret === -1){
              
              if (response.code == -1238){
                $scope.showOff();
                $scope.showMask = true;
                $scope.showGameOver = true;
              }else if(response.code == -1239){
                alert(response.msg);
              }else if(response.code == -1240){
                alert(response.msg);
              }else if(response.code == -1241){
                alert(response.msg);
              }
            }else{
              $scope.userLotteryRecord = response;
              $scope.prizeType = response.prize.type;
              $scope.giveUpFlag = response.giveUpFlag;
              $scope.RunRotate($scope.prizeType, $scope.giveUpFlag);
              $scope.getUserCheckinRecords();
            }
          });
        }else{
          $scope.prizeType = response.prize.type;
          $scope.giveUpFlag = response.giveUpFlag;
          $scope.RunRotate($scope.prizeType, $scope.giveUpFlag);
        }
      });
    }

    $scope.testLiulianginn = function(prizeType){
      $scope.showMask = true; 
       if(prizeType === 1){
          $scope.showMoneyEx = true;
       }else if(prizeType === 2){
          $scope.showCashEx = true;
       }else if(prizeType === 3){
          $scope.showDataTraffic = true;
       }
    }

    $scope.showShareWords = function(){
      Restangular.one('users').post('shareActivity', {
        openId: '', 
        act: 12,
        channelCode: 'officeweb'
      }).then(function(response){
        if(response.ret !== -1){
          $scope.giveUp();
        }
      });
    }

    $scope.giveUp = function(){
      if($scope.userLotteryRecord != null){
        Restangular.one('dailyPrizes').post('giveUpPrize', {
          userLotteryRecordId: $scope.userLotteryRecord.id
        }).then(function(response){
          if(response.ret === -1){
            alert(response.msg);
          }else{
            $scope.userLotteryRecord = response;
            $scope.showOff();
            $scope.showMask = true;
            $scope.showShareSuccess = true;
          }
        });
      }
    }

    $scope.takePrize = function(){
      if($scope.userLotteryRecord != null){
        Restangular.one('dailyPrizes').post('takePrize', {
          userLotteryRecordId: $scope.userLotteryRecord.id
        }).then(function(response){
          if(response.ret === -1){
            if(response.code === -1238){
              $scope.showMask = true;
              $scope.showGameOver = true;
            }else{
              alert(response.msg);
            }
          }else{
            $scope.userLotteryRecord = response;
            $scope.prizeType = response.prize.type;
            $scope.giveUpFlag = response.giveUpFlag;
            $scope.sendTrafficFlag = response.sendTrafficFlag;

            $scope.showOff();
            if(!$scope.sendTrafficFlag){
              $scope.showMask = true;
              $scope.show2Gagain = true;
            }else{
              $scope.showMask = true;
              $scope.showTakePrize = true;
            }
          }
        });
      }
    }

    //prizeType 1.金幣 2.现金 3.流量
    $scope.RunRotate = function(prizeType, giveUpFlag){
      var text = "金币";
      var angles = 155;
      switch (prizeType) {
        case 1:
          var angle = [155, 335];
          angles = angle[Math.floor(Math.random()*angle.length)];
          text = "金币";
          break;
        case 2:
          var angle = [70, 245];
          angles = angle[Math.floor(Math.random()*angle.length)];
          text = "现金";
          break;
        case 3:
          angles = 290;
          text = "手机流量";
      }

      $scope.rotateFn(prizeType, angles, text, giveUpFlag);
    }

    $scope.rotateFn = function (prizeType, angles, text, giveUpFlag){
      $('.rec-disk').stopRotate();
      $('.rec-disk').rotate({
        angle: 0,
        animateTo: angles + 1800,
        duration: 8000,
        callback:function(){
          //抽中金币
           $scope.showMask = true; 
           if(giveUpFlag){
              $scope.showSharedDrawLottery = true;
           }else{
              $scope.showFirstDrawLottery = true;
           }
           $scope.$apply();
        }
      })
    };

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
        console.log('apiConfig: ' + apiConfig);
        wx.config({
            debug: false,
            appId: config.wechatAppid, // 必填，公众号的唯一标识
            timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
            signature: apiConfig.signature,// 必填，签名，见附录1
            jsApiList:
                [
                'onMenuShareAppMessage',
                'hideMenuItems'
                ]
        });
      });
    };

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(){
      var shareLink = config.domain;
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '',
        desc: '',
        link: shareLink,
        imgUrl: '',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();

          Restangular.one('users').post('shareActivity', {
            openId: '',
            act: $scope.act,
            channelCode: $scope.channelCode
          }).then(function(response){
            if(response.ret !== -1){
              $scope.giveUp();
            }
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }

    $scope.configJsApi();


    wx.error(function(res){
        // window.location.reload();
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        $scope.configJsApi();
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    /**
     * 跳转到二维码位置
     */
    $scope.goToAttention = function(){
      $scope.showQRcode = true;
    }

    $scope.formatDate = function(date){
      var dateOfMonth = new Date(date).getMonth() + 1;
      var dateOfHour = new Date(date).getDate() > 9 ? new Date(date).getDate() : '0' + new Date(date).getDate();
      var dateStr = dateOfMonth + '.' + dateOfHour;

      return dateStr;
    }
});
