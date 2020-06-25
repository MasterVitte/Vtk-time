import firebase from 'firebase/app'
import Dependence from './specialty_dependencies_help'

export default {
  state: {
    dependencies: []
  },
  mutations: {
    loadDependencies(state, payload) {
      state.dependencies = payload
    },
    newDependence(state, payload) {
      state.dependencies.push(payload)
    },
    editDependence(state, {id, specialty, department_id}) {
      const dependence = state.dependencies.find(t => {
        return t.id === id
      })
      dependence.specialty = specialty
      dependence.department_id = department_id
    }
  },
  actions: {
    async loadDependencies ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const dependence = await firebase.database().ref('department_of_specialty').once('value')
        const dependencies = dependence.val()
        const dependenciesArray = []
        Object.keys(dependencies).forEach(key => {
          const t = dependencies[key]
          dependenciesArray.push(
            new Dependence(
              t.specialty,
              t.department_id,
              t.user,
              key
            )
          )
        })
        commit('loadDependencies', dependenciesArray)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async newDependence ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newDependence = new Dependence(
          payload.specialty,
          payload.department_id,
          getters.user.uid
        )
        const dependence = await firebase.database().ref('department_of_specialty').push(newDependence)
        commit('newDependence', {
          ...newDependence,
          id: dependence.key
        })
        commit('setLoading', false)
        commit('loadDependencies')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async editDependence ({commit}, {id, specialty, department_id}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('department_of_specialty').child(id).update({
          specialty,
          department_id
        })
        commit('editDependence', {id, specialty, department_id})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async deleteDependence ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('department_of_specialty').child(id).remove()
        commit('setLoading', false)
        commit('loadDependencies')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
  },
  getters: {
    dependencies (state) {
      if (state.dependencies != null) {
        return state.dependencies
      } else {
        return false
      }
    }
  }
}
