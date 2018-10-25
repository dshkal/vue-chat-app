<template>
  <div>
    <template v-if="user">
      <chatbar />
    </template>
    <div v-else class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item">
        <div class="img-container">
          <img src="../assets/chat.svg" width="300" height="500" alt="">
        </div>
        <p class="text-block">
          Do you want to communicate with different people about everything? Join our chat, will be fun.
        </p>
        <div class="fx__container">
          <div class="fx__item"><md-button class="md-primary md-raised" @click="showModalReg = true">Sign Up</md-button></div>
          <div class="fx__item">or</div>
          <div class="fx__item"><md-button class="md-primary md-raised" @click="showModalLog = true">Sign In</md-button></div>
        </div>
      </div>
      <modal v-if="showModalReg">
        <div slot="header">
          <h3 slot="header">Sign up</h3>
          <md-button class="close md-icon-button" @click="showModalReg = false">
            <md-icon>close</md-icon>
          </md-button>
        </div>
        <div slot="body">
          <md-field>
            <label for="email">Email</label>
            <md-input id="email" v-model="form.email" />
          </md-field>
          <md-field>
            <label for="password">Password</label>
            <md-input type="password" id="password" v-model="form.password" />
          </md-field>
        </div>
        <div slot="footer">
          <md-button class="md-primary md-raised" @click="signUp">Sign Up</md-button>
        </div>
      </modal>
      <modal v-if="showModalLog">
        <div slot="header">
          <h3 slot="header">Sign in</h3>
          <md-button class="close md-icon-button" @click="showModalLog = false">
            <md-icon>close</md-icon>
          </md-button>
        </div>
        <div slot="body">
          <md-field>
            <label for="email">Email</label>
            <md-input id="email" v-model="form.email" />
          </md-field>
          <md-field>
            <label for="password">Password</label>
            <md-input type="password" id="password" v-model="form.password" />
          </md-field>
        </div>
        <div slot="footer">
          <md-button class="md-primary md-raised" @click="signIn">Sign In</md-button>
        </div>
      </modal>
      <md-snackbar md-position="center" :class="{error: form.error}" :md-active.sync="showSnackbar" md-persistent>
        <span>{{msg}}</span>
      </md-snackbar>
    </div>
  </div>
</template>

<script>
import modal from '@/components/modal.vue'
import Chatbar from '@/components/Chatbar.vue'
import { mapActions } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      showModalReg: false,
      showModalLog: false,
      showSnackbar: false,
      msg: '',
      form: {
        email: '',
        password: '',
        error: false
      }
    }
  },
  components: {
    modal: modal,
    chatbar: Chatbar
  },
  computed: {
    user: {
      get () {
        return this.$store.getters['user/getUser']
      }
    }
  },
  methods: {
    signUp () {
      this.registrarion({ email: this.form.email, password: this.form.password})
        .then(result => {
          this.showModalReg = false
          this.form.error = false
          this.form.email = ''
          this.form.password = ''
          this.msg = result.message
          this.showSnackbar = true
        })
        .catch(err => {
          this.msg = err.message
          this.form.error = true
          this.showSnackbar = true
        })
    },
    signIn () {
      this.login({ email: this.form.email, password: this.form.password})
        .then(result => {
          this.showModalLog = false
          this.form.error = false
          this.form.email = ''
          this.form.password = ''
          this.msg = result.message
          this.showSnackbar = true
        })
        .catch(err => {
          this.msg = err.message
          this.form.error = true
          this.showSnackbar = true
        })
    },
    ...mapActions('user', {
      registrarion: 'SIGN_UP',
      login: 'SIGN_IN'
    })
  }
}
</script>
