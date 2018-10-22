/**
 * Vue 公共代码
 * **/
function init (Vue) {
  /** 计算机容量转化 **/
  Vue.filter('byteToSize', value => {
    return bytesToSize(value)
  })
  /** 时间转化 **/
  Vue.filter('secToMin', value => {
    if (!value) return ''
    let f = Math.abs(value)
    let ret = ''
    // return f
    if (f < 60) {
      return f + '秒'
    }
    // 小于60秒
    if (f > 60) {
      ret = parseInt(f / 60) + '分' + (f % 60) + '秒'
      return ret
    }
  })

  Vue.filter('toJsonString', value => {
    return JSON.stringify(value)
  })

  function bytesToSize (bytes) {
    if (!bytes) return '0 B'
    let k = 1024
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  }
}

export default {
  init
}
