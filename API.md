# M站API文档
@王晶@张枫@王凯杰

### BASE_PATH:http://192.168.1.43/hongcai/rest

##「注册/登录」流程
   #### 登录:
      API：/users/login
      HTTP Verb: POST
      URL： root.login
      RESPONSE: { 用户信息 }

   #### 注册：
      API: /users/register
      HTTP Verb: POST
      URL: root.register
      RESPONSE: { 用户信息 }

   #### 易宝注册：

      API: /users/:id/yeepay/register
      HTTP Verb: GET
      URL: root.register
      VIEWS: 页面跳转-注册成功页面


  ##「个人中心」
   ### 账户总览

        API: /users/:id/account
        URL: root.user-center.account
        RESPONSE: { 账户信息 }


   #### 基本资料
          API: /users/:id/info
          HTTP Verb: GET
          URL: root.user-center.info
          RESPONSE: {
                      name:
                      email:
                      auth: {
                        第三方:
                        预约:
                        ..
                      }
                    }
   #####   银行卡管理
          API: /users/:id/bankcard
          HTTP Verb: GET/POST
          URL: root.user-center.bankcard
          RESPONSE: {银行卡信息}

  ####    充值
          API: /users/:id/recharge
          HTTP Verb: POST
          URL: root.user-center.recharge
          VIEWS: 页面跳转-充值成功
  ####    提现
          API: /users/:id/withdraw
          HTTP Verb: POST
          URL: root.user-center.withdraw
          VIEWS: 页面跳转-提现成功

  ####    站内消息
          API: /users/:id/messages
          HTTP Verb: GET
          URL: root.user-center.messages
          RESPONSE: { message列表 }

  ####    交易记录
          API: /users/:id/deals
          HTTP Verb: GET
          URL: root.user-center.deals
          RESPONSE: { 交易列表 }

 ###   我的投资
      投资统计
        API: /users/:id/investments/stat
        HTTP Verb: GET
        URL: root.user-center.investments-stat
        RESPONSE: { 投资统计信息 }
 ####     我的债权
        API: /users/:id/credits
        HTTP Verb: GET
        URL: root.user-center.credits
        RESPONSE: { 债权列表 }

 ####     我的订单
        API: /users/:id/orders
        HTTP Verb: GET
        URL: root.user-center.orders
        RESPONSE: { 订单列表 }
 ####     预约记录
        API: /users/:id/reservations
        HTTP Verb: GET
        URL: root.user-center.reservations
        RESPONSE: { 预约列表 }



 ##   「项目展示及投资流程」
 ####       首页：
          URL: root.main
          宏金保：
            API: projects/recommendations
            HTTP Verb: GET
            RESPONSE: { 宏金保列表 }
          宏金盈：
            API:                    fundsProjects/recommendations
            HTTP Verb: GET
            RESPONSE： { 宏金盈列表 }

 #### 列表页：
          URL: root.project-list
          宏金保：
            API: projects
            RESPONSE: {宏金保列表}

          宏金盈：
            API: fundsProjects
            RESPONSE： {宏金盈列表}

 #### 详情页：
          URL: root.project-details/:number
          宏金保：
            总览,项目信息,风控信息：
              API: projects/:number
              HTTP Verb: GET
              RESPONSE: {
                          name:
                          projectInfo:
                                    {
                                      项目信息,
                                      风控信息
                                    }
                        }
            还款计划:
              API: projects/:number/projectBills
              RESPONSE：{ 还款列表 }

            投资：
              API: projects/:number/users/:id/investment
              HTTP Verb: POST
              VIEWS: 页面跳转-投资成功

          宏金盈：
            总览
              API: fundsProjects/:number
              RESPONSE： {宏金盈详情信息}

            投资：
              API: fundsProjects/:number/users/:id/investment
              HTTP Verb: POST
              VIEWS: 页面跳转-投资成功
  ### 其他
      关于我们



