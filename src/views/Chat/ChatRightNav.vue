<template>
  <div
    :class="[
      'absolute w-64 h-full border-l border-gray-50/10 md:relative md:right-0 transition-all duration-300 ease-in',
      roomStore.isRightNavOpen ? 'right-0' : '-right-full'
    ]"
    style="background-color: #0e1231"
  >
    <div class="flex flex-col h-full gap-0">
      <div
        class="flex items-center justify-between w-full px-2 border-b md:justify-center h-14 text-primary grow-0 shrink-0"
      >
        <v-btn
          class="md:hidden"
          icon
          color="transparent"
          size="24"
          @click="roomStore.toggleRightNav()"
        >
          <v-icon>iconamoon:close</v-icon>
        </v-btn>
        <span> Membres </span>
      </div>
      <div class="flex-1 h-full">
        <div class="h-full overflow-scroll hide-scrollbar">
          <div class="w-full h-full shrink-0 grow-0">
            <perfect-scrollbar
              tag="ul"
              :options="{
                wheelPropagation: false,
                suppressScrollX: true
              }"
              class="h-full grow-0 srink-0 hide-scrollbar"
            >
              <li class="block px-2 py-2" v-for="m in roomStore.getCurrentRoomMembers" :key="m.id">
                <chat-members-list-button :member="m" />
              </li>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatMembersListButton from './ChatMembersListButton.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useRoomsStore from '@/stores/RoomsStore'

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
    default: true
  }
})

const roomStore = useRoomsStore()
</script>
