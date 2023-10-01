<template>
  <VCard class="flex gap-2 items-center justify-center py-2" color="transparent">
    <p class="font-weight-semibold">{{ room.name }}</p>
    <div class="v-avatar-group">
      <VAvatar
        v-for="memberData in profiles"
        :key="memberData.id"
        :size="32"
        variant="outlined"
        color="secondary"
        :image="memberData.member.profile?.avatar"
      />
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
      loading: false,
      profiles: [] as MemberRoomWithUserProfiles[]
    }
  },
  mounted() {
    this.fetchDatas()
  },
  methods: {
    async fetchDatas() {
      this.loading = true
      const data = await this.roomStore.getRoomMembersData(this.room.id)
      this.loading = false
      if (!data) return
      this.profiles = data
    }
  }
})
</script>

<style scoped></style>
