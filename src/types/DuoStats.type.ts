import type { Player } from './Player.type.ts';

export type DuoStats = {
    player1: Player;
    player2: Player;
    matches: number;
    wins: number;
    losses: number;
    eloGainTotal: number;
    player1EloAvg: number;
    player2EloAvg: number;
    opponentEloAvg: number;
    eloGainAvg: number;
    eloGainMax: number;
    eloGainMin: number;
};
