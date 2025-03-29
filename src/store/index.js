/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-07-02 22:21:48
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2025-03-26 14:25:45
 * @FilePath: \online-recruitment-system-frontend\src\store\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
