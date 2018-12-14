/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentDetailCtrl
 * @description
 * # AssignmentDetailCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('AssignmentDetailCtrl', function($state, $timeout, DateUtils, $stateParams, Restangular, $scope, $rootScope, Utils, toCunGuanUtils, SessionService, UserService) {
    var number = $stateParams.number; 
    $rootScope.showFooter = false;
    $rootScope.showLoadingToast = true;

    if(SessionService.isLogin()){
      UserService.loadAccount($scope);
      UserService.loadUserAuth($scope);
    };    

    /**
     * 债权转让信息详情
     */
    $scope.msg = '';
    Restangular.one('assignments').one(number).get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $rootScope.headerTitle = response.name.length > 10 ? response.name.substr(0,10) + '...' : response.name;
        Utils.setTitle($rootScope.headerTitle);
        $timeout(function(){
          $rootScope.showLoadingToast = false;
        },100)
        $scope.assignment = response; 
        $scope.assignmentNum = $scope.assignment.number; 
        $scope.currentStock = response.currentStock;
        $scope.projectNumber = response.projectNumber;
        $scope.annual = response.annualEarnings; 
        $scope.originalAnnual = response.originalAnnualEarnings;
        $scope.remainDay = response.remainDay;
        $scope.discountScale = response.discountScale || 0;
        $scope.assignmentType = response.type;
       //原项目还款计划
        Restangular.one('projects/'+$scope.projectNumber+'/projectBills').get({}).then(function(response){
          if(response && response.ret !==-1) {
            $scope.projectBills = response;
            $scope.latestProjectBill;
            for(var i= 0; i< response.length; i++) {
              if(response[i].status === 0) {
                $scope.latestProjectBill = response[i];
                break;
              }
            }
            $scope.lastRepayDay = $scope.latestProjectBill.lastRepaymentTime;
          }

          // 登陆后计算金额


        });
      }
    });

    // $scope.$watch('account', function(){
    //   if($scope.account && $scope.assignmentInvestAmount){
    //     var minBalanceAccount = $scope.account.balance - $scope.account.balance % 100;
    //     var minInvestAccount = $scope.currentStock * 100;
    //   }
    // });

    //监测出借金额
    $scope.$watch('assignmentInvestAmount', function(newVal, oldVal){
      if(!$rootScope.isLogged || $scope.currentStock <=0){
        return;
      }

      if(newVal !== oldVal){
        $scope.msg = undefined;
      }

      if(newVal){
        if(newVal >  $scope.account.balance || (newVal <= $scope.account.balancenewVal && $scope.account.balancenewVal < $scope.realPayAmount)){
          $scope.msg = '账户余额不足，请先充值';
        }else if(newVal % 100 !==0 ){
          $scope.msg = '出借金额必须为100的整数倍';
        }else if(newVal > $scope.currentStock *100){
          $scope.msg = '出借金额必须小于' + $scope.currentStock *100;
        }else if(newVal < 100 ){
          $scope.msg = '出借金额必须大于100';
        }
      }
      $rootScope.showMsg($scope.msg);
      //上次还款到认购当日的天数
      var lastPayDays = DateUtils.intervalDays(new Date().getTime(), $scope.lastRepayDay) * (new Date().getTime() > $scope.lastRepayDay ? 1 : -1); 
      var reward = ($scope.annual - $scope.originalAnnual) * newVal * $scope.remainDay / 36500;
      //  代收未收利息
      $scope.exProfit = newVal * $scope.originalAnnual * lastPayDays / 36500;
      //实际支付金额
      var realPayAmount0 = newVal + $scope.exProfit - reward;
      var realPayAmount1 = (newVal + $scope.exProfit) * (1 - $scope.discountScale / 100);
      //待收利息
      var profit0 = newVal * $scope.remainDay * $scope.annual / 36500;
      var profit1 = newVal * ($scope.remainDay + lastPayDays) * $scope.originalAnnual / 36500;

      if ($scope.assignmentType === 0) {
        $scope.realPayAmount = realPayAmount0;
        $scope.profit = profit0;
      } else {
        $scope.realPayAmount = realPayAmount1;
        $scope.profit = profit1;
      }

    });

    $rootScope.tofinishedOrder();
    /**
     * 下单并支付
     */
    $scope.clicked = false;
    $scope.toInvest = function(assignmentNum, assignmentAmount) {
      var toInvest = function() {
        if($scope.msg || !assignmentNum || !assignmentAmount){
          return;
        }

        $rootScope.showMsg($scope.msg);
        $rootScope.tofinishedOrder();
        $rootScope.showLoadingToast = true;
        Restangular.one('assignments/' + assignmentNum + '/orders' + '?amount=' + assignmentAmount).post('', {
          amount: assignmentAmount,
          device: Utils.deviceCode()
        }).then(function(order){
          $rootScope.showLoadingToast = false;
          $scope.clicked = true;
          // 重复下单后，response.number为undefined
          if (order && order.ret !== -1) {
            toCunGuanUtils.to('transfer', order.number, null, null, null, null);
          } else {
            $scope.msg = order.msg;
            $rootScope.showMsg($scope.msg);
          }
        });
      }
      $rootScope.migrateStatus(toInvest);
      
    };

    /**
     * 修改出借金额
     */
    $scope.modInvestAmout = function(offset,$event){
      if($scope.assignment && $scope.assignment.status != 1){
        return;
      }
      $event.stopPropagation();
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount ? $scope.assignmentInvestAmount + offset : offset;
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount < 100 ? 100 : $scope.assignmentInvestAmount;
    }    

    /**
     * 跳转到出借记录页
     */
    $scope.toOrderList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.assignmentOrders', {
          number: $stateParams.number
       });
      }
    }
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
    $scope.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
    $scope.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) ;
  });
