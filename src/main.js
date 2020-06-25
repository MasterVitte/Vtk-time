import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueSession from 'vue-session'

import Uimini from 'uimini/dist/css/uimini.css'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.config.productionTip = false
const session = Vue.prototype.$session

Vue.use(Vuelidate)

Vue.use(Uimini)

Vue.use(VueSession)

Vue.use(BootstrapVue)

new Vue({
	el: '#app',
	router,
	store,
	components: {App},
	template: '<App/>',
	created () {
		session.start()
		var config = {
			apiKey: 'AIzaSyCq9xbfMG9Aj8R35xgSmmSqeDpwOaHN_nI',
			authDomain: 'vtk-time.firebaseapp.com',
			databaseURL: 'https://vtk-time.firebaseio.com',
			projectId: 'vtk-time',
			storageBucket: 'vtk-time.appspot.com',
			messagingSenderId: '510567569767'
		}
		firebase.initializeApp(config)
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				session.set('user', user)
				this.$store.dispatch('loggedUser', user)
			}
			this.$store.dispatch('loadDepartments')
			this.$store.dispatch('loadSpecialtyes')
			this.$store.dispatch('loadEducations')
		})
	}
})
