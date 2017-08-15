import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'
// import lists from './modules/lists.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  	appInfo: {
      appId: 'yiyAjSc4l0FDYgJwaypzQYCL-gzGzoHsz',
      appKey: '2IP8CPpLdKpPf9SihRAdPlvP'
    },
    articleList: []
  },
  mutations,
  actions,
  getters: {
    articleList: state=>state.articleList,
  },
  modules: {
  	// lists
  }
})

export default store