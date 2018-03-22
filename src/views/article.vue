<template>
  <div class="editor-wrapper">
    <edit-header :type="type" :userid="article.userid" @add-img="addImg" @clear-html="clearHtml" @deltet-article="deleteArticleOpt" @add-article="submitArticleOpt"></edit-header>
    <div class="editor-content">
      <div id="content-wrapper" class="content-wrapper article-content" contenteditable="true" v-html="article.content"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editHeader from '../components/editHeader.vue'

export default {
  data(){
    return {
      contentWrapper: null,
      type: '1'
    }
  },
  components: {
    editHeader
  },
  created() {
    if (!this.userInfo) {
      this.$router.replace({path: '/'});
      Func.toast('请登录');
    }
  },
  mounted() {
    this.contentWrapper = document.getElementById('content-wrapper');
    this.fetchData();
  },
  computed: {
      ...mapGetters(['article', 'userInfo']),
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      let id = this.$route.query.id || null;
      this.type = id ? '2' : '1';
      if (this.type === '1') {
        this.contentWrapper.focus();
      }
      this.contentWrapper.innerHTML = '';
      this.$store.dispatch('getArticle', id);
    },
    insertHtmlAtCaret(str) {
      let that = this;
      let sel, range;
      if(window.getSelection){
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          let el = document.createElement("div");
          el.innerHTML = str;
          let frag = document.createDocumentFragment(), node, lastNode;
          while ( (node = el.firstChild) ) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if(lastNode){
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(str);
      }
    },
    getPicSrc(str) {
      let picArr = [];
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      let arr = str.match(imgReg);
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          let src = arr[i].match(srcReg);
          if (src[1]) {
            picArr.push(src[1]);
          }
        }
        return picArr[0];
      } else {
        return '';
      }
    },
    addImg(url) {
      this.contentWrapper.focus();
      let flg = '<img src="'+url+'">';
      this.insertHtmlAtCaret(flg);
    },
    clearHtml() {
      this.contentWrapper.innerHTML = '';
    },
    deleteArticleOpt() {
      if (this.$route.query.id) {
        this.$store.dispatch('deleteArticle', this.$route.query.id);
      }
    },
    submitArticleOpt() {
      if (!this.userInfo) {
        this.$router.push({path: '/login'});
        Func.toast('请重新登录');
        return;
      }
      if (this.contentWrapper.innerHTML) {
        let picSrc = this.getPicSrc(this.contentWrapper.innerHTML);
        let option = {
          type: this.type, 
          pic: picSrc, 
          content: this.contentWrapper.innerHTML,
          userid: this.userInfo.objectId
        };
        if (this.$route.query.id) {
          option.id = this.$route.query.id;
        }
        this.$store.dispatch('submitArticle', option);
      } 
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