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
		let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
		OPTIONS1.params = {order: '-createdAt', limit: state.homeArticle.limit, skip: skip};
		OPTIONS1.emulateJSON = true;

		let name = option && option.name ? option.name : 'homeArticle';
		let isback = option && option.isback ? true : false;
		let refresh = option && option.refresh ? true : false;
		let skip = (isback || refresh) ? 0 : state[name].skip;

		if (name === 'userArticles') {
			OPTIONS1.params.where = {userid: option.userid};
		} else if(name === 'userFavorArticles') {
			OPTIONS1.params.where = {'likeUsers': {'$in': [option.userid]}};
		} else if(name === 'userCommentArticles') {
			OPTIONS1.params.where = {'commentUsers': {'$in': [option.userid]}};
		}
		
		Vue.http.get(BASEDATA.baseUrl, OPTIONS1)
	        .then((response) => { 
	        	let results = response.data.results;
	        	let isNomore = results.length < state.homeArticle.limit ? true : false;
		    	commit('setArticleList', {results: results, skip: skip + results.length, nomore: isNomore, refresh: (isback || refresh), name: name});

		    	//获取每篇文章的用户信息
		    	for (let i = 0, len = results.length;i < len;i ++) {
		    		Vue.http.get(BASEDATA.userUrl+'/'+results[i].userid, OPTIONS)		
				        .then((response) => {
				        	let data = {
				        		data: response.data,
				        		index: i,
				        		name: name
				        	}
				        	commit('setArticleUser', data);
				        })
		    	}

		    	if (isback) {
		    		router.go(-1);
		    	} 
	        })
	        .catch((response) => {
	          	Func.toast('文章用户信息更新失败');
	        })
    },
    submitArticle({dispatch}, article) {
    	let data = {
    		'type': article.type,
			'pic': article.pic,
			'content': article.content,
			'userid': article.userid
    	};
    	if (article.type === '1') {
    		data.likes = 0;
    		data.likeUsers = [];
    		data.comments = [];
    		data.commentUsers = [];
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
    favorArticle({dispatch, commit}, option) {
    	let data = {
    		"likes": {"__op":"Increment", "amount":1},
    		"likeUsers": {"__op":"Add", "objects": [option.userid]}
    	};
    	let name = option && option.name ? option.name : 'homeArticle';

    	Vue.http.put(BASEDATA.baseUrl+'/'+option.id, data, OPTIONS)
	        .then((response) => {
	    		let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
				OPTIONS1.params = {keys: 'likes,likeUsers'};
				OPTIONS1.emulateJSON = true;
				Vue.http.get(BASEDATA.baseUrl+'/'+option.id, OPTIONS1)
			        .then((response) => { 
			        	response.data.index = option.index;
			        	response.data.name = name;
			        	commit('updateLikes', response.data);
			        	Func.toast('点赞成功');

			        	if (name !== 'homeArticle') {
			        		dispatch('getArticleList', {refresh: true});
			        	}
			        })
			        .catch((response) => {
			          	if (option.callback) {
			        		option.callback();
			        	}
			        })
	        })
	        .catch((response) => {
	          	Func.toast('点赞失败');
	        })
    },
    commentArticle({dispatch, commit}, option) {
    	let data = {
    		'comments': {'__op': 'Add', 'objects': [option.data]},
    		'commentUsers': {'__op': 'AddUnique', 'objects': [option.data.userid]}
    	};
    	let name = option && option.name ? option.name : 'homeArticle';

    	Vue.http.put(BASEDATA.baseUrl+'/'+option.data.id, data, OPTIONS)
	        .then((response) => {
	    		//更新评论
	    		let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
				OPTIONS1.params = {keys: 'comments,commentUsers'};
				OPTIONS1.emulateJSON = true;
				Vue.http.get(BASEDATA.baseUrl+'/'+option.data.id, OPTIONS1)
			        .then((response) => { 
			        	response.data.index = option.index;
			        	response.data.name = name;
			        	commit('updateComments', response.data);
			        	if (option.callback) {
			        		option.callback();
			        	}
			        	Func.toast('评论成功');	

			        	// //获取每条评论的用户信息
				    	let commentList = response.data.comments;
				    	let OPTIONS2 = JSON.parse(JSON.stringify(OPTIONS));
						OPTIONS2.params = {keys: 'nickname,avatar'};
						OPTIONS2.emulateJSON = true;
				    	for (let i = 0, len = commentList.length;i < len;i ++) {
				    		Vue.http.get(BASEDATA.userUrl+'/'+commentList[i].userid, OPTIONS2)		
						        .then((response) => {
						        	let data = {
						        		data: response.data,
						        		index: option.index,
						        		i: i,
						        		name: name
						        	}
						        	commit('setCommentUser', data);
						        })
				    	}

				    	if (name !== 'homeArticle') {
			        		dispatch('getArticleList', {refresh: true});
			        	}
			        })
			        .catch((response) => {
			          	Func.toast('评论更新失败');
			        })
	        })
	        .catch((response) => {
	          	Func.toast('评论失败');
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
	 			dispatch('getArticleList',  {refresh: true});
	        })
	        .catch((response) => {
	          	Func.toast('保存失败');
	        })
    },
    getCommentUsers({commit, state}, option) {
    	let OPTIONS1 = JSON.parse(JSON.stringify(OPTIONS));
		OPTIONS1.params = {keys: 'nickname,avatar'};
		OPTIONS1.emulateJSON = true;

    	// //获取每条评论的用户信息
    	let commentList = state.homeArticle.articles[option.index].comments;
    	let name = option && option.name ? option.name : 'homeArticle';
    	
    	for (let i = 0, len = commentList.length;i < len;i ++) {
    		Vue.http.get(BASEDATA.userUrl+'/'+commentList[i].userid, OPTIONS1)		//获取用户信息
		        .then((response) => {
		        	let data = {
		        		data: response.data,
		        		index: option.index,
		        		i: i,
		        		name: name
		        	}
		        	commit('setCommentUser', data);
		        })
    	}
    },
    
}

export default actions