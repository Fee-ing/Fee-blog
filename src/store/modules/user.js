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
      console.log(rootState.userInfo)
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
  async viewBlog ({ commit }, options) {
    try {
      let res = await Request.get(`${API.blogListAPI}`, {params: {where: {userid: options.userid}}})
      if (res && res.results) {
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
      await dispatch('undateBlogList', options)
      await dispatch('viewUser', {userid: rootState.userInfo.objectId})
      return true
    } catch (error) {
      return false
    }
  },
  async undateBlogList ({ dispatch, commit, state, rootState }, options) {
    try {
      let params = {}
      if (options.nickname !== rootState.userInfo.nickname) {
        params.nickname = options.nickname
      }
      if (options.avatar !== rootState.userInfo.avatar) {
        params.avatar = options.avatar
      }
      if (Object.keys(params).length <= 0) {
        return true
      }
      commit('setUserInfo', params, {root: true})
      let requests = []
      state.blogList.forEach(element => {
        requests.push({
          method: 'PUT',
          path: `/1.1/classes/blogList/${element.objectId}`,
          body: params
        })
      })
      await Request.post(`${API.baseAPI}/1.1/batch`, {requests: requests})
      await dispatch('undateBlogs', params)
      return true
    } catch (error) {
      return false
    }
  },
  async undateBlogs ({ rootState }, options) {
    try {
      let blogsRes = await Request.get(`${API.blogsAPI}`, {params: {where: {userid: rootState.userInfo.objectId}}})
      let blogs = (blogsRes && blogsRes.results) || []
      let requests = []
      blogs.forEach(element => {
        requests.push({
          method: 'PUT',
          path: `/1.1/classes/blogs/${element.objectId}`,
          body: options
        })
      })
      await Request.post(`${API.baseAPI}/1.1/batch`, {requests: requests})
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
