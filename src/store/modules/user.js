import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  isAuthor: false,
  userData: {},
  blogList: [],
  pageData: {
    page: 1,
    per: 10,
    total: 1,
    isEnding: false
  }
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
  isEnding: (state) => {
    return state.pageData.isEnding
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
      if (rootState.userInfo && options.userid === rootState.userInfo.objectId) {
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
  async viewBlog ({ dispatch, commit, state }, options) {
    try {
      let config = {
        params: {
          where: {userid: options.userid},
          limit: state.pageData.per,
          skip: 0,
          count: 1
        }
      }
      if (options.pageDown) {
        config.params.limit = (state.pageData.page + 1) * state.pageData.per
        config.params.skip = (state.pageData.page) * state.pageData.per
        if (state.pageData.total <= config.params.skip) {
          commit('setIsEnding', true)
          return true
        }
        commit('setPage', state.pageData.page + 1)
      } else {
        commit('setIsEnding', false)
        commit('setPage', 1)
      }
      let res = await Request.get(`${API.blogListAPI}`, config)
      if (res && res.results) {
        commit('setTotal', res.count || 1)
        for (let i = 0; i < res.results.length; i++) {
          const element = res.results[i]
          let userRes = await dispatch('getUser', {userid: element.userid}, {root: true})
          element.user = userRes || {}
        }
        if (options.pageDown) {
          commit('setBlogList', state.blogList.concat(res.results))
        } else {
          commit('setBlogList', res.results)
        }
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
  setPage (state, num) {
    state.pageData.page = num
  },
  setTotal (state, num) {
    state.pageData.total = num
  },
  setIsEnding (state, bol) {
    state.pageData.isEnding = bol
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
