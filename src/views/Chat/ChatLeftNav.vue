<template>
  <div
    :class="[
      'absolute z-50 w-64 h-full border-r border-gray-50/10 lg:left-0 lg:relative transition-all duration-300 ease-in',
      roomStore.isLeftNavOpen ? 'left-0' : '-left-full'
    ]"
    style="background-color: #0e1231"
  >
    <div class="flex flex-col h-full gap-0">
      <div
        class="flex items-center justify-between w-full px-2 border-b lg:justify-center h-14 text-primary"
      >
        <create-room />
        <v-btn
          class="lg:hidden"
          icon
          color="transparent"
          size="24"
          @click="roomStore.toggleLeftNav()"
        >
          <v-icon>iconamoon:close</v-icon>
        </v-btn>
      </div>
      <div class="flex-1">
        <div class="w-full h-1/2 shrink-0 grow-0">
          <ul class="grow-0 srink-0">
            <li class="w-full p-4 text-left">
              <button class="flex items-center justify-start gap-4">
                <span class="inline-block w-10 h-10 rounded-full bg-orange"></span>
                <span class="inline-block text-xl rounded-full line-clamp-1">
                  Attack des titans
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div class="w-full h-1/2 shrink-0 grow-0">
          <ul class="grow-0 srink-0">
            <li class="w-full p-4 text-left">
              <button class="flex items-center justify-start gap-4">
                <span class="inline-block w-10 h-10 rounded-full bg-orange"></span>
                <span class="inline-block text-xl rounded-full line-clamp-1">
                  Attack des titans
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CreateRoom from './CreateRoom.vue'
import useRoomsStore from '@/stores/RoomsStore'

const roomStore = useRoomsStore()
</script>
