
declare module 'Auth' {
  import {Status} from 'src/stores/AuthStore';

  export interface Coalition {
    id: number;
    name: string;
    slug: string;
    cover_url: string;
    image_url: string;
    color: string;
    score: number;
    user_id: number;
  }

  export interface Profile {
    id: number;
    userId: number;
    name:    string;
    lastname: string;
    avatar?: string;
    bio?:string;
    oauth?: {
        accessToken: string;
        refreshToken: string;
        coalitions: Coalition[];
    };
    status: Status;
  }

  export enum GameEvent {
    GAME_STARTED,
    GAME_ENDED,
    PLAYER_JOINED,
    PLAYER_LEFT,
    ACTION_PERFORMED,
    MATCH_WON,
    MATCH_LOST,
  }

  export interface GameHistory {
    id: number;
    gameId: number
    event: GameEvent;
    userId: number;
    timestamp: string;
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
    gameHistories?: GameHistory[];
    createdAt: string;
  }

  export interface UserSearchResult {
    id: number;
    username : string;
    email: string;
    name:    string;
    lastname: string;
    avatar?: string;
  }

  export interface ProfileHeaderData {
    coalition?: Coalition;
    avatar: string;
    fullName: string;
    username: string;
    joiningDate: Date;
    isCurrentUser: boolean;
  }

  export interface ProfileData {
    id: number;
    header: ProfileHeaderData;
    Profile: Profile;
    email: string;
  }

  export interface AuthState {
    token: string | null;
    user: User | null;
    error: {
      state: boolean;
      message: string;
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
    chatrooms: Chatroom[] | null
    // chatroomMessages: ChatroomMessage[]
    // chatroomMembers: ChatroomMember[]
    error: {
      state: boolean
      message: string
    }
  }
}
