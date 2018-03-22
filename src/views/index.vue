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
					<li class="user-item"><router-link class="user-item-btn" to="/user">我的主页</router-link></li>
					<li class="user-item"><router-link class="user-item-btn" to="/setting">个人资料</router-link></li>
					<li class="user-item"><a class="user-item-btn" @click="logoutOpt">退出登录</a></li>
				</ul>
			</template>
			<router-link class="heading-button login-button" to="/login" v-else-if="!userInfo">
			<div class="avatar avatar-default"></div>
				<span class="name">登录/注册</span>
			</router-link>
			<h1 class="edit-heading-title" @click="refresh">Fee's&nbsp;&nbsp;Zone</h1>
			<a class="iconfont icon-add heading-button add-button" @click="addArticle"></a>
		</div>
		<div class="editor-content">
			<div id="content-wrapper" class="content-wrapper">
				<div class="content-list" v-for="(item, index) in homeArticle.articles" v-if="item.user">
					<div class="info-wrapper flexbox border-bottom">
						<div class="avatar info-avatar" v-if="item.user.avatar" :style="{ backgroundImage: 'url(' + item.user.avatar + ')'}"></div>
						<div class="avatar info-avatar avatar avatar-default" v-else></div>
						<div class="info-content flex1">
							<div class="info-name"><b>{{item.user.nickname}}</b>&nbsp;&nbsp;{{item.user.location ? '('+item.user.location+')' : ''}}</div>
							<div class="info-sign">{{item.user.sign ? item.user.sign : '无'}}</div>
						</div>
						<router-link class="edit-btn verticalbox iconfont icon-bianji" v-if="userInfo && item.userid === userInfo.objectId" :to="{ path:'/article', query: {id: item.objectId} }">编辑</router-link>  
					</div>
					<div class="list-wrapper" @click="showParagraph">
				<div class="flexbox">
					<div class="first-img" v-if="item.pic" :style="{ backgroundImage: 'url(' + item.pic + ')'}"></div>
								<div class="paragraph" v-html="item.content"></div>
				</div>
						<div class="hold-up"><a class="hold-up-btn" @click.stop="holdParagraph">▲收起</a></div>
					</div>
					<div class="option-wrapper verticalbox">
						<a class="option-btn iconfont" v-bind:class="item.likeUsers | isLike(userInfo)" @click="favorOpt(item.objectId, index)">{{item.likes > 0 ? item.likes : ''}}</a>
						<a class="option-btn iconfont icon-pinglun" @click="showComment(item.objectId, index)">{{item.commentsNumber > 0 ? item.commentsNumber : ''}}</a>
						<span class="time flex1">{{item.type === '1' ? '发布于' : '更新于'}} {{item.createdAt | formatTime}}</span>
					</div>
					<div class="comment-wrapper">
						<div class="comment-list-wrapper">
					<template v-if="item.commentsNumber > 0">
						<div class="comment-header"><span>留言区：</span></div>
								<div class="comment-list" v-for="i in item.comments">
									<div class="comment-info verticalbox">
										<div class="comment-avatar avatar" v-if="i.avatar" :style="{ backgroundImage: 'url(' + i.avatar + ')'}"></div>
										<div class="comment-avatar avatar avatar-default" v-else></div>
										<span class="comment-name flex1" v-if="userInfo && userInfo.objectId === i.userid && i.userid === item.userid">我（作者）：</span>
										<span class="comment-name flex1" v-else-if="i.userid === item.userid">{{i.nickname}}（作者）：</span>
										<span class="comment-name flex1" v-else-if="userInfo && userInfo.objectId === i.userid">我：</span>
										<span class="comment-name flex1" v-else>{{i.nickname}}：</span>
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
				<a class="get-more" v-if="!homeArticle.nomore" @click="getMore">加载更多</a>
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
      		isShowUser: false,
      		contentWrapper: null,
      		windowHeight: 0,
					scrollTop: 0,
					listHeight: 0
    	}
  	},
  	created() {
  		this.$store.dispatch('getArticleList');
  		if (this.userInfo) {
  			this.$store.dispatch('getUser', {id: this.userInfo.objectId, sessionToken: this.userInfo.sessionToken});
  		}
  	},
  	mounted() {
  		this.contentWrapper = document.getElementById('app');
  		this.windowHeight = document.body.clientHeight || document.documentElement.clientHeight;
  		this.contentWrapper.addEventListener('scroll', this.scrollOpt);
  	},
  	computed: {
  		...mapGetters(['homeArticle', 'userInfo'])
  	},
  	watch: {
	    '$route': 'initHome'
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
  		refresh() {
  			this.$store.dispatch('getArticleList', {refresh: true})
  		},
  		initHome() {			
			let contentList = document.querySelectorAll('.content-list');			
  			for (let i = 0, len = contentList.length;i < len;i ++) {
  				contentList[i].className = 'content-list';
  			}
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
  			if (event.currentTarget.className.indexOf('open') < 0) {
					this.listHeight = event.currentTarget.offsetHeight + event.currentTarget.parentNode.offsetHeight;
				  event.currentTarget.className = 'list-wrapper open';
				  if (event.currentTarget.offsetHeight > 80) {
					  event.currentTarget.className = 'list-wrapper open show-hold';
				  }
  			}
  		},
		holdParagraph () {
			let parent = event.currentTarget.parentNode.parentNode;
			if (parent.className.indexOf('open') >= 0) {
				this.contentWrapper.scrollTop = this.contentWrapper.scrollTop - parent.offsetHeight + this.listHeight + 20
				parent.className = 'list-wrapper';
			}
		},
  		logoutOpt() {
  			this.$store.dispatch('logout')
  		},
  		addArticle() {
  			if (this.userInfo) {
  				this.$router.push({path: '/article'});
  			} else {
  				Func.toast('请先登录');
  			}
  		},
  		favorOpt(id, index) {
  			let that = event.currentTarget;
  			if (!this.userInfo) {
  				Func.toast('请先登录');
  				return
  			}
  			if (this.userInfo && that.className.indexOf('icon-xihuan1') < 0) {
  				this.$store.dispatch('favorArticle', {id: id, userid: this.userInfo.objectId, index: index, callback: function() {
  					that.className = 'option-btn iconfont icon-xihuan1';
  					that.innerHTML += 1;
  				}});
  			}
  		},
  		commenSubmit(id, index) {
  			let This = this;
  			let that = event.currentTarget;
  			if (!this.userInfo) {
  				Func.toast('请先登录');
  				return
  			}
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
  				callback: function() {
  					that.parentNode.querySelector('.comment-input').value = '';
  					let listWrapper = that.parentNode.parentNode.querySelector('.comment-list-wrapper');
			      	This.$nextTick(function(){
			        	if(listWrapper.scrollHeight <= listWrapper.offsetHeight){
			          		return;
				        }
				        listWrapper.scrollTop = listWrapper.scrollHeight - listWrapper.offsetHeight;
			      	})
  				}
  			}
  			this.$store.dispatch('commentArticle', option);
  		},
  		showComment(id, index) {
  			let parent = event.currentTarget.parentNode.parentNode;
  			if (parent.className.indexOf('content-list-comment') < 0) {
  				parent.className = 'content-list content-list-comment';
  				this.$store.dispatch('getComments', {id: id, index: index});
  			} else {
  				parent.className = 'content-list';
  			}
  		},
  		getMore() {
  			this.$store.dispatch('getArticleList')
  		}
  	}
}
</script>
 
<style lang="less">
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
</style>