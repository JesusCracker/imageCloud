export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/forgot', component: './User/Forgot' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/filmReading',
    icon: 'setting',
    name: 'filmReading',
    routes: [
      {
        path: '/filmReading/readingPictures/:id/:type',
        name: 'readingPicturesRead',
        component: './FilmReadingManagement/readingPictures/index'
      }
    ],
  },
  {
    path: '/helpCenter/helpCenter',
    name: 'helpCenterPage',
    component: './HelpCenter/HelpCenter',
    routes: [
      {
        path: '/helpCenter/helpCenter/fillReport',
        name: 'reading',
        component: './HelpCenter/HelpPages/FillReport',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin'],
    routes: [
      // dashboard
      // { path: '/', redirect: '/dashboard/analysis' },
      { path: '/', redirect: '/system/userManagement' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // 审批管理
      {
        path: '/approvalManagement',
        icon: 'table',
        name: 'approvalmanagement',
        component: './approvalManagement/ApprovalManagement'
      },
      // 账户管理
      {
        path: '/accountInfo',
        icon: 'table',
        name: 'accountinfo',
        component: './AccountInfo/AccountInfo',
        hideInMenu: true,
        hideChildrenInMenu: true
      },
      // 报告管理
      {
        path: '/reportManagement',
        icon: 'settings',
        name: 'reportmanagement',
        component: './ReportManagement/ReportManagement'
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        path: '/dataAnalysis',
        icon: 'stockOutlined',
        name: 'dataAnalysis',
        routes: [
          {
            path: '/dataAnalysis/loginLog',
            name: 'loginLogList',
            component: './DataAnalysis/LoginLogList',
            routes: [
              {

              },
            ],
          },
        ],
      },
      {
        path: '/system',
        icon: 'setting',
        name: 'system',
        routes: [
          {
            path: '/system/userManagement',
            name: 'userList',
            component: './System/UserManagementList',
            routes: [
              {

              },
            ],
          },
          {
            path: '/system/authManagement',
            name: 'authList',
            component: './System/AuthManagementList',
            routes: [
              {

              },
            ],
          },
          {
            path: '/system/roleManagement',
            name: 'roleList',
            component: './System/RoleManagementList',
            routes: [
              {},
            ],
          },
          {
            path: '/system/zoneManagement',
            name: 'zoneList',
            component: './System/ZoneManagementList',
            routes: [
              {},
            ],
          },
          {
            path: '/system/systemInformation',
            name: 'systemInformation',
            component: './System/SystemInformation',
            routes: [
              {

              },
            ],
          },

          {
            path: '/system/organManagement',
            name: 'organList',
            component: './Organ/OrganizationMange',
            routes: [
              {

              },
            ],
          },
        ],
      },
      {
        path: '/reading',
        icon: 'setting',
        name: 'reading',
        routes: [
          {
            path: '/reading/screenReading',
            name: 'screenList',
            component: './FilmReadingManagement/screening/ScreenReadingList',
            routes: [
              {

              },
            ],
          },
          {
            path: '/reading/scientificScreening',
            name: 'scientificScreeningList',
            component: './FilmReadingManagement/scientificResearch/ScientificScreeningList',
            routes: [
              {

              },
            ],
          }
        ],
      },
      {
        path: '/helpCenter',
        icon: 'question',
        name: 'helpCenter',
        routes: [
          {
            path: '/helpCenter/productSuggestionPage',
            name: 'productSuggestionPage',
            component: './HelpCenter/ProductSuggestionPage',
            routes: [
              {

              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
