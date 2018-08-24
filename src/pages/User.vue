<template>
  <div class="page-wrapper user-wrapper">
    <div class="page-header">
      <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      <div class="page-header-content">
        <div class="user-name">{{userData.nickname}}的主页</div>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <div class="user-header">
          <div class="left">
            <div class="avatar background-image" v-if="userData.avatar" :style="{ backgroundImage: 'url(' + userData.avatar + ')'}"></div>
            <div class="avatar background-image avatar-default" v-else></div>
            <div class="name">{{userData.nickname}}</div>
            <div class="btn-wrapper" v-if="isAuthor">
              <div class="btn common-btn">编辑</div>
            </div>
          </div>
          <div class="right">
            <div class="right-item" v-if="isAuthor && userData.username">账号：<span>{{userData.username}}</span></div>
            <div class="right-item">地址：<span>{{userData.location || '未设置'}}</span></div>
            <div class="right-item" v-if="isAuthor">邮箱：<span>{{userData.email || '未设置'}}</span></div>
            <div class="right-item">性别：<span>{{userData.sex || '未设置'}}</span></div>
            <div class="right-item">签名：<span>{{userData.sign || '未设置'}}</span></div>
            <div class="right-item">注册时间：<span>{{formatTime(userData.createdAt, '2')}}</span></div>
          </div>
        </div>
        <div class="user-body">
          <blogCommon v-for="(item, index) in blogList" :key="index" :blogData="item"></blogCommon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blogCommon from '../components/blogCommon.vue'

import { formatTime } from '../plugins/func'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user')

export default {
  data () {
    return {
    }
  },
  components: {
    blogCommon
  },
  async created () {
    this.viewUser({userid: this.$route.query.userid})
  },
  computed: {
    ...mapGetters(['userInfo', 'isAuthor', 'userData', 'blogList'])
  },
  methods: {
    ...mapActions(['viewUser']),
    formatTime
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.user-wrapper{
  .user-name{
    flex: 1;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
  }
  .user-header{
    display: flex;
    .left{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 50px;
      margin-right: 30px;
      .avatar{
        width: 60px;
        height: 60px;
        border-radius: 4px;
        &.avatar-default{
          background-image: url(../assets/images/default-avatar.png);
        }
      }
      .name{
        margin-top: 10px;
      }
      .btn-wrapper{
        margin-top: 10px;
        .btn{
          margin-left: 0;
          font-size: 11px;
        }
      }
    }
    .right{
      flex: 1;
      font-size: 13px;
      color: @gray;
      .right-item{
        display: flex;
        align-items: center;
        margin-top: 15px;
        &:first-child{
          margin-top: 0;
        }
        span{
          flex: 1;
          color: @black;
        }
      }
    }
  }
  .user-body{
    margin-top: 50px;
  }
}
</style>
