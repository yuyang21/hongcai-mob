'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BindWechatCtrl
 * @description
 * # BindWechatCtrl
 * Controller of the p2pSiteMobApp
 */

angular.module('p2pSiteMobApp')
  .controller('BindWechatCtrl', function($scope, $rootScope, $state, $location, $timeout, checkPwdUtils, Restangular, md5) {
    $rootScope.showFooter = false;
    $rootScope.msg = '';
    
    /**
    * 查询用户绑定信息
    **/
    
    Restangular.one('/activitys/isWechatSubscriptionBindings').get({}).then(function(response){
        if (!response || response.ret === -1) {
            return;
        }
        $scope.isBindWechat = response.bindingFlag;
        if($scope.isBindWechat){
           $state.go('root.bindWechat-status',{status:1}); 
        }
    })

    //监测手机号码
    // $scope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    
    //去注册
    $scope.toRegister = function() {
      if (!$rootScope.timeout) {
        return;
      }
      $state.go('root.register2', {redirectUrl: encodeURIComponent($location.url())});
      return;
    }
    /**
    * 绑定
    **/
    $scope.busy = false;
    $scope.toBind = function(wechatUser) {
        // var passwordMsg = checkPwdUtils.showPwd2(wechatUser.password)
        if(!wechatUser.mobile || !wechatUser.password || $scope.busy) {
            return;
        }
        if(!$rootScope.mobilePattern.test(wechatUser.mobile)) {
           $rootScope.showMsg('手机号码格式不正确');
           return; 
        }
        $scope.busy = true;
        Restangular.one('activitys/').post('wechatSubscriptionBinding',{
            mobile: wechatUser.mobile,
            password: md5.createHash(wechatUser.password)
        }).then(function(response){
            $timeout(function(){
                $scope.busy = false;
            },500)
            if(!response || response.ret === -1){
                if(response.code === -1207){
                    $state.go('root.bindWechat-status',{status:1});
                    return;
                }
                $rootScope.showMsg(response.msg);
                return;
            }
            $state.go('root.bindWechat-status',{status:0});
        })
        
    }

  
    angular.element('#psw').focus(function(){
        angular.element('#toggle-eyes').addClass('red-border');
    }).blur(function(){
        angular.element('#toggle-eyes').removeClass('red-border');
    })
    
});
