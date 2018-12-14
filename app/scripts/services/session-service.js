'use strict';
/**
 * session相关服务
 */
angular.module('p2pSiteMobApp')
  .factory('SessionService', function($rootScope, $http, $location, $q, Utils, Restangular) {
    return {
      set: function(key, value) {
        return sessionStorage.setItem(key, value);
      },
      get: function(key) {
        return sessionStorage.getItem(key);
      },

      /**
       * 退出登录，清除session
       */
      destory: function() {
        Restangular.one('users/0/').post('logout', {
          device: Utils.deviceCode(),
          isWeixin: Utils.isWeixin()
        }).then(function(response) {
        });
        sessionStorage.setItem('isLogin', 'false');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userAuth');

        $rootScope.isLogged = false;
        return true;
      },

      removeUserAuth: function(){
        sessionStorage.removeItem('userAuth');
      },

      /**
       * 获取session中用户信息
       */
      getUser: function(){
      	this.checkSession();
        return sessionStorage.getItem('user') ?  angular.fromJson(sessionStorage.getItem('user')) : undefined;
      },

      /**
       * 是否登录
       */
      isLogin: function(){
      	this.checkSession();
        return sessionStorage.getItem('isLogin') === 'true';
      },

      // 未和服务器校验过是否登录
      hasCheckLogin: function(){
        return sessionStorage.getItem('hasCheck') != null && sessionStorage.getItem('isLogin') != undefined;
      },

      /**
       * 登录成功，将user相关信息放入session storage中
       */
      loginSuccess: function(user){
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
        this.removeUserAuth();
        return sessionStorage.setItem('user', angular.toJson(user));
      },

      checkLogin: function(){
        sessionStorage.setItem('hasCheck', '1');
      },

      /**
       * 如果用户已实名认证，则缓存
       */
      setUserAuthIfAuthed: function(userAuth){
        if(userAuth && userAuth.authStatus == 2 && userAuth.status == 2){
          sessionStorage.setItem('userAuth', angular.toJson(userAuth));
        }
      },

      getUserAuth: function(){
      	this.checkSession();
        return sessionStorage.getItem('userAuth') ?  angular.fromJson(sessionStorage.getItem('userAuth')) : undefined;
      },

      checkSession: function(){
      	var lastCheckTime = sessionStorage.getItem('lastCheckTime') ? sessionStorage.getItem('lastCheckTime') : 0;
      	if(new Date().getTime() - Number(lastCheckTime) > 20 * 60 * 1000){
      		sessionStorage.setItem('isLogin', 'false');
      		sessionStorage.removeItem('user');
      		sessionStorage.removeItem('userAuth');
      	} else {
      		sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
      	}

        if(!sessionStorage.getItem('isLogin')){
          sessionStorage.setItem('isLogin', 'false');
        }

      }

    };
  });