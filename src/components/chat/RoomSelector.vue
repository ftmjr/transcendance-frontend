<template>
  <aside class="chatRoom-select-container">
    <v-select
      v-model="chatStore.selectedRoom"
      bg-color="background"
      :items="rooms"
      item-title="name"
      label="Select"
      persistent-hint
      return-object
      single-line
      width="100"
    />
  </aside>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useChatStore from '@/stores/ChatStore'
import useGlobalStore from '@/stores/GlobalStore'

export default defineComponent({
  name: 'RoomSelector',
  props: {
    rooms: {
      required: true
    }
  },
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    const { selectedRoom } = storeToRefs(chatStore)

    watch(selectedRoom, (newRoom) => {
      if (newRoom === chatStore.getRoom) {
        return
      }
      chatStore.setJoinName(newRoom.name)
      if (newRoom.protected) {
        globalStore.openPasswordDialog()
      } else {
        chatStore.joinRoom()
      }
    })
    return { chatStore, globalStore }
  }
})
</script>

<style scoped></style>
