import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { connectWebSocket, sendMessage } from '@/utils/websocket'

// import { createApp } from 'vue'
// import htmlToPdf from './utils/htmlToPdf'

// const app = createApp(App)
// htmlToPdf(app) // 注册htmlToPdf方法
// app.mount('#app')

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 路由守卫，在路由切换前判断是否连接 WebSocket
router.beforeEach((to, from, next) => {
  const isLoginOrRegister = ['login', 'register'].includes(to.name)
  // 页面加载时 不是登录页或注册页 尝试重新连接
  if (!isLoginOrRegister) {
    connectWebSocket()
  }
  next()
})

// 将 WebSocket 相关方法挂载到 Vue 原型上
Vue.prototype.$connectWebSocket = connectWebSocket
Vue.prototype.$sendMessage = sendMessage
// Vue.prototype.$setUserId = setUserId

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
