<template>
  <div class="editor-wrapper">
    <edit-header :content="innerText" @clear-html="clearHtml"></edit-header>
    <div class="editor-content">
      <div class="content-wrapper" contenteditable="true" v-text="innerText" @input="innerText = $event.target.innerText"></div>
    </div>
  </div>
</template>

<script>
import editHeader from '../components/editHeader.vue'

export default {
  data(){
    return {
      innerText: ''
    }
  },
  components: {
    editHeader
  },
  beforeRouteLeave(to, from, next) {
    this.innerText = '';
    next();
  },
  methods: {
    clearHtml() {
      this.innerText = '';
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrapper{
  border: none;
  outline: none;
}
</style>