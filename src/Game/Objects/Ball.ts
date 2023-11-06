import { Physics } from 'phaser'
import PongScene from '@/Game/scenes/PongScene'
import { Theme } from '@/Game/scenes/Boot'

const BALL_RADIUS = 20
const BALL_DIAMETER = BALL_RADIUS * 2

export class Ball {
  private ballGroup: Physics.Arcade.Group
  private readonly ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(
    private scene: PongScene,
    private theme: Theme,
    private startPosition: { x: number; y: number }
  ) {
    this.ballGroup = scene.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1
    })
    let key = 'ball'
    switch (theme) {
      case Theme.Arcade:
        key = 'arcade-ball'
        break
      case Theme.Soccer:
        key = 'soccer_ball'
        break
    }
    this.ball = this.ballGroup.create(
      startPosition.x - BALL_RADIUS,
      startPosition.y - BALL_RADIUS,
      key
    )
    this.ball.setOrigin(0, 0)
    this.ball.setCircle(BALL_RADIUS)
    this.ball.setDisplaySize(BALL_DIAMETER, BALL_DIAMETER)
    this.ball.setMass(1)
    this.ball.setMaxVelocity(375, 375)
    // offset for the ball to be in the middle of the physic body
    if (this.theme !== Theme.Classic) {
      this.ball.setOffset(4, 4)
    } else {
      this.ball.setOffset(12, 12) // sprite size is 64
    }
  }

  newPosition(position: { x: number; y: number }, speed: { x: number; y: number }) {
    this.ball.setVelocity(speed.x, speed.y)
    this.ball.setPosition(position.x, position.y)
  }

  getSprite() {
    return this.ball
  }

  updateBallAnimation() {
    if (this.ball.body.velocity.x > 0) {
      // Ball is moving to the right
      if (!this.ball.anims.isPlaying || this.ball.anims.currentAnim?.key !== 'roll_to_right_ball') {
        this.ball.play('roll_to_right_ball')
      }
    } else if (this.ball.body.velocity.x < 0) {
      // Ball is moving to the left
      if (!this.ball.anims.isPlaying || this.ball.anims.currentAnim?.key !== 'roll_to_left_ball') {
        this.ball.play('roll_to_left_ball')
      }
    } else {
      // Ball's X speed is zero, so stop the animation
      this.ball.anims.stop()
    }
  }
  update() {
    if (this.theme !== Theme.Classic) {
      this.updateBallAnimation()
    }
  }
}
