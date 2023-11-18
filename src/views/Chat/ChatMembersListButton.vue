<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <button class="w-full p-2 text-left" v-bind="props">
          <span class="flex items-center gap-2">
            <span class="w-8 h-8 border rounded-full"></span>
            <span> username </span>
          </span>
        </button>
      </template>

      <v-card class="">
        <v-list>
          <v-list-item>
            <mute-player :state-of-is-muted="false" :room-id="1" :user-id="1" />
          </v-list-item>
          <v-list-item>
            <banne-player :state-of-is-banned="true" :room-id="1" :user-id="1" />
          </v-list-item>
          <v-list-item>
            <promote-player player-role="player" :room-id="1" :user-id="1" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import MutePlayer from './MutePlayer.vue'
import BannePlayer from './BannePlayer.vue'
import PromotePlayer from './PromotePlayer.vue'

const menu = ref(false)
</script>
