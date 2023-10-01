<template>
  <VCard class="p-2" color="surface">
    <div class="w-full flex items-center justify-between gap-2">
      <p class="font-weight-semibold">{{ room.name }}</p>
      <VAvatar :size="42" :image="room.avatar"> </VAvatar>
      <div v-if="profiles" class="v-avatar-group">
        <VAvatar
          v-for="memberData in profiles"
          :key="memberData.id"
          :size="32"
          variant="outlined"
          color="secondary"
          :image="memberData.member.profile?.avatar"
        />
      </div>
    </div>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useRoomsStore, { ChatRoomWithMembers, MemberRoomWithUserProfiles } from '@/stores/RoomsStore'

export default defineComponent({
  props: {
    room: {
      type: Object as PropType<ChatRoomWithMembers>,
      required: true
    },
    profiles: {
      type: Array as PropType<MemberRoomWithUserProfiles[]>
    }
  },
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {}
})
</script>

<style scoped></style>
