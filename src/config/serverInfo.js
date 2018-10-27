const isProduction = process.env.NODE_ENV === 'production'
let MainServer = 'http://192.168.1.8:8080'
let testMainServer = 'http://192.168.1.8:8080'
let uploadServer = 'http://192.168.1.8:3000'
// testMainServer = 'http://localhost:8080'

// 正式发布配置
// MainServer = 'http://112.17.115.76:12345'
// uploadServer = 'http://112.17.115.76:3000'

/* 服务器相关信息 */
const serverInfo = {
  uploadServer: isProduction ? uploadServer : uploadServer,
  mainServer: isProduction ? MainServer : testMainServer,
  /* 获取上传地址 */
  getUploadUrl () {
    return this.uploadServer + '/upload'
  },
  /* 获取预览地址 */
  getViewUrl (res) {
    if (res && res.startsWith('/')) {
      return this.uploadServer + res
    }
    return res
  },
  /** 获取字体接口 */
  getFontUrl () {
    return this.uploadServer + '/font'
  }
}

export default serverInfo
