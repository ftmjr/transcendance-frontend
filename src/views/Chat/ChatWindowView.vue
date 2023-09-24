<template>
  <div>To develop</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'

export default defineComponent({
  name: 'ChatWindowView',
  components: {},
  setup() {
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen
    }
  },
  data() {
    return {
      isUserProfileSidebarOpen: false
    }
  }
})
</script>

<style scoped></style>
