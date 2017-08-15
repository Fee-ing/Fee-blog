import Vue from 'vue'
import AV from 'leanengine'
import router from '../router'

AV.init({
  	appId: 'yiyAjSc4l0FDYgJwaypzQYCL-gzGzoHsz',
  	appKey: '2IP8CPpLdKpPf9SihRAdPlvP'
});
let FeeList = AV.Object.extend('FeeList');

const actions = {
	getArticleList({commit, state}) {
	    let query = new AV.Query(FeeList);
	    query.descending('createdAt');
	    query.find().then(function(results) {
	      	commit('setArticleList', results);
	    });
    },
    addArticle({dispatch, state}, article) {
    	let feeList = new FeeList();
    	feeList.set('type', '1');
	  	feeList.set('pic', article.pic);
	  	feeList.set('content', article.content);
	  	feeList.save().then(function(results) {
	  		dispatch('getArticleList');
	    	router.go(-1);
	  	});
    },
    editArticle({dispatch, state}) {
    	let feeList = new FeeList();
    	console.log(feeList.get('type'))
    	feeList.get('type');
    }
}

export default actions