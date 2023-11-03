import adminConfig from './admin'
import bookConfig from './book' // 引入书籍管理路由文件
import encyclopediaConfig from './encyclopedia' // 引入书籍管理路由文件

import pluginsConfig from './plugin'
import Utils from '@/lin/util/util'

let homeRouter = [
  {
    title: '主页',
    type: 'view',
    name: 'about',
    route: '/about',
    filePath: 'view/about/about.vue',
    inNav: true,
    icon: 'el-icon-s-home',
    order: 0,
  },
  bookConfig,
  encyclopediaConfig,
  adminConfig,
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'view/log/log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 7,
    permission: ['查询所有日志'],
  },
  // {
  //   title: '日志面板',
  //   type: 'view',
  //   name: Symbol('logdashboard'),
  //   route: '/log-dashboard',
  //   filePath: 'view/home/log-dashboard.vue',
  //   inNav: true,
  //   icon: 'iconfont icon-rizhiguanli',
  //   order: 8
  // },
  {
    title: '日志面板',
    type: 'view',
    name: Symbol('logdashboard'),
    route: '/log-dashboard',
    filePath: 'view/home/log-dashboard.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 2
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: "iconfont icon-rizhiguanli"
  }
];

// 接入插件
const plugins = [...pluginsConfig]
filterPlugin(homeRouter)
homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)
deepReduceName(homeRouter)

export default homeRouter

/**
 * 筛除已经被添加的插件
 */
function filterPlugin(data) {
  if (plugins.length === 0) {
    return;
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1);
    }
    if (data.children) {
      filterPlugin(data.children);
    }
  }
}

/**
 * 使用 Symbol 处理 name 字段, 保证唯一性
 */
function deepReduceName(target) {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item);
    });
    return;
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      target.name = target.name || Utils.getRandomStr()
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item);
      });
    }
  }
}
