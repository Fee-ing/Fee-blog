<template>
  	<div class="editor-wrapper" @click="closeUser">  
  		<div class="edit-heading">
  			<template v-if="userInfo">
	  			<a class="heading-button login-button" :title="userInfo.nickname ? '帐号：'+userInfo.username : ''" @click.stop="showUser">
	  				<div class="avatar" v-if="userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
	  				<div class="avatar avatar-default" v-else></div>
	  				<span class="name">{{userInfo.nickname ? userInfo.nickname : userInfo.username}}</span>
	  			</a>
	  			<ul class="user-wrapper" v-show="userInfo && isShowUser">
	  				<!-- <li class="user-item"><a class="user-item-btn">我的主页</a></li> -->
	  				<li class="user-item"><router-link class="user-item-btn" to="/setting">个人资料</router-link></li>
	  				<li class="user-item"><a class="user-item-btn" @click="logoutOpt">退出登录</a></li>
	  			</ul>
  			</template>
  			<router-link class="heading-button login-button" to="/login" v-else-if="!userInfo">
				<div class="avatar avatar-default"></div>
  				<span class="name">登录/注册</span>
  			</router-link>
  			<h1 class="edit-heading-title" @click="refresh">Say&nbsp;&nbsp;&nbsp;Something</h1>
  			<a class="iconfont icon-add heading-button add-button" @click="addArticle"></a>
  		</div>
    	<div class="editor-content">
	      	<div id="content-wrapper" class="content-wrapper">
	      		<div class="content-list" v-for="item in articleList">
	      			<div class="list-wrapper flexbox" @click="showParagraph">
	      				<div class="first-img" v-if="item.attributes.pic" :style="{ backgroundImage: 'url(' + item.attributes.pic + ')'}"></div>
	      	  			<div class="paragraph flexbox" v-html="item.attributes.content"></div>
	      			</div>
	      			<div class="option-wrapper">
	      				<router-link class="option-btn iconfont icon-bianji" v-if="userInfo && item.attributes.userid === userInfo.objectId" :to="{ path:'/article', query: {id: item.id} }">编辑</router-link>  
	      				<span class="time">{{item.attributes.type === '1' ? '发布于' : '更新于'}}{{item.createdAt | formatTime}}</span>
	      			</div>
	      		</div>
	      	</div>

    	</div>
    	<a class="iconfont icon-fanhuidingbu goTop centerVertical" v-show="scrollTop && windowHeight && scrollTop > windowHeight/2" @click="goTop"></a>
  	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Func from '../assets/js/common.js'

export default {
  	data(){
    	return {
      		isShowUser: false,
      		contentWrapper: null,
      		windowHeight: 0,
      		scrollTop: 0
    	}
  	},
  	created() {
  		this.$store.dispatch('getArticleList');
  		if (this.userInfo) {
  			this.$store.dispatch('getUser', {id: this.userInfo.objectId, sessionToken: this.userInfo.sessionToken});
  		}
  		
  	},
  	mounted() {
  		this.contentWrapper = document.getElementById('content-wrapper');
  		this.windowHeight = document.body.clientHeight || document.documentElement.clientHeight;
  		this.contentWrapper.addEventListener('scroll', this.scrollOpt);
  	},
  	computed: {
  		...mapGetters(['articleList']),
  		...mapGetters(['userInfo'])
  	},
  	filters: {
  		formatTime: Func.formatTime
  	},
  	methods: {
  		refresh() {
  			this.$store.dispatch('getArticleList')
  		},
  		showUser() {
  			let bol = !this.isShowUser;
  			this.isShowUser = bol;
  		},
  		closeUser() {
  			if (this.isShowUser) {
  				this.isShowUser = false;
  			}
  		},
  		scrollOpt() {
  			this.scrollTop = this.contentWrapper.scrollTop;
  		},
  		goTop() {
  			this.contentWrapper.scrollTop = 0;
  		},
  		showParagraph() {
  			if (event.currentTarget.className.indexOf('open') >= 0) {
  				event.currentTarget.className = 'list-wrapper flexbox';
  			}else {
  				event.currentTarget.className = 'list-wrapper flexbox open';
  			}
  		},
  		logoutOpt() {
  			this.$store.dispatch('logout')
  		},
  		addArticle() {
  			if (this.userInfo) {
  				this.$router.push({path: '/article'});
  			} else {
  				this.$router.push({path: '/login'});
  			}
  		}
  	}
}
</script>
 
<style lang="less" scoped>
.edit-heading-title{
	display: inline-block;
	height: 100%;
	font-size: 18px;
	cursor: pointer;
}
.user-wrapper{
	position: absolute;
	left: 10px;
	top: 48px;
	padding: 15px 20px;
	background: #fff;
  	box-shadow: 0 1px 6px rgba(99,99,99,.2);
  	border: 1px solid rgba(99,99,99,.2);
  	border-radius: 7px;
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
	.user-item{
		height: auto;
		.user-item-btn{
			display: block;
			height: 34px;
			line-height: 34px;
			font-size: 14px;
			&:hover{
				color: #666;
			}
		}
	}
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
.goTop{
	position: fixed;
	right: 50px;
	bottom: 100px;
	z-index: 100;
	width: 50px;
	height: 50px;
	background-color: #555;
	border-radius: 50%;
	&::before{
		color: #fff;
	}
	&:hover{
		background-color: #666;
	}
}
.content-list{
	width: 85%;
	padding: 20px 30px;
	margin: 50px auto 0;
	border: 1px solid #c4c6ca;
	border-radius: 10px;
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
		max-height: 100px;
		overflow: hidden;
		.first-img{
			width: 180px;
			height: 100px;
			background-color: #fff;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			margin-right: 15px;
			border-radius: 3px;
		}
		.paragraph{
			-webkit-box-flex: 1;
		    -moz-box-flex: 1;             
		    -webkit-flex: 1;    
		    -ms-flex: 1;
		    flex: 1;
			font-size: 15px;
			letter-spacing: 2px;
			text-overflow: -o-ellipsis-lastline;
		  	text-overflow: ellipsis;
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
			font-size: 12px;
			color: #999;
			float: right;
			margin-top: 5px;
	  	}
	}
  	
}
</style>