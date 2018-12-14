
'use strict';
angular.module('p2pSiteMobApp')
  .factory('ScreenWidthUtil', function() {
    return {
      screenWidth: function() {
        var width = document.body.scrollWidth; //用系统返回宽度除以分辨率
        var widthFlag;
        if (width >= 320 && width < 375) {
          widthFlag = 0;
        } else if (width >= 375 && width < 414) {
          widthFlag = 1;
        } else if (width >= 414) {
          widthFlag = 2;
        }
        return widthFlag;
      }
    }
  })