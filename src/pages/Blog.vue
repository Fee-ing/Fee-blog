<template>
  <div class="page-wrapper editor-wrapper">
    <div class="page-header">
      <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      <div class="page-header-content">
        <edit-header :type="type"  @add-img="addImg" @clear-html="clearOpt" @deltet-article="deleteOpt" @add-article="submitOpt"></edit-header>
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
import { mapState, mapActions } from 'vuex'
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
    if (this.$route.query.id) {
      this.type = '2'
    } else {
      this.type = '1'
    }
  },
  mounted () {
    this.contentWrapper = document.getElementById('content-wrapper')
    if (!this.$route.query.id) {
      this.contentWrapper.focus()
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions({
      createBlog: 'blog/createBlog',
      updateBlog: 'blog/updateBlog'
    }),
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
    getBlogInfo (blog) {
      let picArr = []
      let imgReg = /<img.*?(?:>|\/>)/gi
      let srcReg = /src=['"]?([^'"]*)['"]?/i
      let str = blog.replace(imgReg, '')
      let paragraph = str.length <= 150 ? str : str.slice(0, 150)
      let arr = blog.match(imgReg)
      if (arr) {
        arr.forEach(element => {
          let src = element.match(srcReg)
          if (src[1]) {
            picArr.push(src[1])
          }
        })
        return {
          cover: picArr[0],
          paragraph
        }
      } else {
        return {
          cover: '',
          paragraph
        }
      }
    },
    addImg (url) {
      this.contentWrapper.focus()
      let flg = '<img src="' + url + '">'
      this.insertHtmlAtCaret(flg)
    },
    clearOpt () {
      this.contentWrapper.innerHTML = ''
    },
    deleteOpt () {
      if (this.$route.query.id) {
        this.$store.dispatch('deleteArticle', this.$route.query.id)
      }
    },
    async submitOpt () {
      if (this.contentWrapper.innerHTML.replace(/(^\s*)|(\s*$)/, '') === '') {
        return
      }
      let blog = this.contentWrapper.innerHTML.replace(/(^\s*)|(\s*$)/, '').replace(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi, '')
      let blogInfo = this.getBlogInfo(blog)
      let params = {
        params1: {
          cover: blogInfo.cover,
          paragraph: blogInfo.paragraph,
          like: 0,
          comment: 0,
          view: 0,
          type: '1'
        },
        params2: {
          content: blog,
          likes: [],
          comments: [],
          view: 0,
          type: '1'
        },
        user: {
          userid: this.userInfo.objectId,
          nickname: this.userInfo.nickname,
          avatar: this.userInfo.avatar,
          location: this.userInfo.location || '',
          sign: this.userInfo.sign || ''
        }
      }
      if (this.type === '1') {
        let res = await this.createBlog(params)
        if (res) {
          this.$toast({
            title: '发布成功'
          })
          this.$router.go(-1)
        }
      } else if (this.type === '2' && this.$route.query.id) {
        params.id = this.$route.query.id
        let res = await this.updateBlog(params)
        if (res) {
          this.$toast({
            title: '更新成功'
          })
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper{
  .page-body-content{
    .content-wrapper{
      min-height: 200px;
      border: none;
      outline: none;
    }
  }
}
</style>
