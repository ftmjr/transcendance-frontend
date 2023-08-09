<template>
  <main class="w-screen h-screen overflow-hidden">
    <div class="grid w-full h-full grid-cols-12 bg-darkBlue">
      <aside class="relative hidden h-full lg:block lg:col-span-8">
        <img src="../assets/images/authBg.png" alt="landing" class="object-cover w-full h-full" />
        <div
          class="absolute top-0 left-0 z-10 grid w-full h-full bg-gradient place-items-center"
        ></div>
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

export default defineComponent({
  data() {
    return {
      bgImages: ['/assets/images/authBg.png', '/pong/backgrounds/pink_pong_bg.png']
    }
  }
})
</script>

<style>
.bg-gradient {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, #797e9e90 95%);
}
</style>
