import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import '@/server/apiClient'

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import auth from './util/auth'
Vue.use(auth)

import cookies from 'vue-cookies'
Vue.use(cookies)

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import ElDataTable from '@femessage/el-data-table'
import ElFormRenderer from '@femessage/el-form-renderer'
import ElementUI, { Message, MessageBox } from '@femessage/element-ui'
import '@femessage/element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.component('el-form-renderer', ElFormRenderer)
Vue.component('el-data-table', ElDataTable)

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 全局组件自动注册
import './components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './assets/styles/reset.scss'

import './mock'

Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
