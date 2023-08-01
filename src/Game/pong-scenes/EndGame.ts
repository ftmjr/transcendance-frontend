import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { GameUserType } from '@/Game/network/GameNetwork'
import type {GameMonitor, NetworkUser} from '@/Game/network/GameMonitor'
import { PongSprite } from '@/Game/pong-scenes/Assets'
import type { ScoreBoard } from '@/Game/pong-scenes/PongGame'

export class EndGame extends Phaser.Scene {
  private userType: GameUserType = GameUserType.Player
  private gameMonitor: GameMonitor = null as unknown as GameMonitor
  private scoreImages: { player1: ScoreBoard; player2: ScoreBoard } | undefined
  constructor() {
    super('EndGame')
  }

  init(data: PreloadSceneData) {
    this.userType = data.userType
    this.gameMonitor = data.gameMonitor
  }

  preload() {
  }

  create() {
    const width = this.scale.width
    const height = this.scale.height
    const bgImage = this.add.image(0, 0, PongSprite.EndBackground)
    bgImage.setOrigin(0.5, 0.5)
    bgImage.setPosition(width / 2, height / 2)
    bgImage.setScale(Math.min(width / bgImage.width, height / bgImage.height))
    const scoreOffset = 100
    const scorePosY = (height / 2) + scoreOffset // position just above the 'Game Over' text
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
    this.printScore();
    this.printUsersInfo();
    // text game over on the center of the screen
    const gameOverText = this.add.text(width / 2, height / 2, 'Bye', {
      fontFamily: 'Arial',
      fontSize: 36,
    })
    gameOverText.setOrigin(0.5, 0.5)
  }

  update() {}

  printScore() {
    const score = this.gameMonitor.getScore()
    const digits1 = score.player1.toString().split('')
    const digits2 = score.player2.toString().split('')
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
    const players = Array.from(this.gameMonitor.getPlayers().values())
    let player1: NetworkUser | undefined = undefined;
    let player2: NetworkUser | undefined = undefined;
    if (players.length !== 2){
      player1= players[0];
    } else {
      const ids = [players[0].userId ?? 0, players[1].userId ?? 0]
      player1 = this.gameMonitor.hostId === ids[0] ? players[0] : players[1];
      player2 = this.gameMonitor.hostId === ids[0] ? players[1] : players[0];
    }
    const isPlayer1Winner = this.gameMonitor.getScore().player1 > this.gameMonitor.getScore().player2;
    this.printUserNameAndScore(player1, isPlayer1Winner, 0);
    this.printUserNameAndScore(player2, !isPlayer1Winner, 1);
  }
  printUserNameAndScore(player: NetworkUser|undefined, isWinner: boolean, i: number = 0) {
    const positions = [
      {x: this.scale.width / 2 - 65, y: (this.scale.height / 2) + 140},
      {x: this.scale.width / 2 + 65, y: (this.scale.height / 2) + 140},
    ]
    if (player) {
        const text = this.add.text(positions[i].x, positions[i].y,`${player.username}`, {
            fontFamily: 'Arial',
            fontSize: 36,
            color: isWinner ? '#00ff00' : '#ff0000'
        })
        text.setOrigin(0.5, 0.5)
    }else{
        const text = this.add.text(positions[i].x, positions[i].y,`Ai Bot`, {
            fontFamily: 'Arial',
            fontSize: 36,
            color: isWinner ? '#00ff00' : '#ff0000'
        })
        text.setOrigin(0.5, 0.5)
    }
  }
}
