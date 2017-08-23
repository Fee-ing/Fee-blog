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
    homeArticle: {
      articles: [],
      limit: 30,
      skip: 0,
      nomore: false
    },
    userArticles: {
      articles: [],
      limit: 30,
      skip: 0,
      nomore: false
    },
    userFavorArticles: {
      articles: [],
      limit: 30,
      skip: 0,
      nomore: false
    },
    userCommentArticles: {
      articles: [],
      limit: 30,
      skip: 0,
      nomore: false
    },
    article: {},
  },
  mutations,
  actions,
  getters: {
    userInfo: state=>state.userInfo,
    homeArticle: state=>state.homeArticle,
    article: state=>state.article,
    userArticles: state=>state.userArticles,
    userFavorArticles: state=>state.userFavorArticles,
    userCommentArticles: state=>state.userCommentArticles
  },
  modules: {
  	// lists
  }
})

export default store