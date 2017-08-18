import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[{
    path:'/index',component:require('../views/index')
  },{
    path:'/login',component:require('../views/login')
  },{
    path:'/setting',component:require('../views/setting')
  },{
    path:'/article',component:require('../views/article')
  },{
    path:'/edit',component:require('../views/edit')
  },{
    path:'*',redirect:'/index'
  }]
})


export default router