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
        eloHistory: {
            date: string;
            elo: number;
        }[];
    }[];
    allTimeStats: {
        wins: number;
        losses: number;
        rank: number;
        eloHistory: {
            date: string;
            elo: number;
        }[];
    };
};
