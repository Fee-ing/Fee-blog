<template>
  <div class="page-wrapper editor-wrapper">
    <div class="page-header">
      <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      <div class="page-header-content">
        <edit-header :type="type"  @add-img="addImg" @clear-html="clearHtml" @deltet-article="deleteArticleOpt" @add-article="submitArticleOpt"></edit-header>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <div id="content-wrapper" class="content-wrapper article-content" contenteditable="true"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import editHeader from '../components/editHeader.vue'

export default {
  data () {
    return {
      contentWrapper: null,
      type: '1'
    }
  },
  components: {
    editHeader
  },
  created () {
    this.contentWrapper = document.getElementById('content-wrapper')
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    insertHtmlAtCaret (str) {
      let sel, range
      if (window.getSelection) {
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()
          let el = document.createElement('div')
          el.innerHTML = str
          let frag = document.createDocumentFragment()
          let node
          let lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          range.insertNode(frag)
          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      } else if (document.selection && document.selection.type !== 'Control') {
        document.selection.createRange().pasteHTML(str)
      }
    },
    getPicSrc (str) {
      let picArr = []
      let imgReg = /<img.*?(?:>|\/>)/gi
      let srcReg = /src=['"]?([^'"]*)['"]?/i
      let arr = str.match(imgReg)
      if (arr) {
        arr.forEach(element => {
          let src = element.match(srcReg)
          if (src[1]) {
            picArr.push(src[1])
          }
        })
        return picArr[0]
      } else {
        return ''
      }
    },
    addImg (url) {
      this.contentWrapper.focus()
      let flg = '<img src="' + url + '">'
      this.insertHtmlAtCaret(flg)
    },
    clearHtml () {
      this.contentWrapper.innerHTML = ''
    },
    deleteArticleOpt () {
      if (this.$route.query.id) {
        this.$store.dispatch('deleteArticle', this.$route.query.id)
      }
    },
    submitArticleOpt () {
      if (this.contentWrapper.innerHTML) {
        let picSrc = this.getPicSrc(this.contentWrapper.innerHTML)
        let option = {
          type: this.type,
          pic: picSrc,
          content: this.contentWrapper.innerHTML,
          userid: this.userInfo.objectId
        }
        if (this.$route.query.id) {
          option.id = this.$route.query.id
        }
        this.$store.dispatch('submitArticle', option)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper{
  .page-body-content{
    height: 100%;
    .content-wrapper{
      border: none;
      outline: none;
    }
  }
}
</style>
