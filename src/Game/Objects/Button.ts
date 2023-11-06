import { Scene, GameObjects } from 'phaser'

export default class Button extends GameObjects.Container {
  private readonly textLabel!: GameObjects.Text
  private readonly btnBg!: GameObjects.Image
  private btnActive: boolean = true

  constructor(
    public scene: Scene,
    position: { x: number; y: number },
    public interactiveArea: { x: number; y: number; width: number; height: number },
    public key: string,
    public text: string,
    public onClick: () => void
  ) {
    super(scene, position.x, position.y)
    this.setInteractive(
      new Phaser.Geom.Rectangle(
        interactiveArea.x,
        interactiveArea.y,
        interactiveArea.width,
        interactiveArea.height
      ),
      Phaser.Geom.Rectangle.Contains
    )
    this.btnBg = this.scene.add.image(0, 0, key)
    this.add(this.btnBg)
    this.textLabel = this.scene.add.text(0, 0, text, {})
    this.textLabel.setOrigin(0.5, 0.5)
    this.textLabel.setStyle({
      align: 'center',
      fontSize: '24px',
      fontStyle: 'bold',
      stroke: '#ae1616ff',
      strokeThickness: 1,
      'shadow.stroke': true
    })
    this.add(this.textLabel)
    this.on('pointerdown', () => {
      if (this.btnActive) this.onClick()
    })
    this.on('pointerover', () => {
      // make the button a little darker and rotate it a little on hover
      this.btnBg.setTint(0x888888)
      this.btnBg.angle -= 2
    })
    this.on('pointerout', () => {
      this.btnBg.clearTint()
      this.btnBg.angle += 2
    })
    this.scene.add.existing(this)
  }

  get textLabelText() {
    return this.textLabel.text
  }
  set textLabelText(text: string) {
    this.textLabel.text = text
  }
  get textLabelStyle() {
    return this.textLabel.style
  }
  set textLabelStyle(style: NonNullable<unknown>) {
    this.textLabel.setStyle(style)
  }

  // when active onclick is called when clicked
  get btnActiveStatus() {
    return this.btnActive
  }
  set btnActiveStatus(status: boolean) {
    this.btnActive = status
    if (!status) {
      this.btnBg.setTint(0x000000)
      this.setActive(false)
      this.disableInteractive()
    } else {
      this.btnBg.clearTint()
      this.setActive(true)
      this.setInteractive(
        new Phaser.Geom.Rectangle(
          this.interactiveArea.x,
          this.interactiveArea.y,
          this.interactiveArea.width,
          this.interactiveArea.height
        ),
        Phaser.Geom.Rectangle.Contains
      )
    }
  }
}
