'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AutoTenderCtrl', function ($rootScope, $scope, $state, $timeout, Restangular, DateUtils, ipCookie, UserService) {

  UserService.loadAccount($scope);
  
  var currentDate = new Date(new Date().toLocaleDateString()).getTime();
  $scope.showStatus = false;
  $scope.showDateLimit = false;
  $scope.showAnnual = false;
  $scope.showType = false;
  $scope.annualList = {
    "7": '7%',
    '8': '8%',
    '9': '9%',
    '10': '10%',
    '11': '11%',
    '12': '12%',
  };
  $scope.dateList = {
    '30': '30天',
    '60': '60天',
    '90': '90天',
    '120': '120天',
    '180': '180天',
    '360': '360天',
  };
  $scope.typeList = {
    '5':'宏财精选',
    '6':'宏财尊贵',
    '2':'债权转让',
    '0':'全部'
  };

  $scope.clickHideOtherOption = function(){
    $scope.showDateLimit = !$scope.showDateLimit;
    $scope.showAnnual = false;
    $scope.showType = false;
  };
  $scope.clickHideOtherOption1 = function(){
    $scope.showAnnual = !$scope.showAnnual;
    $scope.showDateLimit = false;
    $scope.showType = false;
  };
  $scope.clickHideOtherOption2 = function(){
    $scope.showType = !$scope.showType;
    $scope.showAnnual = false;
    $scope.showDateLimit = false;
  };
  
  $scope.selectDate = function(date) {
    $scope.autoTenders.maxRemainDay = date;
    
  }
 
  $scope.selectAnnual = function(annual) {
    $scope.autoTenders.annualEarnings = annual;
  }

  $scope.selectType = function(type) {
    $scope.autoTenders.investType = type;
  
  }
  //整数 、保留两位小数
  var pattern1 = /^\+?[1-9][0-9]*$/;
  var pattern2 = /^[0-9]*(\.[0-9]{1,2})?$/;
  var checkMinAmount = function(val) {
    if(val == undefined || val == undefined) {
      $scope.amountErrMsg = '请输入最小投标金额';
    }else if(val > 1000000){
      $scope.amountErrMsg = '最小投标金额必须小于1000000';
    }else if(val < 100 || val % 100 !==0 || !(pattern1.test(val))){
      $scope.amountErrMsg = '请输入100的正整数倍';
    }
  };
  var checkRemainAmount = function(val) {
    if(val == undefined || val == undefined) {
      $scope.remainErrMsg = '请输入账户保留金额';
    }else if(val > 1000000){
      $scope.remainErrMsg = '账户保留金额必须小于1000000';
    }else if(val < 0 || !(pattern2.test(val))){
      $scope.remainErrMsg = '最多保留两位小数';
    }
  }
  var checkStartTime = function(time) {
    if(time < currentDate) {
      $scope.satartTimeErrMsg = '开始日期不能为过去的时间';
      return false;
    }
    if(time > $scope.autoTenders.endDate.getTime()) {
      $scope.satartTimeErrMsg = '开始日期不能晚于结束日期';
      return false;
    }

    return true;
  }
  var checkEndTime = function(time) {
    if(time < currentDate) {
      $scope.endTimeErrMsg = '截止日期不能为过去的时间';
      return;
    }
    if(time < $scope.autoTenders.startDate.getTime()) {
      $scope.endTimeErrMsg = '开始日期不能晚于结束日期';
      return;
    }
  }

  //校验最小投标金额
  $scope.$watch('autoTenders.minInvestAmount', function(newVal, oldVal) {
    $scope.amountErrMsg = null;
    if(newVal !== oldVal){
      $scope.amountErrMsg = null;
    }
    if(newVal){
      checkMinAmount(newVal);
      $scope.endTimeNewVal = newVal;
    }
  });
  //校验账户保留金额
 $scope.$watch('autoTenders.remainAmount', function(newVal, oldVal) {
  $scope.remainErrMsg = null;
   if(newVal !== oldVal){
     $scope.remainErrMsg = null;
   }
   if(newVal){
     checkRemainAmount(newVal);
   }
 });

 /*
 *自动投标详情
 */
 $scope.autoTendersDetail = function() {
   Restangular.one('/users/0/autoTender' ).get().then(function(response){
      // response


    $scope.autoTenders = response;
    $scope.autoTenders.maxRemainDay = $scope.autoTenders.maxRemainDay  == null ? 360 : $scope.autoTenders.maxRemainDay;
    $scope.autoTenders.annualEarnings = ($scope.autoTenders.annualEarnings == null || $scope.autoTenders.annualEarnings == 0) ? 7 : $scope.autoTenders.annualEarnings;
    $scope.autoTenders.investType = $scope.autoTenders.investType == null ? 0 : $scope.autoTenders.investType;
    
    $scope.autoTenders.minInvestAmount = $scope.autoTenders.minInvestAmount ==null  ? 100 : $scope.autoTenders.minInvestAmount ;
    $scope.autoTenders.remainAmount = $scope.autoTenders.remainAmount == null  ? 0 : $scope.autoTenders.remainAmount ;
    $scope.autoTenders.startTime = $scope.autoTenders.startTime == null ? new Date().getTime() : $scope.autoTenders.startTime;
    $scope.autoTenders.endTime = $scope.autoTenders.endTime == null ? new Date().getTime() + 365 * 24 * 3600 * 1000 : $scope.autoTenders.endTime;

    $scope.autoTenders.startDate = new Date($scope.autoTenders.startTime);
    $scope.autoTenders.endDate = new Date($scope.autoTenders.endTime);


    //校验开始日期
    $scope.$watch('autoTenders.startDate', function(newVal, oldVal) {
     $scope.satartTimeErrMsg = null;
     $scope.endTimeErrMsg = null;
      if(newVal){
        checkStartTime(newVal);
      }

    });
    //校验结束日期
    $scope.$watch('autoTenders.endDate', function(newVal, oldVal) {
     $scope.satartTimeErrMsg = null;
     $scope.endTimeErrMsg = null;
      if(newVal){
        checkEndTime(newVal);
      }
    });
   })
 };
 $scope.autoTendersDetail();

//控制界面显示
$scope.toEdit = function(){
  $scope.showStatus = true;
}


//跳转到个人设置页
var toSetting = function() {
  $state.go('root.userCenter.setting');
}

/*
*开启、编辑自动投标
*/
$scope.onAutoTenders = function(autoTender) {

  
  var startTime = autoTender.startDate.getTime();
  var endTime = autoTender.endDate.getTime();
  checkMinAmount(autoTender.minInvestAmount);
  checkRemainAmount(autoTender.remainAmount);
  checkStartTime(startTime);
  if($scope.satartTimeErrMsg !== null) {
    $scope.endTimeErrMsg = null;
  }else {
    checkEndTime();
  }

  if($scope.amountErrMsg || $scope.remainErrMsg || $scope.endTimeErrMsg || $scope.satartTimeErrMsg || autoTender.minInvestAmount === 0) {
    return ;
  }
  Restangular.one('/autoTenders').post('',{
    minInvestAmount: autoTender.minInvestAmount,
    minRemainDay: 0,
    maxRemainDay: autoTender.maxRemainDay,
    annualEarnings: autoTender.annualEarnings,
    investType: autoTender.investType,
    remainAmount: autoTender.remainAmount,
    startTime: startTime,
    endTime: endTime
  }).then(function(response){
    if(response && response.ret !== -1) {
      $rootScope.successMsg = '已开启！';
      $rootScope.showSuccessToast = true;
      $timeout(function() {
        $rootScope.showSuccessToast = false;
        $rootScope.successMsg = '';
        toSetting();
      }, 1000);
    }
  })
};

/*
*关闭自动投标
*/
$scope.offAutoTenders = function() {
  Restangular.one('/users/0/disabledAutoTender').put({
    status: 3
  }).then(function(response){
    if(response && response.ret !== -1){
      $rootScope.successMsg = '已禁用！';
      $rootScope.showSuccessToast = true;
      $timeout(function() {
        $rootScope.showSuccessToast = false;
        $rootScope.successMsg = '';
        toSetting();
      }, 1000);
    }
  })

};



});