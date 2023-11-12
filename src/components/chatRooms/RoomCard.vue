<template>
  <div
    class="p-2 my-2"
    :class="
      topBar
        ? 'text-slate-100'
        : 'bg-slate-600/50 rounded hover:bg-slate-800/50 cursor-pointer transition ease-in-out delay-150'
    "
  >
    <p class="flex gap-2 items-center">
      <VAvatar
        v-if="room.avatar"
        :size="42"
        :image="room.avatar"
      />
      <span class="font-weight-semibold text-high-emphasis"> {{ shortName(room.name) }} </span>
      <span class="text-disabled"> • {{ room.members.length }} Membre(s) </span>
      <VIcon
        v-if="room.password"
        :size="16"
        class="text-red-600"
      >
        tabler-lock
      </VIcon>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ChatRoomWithMembers } from '@/stores/RoomsStore'
import { PropType } from 'vue'

defineProps({
  room: {
    type: Object as PropType<ChatRoomWithMembers>,
    required: true
  },
  topBar: {
    type: Boolean,
    default: false
  }
})

const shortName = (name: string) => {
  // max length of 20 chars for room name and 3 dots
  return name.length > 14 ? name.slice(0, 14) + '...' : name
}
</script>

<style scoped></style>
