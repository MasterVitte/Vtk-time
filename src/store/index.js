import Vue from 'vue'
import Vuex from 'vuex'

import common from './common'
import user from './user/user'

import department from './department/department'

import specialty from './specialty/specialty'
import specialty_dependencies from './specialty/dependencies/specialty_dependencies'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		common,
		user,
		department,
		specialty,
    specialty_dependencies
	}
})
