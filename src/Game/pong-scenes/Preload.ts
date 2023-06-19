import {GameNetwork, GameUserType} from "@/Game/network/GameNetwork";
import type { GameUser } from "@/Game/network/GameNetwork";
import type { GameMonitor, GameReceiver } from "@/Game/network/GameMonitor";
import {PongBackGround} from "@/Game/pong-scenes/Assets";
import PongGame from "@/Game/pong-scenes/PongGame";

export interface PreloadSceneData {
    room: string;
    isOnline: boolean;
    gameNetwork: GameNetwork;
    gameMonitor: GameMonitor;
    gameReceiver: GameReceiver;
    user: GameUser;
    userType: GameUserType;
    theme?: string;
}

export default class PreloadPong extends Phaser.Scene {
    userType: GameUserType = GameUserType.Viewer;
    private isConnected: boolean = false;
    private isLocalGame: boolean = true;
    private players: GameUser[] = [];
    private gameNetwork: GameNetwork | undefined;
    private gameMonitor: GameMonitor | undefined;
    private readyToPlay: boolean = false;

    constructor() {
        super('preloader');
    }

    init(data: PreloadSceneData) {
        this.userType = data.userType;
        this.gameNetwork = data.gameNetwork;
        this.gameMonitor = data.gameMonitor;

        if (data.isOnline) {
            this.isLocalGame = false;
        } else {
            this.players = [
                { userId: 0, avatar: '/pong/bot.png', username: 'Bot1' },
                {...data.user}
            ]
        }
        //console.log(data);
    }

    ConnectionHandler(worked: boolean) {
        this.isConnected = true;
    }

    updateUsers() {
        if (this.gameNetwork) {
            this.gameNetwork.updatePlayersList();
            this.gameNetwork.updateViewerList();
        }
    }

    preload() {
        // preload all the asset;
        this.load.image(PongBackGround.Arcade, '/pong/backgrounds/arcade_bg_ia-min.png')
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const bgImage = this.add.image(0,0, PongBackGround.Arcade);
        bgImage.setOrigin(0.5, 0.5);
        bgImage.setPosition(width / 2, height / 2);
        bgImage.setScale(Math.min(width / bgImage.width, height / bgImage.height));

        const gameNameText = this.add.text(30, (height - 50),'Loading...', {
            fill: '#fff',
            fontSize: '24px'
        })

        const playerGroup = this.add.group();
        const paddle = playerGroup.create(0, 0, 'paddle');
        paddle.setOrigin(0.5, 0.5);

        const ball = this.add.
    }

    update() {
        // check if local game
        // if online check 2 users are in gameNetwork
        // for each user detected make a sound
    }
}
