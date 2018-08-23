<template>
  <div class="user-wrapper">
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
  }
}
</script>

<style lang="less" scoped>
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
    .info-item{
      font-size: 11px;
    }
  }
}
</style>
