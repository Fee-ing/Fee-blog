<template>
  <div id="app">
    <div class="common left">
      <div class="phone-wrapper">
        <div class="phone-view">
          <button type="button" @click.stop="addImg">添加图片</button>
          <button type="button" @click.stop="addTitle">添加标题</button>
          <button type="button" @click.stop="addSubtitle">添加副标题</button>
          <button type="button" @click.stop="addDate">添加日期</button>
          <button type="button" @click.stop="addPassage">添加段落</button>
        </div>
      </div>
    </div>
    <div class="common right">
      <div class="phone-wrapper">
        <div class="topic-view" id="topic-view">
          <template v-for="(item, index) in htmlData">
            <common
            :index="index"
            :name="item.name"
            :delBol="item.delBol"
            :editBol="item.editBol"
            :imgBol="item.imgBol"
            :imgUrl="item.imgUrl"
            :paddingBol="item.paddingBol"
            :oneBol="item.oneBol"
            :twoBol="item.twoBol"
            :threeBol="item.threeBol"
            v-on:selectOpt="selectHandle"
            ></common>
          </template>
          <div class="edit-wrapper" id="edit-wrapper" v-if="selectBol" :style="{ top: selectTop+'px' }">
            <button type="button" class="edit-button" @click.stop="deleteOpt">删除</button>
            <button type="button" class="edit-button" v-if="selectIndex && htmlData[selectIndex].name == 'img'" @click.stop="paddingOpt">{{htmlData[selectIndex].paddingBol ? '取消边距' : '设置边距'}}</button>
            <button type="button" class="edit-button" v-if="selectIndex && htmlData[selectIndex].name == 'img' && !htmlData[selectIndex].oneBol" @click.stop="oneOpt">一分</button>
            <button type="button" class="edit-button" v-if="selectIndex && htmlData[selectIndex].name == 'img' && !htmlData[selectIndex].twoBol" @click.stop="twoOpt">二分</button>
            <button type="button" class="edit-button" v-if="selectIndex && htmlData[selectIndex].name == 'img' && !htmlData[selectIndex].threeBol" @click.stop="threeOpt">三分</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from './components/common'

export default {
  name: 'app',
  data(){
    return {
      htmlData: [],
      selectBol: false,
      selectTop: 0,
      selectIndex: null,
      topicView: null,
      imgHeight: null
    }
  },
  mounted(){
    let that = this;
    that.topicView = document.getElementById('topic-view');
    document.addEventListener('click',function(){
      that.init();
    })
  },
  components: {
    common
  },
  methods: {
    init(){
      for(let i = 0;i < this.htmlData.length;i ++){
        this.htmlData[i].editBol = false;
      }
      this.selectTop = 0;
      this.selectIndex = null;
      this.selectBol = false;
    },
    scrollBottom(){
      let that = this;
      that.$nextTick(function(){
        if(that.topicView.scrollHeight <= that.topicView.offsetHeight){
          return;
        }
        let exHeight = 0;
        let editWrapper = document.getElementById('edit-wrapper');
        if(editWrapper){
          exHeight = editWrapper.offsetHeight;
        }
        that.topicView.scrollTop = that.topicView.scrollHeight - that.topicView.offsetHeight + exHeight;
      });
    },
    addOpt(option){
      let data = {
        name: option.name || '',
        delBol: option.delBol || false,
        editBol: option.editBol || false,
        imgBol: option.imgBol || false,
        imgUrl: option.imgUrl || 'http://tooboo.b0.upaiyun.com/pics/2017/05/149457595659156b54c6c64.png',
        paddingBol: option.paddingBol || false,
        oneBol: option.oneBol || true,
        twoBol: option.twoBol || false,
        threeBol: option.threeBol || false,
      };
      if(this.selectIndex){
        this.htmlData.splice(this.selectIndex + 1, 0, data);
        // this.init();
      }else{
        this.htmlData.push(data);
        this.scrollBottom();
      }
    },
    addImg(){
      let img = {
        name: 'img'
      };
      this.addOpt(img);
    },
    addTitle(){
      let title = {
        name: 'title'
      };
      this.addOpt(title);
    },
    addSubtitle(){
      let subtitle = {
        name: 'subtitle'
      };
      this.addOpt(subtitle);
    },
    addDate(){
      let date = {
        name: 'date'
      };
      this.addOpt(date);
    },
    addPassage(){
      let passage = {
        name: 'passage'
      };
      this.addOpt(passage);
    },
    selectHandle(option){
      for(let i = 0;i < this.htmlData.length;i ++){
        this.htmlData[i].editBol = false;
      }
      this.htmlData[option.index].editBol = true;
      this.selectTop = option.top;
      this.selectIndex = option.index;
      this.imgHeight = option.imgHeight;
      this.selectBol = true;
      if(this.selectIndex >= this.htmlData.length - 1){
        this.scrollBottom();
      }

    },
    deleteOpt(){
      this.htmlData.splice(this.selectIndex, 1);
      this.init();
    },
    paddingOpt(){
      let subHeight = (1 - (this.topicView.offsetWidth - 30)/this.topicView.offsetWidth)*this.imgHeight - 1;
      let paddingBol = this.htmlData[this.selectIndex].paddingBol;
      if(!paddingBol){
        subHeight = -subHeight;
      }
      this.htmlData[this.selectIndex].paddingBol = !paddingBol;
      this.selectTop = this.selectTop + subHeight;
    },
    oneOpt(){
      this.htmlData[this.selectIndex].twoBol = false;
      this.htmlData[this.selectIndex].threeBol = false;
      this.htmlData[this.selectIndex].oneBol = true;
      this.init();
    },
    twoOpt(){
      this.htmlData[this.selectIndex].oneBol = false;
      this.htmlData[this.selectIndex].threeBol = false;
      this.htmlData[this.selectIndex].twoBol = true;
      this.init();
    },
    threeOpt(){
      this.htmlData[this.selectIndex].oneBol = false;
      this.htmlData[this.selectIndex].twoBol = false;
      this.htmlData[this.selectIndex].threeBol = true;
      this.init();
    },
  }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar
{
    width: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: #333;
  font-size: 15px;
  overflow: hidden;
  .common{
    width: 50%;
    height: 100%;
    border: 1px solid yellow;
    box-sizing: border-box;
    &.left{
      float: left;
    }
    &.right{
      float: right;
    }
    .phone-wrapper{
      width: 375px;
      height: 667px;
      margin: 30px auto 0;
      overflow-y: auto;
      border-top: 80px solid #e1e1e1;
      border-bottom: 90px solid #e1e1e1;
      border-left: 15px solid #e1e1e1;
      border-right: 15px solid #e1e1e1;
      border-radius: 55px;
      .topic-view{
        position: relative;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .edit-wrapper{
          position: absolute;
          width: 100%;
          left: 0;
          z-index: 100;
          box-sizing: border-box;
          padding: 15px;
          background-color: rgba(0,0,0,.8);
          .edit-button{
            display: inline-block;
            width: 24%;
            height: 34px;
            line-height: 34px;
            font-size: 12px;
            border-radius: 3px;
            color: #fff;
            text-align: center;
            background-color: transparent;
            /*background-color: #41464b;*/
            outline: none;
            border: none;
            cursor: pointer;
            border: 1px solid transparent;
            &:hover{
              border: 1px solid #fff;
            }
          }
        }
      }
    }
  }
}

</style>
