// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store/'

import vue_extend from './vue_extend'
Vue.use(vue_extend);

Vue.config.productionTip = false
Vue.use(ElementUI)

import HTTP from './http.js'
const http = new HTTP()
http.bind((req) => {
	Vue.prototype.$http = {
		get: (...args) => {
			return req(HTTP.GET, args)
		},
		post: (...args) => {
			return req(HTTP.POST, args)
		},
	}
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})