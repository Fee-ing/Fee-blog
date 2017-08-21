import Vue from 'vue'
import AV from 'leanengine'
import router from '../router'
import BASEDATA from '../assets/js/config.js'
import TIP from '../assets/js/tip.js'
import Func from '../assets/js/common.js'

AV.init({
  	appId: BASEDATA.appInfo.appId,
  	appKey: BASEDATA.appInfo.appKey
});

const OPTIONS = {
	headers: {
		'X-LC-Id': BASEDATA.appInfo.appId,
		'X-LC-Key': BASEDATA.appInfo.appKey,
		'Content-Type': 'application/json'
	}
};

const actions = {
	getArticleList({commit, state}, option) {
		let isback = option && option.isback ? true : false;
		let skip = isback ? 0 : state.articlePage.skip;
		let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
		OPTIONS1.params = {order: '-createdAt', limit: state.articlePage.limit, skip: skip};
		OPTIONS1.emulateJSON = true;
		//查询此用户已发布的所有文章
		Vue.http.get(BASEDATA.baseUrl, OPTIONS1)
	        .then((response) => { 
	        	let results = response.data.results;
	        	let isNomore = results.length < state.articlePage.limit ? true : false;
		    	commit('setArticleList', {results: results, skip: skip + results.length, nomore: isNomore, isback: isback});
		    	if (isback) {
		    		router.go(-1);
		    	}     		
	        })
	        .catch((response) => {
	          	Func.toast('文章用户信息更新失败');
	        })
    },
    login({dispatch, commit}, params) {
    	Vue.http.post(BASEDATA.loginUrl, params, OPTIONS)
	        .then((response) => {
	        	commit('saveUserInfo', response.data);
	        	Func.setCookie('Fee_userInfo', JSON.stringify(response.data));
	        	dispatch('getArticleList', {isback: true});
	    		Func.toast('登录成功');
	        })
	        .catch((response) => {
	          	Func.toast(TIP[response.data.code]);
	        })
    },
    regist({dispatch}, params) {
    	Vue.http.post(BASEDATA.userUrl, params, OPTIONS)
	        .then((response) => {
	        	dispatch('login', params);
	        })
	        .catch((response) => {
	          	Func.toast(TIP[response.data.code]);
	        })
    },
    logout({dispatch, commit}) {
    	commit('saveUserInfo', null);
    	Func.delCookie('Fee_userInfo');
    	dispatch('getArticleList');
		Func.toast('退出登录');
    },
    getUser({commit}, option) {
    	Vue.http.get(BASEDATA.userUrl+'/'+option.id, OPTIONS)		//获取用户信息
	        .then((response) => {
	        	response.data.sessionToken = option.sessionToken;
	        	commit('saveUserInfo', response.data);
	        	Func.setCookie('Fee_userInfo', JSON.stringify(response.data));
	        })
	        .catch((response) => {
	          	Func.toast('获取用户信息失败')
	        })
    },
    updateUser({dispatch, commit}, option) {
    	let headers = JSON.parse(JSON.stringify(OPTIONS.headers));
    	headers['X-LC-Session'] = option.sessionToken;
    	Vue.http.put(BASEDATA.userUrl+'/'+option.id, option.userInfo, { headers })
	        .then((response) => {
	        	option.callback();
	    		Func.toast('保存成功');
	 			dispatch('getUser', {id: option.id, sessionToken: option.sessionToken});
	 			let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
	 			OPTIONS1.params = {where: {userid: option.id}};
	 			OPTIONS1.emulateJSON = true;
	 			//查询此用户已发布的所有文章
	 			Vue.http.get(BASEDATA.baseUrl, OPTIONS1)
			        .then((response) => {
			        	//更新此用户文章的用户信息
			        	for (let i = 0; i <= response.data.results.length; i++) {
			        		let id = response.data.results[i].objectId;
				        	let data = {
				        		'nickname': option.userInfo.nickname,
								'avatar': option.userInfo.avatar,
								'location': option.userInfo.location,
								'sign': option.userInfo.sign
				        	};
				        	Vue.http.put(BASEDATA.baseUrl+'/'+id, data, OPTIONS)
						        .then((response) => {
						        	dispatch('getArticleList');
						        })
			        	}
			        	
			        })
			        .catch((response) => {
			          	Func.toast('文章用户信息更新失败');
			        })
	        })
	        .catch((response) => {
	          	Func.toast('保存失败');
	        })
    },
    submitArticle({dispatch}, article) {
    	let data = {
    		'type': article.type,
			'pic': article.pic,
			'content': article.content,
			'userid': article.userid,
			'nickname': article.nickname,
			'avatar': article.avatar,
			'location': article.location,
			'sign': article.sign
    	};
    	if (article.type === '1') {
    		data.likes = 0;
    		data.likeUsers = [];
		  	Vue.http.post(BASEDATA.baseUrl, data, OPTIONS)
		        .then((response) => {
		        	dispatch('getArticleList', {isback: true});
		    		Func.toast('发布成功');
		        })
		        .catch((response) => {
		          	Func.toast('提交失败');
		        })

    	} else {
	    	Vue.http.put(BASEDATA.baseUrl+'/'+article.id, data, OPTIONS)
		        .then((response) => {
		        	dispatch('getArticleList', {isback: true});
		    		Func.toast('编辑成功');
		        })
		        .catch((response) => {
		          	Func.toast('提交失败');
		        })
    	}
    },
    getArticle({commit}, id) {
    	if(!id){
    		commit('setArticle', {});
    		return;
    	}
    	Vue.http.get(BASEDATA.baseUrl+'/'+id, OPTIONS)
	        .then((response) => {
	        	commit('setArticle', response.data)
	        })
	        .catch((response) => {
	          	Func.toast('获取失败');
	        })
    },
    deleteArticle({dispatch}, id) {
    	Vue.http.delete(BASEDATA.baseUrl+'/'+id, OPTIONS)
	        .then((response) => {
	        	dispatch('getArticleList', {isback: true});
		    	Func.toast('删除成功');
	        })
	        .catch((response) => {
	          	Func.toast('删除失败');
	        })
    },
    favorArticle({dispatch}, option) {
    	let data = {
    		"likes": {"__op":"Increment","amount":1},
    		"likeUsers": {"__op":"Add","objects": [option.objectId]}
    	};
    	Vue.http.put(BASEDATA.baseUrl+'/'+option.id, data, OPTIONS)
	        .then((response) => {
	    		Func.toast('点赞成功');
	    		if (option.callback) {
	    			option.callback();
	    		}
	        })
	        .catch((response) => {
	          	Func.toast('点赞失败');
	        })
    }
}

export default actions