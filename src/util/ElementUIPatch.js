import Vue from 'vue'
import axiosInit from './http'
import vueCommon from './vue-common'

Vue.prototype.$http = axiosInit()
vueCommon.init(Vue)
