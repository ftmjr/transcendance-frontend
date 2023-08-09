<template>
  <div class="texto">
    <h1>Hello from Profile View</h1>
    my username : {{ user?.username }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
const authStore = useAuthStore()
const user = authStore.user
export default defineComponent({
  name: 'profile-view',
  setup() {
    return {
      user
    }
  },
  data() {
    return {
      user
    }
  }
})
</script>

<style lang="css">
.texto {
  color: white;
}
</style>
