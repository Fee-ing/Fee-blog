<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  min-width: 800px;
  color: #333;
  font-size: 15px;
  overflow: hidden;
  background-color: #fff;
  .editor-wrapper{
    height: 100%;
    .edit-heading{
      position: fixed;
      width: 100%;
      min-width: 800px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      box-shadow: 0 2px 4px hsla(0,0%,8%,.15);
      background: #f0f0f0;
      z-index: 100;
      .edit-heading-container{
        display: inline-block;
        height: 100%;
      }
    }
    .editor-content{
      position: relative;
      width: 800px;
      height: 100%;
      overflow: hidden;
      margin: 0 auto;
      background-color: #fff;
      padding-top: 50px;
      box-shadow: 0 0 10px rgba(0,0,0,0.25);
      .content-wrapper{
        height: 100%;
        padding: 50px 50px 0px;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}
</style>