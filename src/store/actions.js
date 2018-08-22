import { API } from '../api/index'
import Request from '../api/request'
import { setCookie, delCookie } from '../plugins/func'

export default {
  async regist ({ dispatch }, options) {
    try {
      await Request.post(API.userAPI, options)
      let data = await dispatch('login', options)
      return data
    } catch (error) {
      return false
    }
  },
  async login ({ commit }, options) {
    try {
      let data = await Request.post(API.loginAPI, options)
      commit('setUserInfo', data)
      setCookie('Blog_userInfo', JSON.stringify(data))
      return data
    } catch (error) {
      return false
    }
  },
  logout ({ commit }) {
    commit('clearUserInfo')
    delCookie('Blog_userInfo')
  }
}
