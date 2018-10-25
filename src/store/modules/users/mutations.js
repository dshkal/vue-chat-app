import { SIGN_IN, SIGN_OUT } from './user-types'

export default {
  [SIGN_IN] (state, user) {
    state.user = user
  },
  [SIGN_OUT] (state) {
    state.user = ""
  }
}
