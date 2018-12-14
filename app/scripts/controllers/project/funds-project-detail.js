'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('FundsProjectDetailCtrl', function($scope, $state, $rootScope, $stateParams, $location, fundsProjects, Restangular, config, toCunGuanUtils) {
    // 宏金盈详情页面
    var number = $stateParams.number;
    if (!number) {
      $state.go('root.main');
    }

    $scope.showFundsAgreement = false;
    $scope.toggle = function() {
      $scope.showFundsAgreement = !$scope.showFundsAgreement;
    };

      // simple project
      fundsProjects.one(number).get().then(function(response) {
        if (response.$status === 'ok') {
          // 项目详情
          $scope.simpleFundsProject = response;
          $scope.simpleFundsProject.isRepeatFlag = false;
          // console.log($scope.simpleFundsProject);
          // 可出借金额
          $scope.fundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
          // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动出借用户。
          if ($rootScope.isLogged) {
            // 用户可出借金额
            $scope.userCanFundsInvestNum = $scope.fundsProjectInvestNum > $rootScope.account.balance ? $rootScope.account.balance : $scope.fundsProjectInvestNum;

            var plusNum = $rootScope.securityStatus.realNameAuthStatus + $rootScope.securityStatus.autoTransfer;
            switch (plusNum) {
              case 2:
                $scope.fundsFlag = 3;
                break;
              case 1:
                $scope.fundsFlag = 2;
                break;
              case 0:
                $scope.fundsFlag = 1;
                break;
            }
          } else {
            $scope.userCanCreditInvestNum = 0;
            $scope.fundsFlag = 0;
          }
          /**
           * 加息券统计信息
           */
          Restangular.one('users', '0').one('unUsedIncreaseRateCoupons').get().then(function(response) {
            $scope.increaseRateCoupons = response;
            $scope.selectCoupon = null;
            if ($scope.increaseRateCoupons.length > 0 && $scope.simpleFundsProject.product.type !== 1) {
              for (var i = 0; i < $scope.increaseRateCoupons.length; i++) {
                var rateText = '加息券 +' + $scope.increaseRateCoupons[i].rate + '%';
                $scope.increaseRateCoupons[i].rateText = rateText;
              }
              var increaseRateCoupon = {
                number: "",
                rate: 0,
                rateText: "不使用加息券"
              }
              $scope.increaseRateCoupons.push(increaseRateCoupon);

              $scope.selectCoupon = $scope.increaseRateCoupons[0];
            }
          });
        } else {
          // do anything?
          // 请求数据失败，请重新加载该页面
        }
      });



    $scope.statusMap = {
      1: '融资中',
      2: '融资成功',
      3: '融资结束',
      4: '还款中',
      5: '还款完成'
    };

    $scope.rewardFlag = false;
    $scope.selectReward = function(project) {
      if (project.investAmount > 0) {
        if ($scope.selectCoupon != null) {
          $scope.rewardFlag = true;
        }
      } else {
        alert('请先输入出借金额');
      }
    }

    $scope.experienceAmount = 0;
    $scope.confirmUseReward = function(project, selectCoupon) {
      if (project.useExperience) {
        $scope.experienceAmount = parseInt($rootScope.account.experienceAmount / 100) * 100;
        if ($scope.experienceAmount > project.investAmount) {
          project.investAmount = $scope.experienceAmount;
        }
      }
      $scope.couponNumber = selectCoupon == null ? "" : selectCoupon.number;
      $scope.rewardFlag = false;
      $scope.selectCoupon = selectCoupon;
    }

    $scope.checkLargeUserCanAmount = function(project) {
      // console.log(project);
      if ($rootScope.isLogged) {
        var availableAmount = project.product.type !== 1 ? $rootScope.account.balance : $rootScope.account.balance + $rootScope.account.experienceAmount;
        if ($rootScope.account.balance < project.investAmount) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    $scope.checkStepAmount = function(project) {
      if (project.investAmount >= project.increaseAmount) {
        if (project.investAmount % project.increaseAmount === 0) {
          return false;
        } else {
          return true;
        }
      }
    };

    $scope.checkAutoTransfer = function(simpleFundsProject) {
      simpleFundsProject.isRepeatFlag = !simpleFundsProject.isRepeatFlag;
      if ($scope.fundsFlag === 2) {
        $scope.simpleFundsProject.isRepeatFlag = false;
        simpleFundsProject.isRepeatFlag = false;
        $scope.authAutoTransferFlag = true;
        $scope.msg = "您还没有开通自动续投";
        // console.log($scope.msg);
      }
    };

    $scope.cancelAuthAutoTransfer = function() {
      $scope.authAutoTransferFlag = false;
    }

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      toCunGuanUtils.to('autoTransfer', null, null, null, null, null);
    }
      /*
       * 带参数跳至登录页
       */
    $scope.toLog = function() {
      var redirectUrl = $location.path();
      $state.go('root.login', {
        redirectUrl: redirectUrl
      });
      return;
    }

    /**
     * 实名认证，即开通易宝
     */
    $scope.realNameAuth = function(user) {
      if (!user.realName || !user.idNo) {
        $scope.errMsg = '请输入姓名或身份证号';
      }

      toCunGuanUtils.to('register', null, user.realName, user.idNo, null, null);
    }

    function newForm() {
      var f = document.createElement('form');
      document.body.appendChild(f);
      f.method = 'post';
      // f.target = '_blank';
      return f;
    }

    function createElements(eForm, eName, eValue) {
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
    }

    $scope.toInvest = function(simpleFundsProject) {
      if (simpleFundsProject.isRepeatFlag && $scope.fundsFlag === 3) {
        $scope.isRepeat = 1;
      } else {
        $scope.isRepeat = 2;
      }

      if (!simpleFundsProject.investAmount) {
        $scope.msg = '出借金额有误，请重新输入';
        return;
      }

      $scope.investAmount = simpleFundsProject.investAmount;
      var payAmount = $scope.investAmount - $scope.experienceAmount;
      var couponNumber = $scope.couponNumber;
      if ($scope.fundsFlag === 0) {
        $state.go('root.login');
      } else if ($scope.fundsFlag === 1) {
        // 需要跳到实名认证页面
      } else if ($scope.checkLargeUserCanAmount(simpleFundsProject)) {
        // $state.go('root.yeepay-transfer', {
        //       type: 'recharge',
        //       number: payAmount - $rootScope.account.balance + ($rootScope.account.reward == null ? 0 : $rootScope.account.reward)
        // });
        $state.go('root.userCenter.recharge');
      } else if ($scope.fundsFlag === 2 || $scope.fundsFlag === 3) {
        if (payAmount > 0) {
          Restangular.one('/fundsProjects/' + number + '/users/' + 0 + '/').post('investment', 
            amount: simpleFundsProject.investAmount,
            projectId: simpleFundsProject.id,
            isRepeat: $scope.isRepeat,
            payAmount: payAmount,
            couponNumber: couponNumber
          }).then(function(response) {
            // 重复下单后，response.number为undefined
            if (response.$status === 'ok') {
              if (response.number !== null && response.number !== undefined) {
                Restangular.one('/fundsProjects/' + number + '/users/' + 0 + '/').post('payment', {}).then(function(response) {
                  if (response.$status === 'ok') {
                    var req = response.req;
                    var sign = response.sign;
                    var _f = newForm(); //创建一个form表单
                    createElements(_f, 'req', req); //创建form中的input对象
                    createElements(_f, 'sign', sign);
                    _f.action = config.YEEPAY_ADDRESS + 'toTransfer'; //form提交地址
                    _f.submit(); //提交
                  }
                  // $state.go('');
                })
              } else if (response.ret === -1) {
                $scope.msg = response.msg;
              }
            } else {
              $scope.msg = "服务器累瘫了，请稍后访问。";
            }
          })
        } else {
          Restangular.one('/fundsProjects/' + number + '/users/' + 0 + '/').post('investmentByExperience', {
            amount: simpleFundsProject.investAmount,
            projectId: simpleFundsProject.id,
            isRepeat: $scope.isRepeat,
            payAmount: payAmount,
            couponNumber: couponNumber
          }).then(function(response) {
            // 重复下单后，response.number为undefined
            if (response.$status === 'ok') {
              if (response.number !== null && response.number !== undefined) {
                $state.go('root.yeepay-callback', {
                  business: 'TRANSFER',
                  status: 'SUCCESS',
                  amount: response.amount
                });
              } else if (response.ret === -1) {
                $scope.msg = response.msg;
              }
            } else {
              $scope.msg = "服务器累瘫了，请稍后访问。";
            }
          })
        }
      }
    };
  });
