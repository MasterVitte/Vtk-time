import firebase from 'firebase/app'
import Department from './department_help'

export default {
  state: {
    departments: []
  },
  mutations: {
    loadDepartments (state, payload) {
      state.departments = payload
    },
    newDepartment (state, payload) {
      state.departments.push(payload)
    },
    editDepartment (state, {id, title}) {
      const department = state.departments.find(t => {
        return t.id === id
      })
      department.title = title
    }
  },
  actions: {
    async loadDepartments ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const department = await firebase.database().ref('departments').once('value')
        const departments = department.val()
        const departmentsArray = []
        Object.keys(departments).forEach(key => {
          const t = departments[key]
          departmentsArray.push(
            new Department(
              t.title,
              t.use,
              t.user,
              key
            )
          )
        })
        commit('loadDepartments', departmentsArray)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async newDepartment ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newDepartment = new Department(
          payload.title,
          payload.use,
          getters.user.uid
        )
        const department = await firebase.database().ref('departments').push(newDepartment)
        commit('newDepartment', {
          ...newDepartment,
          id: department.key
        })
        commit('setLoading', false)
        commit('loadDepartments')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async editDepartment ({commit}, {id, title}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('departments').child(id).update({
          title
        })
        commit('editDepartment', {id, title})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async deleteDepartment ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('departments').child(id).remove()
        commit('setLoading', false)
        commit('loadDepartments')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    }
  },
  getters: {
    departments (state, getters) {
      if (state.departments != null) {
        return state.departments
      } else {
        return false
      }
    }
  }
}
