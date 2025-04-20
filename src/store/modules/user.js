/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-07-02 22:21:48
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2025-03-29 10:04:40
 * @FilePath: \vue-admin-template\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { login, logout } from '@/api/auth'
import { getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, setRole, removeRole, getRole,
  removeUserId, setAvatar, removeAvatar } from '@/utils/auth'
import { resetRouter } from '@/router'
import { parseJwt } from '@/utils/jwtUtils'
import { connectWebSocket, disconnectWebSocket } from '@/utils/websocket'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        if (response.code === 1) {
          const info = parseJwt(data)
          const user = JSON.parse(info.userInfo)
          // 存储用户id
          setUserId(user.id)
          // 存储当前用户头像
          setAvatar(user.avatar)
          const roleId = user.roleId
          if (roleId === 1) {
            setRole('seeker')
            commit('SET_ROLES', ['seeker'])
            // 建立websocket连接
            connectWebSocket()
          } else if (roleId === 2) {
            setRole('recruiter')
            commit('SET_ROLES', ['recruiter'])
            // 建立websocket连接
            connectWebSocket()
          } else if (roleId === 3) {
            setRole('admin')
            commit('SET_ROLES', ['admin'])
          }
          // 保存头像 这里是解决登录后需要刷新页面才能显示头像
          commit('SET_AVATAR', user.avatar)
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        // 这里保存是解决刷新页面头像不显示
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // removeToken() // must remove  token  first
        // removeRole()
        // removeUserId()
        // removeAvatar()
        localStorage.clear()
        sessionStorage.clear()
        resetRouter()
        commit('RESET_STATE')
        // 如果不是管理员，断开websocket连接
        if (getRole !== 'admin') {
          disconnectWebSocket()
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

