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
	getArticleList({commit}) {
	    let query = new AV.Query(Fee);
	    query.descending('createdAt');
	    query.find().then(function(results) {
	      	commit('setArticleList', results);
	    });
    },
    login({dispatch, commit}, params) {
    	Vue.http.post(BASEDATA.loginUrl, params, OPTIONS)
	        .then((response) => {
	        	commit('saveUserInfo', response.data);
	        	Func.setCookie('Fee_userInfo', JSON.stringify(response.data));
	        	dispatch('getArticleList');
	    		router.go(-1);
	    		Func.toast('登录成功');
	        })
	        .catch((response) => {
	          	Func.toast(TIP[response.data.code]);
	        })
    },
    regist({dispatch}, params) {
    	Vue.http.post(BASEDATA.registUrl, params, OPTIONS)
	        .then((response) => {
	        	console.log(response.data)
	        	dispatch('login', params);
	        })
	        .catch((response) => {
	          	Func.toast(TIP[response.data.code]);
	        })
    },
    submitArticle({dispatch}, article) {
    	let data = {
    		'type': article.type,
			'pic': article.pic,
			'content': article.content
    	}
    	if (article.type === '1') {
		  	Vue.http.post(BASEDATA.baseUrl, data, OPTIONS)
		        .then((response) => {
		        	dispatch('getArticleList');
		    		router.go(-1);
		    		Func.toast('添加成功');
		        })
		        .catch((response) => {
		          	Func.toast('提交失败');
		        })

    	} else {
	    	Vue.http.put(BASEDATA.baseUrl+'/'+article.id, data, OPTIONS)
		        .then((response) => {
		        	dispatch('getArticleList');
		    		router.go(-1);
		    		Func.toast('编辑成功');
		        })
		        .catch((response) => {
		          	Func.toast('提交失败');
		        })
    	}
    },
    getArticle({commit}, id) {
    	if(!id){
    		commit('setArticle', '');
    		return;
    	}
    	Vue.http.get(BASEDATA.baseUrl+'/'+id, OPTIONS)
	        .then((response) => {
	        	commit('setArticle', response.data.content)
	        })
	        .catch((response) => {
	          	Func.toast('获取失败');
	        })
    },
    deleteArticle({dispatch}, id) {
    	Vue.http.delete(BASEDATA.baseUrl+'/'+id, OPTIONS)
	        .then((response) => {
	        	dispatch('getArticleList');
		    	router.go(-1);
		    	Func.toast('删除成功');
	        })
	        .catch((response) => {
	          	Func.toast('删除失败');
	        })
    }
}

export default actions