import type { Scene } from 'phaser'
import type { Player } from '@/Game/pong-scenes/PongGame'
import type PongGameScene from '@/Game/pong-scenes/PongGame'

export class PongBall {
  private ballGroup: Phaser.Physics.Arcade.Group
  private ball: Phaser.Physics.Arcade.Sprite

  constructor(
    private scene: PongGameScene,
    private position: { x: number; y: number },
    private spriteKey: string,
    private player1: Player,
    private player2: Player,
    private leftLine: Phaser.Physics.Arcade.Sprite,
    private rightLine: Phaser.Physics.Arcade.Sprite
  ) {
    this.ballGroup = scene.physics.add.group({
      bounceX: 1,
      bounceY: 1,
      collideWorldBounds: true
    })
    this.ball = this.ballGroup.create(position.x, position.y, spriteKey)
    this.ball.setCircle(30, 2, 2)
    this.ball.setMass(1)
    this.ball.setMaxVelocity(400, 400)
    this.ball.setData('inMiddle', true)

    const player1Paddle = this.player1.getSprite()
    scene.physics.add.collider(player1Paddle, this.ball, () => {
      // player1Paddle.setAlpha(0.5)
      this.player1.onBallHit()
    })
    const player2Paddle = this.player2.getSprite()
    scene.physics.add.collider(player2Paddle, this.ball, () => {
      // player2Paddle.setAlpha(0.5)
      this.player2.onBallHit()
    })

    scene.physics.add.collider(this.ball, leftLine, () => {
      this.ball.setVelocity(0)
      this.player2.scorePoint() // method to increment score for right player
      this.resetBall()
      leftLine.setTint(0x0000ff) // change color to blue upon collision
      scene.time.delayedCall(500, () => {
        leftLine.setTint(0xffffff)
      }) // revert to white after 500ms
    })
    scene.physics.add.collider(this.ball, rightLine, () => {
      this.ball.setVelocity(0)
      this.player1.scorePoint() // method to increment score for right player
      this.resetBall()
      rightLine.setTint(0x0000ff) // change color to blue upon collision
      scene.time.delayedCall(500, () => {
        rightLine.setTint(0xffffff)
      }) // revert to white after 500ms
    })
  }

  serveBall(velocity: { x: number; y: number }) {
    if (!this.ball.getData('inMiddle')) return
    this.ball.setActive(true)
    this.ball.setData('inMiddle', false)
    this.ball.setVelocity(velocity.x, velocity.y)
  }

  resetBall() {
    this.scene.cam?.shake(100, 0.01)
    this.ball.setPosition(this.scene.scale.width / 2, this.scene.scale.height / 2)
    this.ball.setActive(false)
    this.ball.setData('inMiddle', true)
    this.ball.setVelocity(0, 0)
  }

  update() {}

  getSprite() {
    return this.ball
  }
}
