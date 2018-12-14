'use strict';
/**
 * @ngdoc overview
 * @name p2pSiteMobApp
 * @description
 * # p2pSiteMobApp
 * Main module of the application.
 */
var p2pSiteMobApp = angular.module('p2pSiteMobApp', [
  // 'angular-loading-bar',
  // 'ngCookies',
  // 'angular-cache',
  // 'angular-datepicker',
  'ngAnimate',
  // 'ngTouch',
  'famous.angular',
  'ui.router',
  'restmod',
  'config',
  'ipCookie',
  // 'angularMoment',
  'infinite-scroll',
  'angular-md5',
  'restangular',
  'ui.bootstrap',
  //'restangular',
  'textAngular'
]);

p2pSiteMobApp
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$uiViewScrollProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $uiViewScrollProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $uiViewScrollProvider.useAnchorScroll();
    $stateProvider
      .state('landing-page', {
        url: '/landing-page',
        views: {
          'landingPage': {
            templateUrl: 'views/landing-page.html'
          }
        }
      })
      .state('root', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/root.html'
          },
          'header': {
            templateUrl: 'views/_header.html',
            controller: 'HeaderCtrl',
            controllerUrl: 'scripts/controller/header-ctrl'
          },
          'footer': {
            templateUrl: 'views/_footer.html',
            controller: 'RootCtrl',
            controllerUrl: 'scripts/controller/root-ctrl'
          }
        }
      })
      .state('root.main', {
        url: '/?tab&subTab',
        views: {
          '': {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerUrl: 'scripts/controllers/main'
          }
        }
      })

      .state('root.disclosure', {
        url: '/disclosure?tab',
        data: {
          title: '信息披露'
        },
        views: {
          '': {
            templateUrl: 'views/disclosure.html',
            controller: 'disclosureCtrl',
            controllerUrl: 'scripts/controllers/disclosure'
          }
        }
      })
      .state('root.policies', {
        url: '/policies/:id',
        data: {
          title: '信息披露'
        },
        views: {
          '': {
            templateUrl: 'views/policies.html',
            controller: 'policiesCtrl',
            controllerUrl: 'scripts/controllers/policies'
          }
        }
      })

      //绑定微信页面
      .state('root.bind-wechat', {
        url: '/bind-wechat',
        views: {
          '': {
            templateUrl: 'views/bind-wechat.html',
            controller: 'BindWechatCtrl',
            controllerUrl: 'scripts/controllers/bind-wechat'
          }
        }
      })
      //微信绑定成功、已绑定页面
      .state('root.bindWechat-status', {
        url: '/bindWechat-status?status',
        views: {
          '': {
            templateUrl: 'views/bindWechat-status.html',
            controller: 'BindSuccessCtrl',
            controllerUrl: 'scripts/controllers/bindWechat-status'
          }
        }
      })
      //隐私条款
      .state('root.privacy-policy ', {
        url: '/privacy-policy',
        views: {
          '': {
            templateUrl: 'views/privacy-policy.html',
            // controller: 'MainCtrl',
            // controllerUrl: 'scripts/controllers/main'
          }
        }
      })

    // 开通银行存管落地页——上线前
    .state('root.bank-custody-landing', {
      url: '/bank-custody-landing',
      data: {
        title: '银行存管介绍'
      },
      views: {
        '': {
          templateUrl: 'views/bank-custody-landing.html'
        }
      }
    })
    // 开通银行存管落地页——上线后
    .state('root.bank-custody', {
      url: '/bank-custody',
      data: {
        title: '银行存管介绍'
      },
      views: {
        '': {
          templateUrl: 'views/bank-custody.html',
          controller: 'ActivateCtrl',
          controllerUrl: 'scripts/modal/activate.js'
        }
      }
    })
    // 开通银行存管流程页——新用户
    .state('root.new-user-process', {
      url: '/new-user-process',
      data: {
        title: '新用户开通流程'
      },
      views: {
        '': {
          templateUrl: 'views/new-user-process.html'
        }
      }
    })
    
    // 开通银行存管流程页——老用户
    .state('root.old-user-process', {
      url: '/old-user-process',
      data: {
        title: '老用户开通流程'
      },
      views: {
        '': {
          templateUrl: 'views/old-user-process.html'
        }
      }
    })

    // 忘记密码流程
    .state('root.getPwd1', {
        url: '/getPwd1',
        views: {
          '': {
            templateUrl: 'views/getPwd1.html',
            controller: 'GetPwdCtrl',
            controllerUrl: 'scripts/controllers/get-pwd-back'

          }
        }
      })
      // 忘记密码流程
      .state('root.getPwd2', {
        url: '/getPwd2/:captcha/:mobile',
        views: {
          '': {
            templateUrl: 'views/getPwd2.html',
            controller: 'GetPwdCtrl',
            controllerUrl: 'scripts/controllers/get-pwd-back'

          }
        }
      })
      // 注册登录流程
      .state('root.login', {
        url: '/login?redirectUrl',
        data: {
          title: '登录'
        },
        views: {
          '': {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerUrl: 'scripts/controllers/login'

          }
        }
      })
      .state('root.register', {
        url: '/register/:openId/:inviteCode',
        data: {
          title: '注册'
        },
        views: {
          '': {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerUrl: 'scripts/controllers/register'
          }
        }
      })
      .state('root.register2', {
        url: '/register?inviteCode&redirectUrl',
        data: {
          title: '注册'
        },
        views: {
          '': {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerUrl: 'scripts/controllers/register'
          }
        }
      })
      .state('root.register-success', {
        url: '/register-success/:userId',
        views: {
          '': {
            templateUrl: 'views/register-success.html',
            controller: 'RegisterYeepayCtrl',
            controllerUrl: 'scripts/controllers/register-yeepay'
          }
        }
      })
      .state('root.yeepay-callback', {
        url: '/yeepay-callback/:business/:status?amount&number',
        views: {
          '': {
            templateUrl: 'views/yeepay-callback.html',
            controller: 'YeepayCallbackCtrl',
            controllerUrl: 'scripts/controllers/yeepay-callback'
          }
        }
      })
      //修改密码
      .state('root.modifyPwd', {
        url: '/modify-pwd',
        views: {
          '': {
            templateUrl: 'views/modify-pwd.html',
            controller: 'modifyPwd',
            controllerUrl: 'scripts/controllers/modify-pwd.js'
          }
        }
      })

    // 项目详情页
    .state('root.project-detail', {
        url: '/project-info/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail.html',
            controller: 'ProjectInfoCtrl',
            controllerUrl: 'scripts/controllers/project/project-info'
          }
        }
      })
      // 项目出借详情页
      .state('root.project', {
        url: '/project/:number',
        views: {
          '': {
            templateUrl: 'views/project/investment-project-detail.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
          }
        }
      })
      // 项目出借人记录页
      .state('root.orders', {
        url: '/project/:number/orders',
        views: {
          '': {
            templateUrl: 'views/project/project-orders.html',
            controller: 'ProjectOrdersCtrl',
            controllerUrl: 'scripts/controllers/project/project-orders'
          }
        },
        data: {
          title: '项目出借人'
        },
      })
      // 项目列表页
      .state('root.project-list', {
        url: '/guaranteepro-list?tab',
        views: {
          '': {
            templateUrl: 'views/main/project-list.html',
            controller: 'ProjectListCtrl',
            controllerUrl: 'scripts/controllers/project/project-list'
          }
        }
      })

      /**
       * 债权转让项目详情页
       */
      .state('root.assignments-detail', {
        url: '/assignments/:number',
        views: {
          '': {
            templateUrl: 'views/assignment/assignments-detail.html',
            controller: 'AssignmentDetailCtrl',
            controllerUrl: 'scripts/controller/assignment/assignment-detail-ctrl'
          }
        }
      })
      // 债权转让记录页
      .state('root.assignmentOrders', {
        url: '/assignments/:number/orders',
        views: {
          '': {
            templateUrl: 'views/assignment/assignment-orders.html',
            controller: 'assignmentOrdersCtrl',
            controllerUrl: 'scripts/controllers/assignment/assignment-orders'
          }
        },
        data: {
          title: '债权转让记录'
        }
      })
     
      // 项目详情页更多详情
      .state('root.project-detail-more', {
        url: '/project-detail-more/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail-more.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
          }
        }
      })

      .state('root.registration-agreement', {
        url: '/registration-agreement',
        views: {
          '': {
            templateUrl: 'views/_registration-agreement.html'
          }
        }
      })
      // 个人中心
      .state('root.userCenter', {
        abstract: true,
        url: '/user-center',
        views: {
          'user-center': {
            templateUrl: 'views/user-center/user-center.html'
              /*,
                          controller: 'UserCenterCtrl',
                          controllerUrl: 'scripts/controller/user-center/user-center'*/
          },
          'user-center-toggle': {
            templateUrl: 'views/user-center/user-center-toggle.html',
            controller: 'UserCenterCtrl',
            controllerUrl: 'scripts/controller/user-center/user-center'
          }
        }
      })
      
      //我的账户
      .state('root.userCenter.account-overview', {
        url: '/account-overview',
        data: {
          title: '个人中心'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/account.html',
            controller: 'AccountCtrl',
            controllerUrl: 'scripts/controllers/user-center/account'
          }
        }
      })
      //个人设置
      .state('root.userCenter.setting', {
        url: '/setting',
        data: {
          title: '个人设置'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/setting.html',
            controller: 'SettingsCtrl',
            controllerUrl: 'scripts/controllers/user-center/settings'
          }
        }
      })

      // 新自动投标
      .state('root.userCenter.autotender', {
        url: '/autotender',
        data: {
          title: '自动投标'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/autotender.html',
            controller: 'AutoTenderCtrl',
            controllerUrl: 'scripts/controllers/user-center/autotender'
          }
        }
      })

      //修改手机号码
      .state('root.userCenter.resetMobile', {
        url: '/reset-mobile',
        data: {
          title: '修改手机号'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/reset-mobile.html',
            controller: 'resetMobileCtrl',
            controllerUrl: 'scripts/controllers/user-center/resetMobile'
          }
        }
      })
      // 出借统计
      .state('root.userCenter.investments-stat', {
        url: '/investments-stat',
        views: {
          '': {
            templateUrl: 'views/user-center/investments-stat.html',
            controller: 'InvestmentsStatCtrl',
            controllerUrl: 'scripts/controllers/user-center/investments-stat'
          }
        }
      })
       // 我的出借总览
      .state('root.userCenter.credits-overview', {
        url: '/credits-overview',
        data: {
          title: '我的出借'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credits-overview.html',
            controller: 'CreditsOverviewCtrl',
            controllerUrl: 'scripts/controllers/user-center/credits-overview'
          }
        }
      })
      // 我的出借列表
      .state('root.userCenter.credits', {
        url: '/credit?tab',
        data: {
          title: ''
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credit.html',
            controller: 'CreditCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit'
          }
        }
      })
      // 债权管理
      .state('root.userCenter.assignments', {
        url: '/assignments?tab',
        data: {
          title: '债权转让'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/assignments.html',
            controller: 'assignmentsCtrl',
            controllerUrl: 'scripts/controllers/user-center/assignments-ctrl'
          }
        }
      })
      // 债权转让列表业详情
      .state('root.userCenter.assignmentList-details', {
        url: '/assignmentList-details/:number',
        data: {
          title: '转让详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/assignmentList-details.html',
            controller: 'assignmentListDetailsCtrl',
            controllerUrl: 'scripts/controllers/user-center/assignmentList-details-ctrl'
          }
        }
      })
      /**
       * 债权管理-债权转让页面
       */
      .state('root.userCenter.assignments-transfer-details', {
        url: '/assignments-transfer-details/:number',
        views: {
          '': {
            templateUrl: 'views/user-center/assignments-transfer-details.html',
            controller: 'AssignmentsTransferCtrl',
            controllerUrl: 'scripts/controller/user-center/assignments-transfer-details.js'
          }
        },
        data: {
          title: '立即转出'
        }
      })
      // 债权详情
      .state('root.userCenter.credit-security-details', {
        url: '/credit-security-details/:type/:number',
        data: {
          title: '债权详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credit-security-details.html',
            controller: 'CreditSecurityCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit-security-details'
          }
        }
      })
      // 充值
      .state('root.userCenter.recharge', {
        url: '/recharge?amount',
        data: {
          title: '充值'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/recharge.html',
            controller: 'RechargeCtrl',
            controllerUrl: 'scripts/controllers/user-center/recharge'
          }
        }
      })
      // 提现
      .state('root.userCenter.withdraw', {
        url: '/withdraw',
        data: {
          title: '提现'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/withdraw.html',
            controller: 'WithdrawCtrl',
            controllerUrl: 'scripts/controllers/user-center/withdraw'
          }
        }
      })
      // 银行卡管理
      .state('root.userCenter.bankcard', {
        url: '/bankcard',
        data: {
          title: '我的银行卡'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/bankcard.html',
            controller: 'BankcardCtrl',
            controllerUrl: 'scripts/controllers/user-center/bankcard'
          }
        }
      })
      // 站内消息
      .state('root.userCenter.messages', {
        url: '/messages',
        data: {
          title: '消息'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/message.html',
            controller: 'MessageCtrl',
            controllerUrl: 'scripts/controllers/user-center/message'
          }
        }
      })
      // 站内消息 公告详情
      .state('root.userCenter.web-site-notice', {
        url: '/messages/:id',
        data: {
          title: '公告详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/web-site-notice.html',
            controller: 'MessageDetailCtrl',
            controllerUrl: 'scripts/controllers/user-center/web-site-notice'
          }
        }
      })
      // 交易记录
      .state('root.userCenter.deals', {
        url: '/deals',
        data: {
          title: '资金流水'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/deal.html',
            controller: 'DealCtrl',
            controllerUrl: 'scripts/controllers/user-center/deal'
          }
        }
      })
      // 风险测评
      .state('root.userCenter.questionnaire', {
        url: '/questionnaire',
        data: {
          title: '风险测评'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/questionnaire.html',
            controller: 'QuestionnaireCtrl',
            controllerUrl: 'scripts/controllers/user-center/questionnaire'
          }
        }
      })
      // 预约记录
      .state('root.demo', {
        url: '/demo',
        views: {
          '': {
            templateUrl: 'views/demo.html',
            controller: 'DemoCtrl'
          }
        }
      })

      //网站公告
      .state('root.web-site-notice', {
        url: '/web-site-notice',
        views: {
          '': {
            templateUrl: 'views/activity/activity-real.html',
          }
        }
      })

   //每日抽奖
     .state('root.daily-lottery', {
       url: '/daily-lottery',
       views: {
         '': {
           templateUrl: 'views/activity/daily-lottery.html',
           controller: 'DailyLotteryCtrl',
           controllerUrl: 'scripts/controllers/daily-lottery/daily-lottery-ctrl'
         }
       }
     })
      .state('root.lottery', {
        url: '/lottery?act&f&inviteCode',
        data:{
          title: '幸运大抽奖'
        },
        views: {
         '': {
           templateUrl: 'views/activity/lottery.html',
           controller: 'LotteryCtrl',
           controllerUrl: 'scripts/controllers/lottery-ctrl'
         }
       }
     })

    // 活动主url
    .state('root.activity', {
      abstract: true,
      url: '/activity',
      views: {
        '': {
          templateUrl: 'views/activity/root-activity.html'
            // controller: 'ShareSpringCtrl',
            // controllerUrl: 'scripts/controllers/share-spring/share-spring-ctrl'
        }
      }
    })

    // 庆存管迎合规 ——存管上线后续活动
    .state('root.activity.custody-activity', {
      url: '/custody-activity',
      data: {
        title: '庆存管迎合规'
      },
      views: {
        '': {
          templateUrl: 'views/activity/custody-activity.html'
        }
      }
    })

    //母亲节活动 2017.5.13 24:00
    .state('root.activity.mothers-day', {
      url: '/mothers-day',
      views: {
        '': {
          templateUrl: 'views/activity/mothers-day.html',
          controller: 'mothersDayCtrl',
          controllerUrl: 'scripts/controllers/activity/mothers-day'
        }
      },
      data: {
        title: '五月爱，吾越爱'
      }
    })

    //端午节活动 
    .state('root.activity.dragon-boat', {
      url: '/dragon-boat',
      views: {
        '': {
          templateUrl: 'views/activity/dragon-boat.html'
        }
      },
      data: {
        title: '浓情端午'
      }
    })

    //探幕 游戏兑换
    .state('root.activity.exchange-cdkey', {
      url: '/exchange-cdkey',
      views: {
        '': {
          templateUrl: 'views/activity/exchange-cdkey.html',
          controller: 'ExchangeCdkeyCtrl',
          controllerUrl: 'scripts/controllers/activity/exchange-cdkey'
        }
      }
    })
    //摩擦 游戏兑换
    .state('root.activity.exchange-flowers', {
      url: '/exchange-flowers?act&f',
      views: {
        '': {
          templateUrl: 'views/activity/exchange-flowers.html',
          controller: 'InviteSharingCtrl',
          controllerUrl: 'scripts/controllers/activity/invite-sharing-ctrl'
        }
      }
    })
    
    // 渠道活动落地页
    .state('root.activity.channel', {
      url: '/channel?act&f&inviteCode',
      views: {
        '': {
          templateUrl: 'views/activity/channel.html',
          controller: 'ChannelCtrl',
          controllerUrl: 'scripts/controllers/activity/channel-ctrl'
        }
      }
    })
    // 渠道活动落地页——单独html页面
    .state('root.activity.channels', {
      url: '/channels?act&f',
      views: {
        '': {
          templateUrl: 'views/activity/channels.html'
        }
      }
    })
    // 邀请活动
    .state('root.activity.invite-activity', {
      url: '/invite-activity',
      views: {
        '': {
          templateUrl: 'views/activity/new-year-invite.html',
          controller: 'newInviteCtrl',
          controllerUrl: 'scripts/controllers/activity/new-invite-ctrl'
        }
      },
      data: {
        title: '邀请好友，双重奖励'
      }
    })
    // 邀请活动-2017.4.13
    .state('root.activity.inviteActivity', {
      url: '/invite',
      views: {
        '': {
          templateUrl: 'views/activity/invite.html',
          controller: 'InviteCtrl',
          controllerUrl: 'scripts/controllers/activity/invite-ctrl'
        }
      },
      data: {
        title: '邀请好友'
      }
    })
    
    // 邀请活动-我的奖励
      .state('root.activity.reward', {
        url: '/reward',
        views: {
          '': {
            templateUrl: 'views/activity/reward.html',
            controller: 'RewardCtrl',
            controllerUrl: 'scripts/controllers/activity/reward-ctrl'
          }
        },
        data: {
          title: '我的奖励'
        }
      })

    // 邀请活动分享注册活动落地页-2017.4.13
    .state('root.activity.invite-sharing', {
      url: '/invite-sharing/:inviteCode?act&f',      
      views: {
        '': {
          templateUrl: 'views/activity/invite-sharing.html',
          controller: 'InviteSharingCtrl',
          controllerUrl: 'scripts/controllers/activity/invite-sharing-ctrl'
        }
      },
      data: {
        title: '宏财新手大礼包，抢！'
      }
    })
    
    //新手活动落地页
      .state('root.activity.novice-landing', {
        url: '/novice-activity?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/new-year-novice-landing.html',
            controller: 'NewYearNoviceCtrl',
            controllerUrl: 'scripts/controllers/activity/new-year-novice-ctrl'
          }
        },
        data: {
          title: '宏运当头，财源滚滚'
        }
      })

      //我的加息券
      .state('root.userCenter.rate-coupon', {
        url: '/rate-coupon?tab&subTab',
        data: {
          title: '加息券'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/rate-coupon.html',
            controller: 'RateCouponCtrl',
            controllerUrl: 'scripts/controllers/user-center/rate-coupon'
          }
        }
      })
      //我的邀请
      .state('root.userCenter.invite-rebate', {
        url: '/invite-rebate',
        data: {
          title: '我的邀请'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/invite-rebate.html',
            controller: 'InviteRebateCtrl',
            controllerUrl: 'scripts/controller/user-center/invite-rebate'
          }
        }
      })
      // 我的邀请好友列表
      .state('root.userCenter.invite-rebate-list', {
        url: '/invite-rebate-list',
        data: {
          title: '受邀好友列表'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/invite-rebate-list.html',
            controller: 'InviteRebateCtrl',
            controllerUrl: 'scripts/controller/user-center/invite-rebate'
          }
        }
      })

      //个人中心特权本金
      .state('root.userCenter.privileged-capital', {
        url: '/privileged-capital',
        data: {
          title: '特权本金'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/privileged-capital.html',
            controller: 'PrivilegedCapitalCtrl',
            controllerUrl: 'scripts/controllers/user-center/privileged-capital'
          }
        }
      })
      //个人中心我的奖金
      .state('root.userCenter.cash-coupon', {
        url: '/cash-coupon',
        data: {
          title: '现金券'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/cash-coupon.html',
            controller: 'CashCouponCtrl',
            controllerUrl: 'scripts/controllers/user-center/cash-coupon'
          }
        }
      })

      //个人中心-审核-放款审批列表
      .state('root.project-listAuditLoan', {
        url: '/project-listAuditLoan',
        data: {
          title: '放款审批列表'
        },
        views: {
          '': {
            templateUrl: 'views/admin/project-listAuditLoan.html'
          }
        }
      })
      //个人中心-放款-满标项目列表
      .state('root.project-listFull', {
        url: '/project-listFull',
        data: {
          title: '满标项目列表'
        },
        views: {
          '': {
            templateUrl: 'views/admin/project-listFull.html'
          }
        }
      })
      //个人中心-放款-项目出借记录
      .state('root.project-loan', {
        url: '/project-loan',
        data: {
          title: '项目出借记录'
        },
        views: {
          '': {
            templateUrl: 'views/admin/project-loan.html'
          }
        }
      })

      //活动中心
      .state('root.activityCenter', {
        url: '/activity-center',
        data: {
          title: '活动中心'
        },
        views: {
          '': {
            templateUrl: 'views/activity-center.html',
            controller: 'ActivityCenter',
            controllerUrl: 'scripts/controllers/activity-center'
          }
        }
      })

      //签署银行存管介绍页面
      .state('root.sign-bank-deposits', {
        url: '/sign-bank-deposits',
        data: {
          title: '了解存管'
        },
        views: {
          '': {
            templateUrl: 'views/sign-bank-deposits.html'
          }
        }
      })

      //开始游戏页面
      .state('root.game-counting-start', {
        url: '/game-counting-start',
        data: {
          title: '谁是点钞王'
        },
        views: {
          '': {
            templateUrl: 'views/games/game-counting-start.html'
          }
        }
      })
      //游戏点钞页面
      .state('root.game-counting', {
        url: '/game-counting',
        data: {
          title: '谁是点钞王'
        },
        views: {
          '': {
            templateUrl: 'views/games/game-counting.html'
          }
        }
      })
      //游戏微信分享页面
      .state('root.game-counting-share', {
        url: '/game-counting-share',
        data: {
          title: '谁是点钞王'
        },
        views: {
          '': {
            templateUrl: 'views/games/game-counting-share.html'
          }
        }
      })
      //游戏获的奖励页面
      .state('root.game-counting-reward', {
        url: '/game-counting-reward',
        data: {
          title: '谁是点钞王'
        },
        views: {
          '': {
            templateUrl: 'views/games/game-counting-reward.html'
          }
        }
      })
    ;
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

  }])

.constant('DEFAULT_DOMAIN', '/hongcai/rest')

.constant('WEB_DEFAULT_DOMAIN', '/hongcai/api/v1')
.constant('projectStatusMap', {
    "6": "预发布",
    "7": "融资中",
    "8": "融资成功",
    "9": "还款中",
    "10": "还款完成",
    "11": "预约中",
    "12": "预约处理异常"
});
