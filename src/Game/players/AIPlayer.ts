import type { Player } from '@/Game/pong-scenes/PongGame'
import type PonGameScene from '@/Game/pong-scenes/PongGame'
import type {
  GAME_RESULT,
  GameMonitor,
  GameSender,
  PAD_DIRECTION
} from '@/Game/network/GameMonitor'
import { GAME_STATE } from '@/Game/network/GameMonitor'
export class AIPlayer implements GameSender, Player {
  private aiPlayerGroup: Phaser.Physics.Arcade.Group
  private aiPaddle: Phaser.Physics.Arcade.Sprite

  constructor(
    private gameMonitor: GameMonitor,
    private scene: PonGameScene,
    private position: { x: number; y: number },
    private paddleSpriteKey: string
  ) {
    this.gameMonitor.decorateSender(this, 'ia')
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
    this.sendGameState(GAME_STATE.scored)
  }

  onBallHit() {
    // console.log('ball hit')
  }

  serveBall() {
    console.log('AI does not serve')
  }

  // methods from GameSender interface that will be decorated by GameMonitor
  sendPadMove(dir: PAD_DIRECTION): void {}
  sendBallServe(position: { x: number; y: number }, velocity: { x: number; y: number }): void {}
  sendGameState(state: GAME_STATE): void {}
  sendGameEnded(result: GAME_RESULT): void {}
}
