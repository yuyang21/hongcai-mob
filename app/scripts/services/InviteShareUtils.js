'use strict';
angular.module('p2pSiteMobApp')
  .factory('InviteShareUtils', function($rootScope, SessionService, config) {
    return {

      share : function(inviteCode){
        var title = this.shareTitle();
        var subTitle = this.shareSubtitle();
        var linkUrl = this.shareLink(inviteCode);
        var imageUrl = this.shareImageUrl();

        var shareItem = {
          title : title,
          subTitle : subTitle,
          linkUrl : linkUrl,
          imageUrl : imageUrl
        };

        return shareItem;
      },

      //标题
      shareTitle : function(){
        var titleArray = [];
        
        titleArray.push('加入“宏财合伙人计划” ，一起发宏财！')
        titleArray.push('朋友！收下这份大礼，你就是我的人了！')
        titleArray.push('这四海八荒的财运，我都攒到一起送给你啦！')
        titleArray.push('一个好汉三个帮，投资就上宏财网！')

        return titleArray[Math.floor(Math.random() * titleArray.length)];
      },

      //副标题
      shareSubtitle : function(){
        var subTitle = '新手立享966元现金红包！';

        return subTitle;
      },

      //分享链接
      shareLink : function(inviteCode){
        var shareLink = config.domain + '/activity/invite-sharing';
        
        if(inviteCode) {
            console.log(inviteCode);
            shareLink = shareLink + '/'  + inviteCode;
        }

        shareLink = shareLink + '?act=22&f=officeweb';

        return shareLink;
      },

      //图片链接
      shareImageUrl : function(){
        var imageUrl = 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8Akr3KNzVxtZ95xUPndUzXu3CvoSK2iap7RdeDEU69hTG8tSSL0no6uV9T75FqVsJXj54hVicu40KMicw/0?wx_fmt=jpeg';
        return imageUrl;
      }

    };
  });
