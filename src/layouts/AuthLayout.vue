<template>
  <main class="w-screen h-screen overflow-hidden">
    <div class="grid w-full h-full grid-cols-12 bg-darkBlue">
      <aside class="relative hidden h-full lg:block lg:col-span-8">
        <img :src="bgImage" alt="landing" class="object-cover w-full h-full" />
        <!--        <div v-show="routeName !=='reset-password'" class="absolute top-0 left-0 z-10 grid w-full h-full bg-gradient place-items-center">-->
        <!--        </div>-->
      </aside>
      <section
        class="relative grid h-full col-span-12 overflow-scroll lg:col-span-4 bg-darkBlue place-items-center box-border"
      >
        <router-view></router-view>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import assetBg from '@/assets/images/authBg.png'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      bgImages: [assetBg, '/pong/backgrounds/pink_pong_bg.png']
    }
  },
  computed: {
    routeName(): string {
      return this.$route.name as string
    },
    bgImage(): string {
      if (this.routeName === 'auth') return this.bgImages[0]
      else if (this.routeName === 'reset-password') return this.bgImages[1]
      else return this.bgImages[0]
    }
  }
})
</script>

<style>
.bg-gradient {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, #797e9e90 95%);
}
</style>
