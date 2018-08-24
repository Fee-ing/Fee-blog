import { API } from '../api/index'
import Request from '../api/request'

export default {
  async regist ({ dispatch }, options) {
    try {
      await Request.post(API.userAPI, options)
      let res = await dispatch('login', options)
      return res
    } catch (error) {
      return false
    }
  },
  async login ({ commit }, options) {
    try {
      let res = await Request.post(API.loginAPI, options)
      commit('setUserInfo', res)
      return res
    } catch (error) {
      return false
    }
  },
  logout ({ commit }) {
    commit('clearUserInfo')
  }
}
