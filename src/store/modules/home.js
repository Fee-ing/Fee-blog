import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
}

const getters = {
}

const actions = {
  async getBlogList ({ commit }, options) {
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
      return res
    } catch (error) {
      return false
    }
  }
}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
