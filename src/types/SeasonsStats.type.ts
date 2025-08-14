export type SeasonsStats = {
    nbSeasons: number;
    totalMatches: number;
    totalPlayers: number;
    seasonsStats: SeasonStats[];
};

export type SeasonStats = {
    year: number;
    quarter: number;
    nbMatches: number;
    nbPlayers: number;
};
