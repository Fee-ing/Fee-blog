<template>
  <div class="page-wrapper user-wrapper">
    <div class="page-header">
      <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      <div class="page-header-content">
        <div class="user-name">{{isAuthor ? '我' : userData.nickname}}的主页</div>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <div class="user-header">
          <div class="left">
            <div class="left-avatar">
              <div class="avatar background-image" v-if="userData.avatar" :style="{ backgroundImage: 'url(' + userData.avatar + ')'}"></div>
              <div class="avatar background-image avatar-default" v-else></div>
              <input v-if="type === '2'" type="file" accept="*.png,*.jpg,*.jpeg,*gif" class="avatar-input" @change.stop="updateAvatar">
              <div v-if="type === '2'" class="tip">更换头像</div>
            </div>
            <div class="name">
              <span v-if="type === '1'">{{userData.nickname}}</span>
              <input v-else type="text" placeholder="8字以内" v-model="userData.nickname">
            </div>
            <div class="btn-wrapper" v-if="isAuthor">
              <div class="btn common-btn" @click="editOpt" v-if="type === '1'">编辑</div>
              <div class="btn common-btn" @click="saveOpt" v-else>保存</div>
            </div>
          </div>
          <div class="right">
            <div class="right-item" v-if="isAuthor && userData.username">
              <span class="right-title">账号：</span>
              <div class="right-content">
                <span>{{userData.username}}</span>
              </div>
            </div>
            <div class="right-item">
              <span class="right-title">地址：</span>
              <div class="right-content">
                <span v-if="type === '1'">{{userData.location || '未设置'}}</span>
                <input v-else type="text" placeholder="选填，不超过10个字" v-model="userData.location">
              </div>
            </div>
            <div class="right-item">
              <span class="right-title">QQ：</span>
              <div class="right-content">
                <span v-if="type === '1'">{{userData.qq || '未设置'}}</span>
                <input v-else type="text" placeholder="选填" v-model="userData.qq">
              </div>
            </div>
            <div class="right-item">
              <span class="right-title">微信：</span>
              <div class="right-content">
                <span v-if="type === '1'">{{userData.wechat || '未设置'}}</span>
                <input v-else type="text" placeholder="选填" v-model="userData.wechat">
              </div>
            </div>
            <div class="right-item">
              <span class="right-title">签名：</span>
              <div class="right-content">
                <span v-if="type === '1'">{{userData.sign || '未设置'}}</span>
                <textarea v-else cols="30" rows="2" placeholder="选填，不超过30个字" v-model="userData.sign"></textarea>
              </div>
            </div>
            <div class="right-item regist-time">注册时间：<span>{{formatTime(userData.createdAt, '2')}}</span></div>
          </div>
        </div>
        <div class="user-body">
          <blogCommon v-for="(item, index) in blogList" :key="index" :blogData="item"></blogCommon>
        </div>
        <div class="page-tip">
          <span v-if="isEnding">没有更多啦~</span>
          <span v-else-if="!isEnding && isLoading">加载中~</span>
          <span v-else-if="!isEnding && !isLoading && blogList.length <= 0">这里什么也没有~</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blogCommon from '../components/blogCommon.vue'

import lrz from 'lrz'
import { formatTime } from '../plugins/func'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user')

export default {
  data () {
    return {
      type: '1',
      isLoading: false
    }
  },
  components: {
    blogCommon
  },
  computed: {
    ...mapGetters(['userInfo', 'isAuthor', 'userData', 'blogList', 'isEnding'])
  },
  async created () {
    this.isLoading = true
    await this.viewUser({userid: this.$route.query.userid})
    await this.viewBlog({userid: this.$route.query.userid})
    this.isLoading = false
  },
  mounted () {
    let that = this
    document.querySelector('.page-wrapper').addEventListener('scroll', async (e) => {
      if (e.target.offsetHeight + e.target.scrollTop + 100 >= e.target.scrollHeight && !that.isLoading && !that.isEnding) {
        that.isLoading = true
        await that.viewBlog({userid: this.$route.query.userid, pageDown: true})
        that.isLoading = false
      }
    })
  },
  methods: {
    ...mapActions(['viewUser', 'viewBlog', 'updateUser']),
    formatTime,
    editOpt () {
      this.type = '2'
    },
    updateAvatar () {
      lrz(event.currentTarget.files[0]).then((rst) => {
        this.userData.avatar = rst.base64
      }).catch(() => {
        this.$toast('图片上传失败')
      })
    },
    async saveOpt () {
      let params = {
        avatar: this.userData.avatar || '',
        nickname: (this.userData.nickname || '').replace(/\s/gi, ''),
        location: (this.userData.location || '').replace(/\s/gi, ''),
        qq: (this.userData.qq || '').replace(/\s/gi, ''),
        wechat: (this.userData.wechat || '').replace(/\s/gi, ''),
        sign: (this.userData.sign || '').replace(/\s/gi, '')
      }
      let signReg = /^[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\u4e00-\u9fa5\w]{0,30}$/
      if (!(/^[\u4e00-\u9fa5a-z0-9]{1,8}$/i).test(params.nickname)) {
        this.$toast({
          title: '请填写正确的昵称'
        })
        return
      }
      if (params.location && !(/^[\u4e00-\u9fa5a-z0-9]{0,10}$/).test(params.location)) {
        this.$toast({
          title: '请填写正确的地址'
        })
        return
      }
      if (params.qq && !(/^\d{7,12}$/).test(params.qq)) {
        this.$toast({
          title: '请填写正确的QQ号'
        })
        return
      }
      if (params.wechat && !(/^[a-z0-9]+$/i).test(params.wechat)) {
        this.$toast({
          title: '请填写正确的微信'
        })
        return
      }
      if (params.sign && !signReg.test(params.sign)) {
        this.$toast({
          title: '请填写正确的签名'
        })
        return
      }
      let bol = true
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key]
          if (element !== this.userInfo[key]) {
            bol = false
            break
          }
        }
      }
      if (bol) {
        this.type = '1'
        return
      }
      let res = await this.updateUser(params)
      if (res) {
        this.type = '1'
        this.$toast({
          title: '保存成功'
        })
      }
      await this.viewBlog({userid: this.$route.query.userid})
    }
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
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 50px;
      margin-right: 30px;
      .left-avatar{
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 4px;
        overflow: hidden;
        &:hover{
          .tip{
            bottom: 0;
          }
        }
        .avatar{
          position: relative;
          z-index: 1;
          height: 100%;
          &.avatar-default{
            background-image: url(../assets/images/default-avatar.png);
          }
        }
        .avatar-input{
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          left: 0;
          top: 0;
          z-index: 10;
          cursor: pointer;
        }
        .tip{
          position: absolute;
          width: 100%;
          height: 20px;
          line-height: 20px;
          background-color: rgba(0, 0, 0, 0.8);
          color: #fff;
          text-align: center;
          font-size: 11px;
          left: 0;
          bottom: -100%;
          z-index: 5;
          transition: bottom 0.3s;
        }
      }
      .name{
        height: 26px;
        line-height: 26px;
        margin-top: 10px;
        input{
          width: 100%;
          height: 100%;
          padding: 4px 5px;
          text-align: center;
          font-size: 13px;
        }
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
        height: 26px;
        line-height: 26px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        &.regist-time{
          margin-bottom: 0;
          margin-top: 15px;
          font-size: 11px;
        }
        .right-title{
          width: 40px;
        }
        .right-content{
          height: 100%;
          flex: 1;
          color: @black;
          span{
            padding: 0 5px;
          }
          input{
            width: 150px;
            height: 100%;
            padding: 4px 5px;
            font-size: 12px;
          }
          textarea{
            width: 100%;
            resize: none;
            padding: 4px 5px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .user-body{
    margin-top: 50px;
  }
}
</style>
