declare module 'Auth' {

  export interface Profile {
    id: number;
    userId: number;
    name:    string;
    lastname: string;
    avatar?: string;
    bio?:string;
    oauth?: unknown;
  }
  export interface User {
    id: number;
    username : string;
    email: string;
    role : {};
    profile?: Profile;
    sessions: []; //Session[]
    games: []; //Game[]
    groups : []; //             Group[]
    twoFactorEnabled: boolean;
  }

  export interface UserSearchResult {
    id: number;
    username : string;
    email: string;
    name:    string;
    lastname: string;
    avatar?: string;
  }

  export interface AuthState {
    token: string | null
    tokenExpiry: number
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
    accessToken: string;
    user: User;
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
    id: number;
    memberId : number;
    chatroomId: number;
    role: Role;
    status: Status;
  }

  export interface ChatroomMessage {
    sender: string;
    message: string;
    timestamp: string;
  }

  export interface Chatroom {
    id: number;
    name: string;
    members: ChatroomMember[];
    messages: ChatroomMessage[];
    protected: boolean;
  }

  export interface ChatState {
    socket: SocketioService;
    socketOptions: any
    chatrooms: Chatroom[] | null
    chatroomMessages: ChatroomMessage[]
    chatroomMembers: ChatroomMember[]
    error: {
      state: boolean
      message: string
    }
  }
}
