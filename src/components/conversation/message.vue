<template>
  <div class="message-item" :class="{right: author}">
    <div class="text">
      {{data.message}}
    </div>
    <div class="time">
      {{new Date(data.created)}}
    </div>
    <div class="author" v-if="!author">
      {{data.sender}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: {
    data: {
      message: String,
      sender: String,
      created: Date
    },
    author: Boolean
  }
}
</script>

<style>

</style>
