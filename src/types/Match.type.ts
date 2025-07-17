import type {Player} from "./Player.type.ts";

export type Match = {
    id: string,
    finalScoreA: number,
    finalScoreB: number,
    createAt: string,
    finished: boolean,
    player1TeamA: Player,
    player2TeamA?: Player,
    player1TeamB: Player,
    player2TeamB?: Player
}