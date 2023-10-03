<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useUserStore from "@/stores/UserStore";
import useAuthStore from "@/stores/AuthStore";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    return {
      authStore,
      userStore
    }
  },
  data(){

  }
});
</script>

<style scoped>

</style>
