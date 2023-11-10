<template>
  <VSnackbar
    v-model="isSnackbarVisible"
    transition="scale-transition"
    location="top"
    :timeout="2000"
  >
    {{ snackbarMsg }}
    <template #actions>
      <VBtn color="error" @click="isSnackbarVisible = false"> Fermer </VBtn>
    </template>
  </VSnackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotificationPopUp',
  props: {
    snackbarMsg: {
      type: String,
      default: () => ''
    },
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['update:visible'],
  computed: {
    isSnackbarVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  }
})
</script>

<style scoped></style>
