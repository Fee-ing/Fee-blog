import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import actions from './actions'
import mutations from './mutations'
import home from './modules/home'
import blog from './modules/blog'
import user from './modules/user'

import { getCookie } from '../plugins/func'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: (getCookie('Blog_userInfo') && JSON.parse(getCookie('Blog_userInfo'))) || null
  },
  getters,
  actions,
  mutations,
  modules: {
    home,
    blog,
    user
  }
})
