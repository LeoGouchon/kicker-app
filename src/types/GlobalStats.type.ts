export type GlobalStats = {
    playerId: string;
    firstname: string;
    lastname: string;
    wins: number;
    losses: number;
    winRate: number;
    totalMatches: number;
    lastMatches: boolean[];
    currentElo: number | null;
    rank: number;
    rankLastWeek: number | null;
    eloLastWeek: number | null;
};
