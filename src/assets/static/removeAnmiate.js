/**
 * fix: html静态化后, 移除加载动画class
 *  */
window.onload = function () {
  setTimeout(() => {
    removeAnmiate()
  }, 1000)

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
}
