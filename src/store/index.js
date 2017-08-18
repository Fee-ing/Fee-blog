import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'
// import lists from './modules/lists.js'
import Func from '../assets/js/common.js'

Vue.use(Vuex)

let userInfo = Func.getCookie('Fee_userInfo') || null;

const store = new Vuex.Store({
  state: {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    articleList: [],
    article: {}
  },
  mutations,
  actions,
  getters: {
    userInfo: state=>state.userInfo,
    articleList: state=>state.articleList,
    article: state=>state.article
  },
  modules: {
  	// lists
  }
})

export default store