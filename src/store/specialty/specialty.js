import firebase from 'firebase/app'
import Specialty from './specialty_help'

export default {
  state: {
    specialtyes: []
  },
  mutations: {
    loadSpecialtyes (state, payload) {
      state.specialtyes = payload
    },
    newSpecialty (state, payload) {
      state.specialtyes.push(payload)
    },
    editSpecialty (state, {id, title}) {
      const specialty = state.specialtyes.find(t => {
        return t.id === id
      })
      specialty.title = title
    }
  },
  actions: {
    async loadSpecialtyes ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const specialty = await firebase.database().ref('specialtyes').once('value')
        const specialtyes = specialty.val()
        const specialtyesArray = []
        Object.keys(specialtyes).forEach(key => {
          const t = specialtyes[key]
          specialtyesArray.push(
            new Specialty(
              t.title,
              t.use,
              t.user,
              key
            )
          )
        })
        commit('loadSpecialtyes', specialtyesArray)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async newSpecialty ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newSpecialty = new Specialty(
          payload.title,
          payload.use,
          getters.user.uid
        )
        const specialty = await firebase.database().ref('specialtyes').push(newSpecialty)
        commit('newSpecialty', {
          ...newSpecialty,
          id: specialty.key
        })
        commit('setLoading', false)
        commit('loadSpecialtyes')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async editSpecialty ({commit}, {id, title}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('specialtyes').child(id).update({
          title
        })
        commit('editSpecialty', {id, title})
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
    async deleteSpecialty ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('specialtyes').child(id).remove()
        commit('setLoading', false)
        commit('loadSpecialtyes')
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        // throw error
      }
    },
  },
  getters: {
    specialtyes (state, getters) {
      if (state.specialtyes != null) {
        return state.specialtyes
      } else {
        return false
      }
    }
  }
}
