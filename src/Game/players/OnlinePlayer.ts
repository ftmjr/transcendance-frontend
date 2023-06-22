import type {
  GameReceiver,
  GAME_STATE,
  GAME_RESULT,
  GameMonitor,
  NetworkUser
} from '@/Game/network/GameMonitor'
import { PAD_DIRECTION } from '@/Game/network/GameMonitor'
import type { GameUser } from '@/Game/network/GameNetwork'
import type { Scene } from 'phaser'
import type { Player } from '@/Game/pong-scenes/PongGame'

export class OnlinePlayer implements GameReceiver, Player {
  private onlineUserGroup: Phaser.Physics.Arcade.Group
  private onlinePaddle: Phaser.Physics.Arcade.Sprite
  private padDirection: PAD_DIRECTION = PAD_DIRECTION.none
  public score: { player1: number; player2: number }

  constructor(
    private user: NetworkUser,
    private gameMonitor: GameMonitor,
    private scene: Scene,
    private position: { x: number; y: number },
    private paddleSpriteKey: string
  ) {
    this.score = { player1: 0, player2: 0 }
    this.gameMonitor.listen(this, user.username)
    this.onlineUserGroup = scene.physics.add.group({
      collideWorldBounds: true
    })
    this.onlinePaddle = this.onlineUserGroup.create(position.x, position.y, paddleSpriteKey)
    this.onlinePaddle.setBounce(0, 1.2)
    this.onlinePaddle.setCollideWorldBounds(true)
    this.onlinePaddle.setImmovable(true)
    this.onlinePaddle.setPushable(false)
    this.onlinePaddle.setMass(1000)
    this.onlinePaddle.type = 'live-paddle'
  }

  update() {
    switch (this.padDirection) {
      case PAD_DIRECTION.up:
        this.onlinePaddle.setVelocityY(-15)
        break
      case PAD_DIRECTION.down:
        this.onlinePaddle.setVelocityY(15)
        break
      case PAD_DIRECTION.none:
      default:
        this.onlinePaddle.setVelocityY(0)
        break
    }
  }

  getSprite() {
    return this.onlinePaddle
  }

  scorePoint() {
    this.score.player2 += 1
  }

  serveBall() {
    // todo: implement
  }

  onBallHit() {
    console.log('ball hit on online paddle')
  }

  // methods from GameReceiver interface that will be provided by GameMonitor
  onPadMoved(dir: PAD_DIRECTION): void {
    this.padDirection = dir
  }
  onBallServed(position: { x: number; y: number }, velocity: { x: number; y: number }): void {}
  onGameStateChanged(state: GAME_STATE): void {}
  onScoreChanged(score: { player1: number; player2: number }): void {}
  onGameEnded(result: GAME_RESULT): void {}
}
