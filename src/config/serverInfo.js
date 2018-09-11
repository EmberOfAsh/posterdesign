/* 服务器相关信息 */
const serverInfo = {
  uploadServer: 'http://192.168.1.8:3000',
  mainServer: 'http://localhost:8080',
  /* 获取上传地址 */
  getUploadUrl () {
    return this.uploadServer + '/upload'
  },
  /* 获取预览地址 */
  getViewUrl (res) {
    return this.uploadServer + res
  }
}

export default serverInfo
