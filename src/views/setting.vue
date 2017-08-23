<template>
  	<div class="editor-wrapper">  
  		<div class="edit-heading">
  			<router-link class="iconfont icon-fanhui heading-button back-button" to="/">返回</router-link>
  		</div>
    	<div class="editor-content">
	      	<ul class="setting-wrapper" v-if="userInfo">
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">头像：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<div class="avatar" v-if="type === '1' && userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}"></div>
	      				<div class="avatar avatar-default" v-else-if="type === '1' && !userInfo.avatar"></div>
	      				<div class="avatar avatar-btn iconfont icon-paizhao" v-else-if="type === '2' && userInfo.avatar" :style="{ backgroundImage: 'url(' + userInfo.avatar + ')'}">
	      					<input type="file" accept="*.png,*.jpg,*.jpeg,*gif" class="avatar-input" @change.stop="addAvatar">
	      				</div>
	      				<div class="avatar avatar-btn iconfont icon-paizhao" v-else-if="type === '2' && !userInfo.avatar">
	      					<input type="file" accept="*.png,*.jpg,*.jpeg,*gif" class="avatar-input" @change.stop="addAvatar">
	      				</div>
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">昵称：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p v-if="type === '1'">{{userInfo.nickname ? userInfo.nickname : '未设置'}}</p>
	      				<input class="input nickname-input" type="text" placeholder="昵称" v-else-if="type === '2'" v-model="userInfo.nickname">
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">帐号：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p>{{userInfo.username}}</p>
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">性别：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p v-if="type === '1'">{{userInfo.sex ? userInfo.sex : '未设置'}}</p>
	      				<div class="sex-rapper" v-else-if="type === '2'">
	      					<input type="radio" name="sex" value="绅士" v-model="userInfo.sex">
	      					<label>绅士</label>
	      					<input type="radio" name="sex" value="淑女" v-model="userInfo.sex">
	      					<label>淑女</label>
	      				</div>
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">邮箱：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p v-if="type === '1'">{{userInfo.email ? userInfo.email : '未设置'}}</p>
	      				<input class="input" type="email" placeholder="邮箱" v-else-if="type === '2'" v-model="userInfo.email">
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">位置：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p v-if="type === '1'">{{userInfo.location ? userInfo.location : '未设置'}}</p>
	      				<input class="input" type="text" placeholder="位置" v-else-if="type === '2'" v-model="userInfo.location">
	      			</div>
	      		</li>
	      		<li class="setting-item verticalbox">
	      			<span class="setting-item-title">签名：</span>
	      			<div class="setting-item-wrapper verticalbox">
	      				<p v-if="type === '1'">{{userInfo.sign ? userInfo.sign : '未设置'}}</p>
	      				<textarea class="input sign-input" placeholder="签名" v-else-if="type === '2'" v-model="userInfo.sign"></textarea>
	      			</div>
	      		</li>
	      		<li class="setting-item centerVertical">
	      			<a class="option-button edit-save-button" @click="editSaveOpt">{{type === '1' ? '编辑' : '保存'}}</a>
	      			<a class="option-button edit-save-button" @click="cancelOpt" v-if="type === '2'">取消</a>
	      		</li>
	      	</ul>
    	</div>
  	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import lrz from 'lrz'
import Func from '../assets/js/common.js'

export default {
  	data(){
    	return {
      		type: '1'
    	}
  	},
  	created() {
  		if (!this.userInfo) {
  			this.$router.replace({path: '/'});
  		}
  	},
  	computed: {
  		...mapGetters(['userInfo'])
  	},
  	watch: {
	    '$route': 'initData'
	},
  	methods: {
  		initData() {
  			if (!this.userInfo) {
	  			Func.toast('请登录');
	  			return;
	  		}
  			this.type = '1';
  			this.$store.dispatch('getUser', {id: this.userInfo.objectId, sessionToken: this.userInfo.sessionToken});
  		},
  		addAvatar() {
  			let that = this;
	      	lrz(event.currentTarget.files[0])
            	.then(function (rst) {
             		that.userInfo.avatar = rst.base64;
	            })
	            .catch(function (err) {
	              	Func.toast('图片上传失败');
	            });
  		},
  		cancelOpt() {
  			this.type = '1';
  		},
  		editSaveOpt() {
  			if (!this.userInfo) {
	  			this.$router.push({path: '/login'});
	  			Func.toast('请重新登录');
	  			return;
	  		}
  			let that = this;
  			let userInfo = this.userInfo;
  			let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

  			if (this.type === '1') {
  				this.type = '2';
  			} else {
  				if (userInfo.nickname && userInfo.nickname.replace(/(^\s+)|(\s+$)/g, "").length < 2) {
  					Func.toast('昵称不得少于2个字符');
  					return;
  				}
  				if (userInfo.email && !emailReg.test(userInfo.email)) {
  					Func.toast('请填写正确的邮箱');
  					return;
  				}
  				
  				let option = {
  					'userInfo': {
  						'avatar': userInfo.avatar || '',
  						'nickname': userInfo.nickname || '',
  						'sex': userInfo.sex || '',
  						'email': userInfo.email || '',
  						'location': userInfo.location || '',
  						'sign': userInfo.sign || ''
  					},
  					'callback': function() {
  						that.type = '1';
  					},
  					'id': userInfo.objectId,
  					'sessionToken': userInfo.sessionToken
  				};
  				this.$store.dispatch('updateUser', option);
  			}
  		}
  	}
}
</script>
 
<style lang="less" scoped>
	.setting-wrapper{
		width: 500px;
		margin: 0 auto;
		padding-top: 50px;
		.setting-item{
			min-height: 50px;
		    margin: 15px 0;
			.setting-item-title{
				width: 200px;
				text-align: right;
				margin-right: 50px;
			}
			.setting-item-wrapper{
				.avatar{
					width: 80px;
					height: 80px;
					&.avatar-btn{
						position: relative;
						line-height: 78px;
					    text-align: center;
					    font-size: 25px;
					    border: 1px solid #666;
					    color: #666;
					    &::before{
					    	position: absolute;
						    left: 0;
						    top: 0;
						    width: 100%;
						    height: 100%;
						    background-color: rgba(0,0,0,0.15);
						    border-radius: 50%;
					    }
					    &:hover{
					    	border-color: #888;
					    	color: #888;
					    }
					    .avatar-input{
					    	position: absolute;
					    	width: 100%;
					    	height: 100%;
					    	left: 0;
					    	top: 0;
					    	opacity: 0;
					    	font-size: 0;
					    	cursor: pointer;
					    }
					}
				}
				.input{
					height: 40px;
					width: 250px;
					padding: 5px 15px;
					font-size: 14px;
					border: 1px solid #999;
					outline: none;
					border-radius: 5px;
					&.sign-input{
						height: 100px;
						resize: none;
					}
				}
				.sex-rapper{
					input{
						margin-left: 20px;
						margin-right: 5px;
						&:first-child{
							margin-left: 0;
						}
					}
				}
			}
			.edit-save-button{
				width: 100px;
				height: 34px;
				margin-left: 50px;
				margin-top: 50px;
				&:first-child{
					margin-left: 0;
				}
			}
		}
	}
</style>