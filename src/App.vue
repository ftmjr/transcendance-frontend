<script lang="ts">
import { defineComponent } from 'vue'
import { useTheme } from 'vuetify'
export default defineComponent({
  data() {
    const { global } = useTheme()
    const color = global.current.value.colors.primary
    return {
      color
    }
  },
  computed:{
    rgbPrimary(): string | null {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const hex = this.color.replace(shorthandRegex, (m: string, r: string, g: string, b: string) => {
        return r + r + g + g + b + b
      })
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null
    }
  }
})
</script>

<template>
  <VApp :style="`--v-global-theme-primary: ${rgbPrimary}`">
    <RouterView />
  </VApp>
</template>
