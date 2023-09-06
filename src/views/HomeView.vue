<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
// import useGlobalStore from "@/stores/GlobalStore";
// import InviteDialog from "@/components/chat/InviteDialog.vue";

export default defineComponent({
  components: {},
  setup() {
    // const globalStore = useGlobalStore()
    const authStore = useAuthStore()
    return { authStore }
  }
})
</script>
