<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserList',
  data() {
    return {
      rowPerPage: 10,
      searchQuery: ''
    }
  }
})
</script>

<template>
  <VRow>
    <VCol></VCol>
    <VCol cols="12">
      <VCard title="Rechercher un Joeur">
        <VCardText class="flex flex-wrap py-4 gap-4">
          <div class="w-24">
            <VSelect
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />
          </div>
          <VSpacer />
          <VTextField
            class="transparent-input-box"
            v-model="searchQuery"
            placeholder="Rechercher"
            density="compact"
          />
        </VCardText>

        <VDivider />
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped></style>
