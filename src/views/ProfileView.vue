<template>
  <div class="texto">
    <h1>Hello from Profile View</h1>
    my username : {{ user?.username }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  name: 'profile-view',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
  },
  computed: {
    user() {
      return this.authStore.getUser
    }
  }
})
</script>

<style lang="css">
.texto {
  color: white;
}
</style>
