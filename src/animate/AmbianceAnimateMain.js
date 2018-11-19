import snow1 from './js/snow1'
let map = new Map()

map.set(snow1.name, snow1)

// 如果不是从web加载的页面，执行
if (window.from !== 'loadFromUrl') {
  setTimeout(() => {
    updateBestDisplayZoom()
    startAnimate()
  }, 800)
}

function startAnimate () {
  document.querySelectorAll('#ambiance-animate').forEach(node => {
    let name = node.getAttribute('comp-name')
    let data = node.getAttribute('comp-data')
    console.debug('气氛动画组件: ', name, ' 数据:', data)
    let animateInfo = map.get(name)
    if (animateInfo) {
      animateInfo.method(node, data)
    }
  })
}
/**
 * 计算最佳缩放
 */
function updateBestDisplayZoom () {
  let dis = document.querySelector('#page-design-canvas')
  let tw = dis.style.width.replace('px', '') - 0
  let th = dis.style.height.replace('px', '') - 0
  let width = window.screen.width
  let height = window.screen.height
  let widthZoom = (width) * 100 / tw
  let heightZoom = (height) * 100 / th

  let bestZoom = Math.min(widthZoom, heightZoom) / 100
  console.debug('计算最佳缩放', bestZoom)
  dis.style.transform = `scale(${bestZoom})`
}
