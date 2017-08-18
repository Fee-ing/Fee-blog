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

let Fee = AV.Object.extend('Fee');

const OPTIONS = {
	headers: {
		'X-LC-Id': BASEDATA.appInfo.appId,
		'X-LC-Key': BASEDATA.appInfo.appKey,
		'Content-Type': 'application/json'
	}
};

const actions = {
	getArticleList({commit}, option) {
	    let query = new AV.Query(Fee);
	    query.descending('createdAt');
	    query.find().then(function(results) {
	    	commit('setArticleList', results);
	    	if (option && option.isback) {
	    		router.go(-1);
	    	}
	    });
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
    	let headers = OPTIONS.headers;
    	headers['X-LC-Session'] = option.sessionToken;
    	Vue.http.put(BASEDATA.userUrl+'/'+option.id, option.userInfo, { headers })
	        .then((response) => {
	        	option.callback();
	    		Func.toast('保存成功');
	 			dispatch('getUser', {id: option.id, sessionToken: option.sessionToken});
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
			'userid': article.userid
    	}
    	if (article.type === '1') {
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
    }
}

export default actions