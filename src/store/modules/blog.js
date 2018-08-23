import { API } from '../../api/index'
import Request from '../../api/request'

const state = {
  blogData: {},
  author: null,
  showDelete: false,
  likeData: {
    list: [],
    isLiked: false
  },
  comments: []
}

const getters = {
  userInfo: (state, getters, rootState) => {
    return rootState.userInfo
  },
  blogData: (state) => {
    return state.blogData
  },
  author: (state) => {
    return state.author
  },
  showDelete: (state) => {
    return state.showDelete
  },
  likeData: (state) => {
    return state.likeData
  },
  comments: (state) => {
    return state.comments.reverse()
  }
}

const actions = {
  async getBlog ({ dispatch, commit, rootState }, options) {
    try {
      commit('initData')
      if (options.type === '1') {
        commit('setAuthor', rootState.userInfo)
      } else if (options.type === '2' && options.blogid) {
        let res = await Request.get(`${API.blogsAPI}`, {params: {where: {blogid: options.blogid}}})
        if (res && res.results && res.results[0]) {
          let data = res.results[0]
          commit('setBlog', data)
          commit('setAuthor', {avatar: data.avatar || '', nickname: data.nickname || ''})
          commit('setShowDelete', data.userid === rootState.userInfo.objectId)
          dispatch('viewLikes', {likeid: data.likeid})
          dispatch('viewCommons', {commentid: data.commentid})
        }
      }
      return true
    } catch (error) {
      return false
    }
  },
  async createBlog ({ commit }, options) {
    try {
      let listRes = await Request.post(API.blogListAPI, Object.assign({}, options.params1, options.user, {type: '1'}))
      let likeRes = await Request.post(API.likesAPI, {blogid: listRes.objectId, users: []})
      let commentRes = await Request.post(API.commentsAPI, {blogid: listRes.objectId, comments: []})
      await Request.post(API.blogsAPI, Object.assign({}, options.params2, options.user, {type: '1', blogid: listRes.objectId, likeid: likeRes.objectId, commentid: commentRes.objectId}))
      return true
    } catch (error) {
      return false
    }
  },
  async updateBlog ({ state }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, Object.assign({}, options.params1, options.user, {type: '2'}))
      await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, Object.assign({}, options.params2, options.user, {blogid: state.blogData.blogid, type: '2'}))
      return true
    } catch (error) {
      return false
    }
  },
  async deleteBlog ({ state }) {
    try {
      await Request.delete(`${API.blogListAPI}/${state.blogData.blogid}`)
      await Request.delete(`${API.blogsAPI}/${state.blogData.objectId}`)
      await Request.delete(`${API.likesAPI}/${state.blogData.likeid}`)
      await Request.delete(`${API.commentsAPI}/${state.blogData.commentid}`)
      return true
    } catch (error) {
      return false
    }
  },
  async viewBlog ({ state }) {
    await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {view: {'__op': 'Increment', 'amount': 1}})
    await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, {view: {'__op': 'Increment', 'amount': 1}})
  },
  async viewLikes ({ commit, rootState }, options) {
    try {
      let res = await Request.get(`${API.likesAPI}/${options.likeid}`)
      if (res && res.users && res.users.length > 0) {
        commit('setLikeList', res.users)
        let bol = false
        for (let i = 0; i < res.users.length; i++) {
          if (res.users[i].userid === rootState.userInfo.objectId) {
            bol = true
            break
          }
        }
        commit('setIsLiked', bol)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async likeBlog ({ state, dispatch }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': 1}})
      await Request.put(`${API.likesAPI}/${state.blogData.likeid}`, {users: {'__op': 'AddUnique', 'objects': [options]}})
      dispatch('viewLikes', {likeid: state.blogData.likeid})
      return true
    } catch (error) {
      return false
    }
  },
  async unlikeBlog ({ state, dispatch }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': -1}})
      await Request.put(`${API.likesAPI}/${state.blogData.likeid}`, {users: {'__op': 'Remove', 'objects': [options]}})
      dispatch('viewLikes', {likeid: state.blogData.likeid})
      return true
    } catch (error) {
      return false
    }
  },
  async viewCommons ({ commit }, options) {
    try {
      let res = await Request.get(`${API.commentsAPI}/${options.commentid}`)
      if (res && res.comments && res.comments.length > 0) {
        commit('setComments', res.comments)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async commentBlog ({ state, dispatch }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {comment: {'__op': 'Increment', 'amount': 1}})
      await Request.put(`${API.commentsAPI}/${state.blogData.commentid}`, {comments: {'__op': 'Add', 'objects': [options]}})
      dispatch('viewCommons', {commentid: state.blogData.commentid})
      return true
    } catch (error) {
      return false
    }
  }
}

const mutations = {
  initData (state) {
    state.blogData = {}
    state.author = null
    state.showDelete = false
    state.likeData = {
      list: [],
      isLiked: false
    }
  },
  setBlog (state, data) {
    state.blogData = data
  },
  setAuthor (state, data) {
    state.author = data
  },
  setShowDelete (state, bol) {
    state.showDelete = bol
  },
  setLikeList (state, list) {
    state.likeData.list = list
  },
  setIsLiked (state, bol) {
    state.likeData.isLiked = bol
  },
  setComments (state, list) {
    state.comments = list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
