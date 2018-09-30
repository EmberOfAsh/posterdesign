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
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? '#' +
   ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
   ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
   ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : ''
}

export default { getWidgetRoot, rgb2hex }
