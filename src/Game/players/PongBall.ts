import type { Player } from '@/Game/pong-scenes/PongGame'
import type PongGameScene from '@/Game/pong-scenes/PongGame'
import { PongSprite } from '@/Game/pong-scenes/Assets'

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
    if (scene.theme === 'Arcade') {
      const particles = scene.add.particles(0, 0, PongSprite.BallParticle, {
        speed: { min: 10, max: 80 },
        scale: { start: 0.4, end: 0.05 },
        lifespan: 400,
        blendMode: 'ADD'
      })
      particles.startFollow(this.ball)
    }
    this.ball.type = 'ball'
    const player1Paddle = this.player1.getSprite()
    scene.physics.add.collider(player1Paddle, this.ball, () => {
      scene.sound.play(PongSprite.PaddleSong, {
        ...scene.soundConfig,
        volume: 0.3
      })
      this.onPaddleBallCollision(this.ball, this.player1)
    })
    const player2Paddle = this.player2.getSprite()
    scene.physics.add.collider(player2Paddle, this.ball, () => {
      scene.sound.play(PongSprite.PaddleSong, scene.soundConfig)
      this.onPaddleBallCollision(this.ball, this.player2)
    })
    scene.physics.add.collider(this.ball, leftLine, () => {
      this.ball.setVelocity(0)
      this.player2.scorePoint()
      leftLine.setTint(0xff0000)
      scene.time.delayedCall(500, () => {
        leftLine.setTint(0xffffff)
      })
    })
    scene.physics.add.collider(this.ball, rightLine, () => {
      this.ball.setVelocity(0)
      this.player1.scorePoint()
      rightLine.setTint(0xff0000)
      scene.time.delayedCall(500, () => {
        rightLine.setTint(0xffffff)
      })
    })
  }

  serveBall(position: { x: number; y: number }, velocity: { x: number; y: number }) {
    if (!this.ball.getData('inMiddle')) return
    this.ball.setActive(true)
    this.ball.setData('inMiddle', false)
    this.ball.setPosition(this.scene.scale.width / 2, this.scene.scale.height / 2)
    this.ball.setVelocity(velocity.x, velocity.y)
  }

  resetBall() {
    this.ball.setPosition(this.scene.scale.width / 2, this.scene.scale.height / 2)
    this.ball.setActive(false)
    this.ball.setData('inMiddle', true)
    this.ball.setVelocity(0, 0)
  }

  onPaddleBallCollision(ball: Phaser.Physics.Arcade.Sprite, player: Player) {
    // add some velocity in Y direction added to the normal collision velocity depending on the position of the ball on the paddle
    const ballY = ball.y
    const paddleY = player.getSprite().y
    const diff = ballY - paddleY
    const currentVelocity = ball.body?.velocity?.y || 0
    ball.setVelocityY(currentVelocity + diff * 5)
    player.onBallHit()
  }

  update() {}

  getSprite() {
    return this.ball
  }
}
