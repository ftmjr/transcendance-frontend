<template>
  <v-layout>
    <v-navigation-drawer
      expand-on-hover
      rail
      location="right"
    >
      <template #prepend>
        <v-list-item
          v-for="member in chatStore.getMembers"
          :key="member.id"
          lines="two"
          :prepend-avatar="member.member.profile.avatar"
          :title="member.member.username"
          :subtitle="member.member.profile.status"
          @click="globalStore.openProfileDialog(member)"
        />
      </template>
    </v-navigation-drawer>
    <v-main style="height: 250px" />
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'MembersDrawer',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  }
})
</script>

<style scoped></style>
