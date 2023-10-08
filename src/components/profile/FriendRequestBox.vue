<template>
  <VCard :loading="loading" color="transparent" variant="flat">
    <div class="flex items-center justify-center gap-4">
      <div v-if="blockStatus !== BlockedStatus.BlockedBy && !isMe">
         <!-- UNFRIEND, DELETE FRIEND -->
        <VBtn
          v-if="status === FriendshipStatus.Friends"
          color="error"
          size="small"
          variant="outlined"
          @click="unFriend"
        >
          <VIcon size="20" start icon="tabler-user-minus" />
          UNFRIEND
        </VBtn>
        <!-- CANCEL FRIEND REQUEST -->
        <VBtn
          v-else-if="status === FriendshipStatus.Pending"
          color="warning"
          variant="outlined"
          size="small"
          @click="cancelFriendRequest"
        >
          <VIcon size="20" start icon="tabler-x" />
          CANCEL FRIEND REQUEST
        </VBtn>
         <!-- ACCEPT/DECLINE FRIEND REQUEST -->
        <VBtnGroup v-else-if="status === FriendshipStatus.NeedApproval">
          <VBtn
            color="success"
            size="small"
            variant="outlined"
            @click="acceptFriendRequest"
          >
            <VIcon size="20" start icon="tabler-check" />
            ACCEPT
          </VBtn>
          <VBtn
            color="error"
            size="small"
            @click="declineFriendRequest"
            variant="outlined"
          >
            <VIcon size="20" start icon="tabler-x" />
            DECLINE
          </VBtn>
        </VBtnGroup>
        <!-- BEFRIEND, SEND FRIEND REQUEST -->
        <VBtn
          v-else-if="status === FriendshipStatus.None"
          color="primary"
          variant="outlined"
          size="small"
          @click="beFriendRequest"
        >
        <VIcon size="20" start icon="tabler-user-plus" />
             BEFRIEND
        </VBtn>
      </div>
      <!-- <div v-if="!isMe">
        <VBtn
          v-if="blockStatus === BlockedStatus.Blocked || blockStatus === BlockedStatus.Mutual"
          color="dark"
          variant="tonal"
          size="small"
          @click="userStore.unblockUser(friendId)"
        >
          <VIcon size="20" start icon="tabler-lock" />
          UNBLOCK
        </VBtn>
        <VBtn
          v-else-if="blockStatus === BlockedStatus.None"
          color="dark"
          size="small"
          variant="tonal"
          @click="userStore.blockUser(friendId)"
        >
          <VIcon size="20" start icon="mingcute-unlock-fill" />
          BLOCK
        </VBtn>
      </div> -->
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
    },
    async unBlockUser() {
      this.loading = true;
      await this.userStore.unblockUser(this.friendId);
      this.loading = false;
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
    async beFriendRequest() {
      await this.userStore.askFriendRequest(this.friendId)
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
    async cancelFriendRequest() {
      await this.userStore.cancelFriendRequest(this.state.data.id)
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
    async acceptFriendRequest() {
      await this.userStore.approveFriendRequest(this.state.data.id)
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
    async declineFriendRequest() {
      await this.userStore.rejectFriendRequest(this.state.data.id)
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
    async unFriend() {
      await this.userStore.unFriend(this.friendId)
      this.$nextTick(() => {
        this.fetchFriendShipState(); // re-fetch friendship state
      })
    },
  }
})
</script>

<style scoped></style>
