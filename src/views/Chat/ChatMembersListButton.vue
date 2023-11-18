<template>
  <div class="w-full text-center" v-if="member">
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
            <VIcon v-if="isOwner" :size="16" color="primary"> tabler-crown </VIcon>
            <VIcon v-else-if="isMuted" :size="16" color="gray"> tabler-user-minus </VIcon>
            <VIcon v-else-if="isBan" :size="16" color="gray"> tabler-user-x </VIcon>
          </span>
        </button>
      </template>

      <v-card class="">
        <v-list>
          <v-list-item>
            <mute-player
              :state-of-is-muted="isMuted"
              :room-id="member.chatroomId"
              :user-id="member.memberId"
            />
          </v-list-item>
          <v-list-item>
            <ban-player
              :state-of-is-banned="isBan"
              :room-id="member.chatroomId"
              :user-id="member.memberId"
            />
          </v-list-item>
          <v-list-item>
            <promote-player
              :member-role="member.role"
              :room-id="member.chatroomId"
              :user-id="member.memberId"
            />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MutePlayer from './MutePlayer.vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import BanPlayer from './BanPlayer.vue'
import PromotePlayer from './PromotePlayer.vue'
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'

export default defineComponent({
  components: {
    MutePlayer,
    BanPlayer,
    PromotePlayer,
    AvatarBadge
  },
  props: {
    member: {
      type: Object as PropType<MemberRoomWithUserProfiles>,
      required: true
    }
  },
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  data() {
    return {
      menu: false
    }
  },
  computed: {
    isOwner(): boolean {
      if (!this.member) return false
      return this.member.role === 'OWNER'
    },
    isMuted(): boolean {
      if (!this.member) return false
      return this.member.role === 'MUTED'
    },
    isBan(): boolean {
      if (!this.member) return false
      return this.member.role === 'BAN'
    }
  },
  methods: {
    toggleMenu() {
      this.menu = !this.menu
    }
  }
})
</script>
