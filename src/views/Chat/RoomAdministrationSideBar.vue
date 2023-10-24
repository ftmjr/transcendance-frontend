<template>
  <div>
    <div class="text-end mt-2">
      <VBtn v-if="$vuetify.display.smAndDown" variant="text" size="small" @click="$emit('close')">
        <VIcon :size="18" color="error" class="text-medium-emphasis"> tabler-x </VIcon>
      </VBtn>
    </div>
    <div>
      <div>
        <div v-for="member in roomStore.getCurrentRoomMembers" :key="member.member.id">
          {{ member.member.username }} - {{ member.role }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole } from '@/utils/chatSocket'

// @TODO: BUild this component
export default defineComponent({
  name: 'RoomAdministrationSideBar',
  setup() {
    const roomStore = useRoomsStore()
    const authStore = useAuthStore()
    return {
      roomStore,
      authStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    userRole(): ChatMemberRole {
      const roomMembers = this.roomStore.getCurrentRoomMembers
      const member = roomMembers.find((member) => member.member.id === this.authStore.getUser?.id)
      return member?.role ?? ChatMemberRole.USER
    }
  }
})
</script>

<style scoped></style>
