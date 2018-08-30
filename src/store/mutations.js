import { setCookie, delCookie } from '../plugins/func'

export default {
  setUserInfo (state, data) {
    let userInfo = state.userInfo ? JSON.parse(JSON.stringify(state.userInfo)) : {}
    state.userInfo = Object.assign(userInfo, data)
    let obj = {
      userId: state.userInfo.userId,
      sessionToken: state.userInfo.sessionToken,
      infoId: state.userInfo.infoId
    }
    setCookie('Blog_userInfo', JSON.stringify(obj))
  },
  clearUserInfo (state) {
    state.userInfo = null
    delCookie('Blog_userInfo')
  }
}
