/**
 *  生成面包路径
 * @param {*} target 目标对象
 * @param {*} datas 所有数据
 * @param {*} getChild  获取
 * @param {*} getParentId 上一级id
 * @param {*} getSelfId   自己的id
 * @param {*} getSelf     获取自身数据
 */
function breadPath (target, datas, getChild, getParentId, getSelfId, getSelf) {
  /**
   * 深度遍历路径
   * @param {*} ay 路径数组
   * @param {*} target 目标对象
   * @param {*} datas  数组
   */
  function pathScan (ay, target, datas) {
    // 最顶级的item
    if (getParentId(target) === 0) {
      ay.push(target)
      return ay
    }

    var pid = getSelfId(target)
    for (var i = 0; i < datas.length; i++) {
      var v = datas[i]
      let self = getSelf(v)
      // 自身
      if (getSelfId(self) === pid) {
        ay.push(self)
        return
      }
      let chi = getChild(v)
      if (chi) {
        pathScan(ay, target, chi)
        if (ay.length > 0) {
          var cn = ay[ay.length - 1]
          let self = getSelf(v)
          if (getSelfId(self) === getParentId(cn)) {
            ay.push(self)
            return
          }
        }
      } else {
        if (ay.length === 0) {
          let self = getSelf(v)
          // 找到了位置
          if (getSelfId(self) === pid) {
            ay.push(self)
          }
        } else {
          var cn1 = ay[ay.length - 1]
          let self = getSelf(v)
          if (getSelfId(self) === getParentId(cn1)) {
            ay.push(self)
            return
          }
        }
      }
    }
  }
  var ay = []
  pathScan(ay, target, datas)
  return ay.reverse()
}

export default {
  breadPath
}
