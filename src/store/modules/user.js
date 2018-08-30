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
  async getUser ({ commit, rootState }, options) {
    try {
      commit('initData')
      let bol = false
      let config = {params: {keys: '-email,-username'}}
      if (rootState.userInfo && options.userId === rootState.userInfo.userId) {
        bol = true
        config = {}
      }
      commit('setIsAuthor', bol)
      let res = await Request.get(`${API.userAPI}/${options.userId}`, config)
      if (res) {
        commit('setUserData', res)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async viewBlog ({ commit, state }, options) {
    try {
      let config = {
        params: {
          where: {
            user: {
              '__type': 'Pointer',
              'className': 'userInfo',
              'objectId': options.infoId
            }
          },
          include: 'user',
          order: '-createdAt',
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
      let res = null
      let list = []
      if (options.blogType === '1') {
        res = await Request.get(API.blogListAPI, config)
        list = (res && res.results) || []
      } else if (options.blogType === '2') {
        config.params.include = 'blog.user'
        res = await Request.get(API.collectsAPI, config)
        let arr = (res && res.results) || []
        arr.forEach(element => {
          if (element.paragraph) {
            list.push(element.blog)
          }
        })
      } else if (options.blogType === '3') {
        config.params.include = 'blog.user'
        res = await Request.get(API.likesAPI, config)
        let arr = (res && res.results) || []
        arr.forEach(element => {
          if (element.paragraph) {
            list.push(element.blog)
          }
        })
      }
      commit('setTotal', res.count || 1)
      if (options.pageDown) {
        commit('setBlogList', state.blogList.concat(list))
      } else {
        commit('setBlogList', list)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async updateUser ({ dispatch, rootState }, options) {
    try {
      await Request.put(`${API.userAPI}/${rootState.userInfo.userId}`, options, {headers: {'X-LC-Session': rootState.userInfo.sessionToken}})
      await Request.put(`${API.userInfoAPI}/${rootState.userInfo.infoId}`, {nickname: options.nickname, avatar: options.avatar, sign: options.sign})
      await dispatch('getUser', {userId: rootState.userInfo.userId})
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
