import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import home from './modules/home'

import { getCookie } from '../plugins/func'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: (getCookie('Blog_userInfo') && JSON.parse(getCookie('Blog_userInfo'))) || null
  },
  actions,
  mutations,
  modules: {
    home
  }
})
