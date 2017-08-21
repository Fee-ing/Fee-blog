const mutations = {
	saveUserInfo(state, userData) {
		state.userInfo = userData;
	},
  	setArticleList(state, data) {
      if (data.isback) {
        state.articleList = data.results;
      } else {
        state.articleList = state.articleList.concat(data.results);
      }
      state.articlePage.skip = data.skip;
      state.articlePage.nomore = data.nomore;
    },
    setArticle(state, content) {
    	state.article = content;
    },
    setArticlePage(skip) {
    	state.articlePage.skip = skip;
    }
}

export default mutations