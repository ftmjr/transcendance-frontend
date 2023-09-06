<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DoubleFactorModal',
  components: {},
  props: {
    isDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      qrCode: ''
    }
  },
  methods: {
    dialogModelValueUpdate(value: boolean) {
      this.$emit('update:isDialogVisible', value)
    }
  }
})
</script>

<template>
  <VDialog
    max-width="600"
    :model-value="isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <VBtn icon class="v-dialog-close-btn" @click="dialogModelValueUpdate(false)">
      <VIcon icon="tabler-x" color="error" />
    </VBtn>
    <VCard class="pa-5 pa-sm-15">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium">Activation du double facteur</VCardTitle>
        <VCardSubtitle class="mt-3">Scannez L'image</VCardSubtitle>
      </VCardItem>
      <VCardText class="pt-6">
        <p class="flex mb-6 justify-center">
          Entrez votre code de vérification à 6 chiffres // to do
        </p>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
