import {GAME_RESULT, GAME_STATE, PAD_DIRECTION} from "@/Game/network/GameMonitor";

export class OnlineAdversary {
    // Game Monitors function

    // Implement the GameReceiver methods:
    onPadMoved(dir: PAD_DIRECTION) {
        // respond to pad movement
    }

    onBallServed(position: {x: number, y: number}, velocity: {x: number, y: number}) {
        // respond to ball being served
    }

    onGameStateChanged(state: GAME_STATE) {
        // respond to game state change
    }

    onScoreChanged(score: {player1: number, player2: number}) {
        // respond to score change
    }

    onGameResult(result: GAME_RESULT) {
        // respond to game result
    }
}