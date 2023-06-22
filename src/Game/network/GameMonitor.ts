import type { GameNetwork, GameUser } from '@/Game/network/GameNetwork'
import { GameUserType } from '@/Game/network/GameNetwork'

export enum PAD_DIRECTION {
  up,
  down,
  none
}

export enum GAME_STATE {
  waiting,
  ballServing,
  playing,
  scored,
  finished
}

export enum GAME_RESULT {
  victory,
  defeat,
  draw
}

export enum GAME_EVENTS {
  ViewGame = 'view-game',
  ViewersRetrieved = 'viewers-retrieved',
  ViewerAdded = 'viewer-added',
  JoinGame = 'joinGame',
  PlayersRetrieved = 'players-retrieved',
  PlayerAdded = 'player-added',
  PadMoved = 'padMoved',
  BallServed = 'ballServed',
  GameStateChanged = 'gameStateChanged',
  ScoreChanged = 'scoreChanged',
  GameResult = 'gameResult'
}

export interface GameMove {
  pad?: {
    direction: PAD_DIRECTION
    lastPosition: {
      x: number
      y: number
    }
  }
  ball?: {
    x: number
    y: number
    velocityX: number
    velocityY: number
  }
}

export interface GameReceiver {
  onPadMoved: (dir: PAD_DIRECTION) => void
  onBallServed: (position: { x: number; y: number }, velocity: { x: number; y: number }) => void
  onGameStateChanged: (state: GAME_STATE) => void
  onScoreChanged: (score: { player1: number; player2: number }) => void
  onGameEnded: (result: GAME_RESULT) => void
}

export interface GameSender {
  sendPadMove: (dir: PAD_DIRECTION) => void
  sendBallServe: (position: { x: number; y: number }, velocity: { x: number; y: number }) => void
  sendGameState: (state: GAME_STATE) => void
  sendGameEnded: (result: GAME_RESULT) => void
}

export interface NetworkUser extends GameUser {
  isHost: boolean
  roomId?: TRoomId
}

export interface VueUpdateObserver {
  onPlayersUpdated: (players: Map<string, NetworkUser>) => void
  onViewersUpdated: (viewers: Map<string, NetworkUser>) => void
  onRoomIdUpdated: (roomId: string) => void
  onScoreUpdated: (score: { player1: number; player2: number }) => void
  onGameStateChanged: (state: GAME_STATE) => void
}

export type TRoomId = 'waiting-room' | string

export class GameMonitor {
  private score: Map<string, number> = new Map<string, number>()
  private working: boolean = false
  public roomId: TRoomId = 'waiting-room'
  private gameReceiver: GameReceiver = null as unknown as GameReceiver
  private gameSender: GameSender = null as unknown as GameSender
  public players: Map<string, NetworkUser> = new Map<string, NetworkUser>()
  public viewers: Map<string, NetworkUser> = new Map<string, NetworkUser>()

  constructor(
    private gameName: string,
    private gameUserType: GameUserType,
    private gameNetwork: GameNetwork,
    private vueUpdateObserver: VueUpdateObserver,
    room?: string
  ) {
    const roomToJoin = room || 'waiting-room'
    this.listenToPlayers()
    this.listenToViewers()
    this.gameNetwork.connectToAGame(roomToJoin, this.gameUserType, (worked, roomId: string) => {
      this.working = worked
      this.roomId = roomId
      this.vueUpdateObserver.onRoomIdUpdated(roomId)
    })
  }

  listenToPlayers() {
    this.gameNetwork.socket?.on(GAME_EVENTS.PlayersRetrieved, (players: NetworkUser[]) => {
      players.forEach((player) => {
        this.players.set(player.username.toString(), player)
        this.score.set(player.username, 0)
      })
      this.vueUpdateObserver.onPlayersUpdated(this.players)
    })
    this.gameNetwork.socket?.on(GAME_EVENTS.PlayerAdded, (player: NetworkUser) => {
      this.players.set(player.username.toString(), player)
      this.score.set(player.username, 0)
      this.vueUpdateObserver.onPlayersUpdated(this.players)
    })
  }

  listenToViewers() {
    this.gameNetwork.socket?.on(GAME_EVENTS.ViewersRetrieved, (viewers: NetworkUser[]) => {
      viewers.forEach((viewer) => {
        this.viewers.set(viewer.username.toString(), viewer)
      })
      this.vueUpdateObserver.onViewersUpdated(this.viewers)
    })
    this.gameNetwork.socket?.on(GAME_EVENTS.ViewerAdded, (viewer: NetworkUser) => {
      this.viewers.set(viewer.username.toString(), viewer)
      this.vueUpdateObserver.onViewersUpdated(this.viewers)
    })
  }

  getPlayers(): Map<string, NetworkUser> {
    return this.players
  }

  getViewers(): Map<string, NetworkUser> {
    return this.viewers
  }
  getCurrentUser(): NetworkUser {
    const user = this.gameNetwork.user
    const isHost = this.players.get(user.username)?.isHost ?? false
    return { ...user, isHost }
  }

  getOpponent(): NetworkUser {
    const currentUser = this.getCurrentUser()
    const opponent = Array.from(this.players.values()).find(
      (player) => player.username !== currentUser.username
    )
    return opponent ?? currentUser
  }

  listen(gameReceiver: GameReceiver, username?: string) {
    this.gameReceiver = gameReceiver
    this.gameNetwork.socket?.on(GAME_EVENTS.PadMoved, (user: GameUser, dir: PAD_DIRECTION) => {
      if (this.gameUserType === GameUserType.Viewer) {
        if (username === user.username) this.gameReceiver.onPadMoved(dir)
      } else {
        this.gameReceiver.onPadMoved(dir)
      }
    })
    this.gameNetwork.socket?.on(
      GAME_EVENTS.BallServed,
      (
        user: GameUser,
        position: { x: number; y: number }, // last position of the ball
        velocity: { x: number; y: number }
      ) => {
        if (this.gameUserType === GameUserType.Viewer) {
          if (username === user.username) this.gameReceiver.onBallServed(position, velocity)
        } else {
          this.gameReceiver.onBallServed(position, velocity)
        }
      }
    )
    this.gameNetwork.socket?.on(
      GAME_EVENTS.ScoreChanged,
      (state: { score: Record<string, number> }) => {
        const localPlayer = this.getCurrentUser()
        const playerScore = state.score[localPlayer.username] ?? 0
        const otherPlayerUsername = Object.keys(state.score).find(
          (username) => username !== localPlayer.username
        )
        let otherPlayerScore = 0
        if (otherPlayerUsername) {
          otherPlayerScore = state.score[otherPlayerUsername] ?? 0
        }
        const score = {
          player1: localPlayer.isHost ? playerScore : otherPlayerScore,
          player2: localPlayer.isHost ? otherPlayerScore : playerScore
        }
        this.vueUpdateObserver.onScoreUpdated(score)
        this.gameReceiver.onScoreChanged(score)
      }
    )
    this.gameNetwork.socket?.on(GAME_EVENTS.GameResult, this.gameReceiver.onGameEnded)
    this.gameNetwork.socket?.on(GAME_EVENTS.GameStateChanged, (state: GAME_STATE) => {
      this.gameReceiver.onGameStateChanged(state)
      this.vueUpdateObserver.onGameStateChanged(state)
    })
  }

  decorateSender(gameSender: GameSender) {
    this.gameSender = gameSender
    this.gameSender.sendPadMove = (dir: PAD_DIRECTION) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.PadMoved, this.roomId, dir)
    }
    this.gameSender.sendBallServe = (
      position: { x: number; y: number },
      velocity: { x: number; y: number }
    ) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.BallServed, this.roomId, position, velocity)
    }
    this.gameSender.sendGameState = (state: GAME_STATE) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.GameStateChanged, this.roomId, state)
    }
    this.gameSender.sendGameEnded = (result: GAME_RESULT) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.GameResult, this.roomId, result)
    }
  }

  isOperational(): boolean {
    if (this.gameNetwork.socket === null) return false
    return this.gameNetwork.operational && this.working
  }
}
