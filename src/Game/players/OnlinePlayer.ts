// src/Game/player/OnlinePlayer.ts
import type { GameReceiver, GameMonitor } from '@/Game/network/GameMonitor'
import { PAD_DIRECTION } from '@/Game/network/GameMonitor'
import type { Player } from '@/Game/pong-scenes/PongGame'
import type PongGameScene from '@/Game/pong-scenes/PongGame'
import { GameUser } from '@/Game/network/GameNetwork'

export class OnlinePlayer implements GameReceiver, Player {
  private onlineUserGroup: Phaser.Physics.Arcade.Group
  private onlinePaddle: Phaser.Physics.Arcade.Sprite
  private padDirection: PAD_DIRECTION = PAD_DIRECTION.none

  constructor(
    private user: GameUser,
    private gameMonitor: GameMonitor,
    private scene: PongGameScene,
    private position: { x: number; y: number },
    private paddleSpriteKey: string,
    public readonly userId: number
  ) {
    this.gameMonitor.listenToAPlayer(this)
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
    const deceleration = 0.9
    const averageSpeed = this.scene.scale.height
    const currentVelocity = this.onlinePaddle.body?.velocity.y ?? 0
    switch (this.padDirection) {
      case PAD_DIRECTION.up:
        this.onlinePaddle.setVelocityY(-averageSpeed)
        break
      case PAD_DIRECTION.down:
        this.onlinePaddle.setVelocityY(averageSpeed)
        break
      case PAD_DIRECTION.none:
      default:
        this.onlinePaddle.setVelocityY(currentVelocity * deceleration)
        break
    }
  }

  getSprite() {
    return this.onlinePaddle
  }

  scorePoint() {
    //console.log('score point info from ball')
  }

  serveBall() {
    // todo: implement
  }

  onBallHit() {
    // console.log('ball hit on online paddle')
  }

  // methods from GameReceiver interface that will be provided by GameMonitor
  onPadMoved(dir: PAD_DIRECTION): void {
    this.padDirection = dir
  }
  onBallServed(position: { x: number; y: number }, velocity: { x: number; y: number }): void {
    const ball = this.scene.getBall()
    ball.getSprite().setData('inMiddle', true)
    ball.serveBall(position, velocity)
  }
}
