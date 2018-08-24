import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  isAuthor: false,
  userData: {},
  blogList: []
}

const getters = {
  userInfo: (state, getters, rootState) => {
    return rootState.userInfo
  },
  userData: (state) => {
    return state.userData
  },
  blogList: (state) => {
    return state.blogList
  },
  isAuthor: (state) => {
    return state.isAuthor
  }
}

const actions = {
  async viewUser ({ commit, rootState }, options) {
    try {
      commit('initData')
      let bol = false
      let config = {params: {keys: '-email,-username'}}
      if (options.userid === rootState.userInfo.objectId) {
        bol = true
        config = {}
      }
      commit('setIsAuthor', bol)
      let userRes = await Request.get(`${API.userAPI}/${options.userid}`, config)
      let blogRes = await Request.get(`${API.blogListAPI}`, {params: {where: {userid: options.userid}}})
      if (blogRes && blogRes.results) {
        commit('setBlogList', blogRes.results)
      }
      if (userRes) {
        commit('setUserData', userRes)
        // if (bol) {
        //   commit('setUserInfo', userRes, { root: true })
        // }
      }
      return true
    } catch (error) {
      return false
    }
  }
}

const mutations = {
  initData (state) {
    state.userData = {}
    state.blogList = []
    state.isAuthor = false
  },
  setUserData (state, data) {
    state.userData = data
  },
  setIsAuthor (state, bol) {
    state.isAuthor = bol
  },
  setBlogList (state, list) {
    state.blogList = list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
