import Vue from 'vue'
import App from './App'

import './assets/css/reset.css'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
