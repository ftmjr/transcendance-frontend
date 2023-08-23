<template>
  <div class="window">
  <v-container fluid>
  <v-avatar size="100">
    <v-img :src="profile.avatar"></v-img>
  </v-avatar>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Blocked Users List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="usersStore.blockedUsers"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${usersStore.formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
                <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => usersStore.unblock(item)">
              Unblock
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
<!--  <v-card-->
<!--      class="mx-auto"-->
<!--      max-width="500"-->
<!--  >-->
<!--    <v-card-title>-->
<!--      Friends List-->
<!--    </v-card-title>-->

<!--    <v-divider></v-divider>-->

<!--    <v-virtual-scroll-->
<!--        :items="friends"-->
<!--        height="120"-->
<!--        item-height="48"-->
<!--    >-->
<!--      <template v-slot:default="{ item }">-->
<!--        <v-list-item-->
<!--            :title="item.username"-->
<!--            :subtitle="`Since ${formatDate(item.createdAt)}`"-->
<!--        >-->
<!--          <template v-slot:prepend>-->
<!--            <v-avatar size="50">-->
<!--              <v-img :src="item.profile.avatar"></v-img>-->
<!--            </v-avatar>-->
<!--          </template>-->

<!--          <template v-slot:append>-->
<!--            <v-btn size="small" variant="tonal" @click="() => unfriend(item)">-->
<!--              Unfriend-->
<!--            </v-btn>-->
<!--          </template>-->
<!--        </v-list-item>-->
<!--      </template>-->
<!--    </v-virtual-scroll>-->
<!--  </v-card>-->
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Sent Friends Requests
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="usersStore.sentRequests"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.receiver.username"
            :subtitle="`Since ${usersStore.formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.receiver.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => usersStore.cancelRequest(item)">
              cancel
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Received Friends Requests
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="usersStore.receivedRequests"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.sender.username"
            :subtitle="`Since ${usersStore.formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.sender.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => usersStore.approveRequest(item)">
              Approve
            </v-btn>
            <v-btn size="small" variant="tonal" @click="() => usersStore.rejectRequest(item)">
              Reject
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      All Users
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="usersStore.users"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${usersStore.formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <div>
    <input type="file" @change="usersStore.handleFileChange" />
    <v-btn color="background" @click="usersStore.uploadFile">Upload</v-btn>
  </div>
    <v-btn color="background" @click="openUpdateDialog">Update Username</v-btn>
    <v-dialog v-model="updateDialog" max-width="500px">
      <v-card>
        <v-card-title>Protected Room</v-card-title>
        <v-card-text>
          <v-alert v-if="error" type="error" title="Action Failed" :text='error'></v-alert>
          <v-text-field
              label="New Username"
              v-model="username"
              type="text"
              :error-messages="error"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :color="isUpdateClickable ? 'primary' : 'disabled'" @click="updateUsername" :disabled="!isUpdateClickable">
            Update
          </v-btn>
          <v-btn color="error" @click="closeUpdateDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useUsersStore from "@/stores/UsersStore";
import { initFlowbite } from 'flowbite'
import { formValidator } from '@/utils/valiadator'
import axios from "@/utils/axios";

export default defineComponent({
  name: 'settings-view',
  setup() {
    const authStore = useAuthStore()
    const usersStore = useUsersStore()
    return {
      authStore,
      usersStore
    }
  },
  data() {
    return {
      error: '',
      username: '',
      updateDialog: false,
    }
  },
  computed: {
    user() { return this.authStore.getUser },
    profile() { return this.authStore.getUser?.profile },
    isUpdateClickable() {
      if (!this.username.trim()) {
        return false
      }
      return formValidator.isValidUsername(this.username)
    }
  },
  mounted() {
    initFlowbite()
    this.usersStore.refreshUserData()
    this.usersStore.getBlockedUsers()
    // this.usersStore.getUsers()
    this.usersStore.getFriends()
    this.usersStore.getSentRequests()
    this.usersStore.getReceivedRequests()
  },
  methods: {
    openUpdateDialog() {
      this.updateDialog = true
    },
    closeUpdateDialog() {
      this.error = ''
      this.username = ''
      this.updateDialog = false
    },
    async updateUsername() {
      try {
        await axios.post('/users/username/' + this.username)
        this.closeUpdateDialog()
        await this.authStore.refreshUser()
      } catch (e) {
        this.error = "username already taken"
      }
    }
  }
})
</script>

<style lang="css">
.window{
  height: 500px;
}
</style>
