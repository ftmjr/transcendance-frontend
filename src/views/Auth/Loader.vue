<template>
  <div id="AppLoader" @click="toggleLoader" :class="isActive ? 'start' : ''">
    <div class="loader-box" :class="isActive ? 'active' : ''">
      <div class="pad01"></div>
      <div class="loading-text">
        <svg viewBox="0 0 480 150">
          <symbol id="loading-s-text">
            <text text-anchor="middle" x="50%" y="80%">Loading...</text>
          </symbol>
          <g class="loader-g-ants">
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
          </g>
        </svg>
      </div>
      <div class="pad02"></div>
      <div class="ball"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)
const toggleLoader = () => {
  isActive.value = !isActive.value
}
</script>

<style scoped></style>
