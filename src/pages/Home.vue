<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-content home-header">
        <div class="home-header-title"><span @click="getBlogList">搭建免费博客</span></div>
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
        <blogCommon v-for="(item, index) in blogList" :key="index" :blogData="item" :showSign="true"></blogCommon>
        <div class="page-tip">
          <span v-if="isEnding">没有更多啦~</span>
          <span v-else-if="!isEnding && isLoading && blogList.length >= 10">加载中~</span>
          <span v-else-if="!isEnding && !isLoading && blogList.length <= 0">这里什么也没有~</span>
        </div>
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
      isLoading: false
    }
  },
  components: {
    userCommon,
    blogCommon
  },
  computed: {
    ...mapGetters({
      blogList: 'home/blogList',
      isEnding: 'home/isEnding',
      userInfo: 'userInfo'
    })
  },
  async created () {
    this.isLoading = true
    await this.getBlogList()
    this.isLoading = false
  },
  mounted () {
    let that = this
    document.querySelector('.page-wrapper').addEventListener('scroll', async (e) => {
      if (e.target.offsetHeight + e.target.scrollTop + 100 >= e.target.scrollHeight && !that.isLoading && !that.isEnding) {
        that.isLoading = true
        await that.getBlogList({pageDown: true})
        that.isLoading = false
      }
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
      this.$toast({
        title: '退出成功'
      })
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
    span{
      cursor: pointer;
    }
  }
  .home-header-user{
    cursor: pointer;
    margin-right: 10px;
    .user-info .user-logout{
      color: @gray;
      font-size: 11px;
      transition: all 0.3s;
      &:hover{
        color: @black;
      }
    }
  }
}
</style>
