import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

import './assets/css/reset.css'
import './assets/css/iconfont.css'
import './assets/css/common.css'
import './assets/css/pace-theme-minimal.css'

import './assets/js/pace.min.js'

Vue.use(VueResource)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})