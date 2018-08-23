import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  blogList: []
}

const getters = {
  blogList: (state) => {
    return state.blogList
  }
}

const actions = {
  async getBlogList ({ commit }) {
    try {
      let config = {
        params: {
          order: '-createdAt',
          limit: 20,
          skip: 0,
          keys: '-comments'
        }
      }
      let res = await Request.get(API.blogListAPI, config)
      if (res && res.results) {
        commit('setBlogList', res.results)
      }
      return res
    } catch (error) {
      return false
    }
  }
}

const mutations = {
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
