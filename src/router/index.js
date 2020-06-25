import Vue from 'vue'
import Router from 'vue-router'
import VueSession from 'vue-session'

import Home from '@/components/Home'
import Department from '@/components/Department'
import Specialty from '@/components/Specialty'
import Education from '@/components/Education'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'

Vue.use(Router)
Vue.use(VueSession)

const session = Vue.prototype.$session

export default new Router({
	components: {
		VueSession
	},
	mode: 'history',
  routes: [
    {
      path: '/',
	    name: 'Home',
	    component: Home
    },
	  {
		  path: '/department',
		  name: 'department',
		  component: Department,
		  beforeEnter (to, from, next) {
			  if (session.has('user')) {
				  next()
			  } else {
				  next('/login')
			  }
		  }
	  },
	  {
		  path: '/specialty',
		  name: 'specialty',
		  component: Specialty,
		  beforeEnter (to, from, next) {
			  if (session.has('user')) {
				  next()
			  } else {
				  next('/login')
			  }
		  }
	  },
	  {
		  path: '/education',
		  name: 'education',
		  component: Education,
		  beforeEnter (to, from, next) {
			  if (session.has('user')) {
				  next()
			  } else {
				  next('/login')
			  }
		  }
	  },
	  {
		  path: '/login',
		  name: 'login',
		  component: Login,
		  beforeEnter (to, from, next) {
			  if (session.has('user')) {
				  next('/')
			  } else {
				  next()
			  }
		  }
	  },
	  {
		  path: '/registration',
		  name: 'registration',
		  component: Registration,
		  beforeEnter (to, from, next) {
			  if (session.has('user')) {
				  next('/')
			  } else {
				  next()
			  }
		  }
	  }
  ]
})
