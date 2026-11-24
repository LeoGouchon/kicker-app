type RankEvolutionInput = {
    rank: number;
    rankLastWeek: number | null;
    eloLastWeek: number | null;
};

// Positive = the player climbed. 'new' = just reached the ranking. null = back from inactivity.
export const getRankEvolution = ({ rank, rankLastWeek, eloLastWeek }: RankEvolutionInput): number | 'new' | null => {
    if (rankLastWeek !== null) return rankLastWeek - rank;

    return eloLastWeek === null ? 'new' : null;
};

export const getUnrankedTag = ({ currentElo }: { currentElo: number | null }): 'new' | 'inactive' =>
    currentElo === null ? 'new' : 'inactive';

// Table sorter: null counts as the smallest value
export const compareNullableNumbers = (a: number | null, b: number | null): number => {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;

    return a - b;
};
