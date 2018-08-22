import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { toast } from './plugins/func'

import './assets/css/theme.less'

Vue.config.productionTip = false

Vue.prototype.$toast = toast

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
