import type { GameSender, GAME_RESULT, GameMonitor } from '@/Game/network/GameMonitor'
import { GAME_STATE, PAD_DIRECTION } from '@/Game/network/GameMonitor'
import type { Player } from '@/Game/pong-scenes/PongGame'
import type PonGameScene from '@/Game/pong-scenes/PongGame'
export class LocalPlayer implements GameSender, Player {
  private localPlayerGroup: Phaser.Physics.Arcade.Group
  private localPaddle: Phaser.Physics.Arcade.Sprite
  private lastDirSent: PAD_DIRECTION = PAD_DIRECTION.none
  constructor(
    private gameMonitor: GameMonitor,
    private scene: PonGameScene,
    private position: { x: number; y: number },
    private paddleSpriteKey: string
  ) {
    this.gameMonitor.decorateSender(this, 'player')
    this.localPlayerGroup = scene.physics.add.group({
      collideWorldBounds: true
    })
    this.localPaddle = this.localPlayerGroup.create(position.x, position.y, paddleSpriteKey)
    this.localPaddle.setBounce(0, 1.2)
    this.localPaddle.setCollideWorldBounds(true)
    this.localPaddle.setImmovable(true)
    this.localPaddle.setPushable(false)
    this.localPaddle.setMass(1000)
    this.localPaddle.type = 'movable-paddle'
  }

  update() {
    const averageSpeed = this.scene.scale.height
    if (this.scene.cursorkeys?.up.isDown) {
      this.localPaddle.setVelocityY(-averageSpeed)
      this.sendPadMove(PAD_DIRECTION.up)
      this.lastDirSent = PAD_DIRECTION.up
    } else if (this.scene.cursorkeys?.down.isDown) {
      this.sendPadMove(PAD_DIRECTION.down)
      this.lastDirSent = PAD_DIRECTION.down
      this.localPaddle.setVelocityY(averageSpeed)
    } else {
      // decent deceleration
      const deceleration = 0.9
      const currentVelocity = this.localPaddle.body?.velocity.y ?? 0
      this.localPaddle.setVelocityY(currentVelocity * deceleration)
      if (this.lastDirSent !== PAD_DIRECTION.none)  this.sendPadMove(PAD_DIRECTION.none) // send none to server
    }
    if (this.scene.cursorkeys?.space.isDown) {
      this.serveBall()
    }
  }

  getSprite() {
    return this.localPaddle
  }

  scorePoint() {
    this.sendGameState(GAME_STATE.scored)
  }

  serveBall() {
    const ball = this.scene.getBall()
    if (!ball.getSprite().getData('inMiddle')) return
    let ballServeVelocity = { x: 200, y: Phaser.Math.Between(0, 40) }
    if (Math.random() > 0.49) {
      ballServeVelocity = { x: -200, y: Phaser.Math.Between(-40, 0) }
    }
    const ballPosition = { x: ball.getSprite().x, y: ball.getSprite().y }
    this.sendBallServe(ballPosition, ballServeVelocity)
    ball.serveBall(ballServeVelocity)
  }

  onBallHit() {
    // console.log('ball hit')
  }

  // methods from GameSender interface that will be decorated by GameMonitor
  sendPadMove(dir: PAD_DIRECTION): void {
    console.log('trying to send pad move')
  }
  sendBallServe(position: { x: number; y: number }, velocity: { x: number; y: number }): void {}
  sendGameState(state: GAME_STATE): void {}
  sendGameEnded(result: GAME_RESULT): void {}
}
