import Vue from 'vue'
import axiosInit from './http'
import vueCommon from './vue-common'
import VueBstcode from 'vue-bstcode'
Vue.prototype.$http = axiosInit(Vue.prototype.$message)
vueCommon.init(Vue)
Vue.use(VueBstcode)
