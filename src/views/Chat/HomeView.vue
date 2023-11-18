<template>
  <section class="w-full h-full overflow-auto border rounded-md">
    <div class="relative flex w-full h-full overflow-hidden flex-nowrap">
      <chat-left-nav />
      <chat-room />
      <chat-right-nav />
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ChatMembersListButton from './ChatMembersListButton.vue'
import RoomSettings from './Settings.vue'
import MessageVue from './Message.vue'
import CreateRoom from './CreateRoom.vue'
import ChatLeftNav from './ChatLeftNav.vue'
import ChatRightNav from './ChatRightNav.vue'
import ChatRoom from './ChatRoom.vue'

export default defineComponent({
  components: {
    ChatMembersListButton,
    MessageVue,
    RoomSettings,
    CreateRoom,
    ChatLeftNav,
    ChatRightNav,
    ChatRoom
  }
})
</script>
<style lang="scss">
.h-full {
  height: 100%;
}
.h-\[65\] {
  height: 75px;
  bottom: 0rem;
}
.h-\[40px\] {
  height: 45px;
}
.relative {
  position: relative;
}
.bottom-\1\/2 {
  bottom: 50%;
}

.max-h-\1\/2 {
  height: 400px;
  max-height: 50%;
}
</style>
