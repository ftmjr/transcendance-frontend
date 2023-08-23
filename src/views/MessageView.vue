<template>
  <h1 class="texte">Hello from MessageView</h1>
  <br>
  <div class="texte">[List of chatrooms]</div>
  <div class="texte" v-for="chatroom in chatStore.chatrooms">
    {{ chatroom.name }}
  </div>


<!--  <v-select-->
<!--      bg-color='background'-->
<!--      :items="chatStore.chatrooms"-->
<!--      item-title="name"-->
<!--      label="Select"-->
<!--      persistent-hint-->
<!--      return-object-->
<!--      single-line-->
<!--  ></v-select>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useChatStore from "@/stores/ChatStore";

export default defineComponent({
  name: 'message-view',
  setup(){
    const chatStore = useChatStore()
    return { chatStore }
  },
})
</script>

<style lang="css">
.texte{
  color: white;
}
</style>