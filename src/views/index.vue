<template>
  	<div class="editor-wrapper">  
  		<div class="edit-heading">
  			<h1 class="edit-heading-title">晚来天欲雨，可饮一杯无？</h1>
  			<router-link class="iconfont icon-add add-button" to="/add"></router-link>
  		</div>
    	<div class="editor-content">
	      	<div class="content-wrapper">
	      		<div class="content-list paper" v-for="item in articleList">
	      	  		<div class="paragraph" v-html="item.attributes.content" @click.stop="editOpt"></div>
	      	  		<p class="time">{{item.attributes.type === '1' ? '发布于' : '更新于'}}{{item.createdAt | formatTime}}</p>
	      		</div>
	      	</div>
	      	<div class="curved_box"></div>
    	</div>
  	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AV from 'leanengine';

export default {
  	data(){
    	return {
      
    	}
  	},
  	created() {
  		this.$store.dispatch('getArticleList')
  	},
  	computed: {
  		...mapGetters(['articleList'])
  	},
  	filters: {
  		formatTime(time) {
  			let date = time;
	  		let Y, M, D, h, m, s;
	  		Y = date.getFullYear() + '-';
	  		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	  		D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	  		h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	  		m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	  		s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	  		return Y + M + D + h + m + s;
  		}
  	},
  	methods: {
    	editOpt() {
    		this.$store.dispatch('editArticle')
    	}
  	}
}
</script>
 
<style lang="less" scoped>
.edit-heading-title{
	height: 100%;
	font-size: 20px;
}
.add-button{
	position: absolute;
	height: 100%;
	width: 50px;
	text-align: center;
	top: 0;
	right: 30px;
	font-size: 20px;
}
.content-list{
	width: 85%;
	padding: 20px 30px;
	margin: 50px auto 0;
	cursor: pointer;
	&:first-child{
		margin-top: 0;
	}
	.paragraph{
		max-height: 100px;
		font-size: 16px;
		letter-spacing: 2px;
		text-overflow: -o-ellipsis-lastline;
	  	overflow: hidden;
	  	text-overflow: ellipsis;
	  	display: -webkit-box;
	  	-webkit-line-clamp: 4;
	  	-webkit-box-orient: vertical;
  	}
  	.time{
		font-size: 13px;
		color: #999;
		margin-top: 15px;
		text-align: right;
  	}
}
</style>