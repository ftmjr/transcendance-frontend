<template>
  <div class="w-full text-center">
    <v-menu class="w-full" v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <button class="w-full p-2 text-left" v-bind="props">
          <span class="flex items-center gap-2">
            <avatar-badge
              :user-id="member.id"
              :user-profile="member.member.profile"
              :show-username="true"
              :size="36"
              avatar-variant="tonal"
              />
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
import { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import { PropType } from 'vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

const menu = ref(false)

const { member } = defineProps({
  member: {
    type: Object as PropType<MemberRoomWithUserProfiles>,
    required: true
  }
})
</script>
