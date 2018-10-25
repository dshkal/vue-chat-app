import { SEED_CONVERSATIONS, CREATE_CONVERSATION, SEND_MESSAGE, ENTER_CONVERSATION } from './conversation-types'

export default {
  [SEED_CONVERSATIONS] ({commit, rootState}) {
    let collection = rootState.db.collection('conversations')
    collection.get().then(result => {
      commit(SEED_CONVERSATIONS, result.docs)
    })

  },
  [CREATE_CONVERSATION] ({rootState}, {name, uid}) {
    let collection = rootState.db.collection('conversations')
    let newCollection = collection.doc()
    return new Promise((resolve, reject) => {
      if (!name) 
        reject(new Error('The field must not be empty'))
      else {
        newCollection.set({
          name: name,
          users: [uid],
          creator: uid,
          created: Date.now(),
          messages: []
        }).then(() => {
          resolve({msg: 'Conversation added'})
        }).catch(err => {
          reject(new Error(err))
        })
      }
    })
  },
  [ENTER_CONVERSATION] ({state, rootState}, {conversationID, user}) {
    let conversation = rootState.db.collection('conversations').doc(conversationID)
    conversation.update({
      users: [...state.currentConversation.users, user]
    })
  },
  [SEND_MESSAGE] ({state, rootState}, {conversationID, message, created, sender}) {
    let conversation = rootState.db.collection('conversations').doc(conversationID)
    return new Promise((resolve, reject) => {
      if (!message) 
        reject(new Error('The field must not be empty'))
      else {
        conversation.update({
          messages: [...state.currentConversation.messages, {created, sender, message}]
        }).then(() => {
          resolve({msg: 'Success'})
        }).catch(err => {
          reject(new Error(err))
        })
      }
    })
  }
}
