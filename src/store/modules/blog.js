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
  collectData: {
    list: [],
    isCollected: false
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
  collectData: (state) => {
    return state.collectData
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
          let userRes = await dispatch('getUser', {userid: data.userid}, {root: true})
          commit('setBlog', data)
          commit('setAuthor', (userRes || {}))
          commit('setShowDelete', (rootState.userInfo && data.userid === rootState.userInfo.objectId))
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
  async createBlog ({ commit }, options) {
    try {
      let listRes = await Request.post(API.blogListAPI, Object.assign({}, options.params1, {type: '1'}))
      let likeRes = await Request.post(API.likesAPI, {blogid: listRes.objectId, users: []})
      let commentRes = await Request.post(API.commentsAPI, {blogid: listRes.objectId, comments: []})
      let collectRes = await Request.post(API.collectsAPI, {blogid: listRes.objectId, users: []})
      await Request.post(API.blogsAPI, Object.assign({}, options.params2, {type: '1', blogid: listRes.objectId, likeid: likeRes.objectId, commentid: commentRes.objectId, collectid: collectRes.objectId}))
      return true
    } catch (error) {
      return false
    }
  },
  async updateBlog ({ state }, options) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, Object.assign({}, options.params1, {type: '2'}))
      await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, Object.assign({}, options.params2, {blogid: state.blogData.blogid, type: '2'}))
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
      await Request.delete(`${API.collectsAPI}/${state.blogData.collectid}`)
      return true
    } catch (error) {
      return false
    }
  },
  async viewBlog ({ state }) {
    await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {view: {'__op': 'Increment', 'amount': 1}})
    await Request.put(`${API.blogsAPI}/${state.blogData.objectId}`, {view: {'__op': 'Increment', 'amount': 1}})
  },
  async viewLikes ({ dispatch, commit, rootState }, options) {
    try {
      let res = await Request.get(`${API.likesAPI}/${options.likeid}`)
      if (res && res.users) {
        let likers = []
        let bol = false
        for (let i = 0; i < res.users.length; i++) {
          const element = res.users[i]
          if (rootState.userInfo && element === rootState.userInfo.objectId) {
            bol = true
          }
          let userRes = await dispatch('getUser', {userid: element}, {root: true})
          likers.push(userRes || {})
        }
        commit('setLikeList', likers)
        commit('setIsLiked', bol)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async likeBlog ({ state, dispatch, rootState }) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': 1}})
      await Request.put(`${API.likesAPI}/${state.blogData.likeid}`, {users: {'__op': 'AddUnique', 'objects': [rootState.userInfo.objectId]}})
      dispatch('viewLikes', {likeid: state.blogData.likeid})
      return true
    } catch (error) {
      return false
    }
  },
  async unlikeBlog ({ state, dispatch, rootState }) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {like: {'__op': 'Increment', 'amount': -1}})
      await Request.put(`${API.likesAPI}/${state.blogData.likeid}`, {users: {'__op': 'Remove', 'objects': [rootState.userInfo.objectId]}})
      dispatch('viewLikes', {likeid: state.blogData.likeid})
      return true
    } catch (error) {
      return false
    }
  },
  async viewCommons ({ dispatch, commit }, options) {
    try {
      let res = await Request.get(`${API.commentsAPI}/${options.commentid}`)
      if (res && res.comments) {
        for (let i = 0; i < res.comments.length; i++) {
          const element = res.comments[i]
          let userRes = await dispatch('getUser', {userid: element.userid}, {root: true})
          element.user = userRes || {}
        }
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
  },
  async viewCollects ({ dispatch, commit, rootState }, options) {
    try {
      let res = await Request.get(`${API.collectsAPI}/${options.collectid}`)
      if (res && res.users) {
        let collectors = []
        let bol = false
        for (let i = 0; i < res.users.length; i++) {
          const element = res.users[i]
          if (rootState.userInfo && element === rootState.userInfo.objectId) {
            bol = true
          }
          let userRes = await dispatch('getUser', {userid: element}, {root: true})
          collectors.push(userRes || {})
        }
        commit('setCollectList', collectors)
        commit('setIsCollected', bol)
      }
      return true
    } catch (error) {
      return false
    }
  },
  async collectBlog ({ state, dispatch, rootState }) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {collects: {'__op': 'AddUnique', 'objects': [rootState.userInfo.objectId]}})
      await Request.put(`${API.collectsAPI}/${state.blogData.collectid}`, {users: {'__op': 'AddUnique', 'objects': [rootState.userInfo.objectId]}})
      dispatch('viewCollects', {collectid: state.blogData.collectid})
      return true
    } catch (error) {
      return false
    }
  },
  async uncollectBlog ({ state, dispatch, rootState }) {
    try {
      await Request.put(`${API.blogListAPI}/${state.blogData.blogid}`, {collects: {'__op': 'Remove', 'objects': [rootState.userInfo.objectId]}})
      await Request.put(`${API.collectsAPI}/${state.blogData.collectid}`, {users: {'__op': 'Remove', 'objects': [rootState.userInfo.objectId]}})
      dispatch('viewCollects', {collectid: state.blogData.collectid})
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
    state.collectData = {
      list: [],
      isCollected: false
    }
    state.comments = []
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
  },
  setCollectList (state, list) {
    state.collectData.list = list
  },
  setIsCollected (state, bol) {
    state.collectData.isCollected = bol
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
