<template>
  <v-btn
    :disabled="isLoading"
    color="primary"
    text
    size="large"
    class="w-full text-xs"
    @click="handleUpdateIsBanned"
  >
    {{ banned ? 'Débannir' : 'Bannir' }}
  </v-btn>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'
import { ChatMemberRole } from '@/utils/chatSocket'

const roomsStore = useRoomsStore()

const props = defineProps({
  stateOfIsBanned: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  roomId: {
    type: Number,
    required: true
  }
})

const isLoading = ref(false)
const banned = ref(props.stateOfIsBanned)

const handleUpdateIsBanned = async (e: Event) => {
  e.preventDefault()
  try {
    isLoading.value = true
    const member = roomsStore.getCurrentRoomMembers.find(
      (member) => member.memberId === props.userId
    )
    if (!member) return

    const newRole = banned.value ? ChatMemberRole.USER : ChatMemberRole.BAN
    await roomsStore.changeMemberRole(props.roomId, member, newRole)
    isLoading.value = false
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<style></style>
