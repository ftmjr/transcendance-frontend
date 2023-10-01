<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    :color="isOnline ? 'success' : 'error'"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg v-if="avatar" :src="avatar" />
      <VIcon v-else icon="tabler-user" />
    </VAvatar>
    <VMenu activator="parent" width="230" location="bottom end" offset="14px">
      <VList>
        <VListItem :to="{ name: 'me' }">
          <template #prepend>
            <VListItemAction start>
              <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                <VAvatar color="primary" variant="tonal">
                  <VImg v-if="avatar" :src="avatar" />
                  <VIcon v-else icon="tabler-user" />
                </VAvatar>
              </VBadge>
            </VListItemAction>
          </template>

          <VListItemTitle class="font-weight-semibold">
            <template v-if="authStore.user"> {{ authStore.getUser.username }}</template>
            <template v-else>Nom d'utilisateur</template>
          </VListItemTitle>
          <VListItemSubtitle>
            <template v-if="authStore.user">{{ authStore.getUser.email }}</template>
            <template v-else>Email</template>
          </VListItemSubtitle>
        </VListItem>

        <VDivider class="my-2" />
        <VListItem :to="{ name: 'settings', params: { tab: 'account' } }">
          <template #prepend>
            <VIcon class="me-2" icon="tabler-settings" size="22" />
          </template>

          <VListItemTitle>Paramètre</VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'settings', params: { tab: 'security' } }">
          <template #prepend>
            <VIcon class="me-2" icon="tabler-lock" size="22" />
          </template>

          <VListItemTitle>Sécurité</VListItemTitle>
        </VListItem>
        <VDivider class="my-2" />

        <VListItem link @click="logout" color="red">
          <template #prepend>
            <VIcon class="me-2" icon="tabler-logout" size="22" />
          </template>
          <VListItemTitle>Se déconnecter</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VBadge>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore, { LoginStatus } from '@/stores/AuthStore'

export default defineComponent({
  name: 'UserProfileButton',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  computed: {
    isOnline(): boolean {
      return this.authStore.status === LoginStatus.LOGGED
    },
    avatar(): string | null {
      return this.authStore.getProfile?.avatar ?? null
    }
  },
  methods: {
    async logout() {
      await this.authStore.logout()
      this.$router.push({ name: 'auth' })
    }
  }
})
</script>

<style scoped lang="scss"></style>
