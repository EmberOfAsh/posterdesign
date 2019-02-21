/**
 * fix: html静态化后, 移除加载动画class
 *  */

setTimeout(() => {
  removeAnmiate()
}, 1200)

function removeAnmiate () {
  let inAnmiates = document.querySelectorAll('.v-enter')
  inAnmiates.forEach(el => {
    let css = el.getAttribute('class')
    let idx = css.indexOf('v-enter')
    let nc = css.substring(0, idx)
    console.debug('截取加载动画class:', css, ' -> ', nc)
    el.setAttribute('class', nc)
  })
}

function getHtmlContent (str) {
  return window.external.getHtmlContent(str)
}
