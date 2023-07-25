import { GameNetwork, GameUserType } from '@/Game/network/GameNetwork'
import type { GameMonitor, NetworkUser } from '@/Game/network/GameMonitor'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { getPongSprites, PongSprite } from '@/Game/pong-scenes/Assets'
import type { GameObjects } from 'phaser'

export interface PreloadSceneData {
  userType: GameUserType
  gameMonitor: GameMonitor
  gameNetwork: GameNetwork
  theme: PongTheme
}

export default class PreloadPong extends Phaser.Scene {
  private userType: GameUserType = GameUserType.Player
  private gameNetwork: GameNetwork = null as unknown as GameNetwork
  private iAGameNetwork: GameNetwork = null as unknown as GameNetwork
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private networkIsOperational: boolean = false
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
  private loadedUserAvatars: Map<string, boolean> = new Map()

  constructor() {
    super('preloader')
  }

  preload() {
    // Add loading progress text
    const width = this.scale.width
    const height = this.scale.height
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        fontSize: '20px',
        color: '#d6d3f0'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    // Create progress bar
    this.progressBox = this.add.graphics()
    this.progressBar = this.add.graphics()
    this.progressBox.fillStyle(0x222222, 0.8)
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

    if (this.userType === GameUserType.LocalPlayer) {
      this.iAGameNetwork = new GameNetwork({
        userId: 0,
        username: 'iaPlayer',
        avatar: 'https://i.imgur.com/8bXwXuU.png'
      })
    }
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
    this.bottomText = this.add.text(30, height - 50, 'Loading...', {
      fontSize: '24px',
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
    // this.topText = this.add.text(30, 30, '42 - Pong game', {
    //   fontSize: '24px'
    // })
  }

  update() {
    // Update the player info display
    this.updatePlayersInfo()

    // Check network status and if ready show start button
    this.checkNetworkAndStartGame()
  }

  updatePlayersInfo() {
    const players = Array.from(this.gameMonitor.getPlayers().values()) || []
    const width = this.scale.width
    const height = this.scale.height
    const playersPositions = [
      { x: width / 2 - 100, y: height / 2 },
      { x: width / 2 + 100, y: height / 2 }
    ]
    const frames = ['character_malePerson_jump.png', 'character_malePerson_switch1.png']

    // Clean up old player info
    this.playerTexts.forEach((text) => text.destroy())
    this.playerImages.forEach((image) => image.destroy())
    this.playerTexts = []
    this.playerImages = []

    // Display new player info
    players.forEach((player, index) => {
      const atlasName = this.getOrLoadUserAvatar(player)
      const playerImage = this.add.image(0, 0, atlasName, frames[index]).setScale(0.5) // Adjust scale as necessary
      const playerText = this.add.text(0, 40, player.username).setOrigin(0.5, 0)
      const container = this.add.container(playersPositions[index].x, playersPositions[index].y, [
        playerImage,
        playerText
      ])
      this.playerImages.push(playerImage)
      this.playerTexts.push(playerText)
    })
    // Display IA player info
    if (this.userType === GameUserType.LocalPlayer) {
      const playerImage = this.add
        .image(0, 0, PongSprite.RobotAtlasSprites, 'character_robot_hold.png')
        .setScale(0.5) // Adjust scale as necessary
      const playerText = this.add.text(0, 40, 'IA', { color: '#d6d3f0' }).setOrigin(0.5, 0)
      const container = this.add.container(playersPositions[1].x, playersPositions[1].y, [
        playerImage,
        playerText
      ])
      this.playerImages.push(playerImage)
      this.playerTexts.push(playerText)
    }
  }

  getOrLoadUserAvatar(user: NetworkUser): string {
    // if (user.avatar){
    //     if (!this.loadedUserAvatars.has(user.username)) {
    //         this.load.image(user.username, user.avatar)
    //         this.loadedUserAvatars.set(user.username, true)
    //     }
    //     return user.avatar
    // }
    return PongSprite.MaleAtlasSprites
  }
  checkNetworkAndStartGame() {
    this.networkIsOperational = this.gameMonitor.isOperational() ?? false

    if (this.networkIsOperational) {
      const players = Array.from(this.gameMonitor.getPlayers().values()) || []
      const numPlayers = players.length

      if (
        (this.userType === GameUserType.LocalPlayer && numPlayers === 1) ||
        (this.userType !== GameUserType.LocalPlayer && numPlayers === 2)
      ) {
        // All players are ready, display start button
        if (!this.startButton) {
          this.createStartButton()
        }
        this.bottomText?.setText('')
      } else {
        // Not all players are ready, remove start button if it exists
        if (this.startButton) {
          this.startButton.destroy()
          this.startButton = null
        }
      }
    } else {
      this.bottomText?.setText('Waiting for network...not operational')
    }
  }

  createStartButton() {
    const position = {
      x: this.scale.width / 2,
      y: this.scale.width / 2 + 80
    }
    this.startButton = this.add.image(0, 0, PongSprite.GameButton)
    this.startButtonText = this.add
      .text(0, 0, 'START', {
        color: '#ea8411'
      })
      .setOrigin(0.5, 0.5)
    const container = this.add.container(this.scale.width / 2, this.scale.width / 2 + 80, [
      this.startButton,
      this.startButtonText
    ])
    this.startButton.setInteractive()
    this.startButton.on('pointerover', () => {
      this.startButton?.setTint(0x6d396d)
    })
    this.startButton.on('pointerout', () => {
      this.startButton?.clearTint()
    })
    this.startButton.on('pointerup', () => {
      this.startGame()
    })
  }

  startGame() {
    this.scene.start('PongGame', {
      theme: this.theme,
      userType: this.userType,
      gameMonitor: this.gameMonitor,
      gameNetwork: this.gameNetwork,
      iAGameNetwork: this.iAGameNetwork
    })
  }
}
