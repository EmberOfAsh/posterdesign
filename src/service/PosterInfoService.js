let service = {
  loadPosterTemplate ($http, id, callback) {
    let url = '/poster/posterinfo/' + id
    $http.get(url).then(req => {
      let data = req.data.data
      let layouts = JSON.parse(data.layouts)
      data.layouts = layouts
      layouts.forEach(element => {
        element.imgUrl = 'http://localhost:8080' + element.imgUrl
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
        element.url = 'http://localhost:8080' + element.preview
      })
      let pager = response.data.pager
      callback(datas, pager)
    })
  }

}
export default service
