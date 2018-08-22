<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-content home-header">
        <div class="home-header-title">免费博客</div>
        <template v-if="userInfo">
          <div class="home-header-user" title="个人信息">
            <div class="user-avatar background-image" v-if="userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
            <div class="user-avatar background-image user-avatar-default" v-else></div>
            <div class="user-info">
              <div class="user-name">{{userInfo.nickname}}</div>
              <div class="user-logout" title="退出登录" @click.stop="logoutOpt">退出登录</div>
            </div>
          </div>
          <div class="common-btn" @click="$router.push('blog')">写博客</div>
        </template>
        <div v-else class="common-btn" @click="loginOpt">登录 / 注册</div>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <div class="blog-wrapper">
          <div class="blog-header"></div>
          <div class="blog-body"></div>
          <div class="blog-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo',
      blogList: 'home/blogList'
    })
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
    }
  },
  created () {
    // this.getBlogList()
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
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
    .user-avatar{
      width: 35px;
      height: 35px;
      margin-right: 8px;
      // border: 1px solid @black;
      border-radius: 4px;
      &.user-avatar-default{
        background-image: url(../assets/images/default-avatar.png);
      }
    }
    .user-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      .user-name{
        font-size: 12px;
      }
      .user-logout{
        font-size: 11px;
        margin-top: 3px;
        transition: all 0.3s;
        &:hover{
          font-weight: bold;
          color: darken(@black, 30%);
        }
      }
    }
  }
}
</style>
