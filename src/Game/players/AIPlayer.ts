import type { Player } from '@/Game/pong-scenes/PongGame'
import type PonGameScene from '@/Game/pong-scenes/PongGame'

export class AIPlayer implements Player {
  private aiPlayerGroup: Phaser.Physics.Arcade.Group
  private aiPaddle: Phaser.Physics.Arcade.Sprite

  constructor(
    private scene: PonGameScene,
    private position: { x: number; y: number },
    private paddleSpriteKey: string
  ) {
    this.aiPlayerGroup = scene.physics.add.group({
      collideWorldBounds: true
    })
    this.aiPaddle = this.aiPlayerGroup.create(position.x, position.y, paddleSpriteKey)
    this.aiPaddle.setBounce(0, 1.2)
    this.aiPaddle.setCollideWorldBounds(true)
    this.aiPaddle.setImmovable(true)
    this.aiPaddle.setPushable(false)
    this.aiPaddle.setMass(1000)
    this.aiPaddle.type = 'ia-paddle'
  }

  // velocity, vitesse de reaction de l'IA
  update(ball?: Phaser.Physics.Arcade.Sprite, min_x?: number, max_x?: number, velocity?: number) {
    if (!ball) return
    if (min_x === undefined || max_x === undefined || velocity === undefined) return
    const speedArray = [velocity * 0.8, velocity, velocity * 1.5]
    const paddleLength = this.aiPaddle.height

    if (ball.getData('inMiddle')) {
      this.aiPaddle.y = this.scene.scale.height / 2
      this.aiPaddle.setVelocityY(0)
      return
    }
    if (ball.x >= min_x && ball.x <= max_x) {
      const distance = ball.y - this.aiPaddle.y
      if (distance > paddleLength / 4) {
        this.aiPaddle.setVelocityY(speedArray[Phaser.Math.Between(0, 2)])
        return
      } else if (distance < -(paddleLength / 4)) {
        this.aiPaddle.setVelocityY(-speedArray[Phaser.Math.Between(0, 2)])
        return
      }
    }
    const deceleration = 0.2
    const currentVelocity = this.aiPaddle.body?.velocity.y ?? 0
    this.aiPaddle.setVelocityY(currentVelocity * deceleration)
  }

  getSprite() {
    return this.aiPaddle
  }

  scorePoint() {
    this.scene.score.player2 += 1
    this.scene.updateScore();
  }

  onBallHit() {
    console.log('ball hit')
  }

  serveBall() {
    console.log('AI does not serve')
  }
}
