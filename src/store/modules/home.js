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
          count: 1,
          include: 'user'
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
      if (rootState.userInfo && rootState.userInfo.infoId) {
        let userRes = await Request.get(`${API.userInfoAPI}/${rootState.userInfo.infoId}`, {params: {keys: 'nickname,avatar'}})
        commit('setUserInfo', {nickname: userRes.nickname, avatar: userRes.avatar}, {root: true})
      }
      let blogListRes = await Request.get(API.blogListAPI, config)
      if (blogListRes && blogListRes.results) {
        commit('setTotal', blogListRes.count || 1)
        if (options && options.pageDown) {
          commit('setBlogList', state.blogList.concat(blogListRes.results))
        } else {
          commit('setBlogList', blogListRes.results)
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
