import Phaser from 'phaser'
import type { GameMonitor } from '@/Game/network/GameMonitor'
import { AIPlayer } from '@/Game/players/AIPlayer'
import { LocalPlayer } from '@/Game/players/LocalPlayer'
import { GameUserType } from '@/Game/network/GameNetwork'
import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { getPongSprites, PongSprite } from '@/Game/pong-scenes/Assets'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { OnlinePlayer } from '@/Game/players/OnlinePlayer'
import { PongBall } from '@/Game/players/PongBall'

export interface Player {
  getSprite(): Phaser.Physics.Arcade.Sprite
  scorePoint(): void
  update(): void
  update(ball: Phaser.Physics.Arcade.Sprite, min_x: number, max_x: number, velocity: number): void
  serveBall(): void
  onBallHit(): void // when the ball hits the paddle
}

type ScoreBoard = {digit1: Phaser.GameObjects.Image, digit2: Phaser.GameObjects.Image}
export default class PongGame extends Phaser.Scene {
  public cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  public cam: Phaser.Cameras.Scene2D.Camera | undefined
  private userType: GameUserType = GameUserType.Player
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private isAIAdversary: boolean = false
  private viewOnly: boolean = false
  private awayPlayer: Player = null as unknown as Player
  private homePlayer: Player = null as unknown as Player
  private ball: PongBall = null as unknown as PongBall
  public score: { player1: number; player2: number } = { player1: 0, player2: 0 }
  private networkIsOperational: boolean = false
  private middleLine: Phaser.GameObjects.Graphics | undefined
  private scoreLines: Phaser.Physics.Arcade.Group =
    undefined as unknown as Phaser.Physics.Arcade.Group
  public leftLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public rightLine: Phaser.Physics.Arcade.Sprite =
    undefined as unknown as Phaser.Physics.Arcade.Sprite
  public theme: PongTheme = 'Soccer'
  private spritesKeys: Record<PongSprite, string> = getPongSprites(this.theme)
  private scoreImages: { player1 :ScoreBoard; player2 :ScoreBoard }|undefined;
  constructor() {
    super('PongGame')
  }

  init(data: PreloadSceneData) {
    this.userType = data.userType
    this.gameMonitor = data.gameMonitor
    this.userType = data.userType
    if (data.userType === GameUserType.LocalPlayer) {
      this.isAIAdversary = true
    }
    if (data.userType === GameUserType.Viewer) {
      this.viewOnly = true
    }
    this.networkIsOperational = this.gameMonitor.isOperational()
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
    this.add.tileSprite(0, 0, width, height, PongSprite.GameField,0).setOrigin(0, 0);
    this.add.image(width/2, height/2, PongSprite.FieldCenter)
    // Add score images
    this.scoreImages = {
        player1: {
            digit1: this.add.image(width/2 - 25, 50, PongSprite.DigitAtlasSprites, '0'),
            digit2: this.add.image(width/2 - 60, 50, PongSprite.DigitAtlasSprites, '0')
        },
        player2: {
            digit1: this.add.image(width/2 + 25, 50, PongSprite.DigitAtlasSprites, '0'),
            digit2: this.add.image(width/2 + 60, 50, PongSprite.DigitAtlasSprites, '0')
        }
    }
    this.scoreImages.player1.digit1.setVisible(false)
    this.scoreImages.player2.digit1.setVisible(false)

    this.buildLines();
    if (this.isAIAdversary) {
      this.buildLocalGamePlayers()
    } else if (this.userType === GameUserType.Player) {
      this.buildOnlineGamePlayers()
    } else {
      this.buildViewOnlyGamePlayers()
    }
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

  buildLines() {
    const width = this.scale.width
    const height = this.scale.height
    this.middleLine = this.add.graphics({
      lineStyle: { width: 2, color: 0xffffff }
    })
    this.middleLine.lineBetween(width / 2, 0, width / 2, height)
    this.scoreLines = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })
    this.leftLine = this.scoreLines.create(0, height / 2, PongSprite.GoalLine)
    this.leftLine.displayHeight = height
    //this.leftLine.setTint(0xffffff) // set to white color
    this.leftLine.setPushable(false)
    this.rightLine = this.scoreLines.create(width, height / 2, PongSprite.GoalLine)
    this.rightLine.displayHeight = height
    this.rightLine.setTint(0xffffff) // set to white color
    this.rightLine.setPushable(false)
  }
  buildLocalGamePlayers() {
    this.homePlayer = new LocalPlayer(
      this.gameMonitor,
      this,
      { x: 20, y: this.scale.height / 2 },
      PongSprite.Paddle
    )
    this.awayPlayer = new AIPlayer(
      this,
      { x: this.scale.width - 20, y: this.scale.height / 2 },
      PongSprite.AwayPaddle
    )
  }

  buildOnlineGamePlayers() {
    const opponent = this.gameMonitor.getOpponent()
    const p1 = new LocalPlayer(
      this.gameMonitor,
      this,
      { x: this.scale.width - 50, y: 10 },
      PongSprite.Paddle
    )
    const p2 = new OnlinePlayer(
      opponent,
      this.gameMonitor,
      this,
      { x: 50, y: this.scale.height - 10 },
      PongSprite.AwayPaddle
    )
    if (!opponent.isHost) {
      this.homePlayer = p1
      this.awayPlayer = p2
    } else {
      this.homePlayer = p2
      this.awayPlayer = p1
    }
  }

  buildViewOnlyGamePlayers() {
    const players = Array.from(this.gameMonitor.getPlayers().values())
    const p1 = new OnlinePlayer(
      players[0],
      this.gameMonitor,
      this,
      { x: 50, y: this.scale.height - 10 },
      PongSprite.AwayPaddle
    )
    const p2 = new OnlinePlayer(
      players[1],
      this.gameMonitor,
      this,
      { x: 50, y: this.scale.height - 10 },
      PongSprite.AwayPaddle
    )
    if (!players[1].isHost) {
      this.homePlayer = p1
      this.awayPlayer = p2
    } else {
      this.homePlayer = p2
      this.awayPlayer = p1
    }
  }

  update() {
    this.homePlayer.update()
    if (this.isAIAdversary) {
      ;(this.awayPlayer as AIPlayer).update(
        this.ball.getSprite(),
        this.scale.width / 2 + 10,
        this.scale.width,
        this.scale.height / 3 // vitesse de la raquette
      )
    } else {
      this.awayPlayer.update()
    }
    this.ball.update()
  }

  updateScore() {
    // update score images
    const digitsScore1 = this.score.player1.toString().split('')
    const digitsScore2 = this.score.player2.toString().split('')
    if (digitsScore1.length > 1) {
      this.scoreImages?.player1.digit1.setVisible(true)
      this.scoreImages?.player1.digit1.setFrame(digitsScore1[1])
      this.scoreImages?.player1.digit2.setFrame(digitsScore1[0])
    }else{
      this.scoreImages?.player1.digit2.setFrame(digitsScore1[0])
    }
    if (digitsScore2.length > 1) {
        this.scoreImages?.player2.digit1.setVisible(true)
        this.scoreImages?.player2.digit1.setFrame(digitsScore2[0])
        this.scoreImages?.player2.digit2.setFrame(digitsScore2[1])
    }else{
        this.scoreImages?.player2.digit2.setFrame(digitsScore2[0])
    }
  }

  getBall(): PongBall {
    return this.ball
  }
}
