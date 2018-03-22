<template lang="html">
  <div class="edit-heading">
    <router-link class="iconfont icon-fanhui heading-button back-button" to="/">返回</router-link>
    <div class="edit-heading-container">
      <ul class="editbar-list">
        <li class="editbar-list-item">
          <button type="button" unselectable="on" class="toolbar-item undo" title="撤销" data-key="undo" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item redo" title="重做" data-key="redo" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item clear-format" title="清除格式" data-key="removeFormat" @click.stop="editOpt"></button>
        </li>
        <li class="separator editbar-list-item"></li>
        <li class="editbar-list-item">
          <ul class="toolbar-menu toolbar-menu-list toolbar-text-list" v-show="fontsizeBol">
            <li class="menu-list-item"><button type="button" unselectable="on" title="10px" @click.stop="fontSize('1','10px')">10px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="13px" @click.stop="fontSize('2','13px')">13px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="16px" @click.stop="fontSize('3','16px')">16px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="18px" @click.stop="fontSize('4','18px')">18px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="24px" @click.stop="fontSize('5','24px')">24px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="32px" @click.stop="fontSize('6','32px')">32px</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="48px" @click.stop="fontSize('7','48px')">48px</button></li>
          </ul>
          <ul class="toolbar-menu toolbar-color-list" v-if="fontcolorBol">
            <li class="color-list-item" v-for="item in colorList"><button type="button" unselectable="on" :style="{ backgroundColor: '#'+item.color }" :title="item.title" @click.stop="fontColor('#'+item.color)"></button></li>
          </ul>
          <ul class="toolbar-menu toolbar-color-list toolbar-color-list1" v-if="backcolorBol">
            <li class="color-list-item" v-for="item in colorList"><button type="button" unselectable="on" :style="{ backgroundColor: '#'+item.color }" :title="item.title" @click.stop="backColor('#'+item.color)"></button></li>
          </ul>
          <ul class="toolbar-menu toolbar-menu-list toolbar-align-list" v-if="alignBol">
            <li class="menu-list-item"><button type="button" unselectable="on" title="左对齐" @click.stop="alignOpt('justifyLeft')"><span class="menu-list-left"></span></button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="居中" @click.stop="alignOpt('justifyCenter')"><span class="menu-list-center"></span></button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="右对齐" @click.stop="alignOpt('justifyRight')"><span class="menu-list-right"></span></button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="两端对齐" @click.stop="alignOpt('justifyFull')"><span class="menu-list-justify"></span></button></li>
          </ul>
          <button type="button" unselectable="on" class="toolbar-item toolbar-item-select font" title="文字" @click.stop="getFontsize">
            {{fontsizeText}}
            <span class="new-icon-down"></span>
          </button>
          <button type="button" unselectable="on" class="toolbar-item bold" title="粗体" data-key="bold" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item italic" title="斜体" data-key="italic" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item underline" title="下划线" data-key="underline" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item strikethrough" title="中划线" data-key="strikethrough" @click.stop="editOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item link" title="超链接" data-key="createLink" @click.stop="createLinkOpt"></button>
          <button type="button" unselectable="on" class="toolbar-item toolbar-item-select fontcolor" title="字体颜色" @click.stop="getFontcolor">
            <span class="new-icon-down"></span>
            <span class="line" :style="{ backgroundColor: fontColorText }"></span>
          </button>
          <button type="button" unselectable="on" class="toolbar-item toolbar-item-select backcolor" title="背景颜色" @click.stop="getBackcolor">
            <span class="new-icon-down"></span>
            <span class="line" :style="{ backgroundColor: backColorText }"></span>
          </button>
          <button type="button" unselectable="on" class="toolbar-item toolbar-item-select align-toolbar" :class="alignText" title="对齐" @click.stop="getAlign"><span class="new-icon-down"></span></button>
        </li>
        <li class="separator editbar-list-item"></li>
        <li class="editbar-list-item">
          <ul class="toolbar-menu toolbar-menu-list toolbar-text-list" v-if="textBol">
            <li class="menu-list-item"><button type="button" unselectable="on" title="段落" @click.stop="addText('p')">段落</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="大标题" @click.stop="addText('h1')">大标题</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="中标题" @click.stop="addText('h2')">中标题</button></li>
            <li class="menu-list-item"><button type="button" unselectable="on" title="小标题" @click.stop="addText('h3')">小标题</button></li>
          </ul>
          <button type="button" unselectable="on" class="toolbar-item toolbar-item-select font" title="文字" @click.stop="getText">文字<span class="new-icon-down"></span></button>
          <button type="button" unselectable="on" class="toolbar-item image" title="图片">
            <input type="file" accept="*.png,*.jpg,*.jpeg,*gif" unselectable="on" class="image-input" @change.stop="addImg">
          </button>
          <button type="button" unselectable="on" class="toolbar-item button edit-button" title="清空内容" @click.stop="clearOpt">清空内容</button>
          <button type="button" unselectable="on" class="toolbar-item button edit-button" title="删除文章" v-if="type === '2' && userid === userInfo.objectId" @click.stop="deleteOpt">删除文章</button>
          <button type="button" unselectable="on" class="toolbar-item button edit-button" title="保存" @click.stop="saveOpt">保存</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import lrz from 'lrz'
import Func from '../assets/js/common.js'
import { mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: '1'
    },
    userid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      colorList: [{color:'ffffff',title:'白'},{color:'0d0015',title:'漆黑'},{color:'fe2c23',title:'红'},{color:'ff9900',title:'橙'},{color:'ffd900',title:'黄'},{color:'a3e043',title:'葱绿'},{color:'37d9f0',title:'湖蓝'},
                  {color:'4da8ee',title:'天蓝'},{color:'aa17d0',title:'紫'},{color:'f3f3f1',title:'白练'},{color:'949494',title:'鼠灰'},{color:'fcdbd6',title:'虹'},{color:'fde9d0',title:'薄卵'},{color:'fff0cf',title:'蒸栗'},
                  {color:'d4e9d6',title:'白绿'},{color:'def3f3',title:'蓝白'},{color:'cee0ef',title:'天空'},{color:'dfdbec',title:'紫水晶'},{color:'dcdedd',title:'白鼠'},{color:'595856',title:'墨'},{color:'ee837d',title:'甚三红'},
                  {color:'f8c387',title:'雄黄'},{color:'e6b322',title:'金色'},{color:'9abd9d',title:'薄青'},{color:'83ccd2',title:'白群'},{color:'89b0ce',title:'薄花'},{color:'9389b1',title:'紫苑'},{color:'c1c6ca',title:'灰青'},
                  {color:'41464b',title:'石墨'},{color:'d51228',title:'绯红'},{color:'cf770b',title:'红金'},{color:'8d634a',title:'枯茶'},{color:'557b5c',title:'绿青'},{color:'01a3b0',title:'浅葱'},{color:'3776a6',title:'薄缥'},
                  {color:'765c83',title:'紫霞'},{color:'adadad',title:'薄钝'},{color:'2b2b2b',title:'黑'},{color:'a91913',title:'朱绯'},{color:'884702',title:'褐'},{color:'563725',title:'黑茶'},{color:'00552e',title:'深绿'},
                  {color:'00767a',title:'苍蓝'},{color:'194e77',title:'琉璃'},{color:'530e6f',title:'葡萄'}
                ],
      fontsizeBol: false,
      fontcolorBol: false,
      backcolorBol: false,
      alignBol: false,
      textBol: false,
      fontsizeText: '字号',
      fontColorText: 'transparent',
      backColorText: 'transparent',
      alignText: '',
      pic: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  	let that = this;
  	document.onclick = function(e) {
      if (e.target.className === 'link-blank' && e.target.getAttribute('href')) {
        window.open(e.target.getAttribute('href'));
      }
  	  that.init();
  	}
  },
  methods: {
    init(){
      this.fontsizeText = '字号';
      this.fontColorText = 'transparent';
      this.backColorText = 'transparent';
      this.alignText = '';
      this.fontsizeBol = false;
      this.alignBol = false;
      this.backcolorBol = false;
      this.fontcolorBol = false;
      this.textBol = false;
      this.clearStyle();
    },
    clearStyle(){
      let toolbarItem = document.querySelectorAll('.toolbar-item');
      for (let i = 0, len = toolbarItem.length; i < len; i++) {
      	if (toolbarItem[i].className.match(new RegExp('(\\s|^)active(\\s|$)'))) {
      	  let reg = new RegExp('(\\s|^)active(\\s|$)');
          toolbarItem[i].className = toolbarItem[i].className.replace(reg, ' ');
      	}
      }
    },
    getFontsize(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      this.alignBol = false;
      this.backcolorBol = false;
      this.fontcolorBol = false;
      this.textBol = false;
      let bol = this.fontsizeBol;
      this.fontsizeBol = !bol;
    },
    getFontcolor(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      this.fontsizeBol = false;
      this.alignBol = false;
      this.textBol = false;
      this.backcolorBol = false;
      let bol = this.fontcolorBol;
      this.fontcolorBol = !bol;
    },
    getBackcolor(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      this.fontsizeBol = false;
      this.alignBol = false;
      this.textBol = false;
      this.fontcolorBol = false;
      let bol = this.backcolorBol;
      this.backcolorBol = !bol;
    },
    getAlign(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      this.fontsizeBol = false;
      this.textBol = false;
      this.backcolorBol = false;
      this.fontcolorBol = false;
      let bol = this.alignBol;
      this.alignBol = !bol;
    },
    getText(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      this.fontsizeBol = false;
      this.alignBol = false;
      this.backcolorBol = false;
      this.fontcolorBol = false;
      let bol = this.textBol;
      this.textBol = !bol;
    },
    editOpt(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      let that = e.currentTarget;
      let key = that.getAttribute('data-key');
      document.execCommand(key,false,null);
    },
    createLinkOpt(e){
      this.clearStyle()
      e.currentTarget.className += ' active';
      let sText = document.getSelection();
      if (sText.toString().replace(/(^\s*)|(\s*$)/g, '') === '') {
        return
      }
      let url = window.prompt("请输入链接", "http://");
      document.execCommand('insertHTML', false, '<a class="link-blank" href="' + url + '" target="_blank">' + sText + '</a>');
    },
    fontSize(size, text){
      document.execCommand('fontSize',false,size);
      this.fontsizeText = text;
    },
    fontColor(color){
      document.execCommand('ForeColor',false,color);
      this.fontColorText = color;
    },
    backColor(color){
      document.execCommand('BackColor',false,color);
      this.backColorText = color;
    },
    alignOpt(type){
      document.execCommand(type,false,null);
      this.alignText = type;
    },
    addText(role){
      document.execCommand('formatBlock', false, '<' + role + '>');
    },
    addImg(){
      let that = this;
      lrz(event.currentTarget.files[0])
      .then(function (rst) {
        that.pic = rst.base64;
        that.$emit('add-img', rst.base64);
      })
      .catch(function (err) {
        Func.toast('图片上传失败');
      });
    },
    clearOpt(){
      this.$emit('clear-html');
    },
    deleteOpt(){
      let confirm = window.confirm('确认删除文章？');
      if (confirm) {
        this.$emit('deltet-article');
      }
    },
    saveOpt(){
      this.$emit('add-article');
    }
  }
}
</script>

<style lang="less" scoped>
.toolbar-menu{
  position: absolute;
  top: 48px;
  z-index: 22;
  background: #fff;
  text-align: left;
  box-shadow: 0 1px 6px rgba(99,99,99,.2);
  border: 1px solid rgba(99,99,99,.2);
  border-radius: 3px;
  padding: 0;
  margin: 0;
  &:after{
    content: " ";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #fff;
    top: -7px;
    background: none;
    left: 50%;
    margin-left: -6px;
  }
  button{
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background-color: transparent;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
  }
}
.toolbar-color-list{
  left: 88px;
  width: 197px;
  height: 117px;
  text-align: justify;
  padding: 5px 5px 10px 10px;
  &.toolbar-color-list1{
    left: 126px;
  }
  .color-list-item{
    position: relative;
    float: left;
    width: 17px;
    height: 17px;
    margin: 3px 3px 0 0;
    cursor: pointer;
    border: 1px solid transparent;
    button:hover{
      box-shadow: inset 0 0 0 1px #d6d6d6;
    }
  }
}
.toolbar-menu-list{
  left: -20px;
  &.toolbar-text-list{
    left: -13px;
  }
  &.toolbar-align-list{
    left: 226px;
    span{
      display: inline-block;
      height: 100%;
      width: 27px;
      background-image: url(../assets/imgs/editor.png);
      background-repeat: no-repeat;
      background-size: 800px 100px;
      &.menu-list-left{
        background-position: -331px 0;
      }
      &.menu-list-center{
        background-position: -361px 0;
      }
      &.menu-list-right{
        background-position: -391px 0;
      }
      &.menu-list-justify{
        background-position: -421px 0;
      }
    }
  }
  .menu-list-item{
    position: relative;
    padding: 0 10px;
    min-width: 70px;
    height: 27px;
    line-height: 28px;
    color: #666;
    cursor: pointer;
    text-align: center;
    &:hover{
      box-shadow: inset 0 0 0 1px #d6d6d6;
    }
  }
}
.editbar-list{
  height: 100%;
  padding: 0;
  margin: 0;
  .editbar-list-item{
    user-select: none;
    float: left;
    height: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    position: relative;
    &.separator{
      border-left: 1px solid #bebebe;
      width: 0;
      height: 18px;
      margin: 16px 10px;
    }
    .toolbar-item{
      display: inline-block;
      vertical-align: top;
      width: 30px;
      height: 27px;
      line-height: 28px;
      outline: none;
      border: none;
      background-color: transparent;
      background-image: url(../assets/imgs/editor.png);
      background-repeat: no-repeat;
      background-size: 800px 100px;
      position: relative;
      &:hover, &.active{
        border-radius: 1px;
        box-shadow: inset 0 0 0 1px #d6d6d6;
        background-color: #e5e5e5;
      }
      &.toolbar-item-select{
        width: 38px;
      }
      &.undo{
        background-position: 0 0;
      }
      &.redo{
        background-position: -30px 0;
      }
      &.paint-format{
        background-position: -479px -27px;
      }
      &.clear-format{
        background-position: -509px -27px;
      }
      &.bold{
        background-position: -60px 0;
      }
      &.italic{
        background-position: -90px 0;
      }
      &.underline{
        background-position: -120px 0;
      }
      &.strikethrough{
        background-position: 0 -27px;
      }
      &.fontcolor{
        background-position: -150px 0;
      }
      &.backcolor{
        background-position: -30px -27px;
      }
      &.align-toolbar{
        background-position: -330px 0;
        &.justifyCenter{
          background-position: -361px 0;
        }
        &.justifyRight{
          background-position: -391px 0;
        }
        &.justifyFull{
          background-position: -421px 0;
        }
      }
      &.link{
        background-position: -451px 0;
      }
      &.image{
        background-position: -511px 0;
        position: relative;
        .image-input{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          font-size: 0;
          cursor: pointer;
        }
      }
      &.font{
        background-image: none;
        color: #333;
        font-size: 12px;
        text-align: left;
        width: 48px;
        padding-left: 6px;
        line-height: 25px;
      }
      &.fee{
        background-position: -601px 0;
      }
      &.card-list{
        background-position: -241px -54px;
      }
      &.card-block{
        background-position: -481px 0;
      }
      &.button{
        width: auto;
        padding: 0 8px;
        background-image: none;
        color: #333;
        font-size: 12px;
        text-align: center;
      }
      .new-icon-down{
        position: absolute;
        width: 5px;
        height: 100%;
        background-image: url(../assets/imgs/editor.png);
        background-repeat: no-repeat;
        background-size: 800px 100px;
        background-position: -642px 0;
        right: 7px;
        top: 0;
      }
      .toolbar-select{
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        opacity: 0;
      }
      .line{
        position: absolute;
        bottom: 3px;
        width: 11px;
        height: 2px;
        left: 9px;
        background-color: transparent;
      }
    }
  }
}
</style>