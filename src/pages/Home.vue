<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-content home-header">
        <div class="home-header-title">搭建免费博客</div>
        <template v-if="userInfo">
          <userCommon :userInfo="userInfo" class="home-header-user" title="个人信息">
            <template slot="user-others">
              <div class="user-logout" title="退出登录" @click.stop="logoutOpt">退出登录</div>
            </template>
          </userCommon>
          <div class="common-btn" @click="$router.push('blog')">写博客</div>
        </template>
        <div v-else class="common-btn" @click="loginOpt">登录 / 注册</div>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <template v-for="(item, index) in blogList">
          <blogCommon :key="index" :blogData="item" @view-blog="viewOpt"></blogCommon>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import userCommon from '../components/userCommon.vue'
import blogCommon from '../components/blogCommon.vue'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  components: {
    userCommon,
    blogCommon
  },
  computed: {
    ...mapGetters({
      blogList: 'home/blogList',
      userInfo: 'userInfo'
    })
  },
  created () {
    this.getBlogList()
  },
  methods: {
    ...mapActions({
      logout: 'logout',
      getBlogList: 'home/getBlogList'
    }),
    loginOpt () {
      this.$router.push('login')
    },
    logoutOpt () {
      this.logout()
    },
    viewOpt (opts) {
      let blogid = opts.objectId
      this.$router.push({path: '/blog', query: {blogid}})
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.home-header{
  .home-header-title{
    flex: 1;
    font-size: 20px;
    font-weight: bold;
  }
  .home-header-user{
    cursor: pointer;
    margin-right: 10px;
    .user-info .user-logout{
      font-size: 11px;
      transition: all 0.3s;
      &:hover{
        color: @black;
      }
    }
  }
}
</style>
