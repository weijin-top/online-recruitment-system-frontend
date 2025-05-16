import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/userInfo',
    hidden: true,
    children: [{
      path: 'userInfo',
      name: 'UserInfo',
      component: () => import('@/views/homePage/index'),
      meta: { title: '个人主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/message',
    hidden: true,
    component: Layout,
    redirect: '/message/msgIndex',
    children: [{
      path: 'msgIndex',
      name: 'MsgIndex',
      component: () => import('@/views/message/indx'),
      meta: { title: '消息', icon: 'dashboard' }
    }]
  },
  {
    path: 'stat',
    component: Layout,
    redirect: '/stat/index',
    hidden: false,
    meta: { roles: ['admin'] },
    children: [{
      path: '/index',
      name: 'StatIndex',
      component: () => import('@/views/stat/index'),
      meta: { title: '首页', icon: 'dashboard', roles: ['admin'] }
    }]
  },
  {
    path: 'user',
    component: Layout,
    redirect: '/user/index',
    hidden: false,
    meta: { roles: ['admin'] },
    children: [{
      path: '/user',
      name: 'UserIndex',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'el-icon-user-solid', roles: ['admin'] }
    }]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company/audited',
    name: 'Company',
    meta: { title: '企业审核', icon: 'el-icon-s-help', roles: ['admin'] },
    children: [
      {
        path: 'companyAudited',
        name: 'CompanyAudited',
        component: () => import('@/views/company/audited'),
        meta: { title: '未审核', icon: 'el-icon-circle-plus-outline', roles: ['admin'] }
      },
      {
        path: 'companyApprove',
        name: 'CompanyApprove',
        component: () => import('@/views/company/approve'),
        meta: { title: '审核通过', icon: 'el-icon-circle-check', roles: ['admin'] }
      },
      {
        path: 'companyUnapprove',
        name: 'CompanyUnapprove',
        component: () => import('@/views/company/unapprove'),
        meta: { title: '审核不通过', icon: 'el-icon-circle-close', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/position',
    component: Layout,
    redirect: '/position/audited',
    name: 'Position',
    meta: { title: '职位审核', icon: 'el-icon-shopping-bag-1', roles: ['admin'] },
    children: [
      {
        path: 'positionAudited',
        name: 'PositionAudited',
        component: () => import('@/views/position/audited'),
        meta: { title: '未审核', icon: 'el-icon-circle-plus-outline', roles: ['admin'] }
      },
      {
        path: 'positionApprove',
        name: 'PositionApprove',
        component: () => import('@/views/position/approve'),
        meta: { title: '审核通过', icon: 'el-icon-circle-check', roles: ['admin'] }
      },
      {
        path: 'positionUnapprove',
        name: 'PositionUnapprove',
        component: () => import('@/views/position/unapprove'),
        meta: { title: '审核不通过', icon: 'el-icon-circle-close', roles: ['admin'] }
      },
      {
        path: 'positionDetail',
        name: 'PositionDetail',
        hidden: true,
        component: () => import('@/views/seeker/positionDetail'),
        meta: { title: '职位详情', icon: 'el-icon-office-building', roles: ['seeker'] }
      }
    ]
  },
  {
    path: 'type',
    component: Layout,
    redirect: '/typeManagerment',
    hidden: false,
    meta: { roles: ['admin'] },
    children: [{
      path: '/type/typeManagerment',
      name: 'TypeManagerment',
      component: () => import('@/views/typeManagerment/index'),
      meta: { title: '职位类别管理', icon: 'el-icon-s-grid', roles: ['admin'] }
    }]
  },
  {
    path: '/positionManagerment',
    component: Layout,
    redirect: '/publishPosition',
    name: 'PositionManagerment',
    meta: { title: '职位管理', icon: 'el-icon-s-help', roles: ['recruiter'] },
    children: [
      {
        path: 'publishPosition',
        name: 'PublishPosition',
        hidden: true,
        component: () => import('@/views/positionManagerment/publishPosition'),
        meta: { title: '发布职位', icon: 'el-icon-office-building', roles: ['recruiter'] }
      },
      {
        path: 'publishedPosition',
        name: 'PublishedPosition',
        component: () => import('@/views/positionManagerment/index'),
        meta: { title: '已发布的职位', icon: 'el-icon-c-scale-to-original', roles: ['recruiter'] }
      }
    ]
  },
  {
    path: '/corporation',
    component: Layout,
    redirect: '/myCorporation',
    meta: { roles: ['recruiter'] },
    children: [{
      path: 'myCorporation',
      name: 'MyCorporation',
      component: () => import('@/views/corporation/myCorporation'),
      meta: { title: '我的企业', icon: 'el-icon-office-building', roles: ['recruiter'] }
    }]
  },
  // 求职者
  {
    path: '/seeker',
    component: Layout,
    redirect: '/seeker/seekerIndex',
    name: 'Seeker',
    meta: { title: '求职首页', icon: 'el-icon-s-help', roles: ['seeker'] },
    children: [
      {
        path: 'seekerIndex',
        name: 'SeekerIndex',
        hidden: false,
        component: () => import('@/views/seeker/index'),
        meta: { title: '首页', icon: 'el-icon-office-building', roles: ['seeker'] }
      }
      // {
      //   path: 'publishedPosition',
      //   name: 'PublishedPosition',
      //   component: () => import('@/views/positionManagerment/index'),
      //   meta: { title: '已发布的职位', icon: 'el-icon-c-scale-to-original', roles: ['seeker'] }
      // }
    ]
  },
  {
    path: '/resume',
    component: Layout,
    redirect: '/resume/myResume',
    name: 'Resume',
    meta: { title: '简历信息', icon: 'el-icon-s-help', roles: ['seeker'] },
    children: [
      {
        path: 'myResume',
        name: 'MyResume',
        hidden: false,
        component: () => import('@/views/seeker/myResume'),
        meta: { title: '我的简历', icon: 'el-icon-office-building', roles: ['seeker'] }
      }
      // {
      //   path: 'publishedPosition',
      //   name: 'PublishedPosition',
      //   component: () => import('@/views/positionManagerment/index'),
      //   meta: { title: '已发布的职位', icon: 'el-icon-c-scale-to-original', roles: ['seeker'] }
      // }
    ]
  },
  // {
  //   path: '/position',
  //   component: Layout,
  //   redirect: '/position/positionDetail',
  //   name: 'Search',
  //   meta: { title: '职位搜索', icon: 'el-icon-s-help', roles: ['seeker'] },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'positionDetail',
  //       name: 'PositionDetail',
  //       hidden: true,
  //       component: () => import('@/views/seeker/positionDetail'),
  //       meta: { title: '职位详情', icon: 'el-icon-office-building', roles: ['seeker'] }
  //     }
  //     // {
  //     //   path: 'publishedPosition',
  //     //   name: 'PublishedPosition',
  //     //   component: () => import('@/views/positionManagerment/index'),
  //     //   meta: { title: '已发布的职位', icon: 'el-icon-c-scale-to-original', roles: ['seeker'] }
  //     // }
  //   ]
  // },
  {
    path: '/dorpInBox',
    component: Layout,
    redirect: '/dorpInBox/delivered',
    name: 'DorpInBox',
    meta: { title: '投递箱', icon: 'el-icon-s-help', roles: ['seeker'] },
    children: [
      {
        path: 'notViewed',
        name: 'NotViewed',
        hidden: false,
        component: () => import('@/views/seeker/dorpInBox/notViewed'),
        meta: { title: '未查看', icon: 'el-icon-office-building', roles: ['seeker'] }
      },
      {
        path: 'viewed',
        name: 'Viewed',
        hidden: false,
        component: () => import('@/views/seeker/dorpInBox/viewed'),
        meta: { title: '已查看', icon: 'el-icon-office-building', roles: ['seeker'] }
      },
      {
        path: 'interested',
        name: 'Interested',
        hidden: false,
        component: () => import('@/views/seeker/dorpInBox/interested'),
        meta: { title: '感兴趣', icon: 'el-icon-office-building', roles: ['seeker'] }
      },
      {
        path: 'interview',
        name: 'Interview',
        hidden: false,
        component: () => import('@/views/seeker/dorpInBox/interview'),
        meta: { title: '约面试', icon: 'el-icon-office-building', roles: ['seeker'] }
      }
    ]
  },
  {
    path: '/interview',
    component: Layout,
    redirect: '/interview/myInterview',
    name: 'Interview',
    meta: { title: '面试信息', icon: 'el-icon-s-help', roles: ['seeker'] },
    children: [
      {
        path: 'myInterview',
        name: 'MyInterview',
        hidden: false,
        component: () => import('@/views/seeker/myInterview'),
        meta: { title: '我的面试', icon: 'el-icon-office-building', roles: ['seeker'] }
      }
      // {
      //   path: 'publishedPosition',
      //   name: 'PublishedPosition',
      //   component: () => import('@/views/positionManagerment/index'),
      //   meta: { title: '已发布的职位', icon: 'el-icon-c-scale-to-original', roles: ['seeker'] }
      // }
    ]
  },
  {
    path: '/deliveryManagerment',
    component: Layout,
    redirect: '/deliveryManagerment/untreated',
    name: 'DeliveryManagerment',
    meta: { title: '投递管理', icon: 'el-icon-s-promotion', roles: ['recruiter'] },
    children: [
      {
        path: 'untreated',
        name: 'Untreated',
        hidden: false,
        component: () => import('@/views/deliveryManagerment/untreated'),
        meta: { title: `未处理`, icon: 'el-icon-document', roles: ['recruiter'] }
      },
      {
        path: 'viewed',
        name: 'Viewed',
        hidden: false,
        component: () => import('@/views/deliveryManagerment/viewed'),
        meta: { title: '已查看', icon: 'el-icon-document-checked', roles: ['recruiter'] }
      },
      {
        path: 'interested',
        name: 'Interested',
        hidden: false,
        component: () => import('@/views/deliveryManagerment/interested'),
        meta: { title: '感兴趣', icon: 'el-icon-document-add', roles: ['recruiter'] }
      },
      {
        path: 'inviteInterview',
        name: 'InviteInterview',
        hidden: false,
        component: () => import('@/views/deliveryManagerment/inviteInterview'),
        meta: { title: '邀约面试', icon: 'el-icon-phone', roles: ['recruiter'] }
      }
    ]
  },

  {
    path: '/interviewManagerment',
    component: Layout,
    redirect: '/interviewManagerment/interviewResult',
    name: 'InterviewManagerment',
    meta: { title: '面试管理', icon: 'nested', roles: ['recruiter'] },
    children: [
      {
        path: 'undisposed',
        name: 'Undisposed',
        hidden: false,
        component: () => import('@/views/interviewManagerment/undisposed'),
        meta: { title: `未处理`, icon: 'el-icon-document', roles: ['recruiter'] }
      },
      {
        path: 'interviewResult',
        name: 'InterviewResult',
        hidden: false,
        component: () => import('@/views/interviewManagerment/interviewResult'),
        meta: { title: '面试结果', icon: 'el-icon-document-checked', roles: ['recruiter'] }
      }
      // {
      //   path: 'interested',
      //   name: 'Interested',
      //   hidden: false,
      //   component: () => import('@/views/deliveryManagerment/interested'),
      //   meta: { title: '感兴趣', icon: 'el-icon-c-scale-to-original', roles: ['recruiter'] }
      // },
      // {
      //   path: 'inviteInterview',
      //   name: 'InviteInterview',
      //   hidden: false,
      //   component: () => import('@/views/deliveryManagerment/inviteInterview'),
      //   meta: { title: '邀约面试', icon: 'el-icon-c-scale-to-original', roles: ['recruiter'] }
      // }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
// export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
