<template>
  <div
    :class="[
      'absolute w-64 h-full border-l border-gray-50/10 md:relative md:right-0 transition-all duration-300 ease-in',
      roomsStore.isRightNavOpen ? 'right-0' : '-right-full'
    ]"
    style="background-color: #0e1231"
  >
    <div class="flex flex-col h-full gap-0">
      <div
        class="flex items-center justify-between w-full px-2 border-b md:justify-center h-14 text-primary"
      >
        <v-btn
          class="md:hidden"
          icon
          color="transparent"
          size="24"
          @click="roomsStore.toggleRightNav()"
        >
          <v-icon>iconamoon:close</v-icon>
        </v-btn>
        <span> Membres </span>
      </div>
      <div class="flex-1">
        <ul class="flex flex-col gap-4">
          <li class="block text-gray-50">
            <chat-members-list-button />
          </li>
          <li class="block text-gray-50">
            <chat-members-list-button />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ChatMembersListButton from './ChatMembersListButton.vue'
import useRoomsStore from '@/stores/RoomsStore'

const roomsStore = useRoomsStore()
</script>
