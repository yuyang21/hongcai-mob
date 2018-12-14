'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AccountCtrl', function ($scope, $state, $rootScope, Restangular, toCunGuanUtils, SessionService, UserService, config, $window) {
    $rootScope.showLoadingToast = false;
    /**
     * 默认头像
     */
    $scope.userHeadImgUrl = '/images/user-center/avatar.png';

    UserService.loadUserAuth($scope);
    UserService.loadAccount($scope);
    UserService.loadCouponAmount($scope,'increaseRateCoupon');
    UserService.loadCouponAmount($scope,'cashCoupon');
    $scope.user = SessionService.getUser();

   
    /**
     * 推荐项目
     */
    // $scope.recommends = Restangular.one('projects').one('recommends').get({pageSize : 1}).$object;

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      toCunGuanUtils.to('autoTransfer', null, null, null, null, null);
    }

    /*
    *风险测评 结果
    */
    $scope.showQuestionnaire = angular.fromJson(localStorage.getItem('showQuestionnaire'))? angular.fromJson(localStorage.getItem('showQuestionnaire')) : undefined;
    $scope.recentlyQuestionnaire = function() {
      Restangular.one('/users/' + '0' + '/recentlyQuestionnaire' ).get().then(function(response){
       if(response.score1 == -1 && response.score2 == -1){
        $scope.showQuestionnaire = true;
       }else {
        $scope.showQuestionnaire = false;
       }
       localStorage.setItem('showQuestionnaire', $scope.showQuestionnaire);
      })
    }
    $scope.recentlyQuestionnaire();

    $scope.goWithdraw = function() {
      $state.go("root.userCenter.withdraw");
    }


    //查看更多 index:0体验金，1加息券，2邀请
    $scope.goIncreaseRateCoupon = function(index){
      $state.go('root.userCenter.rate-coupon',{
        tab : index
      });
    }

    $scope.unread = function() {
      // 查询是否有未读的提醒
      Restangular.one('/userMsgs/' + '0' + '/unReadMsgs' ).get().then(function(response){
        if (response && response.ret !== -1) {
          $scope.unReadMsgs = response.count;
        }
      })
      // 查询是否有未读的公告
      Restangular.one('/userMsgs/' + '0' + '/unReadNotices' ).get().then(function(response){
        if (response && response.ret !== -1) {
          $scope.unReadNotices = response.count;
        }
      })
     
    }
    $scope.unread();

    $scope.goProjectListAuditLoan = function () {
      location.href= location.origin + '/views/admin/project-listAuditLoan.html'
    }
    $scope.goProjectListFull = function () {
      location.href= location.origin + '/views/admin/project-listFull.html'
    }
    // 获取登录用户的角色类型 判断是否显示审核、放款功能
    $scope.isExamineUser = false;
    $scope.isLoanUser = false;
    Restangular.one('/erp/user/userFigures').get().then(function(response){
      if (response && response.ret !== -1) {
        response.userFigures.indexOf('19') !== -1 ? $scope.isExamineUser = true : $scope.isExamineUser = false;
        response.userFigures.indexOf('20') !== -1 ? $scope.isLoanUser = true : $scope.isLoanUser = false;
      }
    })
    
    $scope.toHelpCenter = function () {
      window.location.href = config.vue_domain + '/user-center/help-center'
    }

    $scope.downloadApp = function () {
      $window.location.href = ' http://a.app.qq.com/o/simple.jsp?pkgname=com.hoolai.hongcai';
    }
  });
