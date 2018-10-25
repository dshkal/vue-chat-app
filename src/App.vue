<template>
  <div id="app">
    <md-app>
      <md-app-toolbar class="md-primary">
        <div v-if="user" class="md-toolbar-section-end">
          <md-button @click="signOut">Sign Out</md-button>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      
    }
  },
  computed: {
    user: {
      get () {
        return this.$store.getters['user/getUser']
      }
    }
  },
  methods: {
    ...mapActions('user', {
      signOut: 'SIGN_OUT'
    })
  }
}
</script>

