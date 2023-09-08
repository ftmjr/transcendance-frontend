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
        <VCardSubtitle v-if="!isVerified" class="mt-3">Scannez L'image</VCardSubtitle>
        <VCardSubtitle v-if="isVerified" class="mt-3 text-success">Youpi le double facteur est actif!</VCardSubtitle>
      </VCardItem>
      <VCardText v-if="isLoading" class="text-center">
        <VIcon icon="tabler-loader"></VIcon>
      </VCardText>
      <VCardText v-else class="pt-6 flex flex-col items-center">
        <img :src="qrCode" alt="QR Code" />
        <OtpInput v-model="verificationCode" />
        <p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>
        <VBtn @click="activateCode">Activez le 2FA</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from "@/stores/AuthStore";
import OtpInput from "@/components/profile/OtpInput.vue";

export default defineComponent({
  name: 'DoubleFactorModal',
  components: {
    OtpInput
  },
  props: {
    isDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  setup(){
    const authStore = useAuthStore();
    return { authStore }
  },
  data() {
    return {
      qrCode: '',
      isLoading: false,
      errorMessage: '',
      verificationCode: ''
    }
  },
  computed:{
    isVerified() {
      return this.authStore.user.twoFactorEnabled;
    }
  },
  methods: {
    dialogModelValueUpdate(value: boolean) {
      this.$emit('update:isDialogVisible', value)
    },
    async generateQrCode() {
      this.isLoading = true;
      this.qrCode = await this.authStore.generate2FAQrCode();
      this.isLoading = false;
    },
    async activateCode(){
      console.log('code 1', this.verificationCode);
      this.isLoading = true;
      console.log('code', this.verificationCode);
      const worked = await this.authStore.activate2FA(this.verificationCode);
      if (worked) {
        this.dialogModelValueUpdate(false);
      } else {
        this.errorMessage = 'Le code est invalide';
      }
      this.isLoading = false;
    }
  },
  watch: {
    isDialogVisible(value: boolean) {
      if (value) {
       this.generateQrCode();
      }
    }
  }
})
</script>

<style scoped></style>
