'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('QuestionnaireCtrl', function($location, $state, $timeout, Restangular, $scope, $rootScope) {
  	$rootScope.showLoadingToast = true;
    if ($location.path().split('/')[2] === 'questionnaire') {
	    $rootScope.showFooter = false;
	  }
  	//风险测评题目详情:
  	Restangular.one('/users/' + '0' + '/getQuestionnaire' ).get({
  		'surveyType': 1
  	}).then(function(response){
      if(response && response.ret != -1){
        $timeout(function() {
          $rootScope.showLoadingToast = false;
        }, 200);
        $scope.questionnaires = response;
      }else{
        $rootScope.showLoadingToast = true;
      }
  		
  	})
  	$scope.answerJson = {};
  	$scope.select = function(question_id,answer_id){
  		$('#'+answer_id).siblings().removeClass('active');
  		$('#'+answer_id).siblings().children('span').removeClass('selected');
  		$('#'+answer_id).addClass('active');
  		$('#'+answer_id).children('span').addClass('selected');
  		$scope.answerJson[question_id] = answer_id;
  		if (!$scope.answerJson) {
  			$('.submit-btn').addClass('button-disabled1');
  		}else {
  			$('.submit-btn').removeClass('button-disabled1');
  		}
  	}

  	$scope.submitForm = function(){

  		if($scope.errMsg || $scope.showMsk || $.isEmptyObject($scope.answerJson)){
  			return;
  		}
  		Restangular.one('/users/0').post('questionnaire',{
  			'surveyType':1,
    		'answerJson':$scope.answerJson
  		}).then(function(response){
  			if (response.ret !== -1) {
          $scope.showMsk = true;
          $scope.score = response.questionnaireRecords.score;
          $scope.riskInvestLimits = response.riskInvestLimits;
          //风险偏好
          if($scope.score <= 19){
            $scope.riskPreference = '保守型'
          }else if($scope.score > 19 && $scope.score <= 30){
            $scope.riskPreference = '稳健型'
          } else if ($scope.score > 30 && $scope.score <= 40) {
            $scope.riskPreference = '平衡性'
          }else {
            $scope.riskPreference = '进取型'
          }

  			}else {
  				$scope.errMsg = response.msg;
          $timeout(function() {
            $scope.errMsg = '';
          },2000)
  				
  			}
  		})
  	}

  	$scope.closeMsk = function(){
  		$scope.showMsk = false;
  		$state.go('root.userCenter.setting');
  	}

    
  });
