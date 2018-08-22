export function toast (options) {
  let toast = document.getElementById('toast') || null
  if (toast && toast.className === '') {
    let config = {
      duration: options.duration || 1500,
      title: options.title || ''
    }
    toast.innerHTML = config.title
    toast.className = 'show'
    setTimeout(() => {
      toast.className = ''
    }, config.duration)
  }
}

export function setCookie (name, value, time) {
  if (!time) {
    time = 1
  }
  let exp = new Date()
  exp.setTime(exp.getTime() + time * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

export function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    return unescape(document.cookie.match(reg)[2])
  } else {
    return null
  }
}

export function delCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

export function setStorage (name, value) {
  localStorage.setItem(name, value)
}

export function getStorage (name) {
  return localStorage.getItem(name)
}

export function delStorage (name) {
  setStorage(name, '')
}

export function formatTime (time) {
  let date = new Date(time)
  let now = new Date()
  let Y, M, D, h, m, s
  let _Y, _M, _D, _h, _m, _s
  Y = parseInt(date.getFullYear())
  M = parseInt(date.getMonth()) + 1
  D = parseInt(date.getDate())
  h = parseInt(date.getHours())
  m = parseInt(date.getMinutes())
  s = parseInt(date.getSeconds())

  _Y = parseInt(now.getFullYear())
  _M = parseInt(now.getMonth()) + 1
  _D = parseInt(now.getDate())
  _h = parseInt(now.getHours())
  _m = parseInt(now.getMinutes())
  _s = parseInt(now.getSeconds())

  if (_Y - Y > 1) {
    return (_Y - Y) + '年前' + M + '月' + D + '号' + h + '点'
  }
  if (_Y - Y > 0) {
    return '去年' + M + '月' + D + '号' + h + '点'
  }
  if (_M - M > 0) {
    return '今年' + M + '月' + D + '号' + h + '点'
  }
  if (_D - D > 1) {
    return (_D - D) + '天前' + h + '点'
  }
  if (_D - D > 0) {
    return '昨天' + h + '点'
  }
  if (_h - h > 0) {
    return (_h - h) + '小时前'
  }
  if (_m - m > 0) {
    return (_m - m) + '分钟前'
  }
  if (_s - s > 0) {
    return (_s - s) + '秒前'
  }
  return '刚刚'
}
