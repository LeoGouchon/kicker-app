import type { Player, PlayerMatchContext } from './Player.type.ts';

export type Match = {
    id: string;
    scoreA: number;
    scoreB: number;
    createdAt: string;
    player1A: Player & PlayerMatchContext;
    player2A?: Player & PlayerMatchContext;
    player1B: Player & PlayerMatchContext;
    player2B?: Player & PlayerMatchContext;
    deltaElo?: number;
    deltaEloSeasonal?: number;
    winChanceTeamA: number;
    winChanceTeamB: number;
    eloWinTeamA: number;
    eloWinTeamB: number;
};
