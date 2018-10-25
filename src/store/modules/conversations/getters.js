const getAllConversations = state => { return state.allConversations }

const getUserConversations = state => id => { 
  return state.allConversations.filter(c => c.users.filter(item => item === id).length > 0)
}

const searchConversations = state => search => {
  return state.allConversations.filter(c => c.name.startsWith(search))
}

const getCurrentConversation = state => { return state.currentConversation }

const getRootDb = (state, getters, rootState, rootGetters) => { return rootGetters.getDB }

const getConversationById = state => id => { return state.allConversations.find(c => c.id === id) }

export default {
  getAllConversations,
  getUserConversations,
  getCurrentConversation,
  getRootDb,
  getConversationById,
  searchConversations
}
