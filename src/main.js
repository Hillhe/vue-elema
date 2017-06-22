// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Goods from 'components/goods/Goods'
import Seller from 'components/seller/Seller'
import Ratings from 'components/ratings/Ratings'
import 'common/stylus/index.styl'

Vue.use(VueRouter)
Vue.use(VueResource)
let app = Vue.extend(App)
let router = new VueRouter({
	linkActiveClass: 'active'
})
router.map({
	'/goods': {component: Goods},
	'/seller': {component: Seller},
	'/ratings': {component: Ratings}
})
router.start(app, '#app')
router.go('/ratings')
