<template>
  <div id="app">
    <div class="editor-wrapper">
      <edit-header></edit-header>
      <div class="editor-content">
        <div id="editor" class="editor" contenteditable="true" @input="getHtml" @focus="initHtml" @blur="formatHtml">{{placeholder}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import editHeader from './components/editHeader.vue'

export default {
  data(){
    return {
      editHtml: '',
      placeholder: '请输入内容...'
    }
  },
  components: {
    editHeader
  },
  methods: {
    initHtml() {
      this.placeholder = '';
    },
    formatHtml() {
      
    },
    getHtml(e) {
      this.editHtml = e.currentTarget.innerHTML;
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  color: #333;
  font-size: 15px;
  overflow: hidden;
  background-color: #fff;
  .editor-wrapper{
    height: 100%;
    .editor-content{
      width: 800px;
      height: 100%;
      overflow: hidden;
      margin: 0 auto;
      background-color: #fff;
      padding: 70px 40px 30px;
      box-shadow: 0 1px 6px #999;
      .editor{
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        outline: none;
      }
    }
  }
}

</style>
