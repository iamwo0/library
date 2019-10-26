import wepy from 'wepy'

export default class baseMixin extends wepy.mixin {
  hasOwn(obj, type) {
    return Object.prototype.hasOwnProperty.call(obj, type)
  }
  $showToast(title, type, duration, cb) {
    var that = this
    var iconType = type || 'none'
    var toastDuration = duration || 1200
    wx.showToast({
      title: title,
      icon: iconType,
      duration: toastDuration,
      mask: true,
      success: function() {
        if (cb && that.isFunction(cb)) {
          cb()
        }
      }
    })
  }
  $showLoading(title) {
    wx.showLoading({
      title: title,
      mask: true
    })
  }
  /**
   * [isXXX 基础方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  isUndefined(item) {
    return typeof item === 'undefined'
  }
  isDefined(item) {
    return !this.isUndefined(item)
  }
  isString(item) {
    return typeof item === 'string'
  }
  isNumber(item) {
    return typeof item === 'number'
  }
  isArray(item) {
    return Object.prototype.toString.apply(item) === '[object Array]'
  }
  isObject(item) {
    return typeof item === 'object' && !this.isArray(item)
  }
  isFunction(item) {
    return typeof item === 'function'
  }

  /**
   * [getXXX 增强方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  getString(item, defaultStr) {
    if (this.isString(item)) return item.trim()
    if (this.isNumber(item)) return `${item}`.trim()
    return defaultStr || ''
  }
  getNumber(item, defaultNum) {
    var matches = this.getString(item).match(/\d+/)
    return this.isNumber(matches && +matches[0]) ? +matches[0] : defaultNum
  }
  getArray(item, defaultArr) {
    return this.isArray(item) ? item : (defaultArr || [])
  }
  getObject(item, defaultObj) {
    return this.isObject(item) ? item : (defaultObj || {})
  }
  /**
   * [JSON方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  $json(item) {
    let str = {type: Object.prototype.toString.call(item)}
    try {
      str = JSON.stringify(item)
    } catch (e) {
      str.error = e && e.stack || ''
    }
    return this.isString(str) ? str : this.$json(str)
  }
  $parse(item) {
    let obj = {type: Object.prototype.toString.call(item)}
    try {
      obj = JSON.parse(item)
    } catch (e) {
      obj.error = e && e.stack || ''
    }
    return this.isObject(obj) ? obj : this.$parse(obj)
  }

  /**
   * [功能方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  isPhone(str) {
    return /^1\d{10}$/.test(str)
  }

  // 警告框
  $alert(item = '标题', item2) {
    const param = this.isObject(item) ? Object.assign({
      // 首参数为obj
      title: 'title', content: 'content'
    }, item) : this.isString(item) ? this.isString(item2) ? {
      // 俩参数均为字符串
      title: item, content: item2
    } : {
      // 只有首参为字符串
      title: '', content: item
    } : {
      // 尝试转换字符串
      title: item.toString ? item.toString() : '参数异常'
    }
    wx.showModal(Object.assign({
      showCancel: false
    }, param))
  }

  urlWithoutAuthCheck(url) {
    var withoutAuth = false
    withoutAuth = url.indexOf('login') > -1
    withoutAuth = url.indexOf('register') > -1
    console.log('check url is need auth', url, withoutAuth)
    return withoutAuth
  }

  // 跳转链接
  methods = {
    goto(url, type) {
      var that = this
      var withoutAuth = false
      withoutAuth = that.urlWithoutAuthCheck(url)
      try {
        var authed = wx.getStorageSync('token')
        if (authed || withoutAuth) {
          if (type == 'tab') {
            return wx.switchTab({url: url})
          }
          wx.navigateTo({url: url})
        } else {
          that.$showToast('请先登录', 'loading', 1200, function() {
            wx.navigateTo({url: '/pages/user/login'})
          })
        }
      } catch (e) {
        // Do something when catch error
        console.error('handle get token error: ', e)
      }
    }
  }
}
