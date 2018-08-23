<template>
  <div class="page-wrapper editor-wrapper">
    <div class="page-header">
      <div class="common-btn back-btn" @click="$router.go(-1)">返回</div>
      <div class="page-header-content">
        <edit-header v-if="type === '1' || showDelete" :showDelete="showDelete"  @add-img="addImg" @clear-html="clearOpt" @deltet-blog="deleteOpt" @add-blog="submitOpt"></edit-header>
      </div>
    </div>
    <div class="page-body">
      <div class="page-body-content">
        <userCommon v-if="author" :userInfo="author">
          <template slot="user-others">
            <div class="info-item">作者</div>
          </template>
        </userCommon>
        <div id="content-wrapper" class="content-wrapper" :contenteditable="type === '1' || showDelete" v-html="blogData.content"></div>
        <div class="blog-info" v-if="type === '2'">
          <div class="blog-options">
            <div class="blog-time">{{blogData.type === '1' ? `${formatTime(blogData.createdAt)}发布` : `${formatTime(blogData.updatedAt)}更新`}}</div>
            <div class="blog-view">浏览 {{blogData.view}} 次</div>
            <div class="favor-btn common-btn" @click="likeOpt">{{likeData.isLiked ? '已' : ''}}喜欢</div>
          </div>
          <div class="blog-likes blog-common" v-if="likeData.list.length > 0">
            <div class="title">喜欢（{{likeData.list.length}}人）：</div>
            <div class="likes-conent">
              <div class="likes-item" v-for="(item, index) in likeData.list" :key="index">
                <div class="likes-info">
                  <userCommon :userInfo="item" class="small-avatar"></userCommon>
                </div>
              </div>
            </div>
          </div>
          <div class="blog-comments blog-common">
            <div class="title">评论（{{comments.length}}条）：</div>
            <div class="comments-content">
              <textarea cols="30" rows="3" placeholder="不超过100字" class="comments-input" v-model="commentContent"></textarea>
              <div class="comments-options">
                <div class="comments-tips"></div>
                <div class="comments-btn common-btn" @click="commentOpt">提交评论</div>
              </div>
              <div class="comments-list">
                <div class="comments-item" v-for="(item, index) in comments" :key="index">
                  <div class="comments-user">
                    <userCommon :userInfo="item" class="small-avatar"></userCommon>
                    <div class="comments-time">{{formatTime(item.time)}}</div>
                  </div>
                  <div class="comments-detail">{{item.comment}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '../plugins/func'

import editHeader from '../components/editHeader.vue'
import userCommon from '../components/userCommon.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('blog')

export default {
  data () {
    return {
      contentWrapper: null,
      type: '1',
      commentContent: ''
    }
  },
  components: {
    editHeader,
    userCommon
  },
  async created () {
    if (this.$route.query.blogid) {
      this.type = '2'
    } else {
      this.type = '1'
    }
    await this.getBlog({type: this.type, blogid: this.$route.query.blogid || ''})
    if (this.type === '2' && this.blogData.userid !== this.userInfo.objectId) {
      this.viewBlog()
    }
  },
  mounted () {
    this.contentWrapper = document.getElementById('content-wrapper')
    if (!this.$route.query.blogid) {
      this.contentWrapper.focus()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'blogData', 'author', 'showDelete', 'likeData', 'comments'])
  },
  methods: {
    ...mapActions(['getBlog', 'createBlog', 'updateBlog', 'deleteBlog', 'likeBlog', 'unlikeBlog', 'viewBlog', 'commentBlog']),
    formatTime,
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
      let paragraph = blog.replace(imgReg, '')
      if (paragraph.length > 150) {
        paragraph = paragraph.substr(0, 150) + '...<span class="blog-more">查看更多</span>'
      }
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
    async deleteOpt () {
      let res = await this.deleteBlog()
      if (res) {
        this.$toast({
          title: '删除成功'
        })
        this.$router.go(-1)
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
          view: 0
        },
        params2: {
          content: blog,
          view: 0
        },
        user: {
          userid: this.userInfo.objectId,
          nickname: this.userInfo.nickname,
          avatar: this.userInfo.avatar || '',
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
      } else if (this.type === '2' && this.$route.query.blogid && this.userInfo.objectId === this.blogData.userid) {
        let res = await this.updateBlog(params)
        if (res) {
          this.$toast({
            title: '更新成功'
          })
          this.$router.go(-1)
        }
      }
    },
    likeOpt () {
      let params = {
        userid: this.userInfo.objectId,
        nickname: this.userInfo.nickname,
        avatar: this.userInfo.avatar || ''
      }
      if (this.likeData.isLiked) {
        this.unlikeBlog(params)
      } else {
        this.likeBlog(params)
      }
    },
    async commentOpt () {
      let comment = this.commentContent.replace(/(^\s*)|(\s*$)/, '')
      if (comment === '') {
        return
      }
      if (comment.length > 100) {
        this.$toast({
          title: '评论不超过100字'
        })
        return
      }
      let params = {
        userid: this.userInfo.objectId,
        nickname: this.userInfo.nickname,
        avatar: this.userInfo.avatar || '',
        comment,
        time: new Date()
      }
      let res = await this.commentBlog(params)
      if (res) {
        this.commentContent = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.editor-wrapper{
  .page-body-content{
    .content-wrapper{
      border: none;
      outline: none;
      padding: 20px 40px;
    }
    .blog-info{
      padding: 0 40px;
      .blog-options{
        display: flex;
        align-items: center;
        font-size: 11px;
        .blog-time{
          flex: 1;
          color: @gray;
        }
        .blog-view{
          color: @gray;
          margin-right: 15px;
        }
        .favor-btn{
          font-size: 11px;
        }
      }
      .blog-common{
        margin-top: 30px;
        .title{
          font-size: 13px;
          font-weight: bold;
        }
      }
      .blog-likes{
        .likes-conent{
          font-size: 11px;
          padding-left: 15px;
          .likes-item{
            display: inline-block;
            height: 25px;
            margin-top: 10px;
            margin-left: 10px;
            &:first-child{
              margin-left: 0;
            }
            .likes-info{
              display: flex;
              align-items: center;
            }
          }
        }
      }
      .blog-comments{
        .comments-content{
          font-size: 12px;
          padding-left: 15px;
          .comments-input{
            display: block;
            width: 100%;
            margin-top: 15px;
            border-color: @gray;
            border-radius: 4px;
            resize: none;
            font-size: 12px;
            padding: 5px 8px;
            outline: none;
            transition: all 0.2s;
            &:focus{
              border-color: @black;
            }
          }
          .comments-options{
            display: flex;
            align-items: center;
            margin-top: 10px;
            .comments-tips{
              flex: 1;
            }
            .comments-btn{
              font-size: 11px;
            }
          }
          .comments-list{
            margin-top: 15px;
            .comments-item{
              margin-top: 20px;
              .comments-user{
                display: flex;
                align-items: center;
                margin-right: 10px;
                .comments-time{
                  font-size: 11px;
                  flex: 1;
                  text-align: right;
                  color: @gray;
                }
              }
              .comments-detail{
                padding-left: 30px;
                color: @gray;
              }
            }
          }
        }
      }
    }
  }
}
</style>
