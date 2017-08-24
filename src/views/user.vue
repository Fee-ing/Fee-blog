<template>
  	<div class="editor-wrapper">  
  		<div class="edit-heading">
  			<router-link class="iconfont icon-fanhui heading-button back-button" to="/">返回</router-link>
  			<h1 class="edit-heading-title">我的主页</h1>
  		</div>
    	<div class="editor-content editor-content-user">
    		<div class="userinfo-wrapper" v-if="userInfo">
    			<div class="userinfo-main flexbox">
    				<div class="userinfo-avatar avatar" v-if="userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
    				<div class="userinfo-avatar avatar avatar-default" v-else></div>
    				<div class="userinfo-ex flex1 flexbox">
    					<div class="userinfo-ex-item">昵称：{{userInfo.nickname}}{{userInfo.sex ? '（'+userInfo.sex+'）' : ''}}<span class="location">{{userInfo.location}}</span></div>
    					<div class="userinfo-ex-item">帐号：{{userInfo.username}}</div>
    					<div class="userinfo-ex-item">邮箱：{{userInfo.email ? userInfo.email : '未填写'}}</div>
    					<div class="userinfo-ex-item flexbox"><span>签名：</span><div class="flex1">{{userInfo.sign ? userInfo.sign : '未填写'}}</div></div>
    				</div>
    			</div>
    		</div>
    		<div class="tab-wrapper flexbox">
    			<a class="tab-item flex1 centerVertical" :class="{'active': name === 'userArticles'}" @click="changeTab('userArticles')">我的文章</a>
    			<a class="tab-item flex1 centerVertical" :class="{'active': name === 'userFavorArticles'}" @click="changeTab('userFavorArticles')">我点赞的文章</a>
    			<a class="tab-item flex1 centerVertical" :class="{'active': name === 'userCommentArticles'}" @click="changeTab('userCommentArticles')">我评论的文章</a>
    		</div>
	      	<div id="content-wrapper" class="content-wrapper">
	      		<div class="content-list" v-for="(item, index) in articles.articles" v-if="item.user">
	      			<div class="info-wrapper flexbox border-bottom">
	      				<div class="avatar info-avatar" v-if="item.user.avatar" :style="{ backgroundImage: 'url(' + item.user.avatar + ')'}"></div>
	      				<div class="avatar info-avatar avatar.avatar-default" v-else></div>
	      				<div class="info-content flex1">
	      					<div class="info-name"><b>{{item.user.nickname}}</b>&nbsp;&nbsp;{{item.user.location ? '('+item.user.location+')' : ''}}</div>
	      					<div class="info-sign">{{item.user.sign ? item.user.sign : '无'}}</div>
	      				</div>
	      				<router-link class="edit-btn verticalbox iconfont icon-bianji" v-if="userInfo && item.userid === userInfo.objectId" :to="{ path:'/article', query: {id: item.objectId} }">编辑</router-link>  
	      			</div>
	      			<div class="list-wrapper flexbox" @click="showParagraph">
	      				<div class="first-img" v-if="item.pic" :style="{ backgroundImage: 'url(' + item.pic + ')'}"></div>
	      	  			<div class="paragraph" v-html="item.content"></div>
	      			</div>
	      			<div class="option-wrapper verticalbox">
	      				<a class="option-btn iconfont" v-bind:class="item.likeUsers | isLike(userInfo)" @click="favorOpt(item.objectId, index)">{{item.likes > 0 ? item.likes : ''}}</a>
	      				<a class="option-btn iconfont icon-pinglun" @click="showComment(item.objectId, index)">{{item.commentsNumber > 0 ? item.commentsNumber : ''}}</a>
	      				<span class="time flex1">{{item.type === '1' ? '发布于' : '更新于'}}{{item.createdAt | formatTime}}</span>
	      			</div>
	      			<div class="comment-wrapper">
	      				<div class="comment-list-wrapper">
							     <template v-if="item.commentsNumber > 0">
                    <div class="comment-header"><span>留言区：</span></div>
		      					<div class="comment-list" v-for="i in item.comments">
			      					<div class="comment-info verticalbox">
			      						<template v-if="i.nickname && i.avatar">
			      							<div class="comment-avatar avatar" :style="{ backgroundImage: 'url(' + i.avatar + ')'}"></div>
				      						<span class="comment-name flex1" v-if="userInfo && userInfo.objectId === i.userid">{{i.nickname}}（作者）：</span>
				      						<span class="comment-name flex1" v-else>{{i.nickname}}：</span>
			      						</template>
			      						<span class="comment-time">{{i.time | formatTime}}</span></div>
			      					<p class="comment-content">{{i.comment}}</p>
			      				</div>
		      				</template>
		      				<p class="noCommentTip" v-else>暂无评论</p>
	      				</div>
	      				<div class="comment-input-wrapper flexbox">
	      					<input type="text" class="comment-input flex1" placeholder="不超过140字" maxlength="140">
	      					<a class="comment-btn option-button" @click="commenSubmit(item.objectId, index)">评论</a>
	      				</div>
	      			</div>
	      		</div>
	      		<a class="get-more" v-if="!articles.nomore" @click="getMore">加载更多</a>
            <p class="get-more no-more" v-else>没有更多了</p>
	      	</div>
    	</div>
    	<a class="iconfont icon-fanhuidingbu go-top centerVertical" v-show="scrollTop && windowHeight && scrollTop > windowHeight/2" @click="goTop"></a>
  	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Func from '../assets/js/common.js'

export default {
  	data(){
    	return {
      		name: 'userArticles',
      		contentWrapper: null,
      		windowHeight: 0,
      		scrollTop: 0
    	}
  	},
  	created() {
  		if (!this.userInfo) {
  			this.$router.replace({path: '/'});
        Func.toast('请登录');
  		}
  		this.$store.dispatch('getArticleList', {userid: this.userInfo.objectId, name: this.name, refresh: true});
  	},
  	mounted() {
  		this.contentWrapper = document.getElementById('content-wrapper');
  		this.windowHeight = document.body.clientHeight || document.documentElement.clientHeight;
  		this.contentWrapper.addEventListener('scroll', this.scrollOpt);
  	},
  	computed: {
  		...mapGetters(['userArticles']),
  		...mapGetters(['userFavorArticles']),
  		...mapGetters(['userCommentArticles']),
  		...mapGetters(['userInfo']),
  		articles() {
  			return this[this.name];
  		}
  	},
  	watch: {
	    '$route': 'init'
	  },
  	filters: {
  		formatTime: Func.formatTime,
  		isLike(arr, userInfo) {
  			if (arr && userInfo) {
  				if(arr.length <= 0) {
  					return 'icon-xihuan'
  				}
  				return arr.map(function(item) { 
	  				if (item === userInfo.objectId) {
	  					return 'icon-xihuan1'
	  				} else {
	  					return 'icon-xihuan'
	  				}
				});
  			} else {
  				return 'icon-xihuan'
  			}
  		}
  	},
  	methods: {
  		init() {			
  		  this.name = 'userArticles';
        if (!this.userInfo) {
          this.$router.replace({path: '/'});
          Func.toast('请登录');
          return;
        }
        this.$store.dispatch('getUser', {id: this.userInfo.objectId, sessionToken: this.userInfo.sessionToken});
  		},
  		scrollOpt() {
  			this.scrollTop = this.contentWrapper.scrollTop;
  		},
  		goTop() {
  			this.contentWrapper.scrollTop = 0;
  		},
  		getMore() {
  			if (!this.userInfo) {
	  			this.$router.replace({path: '/'});
	  			Func.toast('请重新登录');
	  			return;
	  		}
  			this.$store.dispatch('getUserArticle', {userid: this.userInfo.objectId, name: this.name});
  		},
  		showParagraph() {
  			if (event.currentTarget.className.indexOf('open') >= 0) {
  				event.currentTarget.className = 'list-wrapper flexbox';
  			}else {
  				event.currentTarget.className = 'list-wrapper flexbox open';
  			}
  		},
  		changeTab(name) {
  			this.name = name;
  			if (!this.userInfo) {
	  			Func.toast('请重新登录');
	  			return;
	  		}
  			this.$store.dispatch('getArticleList', {userid: this.userInfo.objectId, name: this.name, refresh: true});
  		},
  		favorOpt(id, index) {
  			if (!this.userInfo) {
	  			Func.toast('请重新登录');
	  			return;
	  		}
  			let that = event.currentTarget;
  			if (that.className.indexOf('icon-xihuan1') < 0) {
  				this.$store.dispatch('favorArticle', {id: id, userid: this.userInfo.objectId, name: this.name, index: index, callback: function() {
  					that.className = 'option-btn iconfont icon-xihuan1';
  					that.innerHTML += 1;
  				}});
  			}
  		},
  		commenSubmit(id, index) {
  			if (!this.userInfo) {
	  			Func.toast('请重新登录');
	  			return;
	  		}
  			let that = event.currentTarget;
  			let comment = that.parentNode.querySelector('.comment-input').value;
  			if (comment.replace(/\s+/g, "") === '') {
  				Func.toast('评论不能为空');
  			}
  			let option = {
  				data: {
  					time: new Date(),
	  				comment: comment.replace(/(^\s+)|(\s+$)/g,""),
	  				id: id,
	  				userid: this.userInfo.objectId
  				},
  				nickname: this.userInfo.nickname,
  				avatar: this.userInfo.avatar || '',  				
  				index: index,
  				name: this.name,
  				callback: function() {
  					that.parentNode.querySelector('.comment-input').value = '';
  				}
  			}
  			this.$store.dispatch('commentArticle', option);
  		},
  		showComment(id,index) {
  			let parent = event.currentTarget.parentNode.parentNode;
  			if (parent.className.indexOf('content-list-comment') < 0) {
  				parent.className = 'content-list content-list-comment';
  				this.$store.dispatch('getComments', {id: id, index: index, name: this.name});
  			} else {
  				parent.className = 'content-list';
  			}
  		},
  	}
}
</script>
 
<style lang="less" scoped>
	.edit-heading-title{
		font-size: 16px;
		font-weight: normal;
	}
	.userinfo-wrapper{
		padding: 30px;
		.userinfo-main{
			.userinfo-avatar{
				width: 200px;
				height: 200px;
			}
			.userinfo-ex{
				padding: 30px 0px 10px 30px;
				-moz-box-flex-wrap: wrap;
				-webkit-flex-wrap: wrap;
				-ms-flex-wrap: wrap;
				flex-wrap: wrap;
				.userinfo-ex-item{
					height: 25%;
					width: 50%;
					-webkit-box-flex: none;
				    -moz-box-flex: none;             
				    -webkit-flex: none;    
				    -ms-flex: none;
				    flex: none;
				    .location{
				    	margin-left: 15px;
				    }
				    &:first-child{
				    	width: 100%;
				    }
				    &:last-child{
				    	width: 100%;
				    	height: 50%;
				    }
				}
			}
		}
	}
	.tab-wrapper{
		height: 50px;
		padding: 0 30px;
		.tab-item{
			font-size: 15px;
			border-bottom: 1px solid #999;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			&.active{
				border: 1px solid #999;
				border-bottom: none;
			}
			&:first-child.active{
				border-left: none;
				border-top-left-radius: 0;
			}
			&:last-child.active{
				border-right: none;
				border-top-right-radius: 0;
			}
		}
	}
</style>