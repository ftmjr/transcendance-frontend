import { io } from "socket.io-client";
import type {Game} from "phaser";
import type {GameState} from "@/Game/network/GameMonitor";

export enum GameUserType {
    Player  ,
    Viewer  ,
    IA
}

export interface GameUser {
    userId: number,
    username: string,
    avatar?: string,
}

export class GameNetwork {
    public socket;
    private adversaryReady :boolean = false;
    public operational: boolean = false;
    public isHostPlayer: boolean = false;
    public players: GameUser[] = [];
    public viewers: GameUser[] = [];

    constructor(
        private room:string,
        public user:GameUser,
        private userType:GameUserType,
        connectedHandler: (worked: boolean) => void
    ) {
        try {
            this.socket = io('/game', {path: '/socket.io'});
            switch (userType) {
                case GameUserType.Viewer:
                    this.socket.emit('viewGame', { room, user, userType }, connectedHandler);
                    break;
                case GameUserType.Player:
                default:
                    this.socket.emit('joinGame', { room, user, userType }, connectedHandler);
            }
            this.operational = true;
            this.updatePlayersList();
            this.updateViewerList();
            this.listenAdversary();
        }catch (e) {
            console.error(e)
        }
    }

    updatePlayersList(){
        this.socket?.emit('getPlayers', { room: this.room }, (users:GameUser[], isHost?:boolean)=> {
            this.players = users;
            if (isHost){
                this.isHostPlayer = true;
            }
        })
    }

    updateViewerList(){
        this.socket?.emit('getViewers', { room: this.room }, (users:GameUser[])=>{
            this.viewers = users;
        })
    }

    checkIfAdversaryIsReady() {
        return this.adversaryReady;
    }

    sendReadySignal() {
        this.socket?.emit('ready', { room: this.room, username: this.user, userType: this.userType });
    }

    sendViewingSignal() {
        this.socket?.emit('viewing', { room: this.room, username: this.user, userType: this.userType });
    }

    sendVictorySignal() {
        this.socket?.emit('victory', { room: this.room, username: this.user, userType: this.userType });
    }

    sendDefeatSignal() {
        this.socket?.emit('defeat', { room: this.room, username: this.user, userType: this.userType });
    }

    sendDrawSignal() {
        this.socket?.emit('draw', { room: this.room, username: this.user, userType: this.userType });
    }

    listenAdversary() {
        this.socket?.on('adversaryReady', () => {
            this.adversaryReady = true;
        });
    }

    sendGameMove(move: GameState): boolean {
        if (!this.operational){
            throw 'Server not operational';
        }
        if (this.userType !== GameUserType.Player){
            throw 'ONly players can send move';
        }
        if (!this.adversaryReady){
            return false;
        }
        this.socket?.emit('gameMove', {
            ...this.user,
            ...move,
        } as GameState);
        return true;
    }

    disconnect(){
        this.socket?.disconnect()
        this.operational = false;
    }
}