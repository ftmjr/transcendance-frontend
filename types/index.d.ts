declare module 'Auth' {
  enum Status {
    Online = 'Online',
    Offline = 'Offline',
    Away = 'Away',
    Busy = 'Busy'
  }

  export interface FriendRequest {
    id: number
    senderId: number
    receiverId: number
    createdAt: string
  }

  export interface Profile {
    id: number
    userId: number
    name: string
    lastname: string
    avatar?: string
    bio?: string
    oauth?: unknown
    status: Status
  }

  export enum GameEvent {
    GAME_STARTED,
    GAME_ENDED,
    PLAYER_JOINED,
    PLAYER_LEFT,
    ACTION_PERFORMED,
    MATCH_WON,
    MATCH_LOST
  }

  export interface GameHistory {
    id: number
    gameId: number
    event: GameEvent
    userId: number
    timestamp: string
  }

  export interface User {
    id: number
    username: string
    email: string
    role: {}
    profile?: Profile
    sessions: [] //Session[]
    games: [] //Game[]
    groups: [] //             Group[]
    twoFactorEnabled: boolean
    gameHistories?: GameHistory[]
    createdAt: string
    sentContactRequests: FriendRequest[] //FriendRequest[]
    receivedContactRequests: FriendRequest[] //FriendRequest[]
    contacts: FriendRequest[] //FriendRequest[]
  }

  export interface UserSearchResult {
    id: number
    username: string
    email: string
    name: string
    lastname: string
    avatar?: string
  }

  export type Coalition = 'Legion' | 'Torrent' | 'Armada'
  export type FriendshipStatus = 'friends' | 'pending' | 'needApproval' | 'none'

  export interface ProfileHeaderData {
    coalition?: Coalition
    avatar: string
    fullName: string
    username: string
    joiningDate: Date
    isCurrentUser: boolean
  }

  export interface ProfileData {
    id: number
    header: ProfileHeaderData
    Profile: Profile
    email: string
    friendshipStatus: FriendshipStatus
  }

  export interface AuthState {
    token: string | null
    user: User | null
    error: {
      state: boolean
      message: string
    }
  }
  export interface RegisterBody {
    lastName: string
    firstName: string
    email: string
    password: string
    username: string
    passwordConfirmation: string
  }

  export interface ILoginData {
    accessToken: string
    user: User
  }
}

declare module 'Chat' {
  export enum Role {
    BAN,
    MUTE,
    USER,
    ADMIN,
    OWNER,
    SUPERMODERATOR
  }

  export enum Status {
    ONLINE,
    OFFLINE,
    BUSY,
    AWAY
  }

  export interface ChatroomMember {
    id: number
    memberId: number
    chatroomId: number
    role: Role
    status: Status
  }

  export interface ChatroomMessage {
    sender: string
    message: string
    timestamp: string
  }

  export interface Chatroom {
    id: number
    name: string
    members: ChatroomMember[]
    messages: ChatroomMessage[]
    protected: boolean
  }

  export interface ChatState {
    chatrooms: Chatroom[] | null
    // chatroomMessages: ChatroomMessage[]
    // chatroomMembers: ChatroomMember[]
    error: {
      state: boolean
      message: string
    }
  }
}
