import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main'

import Login from './views/login'
import NProgress from 'nprogress'
import * as AuthAction from '../src/api/auth'
import 'nprogress/nprogress.css'




// 404
import error from './views/404'

// 应用过期
import Expired from './views/expired'

NProgress.configure({
  showSpinner: false
})
Vue.use(Router)

const routes = [
  {
    path: '/main',
    component: () => import('./views/newsCenter'),
    redirect: to => {
      return '/main/newsCenter/plate'
    },
    meta: {
      title: '新闻中心'
    },
    children: [
      {
        path: '/main/newsCenter/plate',
        component: () => import('@/views/newsCenter/plate'),
        meta: {
          title: '板块管理'
        }
      },
      {
        path: '/main/newsCenter/column/:id',
        component: () => import('@/views/newsCenter/column'),
        meta: {
          title: '栏目管理'
        },
      },
      {
        path: '/main/newsCenter/column',
        component: () => import('@/views/newsCenter/column'),
        meta: {
          title: '栏目管理'
        },
      },
      {
        path: '/main/newsCenter/column/news/:id',
        component: () => import('@/views/newsCenter/columnNews'),
        meta: {
          title: '栏目新闻'
        }
      },
      {
        path: '/main/newsCenter/news',
        component: () => import('@/views/newsCenter/news'),
        meta: {
          title: '新闻管理'
        }
      },
      {
        path: '/main/newsCenter/news/:type/',
        component: () => import('@/views/newsCenter/addNews'),
        meta: {
          title: '添加新闻'
        }
      },
      {
        path: '/main/newsCenter/news/:type/:id',
        component: () => import('@/views/newsCenter/addNews'),
        meta: {
          title: '编辑新闻'
        }
      },
    ]
  },
  {
    path: '/videoManagement',
    component: () => import('./views/videoManagement'),
    redirect: to => {
      return '/videoManagement/videoSection'
    },
    meta: {
      title: '视频管理'
    },
    children: [
      {
        path: '/videoManagement/videoSection',
        component: () => import('./views/videoManagement/videoSection.vue'),
        meta: {
          title: '视频版块'
        },
      },
      {
        path: '/videoManagement/videoSection/addOrEditSec/:id',
        component: () => import('./views/videoManagement/videoAddOrEditSection.vue'),
        meta: {
          title: '视频版块'
        },
      },
      {
        path: '/videoManagement/videoProgram',
        component: () => import('./views/videoManagement/videoProgram.vue'),
        meta: {
          title: '视频栏目'
        },
      },
      {
        path: '/videoManagement/videoList',
        component: () => import('./views/videoManagement/videoList.vue'),
        meta: {
          title: '视频列表'
        },
      },
      {
        path: '/videoManagement/videoList/addOrEdit/:id',
        component: () => import('./views/videoManagement/videoAddOrEdit.vue'),
        meta: {
          title: '视频列表'
        },
      },
      {
        path: '/videoManagement/videoProgram/addOrEditProgram/:id',
        component: () => import('./views/videoManagement/addOrEditProgram.vue'),
        meta: {
          title: '视频栏目'
        },
      },
      {
        path: '/videoManagement/videoProgram/columnVideo/:id',
        component: () => import('./views/videoManagement/columnVideo.vue'),
        meta: {
          title: '视频栏目'
        },
      },
      // {
    ]
  },
  {
    path: '/commodity',
    component: () => import('@/views/commodity.vue'),
    redirect: to => {
      // return '/commodity/classis'
      return '/commodity/list'
    },
    meta: {
      title: '商品管理'
    },
    children: [
      {
        path: '/commodity/classis',
        component: () => import('@/views/commodity/classis.vue'),
        meta: {
          title: '商品分类'
        }
      },
      {
        path: '/commodity/audited',
        component: () => import('@/views/commodity/audited.vue'),
        meta: {
          title: '待审商品'
        }
      },
      {
        path: '/commodity/audited/info',
        component: () => import('@/views/commodity/auditedInfo.vue'),
        meta: {
          title: '待审商品详情'
        }
      },
      {
        path: '/commodity/list',
        component: () => import('@/views/commodity/commodityList.vue'),
        meta: {
          title: '商品列表'
        }
      },
      {
        path: '/commodity/list/info',
        component: () => import('@/views/commodity/commodityInfo.vue'),
        meta: {
          title: '商品详情'
        }
      },
    ]
  },
  {
    path: '/merchant',
    component: () => import('@/views/merchant.vue'),
    redirect: to => {
      return '/merchant/list'
    },
    meta: {
      title: '商户管理'
    },
    children: [
      {
        path: '/merchant/audited',
        component: () => import('@/views/merchant/audited.vue'),
        meta: {
          title: '待审商户'
        }
      },
      {
        path: '/merchant/audited/info/:id',
        component: () => import('@/views/merchant/auditedInfo.vue'),
        meta: {
          title: '待审商户详情'
        }
      },
      {
        path: '/merchant/list',
        component: () => import('@/views/merchant/merchantList.vue'),
        meta: {
          title: '商户列表'
        }
      },
      {
        path: '/merchant/list/info/:id',
        component: () => import('@/views/merchant/merchantInfo.vue'),
        meta: {
          title: '商户详情'
        }
      },
      {
        path: '/merchant/list/add/:id/:genre',
        component: () => import('@/views/merchant/add.vue'),
        meta: {
          title: '详情完善( 临时 )'
        }
      },
    ]
  },
  {
    path: '/systemManagement',
    component: () => import('@/views/systemManagement.vue'),
    redirect: to => {
      return '/systemManagement/downloadApp'
    },
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: '/systemManagement/downloadApp',
        component: () => import('./views/systemManagement/downloadApp.vue'),
        meta: {
          title: '下载页设置'
        },
      },
      {
        path: '/systemManagement/activity',
        component: () => import('./views/systemManagement/activity.vue'),
        meta: {
          title: '活动设置'
        },
      },
      {
        path: '/systemManagement/activity/info/:id',
        component: () => import('./views/systemManagement/activityInfo.vue'),
        meta: {
          title: '活动详情'
        },
      },
    ]
  },
  {
    // 轮播图管理
    path: '/slideshow',
    component: () => import('./views/slideshow'),
    redirect: to => {
      return '/slideshow/slides'
    },
    meta: {
      title: '轮播图'
    },
    children: [
      {
        path: '/slideshow/slides',
        component: () => import('./views/slideshow/slides.vue'),
        meta: {
          title: '轮播图管理'
        },
      },
      {
        path: '/slideshow/slideshowList/:id',
        component: () => import('./views/slideshow/slideshowList'),
        meta: {
          title: '轮播图列表'
        },
      },
      {
        path: '/slideshow/slideshowList/addOrEdit/:id',
        component: () => import('./views/slideshow/addOrslideshowList'),
        meta: {
          title: '添加轮播图列表'
        },
      },
      {
        path: '/slideshow/slideshowList/lookOrEdit/:lookId',
        component: () => import('./views/slideshow/addOrslideshowList'),
        meta: {
          title: '查看轮播图列表'
        },
      }
    ]
  },
  {
    path: '/imagemanage',
    component: () => import('./views/imagemanage'),
    redirect: to => {
      return '/resources/imageList'
    },
    meta: {
      title: '资源管理'
    },
    children: [
      {
        path: '/resources/imageList',
        component: () => import('./views/resources/imageList'),
        meta: {
          title: '图片列表'
        },
      },
      {
        path: '/resources/videoList',
        component: () => import('./views/resources/videoList'),
        meta: {
          title: '视频列表'
        },
      },
    ]
  },
  {
    path: '/encyclopedias',
    component: () => import('./views/encyclopedias'),
    redirect: to => {
      return '/encyclopedias/column'
    },
    meta: {
      title: '古董百科'
    },
    children: [
      {
        path: '/encyclopedias/column',
        component: () => import('./views/encyclopedias/column'),
        meta: {
          title: '栏目'
        },
      },
      {
        path: '/encyclopedias/list/:id',
        component: () => import('./views/encyclopedias/list'),
        meta: {
          title: '百科',
        },
      },
      {
        path: '/encyclopedias/listInfo',
        component: () => import('./views/encyclopedias/listInfo'),
        meta: {
          title: '百科详情',
        },
      },
    ]
  },
  {
    path:'/auction',
    component: () => import('./views/auction'),
    redirect: to => {
      return '/auction/originList'
    },
    meta: {
      title:'拍卖管理'
    },
    children:[
      {
        path:'/auction/originList',
        component: () => import('./views/auction/originList'),
        meta:{
          title:'拍卖机构'
        },
      },
      {
        path:'/auction/activity/:id',
        component: () => import('./views/auction/activity'),
        meta:{
          title:'专场管理'
        },
      },
      {
        path:'/auction/auctionGoods/:id',
        component: () => import('./views/auction/auctionGoods'),
        meta:{
          title:'拍品管理'
        },
      },
      {
        path:'/auction/auctionGoods/info/:goodsId/:auctionsId',
        component: () => import('./views/auction/auctionGoodsInfo'),
        meta:{
          title:'拍品详情',
        },
      },
      {
        path:'/auction/featureList',
        component: () => import('./views/auction/featureList'),
        meta:{
          title:'特性列表'
        },
      },
    ]
  },
  {
    path: '/famous',
    component: () => import('./views/famous'),
    redirect: to => {
      return '/famous/message'
    },
    meta: {
      title: '名家管理'
    },
    children: [
      {
        path: '/famous/message',
        component: () => import('./views/famous/message'),
        meta: {
          title: '名家信息'
        },
      },
      {
        path: '/famous/message/info/:id',
        component: () => import('./views/famous/messageInfo'),
        meta: {
          title: '名家信息详情'
        },
      },
      {
        path: '/famous/collection/:id',
        component: () => import('./views/famous/collection'),
        meta: {
          title: '名家收藏',
        },
      },
      {
        path: '/famous/collection/info/:celebrityId/:id',
        component: () => import('./views/famous/collectionInfo'),
        meta: {
          title: '名家收藏详情',
        },
      },
      {
        path: '/famous/commodity/:id',
        component: () => import('./views/famous/commodity'),
        meta: {
          title: '名家收藏',
        },
      },
    ]
  },
  {
    path: '/appraisal',
    component: () => import('./views/appraisal'),
    redirect: to => {
      return '/appraisal/list'
    },
    meta: {
      title: '鉴宝管理'
    },
    children: [
      {
        path: '/appraisal/list',
        component: () => import('./views/appraisal/list'),
        meta: {
          title: '鉴宝订单管理'
        },
      },
      {
        path: '/appraisal/list/info/:id',
        component: () => import('./views/appraisal/listInfo'),
        meta: {
          title: '鉴宝订单详情'
        },
      },
      {
        path: '/appraisal/fastAppraisal',
        component: () => import('./views/appraisal/fastAppraisal'),
        meta: {
          title: '极速鉴宝管理'
        },
      },
      {
        path: '/appraisal/expertType',
        component: () => import('./views/appraisal/expertType'),
        meta: {
          title: '专家类型管理'
        },
      },
      {
        path: '/appraisal/expertType/info/:id',
        component: () => import('./views/appraisal/expertTypeInfo'),
        meta: {
          title: '专家类型详情'
        },
      },
      {
        path: '/appraisal/apparisalExpert',
        component: () => import('./views/appraisal/apparisalExpert'),
        meta: {
          title: '鉴宝专家管理'
        },
      },
      {
        path: '/appraisal/apparisalExpert/info/:id',
        component: () => import('./views/appraisal/apparisalExpertInfo'),
        meta: {
          title: '鉴宝专家详情'
        },
      },
      {
        path: '/appraisal/service',
        component: () => import('./views/appraisal/service'),
        meta: {
          title: '机构服务管理'
        },
      },
      {
        path: '/appraisal/appraisalOrgan',
        component: () => import('./views/appraisal/appraisalOrgan'),
        meta: {
          title: '鉴宝机构管理'
        }
      },
      {
        path: '/appraisal/appraisalOrgan/info/:id',
        component: () => import('./views/appraisal/appraisalOrganInfo'),
        meta: {
          title: '鉴宝机构详情'
        }
      }
    ]
  },
  {
    path: '/activity',
    component: () => import('./views/activity.vue'),
    redirect: to => {
      return '/activity/boutikque'
    },
    meta: {
      title: '精品管理'
    },
    children: [
      {
        path: '/activity/boutikque',
        component: () => import('./views/activity/boutikque'),
        meta: {
          title: '精品列表'
        }
      },
      {
        path: '/activity/boutikque/addMetting/:id',
        component: () => import('./views/activity/addMetting.vue'),
        meta: {
          title: '添加精品'
        }
      }, {
        path: '/activity/themeList',
        component: () => import('./views/activity/themeList'),
        meta: {
          title: '主题列表'
        }
      }, {
        path: '/activity/addThemeList/:id',
        component: () => import('./views/activity/addThemeList.vue'),
        meta: {
          title: '添加主题'
        }
      }, {
        path: '/activity/goodsProgram/:id',
        component: () => import('./views/activity/goodsProgram'),
        // component: () => import('./views/activity/commodity'),
        meta: {
          title: '商品管理'
        }
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Main,
      redirect: to => {
        return '/main'
      },
      children: routes
    },
    {
      path: '*',
      component: error,
      meta: {
        title: '页面走丢啦'
      }
    }, , {
      path: '/expired',
      component: Expired,
      meta: {
        title: '应用过期啦'
      }
    },
  ]
})


router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.fullPath == "/login") {
    if (AuthAction.getToken()) {
      next({
        path: '/main'
      })
      // if(new Date().getTime()-AuthAction.getExpires()>=6000*1000){
      //   requestRefreshToken().then(type=>{
      //     type==1?next({path: '/main'}):next({path: '/login'})
      //   })
      // }     
    } else {
      next();
    }
  } else {
    if (AuthAction.getToken()) { //判断本地是否存在access_token
      next()
      // if(new Date().getTime()-AuthAction.getExpires()>=6000*1000){
      //   requestRefreshToken().then(type=>{
      //     type==1?next():next({path: '/login'})
      //   }) 
      // }
    } else {
      next({
        path: '/login'
      })
    }
  }
  return next()
})

router.afterEach(route => {
  NProgress.done()
})

export default router
