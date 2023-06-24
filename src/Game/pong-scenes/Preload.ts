import { GameNetwork, GameUserType } from '@/Game/network/GameNetwork'
import type { GameMonitor } from '@/Game/network/GameMonitor'
import { getPongSprites, PongSprite } from '@/Game/pong-scenes/Assets'
import type { PongTheme } from '@/Game/pong-scenes/Assets'

export interface PreloadSceneData {
  userType: GameUserType
  gameMonitor: GameMonitor
  gameNetwork: GameNetwork
}

export default class PreloadPong extends Phaser.Scene {
  private userType: GameUserType = GameUserType.Player
  private gameNetwork: GameNetwork = null as unknown as GameNetwork
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private networkIsOperational: boolean = false
  private bottomText: Phaser.GameObjects.Text | undefined = undefined
  private topText: Phaser.GameObjects.Text | undefined = undefined
  private theme: PongTheme = 'Soccer'
  private spritesKeys: Record<PongSprite, string> = getPongSprites(this.theme)
  constructor() {
    super('preloader')
  }

  init(data: PreloadSceneData) {
    this.userType = data.userType
    this.gameMonitor = data.gameMonitor
  }

  preload() {
    // preload all the asset;
    this.load.image(PongSprite.Background, this.spritesKeys.Background)
    this.load.image(PongSprite.Ball, this.spritesKeys.Ball)
    this.load.image(PongSprite.BallParticle, this.spritesKeys.BallParticle)
    this.load.image(PongSprite.Paddle, this.spritesKeys.Paddle)
    this.load.image(PongSprite.AwayPaddle, this.spritesKeys.AwayPaddle)
    this.load.image(PongSprite.GameField, this.spritesKeys.GameField)
    this.load.image(PongSprite.FieldCenter, this.spritesKeys.FieldCenter)
    this.load.image(PongSprite.GoalLine, this.spritesKeys.GoalLine)
    // load score images
    this.load.atlas(PongSprite.DigitAtlasSprites, this.spritesKeys.DigitAtlas, this.spritesKeys.DigitAtlasJson);
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height

    const bgImage = this.add.image(0, 0, PongSprite.Background)
    bgImage.setOrigin(0.5, 0.5)
    bgImage.setPosition(width / 2, height / 2)
    bgImage.setScale(Math.min(width / bgImage.width, height / bgImage.height))

    this.bottomText = this.add.text(30, height - 50, 'Loading...', {
      fontSize: '24px'
    })

    switch (this.userType) {
      case GameUserType.LocalPlayer:
        this.bottomText.setText('Waiting for the AI.')
        break
      case GameUserType.Player:
        this.bottomText.setText('Waiting for an opponent...')
        break
      case GameUserType.Viewer:
        this.bottomText.setText('Waiting for game to start...')
    }
    this.topText = this.add.text(30, 30, '42 - Pong game', {
      fontSize: '24px'
    })
  }

  update() {
    this.networkIsOperational = this.gameMonitor.isOperational() ?? false
    const sceneData: PreloadSceneData = {
      userType: this.userType,
      gameMonitor: this.gameMonitor,
      gameNetwork: this.gameNetwork
    }
    if (this.networkIsOperational === false) {
      // todo: change
      const players = Array.from(this.gameMonitor.getPlayers().values()) || []
      if (this.userType === GameUserType.LocalPlayer) {
        if (players.length === 0) {
          // todo: to change to 1
          this.scene.start('PongGame', sceneData)
        } else {
          this.bottomText?.setText('loading, preparing the AI...')
        }
      } else if (this.userType === GameUserType.Player) {
        if (players.length === 2) {
          this.scene.start('PongGame', sceneData)
        } else {
          this.bottomText?.setText('Waiting for an opponent...')
        }
      } else if (this.userType === GameUserType.Viewer) {
        if (players.length === 2) {
          this.scene.start('PongGame', sceneData)
        } else if (players.length < 2) {
          this.bottomText?.setText('Waiting for game to start...')
        }
      }
    } else {
      this.bottomText?.setText('Waiting for network...not operational')
    }
  }
}
