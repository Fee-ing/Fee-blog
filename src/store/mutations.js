const mutations = {
	saveUserInfo(state, userData) {
		state.userInfo = userData;
	},
	setArticleList(state, data) {
    if (data.refresh) {
      state[data.name].articles = [];
      state[data.name].articles = data.results;
    } else {
      state[data.name].articles = state[data.name].articles.concat(data.results);
    }
    state[data.name].skip = data.skip;
    state[data.name].nomore = data.nomore;
  },
  setArticleUser(state, data) {
    state[data.name].articles[data.index].user = data.data;
    //强制articles更新，从而更新视图层，作用等同于Vue.set()
    let fee = state[data.name].articles;
    state[data.name].articles = [];
    state[data.name].articles = fee;
  },
  setComments(state, data) {
    state[data.name].articles[data.index].comments = data.comments;
    state[data.name].articles[data.index].commentUsers = data.commentUsers;
    state[data.name].articles[data.index].commentsNumber = data.commentsNumber;
    let fee = state[data.name].articles;
    state[data.name].articles = [];
    state[data.name].articles = fee;
  },
  updateLikes(state, data) {
    state[data.name].articles[data.index].likes = data.likes;
    state[data.name].articles[data.index].likeUsers = data.likeUsers
  },
  updateComments(state, data) {
    state[data.name].articles[data.index].comments = data.comments;
    state[data.name].articles[data.index].commentUsers = data.commentUsers
  },
  setArticle(state, content) {
    state.article = content;
  },
}

export default mutations