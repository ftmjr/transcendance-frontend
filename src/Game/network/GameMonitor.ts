import type {GameNetwork} from "@/Game/network/GameNetwork";

export enum PAD_DIRECTION {
    up,
    down,
    none,
}

export enum GAME_STATE {
    waiting,
    ballServing,
    playing,
    finished,
    scored,
}

export enum GAME_RESULT {
    victory,
    defeat,
    draw,
}

export interface GameMove {
    padDirection: PAD_DIRECTION;
    ball?: {
        x: number;
        y: number;
        velocityX: number;
        velocityY: number;
    }
    state: GAME_STATE;
}

export interface GameState {
    gameState: GAME_STATE;
    paddle1: PAD_DIRECTION;
    paddle2: PAD_DIRECTION;
    ball?: {
        x: number;
        y: number;
        velocityX: number;
        velocityY: number;
    }
    result?: GAME_RESULT;
    score: {
        player1: number;
        player2: number;
    };
}

export interface GameReceiver {
    onPadMoved: (dir: PAD_DIRECTION) => void;
    onBallServed: (position: {x: number, y: number}, velocity: {x: number, y: number}) => void;
    onGameStateChanged: (state: GAME_STATE) => void;
    onScoreChanged: (score: {player1: number, player2: number}) => void;
    onGameResult: (result: GAME_RESULT) => void;
}

export class GameMonitor {
    private score =  {
        player1:  0,
        player2: 0,
    }
    constructor(
        private gameNetwork: GameNetwork,
        private gameReceiver: GameReceiver,
    ) {
        if (this.gameNetwork.operational){
            this.listen();
        }
    }

    // Listen for game updates
    listen() {
        this.gameNetwork.socket?.on('padMoved', this.gameReceiver.onPadMoved);
        this.gameNetwork.socket?.on('ballServed', this.gameReceiver.onBallServed);
        this.gameNetwork.socket?.on('gameStateChanged', this.gameReceiver.onGameStateChanged);
        this.gameNetwork.socket?.on('scoreChanged', (state:{ player1: number; player2: number; })=> {
            this.score = state;
            this.gameReceiver.onScoreChanged(this.score);
        });
        this.gameNetwork.socket?.on('gameResult', this.gameReceiver.onGameResult);
    }

    getScore(): {player1: number, player2: number} {
        return this.score;
    }

    movedPad(dir: PAD_DIRECTION) {
        const state = {
            gameState: GAME_STATE.playing,
            paddle1: this.gameNetwork.isHostPlayer ? dir : PAD_DIRECTION.none,
            paddle2: this.gameNetwork.isHostPlayer ? PAD_DIRECTION.none : dir,
            score: this.score,
        }
        this.gameNetwork.sendGameMove(state);
    }

    // ball serve after a point or at the start of the game
    serveBall(position: {x: number, y: number}, velocity: {x: number, y: number}) {
        const state = {
            gameState: GAME_STATE.ballServing,
            paddle1: PAD_DIRECTION.none,
            paddle2: PAD_DIRECTION.none,
            ball: {
                x: position.x,
                y: position.y,
                velocityX: velocity.x,
                velocityY: velocity.y,
            },
            score: this.score,
        }
        this.gameNetwork.sendGameMove(state);
    }

    // score a point
    scorePoint(position: {x: number, y: number}, velocity: {x: number, y: number}) {
        const state = {
            gameState: GAME_STATE.scored,
            paddle1: PAD_DIRECTION.none,
            paddle2: PAD_DIRECTION.none,
            ball: {
                x: position.x,
                y: position.y,
                velocityX: velocity.x,
                velocityY: velocity.y,
            },
            score: this.score,
        }
        this.gameNetwork.sendGameMove(state);
    }

    // end the game
    endGame(result: GAME_RESULT) {
        const state = {
            gameState: GAME_STATE.finished,
            paddle1: PAD_DIRECTION.none,
            paddle2: PAD_DIRECTION.none,
            ball: undefined,
            result: result,
            score: this.score,
        }
        this.gameNetwork.sendGameMove(state);
    }

    handleDraw() {
        this.endGame(GAME_RESULT.draw);
        this.gameNetwork.sendDrawSignal();
    }

    // Call this when the player wins
    handleVictory() {
        this.endGame(GAME_RESULT.victory);
        this.gameNetwork.sendVictorySignal();
    }

    // Call this when the player loses
    handleDefeat() {
        this.endGame(GAME_RESULT.defeat);
        this.gameNetwork.sendDefeatSignal();
    }
}