<template>
  	<div class="editor-wrapper">  
  		<div class="edit-heading">
  			<a class="iconfont icon-people heading-button login-button" v-if="userInfo">{{userInfo.username}}</a>
  			<router-link class="iconfont icon-people heading-button login-button" to="/login" v-else-if="!userInfo">登录/注册</router-link>
  			<h1 class="edit-heading-title" @click="refresh">晚来天欲雨，可饮一杯无？</h1>
  			<router-link class="iconfont icon-add heading-button add-button" to="/article"></router-link>
  		</div>
    	<div class="editor-content">
	      	<div class="content-wrapper">
	      		<div class="content-list paper" v-for="item in articleList">
	      			<div class="list-wrapper" @click.stop="showParagraph">
	      				<div class="first-img" v-if="item.attributes.pic" :style="{ backgroundImage: 'url(' + item.attributes.pic + ')'}"></div>
	      	  			<div class="paragraph" v-html="item.attributes.content"></div>
	      			</div>
	      			<div class="option-wrapper">
	      				<router-link class="option-btn iconfont icon-bianji" :to="{ path:'/article', query: {id: item.id} }">编辑</router-link>  
	      				<span class="time">{{item.attributes.type === '1' ? '发布于' : '更新于'}}{{item.createdAt | formatTime}}</span>
	      			</div>
	      		</div>
	      	</div>
	      	<div class="curved_box"></div>
    	</div>
  	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  	data(){
    	return {
      
    	}
  	},
  	created() {
  		this.$store.dispatch('getArticleList')
  	},
  	computed: {
  		...mapGetters(['articleList']),
  		...mapGetters(['userInfo'])
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
  		refresh() {
  			this.$store.dispatch('getArticleList')
  		},
  		showParagraph() {
  			if (event.currentTarget.className.indexOf('open') >= 0) {
  				event.currentTarget.className = 'list-wrapper';
  			}else {
  				event.currentTarget.className = 'list-wrapper open';
  			}
  		}
  	}
}
</script>
 
<style lang="less" scoped>
.edit-heading-title{
	display: inline-block;
	height: 100%;
	marign: 0 auto;
	font-size: 18px;
	cursor: pointer;
}
.login-button{
	left: 30px;
	font-size: 12px;
	&:before{
		font-size: 22px;
	}
}
.add-button{
	right: 30px;
}
.content-list{
	width: 85%;
	padding: 20px 30px;
	margin: 50px auto 0;
	&:first-child{
		margin-top: 0;
	}
	&::before{
	    webkit-transform: rotate(-2deg);
	    -moz-transform: rotate(-2deg);
	    -ms-transform: rotate(-2deg);
	    -o-transform: rotate(-2deg);
	    transform: rotate(-2deg);
	    left: -4px;
	}
	&::after{
	    webkit-transform: rotate(1.5deg);
	    -moz-transform: rotate(1.5deg);
	    -ms-transform: rotate(1.5deg);
	    -o-transform: rotate(1.5deg);
	    transform: rotate(1.5deg);
	    left: 4px;
	}
	.list-wrapper{
		display: flex;
		display: -webkei-flex;
		max-height: 100px;
		overflow: hidden;
		.first-img{
			width: 180px;
			height: 100px;
			background-color: #fff;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			margin-right: 10px;
			border-radius: 3px;
		}
		.paragraph{
			flex: 1;
			-webkit-flex: 1;
			font-size: 16px;
			letter-spacing: 2px;
			text-overflow: -o-ellipsis-lastline;
		  	text-overflow: ellipsis;
		  	display: -webkit-box;
		  	-webkit-line-clamp: 4;
		  	-webkit-box-orient: vertical;
		  	cursor: pointer;
	  	}
		&.open{
			max-height: none;
			.first-img{
				display: none;
			}
			.paragraph{
				display: block;
				text-overflow: clip;
				-webkit-line-clamp: unset;
			}
		}
	}
	.option-wrapper{
		margin-top: 15px;
		overflow: hidden;
		cursor: pointer;
		.option-btn{
			font-size: 13px;
    		margin-left: 10px;
    		&:hover{
    			color: #666;
    		}
    		&.icon-bianji::before{
    			margin-right: 5px;
    		}
		}
		.time{
			font-size: 13px;
			color: #999;
			float: right;
	  	}
	}
  	
}
</style>