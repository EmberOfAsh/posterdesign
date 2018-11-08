import snow1 from './js/snow1'
let map = new Map()

map.set(snow1.name, snow1)

window.onload = function () {
  if (window.location.protocol === 'file:') {
    setTimeout(() => {
      startAnimate()
    }, 10)
  }
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
