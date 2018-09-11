const pageDesign = r => require.ensure([], () => r(require('VIEWS/pageDesign/index.vue')), 'pageDesign')
const pageView = r => require.ensure([], () => r(require('VIEWS/pageDesign/view.vue')), 'pageView')
export default [{
  path: '/',
  name: 'pageDesign',
  component: pageDesign
}, {
  // 传递模版id, 子组件通过this.$route.params 获取
  path: '/edit/:tid',
  name: 'pageDesign',
  component: pageDesign
}, {
  // 传递模版id, 子组件通过this.$route.params 获取
  path: '/view/:tid',
  name: 'pageView',
  component: pageView
}]
