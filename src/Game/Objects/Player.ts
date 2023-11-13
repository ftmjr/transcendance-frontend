import { GameUser } from '@/Game/network/GameNetwork'
import PongScene from '@/Game/scenes/PongScene'
import { PAD_DIRECTION, PaddleEngineData } from '@/Game/network/Monitor'
import { Theme } from '@/Game/scenes/Boot'

export enum PlayerType {
  Local,
  Online,
  AI
}

const PADDLE_WIDTH = 32 // Width of the paddle
export const PADDLE_HEIGHT = 128 // Height of the paddle
export class Player {
  public averageSpeed = 750
  private usernameText: Phaser.GameObjects.Text
  public paddle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(
    public scene: PongScene,
    private type: PlayerType,
    startPosition: { x: number; y: number },
    private isHost: boolean,
    private theme: Theme,
    public readonly info: GameUser
  ) {
    // create a rectangle for the paddle and add it to the group
    let key = 'paddle'
    switch (this.theme) {
      case Theme.Arcade:
        key = isHost ? 'pad_left' : 'pad_right'
        break
      case Theme.Soccer:
        key = isHost ? 'pad_left' : 'pad_right'
        break
    }
    this.paddle = scene.physics.add.sprite(startPosition.x, startPosition.y, key)
    this.paddle.setOrigin(0, 0)
    this.paddle.setDisplaySize(PADDLE_WIDTH, PADDLE_HEIGHT)
    this.paddle.setMass(1000)
    this.paddle.setCollideWorldBounds(true)
    this.paddle.setBounce(0, 1.2)
    this.paddle.setImmovable(true)
    this.paddle.setPushable(false)
    const space = isHost ? 50 : 1284
    this.usernameText = this.scene.add.text(space, 375, info.username, {
      fontFamily: 'Courier New',
      fontSize: 12,
      color: '#ffffff'
    })
    // rotate to be on top of the paddle
    this.usernameText.rotation = -Math.PI / 2
    this.usernameText.setOrigin(0.5, 1)
    this.usernameText.setDepth(1)
  }

  // Updated method to move paddle with tween and deceleration
  // movePaddleWithTween(data: PaddleEngineData, latency: number) {
  //   const duration = this.calculateTweenDuration(
  //     {
  //       x: data.position.x,
  //       y: data.position.y
  //     },
  //     latency
  //   )
  //   this.scene.tweens.add({
  //     targets: this.paddle,
  //     y: data.position.y,
  //     x: data.position.x,
  //     ease: 'Cubic.Out', // Easing function for deceleration
  //     duration: duration,
  //     onUpdate: () => {
  //       // Update the username text position with the paddle
  //       this.usernameText.setY(this.paddle.y)
  //     }
  //   })
  // }
  //
  // // Calculate the duration for the tween based on latency
  // private calculateTweenDuration(newPosition: { x: number; y: number }, latency: number): number {
  //   // Calculate the distance to the new position
  //   const distance = Phaser.Math.Distance.Between(
  //     this.paddle.x,
  //     this.paddle.y,
  //     newPosition.x,
  //     newPosition.y
  //   )
  //   // Adjust the speed based on latency
  //   const adjustedSpeed = distance / (latency / 1000)
  //   return (distance / adjustedSpeed) * 1000
  // }

  // called when network send the new position of the paddle
  newPaddlePosition(data: PaddleEngineData) {
    const { position, speed } = data
    this.paddle.setPosition(position.x, position.y)
    this.paddle.setVelocity(speed.x, speed.y)
  }

  applyDeceleration() {
    if (this.type === PlayerType.AI) {
      const deceleration = 0.2
      const currentVelocity = this.paddle.body?.velocity.y ?? 0
      if (currentVelocity === 0) return
      this.paddle.setVelocityY(currentVelocity * deceleration)
    } else {
      const deceleration = 0.9
      const currentVelocity = this.paddle.body?.velocity.y ?? 0
      if (currentVelocity === 0) return
      this.paddle.setVelocityY(currentVelocity * deceleration)
    }
  }

  update() {
    if (this.type === PlayerType.Local) {
      this.updateLocalPlayer()
    }
    this.applyDeceleration()
    this.usernameText.setY(this.paddle.y)
  }

  updateLocalPlayer() {
    if (this.scene.cursorkeys?.up.isDown) {
      this.sendPaddlePositionToServer(PAD_DIRECTION.up)
    } else if (this.scene.cursorkeys?.down.isDown) {
      this.sendPaddlePositionToServer(PAD_DIRECTION.down)
    }
  }

  sendPaddlePositionToServer(dir: PAD_DIRECTION) {
    if (this.info.userId !== this.scene.currentUser.userId) return
    this.scene.monitor.sendPadMove({
      userId: this.info.userId,
      direction: dir,
      position: { x: this.paddle.x, y: this.paddle.y }
    })
  }
}
