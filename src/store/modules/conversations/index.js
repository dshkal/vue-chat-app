import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const initialState = {
  allConversations: [],
  currentConversation: ''
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
