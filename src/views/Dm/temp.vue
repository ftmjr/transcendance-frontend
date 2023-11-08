<template>
    <div class="h-full">
        <MessageTopBar
          :is-left-sidebar-open="isLeftSidebarOpen"
          :contact="conversationWith"
          :user-game-status="gameStatus"
          @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
        />
        <VDivider class="mb-1" />
        <PerfectScrollbar
          ref="MessagesLogScroller"
          tag="ul"
          :options="{
              wheelPropagation: false,
              suppressScrollX: true
          }"
          class="h-4/6"
        >
          <div
            v-for="(msgGrp, index) in msgGroups"
            :key="msgGrp.senderId + String(index)"
            class="chat-group flex items-center"
            :class="[
                {
                    'flex-row-reverse': msgGrp.senderId !== conversationWith.id,
                    'mb-8': msgGroups.length - 1 !== index
                }
            ]"
          >
            <div class="chat-avatar" :class="msgGrp.senderId !== conversationWith.id ? 'ms-4' : 'me-4'">
              <VAvatar size="38">
                <VImg
                  :src="msgGrp.senderId === conversationWith.id
                          ? conversationWith.profile.avatar
                          : authStore.getProfile?.avatar
                      "
                />
              </VAvatar>
            </div>
    <div
              class="chat-body d-inline-flex flex-column"
              :class="msgGrp.senderId !== conversationWith.id ? 'align-end' : 'align-start'"
            >
            <div v-for="(msgData, msgIndex) in msgGrp.messages" :key="msgData.time"
                  class="chat-content text-sm p-1.5 px-4 elevation-1"
                  :class="[
                      msgGrp.senderId === conversationWith.id
                          ? 'bg-slate-700/30 rounded-lg chat-left'
                          : 'bg-slate-400/30 rounded-lg text-white chat-right',
                      msgGrp.messages.length - 1 !== msgIndex ? 'mb-2' : 'mb-1'
                  ]">
              <p :title="">
                {{ msgData.message }}
              </p>
          
            </div>
            </div>
          </div>
        </PerfectScrollbar>
        <VDivider class="my-1" />
    <VForm @submit.prevent="sendMessage">
          <VTextField
            v-model="mpContent"
            variant="solo"
            class="transparent-input-box"
            placeholder="Ecrivez votre message..."
            density="default"
            autofocus
          >
            <template #append-inner>
              <VBtn type="submit" @click.prevent="sendMessage"> Envoyer un MP </VBtn>
            </template>
          </VTextField>
        </VForm>
      </div>
</template>