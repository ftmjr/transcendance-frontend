import { GameNetwork, GameUser, GameUserType } from '@/Game/network/GameNetwork'

export enum PAD_DIRECTION {
  up,
  down,
  none
}

export enum GAME_STATE {
  Waiting,
  Preloading,
  Menu,
  Ready,
  Play,
  Pause,
  Ended
}

export interface PadMovedData {
  userId: number
  direction: PAD_DIRECTION
  position: { x: number; y: number }
}

export interface PaddleEngineData {
  userId: number
  direction: PAD_DIRECTION
  position: { x: number; y: number }
  speed: { x: number; y: number }
}

export interface BallData {
  userId: number
  position: { x: number; y: number }
  speed: { x: number; y: number }
}

export interface GameStateDataPacket {
  timestamp: number
  paddles: PaddleEngineData[]
  ball: {
    position: { x: number; y: number }
    speed: { x: number; y: number }
  }
  scores: Array<{ userId: number; score: number }>
}

export default class Monitor {
  private gameNetwork!: GameNetwork
  public scores: Array<{ userId: number; score: number }> = []
  public players: GameUser[] = []
  public viewers: GameUser[] = []
  public state: GAME_STATE = GAME_STATE.Waiting
  public hostId!: number
  public _phaserNewScoreRoutine:
    | ((scores: Array<{ userId: number; score: number }>, withEffect: boolean) => void)
    | undefined
  public _phaserNewPlayerListRoutine: ((users: GameUser[]) => void) | undefined
  public _phaserNewViewerListRoutine: ((users: GameUser[]) => void) | undefined
  public _phaserBallServedRoutine: ((data: BallData) => void) | undefined
  public _phaserBallMovedRoutine:
    | ((data: { position: { x: number; y: number }; speed: { x: number; y: number } }) => void)
    | undefined
  public _phaserPlayerMovedRoutine: ((data: PaddleEngineData) => void) | undefined
  public _phaserGameMonitorStateChangedRoutine: ((state: GAME_STATE) => void) | undefined
  public _phaserPlayerLeftRoutine: ((player: GameUser) => void) | undefined

  constructor(
    private readonly roomId: number,
    private readonly currentUser: GameUser & { userType: GameUserType },
    private moveToHistory: () => void
  ) {
    this.gameNetwork = new GameNetwork({
      userId: currentUser.userId,
      username: currentUser.username,
      avatar: currentUser.avatar
    })
    this.gameNetwork.connectToGame(roomId, currentUser.userType)
    this.listenToGameEvents()
  }

  private listenToGameEvents() {
    this.gameNetwork.onGameMonitorStateChanged((newState) => {
      this.state = newState
      if (this._phaserGameMonitorStateChangedRoutine)
        this._phaserGameMonitorStateChangedRoutine(newState)
    })
    this.gameNetwork.onHostChanged((newHost) => {
      this.hostId = newHost
    })
    this.gameNetwork.onScoreChanged((newScores) => {
      this.scores = newScores
      if (this._phaserNewScoreRoutine) this._phaserNewScoreRoutine(newScores, true)
    })
    this.gameNetwork.onPlayersRetrieved((players) => {
      this.players = players
      if (this._phaserNewPlayerListRoutine) this._phaserNewPlayerListRoutine(players)
    })
    this.gameNetwork.onPlayerAdded((player) => {
      if (this.players.some((p) => p.userId === player.userId)) return
      this.players.push(player)
      if (this._phaserNewPlayerListRoutine) this._phaserNewPlayerListRoutine(this.players)
    })
    this.gameNetwork.onPlayerLeft((player) => {
      this.players = this.players.filter((p) => p.userId !== player.userId)
      if (this._phaserNewPlayerListRoutine) this._phaserNewPlayerListRoutine(this.players)
      if (this._phaserPlayerLeftRoutine) this._phaserPlayerLeftRoutine(player)
    })
    this.gameNetwork.onViewersRetrieved((viewers) => {
      this.viewers = viewers
      if (this._phaserNewViewerListRoutine) this._phaserNewViewerListRoutine(viewers)
    })
    this.gameNetwork.onViewerAdded((viewer) => {
      if (this.viewers.some((v) => v.userId === viewer.userId)) return
      this.viewers.push(viewer)
      if (this._phaserNewViewerListRoutine) this._phaserNewViewerListRoutine(this.viewers)
    })
    this.gameNetwork.onBallMoved((data) => {
      if (this._phaserBallMovedRoutine) this._phaserBallMovedRoutine(data)
    })
    this.gameNetwork.onPadMoved((data) => {
      if (this._phaserPlayerMovedRoutine) this._phaserPlayerMovedRoutine(data)
    })
    this.gameNetwork.onObjectsStatePacket((state) => {
      const { paddles, ball, scores } = state
      if (paddles) {
        paddles.forEach((paddle) => {
          if (this._phaserPlayerMovedRoutine) this._phaserPlayerMovedRoutine(paddle)
        })
      }
      if (ball) {
        if (this._phaserBallMovedRoutine) this._phaserBallMovedRoutine(ball)
      }
      if (scores) {
        // check if same value with current score
        if (this.scores.length === 2) {
          if (scores[0].score === this.scores[0].score && scores[1].score === this.scores[1].score)
            return
        }
        this.scores = scores
        if (this._phaserNewScoreRoutine) this._phaserNewScoreRoutine(scores, false)
      }
    })
  }

  cleanAllPhaserRoutines() {
    this._phaserNewScoreRoutine = undefined
    this._phaserNewPlayerListRoutine = undefined
    this._phaserNewViewerListRoutine = undefined
    this._phaserBallServedRoutine = undefined
    this._phaserBallMovedRoutine = undefined
    this._phaserPlayerMovedRoutine = undefined
    this._phaserGameMonitorStateChangedRoutine = undefined
    this._phaserPlayerLeftRoutine = undefined
  }

  public isAgainstIA(): boolean {
    return this.players.some((player) => player.userId === 0)
  }

  public sendPadMove(data: PadMovedData) {
    if (this.state !== GAME_STATE.Play) return
    this.gameNetwork.sendPadMove(data)
  }

  public sendIaPadSpeed(velocity: number) {
    if (this.state !== GAME_STATE.Play) return
    // only send when we are the host
    if (this.hostId !== this.currentUser.userId) return
    this.gameNetwork.sendIaPadSpeed(velocity)
  }

  public serveBall() {
    if (this.state !== GAME_STATE.Play) return
    this.gameNetwork.sendBallServe({
      userId: this.currentUser.userId,
      position: { x: 667, y: 375 },
      speed: { x: 0, y: 0 }
    })
  }

  isNetworkOperational(): boolean {
    return this.gameNetwork.isOperational
  }
  reconnect() {
    this.gameNetwork.connectToGame(this.roomId, this.currentUser.userType)
    this.listenToGameEvents()
  }

  disconnectNetwork() {
    this.gameNetwork.disconnect()
  }

  public getPlayer1(): GameUser | undefined {
    return this.players.find((player) => player.userId === this.hostId)
  }
  public getPlayer2(): GameUser | undefined {
    return this.players.find((player) => player.userId !== this.hostId)
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

  public sendGameState(state: GAME_STATE) {
    if (state === GAME_STATE.Ready && this.state < GAME_STATE.Ready) {
      this.state = GAME_STATE.Ready
      if (this._phaserGameMonitorStateChangedRoutine)
        this._phaserGameMonitorStateChangedRoutine(state)
    }
    this.gameNetwork.sendGameState(state)
  }
  public pauseGame() {
    this.sendGameState(GAME_STATE.Pause)
  }

  public async quitGame() {
    this.sendGameState(GAME_STATE.Ended)
    this.disconnectNetwork()
  }
  public async quitAndMoveToHistory() {
    if (this.state !== GAME_STATE.Ended) {
      this.sendGameState(GAME_STATE.Ended)
    }
    this.disconnectNetwork()
    this.moveToHistory()
  }
}
