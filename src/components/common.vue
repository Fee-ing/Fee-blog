<template>
    <!-- Banner图 -->
    <div class="topic-element topic-img" :class="{ 'topic-select': editBol, 'topic-padding': paddingBol, 'topic-img-one': oneBol, 'topic-img-two': twoBol, 'topic-img-three': threeBol }" v-if="name == 'img'" @click.stop="selectOpt">
      <img :src="imgUrl">
    </div>
    <!-- 标题 -->
    <h1 class="topic-element topic-text topic-title" :class="{ 'topic-select': editBol }" contenteditable="true" v-else-if="name == 'title'" @click.stop="selectOpt">正文标题</h1>
    <!-- 副标题 -->
    <h3 class="topic-element topic-text topic-subtitle" :class="{ 'topic-select': editBol }" contenteditable="true" v-else-if="name == 'subtitle'" @click.stop="selectOpt">副标题</h3>
    <!-- 日期 -->
    <h6 class="topic-element topic-text topic-date" :class="{ 'topic-select': editBol }" contenteditable="true" v-else-if="name == 'date'" @click.stop="selectOpt">文章发布日期</h6>
    <!-- 段落 -->
    <p class="topic-element topic-passage" :class="{ 'topic-select': editBol }" contenteditable="true" v-else-if="name == 'passage'" @click.stop="selectOpt">正文的文章段落</p>
</template>

<script>
export default {
  name: 'common',
  props: {
    index: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    delBol: {
      type: Boolean,
      default: false
    },
    editBol: {
      type: Boolean,
      default: false
    },
    imgBol: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: 'http://tooboo.b0.upaiyun.com/pics/2017/05/149457595659156b54c6c64.png'
    },
    paddingBol: {
      type: Boolean,
      default: false
    },
    oneBol: {
      type: Boolean,
      default: true
    },
    twoBol: {
      type: Boolean,
      default: false
    },
    threeBol: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {

    }
  },
  methods: {
    selectOpt(e){
      let that = e.currentTarget;
      let imgHeight = null;
      if(this.name == 'img'){
        imgHeight = that.offsetHeight;
      }
      this.$emit('selectOpt', {top: that.offsetTop + that.offsetHeight, index: this.index, imgHeight: imgHeight});
    }
  }
}
</script>

<style lang="less" scoped>
  .topic-element{
    cursor: pointer;
    box-sizing: border-box;
    outline: none;
    &:hover{
      /*border: 1px dashed #00d5cc;*/
    }
  }
  .topic-select{
    border: 1px dashed #000;
    border-bottom: none;
  }
  .topic-padding{
    padding: 0 15px;
  }
  .topic-img{
    overflow: hidden;
    img{
      display: block;
      width: 100%;
      user-select: none;
    }
    &.topic-img-one{
      width: 100%;
      display: block;
    }
    &.topic-img-two{
      width: 50%;
      display: inline-block;
    }
    &.topic-img-three{
      width: 33.33%;
      display: inline-block;
      vertical-align: top;
    }
  }
  .topic-text{
    margin: 0;
    text-align: center;
  }
  .topic-title{
    font-size: 22px;
    padding: 20px 0 10px;
  }
  .topic-subtitle{
    font-size: 17px;
    padding: 8px 0;
  }
  .topic-date{
    font-size: 12px;
    padding: 5px 0;
    color: #999;
    font-weight: normal;
  }
  .topic-passage{
    margin: 0;
    padding: 8px 15px;
    font-size: 15px;
  }
</style>
