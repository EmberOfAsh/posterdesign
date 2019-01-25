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
/**
 * @param {} hex 16进制颜色 转RGBA
 */
function hex2rgb (hex) {
  if (hex.startsWith('rgb')) return hex
  let rgb = []
  let a = 1
  let tc = hex.substring(1)
  let length = tc.length
  // 颜色位数为3位
  if (length === 3) {
    let ay = tc.split('')
    for (let idx = 0; idx < ay.length; idx++) {
      rgb[idx] = ay[idx] + ay[idx]
    }
  } else if (length === 4) {
    // 颜色位数为4位
    let ay = tc.split('')
    for (let idx = 0; idx < ay.length; idx++) {
      rgb[idx] = ay[idx] + ay[idx]
    }
    a = ay[3] + ay[3]
  } else if (length === 6) {
    // 颜色位数为6位
    let ay = tc.split('')
    for (let idx = 0; idx < ay.length; idx += 2) {
      rgb.push(ay[idx] + ay[idx])
    }
    a = 255
  } else if (length === 8) {
    // 颜色位数为8位
    let ay = tc.split('')
    let step = 0
    for (let idx = 0; idx < ay.length; idx += 2) {
      rgb[step] = ay[idx] + ay[idx + 1]
      step++
    }
    a = ay[6] + ay[7]
  } else {
    throw new Error('Bad Hex: ' + hex)
  }
  let ret = []
  ret.push('rgba(')
  ret.push(parseInt(rgb[0], 16))
  ret.push(',')
  ret.push(parseInt(rgb[1], 16))
  ret.push(',')
  ret.push(parseInt(rgb[2], 16))
  ret.push(',')
  ret.push(parseInt(a, 16) / 255)
  ret.push(')')
  return ret.join('')
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

function FormatInputData (data) {
  function next (obj, chi) {
    if (chi) {
      let ay = []
      chi.forEach(v => {
        let o = v.data
        ay.push(o)
        next(o, v.children)
      })
      obj.children = ay
    } else {
    }
  }

  let ret = []
  data.map((v) => {
    let obj = v.data
    ret.push(obj)
    next(obj, v.children)
  })
  return ret
}

export default { getWidgetRoot, rgb2hex, calcFontWidths, FormatInputData, hex2rgb }
