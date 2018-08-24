<template>
  <div class="blog-wrapper" @click.stop="viewOpt">
    <div class="blog-header">
      <userCommon :userInfo="blogData" class="blog-user"></userCommon>
    </div>
    <div class="blog-body">
      <div v-if="blogData.cover" class="blog-cover background-image" :style="{ backgroundImage: 'url(' + blogData.cover + ')'}"></div>
      <div class="blog-paragraph" v-html="blogData.paragraph"></div>
    </div>
    <div class="blog-footer">
      <div class="blog-time">{{blogData.type === '1' ? `${formatTime(blogData.createdAt)}发布` : `${formatTime(blogData.updatedAt)}更新`}}</div>
      <div class="blog-info">
        <div class="info-item"><span>喜欢</span>{{blogData.like || 0}}</div>
        <div class="info-item"><span>评论</span>{{blogData.comment || 0}}</div>
        <div class="info-item"><span>浏览</span>{{blogData.view || 0}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '../plugins/func'

import userCommon from './userCommon.vue'

export default {
  props: {
    blogData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  components: {
    userCommon
  },
  methods: {
    formatTime,
    viewOpt () {
      let blogid = this.blogData.objectId || ''
      if (blogid) {
        this.$router.push({path: '/blog', query: {blogid}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/color.less';
.blog-wrapper{
  cursor: pointer;
  margin-bottom: 50px;
  .blog-body{
    display: flex;
    margin-top: 10px;
    padding-left: 40px;
    .blog-cover{
      width: 120px;
      height: 80px;
      border-radius: 4px;
      margin-right: 15px;
    }
    .blog-paragraph{
      flex: 1;
      .paragraph{
        display: inline-block;
      }
      .blog-more{
        color: @gray;
        font-size: 12px;
      }
    }
  }
  .blog-footer{
    display: flex;
    margin-top: 20px;
    padding-left: 40px;
    .blog-time{
      flex: 1;
      font-size: 11px;
      color: @gray;
    }
    .blog-info{
      .info-item{
        display: inline-block;
        font-size: 12px;
        margin-left: 10px;
        span{
          color: @gray;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
