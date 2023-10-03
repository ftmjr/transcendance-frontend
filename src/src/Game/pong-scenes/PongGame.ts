import Phaser from 'phaser'
import type { GameMonitor } from '@/Game/network/GameMonitor'
import { AIPlayer } from '@/Game/players/AIPlayer'
import { LocalPlayer } from '@/Game/players/LocalPlayer'
import { GameUserType } from '@/Game/network/GameNetwork'
import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { PongSprite } from '@/Game/pong-scenes/Assets'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { OnlinePlayer } from '@/Game/players/OnlinePlayer'
import { PongBall } from '@/Game/players/PongBall'
import { GameMonitorState } from '@/Game/network/GameMonitor'

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
  public cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  public cam: Phaser.Cameras.Scene2D.Camera | undefined
  private userType: GameUserType = GameUserType.Player
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private awayPlayer: Player = null as unknown as Player
  private homePlayer: Player = null as unknown as Player
  private ball: PongBall = null as unknown as PongBall
  private networkIsOperational: boolean = false
  private middleLine: Phaser.GameObjects.Graphics | undefined
  private scoreLines: Phaser.Physics.Arcade.Group =
    undefined as unknown as Phaser.Physics.Arcade.Group
  private _gameReady: boolean = false
  public leftLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public rightLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public theme: PongTheme = 'Soccer'
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
    this.userType = data.userType
    this.gameMonitor = data.gameMonitor
    this.networkIsOperational = this.gameMonitor.isOperational()
    this.theme = data.theme
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

    if (this.userType === GameUserType.Player) {
      this.gameMonitor.gameSceneReady()
    }
    this.gameMonitor.setOnScoreChanged((score) => {
      this.updateScoreWithSync(score)
    })
    this.gameMonitor.setOnGameMonitorStateChanged((state) => {
      this.updatedGameMonitorState(state)
    })
  }

  update() {
    if (this._gameReady) {
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

  private updatedGameMonitorState(state: GameMonitorState) {
    if (state === GameMonitorState.PlayingSceneLoaded) {
      this.createPlayersOnTheField()
      this.createBallOnTheField()
      this._gameReady = true
    } else if (state === GameMonitorState.Ended) {
      // game ended either by a player or by the server show the end scene
      this.scene.start('EndGame', {
        userType: this.userType,
        gameMonitor: this.gameMonitor,
        theme: this.theme
      })
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
    switch (this.userType) {
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
      PongSprite.Paddle
    )
    this.awayPlayer = new AIPlayer(
      this.gameMonitor,
      this,
      { x: this.scale.width - 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle
    )
  }

  private createOnlineGamePlayers() {
    const opponent = this.gameMonitor.getOpponent()
    const homePosition = { x: 30, y: this.scale.height / 2 }
    const awayPosition = { x: this.scale.width - 30, y: this.scale.height / 2 }
    const isHost = this.gameMonitor.getCurrentUser().isHost
    const p1 = new LocalPlayer(
      this.gameMonitor,
      this,
      isHost ? homePosition : awayPosition,
      PongSprite.Paddle
    )
    const p2 = new OnlinePlayer(
      opponent,
      this.gameMonitor,
      this,
      isHost ? awayPosition : homePosition,
      PongSprite.AwayPaddle
    )
    this.homePlayer = isHost ? p1 : p2
    this.awayPlayer = isHost ? p2 : p1
  }

  private createViewGamePlayers() {
    const players = Array.from(this.gameMonitor.getPlayers().values())
    this.homePlayer = new OnlinePlayer(
      players[0],
      this.gameMonitor,
      this,
      { x: 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle
    )
    this.awayPlayer = new OnlinePlayer(
      players[1],
      this.gameMonitor,
      this,
      { x: this.scale.width - 30, y: this.scale.height / 2 },
      PongSprite.AwayPaddle
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

  private updateScoreWithSync(score: { player1: number; player2: number }) {
    const digitsScore1 = score.player1.toString().split('')
    const digitsScore2 = score.player2.toString().split('')
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
    this.scoredRoutine()
  }

  scoredRoutine() {
    this.cam?.shake(100, 0.01)
    this.scoreSound?.play({
      ...this.soundConfig,
      volume: 0.5
    })
    this.ball.resetBall()
  }
}
