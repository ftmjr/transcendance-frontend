<template>
  <VRow>
    <VCol cols="12" md="6">
      <TopChatCard />
    </VCol>
  </VRow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import TopChatCard from '@/views/Chat/TopChatCard.vue'
// import useGlobalStore from "@/stores/GlobalStore";
// import InviteDialog from "@/components/chat/InviteDialog.vue";

export default defineComponent({
  components: { TopChatCard },
  setup() {
    // const globalStore = useGlobalStore()
    const authStore = useAuthStore()
    return { authStore }
  }
})
</script>
