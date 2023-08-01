import { GameUserType } from '@/Game/network/GameNetwork'
import type { GameMonitor, NetworkUser } from '@/Game/network/GameMonitor'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { getPongSprites, PongSprite } from '@/Game/pong-scenes/Assets'
import type { GameObjects } from 'phaser'
import { GameMonitorState } from '@/Game/network/GameMonitor'

export interface PreloadSceneData {
  userType: GameUserType
  gameMonitor: GameMonitor
  theme: PongTheme
}

export default class PreloadPong extends Phaser.Scene {
  private userType: GameUserType = GameUserType.Player
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private bottomText: Phaser.GameObjects.Text | undefined = undefined
  private topText: Phaser.GameObjects.Text | undefined = undefined
  private theme: PongTheme = 'Soccer'
  private spritesKeys: Record<PongSprite, string> = getPongSprites(this.theme)
  private progressBar: GameObjects.Graphics | undefined = undefined
  private progressBox: GameObjects.Graphics | undefined = undefined
  private playerTexts: Phaser.GameObjects.Text[] = []
  private playerImages: Phaser.GameObjects.Image[] = []
  private startButton: Phaser.GameObjects.Image | null = null
  private startButtonText: Phaser.GameObjects.Text | null = null

  constructor() {
    super('preloader')
  }

  preload() {
    // Add loading progress text
    const width = this.scale.width
    const height = this.scale.height
    // add a pink background
    this.cameras.main.setBackgroundColor('#190933')
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        fontSize: '20px',
        color: '#5DD9C1'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    // Create progress bar
    this.progressBox = this.add.graphics()
    this.progressBar = this.add.graphics()
    this.progressBox.fillStyle(0x665687, 0.8)
    this.progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50)

    // Update progress bar
    this.load.on('progress', (value: number) => {
      this.progressBar?.clear()
      this.progressBar?.fillStyle(0xffffff, 1)
      this.progressBar?.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30)
    })

    this.load.on('complete', () => {
      this.progressBar?.destroy()
      this.progressBox?.destroy()
      loadingText.destroy()
    })

    // preload all the asset;
    this.load.image(PongSprite.Background, this.spritesKeys.Background)
    this.load.image(PongSprite.EndBackground, this.spritesKeys.EndBackground)
    this.load.image(PongSprite.GameButton, this.spritesKeys.GameButton)
    this.load.image(PongSprite.Ball, this.spritesKeys.Ball)
    this.load.image(PongSprite.BallParticle, this.spritesKeys.BallParticle)
    this.load.image(PongSprite.Paddle, this.spritesKeys.Paddle)
    this.load.image(PongSprite.AwayPaddle, this.spritesKeys.AwayPaddle)
    this.load.image(PongSprite.GameField, this.spritesKeys.GameField)
    this.load.image(PongSprite.FieldCenter, this.spritesKeys.FieldCenter)
    this.load.image(PongSprite.GoalLine, this.spritesKeys.GoalLine)
    // load robot images
    this.load.atlas(
      PongSprite.RobotAtlasSprites,
      this.spritesKeys.RobotAtlas,
      this.spritesKeys.RobotAtlasJson
    )
    // load male images
    this.load.atlas(
      PongSprite.MaleAtlasSprites,
      this.spritesKeys.MaleAtlas,
      this.spritesKeys.MaleAtlasJson
    )
    // load score images
    this.load.atlas(
      PongSprite.DigitAtlasSprites,
      this.spritesKeys.DigitAtlas,
      this.spritesKeys.DigitAtlasJson
    )
    // load sounds
    this.load.audio(PongSprite.WallSong, this.spritesKeys.WallSong)
    this.load.audio(PongSprite.PaddleSong, this.spritesKeys.PaddleSong)
    this.load.audio(PongSprite.ScoreSong, this.spritesKeys.ScoreSong)
  }

  init(data: PreloadSceneData) {
    this.userType = data.userType
    this.gameMonitor = data.gameMonitor
    this.theme = data.theme
    this.spritesKeys = getPongSprites(this.theme)
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height
    const bgImage = this.add.image(0, 0, PongSprite.Background)
    bgImage.setOrigin(0.5, 0.5)
    bgImage.setPosition(width / 2, height / 2)
    bgImage.setScale(Math.min(width / bgImage.width, height / bgImage.height))
    bgImage.setAlpha(0.3, 0.1, 0.1, 0.3)
    bgImage.setDepth(0)
    this.bottomText = this.add.text(30, height - 30, 'Loading...', {
      fontSize: '18px',
      color: '#d6d3f0'
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
    this.topText = this.add.text(30, 10, '42 - Pong game', {
      fontSize: '18px',
      color: '#5DD9C1'
    })
  }

  update() {
    // Update the player info display
    this.printPlayersInfo()
    // Check network status and if ready show start button
    this.checkNetworkAndState()
  }

  checkNetworkAndState() {
    if (!this.gameMonitor.isOperational()) {
      this.bottomText?.setText('Network is down.')
      return
    }
    switch (this.gameMonitor.state) {
      case GameMonitorState.Waiting:
        // Waiting for players. Can display a message indicating that we're waiting for players.
        break
      case GameMonitorState.Ready:
        // Enough players have joined.
        this.bottomText?.setText('Ready to start.')
        this.createStartButton()
        break
      case GameMonitorState.InitGame:
        // The user has clicked 'start' and the game is ready to begin.
        this.startButton?.destroy()
        this.startButtonText?.setText('Server - sync')
        this.time.delayedCall(300, () => {
          this.startGame()
        })
        break
    }
  }
  printPlayersInfo() {
    const width = this.scale.width
    const height = this.scale.height
    const players = Array.from(this.gameMonitor.getPlayers().values()) || []
    const playersPositions = [
      { x: width / 2 - 150, y: height / 2 },
      { x: width / 2 + 150, y: height / 2 }
    ]
    const frames = ['character_malePerson_jump.png', 'character_malePerson_switch1.png']
    // remove old player info
    this.playerTexts.forEach((text) => text.destroy())
    this.playerImages.forEach((image) => image.destroy())
    this.playerTexts = []
    this.playerImages = []
    players.forEach((player, index) => {
      const atlasName = this.getOrLoadUserAvatar(player)
      const playerImage = this.add.image(0, 0, atlasName, frames[index]).setScale(0.8) // Adjust scale as necessary
      const playerText = this.add.text(0, 80, player.username).setOrigin(0.5, 0.5)
      const container = this.add.container(playersPositions[index].x, playersPositions[index].y, [
        playerImage,
        playerText
      ])
      this.playerImages.push(playerImage)
      this.playerTexts.push(playerText)
    })
    // Display IA player info
    if (this.userType === GameUserType.LocalPlayer) {
      this.printIaPlayerInfo()
    }
  }
  getOrLoadUserAvatar(user: NetworkUser): string {
    // future logic to load avatar depending on user
    return PongSprite.MaleAtlasSprites
  }
  printIaPlayerInfo() {
    const width = this.scale.width
    const height = this.scale.height
    const playerImage = this.add
      .image(0, 0, PongSprite.RobotAtlasSprites, 'character_robot_hold.png')
      .setScale(0.8) // Adjust scale as necessary
    const playerText = this.add.text(0, 80, 'IA', { color: '#ffffff' }).setOrigin(0.5, 0.5)
    const container = this.add.container(width / 2 + 150, height / 2, [playerImage, playerText])
    this.playerImages.push(playerImage)
    this.playerTexts.push(playerText)
  }
  createStartButton() {
    if (this.startButton) return
    this.startButton = this.add.image(0, 0, PongSprite.GameButton)
    this.startButtonText = this.add
        .text(0, 0, 'START', {
          color: '#190933'
        })
        .setOrigin(0.5, 0.5)
    const container = this.add.container(this.scale.width / 2, this.scale.height / 2 + 160, [
      this.startButton,
      this.startButtonText
    ])
    this.startButton.setInteractive()
    this.startButton.on('pointerover', () => {
      this.startButton?.setTint(0x5dd9c1)
      this.startButtonText?.setColor('#ffffff')
    })
    this.startButton.on('pointerout', () => {
      this.startButton?.clearTint()
      this.startButtonText?.setColor('#190933')
    })
    this.startButton.on('pointerup', () => {
      this.gameMonitor.startGame()
      this.startButton?.setTint(0x808080)
      this.startButton?.disableInteractive()
    })
  }
  startGame() {
    this.scene.start('PongGame', {
      theme: this.theme,
      userType: this.userType,
      gameMonitor: this.gameMonitor
    })
  }
}
