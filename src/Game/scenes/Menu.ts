import { GameObjects, Scene } from 'phaser'
import { SceneInitData, Theme } from '@/Game/scenes/Boot'
import Button from '@/Game/Objects/Button'
import Monitor, { GAME_STATE } from '@/Game/network/Monitor'
import { GameUser } from '@/Game/network/GameNetwork'

class HomeBtn extends GameObjects.Image {
  private readonly namedKeys = {
    homeInactive: 'Btn_Home',
    homeActive: 'Btn_Home_Active'
  }
  private isHomePage = true
  constructor(
    public scene: Menu,
    x: number,
    y: number,
    public onClickCallBack: () => void
  ) {
    super(scene, x, y, 'Btn_Home_Active')
    this.setInteractive(
      new Phaser.Geom.Rectangle(25, 10, 95.3076719479974, 91.4272822913519),
      Phaser.Geom.Rectangle.Contains
    )
    this.on('pointerdown', () => {
      this.onClickCallBack()
    })
    this.on('pointerover', () => {
      const inverseKey = this.isHomePage ? this.namedKeys.homeInactive : this.namedKeys.homeActive
      this.flipX = true
      this.setTexture(inverseKey)
    })
    this.on('pointerout', () => {
      const inverseKey = this.isHomePage ? this.namedKeys.homeActive : this.namedKeys.homeInactive
      this.flipX = false
      this.setTexture(inverseKey)
    })
  }

  get isHomePageStatus(): boolean {
    return this.isHomePage
  }
  set isHomePageStatus(status: boolean) {
    this.isHomePage = status
    const key = status ? this.namedKeys.homeActive : this.namedKeys.homeInactive
    this.setTexture(key)
  }
}

enum MenuSection {
  Home,
  Instructions,
  Settings,
  Credits
}

class MenuSectionBox extends GameObjects.Container {
  private visibleSection: boolean = false

  constructor(
    public sectionType: MenuSection,
    public scene: Menu,
    position: { x: number; y: number }
  ) {
    super(scene, position.x, position.y)
    this.setVisible(false)
    this.setActive(false)
  }

  get isVisible() {
    return this.visibleSection
  }
  set isVisible(status: boolean) {
    this.visibleSection = status
    this.setVisible(status)
    this.setActive(status)
  }
}

export default class Menu extends Scene {
  sceneData!: SceneInitData
  private panelBox!: GameObjects.Container
  private startButton!: Button
  private infoButton!: Button
  private quitButton!: Button
  private boardText!: GameObjects.Text
  private btnHome!: HomeBtn
  private menuSection: MenuSection = MenuSection.Home
  private sections: MenuSectionBox[] = []
  private playerOneText!: GameObjects.Text
  private playerTwoText!: GameObjects.Text
  private statusNetworkText!: GameObjects.Text
  private monitor!: Monitor

  constructor() {
    super({
      key: 'Menu'
    })
  }

  preload() {}

  init(data: SceneInitData) {
    this.sceneData = data
    this.monitor = data.gameMonitor
    this.monitor.cleanAllPhaserRoutines()
  }

  create() {
    this.createBackgroundLayer()
    this.btnHome = new HomeBtn(this, 150, 640, () => {
      if (this.menuSection !== MenuSection.Home) {
        this.showHome()
      } else {
      }
    })
    this.add.existing(this.btnHome)
    this.createPanelBox()
    this.createHomeBox()
    this.createInstructionsBox()
    this.updateSection()
    this.printPlayerList(this.monitor.players)
    this.printNetworkText(this.monitor.state)
    this.monitor._phaserGameMonitorStateChangedRoutine = (state: GAME_STATE) => {
      this.printNetworkText(state)
      switch (state) {
        case GAME_STATE.Play:
          this.scene.start('PongScene', this.sceneData)
          break
        case GAME_STATE.Ended:
          this.gameEndedUiUpdate()
          break
      }
    }
    this.monitor._phaserNewPlayerListRoutine = (users: GameUser[]) => {
      this.printPlayerList(users)
    }
    this.monitor._phaserPlayerLeftRoutine = (player: GameUser) => {
      this.gameEndedUiUpdate()
      this.statusNetworkText.text = `${player.username} left`
    }
    if (this.monitor.state === GAME_STATE.Play || this.monitor.state === GAME_STATE.Pause) {
      this.scene.start('PongScene', this.sceneData)
    }
    if (this.monitor.state === GAME_STATE.Ended) {
      this.gameEndedUiUpdate()
    }
  }

  update(time: number, delta: number) {
    // activate the correct section and deactivate the others
  }
  updateSection() {
    this.sections.forEach((section) => {
      section.isVisible = section.sectionType === this.menuSection
    })
    if (this.menuSection !== MenuSection.Home) {
      this.panelBox.setVisible(false)
    } else {
      this.panelBox.setVisible(true)
    }
  }

  // creation of the background layer
  createBackgroundLayer() {
    const layer = this.add.layer()
    const keys = {
      background: 'Background',
      barTop: 'BarTopBlue',
      barDown: 'BarDownBlue',
      sideBar: 'SideBarBlue'
    }
    switch (this.sceneData.theme) {
      case Theme.Soccer:
        keys.barTop = 'BarTopBrown'
        keys.barDown = 'BarDownBrown'
        keys.sideBar = 'SideBarBrown'
        break
      case Theme.Arcade:
        keys.barTop = 'BarTopPink'
        keys.barDown = 'BarDownPink'
        keys.sideBar = 'SideBarPink'
        break
    }
    const bg = this.add.image(667, 375, keys.background)
    const barTop = this.add.image(1334, 0, keys.barTop)
    // set barTap to match the screen width with scale
    const width = this.game.scale.width
    const scaleTop = width / barTop.width
    barTop.setScale(scaleTop, 1)
    barTop.setOrigin(1, 0)
    const barDown = this.add.image(0, 750, keys.barDown)
    const scaleDown = width / barDown.width
    barDown.setScale(scaleDown, 1)
    barDown.setOrigin(0, 1)
    const sideBar = this.add.image(43, 375, keys.sideBar)
    layer.add(bg)
    layer.add(barTop)
    layer.add(barDown)
    layer.add(sideBar)
  }

  createPanelBox() {
    const panelBox = this.add.container(776, 108)
    const bgPanelBox = this.add.image(0, 0, 'BgPanelBox2')
    bgPanelBox.setOrigin(0, 0)
    panelBox.add(bgPanelBox)
    const boardText = this.add.text(180, 24, '', {})
    boardText.setOrigin(0.5, 0.5)
    boardText.text = this.monitor.isAgainstIA() ? 'IA fight' : 'Challenge'
    boardText.setStyle({ align: 'center', fontFamily: 'Mono', fontSize: '18px', fontStyle: 'bold' })
    panelBox.add(boardText)
    this.boardText = boardText
    const startBtn = new Button(
      this,
      { x: 180, y: 150 },
      { x: -110, y: -40, width: 221, height: 80 },
      'B5',
      'START GAME',
      () => {
        this.startGame()
      }
    )
    panelBox.add(startBtn)
    this.startButton = startBtn
    const infoBtn = new Button(
      this,
      { x: 180, y: 250 },
      { x: -110, y: -40, width: 221, height: 80 },
      'B15',
      'INSTRUCTIONS',
      () => {
        this.showInstructions()
      }
    )
    panelBox.add(infoBtn)
    this.infoButton = infoBtn
    const quitBtn = new Button(
      this,
      { x: 180, y: 350 },
      { x: -110, y: -40, width: 221, height: 80 },
      'B15',
      'QUIT',
      () => {
        this.quitGame()
      }
    )
    panelBox.add(quitBtn)
    this.quitButton = quitBtn
    this.panelBox = panelBox
  }

  createHomeBox() {
    const homeBox = new MenuSectionBox(MenuSection.Home, this, { x: 362, y: 407 })
    const heroLander = this.add.image(0, 1, 'HeroLander')
    heroLander.setOrigin(0.5, 0)
    homeBox.add(heroLander)
    const blueLight = this.add.image(0, 0, 'BlueLight')
    blueLight.setOrigin(0.5, 1)
    homeBox.add(blueLight)
    this.playerOneText = this.add.text(0, -250, '', {})
    this.playerOneText.setOrigin(0.5, 0.5)
    this.playerOneText.text = 'Player 1'
    this.playerOneText.setStyle({ align: 'center', fontFamily: 'Arial', fontSize: '18px' })
    homeBox.add(this.playerOneText)
    this.statusNetworkText = this.add.text(-37, 70, '', {})
    this.statusNetworkText.setOrigin(0.5, 0.5)
    this.statusNetworkText.text = 'Waiting for network'
    this.statusNetworkText.setStyle({
      align: 'center',
      color: '#6fb4f2ff',
      fontFamily: 'Mono',
      fontSize: '14px'
    })
    homeBox.add(this.statusNetworkText)
    this.playerTwoText = this.add.text(1, -188, '', {})
    this.playerTwoText.setOrigin(0.5, 0.5)
    this.playerTwoText.text = 'Player 2'
    this.playerTwoText.setStyle({ align: 'center', fontFamily: 'Arial', fontSize: '18px' })
    homeBox.add(this.playerTwoText)
    this.add.existing(homeBox)
    this.sections.push(homeBox)
  }

  createInstructionsBox() {
    const instructionsBox = new MenuSectionBox(MenuSection.Instructions, this, { x: 667, y: 375 })
    // add bg image
    const bgInstructions = this.add.image(0, 0, 'BgInstructionBox')
    bgInstructions.setOrigin(0.5, 0.5)
    instructionsBox.add(bgInstructions)
    // add text
    const instructionsTitleText = this.add.text(0, -200, '', {})
    instructionsTitleText.setOrigin(0.5, 0.5)
    instructionsTitleText.text = 'Instructions'
    instructionsTitleText.setStyle({
      align: 'center',
      fontFamily: 'Arial',
      fontSize: '30px',
      fontStyle: 'bold'
    })
    instructionsBox.add(instructionsTitleText)
    const instructionsText = this.add.text(
      0,
      -50,
      '[-] The goal of the game is to score more points than your opponent.\n' +
        '[-] The game is played with two players, each controlling a paddle.\n' +
        '[-] The ball is served with a random speed.\n' +
        '[-] The ball will bounce off the walls and the paddles.\n' +
        '[-] To move the paddle, use the arrow keys.\n',
      {
        fontFamily: 'Courier',
        fontSize: '20px',
        wordWrap: { width: 600 }
      }
    )
    instructionsText.setOrigin(0.5, 0.5)
    instructionsBox.add(instructionsText)
    this.add.existing(instructionsBox)
    this.sections.push(instructionsBox)
  }

  createSettingsBox() {
    // const settingsBox = new MenuSectionBox(
    //   MenuSection.Settings,
    //   this,
    //   { x: 667, y: 375 }
    // );
    // // add bg image
    // const bgSettings = this.add.image(0, 0, "BgInstructionBox");
    // this.add.existing(settingsBox);
    // this.sections.push(settingsBox);
  }

  startGame() {
    this.monitor.sendGameState(GAME_STATE.Ready)
  }

  async quitGame() {
    await this.monitor.quitAndMoveToHistory()
  }

  showSettings() {
    this.btnHome.isHomePageStatus = false
    this.menuSection = MenuSection.Settings
    this.updateSection()
  }

  showInstructions() {
    this.btnHome.isHomePageStatus = false
    this.menuSection = MenuSection.Instructions
    this.updateSection()
  }

  printPlayerList(playerList: GameUser[]) {
    if (playerList[0]) {
      this.playerOneText.text = playerList[0].username
    }
    if (playerList[1]) {
      this.playerTwoText.text = playerList[1].username
    }
  }

  printNetworkText(state: GAME_STATE) {
    switch (state) {
      case GAME_STATE.Waiting:
        this.statusNetworkText.text = 'Game Init mode'
        break
      case GAME_STATE.Menu:
        this.statusNetworkText.text = 'Waiting opponent'
        break
      case GAME_STATE.Ready:
        this.statusNetworkText.text = 'Ready to play'
        break
      case GAME_STATE.Play:
        this.statusNetworkText.text = 'Playing'
        break
      case GAME_STATE.Ended:
        this.statusNetworkText.text = 'Game ended'
        break
    }
  }

  gameEndedUiUpdate() {
    this.boardText.text = 'Game ended'
    if (this.monitor.scores) {
      // print score of the players
      const player1Score = this.monitor.getPlayer1Score()
      const player2Score = this.monitor.getPlayer2Score()
      if (player1Score && player2Score) {
        this.playerOneText.text = `${this.monitor.players[0].username} : ${player1Score}`
        this.playerTwoText.text = `${this.monitor.players[1].username} : ${player2Score}`
      }
      // color them according the winner
      if (player1Score > player2Score) {
        this.playerOneText.setStyle({ color: '#00ff00' })
        this.playerTwoText.setStyle({ color: '#ff0000' })
      } else if (player1Score < player2Score) {
        this.playerOneText.setStyle({ color: '#ff0000' })
        this.playerTwoText.setStyle({ color: '#00ff00' })
      } else {
        this.playerOneText.setStyle({ color: '#ffffff' })
        this.playerTwoText.setStyle({ color: '#ffffff' })
      }
    }
    this.startButton.btnActiveStatus = false
  }

  showHome() {
    this.btnHome.isHomePageStatus = true
    this.menuSection = MenuSection.Home
    this.updateSection()
  }
}
