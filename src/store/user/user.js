import firebase from 'firebase/app'
import User from './user_help'

export default {
	state: {
		user: null
	},
	mutations: {
		setUser (state, payload) {
			state.user = payload
		}
	},
	actions: {
		async registerUser ({commit}, {email, password}) {
			commit('clearError')
			commit('setLoading', true)
			try {
				const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
				commit('setUser', new User(user))
				commit('setLoading', false)
			} catch (error) {
				commit('setLoading', false)
				commit('setError', error.message)
				throw error
			}
		},
		async loginUser ({commit}, {email, password}) {
			commit('clearError')
			commit('setLoading', true)
			try {
				const user = await firebase.auth().signInWithEmailAndPassword(email, password)
				commit('setUser', new User(user))
				commit('setLoading', false)
			} catch (error) {
				commit('setLoading', false)
				commit('setError', error.message)
				throw error
			}
		},
		loggedUser ({commit}, user) {
			try {
				commit('setUser', user)
			} catch (error) {
				commit('setLoading', false)
				commit('setError', error.message)
				throw error
			}
		},
		logoutUser ({commit}) {
			firebase.auth().signOut()
			commit('setUser', null)
		}
	},
	getters: {
		user (state) {
			return state.user
		}
	}
}