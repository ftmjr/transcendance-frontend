// src/Game/network/GameMonitor.ts
import type { GameNetwork, GameUser } from '@/Game/network/GameNetwork'
import { GameUserType } from '@/Game/network/GameNetwork'

export enum PAD_DIRECTION {
  up,
  down,
  none
}
export enum GAME_STATE {
  waiting,
  playing
}
export interface BallServedData {
  userId: number
  position: { x: number; y: number }
  direction: { x: number; y: number }
}
export interface PadMovedData {
  userId: number
  direction: PAD_DIRECTION
}

export interface GameReceiver {
  userId: number
  onPadMoved: (dir: PAD_DIRECTION) => void
  onBallServed: (position: { x: number; y: number }, velocity: { x: number; y: number }) => void
}

export interface GameSender {
  userId: number
  sendPadMove: (dir: PAD_DIRECTION) => void
  sendBallServe: (position: { x: number; y: number }, velocity: { x: number; y: number }) => void
  sendScored: () => void
}

export interface VueUpdateObserver {
  onPlayersUpdated: (players: GameUser[]) => void
  onViewersUpdated: (viewers: GameUser[]) => void
  onScoreUpdated: (scores: Array<{ userId: number; score: number }>) => void
  onGameMonitorStateChange: (state: GameMonitorState) => void
}

export enum GameMonitorState {
  Waiting, // waiting for players to join
  Ready, // all players are ready, waiting for users to click on start
  InitGame, // players have accepted to start, server allowing the game scene to start
  PlayingSceneLoaded, // playing scene loading finished on all clients
  Ended // game ended by server or by a player (disconnection)
}

export class GameMonitor {
  public scores: Array<{ userId: number; score: number }> = []
  public players: GameUser[] = []
  public viewers: GameUser[] = []
  public state: GameMonitorState = GameMonitorState.Waiting
  private sendingScored = false
  public hostId: number | undefined
  private _phaserNewScoreRoutine: (() => void) | undefined
  private _phaserNewPlayerListRoutine: (() => void) | undefined

  constructor(
    private readonly roomId: number,
    private readonly userType: GameUserType,
    private gameNetwork: GameNetwork,
    private vueUpdateObserver: VueUpdateObserver
  ) {
    this.gameNetwork.connectToGame(roomId, userType)
    this.listenToGameEvents()
  }

  public isAgainstIA(): boolean {
    return this.players.some((player) => player.userId === 0)
  }

  public isHost(): boolean {
    return this.hostId === this.gameNetwork.user.userId
  }

  public getPlayer1(): GameUser | undefined {
    return this.players.find((player) => player.userId === 1)
  }

  public getPlayer2(): GameUser | undefined {
    return this.players.find((player) => player.userId === 2)
  }
  public getPlayer1Score(): number {
    const player1 = this.getPlayer1()
    if (!player1) return 0
    return this.scores.find((score) => score.userId === player1.userId)?.score || 0
  }
  public getPlayer2Score(): number {
    const player2 = this.getPlayer2()
    if (!player2) return 0
    return this.scores.find((score) => score.userId === player2.userId)?.score || 0
  }

  private listenToGameEvents() {
    this.gameNetwork.onGameMonitorStateChanged((newState) => {
      this.state = newState
      this.vueUpdateObserver.onGameMonitorStateChange(newState)
    })
    this.gameNetwork.onHostChanged((newHost) => {
      this.hostId = newHost
    })
    this.gameNetwork.onScoreChanged((newScores) => {
      this.scores = newScores
      if (this._phaserNewScoreRoutine) this._phaserNewScoreRoutine()
      this.vueUpdateObserver.onScoreUpdated(newScores)
      this.sendingScored = false // allow sending again
    })
    this.gameNetwork.onPlayersRetrieved((players) => {
      this.players = players
      this.checkIfReady()
      if (this._phaserNewPlayerListRoutine) this._phaserNewPlayerListRoutine()
      this.vueUpdateObserver.onPlayersUpdated(players)
    })
    this.gameNetwork.onPlayerAdded((player) => {
      // check if player is already in list
      if (this.players.some((p) => p.userId === player.userId)) return
      this.players.push(player)
      this.checkIfReady()
      if (this._phaserNewPlayerListRoutine) this._phaserNewPlayerListRoutine()
      this.vueUpdateObserver.onPlayersUpdated(this.players)
    })
    this.gameNetwork.onViewersRetrieved((viewers) => {
      this.viewers = viewers
      this.vueUpdateObserver.onViewersUpdated(viewers)
    })
    this.gameNetwork.onViewerAdded((viewer) => {
      // check if viewer is already in list
      if (this.viewers.some((v) => v.userId === viewer.userId)) return
      this.viewers.push(viewer)
      this.vueUpdateObserver.onViewersUpdated(this.viewers)
    })
  }

  public listenToAPlayer(gameReceiver: GameReceiver) {
    this.gameNetwork.onPadMoved((data) => {
      if (gameReceiver.userId === data.userId) gameReceiver.onPadMoved(data.direction)
    })
    this.gameNetwork.onBallServed((data) => {
      if (gameReceiver.userId === data.userId)
        gameReceiver.onBallServed(data.position, data.direction)
    })
  }

  // phaser first scene is ready
  public startGame() {
    this.gameNetwork.sendGameState(GAME_STATE.waiting)
  }
  // playing scene in phaser is ready
  public gameSceneIsReady() {
    this.gameNetwork.sendGameState(GAME_STATE.playing)
  }

  private checkIfReady() {
    if (this.players.length >= 2 && this.state === GameMonitorState.Waiting) {
      this.state = GameMonitorState.Ready
    }
    this.vueUpdateObserver.onGameMonitorStateChange(this.state)
  }
  decorateSender(gameSender: GameSender) {
    const isIa = gameSender.userId === 0
    gameSender.sendPadMove = (dir: PAD_DIRECTION) => {
      this.gameNetwork.sendPadMove({ userId: gameSender.userId, direction: dir })
    }
    gameSender.sendBallServe = (
      position: { x: number; y: number },
      velocity: { x: number; y: number }
    ) => {
      this.gameNetwork.sendBallServe({ userId: gameSender.userId, position, direction: velocity })
    }
    gameSender.sendScored = () => {
      if (this.sendingScored) return // can only send if not already sending
      this.gameNetwork.sendScored(isIa)
    }
  }

  setPhaserNewScoreRoutine(phaserNewScoreRoutine: () => void) {
    this._phaserNewScoreRoutine = phaserNewScoreRoutine
  }
  setPhaserNewPlayerListRoutine(phaserNewPlayerListRoutine: () => void) {
    this._phaserNewPlayerListRoutine = phaserNewPlayerListRoutine
  }

  reloadPlayerListFromServer() {
    this.gameNetwork.reloadPlayersList()
  }
  reloadViewerListFromServer() {
    this.gameNetwork.reloadViewersList()
  }

  isNetworkOperational(): boolean {
    return this.gameNetwork.isOperational
  }
  reconnect() {
    this.gameNetwork.connectToGame(this.roomId, this.userType)
    this.listenToGameEvents()
  }

  disconnect() {
    this.gameNetwork.disconnect()
  }
}
