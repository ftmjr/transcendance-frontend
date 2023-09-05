<template>
  <aside class="chatRoom-select-container">
    <v-select
        bg-color='background'
        v-model="chatStore.selectedRoom"
        :items="rooms"
        item-title="name"
        label="Select"
        persistent-hint
        return-object
        single-line
        width="100"
    ></v-select>
  </aside>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useChatStore from "@/stores/ChatStore"
import useGlobalStore from "@/stores/GlobalStore"

export default defineComponent({
  name: 'room-selector',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    const { selectedRoom } = storeToRefs(chatStore)

    watch(selectedRoom, (newRoom) => {
      if (newRoom === chatStore.getRoom) {
        return
      }
      chatStore.setJoinName(newRoom.name)
      if(newRoom.protected) {
        globalStore.openPasswordDialog()
      } else {
        chatStore.joinRoom()
      }
    })
    return { chatStore, globalStore }
  },
  props: {
    rooms: {
      required: true
    },
  },
})
</script>

<style scoped></style>
