import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const initialState = {
  user: ''
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
}
