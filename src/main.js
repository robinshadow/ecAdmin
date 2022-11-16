import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI)

//引入api接口,并挂在vue原型上
import API from '@/api'
Vue.prototype.$API = API

//引入三级联动组件，并注册为全局组件
import CategorySelector from '@/components/CategorySelector'
Vue.component(CategorySelector.name, CategorySelector)


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
