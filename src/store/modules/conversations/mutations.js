import { SEED_CONVERSATIONS, CREATE_CONVERSATION, DELETE_CONVERSATION, ENTER_CONVERSATION, OPEN_CONVERSATION, SEND_MESSAGE } from './conversation-types'

export default {
  [SEED_CONVERSATIONS] (state, conversations) {
    state.allConversations = conversations
  },
  [CREATE_CONVERSATION] (state, conversation) {
    state.allConversations.push(conversation)
  },
  [DELETE_CONVERSATION] (state, id) {
    let conversations = state.allConversations.filter(conversation => conversation.id !== id)
    state.allConversations = conversations
  },
  [OPEN_CONVERSATION] (state, conversation) {
    state.currentConversation = conversation
  },
  [ENTER_CONVERSATION] (state, {uid, conversationID}) {
    let allCopy = state.allConversations
    allCopy.map(item => {
      item.users = item.id === conversationID ? [...item.users, uid] : item.users
      return item
    })
    state.allConversations = allCopy
  },
  [SEND_MESSAGE] (state, {messages, conversationID}) {
    let allCopy = state.allConversations
    allCopy.map(item => {
      item.messages = item.id === conversationID ? messages : item.messages
      return item
    })
    state.allConversations = allCopy
  }
}
