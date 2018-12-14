'use strict';
angular.module('p2pSiteMobApp')
  .factory('Utils', function($rootScope, config, URLService) {
    return {

      /**
       * 是否在微信中
       */
      isWeixin: function(){
          var ua = navigator.userAgent.toLowerCase();
          return ua.match(/MicroMessenger/i)=="micromessenger";
      },

      /**
       * 设置微信等webview中的title
       */
      setTitle: function(title){
        if(!this.isWeixin() || !this.browser().isIos()){
          return;
        }
        // 微信等webview中无法修改title的问题
        //需要jQuery
        var $body = $('body');
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico" style="visibility:hidden"></iframe>');
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
      },


      /**
       * 判断浏览器手机版本
       */
      browser: function(){

        return {

          // Windows Phone's UA also contains "Android"
          isAndroid : function(){
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android/i.test(userAgent) && !/windows phone/i.test(userAgent);
          },

          // iOS detection from: http://stackoverflow.com/a/9039885/177710
          isIos : function(){
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
          },

          isWinPhone: function(){
            return /windows phone/i.test(userAgent);
          }
        }

      },

      /**
       * 获取和后端对应的deviceCode
       */
      deviceCode: function () {

        var deviceCode = 0;

        if(this.browser().isAndroid()){
          deviceCode = 2;
        }

        if(this.isWeixin() && this.browser().isAndroid()){
          deviceCode = 3;
        }

        if(this.browser().isIos()){
          deviceCode = 5;
        }

        if(this.isWeixin() && this.browser().isIos()){
          deviceCode = 6;
        }

        return deviceCode;
      },

      /**
       * 页面body上创建一个form
       */
      createForm: function() {
        var f = document.createElement('form');
        document.body.appendChild(f);
        f.method = 'post';
        // f.target = '_blank';
        return f;
      },

      /**
       * 增加表单提交元素
       */
      createElements: function (eForm, eName, eValue) {
        var e = document.createElement('input');
        eForm.appendChild(e);
        e.type = 'text';
        e.name = eName;
        if (!document.all) {
          e.style.display = 'none';
        } else {
          e.style.display = 'block';
          e.style.width = '0px';
          e.style.height = '0px';
        }
        e.value = eValue;
        return e;
      },

      /**
       * 跳转去微信授权
       */
      redirectToWechatAuth: function(redirect_uri){
        var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid +
                  "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
        window.location.href = wechatRedirectUrl;
      },

      uuid : function(len, radix){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;

          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }

      return uuid.join('');
    }

    };
  });
