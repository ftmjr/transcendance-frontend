<template>
  <div>{{ room.name }} // to be done</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ChatRoomWithMembers } from '@/stores/RoomsStore'

export default defineComponent({
  props: {
    room: {
      type: Object as PropType<ChatRoomWithMembers>,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  }
})
</script>

<style scoped></style>
