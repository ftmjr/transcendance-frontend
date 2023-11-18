<template>
  <div class="flex items-center gap-6">
    <v-select
      v-model="role"
      :disabled="canNotPromote || isLoading"
      label="Role"
      :items="rolesList"
      item-title="text"
      item-value="value"
      variant="outlined"
    ></v-select>

    <v-btn
      :disabled="memberRole === role || canNotPromote || isLoading"
      @click="tryToMute"
      color="primary"
      text
      size="small"
      class="text-xs"
    >
      Sauvegarder
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref, computed } from 'vue'
import { ChatMemberRole } from '@/utils/chatSocket'

const rolesList = [
  { value: ChatMemberRole.USER, text: 'Utilisateur' },
  { value: ChatMemberRole.ADMIN, text: 'Administrateur' },
  { value: ChatMemberRole.OWNER, text: 'Propriétaire' },
  { value: ChatMemberRole.BAN, text: 'Banni' },
  { value: ChatMemberRole.MUTED, text: 'Muet' }
]

const { memberRole, userId, roomId } = defineProps({
  memberRole: {
    type: String as PropType<ChatMemberRole>,
    required: true,
    default: ChatMemberRole.USER
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
const role = ref(memberRole)

const canNotPromote = computed(() => {
  return (
    role.value === ChatMemberRole.OWNER ||
    role.value === ChatMemberRole.BAN ||
    role.value === ChatMemberRole.MUTED
  )
})

const tryToMute = async (e: Event) => {
  e.preventDefault()
  try {
    if (role.value === memberRole) return
    isLoading.value = true
    console.log(`trying to promote user ${userId} in room ${roomId}`)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<style></style>
