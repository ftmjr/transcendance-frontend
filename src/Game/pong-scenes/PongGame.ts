import Phaser from 'phaser';
import type { GameReceiver, GAME_RESULT, GAME_STATE, PAD_DIRECTION } from "@/Game/network/GameMonitor";
import type { GameMonitor } from "@/Game/network/GameMonitor";

export default class PongGame extends Phaser.Scene {

  private gameMonitor:GameMonitor|undefined = undefined
  constructor() {
    super('Game-Game');
  }

  init(data: any) {
    console.log('init', data);
    this.gameMonitor = data.gameMonitor;
  }

  preload() {
    this.load.image('ball', 'pong/ball.png');
    this.load.image('paddle', 'pong/paddle.png');
  }

  create() {
    const ball = this.physics.add.image(200, 150, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    ball.setVelocity(200, 200);

    const paddle1 = this.physics.add.image(20, 225, 'paddle');
    paddle1.setCollideWorldBounds(true);
    paddle1.setBounce(0, 1);
    paddle1.setVelocity(0, 20);

    const paddle2 = this.physics.add.image(380, 225, 'paddle');
    paddle2.setCollideWorldBounds(true);
    paddle2.setBounce(0, 1);
    paddle2.setVelocity(0, 20);


    // paddles should be able to move up and down but not left and right
    // paddle1.setImmovable(true);
    // paddle2.setImmovable(true);
    this.physics.add.collider(ball, paddle1);
    this.physics.add.collider(ball, paddle2);

  }

  update() {
  }
}