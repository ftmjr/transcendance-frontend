<template>
  <invite-dialog v-model="globalStore.showInvite" />
  <div class="container">
    <p class="text-white text-md">Dashboard home view</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useGlobalStore from "@/stores/GlobalStore";
import InviteDialog from "@/components/chat/InviteDialog.vue";

export default defineComponent({
  name: 'DashBoard',
  components: {InviteDialog},
  setup() {
    const globalStore = useGlobalStore()
    const authStore = useAuthStore()
    return { authStore, globalStore }
  },
})
</script>
