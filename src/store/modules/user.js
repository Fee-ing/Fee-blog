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
      let res = await Request.get(`${API.userAPI}/${options.userid}`, config)
      if (res) {
        commit('setUserData', res)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async viewBlog ({ commit, rootState }, options) {
    try {
      let res = await Request.get(`${API.blogListAPI}`, {params: {where: {userid: options.userid}}})
      if (res && res.results) {
        res.results.forEach(element => {
          element.user = rootState.userInfo
        })
        commit('setBlogList', res.results)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async updateUser ({ dispatch, rootState }, options) {
    try {
      await Request.put(`${API.userAPI}/${rootState.userInfo.objectId}`, options, {headers: {'X-LC-Session': rootState.userInfo.sessionToken}})
      await dispatch('viewUser', {userid: rootState.userInfo.objectId})
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
