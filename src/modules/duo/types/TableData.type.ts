import type { Player } from '../../../types/Player.type.ts';

export type RankedMetric = {
    rank: number;
    value: number;
};

export type TableData = {
    key: string;
    player1: Player;
    player2: Player;
    matches: RankedMetric;
    winRate: RankedMetric;
    eloGainAvg: RankedMetric;
    eloGainTotal: RankedMetric;
    biggestAdvantage: RankedMetric;
    biggestWin: RankedMetric;
    performanceVsExpected: RankedMetric;
};
