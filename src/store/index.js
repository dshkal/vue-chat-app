import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from '../../firebase.config'
import user from './modules/users'
import conversations from './modules/conversations'

Vue.use(Vuex)
firebase.initializeApp(config)

const firestore = firebase.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

const initialState = {
  db: firestore,
  auth: firebase.auth
}

export default new Vuex.Store({
  state: initialState,
  getters: {
    getDB (state) {
      return state.db
    }
  },
  modules: {
    user,
    conversations
  }
})
