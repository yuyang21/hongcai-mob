'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('MessageCtrl', function ($scope, $rootScope, Restangular, $timeout) {
  	$scope.userMsgsList = [];
  	$scope.page = 1;
  	$scope.notices = [];
  	$rootScope.showLoadingToast = true;
    //查询网站公告
    $scope.getNotice = function(page){
    	$rootScope.showLoadingToast = true;
    	Restangular.one('userMsgs/0/notices').get({
    		page: page,
    		pageSize: 5
    	}).then(function(response){
    		if(response && response.ret !== -1) {
    			$scope.readNotices();
				$scope.noticeTotalPage = response.totalPage;
				$scope.noticePageSize = response.pageSize;
				$scope.noticeTotal = response.total;
				for (var i = 0; i < response.data.length; i++) {
			      $scope.notices.push(response.data[i]);
			    };
			    if ($scope.notices.length > 0) {
			    	$timeout(function() {
			          $rootScope.showLoadingToast = false;
			        }, 200);
			    }
    		}

    	})
    }
    $scope.getNotice(1);

    //查看更多方法
    $scope.viewMore = function(func) {
    	$scope.page = $scope.page + 1;
    	func($scope.page);
    };


    //查询是否有未读公告
    $scope.readNotices = function() {
	    Restangular.one('/userMsgs/' + '0' + '/unReadNotices' ).get().then(function(response){
	  		if (response && response.ret !== -1) {
	  			if(response.count > 0) {
	  				// 标记所有公告已读
	  				Restangular.one('/userMsgs/' + '0' + '/readAllNotices' ).put({}).then(function(response){});
	  			}
	  		}
	  	})
    }

	// 查询是否有未读的提醒
    $scope.readMsgs = function() {
	    Restangular.one('/userMsgs/' + '0' + '/unReadMsgs' ).get().then(function(response){
	  		if (response && response.ret !== -1) {
	  			$scope.unReadMsgs = response.count;
	  		}
	  	})
    }
    $scope.readMsgs();
	
	// 提醒记录
    $scope.getUserMsgs = function(page) {
    	$rootScope.showLoadingToast = true;
	  	Restangular.one('/userMsgs/' + '0' + '/userMsgs' ).get({
	  		page : page,
	  		pageSize : 3
	  	}).then(function(response){
	  		if (response && response.ret !== -1) {
	  			
	  			$scope.msgTotalPage = response.totalPage;
	  			$scope.msgTotal = response.total;
	  			for (var i = 0; i < response.data.length; i++) {
		          $scope.userMsgsList.push(response.data[i]);
		        };
		        if ($scope.userMsgsList.length > 0) {
		        	$timeout(function() {
			          $rootScope.showLoadingToast = false;
			        }, 200);
		        }
	  		}
	  	})
    }
  	$scope.getUserMsgs(1); //获取提醒列表

  	$scope.toggleTab = function(activeTab){
  		$scope.activeTab = activeTab;
  		if (activeTab == 1 && $scope.unReadMsgs > 0) {
  			$scope.unReadMsgs = 0;
  			// 标记所有提醒已读
  			Restangular.one('/userMsgs/' + '0' + '/readAllUserMsgs' ).put({}).then(function(response){
  				if (response && response.ret !== -1) {
  					$scope.readMsgs(); //更新是否有未读的提醒
  				}
  			})
  		}
  	}

  });
