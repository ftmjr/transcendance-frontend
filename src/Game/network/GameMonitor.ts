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
  showViewer = 'reloadViewersList',
  ViewersRetrieved = 'viewers-retrieved',
  ViewerAdded = 'viewer-added',
  JoinGame = 'joinGame',
  showPlayers = 'reloadPlayersList',
  PlayersRetrieved = 'players-retrieved',
  PlayerAdded = 'player-added',
  PadMoved = 'padMoved',
  BallServed = 'ballServed',
  GameStateChanged = 'gameStateChanged',
  GameMonitorStateChanged = 'gameMonitorStateChanged',
  HostChanged = 'hostChanged',
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
  onGameEnded: (result: GAME_RESULT) => void
}

export interface BallServedData {
  userId: number,
  position: { x: number; y: number }
  direction: { x: number; y: number }
}
export interface PadMovedData {
  userId: number;
  direction: PAD_DIRECTION;
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
  onRoomIdUpdated: (roomId: number) => void
  onScoreUpdated: (score: { player1: number; player2: number }) => void
  onGameStateChanged: (state: GAME_STATE) => void
}

export type TRoomId = 0 | number

export enum GameMonitorState {
  Waiting,
  Ready, // all players are ready, waiting for users to click on start
  InitGame, // players have accepted to start, server allowing the game scene to start
  PlayingSceneLoaded, // playing scene loading finished on all clients
  Ended
}

export class GameMonitor {
  private score: Map<number, number> = new Map<number, number>()
  private working: boolean = false
  public roomId: number = 0
  public hostId: number = 0
  private gameSender: GameSender = null as unknown as GameSender
  private iaGameSender: GameSender = null as unknown as GameSender
  public players: Map<string, NetworkUser> = new Map<string, NetworkUser>()
  public viewers: Map<string, NetworkUser> = new Map<string, NetworkUser>()
  public state: GameMonitorState = GameMonitorState.Waiting
  private _onScoreUpdated: (score: { player1: number; player2: number }) => void = () => {}
  private _onGameMonitorStateChanged: (state: GameMonitorState) => void = () => {}

  constructor(
    private gameName: string,
    private gameUserType: GameUserType,
    private gameNetwork: GameNetwork,
    private vueUpdateObserver: VueUpdateObserver,
    room?: number
  ) {
    const roomToJoin = room || 0
    this.hostId = gameNetwork.user.userId
    this.gameNetwork.connectToAGame(roomToJoin, this.gameUserType, (response) => {
      const { worked, roomId } = response
      this.working = worked
      this.roomId = roomId
      this.vueUpdateObserver.onRoomIdUpdated(roomId)
    })
    this.listen()
  }

  //  -- listen to server methods --
  listen() {
    this.listenToPlayers()
    this.listenToViewers()
    this.listenToGameEvents()
    this.listenToScoreChanged()
  }
  listenToPlayers() {
    this.gameNetwork.socket?.on(
      GAME_EVENTS.PlayersRetrieved,
      (info: { id: number; data: NetworkUser[] }) => {
        const players = info.data
        console.log('players', players)
        players.forEach((player) => {
          this.players.set(player.username.toString(), player)
          this.score.set(player.userId, 0)
        })
        this.updateGameState()
        this.vueUpdateObserver.onPlayersUpdated(this.players)
      }
    )
    this.gameNetwork.socket?.on(
      GAME_EVENTS.PlayerAdded,
      (info: { id: number; data: NetworkUser }) => {
        const player = info.data
        this.players.set(player.username.toString(), player)
        this.score.set(player.userId, 0)
        this.updateGameState()
        this.vueUpdateObserver.onPlayersUpdated(this.players)
      }
    )
    this.gameNetwork.socket?.on(GAME_EVENTS.HostChanged, (info: { id: number; data: number }) => {
      this.hostId = info.data
      this._onGameMonitorStateChanged(this.state)
    })
  }

  updateGameState() {
    if (this.players.size >= 2 && this.state === GameMonitorState.Waiting) {
      this.state = GameMonitorState.Ready
    } else if (this.players.size === 1 && this.gameUserType === GameUserType.LocalPlayer) {
      this.state = GameMonitorState.Ready
    }
    this._onGameMonitorStateChanged(this.state)
  }

  listenToViewers() {
    this.gameNetwork.socket?.on(
      GAME_EVENTS.ViewersRetrieved,
      (info: { id: number; data: NetworkUser[] }) => {
        const viewers = info.data
        viewers.forEach((viewer) => {
          this.viewers.set(viewer.username.toString(), viewer)
        })
        this.vueUpdateObserver.onViewersUpdated(this.viewers)
      }
    )
    this.gameNetwork.socket?.on(
      GAME_EVENTS.ViewerAdded,
      (info: { id: number; data: NetworkUser }) => {
        const viewer = info.data
        this.viewers.set(viewer.username.toString(), viewer)
        this.vueUpdateObserver.onViewersUpdated(this.viewers)
      }
    )
  }

  listenToGameEvents() {
    // server will send GAME_EVENTS.GameMonitorStateChanged after checking if all players are ready
    this.gameNetwork.socket?.on(
      GAME_EVENTS.GameMonitorStateChanged,
      (info: { id: number; data: GameMonitorState }) => {
        this.state = info.data
        this._onGameMonitorStateChanged(this.state)
      }
    )
  }

  listenToScoreChanged() {
    this.gameNetwork.socket?.on(
      GAME_EVENTS.ScoreChanged,
      (info: { id: number; data: Array<{ userId: number; score: number }> }) => {
        const score = info.data
        score.forEach((score) => {
          this.score.set(score.userId, score.score)
        })
        this.vueUpdateObserver.onScoreUpdated(this.getScore())
        this._onScoreUpdated(this.getScore())
      }
    )
  }

  getPlayers(): Map<string, NetworkUser> {
    return this.players
  }

  getViewers(): Map<string, NetworkUser> {
    return this.viewers
  }

  listenToAPlayer(gameReceiver: GameReceiver, userId: number) {
    this.gameNetwork.socket?.on(GAME_EVENTS.PadMoved, (info: {id:number, data: PadMovedData}) => {
      if (userId === info.data.userId)
        gameReceiver.onPadMoved(info.data.direction)
    })
    this.gameNetwork.socket?.on(
      GAME_EVENTS.BallServed,
      (info: { id: number; data: BallServedData }) => {
        if (userId === info.data.userId)
          gameReceiver.onBallServed(info.data.position, info.data.direction)
      }
    )
    console.log('listening to player with Id', userId);
  }

  //  -- send to server methods --

  startGame() {
    // server will send GAME_EVENTS.GameMonitorStateChanged after checking if all players are ready
    this.gameNetwork.emitFromGame(
      GAME_EVENTS.GameStateChanged,
      this.roomId,
      false,
      GAME_STATE.waiting
    )
  }

  // will also be emitted by Pong Scene when ready
  gameSceneReady() {
    // server will send GAME_EVENTS.GameMonitorStateChanged after checking if all players are on the game scene
    this.gameNetwork.emitFromGame(
      GAME_EVENTS.GameStateChanged,
      this.roomId,
      false,
      GAME_STATE.playing
    )
  }
  decorateSender(gameSender: GameSender, type: 'player' | 'ia') {
    const isIA = type === 'ia'
    if (isIA) {
      this.iaGameSender = gameSender
    } else {
      this.gameSender = gameSender
    }
    gameSender.sendPadMove = (dir: PAD_DIRECTION) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.PadMoved, this.roomId, isIA, dir)
    }
    gameSender.sendBallServe = (
      position: { x: number; y: number },
      velocity: { x: number; y: number }
    ) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.BallServed, this.roomId, isIA, position, velocity)
    }
    gameSender.sendGameState = (state: GAME_STATE) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.GameStateChanged, this.roomId, isIA, state)
    }
    gameSender.sendGameEnded = (result: GAME_RESULT) => {
      this.gameNetwork.emitFromGame(GAME_EVENTS.GameResult, this.roomId, isIA, result)
    }
  }

  // -- operations methods --
  isOperational(): boolean {
    if (this.gameNetwork.socket === null) return false
    return this.gameNetwork.operational && this.working
  }

  getCurrentUser(): NetworkUser {
    const user = this.gameNetwork.user
    const isHost = this.hostId === user.userId
    return { ...user, isHost }
  }

  getOpponent(): NetworkUser {
    const currentUser = this.getCurrentUser()
    const opponent = Array.from(this.players.values()).find(
      (player) => player.username !== currentUser.username
    )
    return opponent ?? currentUser
  }

  getScore(): { player1: number; player2: number } {
    const players = Array.from(this.players.values())
    if (players.length !== 2)
      return {
        player1: this.score.get(players[0].userId) ?? 0,
        player2: this.score.get(0) ?? 0
      }
    // player 1 is always the host and player 2 is always the opponent
    const ids = [players[0].userId ?? 0, players[1].userId ?? 0]
    const player1Id = this.hostId === ids[0] ? ids[0] : ids[1]
    const player2Id = this.hostId === ids[0] ? ids[1] : ids[0]
    const score = {
      player1: this.score.get(player1Id) ?? 0,
      player2: this.score.get(player2Id) ?? 0
    }
    console.log('score', score)
    return score
  }
  reloadListOfPlayers() {
    // ask server to send GAME_EVENTS.PlayersRetrieved
    this.gameNetwork.emitFromGame(GAME_EVENTS.showPlayers, this.roomId, false)
  }

  reloadViewersList() {
    // ask server to send GAME_EVENTS.ViewersRetrieved
    this.gameNetwork.emitFromGame(GAME_EVENTS.showViewer, this.roomId, false)
  }

  reconnect() {
    this.gameNetwork.connectToAGame(this.roomId, this.gameUserType, (response) => {
      const { worked, roomId } = response
      this.working = worked
      this.roomId = roomId
      this.vueUpdateObserver.onRoomIdUpdated(roomId)
    })
  }

  disconnect() {
    this.gameNetwork.disconnect()
  }

  // -- game events callbacks --
  setOnScoreChanged(callback: (score: { player1: number; player2: number }) => void) {
    this._onScoreUpdated = callback
  }
  setOnGameMonitorStateChanged(callback: (state: GameMonitorState) => void) {
    this._onGameMonitorStateChanged = callback
  }
}
