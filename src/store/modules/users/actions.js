import { SIGN_UP, SIGN_IN, SIGN_OUT } from './user-types'

export default {
  [SIGN_UP] ({commit, rootState}, { email, password }) {
    return new Promise((resolve, reject) => {
      rootState.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          commit(SIGN_IN, {email: result.user.email, uid: result.user.uid})
          resolve({message: 'Registration successful'})
        })
        .catch(err => {  
          reject(new Error(err))
        })
    })
  },
  [SIGN_IN] ({commit, rootState}, { email, password }) {
    return new Promise((resolve, reject) => {
      rootState.auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => {
          commit(SIGN_IN, {email: result.user.email, uid: result.user.uid})
          resolve({message: 'Login successful'})
        })
        .catch(err => {  
          reject(new Error(err))
        })
    })
  },
  [SIGN_OUT] ({commit, rootState}) {
    return new Promise((resolve, reject) => {
      rootState.auth().signOut()
        .then(() => {
          commit(SIGN_OUT)
          resolve({message: 'Logout successful'})
        })
        .catch(err => {
          reject(new Error(err))
        })
    })
  }
}
