import Phaser from 'phaser'
import type { GameMonitor } from '@/Game/network/GameMonitor'
import { AIPlayer } from '@/Game/players/AIPlayer'
import { LocalPlayer } from '@/Game/players/LocalPlayer'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { PongSprite } from '@/Game/pong-scenes/Assets'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { OnlinePlayer } from '@/Game/players/OnlinePlayer'
import { PongBall } from '@/Game/players/PongBall'
import { GameMonitorState } from '@/Game/network/GameMonitor'
import { GameSession } from '@/stores/GameStore'

export interface Player {
  getSprite(): Phaser.Physics.Arcade.Sprite
  scorePoint(): void
  update(): void
  update(ball: Phaser.Physics.Arcade.Sprite, min_x: number, max_x: number, velocity: number): void
  serveBall(): void
  onBallHit(): void // when the ball hits the paddle
}

export type ScoreBoard = { digit1: Phaser.GameObjects.Image; digit2: Phaser.GameObjects.Image }
export default class PongGame extends Phaser.Scene {
  private currentUser: GameUser & { type: GameUserType } = null as unknown as GameUser & {
    type: GameUserType
  }
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private gameSession: GameSession = null as unknown as GameSession
  public cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  public cam: Phaser.Cameras.Scene2D.Camera | undefined
  private awayPlayer: Player = null as unknown as Player
  private homePlayer: Player = null as unknown as Player
  private ball: PongBall = null as unknown as PongBall
  private middleLine: Phaser.GameObjects.Graphics | undefined
  private scoreLines: Phaser.Physics.Arcade.Group =
    undefined as unknown as Phaser.Physics.Arcade.Group
  private _gameReady: boolean = false
  public leftLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public rightLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public theme: PongTheme = 'Classic'
  private scoreImages: { player1: ScoreBoard; player2: ScoreBoard } | undefined
  public wallSound: Phaser.Sound.BaseSound | undefined
  public paddleSound: Phaser.Sound.BaseSound | undefined
  public scoreSound: Phaser.Sound.BaseSound | undefined
  public soundConfig: Phaser.Types.Sound.SoundConfig = {
    mute: false,
    volume: 0.5
  }
  constructor() {
    super('PongGame')
  }

  init(data: PreloadSceneData) {
    this.currentUser = data.currentUser
    this.gameMonitor = data.gameMonitor
    this.theme = data.gameSession.rules.theme ?? 'Classic'
    this.gameSession = data.gameSession
  }

  preload() {}

  create() {
    // this.physics.world.createDebugGraphic()
    this.physics.world.setBoundsCollision(true, true, true, true)
    this.cursorkeys = this.input.keyboard?.createCursorKeys()
    this.cam = this.cameras.main
    this.cam.flash()
    const width = this.scale.width
    const height = this.scale.height
    const fieldBackground = this.add
      .tileSprite(0, 0, width, height, PongSprite.GameField)
      .setOrigin(0, 0)
    if (this.theme === 'Arcade') {
      fieldBackground.setAlpha(0.1, 0.2, 0.2, 0.1)
    }
    this.wallSound = this.sound.add(PongSprite.WallSong)
    this.paddleSound = this.sound.add(PongSprite.PaddleSong)
    this.scoreSound = this.sound.add(PongSprite.ScoreSong)
    // Add score images
    this.scoreImages = {
      player1: {
        digit1: this.add.image(width / 2 - 25, 50, PongSprite.DigitAtlasSprites, '0'),
        digit2: this.add.image(width / 2 - 60, 50, PongSprite.DigitAtlasSprites, '0')
      },
      player2: {
        digit1: this.add.image(width / 2 + 25, 50, PongSprite.DigitAtlasSprites, '0'),
        digit2: this.add.image(width / 2 + 60, 50, PongSprite.DigitAtlasSprites, '0')
      }
    }
    this.scoreImages.player1.digit1.setVisible(false)
    this.scoreImages.player2.digit1.setVisible(false)

    this.createLines()
    if (this.currentUser.type === GameUserType.Player) {
      this.gameMonitor.gameSceneIsReady()
    }
    this.gameMonitor.setPhaserNewScoreRoutine(() => {
      this.updatedScoreRoutine()
    })
  }

  update() {
    if (!this._gameReady) {
      if (this.gameMonitor.state >= GameMonitorState.PlayingSceneLoaded) {
        this.createPlayersOnTheField()
        this.createBallOnTheField()
        this._gameReady = true
      }
    } else if (this.gameMonitor.state === GameMonitorState.Ended) {
      this.scene.start('EndGame', {
        currentUser: this.currentUser,
        gameMonitor: this.gameMonitor,
        gameSession: this.gameSession
      })
    } else {
      this.homePlayer.update()
      if (this.gameMonitor.isAgainstIA()) {
        ;(this.awayPlayer as AIPlayer).update(
          this.ball.getSprite(),
          this.scale.width / 2 + 10,
          this.scale.width,
          this.scale.height / 3 // vitesse de la raquette
        )
      } else {
        this.awayPlayer.update()
      }
    }
  }

  private createLines() {
    const width = this.scale.width
    const height = this.scale.height
    this.middleLine = this.add.graphics({
      lineStyle: { width: 4, color: 0xffffff }
    })
    this.middleLine.lineBetween(width / 2, 0, width / 2, height)
    this.add.image(width / 2, height / 2, PongSprite.FieldCenter).setOrigin(0.5, 0.5)
    this.scoreLines = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })
    this.leftLine = this.scoreLines.create(0, height / 2, PongSprite.GoalLine).setOrigin(0, 0.5)
    this.leftLine.displayHeight = height
    this.leftLine.displayWidth = 15
    this.leftLine.setPushable(false)
    this.rightLine = this.scoreLines
      .create(width, height / 2, PongSprite.GoalLine)
      .setOrigin(1, 0.5)
    this.rightLine.displayHeight = height
    this.rightLine.displayWidth = 15
    this.rightLine.setPushable(false)
  }
  private createPlayersOnTheField() {
    switch (this.currentUser.type) {
      case GameUserType.Viewer:
        this.createViewGamePlayers()
        break
      case GameUserType.Player:
        if (this.gameMonitor.isAgainstIA()) {
          this.createLocaleGamePlayers()
        } else {
          this.createOnlineGamePlayers()
        }
        break
    }
  }
  private createLocaleGamePlayers() {
    this.homePlayer = new LocalPlayer(
      this.gameMonitor,
      this,
      { x: 30, y: this.scale.height / 2 },
      PongSprite.Paddle,
      this.currentUser.userId
    )
    this.awayPlayer = new AIPlayer(
      this.gameMonitor,
      this,
      { x: this.scale.width - 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle
    )
  }

  private createOnlineGamePlayers() {
    const players = this.gameMonitor.players
    const opponent = players.find((player) => player.userId !== this.currentUser.userId)
    const homePosition = { x: 30, y: this.scale.height / 2 }
    const awayPosition = { x: this.scale.width - 30, y: this.scale.height / 2 }
    const isHost = this.gameMonitor.hostId === this.currentUser.userId
    const p1 = new LocalPlayer(
      this.gameMonitor,
      this,
      isHost ? homePosition : awayPosition,
      PongSprite.Paddle,
      this.currentUser.userId
    )
    const p2 = new OnlinePlayer(
      opponent,
      this.gameMonitor,
      this,
      isHost ? awayPosition : homePosition,
      PongSprite.AwayPaddle,
      opponent.userId
    )
    this.homePlayer = isHost ? p1 : p2
    this.awayPlayer = isHost ? p2 : p1
  }

  private createViewGamePlayers() {
    const players = this.gameMonitor.players
    this.homePlayer = new OnlinePlayer(
      players[0],
      this.gameMonitor,
      this,
      { x: 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle,
      players[0].userId
    )
    this.awayPlayer = new OnlinePlayer(
      players[1],
      this.gameMonitor,
      this,
      { x: this.scale.width - 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle,
      players[1].userId
    )
  }

  private createBallOnTheField() {
    this.ball = new PongBall(
      this,
      { x: this.scale.width / 2, y: this.scale.height / 2 },
      PongSprite.Ball,
      this.homePlayer,
      this.awayPlayer,
      this.leftLine,
      this.rightLine
    )
  }

  getBall(): PongBall {
    return this.ball
  }

  private updatedScoreRoutine() {
    const scores = this.gameMonitor.scores
    // check if there is two scores
    if (scores.length < 2) return
    const digitsScore1 = scores[0].score.toString().split('')
    const digitsScore2 = scores[1].score.toString().split('')
    if (digitsScore1.length > 1) {
      this.scoreImages?.player1.digit1.setVisible(true)
      this.scoreImages?.player1.digit1.setFrame(digitsScore1[1])
      this.scoreImages?.player1.digit2.setFrame(digitsScore1[0])
    } else {
      this.scoreImages?.player1.digit2.setFrame(digitsScore1[0])
    }
    if (digitsScore2.length > 1) {
      this.scoreImages?.player2.digit1.setVisible(true)
      this.scoreImages?.player2.digit1.setFrame(digitsScore2[0])
      this.scoreImages?.player2.digit2.setFrame(digitsScore2[1])
    } else {
      this.scoreImages?.player2.digit2.setFrame(digitsScore2[0])
    }
    this.camGoalShake()
  }

  camGoalShake() {
    this.cam?.shake(100, 0.01)
    this.scoreSound?.play({
      ...this.soundConfig,
      volume: 0.5
    })
    this.ball.resetBall()
  }
}
