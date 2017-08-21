import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[{
    path:'/home',component:require('../views/index')
  },{
    path:'/login',component:require('../views/login')
  },{
    path:'/setting',component:require('../views/setting')
  },{
    path:'/article',component:require('../views/article')
  },{
    path:'/',redirect:'/home'
  },{
    path:'*',redirect:'/home'
  }]
})


export default router