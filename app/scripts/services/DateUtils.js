'use strict';
angular.module('p2pSiteMobApp')
  .factory('DateUtils', function() {
    return {


      longTimeToDate: function(longTime) {
        var date1 = new Date(longTime);
        var month = date1.getMonth() < 9 ? '0'+ date1.getMonth() : date1.getMonth();
        var day = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
        return date1.getFullYear() + '-' + (month + 1) + '-' + day;
      },

      /**
       * 在开始时间的基础上，加上多少个月份
       * @param {long} startTimeInLong 开始时间，long型
       * @param {int} addMonth        增加的月份值
       */
      addMonth: function(startTimeInLong, addMonth) {
        var startDate = new Date(startTimeInLong);
        var startYear = startDate.getFullYear();
        var startDay = startDate.getDate();
        var startMonth = startDate.getMonth();

        startDate.setDate(1);s
        if (startMonth + addMonth > 11) {
          startDate.setFullYear(startYear + 1);
          startDate.setMonth(startMonth + addMonth - 12);
        } else {
          startDate.setMonth(startMonth + addMonth);
        }

        var monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        startDay = startDay > monthDays ? monthDays : startDay;

        startDate.setDate(startDay);

        return startDate.getTime();
      },

      intervalMonths: function(time1, time2) {
        var date1 = new Date(time1);
        var date2 = new Date(time2);

        return Math.abs(date1.getFullYear() * 12 + date1.getMonth() - date2.getFullYear() * 12 - date2.getMonth());
      },



      intervalDays: function(timeInMills1, timeInMills2) {
        var t1 = new Date(timeInMills1)
        ,t2 = new Date(timeInMills2)
        ,DAY_TIME_IN_MILLS = 24 * 60 * 60 * 1000
        t1.setHours(0)
        t1.setMinutes(0)
        t1.setSeconds(0)
        t1.setMilliseconds(0)
        t2.setHours(0)
        t2.setMinutes(0)
        t2.setSeconds(0)
        t2.setMilliseconds(0)
        return Math.abs((t1.getTime() - t2.getTime()) / DAY_TIME_IN_MILLS)
      },


      toHourMinSeconds: function(intervalTimeInMills) {
        var date = new Date(intervalTimeInMills - 8 * 60 * 60 * 1000);
        var dateStr = date.toTimeString().substring(0, 8);

        var time = {};
        time.hour = dateStr.substring(0, 2);
        time.min = dateStr.substring(3, 5);
        time.seconds = dateStr.substring(6, 8);

        var hours = Math.floor(intervalTimeInMills / (60 * 60 * 1000));
        if (hours >= 24) {
          time.hour = hours;
        }

        return time;
      },

      toDayHourMinSeconds: function(intervalTimeInMills) {
        var date = new Date(intervalTimeInMills - 8 * 60 * 60 * 1000);
        var dateStr = date.toTimeString().substring(0, 8);

        var time = {};
        time.day = Math.floor(intervalTimeInMills / (24 * 60 * 60 * 1000));
        time.hour = dateStr.substring(0, 2);
        time.min = dateStr.substring(3, 5);
        time.seconds = dateStr.substring(6, 8);

        return time;
      },

      /**
       * 两个long型时间的时间间隔
       */
      intervalDay: function(timeInMills1, timeInMills2){
        var DAY_TIME_IN_MILLS = 24 * 60 * 60 * 1000;

        var time1 = Math.floor(timeInMills1/DAY_TIME_IN_MILLS) * DAY_TIME_IN_MILLS;
        var time2 = Math.floor(timeInMills2/DAY_TIME_IN_MILLS) * DAY_TIME_IN_MILLS;

        return Math.abs((time2 - time1)/DAY_TIME_IN_MILLS);
      }


    };
  });
