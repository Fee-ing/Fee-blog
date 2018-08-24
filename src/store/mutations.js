import { setCookie, delCookie } from '../plugins/func'

export default {
  setUserInfo (state, data) {
    state.userInfo = data
    setCookie('Blog_userInfo', JSON.stringify(data))
  },
  clearUserInfo (state) {
    state.userInfo = null
    delCookie('Blog_userInfo')
  }
}
