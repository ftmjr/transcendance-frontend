<template>
  <div>Image will be here</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TwoFactorQrCode',
  props: {
    qrCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  }
})
</script>

<style scoped></style>
