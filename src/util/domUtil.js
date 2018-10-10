/** 如果是复合组建， 追溯父节点来寻找组建信息 */
function getWidgetRoot (current) {
  function hp (node) {
    if (!node) return
    if (node.getAttribute('data-type')) {
      return node
    } else {
      return hp(node.parentElement)
    }
  }
  return hp(current)
}

function rgb2hex (rgb) {
  if (rgb.startsWith('#')) return rgb
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)
  return (rgb && rgb.length === 4) ? '#' +
   ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
   ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
   ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : ''
}
/** 根据给定的最大值 计算等级的字体大小 */
function calcFontWidths (max) {
  let ay = []
  if (!max) return ay
  max = max / 4
  let total = 10
  for (let i = total - 1; i > 0; i--) {
    ay.push(Math.ceil(max * ((total - i) / total)))
  }
  console.log('计算字体输入值候选， 最大值:', max, '字体候选：', ay)
  return ay
}

export default { getWidgetRoot, rgb2hex, calcFontWidths }
