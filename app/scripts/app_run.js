/*
* @Author: yuyang
* @Date:   2016-09-02 11:12:13
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-29 11:42:38
*/

'use strict';
angular.module('p2pSiteMobApp')
  .run(function($templateCache, $rootScope, DEFAULT_DOMAIN, $q, $timeout, $state, $location, $http, $uibModal, ipCookie, config, Restangular, URLService, Utils, SessionService) {
    // if ('addEventListener' in document) {
    // document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
    // }, false);
    // }

    Restangular.setBaseUrl(DEFAULT_DOMAIN);
    Restangular.setDefaultHeaders({
      'Content-Type': 'application/json'
    })

    var routespermission = [
      'root.activity.exchange-cdkey'
    ];

    var titleMap = {
      'issue': '常见问题',
      'about': '帮助中心',
      'safe': '安全保障',
      'account': '账户总览'
    };
    $rootScope.mobilePattern = /^1[0-9]{10}$/;
    /**
     * 跳转到登陆页
     */
    $rootScope.toLogin = function() {
      if (!$rootScope.timeout) {
        return;
      }
      $state.go('root.login', {
        redirectUrl: $location.path()
      });
      return;
    }
    //跳转到充值页面
    $rootScope.toRecharge = function(){
      if($rootScope.timeout){
        $state.go('root.userCenter.recharge');
      }
    }

    $rootScope.toRealNameAuth = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/realname-auth.html',
        controller: 'RealNameAuthCtrl'
          // size: size,
          // resolve: {
          //   items: function () {
          //     return $scope.items;
          //   }
          // }
      });
      $('#body-box').addClass('body-box');
    }
    /**
     * 未支付订单
     */
    $rootScope.tofinishedOrder = function() {
      Restangular.one('orders').one('unpay').get().then(function(order) {
        if (!order || order.ret === -1) {
          return false;
        }

        $rootScope.unfinishOrderModal =
          $uibModal.open({
            templateUrl: 'views/project/unfinished-order.html',
            controller: 'UnfinishedOrderCtrl',
            resolve: {
              order: order
            }
          });
        return true;
      });
    }
    /**
     * 复制邀请链接弹窗
     */
    $rootScope.toCopyLink = function() {
      if(!$rootScope.isLogged) {
        $rootScope.toLogin();
        return;
      }
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/copy-link.html',
        controller: 'CopyLinkCtrl'
      });
    }

    /**
     * 停服弹窗
     */
    $rootScope.stopService = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/stop-service.html',
        controller: 'ActivateCtrl'
      });
    }
    // $rootScope.stopService();

    /**
     * 激活银行资金存管系统
     */
    $rootScope.payCompany = config.pay_company;
    $rootScope.toActivate = function(stateTo) {
      if ($rootScope.payCompany === 'yeepay'|| !$rootScope.isLogged) {
        return;
      }
      var userAuth = SessionService.getUserAuth();
      var checkUserAuthStatus = function(userAuth, stateTo) {
        if(userAuth.ret !== -1 && userAuth.authStatus === 2 && !userAuth.active){
          $uibModal.open({
            animation: true,
            templateUrl: 'views/user-center/activate-bank.html',
            controller: 'ActivateCtrl'
          });
        }else {
          if(stateTo) {
            stateTo();
          }
        }
      }
      if(userAuth){
        checkUserAuthStatus(userAuth, stateTo);
        return;
      }

      Restangular.one('users').one('0/userAuth').get().then(function(userAuth){
        checkUserAuthStatus(userAuth, stateTo);
      });
    } 

    /**
     * 获取服务器状态 //status :1 停服
     */
    $rootScope.migrateStatus = function(stateTo) { 
      $rootScope.serviceStatus == 1 ? $rootScope.stopService() : $rootScope.toActivate(stateTo);
    }

    /**
     * 错误提示
     */
    $rootScope.showErrorMsg = false;
    $rootScope.showMsg = function(msg) {
      $rootScope.msg = '';
      if (msg) {
        $rootScope.msg = msg;
        $rootScope.showErrorMsg = true;
        $timeout(function() {
          $rootScope.showErrorMsg = false;
        }, 2000);
      }
      if(msg == undefined) {
        $rootScope.showErrorMsg = false;
      }
    }
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      Restangular.one('systems').one('migrateStatus').get().then(function(response){
        if (response) { //status :1 停服
          $rootScope.serviceStatus = response.status;
        }
      })
      var title = '宏财网';
      var path = $location.path().split('/')[1];
      if (toState.data && toState.data.title) {
        title = toState.data.title; 
      }
      $rootScope.headerTitle = title;
      
      $rootScope.timeout = false;
      $timeout(function() {
        $rootScope.timeout = true;
      }, 400);

      $rootScope.loading = true;
      $timeout(function() {
        $rootScope.loading = false;
      }, 350);


      if(!SessionService.hasCheckLogin() && !SessionService.isLogin()){
        var deferred = $q.defer();
        Restangular.one('users/checkSession').get().then(function(response) {
          SessionService.checkLogin();
          if(response && response.ret !== -1){
            SessionService.loginSuccess(response);
            $rootScope.isLogged = response.mobile || response.email;
          } else if(Utils.isWeixin() && !$location.search().code){
            if(toState.name !== 'root.activity.channel'){
              // Utils.redirectToWechatAuth(location.href);
              location.origin !== 'https://m.hongcai.com' ? Utils.redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname) : Utils.redirectToWechatAuth(location.href)
            }
          } 
        }); 
        return;
      }

      if(toState.name.indexOf('root.userCenter') !== -1) {
        $rootScope.migrateStatus();
      }


      // $rootScope.showTitle = titleMap[path];
      $rootScope.showMe = false;
      if(SessionService.isLogin()){
        var user = SessionService.getUser();
        $rootScope.isLogged = user.mobile || user.email;
        if (!$rootScope.isLogged && (toState.name.indexOf('root.userCenter') !== -1 || routespermission.indexOf(toState.name) !== -1 ) ) {
          $location.url('/login?redirectUrl=' + encodeURIComponent($location.url()));
          return;
        }
        
      } else { //用户未登录，。
          $rootScope.isLogged = false;
          if(!ipCookie('guestId')){
            ipCookie('guestId', Utils.uuid(32,16), {
              expires: 1,
              path: '/'
            });
          }

          if (!Utils.isWeixin()) {
            if (toState.name.indexOf('root.userCenter') !== -1) {
              $location.url('/login?redirectUrl' + encodeURIComponent($location.url()));
            }
            return;
          } else if(!$location.search().code){
            // Utils.redirectToWechatAuth(location.href);
            location.origin !== 'https://m.hongcai.com' ? Utils.redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname) : Utils.redirectToWechatAuth(location.href)
            return;
          }

          var wechat_code = $location.search().code;

          // 用户未登录但已经有code，去登录
          Restangular.one('users/' + wechat_code + '/openid').get().then(function(response) {
            if (response.ret == -1) { //微信授权登录失败
              // Utils.redirectToWechatAuth(location.href);
              location.origin !== 'https://m.hongcai.com' ? Utils.redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname) : Utils.redirectToWechatAuth(location.href)
              return;
            }
            SessionService.loginSuccess(response);
            $rootScope.isLogged = response.mobile || response.email;

            if (!$rootScope.isLogged && (toState.name.indexOf('root.userCenter') !== -1 || routespermission.indexOf(toState.name) !== -1 )) {
              $state.go('root.login', {
                redirectUrl: encodeURIComponent($location.url())
              });
            } else if (response.ret == -1) { // 未拿到openid再次请求授权
              // Utils.redirectToWechatAuth(location.href);
              location.origin !== 'https://m.hongcai.com' ? Utils.redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname) : Utils.redirectToWechatAuth(location.href)
            } 
          });

        }
    });


    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      clearInterval($rootScope.timer);  //清空首页公告的定时器
      var title = '宏财网';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }else if($location.url() === '/guaranteepro-list?tab=2'){
        title = '债权转让';       
      } else if ($location.url() === '/guaranteepro-list?tab=0' || $location.url() === '/guaranteepro-list') {
        title = '宏财精选'; 
      } else if ($location.url() === '/guaranteepro-list?tab=1') {
        title = '宏财尊贵'; 
      }
      
      $rootScope.headerTitle = title;
      if (toState.name !== 'root.project' || toState.name !== 'root.assignments-detail') {
        Utils.setTitle($rootScope.headerTitle);
      }

      var path = $location.path().split('/')[1];
      $rootScope.showPath = path;
      $rootScope.showTitle = titleMap[path];

      $rootScope.channelCode = $location.search().f;
      $rootScope.act = $location.search().act;
      $rootScope.channelParamsObj = {};
      
      if($location.search().appFlag === 'app'){
        $rootScope.showBack = true;
        ipCookie('appFlag', 'app', {expires: 60, path: '/'});
      } else if(ipCookie('appFlag') === 'app'){
        $rootScope.showBack = true;
      }

      for (var obj in $location.search()) {
        if (obj !== 'act' && obj !== 'f') {
          $rootScope.channelParamsObj[obj] = $location.search()[obj];
        }
      }

      $rootScope.channelParams = '';
      if (!jQuery.isEmptyObject($rootScope.channelParamsObj)) {
        $rootScope.channelParams = angular.toJson($rootScope.channelParamsObj);
      }

      if ($rootScope.channelParams) {
        ipCookie('channelParams', $rootScope.channelParams, {
          expires: 1,
          path: '/'
        });
      }

      if ($rootScope.channelCode) {
        ipCookie('utm_from', $rootScope.channelCode, {
          expires: 1,
          path: '/'
        });
      }

      if ($rootScope.act) {
        ipCookie('act', $rootScope.act, {
          expires: 1,
          path: '/'
        });
      }

      // 不需要显示footer的path
      var notShowFooterRoute = [
        'share-home',
        'share-detail',
        'assignments',
        'experience-landing',
        'experience-activity',
        'rate-activity',
        'exchange-code',
        'share-scene-example',
        'activity-scene',
        'invite',
        'reward',
        'invite-sharing',
        'share-scene',
        'share-spring',
        'rate-coupon',
        'project',
        'project-info',
        'project-detail',
        'activity',
        'privacy-policy',
        'assignments',
        'assignment_qr',
        'credits-overview',
        'daily-lottery',
        'bindWechat-status',
        'bind-wechat',
        'lottery',
        'sign-bank-deposits',
        'bank-custody-landing',
        'bank-custody-process',
        'new-user-process',
        'old-user-process',
        'bank-custody'
      ];
      if (notShowFooterRoute.indexOf(path) === -1) {
        $rootScope.showFooter = true;
      } else {
        $rootScope.showFooter = false;
      }

      var mainPath = [
        'recommend',
        'safe',
        'about'
      ];
      var projectPath = [
        'project',
        'project-info',
        'issue',
        'novice-guide',
        'guaranteepro-list',
        'investment-status'
      ];

      var loginOrMy = [
        'login',
        'register',
        'user-center',
        'yeepay-callback',
        'modify-pwd'
      ];

      $rootScope.whichFooter = 1;
      if (mainPath.indexOf(path) !== -1) {
        $rootScope.whichFooter = 1;
      } else if (projectPath.indexOf(path) !== -1) {
        $rootScope.whichFooter = 2;
      } else if (loginOrMy.indexOf(path) !== -1) {
        $rootScope.whichFooter = 3;
      }

    });

    /*加载中loading*/
    $rootScope.showLoadingToast = false;
    $rootScope.showSuccessToast = false;
    $rootScope.successMsg = '';

    $rootScope.showLoadingToastFunc= function(msg, duration){
      $rootScope.showLoadingToast = true;
      $timeout(function() {
        $rootScope.showLoadingToast = false;
      }, duration);
    }

    $rootScope.showSuccessMsg = function(msg, duration){
      $rootScope.successMsg = msg;
      $rootScope.showSuccessToast = true;
      $timeout(function() {
        $rootScope.showSuccessToast = false;
        $rootScope.successMsg = undefined;
      }, duration);
    }


  });
