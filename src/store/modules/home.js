import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  page: 1,
  per: 10,
  total: 1,
  isEnding: false,
  blogList: []
}

const getters = {
  blogList: (state) => {
    return state.blogList
  },
  isEnding: (state) => {
    return state.isEnding
  }
}

const actions = {
  async getBlogList ({ dispatch, commit, state, rootState }, options) {
    try {
      let config = {
        params: {
          order: '-createdAt',
          limit: state.per,
          skip: 0,
          count: 1
        }
      }
      if (options && options.pageDown) {
        config.params.limit = (state.page + 1) * state.per
        config.params.skip = (state.page) * state.per
        if (state.total <= config.params.skip) {
          commit('setIsEnding', true)
          return true
        }
        commit('setPage', state.page + 1)
      } else {
        commit('setIsEnding', false)
        commit('setPage', 1)
      }
      let res = await Request.get(API.blogListAPI, config)
      if (res && res.results) {
        commit('setTotal', res.count || 1)
        if (rootState.userInfo && rootState.userInfo.objectId) {
          let userInfo = await dispatch('getUser', {userid: rootState.userInfo.objectId}, {root: true})
          commit('setUserInfo', userInfo, {root: true})
        }
        for (let i = 0; i < res.results.length; i++) {
          const element = res.results[i]
          let userRes = await dispatch('getUser', {userid: element.userid}, {root: true})
          element.user = userRes || {}
        }
        if (options && options.pageDown) {
          commit('setBlogList', state.blogList.concat(res.results))
        } else {
          commit('setBlogList', res.results)
        }
      }
      return true
    } catch (error) {
      return false
    }
  }
}

const mutations = {
  setPage (state, num) {
    state.page = num
  },
  setTotal (state, num) {
    state.total = num
  },
  setIsEnding (state, bol) {
    state.isEnding = bol
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
