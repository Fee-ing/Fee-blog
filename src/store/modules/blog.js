import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  blogData: {},
  isAuthor: false,
  collectData: {
    list: [],
    isCollected: false
  },
  likeData: {
    list: [],
    isLiked: false
  },
  commentData: {
    page: 1,
    per: 15,
    total: 1,
    isEnding: false,
    list: []
  }
}

const getters = {
  userInfo: (state, getters, rootState) => {
    return rootState.userInfo
  },
  blogData: (state) => {
    return state.blogData
  },
  isAuthor: (state) => {
    return state.isAuthor
  },
  collectData: (state) => {
    return state.collectData
  },
  likeData: (state) => {
    return state.likeData
  },
  commentData: (state) => {
    return state.commentData
  }
}

const actions = {
  async getBlog ({ dispatch, commit, rootState }, options) {
    try {
      commit('initData')
      if (options.type === '1') {
        commit('setIsAuthor', true)
      } else if (options.type === '2' && options.blogid) {
        let config = {
          params: {
            where: {blogid: options.blogid},
            include: 'user'
          }
        }
        let res = await Request.get(API.blogsAPI, config)
        if (res && res.results && res.results[0]) {
          let data = res.results[0]
          commit('setBlog', data)
          commit('setIsAuthor', (rootState.userInfo && data.user.userId === rootState.userInfo.userId))
          dispatch('viewLikes', {likeid: data.likeid})
          dispatch('viewCommons', {commentid: data.commentid})
          dispatch('viewCollects', {collectid: data.collectid})
        }
      }
      return true
    } catch (error) {
      return false
    }
  },
  async createBlog ({ rootState }, options) {
    try {
      let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
      let user = {
        '__type': 'Pointer',
        'className': 'userInfo',
        'objectId': infoId
      }
      let blogListRes = await Request.post(API.blogListAPI, Object.assign({}, options.params1, {type: '1', user}))
      await Request.post(API.blogsAPI, Object.assign({}, options.params2, {type: '1', user, blogid: blogListRes.objectId}))
      return true
    } catch (error) {
      return false
    }
  },
  async updateBlog ({ state }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, Object.assign({}, options.params1, {type: '2'}))
      await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, Object.assign({}, options.params2, {type: '2'}))
      return true
    } catch (error) {
      return false
    }
  },
  async deleteBlog ({ state }) {
    try {
      await Request.delete(`${API.blogListAPI}/${state.blogData.blogid}`)
      await Request.delete(`${API.blogsAPI}/${state.blogData.objectId}`)
      return true
    } catch (error) {
      return false
    }
  },
  async viewBlog ({ state }) {
    await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {view: {'__op': 'Increment', 'amount': 1}})
    await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, {view: {'__op': 'Increment', 'amount': 1}})
  },
  async viewCollects ({ commit, state, rootState }) {
    try {
      let config = {
        params: {
          where: {
            blog: {
              '__type': 'Pointer',
              'className': 'blogList',
              'objectId': state.blogData.blogid
            }
          },
          include: 'user',
          order: '-createdAt'
        }
      }
      let res = await Request.get(API.collectsAPI, config)
      let list = (res && res.results) || []
      let bol = false
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (rootState.userInfo && element.user.userId === rootState.userInfo.userId) {
          bol = true
        }
      }
      commit('setCollectList', list)
      commit('setIsCollected', bol)
      return true
    } catch (error) {
      return false
    }
  },
  async collectBlog ({ dispatch, state, rootState }) {
    let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
    let data = {
      blog: {
        '__type': 'Pointer',
        'className': 'blogList',
        'objectId': state.blogData.blogid
      },
      user: {
        '__type': 'Pointer',
        'className': 'userInfo',
        'objectId': infoId
      }
    }
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {collect: {'__op': 'Increment', 'amount': 1}})
      await Request.post(API.collectsAPI, data)
      dispatch('viewCollects')
      return true
    } catch (error) {
      return false
    }
  },
  async uncollectBlog ({ dispatch, state, rootState }) {
    try {
      let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
      let config = {
        params: {
          where: {
            blog: {
              '__type': 'Pointer',
              'className': 'blogList',
              'objectId': state.blogData.blogid
            },
            user: {
              '__type': 'Pointer',
              'className': 'userInfo',
              'objectId': infoId
            }
          }
        }
      }
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {collect: {'__op': 'Increment', 'amount': -1}})
      let collectRes = await Request.get(API.collectsAPI, config)
      let res = (collectRes && collectRes.results && collectRes.results[0]) || ''
      await Request.delete(`${API.collectsAPI}/${res.objectId}`)
      dispatch('viewCollects')
      return true
    } catch (error) {
      return false
    }
  },
  async viewLikes ({ commit, state, rootState }) {
    try {
      let config = {
        params: {
          where: {
            blog: {
              '__type': 'Pointer',
              'className': 'blogList',
              'objectId': state.blogData.blogid
            }
          },
          include: 'user',
          order: '-createdAt'
        }
      }
      let res = await Request.get(API.likesAPI, config)
      let list = (res && res.results) || []
      let bol = false
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (rootState.userInfo && element.user.userId === rootState.userInfo.userId) {
          bol = true
        }
      }
      commit('setLikeList', list)
      commit('setIsLiked', bol)
      return true
    } catch (error) {
      return false
    }
  },
  async likeBlog ({ dispatch, state, rootState }) {
    try {
      let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
      let data = {
        blog: {
          '__type': 'Pointer',
          'className': 'blogList',
          'objectId': state.blogData.blogid
        },
        user: {
          '__type': 'Pointer',
          'className': 'userInfo',
          'objectId': infoId
        }
      }
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': 1}})
      await Request.post(API.likesAPI, data)
      dispatch('viewLikes')
      return true
    } catch (error) {
      return false
    }
  },
  async unlikeBlog ({ dispatch, state, rootState }) {
    try {
      let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
      let config = {
        params: {
          where: {
            blog: {
              '__type': 'Pointer',
              'className': 'blogList',
              'objectId': state.blogData.blogid
            },
            user: {
              '__type': 'Pointer',
              'className': 'userInfo',
              'objectId': infoId
            }
          }
        }
      }
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': -1}})
      let likeRes = await Request.get(API.likesAPI, config)
      let res = (likeRes && likeRes.results && likeRes.results[0]) || ''
      await Request.delete(`${API.likesAPI}/${res.objectId}`)
      dispatch('viewLikes')
      return true
    } catch (error) {
      return false
    }
  },
  async viewCommons ({ commit, state }, options) {
    try {
      let config = {
        params: {
          where: {
            blog: {
              '__type': 'Pointer',
              'className': 'blogList',
              'objectId': state.blogData.blogid
            }
          },
          include: 'user',
          order: '-createdAt',
          limit: state.commentData.per,
          skip: 0,
          count: 1
        }
      }
      if (options && options.pageDown) {
        config.params.limit = (state.commentData.page + 1) * state.commentData.per
        config.params.skip = (state.commentData.page) * state.commentData.per
        if (state.commentData.total <= config.params.skip) {
          commit('setCommentEnding', true)
          return true
        }
        commit('setCommentPage', state.commentData.page + 1)
      } else {
        commit('setCommentEnding', false)
        commit('setCommentPage', 1)
      }
      let res = await Request.get(API.commentsAPI, config)
      commit('setCommentTotal', res.count || 0)
      let list = (res && res.results) || []
      if (options && options.pageDown) {
        commit('setCommentList', state.commentData.list.concat(list))
      } else {
        commit('setCommentList', list)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async commentBlog ({ dispatch, state, rootState }, options) {
    try {
      let infoId = (rootState.userInfo && rootState.userInfo.infoId) || ''
      let data = {
        blog: {
          '__type': 'Pointer',
          'className': 'blogList',
          'objectId': state.blogData.blogid
        },
        user: {
          '__type': 'Pointer',
          'className': 'userInfo',
          'objectId': infoId
        },
        comment: options.comment
      }
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {comment: {'__op': 'Increment', 'amount': 1}})
      await Request.post(API.commentsAPI, data)
      dispatch('viewCommons')
      return true
    } catch (error) {
      return false
    }
  }
}

const mutations = {
  initData (state) {
    state.blogData = {}
    state.isAuthor = false
    state.likeData = {
      list: [],
      isLiked: false
    }
    state.collectData = {
      list: [],
      isCollected: false
    }
    state.comments = []
  },
  setBlog (state, data) {
    state.blogData = data
  },
  setIsAuthor (state, bol) {
    state.isAuthor = bol
  },
  setCollectList (state, list) {
    state.collectData.list = list
  },
  setIsCollected (state, bol) {
    state.collectData.isCollected = bol
  },
  setLikeList (state, list) {
    state.likeData.list = list
  },
  setIsLiked (state, bol) {
    state.likeData.isLiked = bol
  },
  setCommentList (state, list) {
    state.commentData.list = list
  },
  setCommentPage (state, num) {
    state.commentData.page = num
  },
  setCommentTotal (state, num) {
    state.commentData.total = num
  },
  setCommentEnding (state, bol) {
    state.commentData.isEnding = bol
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
