<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-content login-header">
        <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      </div>
    </div>
    <div class="login-wrapper">
      <div class="login-form">
        <div class="input-wrapper">
          <template v-if="type === '1'">
            <input type="text" class="common-input" placeholder="手机号" v-model="loginForm.phone">
            <input type="password" class="common-input" placeholder="密码（6-10位、由字母或数字组成）" v-model="loginForm.password" @keyup.enter="loginOpt">
          </template>
          <template v-if="type === '2'">
            <input type="text" class="common-input" placeholder="手机号" v-model="registForm.phone">
            <input type="password" class="common-input" placeholder="密码（6-10位、由字母或数字组成）" v-model="registForm.password">
            <input type="password" class="common-input" placeholder="确认密码" v-model="registForm.confirmPass" @keyup.enter="registOpt">
          </template>
        </div>
        <div class="btn-wrapper">
          <div class="btn" :class="[type === '1' ? 'common-btn' : '']" @click="loginOpt">登录</div>
          <div class="btn" :class="[type === '2' ? 'common-btn' : '']" @click="registOpt">注册</div>
          <a class="btn" target="_blank" href="https://github.com/Fee-ing">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MD5 from 'md5'
import { setStorage, getStorage } from '../plugins/func'
import { mapActions } from 'vuex'

let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
let passReg = /^[a-z0-9]{6,11}$/

export default {
  name: 'Login',
  data () {
    return {
      type: '1',
      loginForm: {
        'phone': getStorage('Blog_phone') || '',
        'password': ''
      },
      registForm: {
        'phone': '',
        'password': '',
        'confirmPass': ''
      }
    }
  },
  methods: {
    ...mapActions(['login', 'regist']),
    async loginOpt () {
      if (this.type === '2') {
        this.type = '1'
        return
      }
      if (!phoneReg.test(this.loginForm.phone)) {
        this.$toast({
          title: '请填写正确的手机号'
        })
        return
      }
      if (!passReg.test(this.loginForm.password)) {
        this.$toast({
          title: '请填写正确的密码'
        })
        return
      }
      let params = {
        username: this.loginForm.phone,
        password: MD5(this.loginForm.password)
      }
      let res = await this.login(params)
      if (res) {
        this.$toast({
          title: '登录成功'
        })
        setStorage('Blog_phone', this.loginForm.phone)
        this.$router.replace({path: '/'})
      }
    },
    async registOpt () {
      if (this.type === '1') {
        this.type = '2'
        return
      }
      if (!phoneReg.test(this.registForm.phone)) {
        this.$toast({
          title: '请填写正确的手机号'
        })
        return
      }
      if (!passReg.test(this.registForm.password)) {
        this.$toast({
          title: '请填写正确的密码'
        })
        return
      }
      if (this.registForm.confirmPass !== this.registForm.password) {
        this.$toast({
          title: '请填写正确的确认密码'
        })
        return
      }
      let params = {
        username: this.registForm.phone,
        password: MD5(this.registForm.password),
        nickname: '游客' + MD5(this.registForm.phone).substr(0, 6)
      }
      let res = await this.regist(params)
      if (res) {
        this.$toast({
          title: '注册成功'
        })
        setStorage('Blog_phone', this.registForm.phone)
        this.$router.replace({path: '/'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-header{
  width: 100% !important;
}
.login-wrapper{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form{
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 280px;
    padding: 20px;
    background: #f9f9f9;
    background: linear-gradient(top, rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
    box-shadow: 0 1px 0 #fff inset;
    border: 1px solid #c4c6ca;
    position: relative;
    z-index: 0;
    text-shadow: 0 1px 0 #fff;
    &::before, &::after{
      background: #f9f9f9;
      background: linear-gradient(top, rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
      border: 1px solid #c4c6ca;
      content: "";
      display: block;
      height: 100%;
      left: -1px;
      position: absolute;
      width: 100%;
    }
    &::before{
      transform: rotate(-3deg);
      top: 0;
      z-index: -2;
    }
    &::after{
      transform: rotate(2deg);
      top: 0;
      z-index: -1;
    }
    .input-wrapper{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .common-input{
        display: inline-block;
        height: 36px;
        width: 100%;
        font-size: 13px;
        padding: 10px 15px;
        border: 1px solid #999;
        border-radius: 3px;
        outline: none;
        margin-top: 15px;
        &:first-child{
          margin-top: 0;
        }
      }
    }
    .btn-wrapper{
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-bottom: 20px;
      .btn{
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
