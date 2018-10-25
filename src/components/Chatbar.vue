<template>
  <div class="md-layout md-gutter md-alignment-start-center chatbar">
    <div class="md-layout-item md-large-size-30 md-xlarge-size-20 md-small-size-0">
      <md-app-drawer :md-active.sync="menuVisible" :md-permanent="mobile ? 'clipped' : 'full'">
        <div class="md-title">Chatrooms</div>
        <md-list>
          <template v-if="getAllConversations.length === 0">
            <md-list-item @click="modalVisible = true">
                Create conversation
            </md-list-item>
          </template>
          <template v-else>
            <md-list-item @click="modalVisible = true">
                Create conversation
            </md-list-item>
            <md-list-item>
              <md-field>
                <md-icon>search</md-icon>
                <label for="search">Find</label>
                <md-input v-model="search" id="search" />
              </md-field>
            </md-list-item>
            <template v-if="userConversations.length > 0 && !filteredConversations">
              <md-list-item v-for="(item, index) in userConversations" @click="openConversation(item.id)" :key="index">
                {{item.name}}
              </md-list-item>
            </template>
            <template v-else>
              <md-list-item v-for="(item, index) in filteredConversations" @click="openConversation(item.id)" :key="index">
                {{item.name}}
              </md-list-item>
            </template>
          </template>
        </md-list>
      </md-app-drawer>
    </div>
    <div class="md-layout-item md-large-size-70 md-xlarge-size-80 md-small-size-100">
      <template v-if="!current">
        <p>Please select a chat to start messaging</p>
      </template>
      <template v-else>
        <div class="conversation-container">
          <div class="md-title conversation-title">Chatroom: {{current.name}}</div>
          <div class="messages-container">
            <template v-for="(item, index) in messages">
              <message :data="item" :author="item.sender === getUser.email" :key="index" />
            </template>
          </div>
          <div class="actions-container">
            <template v-if="userInConversation">
              <form @submit.prevent="sendMessage">
                <md-field>
                  <label for="message">Message</label>
                  <md-input id="message" v-model="message" />
                </md-field>
                <md-button type="submit" class="md-primary md-raised">Send</md-button>
              </form>
            </template>
            <template v-else>
              <md-button @click="enterConversaton" class="md-primary md-raised join">Join chat</md-button>
            </template>
          </div>
        </div>
      </template>
    </div>
    <modal v-if="modalVisible">
      <div slot="header">
        <md-button class="close md-icon-button" @click="modalVisible = false">
          <md-icon>close</md-icon>
        </md-button>
      </div>
      <div slot="body">
        <md-field>
          <label for="cname">Conversation name</label>
          <md-input id="cname" v-model="conversationName" />
        </md-field>
      </div>
      <div slot="footer">
        <md-button class="md-primary md-raised" @click="addConversation">Create</md-button>
      </div>
    </modal>
    <md-snackbar md-position="center" :class="{error: error}" :md-active.sync="showSnackbar" md-persistent>
      <span>{{msg}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import modal from './modal.vue'
import message from './conversation/message.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'chatbar',
  data () {
    return {
      menuVisible: true,
      mobile: window.innerWidth < 768,
      modalVisible: false,
      conversationName: '',
      showSnackbar: false,
      msg: '',
      search: '',
      message: '',
      error: false
    }
  },
  components: {
    modal,
    message
  },
  computed: {
    filteredConversations () {
      return this.search ? this.find(this.search) : null
    },
    userInConversation () {
      return this.current ? this.current.users.find(user => user === this.getUser.uid) : null
    },
    messages () {
      return this.current ? this.current.messages : []
    },
    userConversations: {
      get () {
        return this.getUserConversations(this.getUser.uid)
      }
    },
    ...mapGetters('conversations', {
      getAllConversations: 'getAllConversations',
      current: 'getCurrentConversation',
      db: 'getRootDb',
      getConversationById: 'getConversationById',
      getUserConversations: 'getUserConversations',
      find: 'searchConversations'
    }),
    ...mapGetters('user', {
      getUser: 'getUser'
    })
  },
  methods: {
    ...mapActions('conversations', {
      seed: 'SEED_CONVERSATIONS',
      create: 'CREATE_CONVERSATION',
      send: 'SEND_MESSAGE',
      join: 'ENTER_CONVERSATION'
    }),
    ...mapMutations('conversations', {
      saveConversation: 'CREATE_CONVERSATION',
      deleteConversation: 'DELETE_CONVERSATION',
      setCurrentConversation: 'OPEN_CONVERSATION',
      joinConversation: 'ENTER_CONVERSATION',
      updateMessages: 'SEND_MESSAGE'
    }),
    addConversation () {
      this.create({name: this.conversationName, uid: this.getUser.uid})
        .then(result => {
          this.modalVisible = false
          this.conversationName = ''
          this.error = false
          this.msg = result.msg
          this.showSnackbar = true
        }).catch(err => {
          this.msg = err.message
          this.error = true
          this.showSnackbar = true
        })
    },
    openConversation (id) {
      this.setCurrentConversation(this.getConversationById(id))
    },
    enterConversaton () {
      this.join({conversationID: this.current.id, user: this.getUser.uid})
    },
    sendMessage () {
      this.send({conversationID: this.current.id, created: Date.now(), sender: this.getUser.email, message: this.message})
        .then(() => {
          this.message = ''
          this.error = false
        })
        .catch(err => {
          this.msg = err.message
          this.error = true
          this.showSnackbar = true
        })
    }
  },
  created () {
    let self = this
    this.db.collection('conversations')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                let conversation = Object.assign({
                  id: change.doc.id
                }, change.doc.data())
                if (!self.getConversationById(change.doc.id)) self.saveConversation(conversation) 
            }
            if (change.type === "modified") {
              if (change.doc.data().users.length === self.getConversationById(change.doc.id).users.length) {
                self.updateMessages({messages: change.doc.data().messages, conversationID: change.doc.id})
              } else {
                self.joinConversation({uid: self.getUser.uid, conversationID: change.doc.id})
              }
            }
            if (change.type === "removed") {
                self.deleteConversation(change.doc.id)
            }
        });
      })
  }
}
</script>

<style>

</style>
