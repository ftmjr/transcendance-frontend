<template>
  <VCard :loading="loading" title="Mes amis">
    <VRow>
      <VCol v-for="data in userStore.contacts" :key="data.id" sm="6" lg="4" cols="12">
        <VCard>
          <VCardTitle>
            <VAvatar rounded size="120" class="mx-auto user-profile-avatar">
              <VImg v-if="data.profile.avatar" :src="data.profile.avatar" />
              <VIcon v-else color="primary" icon="tabler-user" />
            </VAvatar>
            <span class="ml-2">{{ data.profile.name }} {{ data.profile.lastname }}</span>
          </VCardTitle>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useUserStore from '@/stores/UserStore'

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  mounted() {
    this.fetchFriends()
  },
  methods: {
    async fetchFriends() {
      this.loading = true
      await this.userStore.loadAllMyFriends()
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
