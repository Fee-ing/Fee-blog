const mutations = {
	saveUserInfo(state, userData) {
		state.userInfo = userData;
	},
  	setArticleList(state, list) {
      	state.articleList = list;
    },
    setArticle(state, content) {
    	state.article = content;
    }
}

export default mutations