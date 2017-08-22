const mutations = {
	saveUserInfo(state, userData) {
		state.userInfo = userData;
	},
	setArticleList(state, data) {
    if (data.isback) {
      state.articleList = data.results;
      state.refreshHome = true;
    } else {
      state.articleList = state.articleList.concat(data.results);
    }
    state.articlePage.skip = data.skip;
    state.articlePage.nomore = data.nomore;
  },
  setArticleUser(state, data) {
    state.articleList[data.index].user = data.data;
    //强制使articleList更新，从而更新视图层
    let fee = state.articleList;
    state.articleList = [];
    state.articleList = fee;
  },
  setCommentUser(state, data) {
    state.articleList[data.index].comments[data.i].nickname = data.data.nickname;
    state.articleList[data.index].comments[data.i].avatar = data.data.avatar;
    //强制使articleList更新，从而更新视图层
    let fee = state.articleList;
    state.articleList = [];
    state.articleList = fee;
  },
  setArticle(state, content) {
  	state.article = content;
  },
  updateLikes(state, data) {
    state.articleList[data.index].likes = data.likes;
    state.articleList[data.index].likeUsers = data.likeUsers
  },
  updateComments(state, data) {
    state.articleList[data.index].comments = data.comments;
    state.articleList[data.index].commentUsers = data.commentUsers
  }
}

export default mutations