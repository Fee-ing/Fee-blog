<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-content home-header">
        <div class="home-header-title">免费博客</div>
        <template v-if="userInfo">
          <div class="home-header-user user-wrapper" title="个人信息">
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
        <div class="blog-wrapper" v-for="(item, index) in blogList" :key="index" @click="viewOpt(item)">
          <div class="blog-header">
            <div class="blog-user user-wrapper">
              <div class="user-avatar background-image" v-if="userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
              <div class="user-avatar background-image user-avatar-default" v-else></div>
              <div class="user-info">
                <div class="user-name">{{item.nickname}}</div>
              </div>
            </div>
          </div>
          <div class="blog-body">
            <div v-if="item.cover" class="blog-cover background-image" :style="{ backgroundImage: 'url(' + item.cover + ')'}"></div>
            <div class="blog-paragraph" v-if="item.paragraph.length > 150">{{item.paragraph}}...<span class="blog-more">查看更多</span></div>
            <div class="blog-paragraph" v-else>{{item.paragraph}}</div>
          </div>
          <div class="blog-footer">
            <div class="blog-time">{{item.type === '1' ? `${formatTime(item.createdAt)}发布` : `${formatTime(item.updatedAt)}更新`}}</div>
            <div class="blog-info">
              <div class="info-item"><span>喜欢</span>{{item.like}}</div>
              <div class="info-item"><span>评论</span>{{item.comment}}</div>
              <div class="info-item"><span>浏览</span>{{item.view}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatTime } from '../plugins/func'

export default {
  name: 'Home',
  data () {
    return {
      blogList: []
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  methods: {
    ...mapActions({
      logout: 'logout',
      getBlogList: 'home/getBlogList'
    }),
    formatTime,
    loginOpt () {
      this.$router.push('login')
    },
    logoutOpt () {
      this.logout()
    },
    async getData () {
      let res = await this.getBlogList()
      this.blogList = res && res.results
    },
    viewOpt (opts) {
      let blogid = opts.objectId
      console.log(blogid)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.user-wrapper{
  display: flex;
  align-items: center;
  .user-avatar{
    width: 35px;
    height: 35px;
    margin-right: 5px;
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
  }
}
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
      margin-top: 3px;
      transition: all 0.3s;
      &:hover{
        font-weight: bold;
        color: darken(@black, 30%);
      }
    }
  }
}
.blog-wrapper{
  cursor: pointer;
  margin-bottom: 50px;
  .blog-header{

  }
  .blog-body{
    display: flex;
    margin-top: 10px;
    padding-left: 40px;
    .blog-cover{
      width: 120px;
      height: 80px;
      border-radius: 4px;
      margin-right: 15px;
    }
    .blog-paragraph{
      flex: 1;
      .blog-more{
        color: @gray;
        font-size: 12px;
      }
    }
  }
  .blog-footer{
    display: flex;
    margin-top: 15px;
    padding-left: 40px;
    .blog-time{
      flex: 1;
      font-size: 11px;
      color: @gray;
    }
    .blog-info{
      .info-item{
        display: inline-block;
        font-size: 12px;
        margin-left: 10px;
        span{
          color: @gray;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
