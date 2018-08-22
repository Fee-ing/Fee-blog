import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
}

const getters = {
}

const actions = {
  async createBlog ({ commit }, options) {
    try {
      let res = await Request.post(API.blogListAPI, Object.assign({}, options.params1, options.user))
      await Request.post(API.blogsAPI, Object.assign({}, options.params2, options.user, {blogid: res.objectId}))
      return true
    } catch (error) {
      return false
    }
  },
  async updateBlog ({ commit }, options) {
    try {
      let res = await Request.put(`${API.blogListAPI}/${options.id}`, options)
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
