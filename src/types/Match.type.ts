import type {Player} from './Player.type.ts';

export type Match = {
    id: string,
    scoreA: number,
    scoreB: number,
    createdAt: string,
    player1A: Player,
    player2A?: Player,
    player1B: Player,
    player2B?: Player
}