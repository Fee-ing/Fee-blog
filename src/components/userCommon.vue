<template>
  <div class="user-wrapper" @click.stop="viewUserOpt">
    <div class="user-avatar background-image" v-if="userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
    <div class="user-avatar background-image user-avatar-default" v-else></div>
    <div class="user-info">
      <div class="user-name">{{userInfo.nickname}}</div>
      <slot name="user-others"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    viewUserOpt () {
      let userid = this.userInfo.userid || ''
      if (userid) {
        this.$router.push({path: '/user', query: {userid}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.user-wrapper{
  display: flex;
  align-items: center;
  cursor: pointer;
  &.small-avatar{
    .user-avatar{
      width: 25px;
      height: 25px;
    }
    .user-info .user-name{
      font-size: 11px;
    }
  }
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
    .info-item{
      font-size: 11px;
      color: @gray;
    }
  }
}
</style>
