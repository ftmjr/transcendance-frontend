<template>
  <v-layout>
    <v-navigation-drawer
      expand-on-hover
      rail
      location="right"
    >
      <template #prepend>
        <v-list-item
          v-for="member in chatStore.getConversations"
          :key="member.id"
          v-model="chatStore.dmReceiver"
          :class="{
            'pale-green-background': member.profile.status === 'Online',
            'received-message': true
          }"
          lines="two"
          :prepend-avatar="member.profile.avatar"
          :title="member.username"
          :subtitle="globalStore.getNotification(member)"
          @click="chatStore.setDmReceiver(member)"
        >
          <div
            v-if="globalStore.getNotification(member) != member.profile.status"
            class="status-circle"
          />
        </v-list-item>
      </template>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'ConversationsDrawer',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  }
})
</script>

<style scoped>
.pale-green-background {
  background-color: palegreen;
}
.status-circle {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>
