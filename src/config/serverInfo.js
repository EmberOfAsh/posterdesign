const isProduction = process.env.NODE_ENV === 'production'
let testMainServer = 'http://192.168.1.8:8080'

/* 服务器相关信息 */
const serverInfo = {
  uploadServer: isProduction ? 'http://192.168.1.8:3000' : 'http://192.168.1.8:3000',
  mainServer: isProduction ? 'http://192.168.1.8:8080' : testMainServer,
  /* 获取上传地址 */
  getUploadUrl () {
    return this.uploadServer + '/upload'
  },
  /* 获取预览地址 */
  getViewUrl (res) {
    return this.uploadServer + res
  },
  /** 获取字体接口 */
  getFontUrl () {
    return this.uploadServer + '/font'
  }
}

export default serverInfo
