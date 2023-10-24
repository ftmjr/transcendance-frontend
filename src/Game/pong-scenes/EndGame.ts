// src/Game/pong-scenes/EndGame.ts
import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import type { GameMonitor } from '@/Game/network/GameMonitor'
import { PongSprite } from '@/Game/pong-scenes/Assets'
import type { ScoreBoard } from '@/Game/pong-scenes/PongGame'
import { GameSession } from '@/stores/GameStore'

export class EndGame extends Phaser.Scene {
  private currentUser: GameUser & { type: GameUserType } = null as unknown as GameUser & {
    type: GameUserType
  }
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private gameSession: GameSession = null as unknown as GameSession
  private scoreImages: { player1: ScoreBoard; player2: ScoreBoard } | undefined
  constructor() {
    super('EndGame')
  }

  init(data: PreloadSceneData) {
    this.currentUser = data.currentUser
    this.gameMonitor = data.gameMonitor
    this.gameSession = data.gameSession
  }

  preload() {}

  create() {
    const width = this.scale.width
    const height = this.scale.height
    const bgImage = this.add.image(0, 0, PongSprite.EndBackground)
    bgImage.setOrigin(0.5, 0.5)
    bgImage.setPosition(width / 2, height / 2)
    bgImage.setScale(Math.min(width / bgImage.width, height / bgImage.height))
    const scoreOffset = 100
    const scorePosY = height / 2 + scoreOffset // position just above the 'Game Over' text
    this.scoreImages = {
      player1: {
        digit1: this.add.image(width / 2 - 45, scorePosY, PongSprite.DigitAtlasSprites, '0'),
        digit2: this.add.image(width / 2 - 80, scorePosY, PongSprite.DigitAtlasSprites, '0')
      },
      player2: {
        digit1: this.add.image(width / 2 + 45, scorePosY, PongSprite.DigitAtlasSprites, '0'),
        digit2: this.add.image(width / 2 + 80, scorePosY, PongSprite.DigitAtlasSprites, '0')
      }
    }
    this.scoreImages.player1.digit1.setVisible(false)
    this.scoreImages.player2.digit1.setVisible(false)
    this.printScore()
    this.printUsersInfo()
    // text game over in the center of the screen
    const gameOverText = this.add.text(width / 2, height / 2, 'Bye', {
      fontFamily: 'Arial',
      fontSize: 36
    })
    gameOverText.setOrigin(0.5, 0.5)
  }

  update() {}

  printScore() {
    const scores = this.gameMonitor.scores
    const digits1 = scores[0].score.toString().split('')
    const digits2 = scores[1].score.toString().split('')
    if (digits1.length > 1) {
      this.scoreImages?.player1.digit1.setVisible(true)
      this.scoreImages?.player1.digit1.setFrame(digits1[1])
      this.scoreImages?.player1.digit2.setFrame(digits1[0])
    } else {
      this.scoreImages?.player1.digit2.setFrame(digits1[0])
    }
    if (digits2.length > 1) {
      this.scoreImages?.player2.digit1.setVisible(true)
      this.scoreImages?.player2.digit1.setFrame(digits2[0])
      this.scoreImages?.player2.digit2.setFrame(digits2[1])
    } else {
      this.scoreImages?.player2.digit2.setFrame(digits2[0])
    }
  }

  printUsersInfo() {
    const players = this.gameMonitor.players
    const isWinner = this.gameMonitor.scores[0].score >= this.gameMonitor.scores[1].score
    this.printUserNameAndScore(players[0], isWinner, 0)
    this.printUserNameAndScore(players[1], !isWinner, 1)
  }
  printUserNameAndScore(player: GameUser, isWinner: boolean, i: number = 0) {
    const positions = [
      { x: this.scale.width / 2 - 65, y: this.scale.height / 2 + 140 },
      { x: this.scale.width / 2 + 65, y: this.scale.height / 2 + 140 }
    ]
    if (player) {
      const text = this.add.text(positions[i].x, positions[i].y, `${player.username}`, {
        fontFamily: 'Arial',
        fontSize: 36,
        color: isWinner ? '#00ff00' : '#ff0000'
      })
      text.setOrigin(0.5, 0.5)
    } else {
      const text = this.add.text(positions[i].x, positions[i].y, `Ai Bot`, {
        fontFamily: 'Arial',
        fontSize: 36,
        color: isWinner ? '#00ff00' : '#ff0000'
      })
      text.setOrigin(0.5, 0.5)
    }
  }
}
