import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  blogList: []
}

const getters = {
  blogList: state => {
    return state.blogList
  }
}

const actions = {
  getBlogList ({ commit }, options) {
    let config = {
      params: {
        order: '-createdAt',
        limit: 20,
        skip: 0,
        keys: '-comments'
      }
    }
    Request.get(API.blogAPI, config).then(data => {
      console.log(data)
      commit('setBlogList', data)
    })
  }
}

const mutations = {
  setBlogList (state, data) {
    state.blogList = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
