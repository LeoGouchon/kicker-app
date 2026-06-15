export type EloHistory = {
    date: string;
    elo: number;
    max: number;
    min: number;
    firstQuartile: number;
    thirdQuartile: number;
};

export type PlayerStats = {
    id: string;
    firstname: string;
    lastname: string;
    statsPerPartner: {
        id: string;
        firstname: string;
        lastname: string;
        wins: number;
        loses: number;
    }[];
    statsPerOpponent: {
        id: string;
        firstname: string;
        lastname: string;
        wins: number;
        loses: number;
    }[];
    seasonalStats: {
        year: number;
        quarter: number;
        rank: number;
        wins: number;
        losses: number;
        eloHistory: EloHistory[];
    }[];
    allTimeStats: {
        wins: number;
        losses: number;
        rank: number;
        eloHistory: EloHistory[];
    };
};
