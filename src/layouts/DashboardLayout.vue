<template>
  <div class="container h-screen overflow-hidden">
    <div class="h-full w-full grid place-items-center">
      <div class="h-[98%] w-full relative flex flex-row md:gap-8">
        <SideBarLayout />
        <main class="bg-lightDarkBlue flex-grow rounded-lg">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderLayout from '@/components/Header.vue'
import useAuthStore from '@/stores/AuthStore'
import SideBarLayout from "@/components/SideBar.vue"

export default defineComponent({
  components: {
    // HeaderLayout,
    SideBarLayout
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  beforeCreate() {
    alert("me");
  //   check if the user is authenticated
  }
})
</script>

<style scoped>
</style>
