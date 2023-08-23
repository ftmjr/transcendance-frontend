import axios from "@/utils/axios";
import { defineStore } from 'pinia'
import useAuthStore  from '@/stores/AuthStore'
import type { ChatroomMember, ChatroomMessage, Chatroom } from 'Chat'


const authStore = useAuthStore();

const useChatStore = defineStore({
    id:'chat',
    state: () => ({
        chatrooms: [],
        chatroomMembers: [],
        chatroomMessages: [],
    }),
    getters:{
        getChatrooms() : Chatroom[] | null { return this.chatrooms },
        getChatroomMessages() : ChatroomMessage[] | null { return this.chatroomMessages },
        getChatroomMembers() : ChatroomMember[] | null { return this.chatroomMembers },
    },
    actions:{
        async setChatrooms() {
            this.chatrooms.clear()
            this.chatrooms.push({id: 0, name: 'General', protected: false})
            try {
                const { data } = await axios.get("/chat/rooms/")
                this.chatrooms.push(...data)
            } catch (e) {
                //
            }
        },
        async setChatroomMembers(roomId: Number) {
            this.chatroomMembers.clear()
            try {
                const { data } = await axios.get("/chat/members/" + roomId)
                this.chatroomMembers.push(...data)
            } catch (e) {
                //
            }
        },
        async setChatroomMessages(roomId: Number) {
            this.chatroomMessages.clear()
            try {
                const { data } = await axios.get("/chat/messages/" + roomId)
                this.chatroomMessages.push(...data)
            } catch (e) {
                //
            }
        },
        addChatroom(chatroom: Chatroom) {
            this.getChatrooms.push(chatroom)
        },
        addChatroomMessage(chatroomMessage: ChatroomMessage) {
            this.getChatrooms.push(chatroomMessage)
        },
}
    })

export default useChatStore