import { setCookie, delCookie } from '../plugins/func'

export default {
  setUserInfo (state, data) {
    let userInfo = state.userInfo ? JSON.parse(JSON.stringify(state.userInfo)) : {}
    state.userInfo = Object.assign(userInfo, data)
    setCookie('Blog_userInfo', JSON.stringify({objectId: state.userInfo.objectId}))
  },
  clearUserInfo (state) {
    state.userInfo = null
    delCookie('Blog_userInfo')
  }
}
