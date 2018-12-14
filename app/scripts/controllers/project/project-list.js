'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', function($scope, $rootScope, $state, $timeout, $stateParams, $location, Restangular, ProjectUtils, ScreenWidthUtil){
  	$scope.page = 1;
    $scope.pageSize = 5;
  	$scope.widthFlag = "";
    $rootScope.showLoadingToast = true;
    //限制项目名长度
  	$scope.widthFlag = ScreenWidthUtil.screenWidth();
    $scope.tabs = [{
        title: '宏财精选',
      },{
        title: '宏财尊贵',
      },{
        title: '债权转让',
    }];

    $scope.projectDatas = [{
      name: '宏财精选项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }
    ,{
      name: '宏财精选项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00, 
      type: 5
    }
    ,{
      name: '宏财精选项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00, 
      type: 5
    }
    ,{
      name: '宏财尊贵项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00, 
      type: 6
    }
    ,{
      name: '宏财尊贵项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00, 
      type: 6
    }];

    $scope.assignmentList = [{
      name: '债权转让项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }
    ,{
      name: '债权转让项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }
    ,{
      name: '债权转让项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }
    ,{
      name: '债权转让项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }
    ,{
      name: '债权转让项目',
      status: 7,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    }];
    /**
     * 当前页项目列表
     */
    $scope.getProjectList = function(page, pageSize, type, turn) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;
      if(turn !== undefined) {
        $scope.projectDatas = type === 5 ? angular.fromJson(localStorage.getItem('choiceProjectList')) : angular.fromJson(localStorage.getItem('honorProjectList'));
        $rootScope.showLoadingToast = false;
        $scope.busy = false;
      }
      if ($scope.pageCount < $scope.page) {
        return;
      }
      Restangular.one('projects').get({
        page: page,
        pageSize: pageSize,
        type: type
      }).then(function(response) {
        $timeout(function(){
          $rootScope.showLoadingToast = false;
        },200);
        $scope.pageCount = response.pageCount;
        $scope.projectStatusMap = response.projectStatusMap;
        var serverTime = response.serverTime || (new Date().getTime());
        if(page === 1) {
          $scope.projectDatas = response.projectList;
          type === 5 ? localStorage.setItem('choiceProjectList', angular.toJson($scope.projectDatas)) : localStorage.setItem('honorProjectList', angular.toJson($scope.projectDatas));
        }else {
          for (var i = 0; i < response.projectList.length; i++) {
            ProjectUtils.projectTimedown(response.projectList[i], serverTime);
            $scope.projectDatas.push(response.projectList[i]);
          };
        }

        $timeout(function() {
          $scope.busy = false;
        }, 10);

      });
    }
    /**
    *债权转让列表
    */
    $scope.getAssignmentList = function(page, pageSize, turn) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;
      if(turn !== undefined) {
        $scope.assignments = angular.fromJson(localStorage.getItem('assignmentList'));
        $rootScope.showLoadingToast = false;
        $scope.busy = false;
      }
      Restangular.one("assignments").get({
        page: page,
        pageSize: pageSize
      }).then(function(response){
        if(!response || response.ret === -1) {
          return;
        }
        $timeout(function(){
          $rootScope.showLoadingToast = false;
        },100);
        $scope.pageCount0 = response.totalPage;
        if(page === 1) {
          $scope.assignments = response.data;
          localStorage.setItem('assignmentList', angular.toJson($scope.assignments));
        } else {
          for (var i = 0; i < response.data.length; i++) {
            $scope.assignments.push(response.data[i]);
          };
        }
        $timeout(function() {
          $scope.busy = false;
        }, 10);
      })
    }
    /**
     * 跳转到详情页
     */
    $scope.toDetail = function(project){
      if($rootScope.timeout){
          $scope.tabParam === 2 ? $state.go('root.assignments-detail', {number: project.number}) : $state.go('root.project', {number: project.number});
      }
    }

    
    $scope.tabParam = $stateParams.tab == undefined ? '0' : $stateParams.tab;
    if($scope.tabParam == '0') {
      if(!angular.fromJson(localStorage.getItem('choiceProjectList'))){
        $scope.getProjectList($scope.page, $scope.pageSize, 5);
      } else {
        $scope.getProjectList($scope.page, $scope.pageSize, 5, 0);
      }
    } else if($scope.tabParam == '1'){
      if(!angular.fromJson(localStorage.getItem('honorProjectList'))){
        $scope.getProjectList($scope.page, $scope.pageSize, 6);
      } else {
        $scope.getProjectList($scope.page, $scope.pageSize, 6, 1);
      }
    } else if ($scope.tabParam == '2') {
      if(!angular.fromJson(localStorage.getItem('assignmentList'))){
        $scope.getAssignmentList($scope.page, $scope.pageSize);
      } else {
        $scope.getAssignmentList($scope.page, $scope.pageSize, 0);
      }
    }
    //pc端路由保持一致
    if($location.path().split('/')[1] == 'assignments') {
      $scope.tabParam = 1;
    }
    $scope.tabParam = parseInt($scope.tabParam);
    $scope.switchTab = function(tabIndex) {
      $scope.tabParam = tabIndex;
      $location.search('tab', tabIndex);
    };
    


    /**
     * 加载更多项目
     */
    $scope.loadMore = function(project, type) {
      if($scope.busy){
        return;
      }
      $scope.busy = true;
      $scope.page = $scope.page + 1;
      if($scope.tabParam == '0') {
        project($scope.page, $scope.pageSize, 5);
      } else if($scope.tabParam == '1'){
        project($scope.page, $scope.pageSize, 6);
      } else if ($scope.tabParam == '2') {
        project($scope.page, $scope.pageSize);
      }
    };

  })

