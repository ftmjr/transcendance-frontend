<template>
  <VCard :loading="loading" color="transparent" variant="flat">
    <div class="flex items-center justify-center gap-4">
      <div v-if="blockStatus !== BlockedStatus.BlockedBy && !isMe">
        <VBtn
          v-if="status === FriendshipStatus.Friends"
          color="error"
          size="small"
          variant="outlined"
          @click="userStore"
        >
          <VIcon size="20" start icon="tabler-user-minus" />
          Supprimer des amis
        </VBtn>
        <VBtn
          v-else-if="status === FriendshipStatus.Pending"
          color="warning"
          variant="outlined"
          size="small"
          @click="userStore.rejectFriendRequest(friendId)"
        >
          <VIcon size="20" start icon="tabler-x" />
          Annuler la demande
        </VBtn>
        <VBtnGroup v-else-if="status === FriendshipStatus.NeedApproval">
          <VBtn
            color="success"
            size="small"
            variant="outlined"
            @click="userStore.approveFriendRequest(state.data.id)"
          >
            <VIcon size="20" start icon="tabler-check" />
            Accepter
          </VBtn>
          <VBtn
            color="error"
            size="small"
            @click="userStore.rejectFriendRequest(state.data.id)"
            variant="outlined"
          >
            <VIcon size="20" start icon="tabler-x" />
            Refuser
          </VBtn>
        </VBtnGroup>
        <VBtn
          v-else-if="status === FriendshipStatus.None"
          color="primary"
          variant="outlined"
          size="small"
          @click="userStore.askFriendRequest(friendId)"
        >
          <VIcon size="20" start icon="tabler-user-plus" />
          Ajouter en ami
        </VBtn>
      </div>
      <div v-if="!isMe">
        <VBtn
          v-if="blockStatus === BlockedStatus.Blocked || blockStatus === BlockedStatus.Mutual"
          color="dark"
          variant="tonal"
          size="small"
          @click="userStore.unblockUser(friendId)"
        >
          <VIcon size="20" start icon="tabler-lock" />
          Débloquer
        </VBtn>
        <VBtn
          v-else-if="blockStatus === BlockedStatus.None"
          color="dark"
          size="small"
          variant="tonal"
          @click="userStore.blockUser(friendId)"
        >
          <VIcon size="20" start icon="mingcute-unlock-fill" />
          Bloquer
        </VBtn>
      </div>
    </div>
  </VCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useUserStore, {
  BlockedStatus,
  CheckFriendshipResponse,
  FriendshipStatus
} from '@/stores/UserStore'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  props: {
    friendId: {
      type: Number,
      required: true
    }
  },
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    return {
      authStore,
      userStore
    }
  },
  data() {
    return {
      loading: false,
      state: { status: FriendshipStatus.None, data: null } as CheckFriendshipResponse,
      blockStatus: BlockedStatus.None
    }
  },
  computed: {
    FriendshipStatus(): typeof FriendshipStatus {
      return FriendshipStatus
    },
    BlockedStatus(): typeof BlockedStatus {
      return BlockedStatus
    },
    isMe(): boolean {
      return this.friendId === this.authStore.user?.id
    },
    status(): FriendshipStatus {
      return this.state.status
    }
  },
  beforeMount() {
    this.fetchFriendShipState()
  },
  methods: {
    async fetchFriendShipState() {
      if (this.isMe) return
      this.loading = true
      this.state = await this.userStore.checkFriendShip(this.friendId)
      this.blockStatus = await this.userStore.checkBlocked(this.friendId)
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
