import { API } from '../api/index'
import Request from '../api/request'

export default {
  async regist ({ commit }, options) {
    try {
      let userInfo = {
        nickname: options.nickname,
        avatar: ''
      }
      let userRes = await Request.post(API.userAPI, options)
      userInfo.userId = userRes.objectId || ''
      userInfo.sessionToken = userRes.sessionToken || ''
      let userinfoRes = await Request.post(API.userInfoAPI, Object.assign({userId: userInfo.userId}, userInfo))
      userInfo.infoId = userinfoRes.objectId || ''
      commit('setUserInfo', userInfo)
      return true
    } catch (error) {
      return false
    }
  },
  async login ({ commit }, options) {
    try {
      let userRes = await Request.post(API.loginAPI, options)
      let userInfo = {
        userId: userRes.objectId || '',
        sessionToken: userRes.sessionToken || '',
        nickname: userRes.nickname,
        avatar: userRes.avatar || ''
      }
      let userinfoRes = await Request.get(API.userInfoAPI, {params: {where: {userId: userInfo.userId}}})
      userInfo.infoId = userinfoRes.results[0].objectId || ''
      commit('setUserInfo', userInfo)
      return true
    } catch (error) {
      return false
    }
  },
  logout ({ commit }) {
    commit('clearUserInfo')
  }
}
