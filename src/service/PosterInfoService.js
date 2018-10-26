import serverInfo from '../config/serverInfo'
import Vue from 'vue'
let service = {
  loadPosterTemplate ($http, id, callback) {
    let url = '/poster/posterinfo/' + id
    $http.get(url).then(req => {
      let data = req.data.data
      let layouts = JSON.parse(data.layouts || '[]')
      data.layouts = layouts
      layouts.forEach(element => {
        element.imgUrl = serverInfo.getViewUrl(element.imgUrl)
        element.zIndex = null
        // 修改: 设置全部zIndex为默认值
        // if (!element.zIndex)element.zIndex = 0
        if (!element.rotate)element.rotate = 0
        if (!element.fontFamily)element.fontFamily = ''
        if (!element.animates)element.animates = []
        if (!element.shadow)element.shadow = null
        if (element.display !== false)element.display = true
      })
      callback(data)
    })
  },
  loadPosterInfo ($http, pager, data, callback) {
    let url = '/poster/posterinfo/search/' + pager.current + '-' + pager.size
    $http.post(url, data).then(response => {
      let datas = response.data.data
      datas.forEach(element => {
        element.ratio = element.width / element.height
        element.url = serverInfo.getViewUrl(element.preview)
      })
      let pager = response.data.pager
      callback(datas, pager)
    })
  },
  /** 保存模版数据  */
  savePosterInfo ($http, data, callback) {
    let url = '/poster/posterinfo'
    $http.post(url, data).then(response => {
      if (response.data.status) {
        Vue.prototype.$message.success({
          message: response.data.msg
        })
      }
      if (callback) callback(response.data)
    })
  },
  updatePosterInfo ($http, data, callback) {
    let url = '/poster/posterinfo'
    $http.put(url, data).then(response => {
      if (response.data.status) {
        Vue.prototype.$message.success({
          message: response.data.msg
        })
      }
      if (callback) callback(response.data)
    })
  }

}
export default service
